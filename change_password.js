

document.getElementById("change-password-link").addEventListener("click", (event)=>{
    event.preventDefault()
    document.getElementById("pagination-container").classList.add("d-none");
    document.getElementById("change-password-form-container").classList.remove("d-none")
    document.querySelector(".applications-table").classList.add("d-none");
    document.getElementById("job-table").classList.add("d-none")
    document.getElementById("contact-table").classList.add("d-none");
})


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


// const logout = () => {
//     localStorage.clear();
//     window.location.href = "index.html";
// };

// const logout = (event) => {
//     event.preventDefault();

//     fetch("http://127.0.0.1:8000/user/logout/", {
//         method: "POST",
//         credentials: "same-origin",
//     })
//     .then(response => {
//         if (response.ok) {
//             localStorage.clear();
//             window.location.href = "index.html"; 
//         } else {
//             alert("Logout failed. Please try again.");
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert("An error occurred. Please try again.");
//     });
// };