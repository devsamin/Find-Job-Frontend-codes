

const EditJob = (JobId) =>{
    document.getElementById("job-table").classList.add("d-none")
    document.getElementById("change-password-form-container").classList.add("d-none")
    const formcontainer = document.getElementById("edit-job-form-container")
    formcontainer.classList.remove("d-none")

    fetch(`https://find-job-v4mq.onrender.com/jobs/list/${JobId}/`)
    .then((res)=>res.json())
    .then((job)=>{
        // console.log(job)
        document.getElementById("edit-job-title").value = job.title;
        document.getElementById("edit-job-description").value = job.description;
        document.getElementById("edit-job-requirement").value = job.requirement;
        document.getElementById("edit-job-location").value = job.location;
        document.getElementById("edit-job-salary").value = job.salary;
        document.getElementById("category-select").value = job.category
    })
    document.getElementById("edit-job-form").onsubmit = (e) => {
        e.preventDefault();
        

        const updatedJob = {
            title: document.getElementById("edit-job-title").value,
            description: document.getElementById("edit-job-description").value,
            requirement: document.getElementById("edit-job-requirement").value,
            location: document.getElementById("edit-job-location").value,
            salary: document.getElementById("edit-job-salary").value,
            category: document.getElementById("category-select").value
        };

        fetch(`https://find-job-v4mq.onrender.com/jobs/list/${JobId}/`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedJob),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Data updated:", data);
            alert("Job updated successfully!");
            location.reload()
            document.getElementById("job-table").classList.remove("d-none")
            formcontainer.classList.add("d-none");
        })
        .catch((err) => console.error(err));

}}

let username = localStorage.getItem('username')
document.getElementById("login-user").textContent= "Hello " + username;


