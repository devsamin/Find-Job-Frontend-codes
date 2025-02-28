const Getparams = () => {
    const params = new URLSearchParams(window.location.search).get("details");
    
    fetch(`https://find-job-v4mq.onrender.com/jobs/details/${params}/`)
    .then((res) => {
        if (!res.ok) {
            throw new Error(`Error fetching job details: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => displayJobDetails(data))
    .catch((error) => console.error("Fetch Error:", error));
};

const CheckIfapplyed = (JobId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
        alert("Invalid user, please login");
        return Promise.resolve(false);
    }

    return fetch(
        `https://find-job-v4mq.onrender.com/applications/list/?job_id=${JobId}&job_seeker_id=${userId}`,
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    )
    .then((response) => response.json())
    .then((data) => data.length > 0) // যদি আগে অ্যাপ্লাই করে থাকে, তাহলে true হবে
    .catch((error) => {
        console.error("Error catching application", error);
        return false;
    });
};


const displayJobDetails = async (data) => {
    console.log(data)
    const parent = document.getElementById("info-details-container")
    // const logoURL = `http://127.0.0.1:8000${data.employer.logo}`;

    const alreadyApplied = await CheckIfapplyed(data.id);
    parent.innerHTML = ""
        const div = document.createElement("div")
        div.innerHTML=`
             <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">${data.title}</h2>
          </div>
        
          
          <div class="d-flex justify-content-between mb-4">
            <p class="text-success"><i class="bi bi-geo-alt"></i>${data.location}</p>
            <p class="text-success"><i class="bi bi-cash-stack"></i> BDT ${data.salary}$ / Month</p>
            <button class="apply-btn" id="apply-btn" ${alreadyApplied ? 'disabled' : ''} onclick="applyForJob(${data.id})">
                ${alreadyApplied ? "Applied" : "Apply"}
                </button>
          </div>
        
          
          <div class="mb-4">
            <h4 class=" bg-light p-2 rounded">Company Name</h4>
            <p>${data.employer.company_name}</p>
          </div>
        
          
          <div class="mb-4">
            <h4 class="bg-light p-2 rounded">Company Description</h4>
            <p>${data.employer.company_description}</p>
          </div>
        
          
          <div class="mb-4">
            <h4 class="bg-light p-2 rounded">Job Description</h4>
            <p>${data.description}</p>
          </div>
        
         
          <div class="mb-4">
            <h4 class="bg-light p-2 rounded">Job Requirements</h4>
            <p>
              ${data.requirement}
            </p>
          </div>
        
          
          <div class="mb-4">
            <h4 class="bg-light p-2 rounded">Benefits</h4>
            <ul>
              <li>Competitive salary and performance bonuses.</li>
              <li>Health insurance and wellness programs.</li>
              <li>Flexible working hours and remote work options.</li>
              <li>Professional development opportunities.</li>
            </ul>
          </div>
        
          
          <div class="mb-4">
            <h4 class="bg-light p-2 rounded">How to Apply</h4>
            <p>Send your updated resume and cover letter There are many variations of passages of Lorem Ipsum available, but the my have suffered alteration in some form, by injected humour, or randomised words which don't loven</p>
          </div>







           
          `
        parent.appendChild(div)
};



// Apply for job function
const applyForJob = async (jobId) => {
    const alreadyApplied = await CheckIfapplyed(jobId);

    if (alreadyApplied) {
        alert("You have already applied for this job.");
        return;
    }

    const modal = document.getElementById('application-modal');
    modal.classList.remove('d-none'); // Show modal

    const form = document.getElementById("job-application-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to apply for this job.");
            return;
        }

        const formdata = new FormData(form);

        try {
            const res = await fetch(`https://find-job-v4mq.onrender.com/applications/apply/job/${jobId}/`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                },
                body: formdata
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (errorData.error === "You have already applyed this job") {
                    alert("You have already applied for this job.");
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            alert("Application submitted successfully and check your mail or profile!!");
            modal.classList.add('d-none'); // Hide modal

            // Apply Button Disable এবং Text Change
            const applyBtn = document.getElementById("apply-btn");
            applyBtn.innerText = "Applied";
            applyBtn.disabled = true;

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your application. Please try again.');
        }
    });
};
// Modal close logic
const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', () => {
    const modal = document.getElementById('application-modal');
    modal.classList.add('d-none'); // Hide modal
});






Getparams();


