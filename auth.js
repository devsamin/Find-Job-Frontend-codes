const HandelRegister = (event) => {
  event.preventDefault();

  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const role = getValue("role");
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const profile_image = document.getElementById("profile_image").files[0]; // Get the selected file
  

  // console.log(role)
 

  const formData = new FormData();
  formData.append("username", username);
  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("email", email);
  formData.append("role", role);
  formData.append("password", password);
  formData.append("confirm_password", confirm_password);


  // console.log("Form Data:", { 
  //   username, 
  //   first_name, 
  //   last_name, 
  //   email, 
  //   role, 
  //   company_name, 
  //   company_description 
  // });

  // If there is an image file, append it to formData
  if (profile_image) {
    formData.append("profile_image", profile_image);
  }

  if (role === "Employee") {
    const company_name = document.getElementById("company_name").value;
    const company_description = document.getElementById("company_description").value;
    const logo = document.getElementById("company_logo").files[0];

    // console.log("line 47 : ",company_name)
    // console.log("line 48 : ", company_description)
    // console.log("line 49 : ", logo)


    console.log("line 39 : ",company_name)
    console.log("line 40 : ", company_description)
    formData.append("company_name", company_name);
    formData.append("company_description", company_description);
    if (logo) {
      console.log("line 44 : ", logo)
      formData.append("logo", logo);
    }
    console.log(company_name, company_description, logo)
  }

  // Validate password confirmation
  if (password !== confirm_password) {
    document.getElementById("error").innerText =
      "Password and confirm password do not match";
    return;
  }

  document.getElementById("error").innerText = "";

  // Validate password strength
  if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    )
  ) {
    document.getElementById("error").innerText =
      "Password must contain at least eight characters, one letter, one number, and one special character.";
    return;
  }
 // Clear previous error messages
 document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

  // Send registration request
  fetch("https://find-job-v4mq.onrender.com/user/register/", {
    method: "POST",
    headers: {
      // Authentication token if necessary, otherwise leave it out
      // "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })
  .then((response) => response.json())
  .then((data) => {
    // console.log(data)
    if (data.success) {
      alert(data.success);
      window.location.href = "login.html";
    } else if (data) {
      // Display validation errors from backend
      Object.keys(data).forEach((field) => {
        const errorField = document.getElementById(`${field}-error`);
        if (errorField) {
          errorField.innerText = data[field];
        }
      });
    }
  })
    .catch((error) => {
      console.error("Error:", error);
      });
};

document.getElementById("role").addEventListener("change", (event)=>{
  const role = event.target.value
  console.log(role)
  const employeeFields = document.getElementById("employee-fields");
  if(role == "Employee"){
    employeeFields.classList.remove("d-none")
  }
  else{
    employeeFields.classList.add("d-none")
  }

})



// Get value by ID function
const getValue = (id) => document.getElementById(id).value;

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
