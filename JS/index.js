
const JobApplicationModule = (() => {

  document.getElementById('applicationDate').max = new Date().toISOString().split('T')[0];

  const isRemoteSelected = () => {
    if (document.getElementById("jobType").value == "remote") {
      document.getElementById("location").style.display = "none";
      return true;
    } else {
      document.getElementById("location").style.display = "flex";
      return false;
    }
  };

  const validationConfig = {
    isApplicantNameRequired: false,
    isCompanyNameRequired: true,
    isJobRoleRequired: true,
    isJobTypeRequired: true,
    isApplicationDateRequired: true,
    isJobStatusRequired: true,
    isLocationRequired: true
  }

  const isApplicationVerified = () => {
    const applicantName = document.getElementById("applicantName").value;
    const companyName = document.getElementById('companyName').value;
    const jobRole = document.getElementById('jobRole').value;
    const jobType = document.getElementById("jobType").value;
    const applicationDate = document.getElementById('applicationDate').value;
    const jobStatus = document.getElementById('jobStatus').value;
    const location = document.getElementById('locationInput').value;
    let res = true;


    console.log(applicantName)
    if (!applicantName && validationConfig.isApplicantNameRequired) {
      document.getElementsByClassName("applicantNameError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("applicantNameError")[0].classList.add("hidden");
    }

    if (!companyName && validationConfig.isCompanyNameRequired) {
      document.getElementsByClassName("nameError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("nameError")[0].classList.add("hidden");
    }

    if (!jobRole && validationConfig.isJobRoleRequired) {
      document.getElementsByClassName("roleError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("roleError")[0].classList.add("hidden");
    }

    if (!jobType && validationConfig.isJobTypeRequired) {
      document.getElementsByClassName("jobtypeError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("jobtypeError")[0].classList.add("hidden");
    }

    if (jobType && jobType !== "remote" && !location && validationConfig.isLocationRequired) {
      document.getElementsByClassName("locationError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("locationError")[0].classList.add("hidden");
      res = true;
    }
    console.log(applicationDate, applicationDate.length == 0)
    if (applicationDate.length == 0 && validationConfig.isApplicationDateRequired) {
      document.getElementsByClassName("applicationdateError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("applicationdateError")[0].classList.add("hidden");
    }

    if (!jobStatus) {
      document.getElementsByClassName("statusError")[0].classList.remove("hidden");
      res = false;
    } else {
      document.getElementsByClassName("statusError")[0].classList.add("hidden");
    }
    console.log(res);
    return res;
  };

  const addApplication = (e) => {
    e.preventDefault();

    const formData = {
      id: Date.now(),
      applicantName: document.getElementById("applicantName").value,
      companyName: document.getElementById('companyName').value,
      jobRole: document.getElementById('jobRole').value,
      jobType: document.getElementById('jobType').value,
      applicationDate: document.getElementById('applicationDate').value,
      jobStatus: document.getElementById('jobStatus').value,
      notes: document.getElementById('notes').value
    };

    if (formData.jobType != "remote") {
      formData.location = document.getElementById('locationInput').value;
    }

    let prevApplications = JSON.parse(localStorage.getItem("applications")) || [];

    if (isApplicationVerified()) {
      prevApplications.push(formData);
      localStorage.setItem("applications", JSON.stringify(prevApplications));
      refresh();
      alert("Application successfully added!");
    }
  };

  const fetchApplications = () => {
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    console.log(applications);
    const ul = document.getElementById('applicationTable');

    let total = 0, applied = 0, interviewing = 0, hired = 0, rejected = 0;
    applications.forEach(application => {
      const li = document.createElement('li');
      li.classList.add("application-card")
      let statusColor;
      if (application.jobStatus == "hired") {
        statusColor = "green"
      }
      else if (application.jobStatus == "rejected") {
        statusColor = "red"
      }
      else if (application.jobStatus == "interviewing") {
        statusColor = "blue"
      }
      else {
        statusColor = "black"
      }

      console.log(statusColor)

      li.innerHTML = `
      <div class="application-card-header flex">
        <div class="application-card-header-left">
          <div class="application-card-status">
            <span>${application.jobStatus}</span>
          </div>
          <div class="application-card-applicantName">
            <b>${application.applicantName}</b>
          </div>
          <div class="application-card-role">
            ${application.jobRole}
          </div>
        </div>
        <div class="application-card-header-right">
          <div class="actions flex nowrap">
            <a class="edit nowrap" href="#form-heading" onclick="editApplication('${application.id}')"><i
                class="fa-solid fa-pen"></i> <span>Edit</span></a>

            <a class="delete nowrap" onclick="deleteApplication('${application.id}')"><i class="fa-solid fa-trash"></i>
              <span>Delete</span></a>
          </div>
        </div>
      </div>
      <div class="application-card-body">
        <div class="application-card-name">
          <i class="fa-solid fa-building"></i> ${application.companyName}
        </div>
        <div class="application-card-location">
          ${application.jobType == 'remote' ? 'Remote' : application.location}
        </div>
        <div class="application-card-date">
              Applied On ${application.applicationDate}
            </div>
      </div>
    `;

      ul.appendChild(li);
      total++;
      if (application.jobStatus == 'applied') {
        applied++;
      }
      if (application.jobStatus == 'interviewing') {
        interviewing++
      };
      if (application.jobStatus == 'hired') {
        hired++
      };
      if (application.jobStatus == 'rejected') {
        rejected++
      };
    });

    document.getElementById('totalApplications').textContent = total;
    document.getElementById('appliedCount').textContent = applied;
    document.getElementById('interviewingCount').textContent = interviewing;
    document.getElementById('hiredCount').textContent = hired;
    document.getElementById('rejectedCount').textContent = rejected;
  };

  const editApplication = (id) => {
    document.getElementById("submit").classList.add("hidden")
    document.getElementById("update").classList.remove("hidden")

    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    const application = applications.find(application => application.id == id);

    if (application) {
      document.getElementById("applicantName").value = application.applicantName;
      document.getElementById('companyName').value = application.companyName;
      document.getElementById('jobRole').value = application.jobRole;
      document.getElementById('jobType').value = application.jobType;
      document.getElementById('applicationDate').value = application.applicationDate;
      document.getElementById('jobStatus').value = application.jobStatus;
      document.getElementById('notes').value = application.notes;
      if (application.jobType == "remote") {
        document.getElementById('location').style.display = "none";
      } else {
        document.getElementById('location').style.display = "flex";
        document.getElementById('locationInput').value = application.location;
      }
      document.getElementById('applicationId').value = application.id;
    }
  };

  const refresh = () => {
    window.location.reload()
  }

  const updateApplication = () => {
    let applications = JSON.parse(localStorage.getItem("applications")) || [];

    const applicationId = document.getElementById('applicationId').value;
    const applicationIndex = applications.findIndex(application => application.id == applicationId);

    const formData = {
      id: applicationId,
      applicantName: document.getElementById("applicantName").value,
      companyName: document.getElementById('companyName').value,
      jobRole: document.getElementById('jobRole').value,
      jobType: document.getElementById('jobType').value,
      applicationDate: document.getElementById('applicationDate').value,
      jobStatus: document.getElementById('jobStatus').value,
      notes: document.getElementById('notes').value
    };

    if (formData.jobType != "remote") {
      formData.location = document.getElementById('locationInput').value;
      console.log("hii")
    }

    if (isApplicationVerified()) {
      applications[applicationIndex] = formData;
      localStorage.setItem("applications", JSON.stringify(applications))
      alert("Application Updated")
      window.location.reload()
    }
  }

  const deleteApplication = (applicationId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this application?");

    if (isConfirmed) {
      let applications = JSON.parse(localStorage.getItem("applications")) || [];

      const applicationIndex = applications.findIndex(application => application.id == applicationId);

      if (applicationIndex != -1) {
        applications.splice(applicationIndex, 1);
        localStorage.setItem("applications", JSON.stringify(applications));
      }
      refresh()
      setTimeout(() => {
        alert("Application deleted successfully!");
      }, 3000)

    } else {
      alert("Application deletion cancelled.");
    }
  };


  const jobRoles = [
    "Software Engineer",
    "SDE",
    "Associate Software Engineer",
    "System Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Project Manager",
    "DevOps Engineer",
    "Product Manager",
    "QA Engineer",
    "UI/UX Designer",
    "Business Analyst"
  ];

  const jobRoleInput = document.getElementById('jobRole');
  const autocompleteList = document.getElementById('autocompleteRoles');

  jobRoleInput.addEventListener('input', () => {
    const input = jobRoleInput.value.toLowerCase();
    autocompleteList.innerHTML = '';
    if (!input) {
      autocompleteList.classList.add('hidden');
      return;
    }

    const matches = jobRoles.filter(role => role.toLowerCase().includes(input));
    if (matches.length === 0) {
      autocompleteList.classList.add('hidden');
      return;
    }

    matches.forEach(role => {
      const li = document.createElement('li');
      li.textContent = role;
      li.addEventListener('click', () => {
        jobRoleInput.value = role;
        autocompleteList.innerHTML = '';
        autocompleteList.classList.add('hidden');
      });
      autocompleteList.appendChild(li);
    });
    autocompleteList.classList.remove('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!autocompleteList.contains(e.target) && e.target !== jobRoleInput) {
      autocompleteList.classList.add('hidden');
    }
  });


  function toggleView(view) {
    const container = document.getElementById('applicationTable');
    container.innerHTML = "";
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    if (view == 'row') {

      container.style.display = "flex"

      document.getElementById("row-btn").classList.add("active-btn")
      document.getElementById("grid-btn").classList.remove("active-btn")

      const table = document.createElement('table');
      table.classList.add('application-table');
      table.setAttribute("align", "center")

      const thead = document.createElement('thead');
      thead.innerHTML = `
      <tr>
    <th onclick="sortTable('applicantName')">Applicant <i class="fa-solid fa-sort"></i></th>
    <th onclick="sortTable('companyName')" class="nowrap" > Company<i class="fa-solid fa-sort"></i> </th>
    <th onclick="sortTable('jobRole')">Role <i class="fa-solid fa-sort"></i></th>
    <th onclick="sortTable('jobType')"  class="nowrap">Job Type <i class="fa-solid fa-sort"></i></th>
    <th onclick="sortTable('jobStatus')">Status <i class="fa-solid fa-sort"></i></th>
    <th>Actions</th>
  </tr>
    `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      applications.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${app.applicantName}</td>
        <td>${app.companyName}</td>
        <td>${app.jobRole}</td>
        <td>${app.jobType}</td>
        <td>${app.jobStatus}</td>
        <td>
          <div class="actions flex">
            <a class="edit" href="#form-heading" onclick="editApplication('${app.id}')"><i
                class="fa-solid fa-pen"></i> Edit</a>

            <a class="delete" onclick="deleteApplication('${app.id}')"><i class="fa-solid fa-trash"></i>
              Delete</a>
          </div>
        </td>
      `;
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    } else {
      container.style.display = "grid"
      document.getElementById("grid-btn").classList.add("active-btn")
      document.getElementById("row-btn").classList.remove("active-btn")

      applications.forEach(application => {
        const li = document.createElement("li");
        li.className = "application-card";
        li.innerHTML = `
        <div class="application-card-header flex">
        <div class="application-card-header-left">
          <div class="application-card-status">
            <span>${application.jobStatus}</span>
          </div>
          <div class="application-card-applicantName">
            <b>${application.applicantName}</b>
          </div>
          <div class="application-card-role">
            ${application.jobRole}
          </div>
        </div>
        <div class="application-card-header-right">
          <div class="actions flex nowrap">
            <a class="edit nowrap" href="#form-heading" onclick="editApplication('${application.id}')"><i
                class="fa-solid fa-pen"></i> Edit</a>

            <a class="delete nowrap" onclick="deleteApplication('${application.id}')"><i class="fa-solid fa-trash"></i>
              Delete</a>
          </div>
        </div>
      </div>
      <div class="application-card-body">
        <div class="application-card-name">
          <i class="fa-solid fa-building"></i> ${application.companyName}
        </div>
        <div class="application-card-location">
           ${application.jobType == 'remote' ? 'Remote' : application.location}
          </div>
        <div class="application-card-date">
              Applied On ${application.applicationDate}
            </div>
      </div>
      `;
        container.appendChild(li);
      });
    }
  }

  let lastSortedBy = '';
  let sortOrder = 'asc';

  function sortTable(field) {
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    if (lastSortedBy == field) {
      if (sortOrder == 'asc') {
        sortOrder = 'desc'
      } else {
        sortOrder = 'asc'
      }
    } else {
      sortOrder = 'asc'
    }

    lastSortedBy = field;

    applications.sort(function (a, b) {
      let valA = a[field];
      let valB = b[field];

      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();

      if (valA < valB) {
        if (sortOrder == 'asc') {
          return -1;
        } else {
          return 1;
        }
      }

      if (valA > valB) {
        if (sortOrder == 'asc') {
          return 1;
        } else {
          return -1;
        }
      }

      return 0;
    });

    localStorage.setItem('applications', JSON.stringify(applications));
    toggleView('row');
  }



  return {
    addApplication,
    fetchApplications,
    editApplication,
    updateApplication,
    deleteApplication,
    toggleView,
    sortTable,
    isRemoteSelected
  };
})();