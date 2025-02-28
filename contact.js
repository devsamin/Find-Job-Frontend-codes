// console.log("contact.js loaded successfully!");
// console.log(localStorage.getItem("token"))
// alert()
// const PostMessage = () =>{
//     const form = document.getElementById("contact-form")
//     form.addEventListener("submit", (e)=>{
//         e.preventDefault()

//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const message = document.getElementById("message").value;

//         const requestData = {
//             name: name,
//             email: email,
//             message: message
//         };
//         const token = localStorage.getItem("token")
//         fetch('http://127.0.0.1:8000/contact/list/', {
//             method: "POST",
//             headers: {
//                 "Authorization": `Token ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(requestData)
//         })
//         .then((res) => {
//             if (!res.ok) {
//                 return res.json().then(err => Promise.reject(err));
//             }
//             return res.json();
//         })
//         .then((data) => {
//             alert("Message sent successfully! ✅");
//             form.reset();
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//             alert("Failed to send message. ❌ Please try again.");
//         });
//     })
// }
// // ✅ Call the function after the DOM loads
// document.addEventListener("DOMContentLoaded", PostMessage);

const LoadMessage = () =>{
    fetch("https://find-job-v4mq.onrender.com/contact/list/")
    .then((res)=>res.json())
    .then((data)=>{
        GetMessage(data)
        // console.log(data)
    })

}

// LoadMessage()

const GetMessage=(datas)=>{
    const tbody = document.getElementById("contact-list-tbody")
    tbody.innerHTML = ""; // Clear existing data
    datas.forEach((data, index)=>{
        const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.message}</td>
                <td>
                <button class="btn-delete" onclick="deleteMessage(${data.id})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                </td>
            `;
            tbody.appendChild(row);
        // Show the table after data is loaded
        document.getElementById("contact-table").classList.remove("d-none");
    })
}

// ✅ Contact List 
document.getElementById("contact-list-link").addEventListener("click", function (e) {
  document.getElementById("pagination-container").classList.add("d-none");
  document.getElementById("change-password-form-container").classList.add("d-none")
    document.querySelector(".applications-table").classList.add("d-none");
    document.getElementById("job-table").classList.add("d-none")
    e.preventDefault();
    LoadMessage();
});

const deleteMessage = (id) => {
    const token = localStorage.getItem("token");

    fetch(`https://find-job-v4mq.onrender.com/contact/list/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        if (res.ok) {
            alert("Message deleted successfully! 🗑️");
            LoadMessage(); // New message load
        } else {
            return res.json().then(err => Promise.reject(err));
        }
    })
    .catch((error) => {
        console.error("Error deleting message:", error);
        alert("Failed to delete message ❌");
    });
};



document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token"); // Authentication token
  
    const endpoints = {
      postedjobs: "https://find-job-v4mq.onrender.com/jobs/list/",
      totalapplications: "https://find-job-v4mq.onrender.com/applications/list/",
      totalUsers : "https://find-job-v4mq.onrender.com/jobseeker/list/",
      message: "https://find-job-v4mq.onrender.com/contact/list/",
    };
  
    const fetchData = (endpoint, elementId) => {
      fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(`Response from ${endpoint}:`, data); // ✅ Debugging
  
          // If response is an array, show its length
          if (Array.isArray(data)) {
            document.getElementById(elementId).innerText = data.length;
          } 
          // If response is an object with count
          else if (data.count !== undefined) {
            document.getElementById(elementId).innerText = data.count;
          } 
          // If unexpected response
          else {
            document.getElementById(elementId).innerText = "0";
          }
        })
        .catch((error) => {
          console.error(`Error fetching ${elementId}:`, error);
        });
    };
  
    // Fetching Data
    fetchData(endpoints.postedjobs, "posted-jobs");
    fetchData(endpoints.totalapplications, "total-applications");
    fetchData(endpoints.message, "total-messages");
    fetchData(endpoints.totalUsers, "total-totalUsers");
  });
  