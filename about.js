// Update profile dropdown based on role
const updateProfileMenu = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const profileImg = document.getElementById("profile-img");
    const profileDropdown = document.getElementById("profile-dropdown");
    const profileDropdownMenu = document.getElementById("profile-dropdown-menu");
    // console.log(token, role)
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
  

const LoadBlogPost=()=>{
  fetch("https://find-job-v4mq.onrender.com/jobs/blog/")
  .then((res)=>res.json())
  .then((data)=>{
    DisplayBlogPost(data)
  })
  .catch(error => console.error("Error fetching blogs:", error));
}
LoadBlogPost()

const DisplayBlogPost=(data)=>{
  const BlogContainer = document.getElementById("blog-container")
  BlogContainer.innerHTML = ""
  data.forEach((blog)=>{
    BlogContainer.innerHTML += `
              <div class="blog-card">
                  <img src="${blog.image}" alt="Blog Image">
                  <div class="blog-content">
                      <h3 class="blog-title">${blog.title}</h3>
                      <p class="blog-desc">${blog.content.substring(0, 100)}...</p>
                    <button class="read-more" 
                      onclick="openBlogModal('${blog.image}', '${blog.title}', '${blog.content.replace(/'/g, "\\'")}')">
                      Read More
                    </button>

                  </div>
              </div>
          `;
  })

}

const openBlogModal = (image, title, content) => {
  // console.log("Modal Open Triggered!"); // Debugging Purpose

  document.getElementById("blogModalImage").src = image;
  document.getElementById("blogModalTitle").innerText = title;
  document.getElementById("blogModalContent").innerText = content;

  // Bootstrap modal show
  const blogModal = new bootstrap.Modal(document.getElementById("blogModal"));
  blogModal.show();
};


document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
      const target = +counter.getAttribute("data-target");
      let current = 0;
      const increment = Math.ceil(target / 100);

      const updateCounter = () => {
          if (current < target) {
              current += increment;
              counter.innerText = current > target ? target : current;
              setTimeout(updateCounter, 59);
          } else {
              counter.innerText = target;
          }
      };

      updateCounter();
  };

  counters.forEach(counter => {
      animateCounter(counter);
  });
});
