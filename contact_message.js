const PostMessage = () =>{
    const form = document.getElementById("contact-form")
    form.addEventListener("submit", (e)=>{
        e.preventDefault()

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const requestData = {
            name: name,
            email: email,
            message: message
        };
        const token = localStorage.getItem("token")
        fetch('https://find-job-v4mq.onrender.com/contact/list/', {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res.json();
        })
        .then((data) => {
            alert("Message sent successfully! ✅");
            form.reset();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to send message. ❌ Please try again.");
        });
    })
}
// ✅ Call the function after the DOM loads
document.addEventListener("DOMContentLoaded", PostMessage);




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
            <a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a>
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
  