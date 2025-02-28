const loadCandidants = (page = 1) => {
    fetch(`https://find-job-v4mq.onrender.com/jobseeker/list/?page=${page}`)
        .then((res) => res.json())
        .then((data) => {
            displayCandidantes(data.results);
            setupPagination(data);
            console.log(data)
        })
        .catch((error) => console.error("Error loading candidates:", error));
};

const displayCandidantes = (candidantes) => {
    console.log(candidantes)
    const parent = document.getElementById("cadidantes-item");
    parent.innerHTML = ""; // Clear previous candidates before appending new ones

    candidantes.forEach((cadidante) => {
        console.log(cadidante);
        const child = document.createElement("div");
        child.classList.add("candidate-card");
        child.innerHTML = `
            <div class="image">
                <img src="${cadidante.profile_image}" alt="Candidate Image">
            </div>
            <div class="name-title">
                <h4>${cadidante.user.first_name} ${cadidante.user.last_name}</h4>
                <p><strong>${cadidante.user.email}</strong></p>
            </div>
            <div class="location-mobile">
                <p>${cadidante.location}</p>
                <p>${cadidante.mobile_no}</p>
            </div>
            <div class="skills">
                <button class="skill-tag">${cadidante.skills}</button>
            </div>
        `;
        parent.appendChild(child);
    });
};

const setupPagination = (data) => {
    const parent = document.getElementById("pagination-container");
    parent.innerHTML = ""; // Clear previous pagination

    let currentPage = 1;
    if (data.previous) {
        let urlParams = new URL(data.previous);
        let prevPage = urlParams.searchParams.get("page");
        currentPage = prevPage ? parseInt(prevPage) + 1 : 2;
    } else if (data.next) {
        let urlParams = new URL(data.next);
        let nextPage = urlParams.searchParams.get("page");
        currentPage = nextPage ? parseInt(nextPage) - 1 : 1;
    }

    console.log("Current Page:", currentPage);
    let totalPages = Math.ceil(data.count / 3); // Adjust items per page if needed

    // "Previous" Button
    let prevBtn = document.createElement("li");
    prevBtn.className = `page-item ${data.previous ? "" : "disabled"}`;
    prevBtn.innerHTML = `<a class="page-link" href="#" onclick="loadCandidants(${currentPage - 1})">‹</a>`;
    parent.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            let pageItem = document.createElement("li");
            pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
            pageItem.innerHTML = `<a class="page-link" href="#" onclick="loadCandidants(${i})">${i}</a>`;
            parent.appendChild(pageItem);
        } else if (Math.abs(i - currentPage) === 2) {
            let dots = document.createElement("li");
            dots.className = "page-item disabled";
            dots.innerHTML = `<span class="page-link">...</span>`;
            parent.appendChild(dots);
        }
    }

    // "Next" Button
    let nextBtn = document.createElement("li");
    nextBtn.className = `page-item ${data.next ? "" : "disabled"}`;
    nextBtn.innerHTML = `<a class="page-link" href="#" onclick="loadCandidants(${currentPage + 1})">›</a>`;
    parent.appendChild(nextBtn);
};

// Load the first page initially
loadCandidants();




// Update profile dropdown based on role
const updateProfileMenu = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const profileImg = document.getElementById("profile-img");
    const profileDropdown = document.getElementById("profile-dropdown");
    const profileDropdownMenu = document.getElementById("profile-dropdown-menu");
    console.log(token, role)
    if (token && role) {
      profileDropdown.classList.remove("d-none");
      profileImg.src = `https://find-job-v4mq.onrender.com${
        localStorage.getItem("profile_image") || "default-profile.png"
      }`;
  
      // Update menu based on role
      if (role.toLowerCase() === "employee") {
        profileDropdownMenu.innerHTML = `
           <li>
              <a class="dropdown-item" href="dashboard.html">
                  <i class="fas fa-home me-2"></i>Dashboard
              </a>
              </li>
              <li>
              <a class="dropdown-item" href="job_post.html">
                  <i class="fas fa-briefcase me-2"></i>Post Job
              </a>
              </li>
              <li>
              <a class="dropdown-item" href="#" onclick="logout()">
                  <i class="fas fa-sign-out-alt me-2"></i>Logout
              </a>
              </li>
        `;
      } else if (role.toLowerCase() === "job_seeker") {
        profileDropdownMenu.innerHTML = `
          <li>
            <a class="dropdown-item" href="profile.html">
              <i class="fas fa-user me-2"></i>Profile
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" onclick="logout()">
              <i class="fas fa-sign-out-alt me-2"></i>Logout
            </a>
          </li>
        `;
      }
  
      document
        .querySelector(".login-button[href='sign_up.html']")
        .classList.add("d-none");
      document
        .querySelector(".login-button[href='login.html']")
        .classList.add("d-none");
    } else {
      profileDropdown.classList.add("d-none");
      document
        .querySelector(".login-button[href='sign_up.html']")
        .classList.remove("d-none");
      document
        .querySelector(".login-button[href='login.html']")
        .classList.remove("d-none");
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.clear();
    updateProfileMenu();
    window.location.href = "index.html"; // Redirect after logout
  };
  
  // Call updateProfileMenu when page loads
  updateProfileMenu();