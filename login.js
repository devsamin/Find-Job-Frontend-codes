const Handellogin = (event) => {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


     // Get error message elements
     const usernameError = document.getElementById("username-error");
     const passwordError = document.getElementById("password-error");
    // console.log(username, password)////
    if (username && password) {
      fetch("https://find-job-v4mq.onrender.com/user/login/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.error){
            usernameError.textContent=data.error
            usernameError.classList.remove("d-none");
          }
          // console.log(data)
          // console.log(data.token)
          // console.log(data.user_id)
          // console.log(data.role)
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", username);
            localStorage.setItem("jobseeker_id", data.job_seeker_id);
            localStorage.setItem(
              "profile_image",
              data.profile_image || "default-profile.png"
  
  
              
            );
            // console.log("Data saved in localStorage:");
            // console.log("Token:", localStorage.getItem("token"));
            // console.log("Role:", localStorage.getItem("role"));
            // console.log("Username:", localStorage.getItem("username"));
            Swal.fire({
              icon: "success",
              title: "Login Successful!",
              text: "Welcome back, " + username,
              confirmButtonText: "OK",
              width: "320px", // ✅ 
              padding: "10px", // ✅ 
              customClass: {
                popup: "small-swal-popup", // ✅ Custom styling
              },
            }).then(() => {
              updateProfileMenu();
              window.location.replace("index.html"); // ✅ OK চাপলে redirect হবে
            });
          } else {
            console.error("Login failed:", data.error);
            passwordError.textContent = "Something went wrong. Please try again!";
            passwordError.classList.remove("d-none");
          }
        });
    }
  };

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
          <li><a class="dropdown-item" href="#">Dashboard</a></li>
          <li><a class="dropdown-item" href="job_post.html">Post Job</a></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
        `;
      } else if (role.toLowerCase() === "job_seeker") {
        profileDropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="profile.html">Profile</a></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
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