
const loadJobs = (category="", location="", keyword="", page = 1) => {
    // console.log(location)
    // const url = `http://127.0.0.1:8000/jobs/list/?category_name=${category}&location=${location}&keyword=${keyword}`;
    const url = `https://find-job-v4mq.onrender.com/jobs/list/?category_name=${category}&location=${location}&keyword=${keyword}&page=${page}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        DisplayJobs(data.results)
        console.log(data)
        setupPagination(data); // Pagination ফাংশন কল করতে হবে
})
        
    
}





const DisplayJobs = (jobs) => {
    // console.log(jobs)
    const parent = document.getElementById("jobs-container")
    parent.innerHTML = ""; // previous gula kali kore dilam
    jobs.forEach((job) => {
        // console.log(job.id)
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML=
        `
            <img class="card-image" src="${job.employer.logo}" alt="">
            <div class="title-company-name">
                <p><strong>${job.title}</strong></p>
                <p><strong>${job.employer.company_name}</strong></p>
            </div>
            <div class="card-text">
              <h5></h5>
              <p></p>
              
              <p><i class="fa-solid fa-location-dot"></i> <strong>${job.location}</strong></p>
              <p><strong>${job.salary}$/month</strong></p>
              <p class="text-success"><i class="fa-solid fa-clock text-black"></i><strong> ${job.posted_on.slice(0,10)}</strong></p>
              <p><strong>${job.job_type}</strong></p>
             <button class="card-btn">
            <a  href="job_details.html?details=${job.id}">Browse Job</a>
        </button>
            </div>
            
        `
        parent.appendChild(div)
    })
}

const loadCategory = () =>{
    fetch("https://find-job-v4mq.onrender.com/category/list/")
    .then((res)=>res.json())
    .then((data)=>DisplayCatagory(data))
}

const DisplayCatagory = (datas) => {
    // console.log(datas)
    const parent = document.getElementById("dropdown-menu")
    datas.forEach((data) => {
        const li = document.createElement("li")
        li.innerHTML=`
        <li onclick="loadJobs('${data.name}')">${data.name}</li>
        `
        parent.appendChild(li)
    });
}

const HandelSearch=()=> {
    const category = document.getElementById("category").value || "";
    const location = document.getElementById("location").value || "";
    const keyword = document.getElementById("keyword").value || "";

    loadJobs(category, location, keyword);
    document.getElementById("category").value = "";
    document.getElementById("location").value = "";
    document.getElementById("keyword").value = "";
}



const loadCategories = () => {
    fetch("https://find-job-v4mq.onrender.com/category/list/")
    .then(response => response.json())
    .then(data => {
        const categorySelect = document.getElementById("category-select");
        data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error loading categories:", error));
};

const JobPost = () => {
    // Collect job data from form inputs
    const title = document.getElementById("job-title").value;
    const requirement = document.getElementById("job-requirement").value;
    const description = document.getElementById("job-description").value;
    const location = document.getElementById("job-location").value;
    const salary = document.getElementById("job-salary").value;
    const category = document.getElementById("category-select").value;

    const job_type = document.getElementById("job-type").value;

    // Get token for authentication
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in before posting a job");
        return;
    }

    // Create job data object (no need to include 'employer')
    const jobData = {
        title: title,
        requirement: requirement,
        description: description,
        location: location,
        salary: salary,
        job_type: job_type,
        category: category
    };

    // Send POST request to create a job
    fetch("https://find-job-v4mq.onrender.com/jobs/jobpost/", {
        method: "POST",
        headers: {
            "Authorization": `Token ${token}`, // Ensure proper capitalization of 'Token'
            // "Authorization": "Token YOUR_AUTH_TOKEN", // Ensure proper capitalization of 'Token'
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error posting job");
        }
    })
    .then(data => {
        alert("Job posted successfully!");
        // Optional: Reset form fields after successful submission
        document.getElementById("job-title").value = "";
        document.getElementById("job-requirement").value = "";
        document.getElementById("job-description").value = "";
        document.getElementById("job-location").value = "";
        document.getElementById("job-salary").value = "";
        document.getElementById("category-select").value = "";
        document.getElementById("job-type").value = "";
    })
    .catch(error => {
        console.error("Error posting job:", error);
        alert("Failed to post job. Please try again.");
    });
};

// Fetch employee profile and categories on page load
window.onload = () => {
    loadCategories();
};




loadJobs()
loadCategory()




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


  const logout = () => {
    localStorage.clear();
    updateProfileMenu();
    window.location.href = "index.html"; // Redirect after logout
  };
  

  updateProfileMenu()


// pagination

const setupPagination = (data) => {
    const parent = document.getElementById("pagination-container");
    parent.innerHTML = ""; // previous pagination mose pelbe

    // currentPage 
    let currentPage = 1;
    if (data.previous) {
        let urlParams = new URL(data.previous);
        let prevPage = urlParams.searchParams.get("page");
        currentPage = prevPage ? parseInt(prevPage) + 1 : 2;
    } else if (data.next) {
        let urlParams = new URL(data.next);
        let nextPage = urlParams.searchParams.get("page");
        currentPage = nextPage ? parseInt(nextPage) - 1 : 1;
    }

    console.log("Current Page:", currentPage);

    let totalPages = Math.ceil(data.count / 3); // totla page
    console.log("Total Page:", totalPages);

    // filter 
    const category = document.getElementById("category").value || "";
    const location = document.getElementById("location").value || "";
    const keyword = document.getElementById("keyword").value || "";

    // "Previous" Button
    let prevBtn = document.createElement("li");
    prevBtn.className = `page-item ${data.previous ? "" : "disabled"}`;
    prevBtn.innerHTML = `<a class="page-link" href="#" onclick="loadJobs('${category}', '${location}', '${keyword}', ${currentPage - 1})">‹</a>`;
    parent.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            let pageItem = document.createElement("li");
            pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
            pageItem.innerHTML = `<a class="page-link" href="#" onclick="loadJobs('${category}', '${location}', '${keyword}', ${i})">${i}</a>`;
            parent.appendChild(pageItem);
        } else if (Math.abs(i - currentPage) === 2) {
            let dots = document.createElement("li");
            dots.className = "page-item disabled";
            dots.innerHTML = `<span class="page-link">...</span>`;
            parent.appendChild(dots);
        }
    }

    // "Next" Button
    let nextBtn = document.createElement("li");
    nextBtn.className = `page-item ${data.next ? "" : "disabled"}`;
    nextBtn.innerHTML = `<a class="page-link" href="#" onclick="loadJobs('${category}', '${location}', '${keyword}', ${currentPage + 1})">›</a>`;
    parent.appendChild(nextBtn);
};



document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");
  
    const animateCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        let current = 0;
        const increment = Math.ceil(target / 100);
  
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.innerText = current > target ? target : current;
                setTimeout(updateCounter, 59);
            } else {
                counter.innerText = target;
            }
        };
  
        updateCounter();
    };
  
    counters.forEach(counter => {
        animateCounter(counter);
    });
  });
  