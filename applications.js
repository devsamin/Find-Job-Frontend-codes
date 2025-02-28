
const loadApplications = () =>{

    const tbody = document.getElementById("applications-tbody");
    tbody.innerHTML = ""
    fetch("https://find-job-v4mq.onrender.com/applications/list/")
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        data.forEach((application)=>{
            const row = document.createElement("tr")
            row.innerHTML=
            `
            <tr id="application-row-${application.id}">
            <td>${application.id}</td>
            <td>${application.job.employer.company_name}</td>
            <td>${application.job.title}</td>
            <td>${application.job_seeker.user.username}</td>
            <td>${application.job_seeker.user.email}</td>
            <td>
            <a href="${application.resume}" onclick="downloadFile(event, '${application.resume}')">
                <i class="fa-solid fa-download"></i>
            </a>
             </td>
              <td>
                    <select onchange="updateStatus(${application.id}, this.value)">
                        <option value="Applied" ${application.status === 'Applied' ? 'selected' : ''}>Applied</option>
                        <option value="Accepted" ${application.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                    </select>
                </td>
            <td>
              <i class="fa-solid fa-trash-can" onclick="deleteApplication(${application.id})" style="font-size: 20px; color: red;"></i>

            </td>
            `
            tbody.appendChild(row)
        })
    })
}
function downloadFile(event, url) {
    event.preventDefault(); // লিংক ক্লিক করলে ডিফল্ট ওপেন বন্ধ করবে

    fetch(url)
        .then(response => response.blob()) // ফাইলটিকে blob (binary file) হিসেবে আনবে
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob); // লোকাল blob URL তৈরি করা
            const a = document.createElement("a"); 
            a.href = blobUrl;
            a.download = url.split('/').pop(); // লিংক থেকে ফাইলের নাম বের করা
            document.body.appendChild(a);
            a.click(); // স্বয়ংক্রিয়ভাবে ক্লিক করে ডাউনলোড শুরু করবে
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl); // মেমরি ক্লিন আপ
        })
        .catch(error => console.error("Download failed:", error));
}

document.getElementById("applications-link").addEventListener("click", (e)=>{
    e.preventDefault();
    document.getElementById("pagination-container").classList.add("d-none");
    document.querySelector(".applications-table").classList.remove("d-none");
    document.getElementById("job-table").classList.add("d-none")
    document.getElementById("change-password-form-container").classList.add("d-none")
    document.getElementById("contact-table").classList.add("d-none");
    loadApplications();
})

// delete application
const deleteApplication = (applicationId)=>{

    const token = localStorage.getItem("token");
    fetch(`https://find-job-v4mq.onrender.com/applications/list/${applicationId}/`,{
        method : 'DELETE',
        headers : {
            "Authorization": `Token ${token}`,
           'Content-Type': 'application/json'
        }
    })
    .then(res=>{
        if(res.ok){
            alert("Application deleted successfully");
            document.getElementById(`application-row-${applicationId}`).remove();
        }
        else{
            console.log("Error deleting application");
        }
    })
    .catch(error => {
        console.log("Error:", error);
    });
}



loadApplications()





const updateStatus = (applicationId, newStatus) => {
    const token = localStorage.getItem("token");
    console.log(token)
    fetch(`https://find-job-v4mq.onrender.com/applications/update-status/${applicationId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`, // Ensure authentication
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Status updated successfully! The job seeker will receive an email notification.");
        }
    })
    .catch((error) => {
        console.error("Error updating status:", error);
    });
};