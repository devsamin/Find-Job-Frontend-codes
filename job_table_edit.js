let currentPage = 1; // Track current page

const displayJob = (page = 1) => {
    const tbody = document.getElementById("job-list-tbody");
    tbody.innerHTML = "";
    
    fetch(`https://find-job-v4mq.onrender.com/jobs/list/?page=${page}`)
    .then((res) => res.json())
    .then((data) => {
        // Job list show korbe
        data.results.forEach((job) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <tr id="job-row-${job.id}">
                <td>${job.id}</td>
                <td>${job.title}</td>
                <td>${job.requirement.slice(0, 10)}</td>
                <td>${job.employer.company_name}</td>
                <td>${job.employer.company_description.slice(0, 10)}</td>
                <td>${job.location}</td>
                <td>${job.salary}</td>
                <td>${job.posted_on.slice(0, 10)}</td>
                <td>
                    <i class="fa-solid fa-pen mx-3" onclick="EditJob(${job.id})" style="font-size: 20px; color: green;"></i>
                    <i class="fa-solid fa-trash-can" onclick="deleteJob(${job.id})" style="font-size: 20px; color: red;"></i>
                </td>
            </tr>
            `;
            tbody.appendChild(row);
        });

        // Pagination update korbe
        updatePagination(data.next, data.previous);
    });
};

const updatePagination = (next, previous) => {
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";

    if (previous) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a></li>`;
    }

    paginationContainer.innerHTML += `<li class="page-item active"><a class="page-link" href="#">${currentPage}</a></li>`;

    if (next) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a></li>`;
    }
};

const changePage = (page) => {
    currentPage = page;
    displayJob(page);
};

// Job List link click korle table & pagination show hobe
document.addEventListener("DOMContentLoaded", function () {
    // Default e pagination hide thakbe
    document.getElementById("pagination-container").classList.add("d-none");

    document.getElementById("job-link").addEventListener("click", (e) => {
        e.preventDefault();

        // Sudo job table show & pagination show
        document.getElementById("job-table").classList.remove("d-none");
        document.getElementById("pagination-container").classList.remove("d-none");

        // baki sob hide
        document.querySelector(".applications-table").classList.add("d-none");
        document.getElementById("change-password-form-container").classList.add("d-none");
        document.getElementById("contact-table").classList.add("d-none");

        // Display job function call
        displayJob();
    });
});


const deleteJob = (jobId) => {

    fetch(`https://find-job-v4mq.onrender.com/jobs/list/${jobId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        if (res.ok) {
            // টেবিল থেকে job row মুছে ফেলা হবে
            document.getElementById(`job-row-${jobId}`).remove();
            alert("Job deleted successfully!");
        } else {
            alert("Failed to delete job. Please try again.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
    });
};
