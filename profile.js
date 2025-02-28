
const Myjobapplicationlist = ()=>{
    const login_user_name = document.getElementById("login-username")
    const username = localStorage.getItem("username")
    login_user_name.innerHTML=username
    const job_seeker_id = localStorage.getItem("jobseeker_id")
    // console.log(job_seeker_id)
    if (!job_seeker_id) {
        console.error("Job Seeker ID not found in localStorage");
        return; // jodi jobseeker id pawa na jai
    }
    fetch(`https://find-job-v4mq.onrender.com/applications/list/?job_seeker_id=${job_seeker_id}`)
    .then((res)=>res.json())
    .then((data)=>{
        // console.log(data)
        const tablebody = document.getElementById("application-list")
        tablebody.innerHTML=""
        if(data.length === 0){
            tablebody.innerHTML = "<tr><td colspan='7' class='text-center'>No applications found</td></tr>";
            return;
        }
        data.forEach((application)=>{
            const row = document.createElement("tr")
            row.innerHTML=`
                <tr id="job-row-${application.id}">
                <td>${application.id}</td>
                <td>${application.job.title}</td>
                <td>${application.job.employer.company_name}</td>
                <td>${application.job.location}</td>
                <td>${application.job.salary}</td>
                <td>${application.status}</td>
                <td>
                    <i class="fa-solid fa-trash-can" onclick="deleteJob(${application.id})" style="font-size: 20px; color: red;"></i>
                </td>
            `
            tablebody.appendChild(row)
        })

    })
}

Myjobapplicationlist()


// control profile edit form
const showEditForm = ()=>{
    document.querySelector('.user-info').classList.add('d-none')
    document.getElementById('edit-form-container').style.display = 'block';

    const userID = localStorage.getItem('jobseeker_id')
    console.log(userID)
    fetch(`https://find-job-v4mq.onrender.com/jobseeker/list/${userID}/`)
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        document.getElementById("first-name").value = data.user.first_name
        document.getElementById("last-name").value = data.user.last_name
        document.getElementById("edit-email").value = data.user.email
        document.getElementById("edit-phone").value = data.mobile_no
        document.getElementById("edit-skill").value = data.skills
        document.getElementById("edit-address").value = data.location
       
        
    })
    const token = localStorage.getItem("token")
    document.getElementById("edit-profile-form").onsubmit = (e)=>{
        e.preventDefault()

        const updateprofile = {
            first_name :document.getElementById("first-name").value,
            last_name :document.getElementById("last-name").value,
            email : document.getElementById("edit-email").value,
            mobile_no: document.getElementById("edit-phone").value,
            skills: document.getElementById("edit-skill").value,
            location: document.getElementById("edit-address").value,
        }
        // put request
        fetch(`https://find-job-v4mq.onrender.com/jobseeker/list/${userID}/`,{
            method: "PUT",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateprofile),
        })
        .then((res) => {
            if (res.ok) {
                alert("Profile updated successfully!");
                 // Update user-info section dynamically
                 document.querySelector('.user-info').innerHTML = `
                 <h2>${updateprofile.first_name} ${updateprofile.last_name}</h2>
                 <p><i class="fas fa-user"></i> @${updateprofile.first_name.toLowerCase()}</p>
                 <p><i class="fas fa-envelope"></i> ${updateprofile.email}</p>
                 <p><i class="fas fa-phone"></i> ${updateprofile.mobile_no}</p>
                 <p><i class="fas fa-map-marker-alt"></i> ${updateprofile.location}</p>
                 <button type="submit" class="save-btn" onclick="showEditForm()">Edit</button>
             `;
                cancelEdit();
            } else {
                alert("Failed to update profile.");
            }
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        });
    }

    
}
const cancelEdit = ()=>{
    document.getElementById('edit-form-container').style.display = 'none';
    document.querySelector('.user-info').classList.remove('d-none')
}


// Function to load and populate jobseeker info
const loadJobseekerInfo = () => {
    const userID = localStorage.getItem("jobseeker_id"); // Get logged-in user ID
    const token = localStorage.getItem("token"); // Get the token for authentication
  
    if (!userID || !token) {
      alert("Please log in to view your profile.");
      return;
    }
  
    // Fetch the user's profile data
    fetch(`https://find-job-v4mq.onrender.com/jobseeker/list/${userID}/`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to load jobseeker info.");
        }
      })
      .then((data) => {
        // Populate the user info dynamically
        const userInfoSection = document.querySelector(".user-info");
        userInfoSection.innerHTML = `
          <h2>${data.user.first_name} ${data.user.last_name}</h2>
          <p><i class="fas fa-user"></i> @${data.user.username}</p>
          <p><i class="fas fa-envelope"></i> ${data.user.email}</p>
          <p><i class="fas fa-phone"></i> ${data.mobile_no}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${data.location}</p>
          <button type="button" class="save-btn" onclick="showEditForm()">Edit</button>
        `;
      })
      .catch((error) => {
        console.error("Error fetching jobseeker info:", error);
        alert("An error occurred while fetching your profile information.");
      });
  };
  
  // Load the profile when the page loads
  document.addEventListener("DOMContentLoaded", loadJobseekerInfo);




  const deleteJob = (applicationID) => {
    const token = localStorage.getItem("token"); 
    fetch(`https://find-job-v4mq.onrender.com/applications/list/${applicationID}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${token}`,
        }
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`Failed to delete. Status: ${res.status}`);
        }
        return res.status === 204 ? {} : res.json();
    })
    .then((data) => {
        alert("Job application deleted successfully!");
        window.location.reload()
        // console.log("Job application deleted successfully:", data);
    })
    .catch((error) => {
        alert("Error while deleting the job application. Please try again.");
        console.error("Error while deleting the job application:", error);
    });
};

// jobseeker change password
document.getElementById("show-change-password-form").addEventListener("click", () => {
    console.log("samin")
    document.getElementById("change-password-form-container").classList.remove("d-none");
});
const Changepasswordform = (event) =>{
    
    event.preventDefault()

    const oldpassword = document.getElementById("old-password").value
    const newpassword = document.getElementById("new-password").value

    const oldpasswordError = document.getElementById("old-password-error");
    const newpasswordError = document.getElementById("new-password-error");

    oldpasswordError.textContent = "";
    newpasswordError.textContent = "";

    // console.log(oldpassword, newpassword)
    const token = localStorage.getItem("token")
    if(!oldpassword || !newpassword){
        alert("Please fill out both fields.")
        return
    }
    fetch("https://find-job-v4mq.onrender.com/user/change_password/",{
        method: "POST",
        headers: {
             "Authorization": `Token ${token}`,
           'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            old_password: oldpassword,
            new_password: newpassword
        })
    })
    .then((res) => res.json())
    .then((data)=>{
        if(data.message){
            alert(data.message)
            document.getElementById("change-password-form").reset();
            document.getElementById("change-password-form-container").classList.add("d-none");
        }
        else{
            if (data.old_password) {
                console.log(data.old_password)
                oldpasswordError.textContent = data.old_password[0]; // প্রথম error message দেখাবে
            }
            if (data.new_password) {
                newpasswordError.textContent = data.new_password[0];
            }
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update password. Please try again.");
    });
}


document.addEventListener("DOMContentLoaded", function () {
    let profileImage = document.getElementById("profile-image");
    let storedImage = localStorage.getItem("profile_image");

    let baseUrl = `https://find-job-v4mq.onrender.com`; // বর্তমান ওয়েবসাইটের URL পাবে

    if (storedImage && !storedImage.startsWith("http")) {
        storedImage = baseUrl + storedImage; // Absolute URL বানানো
    }

    console.log("Final Image URL:", storedImage); // Debugging

    if (storedImage) {
        profileImage.src = storedImage;
    } else {
        profileImage.src = "https://via.placeholder.com/150"; // Default Image
    }
});
