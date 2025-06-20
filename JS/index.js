const isRemoteSelected = () => {
  if (document.getElementById("jobType").value == "remote") {
    document.getElementById("location").style.display = "none";
    return true;
  } else {
    document.getElementById("location").style.display = "block";
    return false;
  }
};

const applicationVerified = () => {
  const companyName = document.getElementById('companyName').value;
  const jobRole = document.getElementById('jobRole').value;
  const applicationDate = document.getElementById('applicationDate').value;
  const jobStatus = document.getElementById('jobStatus').value;

  if (!companyName || !jobRole || !applicationDate || !jobStatus) {
    return false;
  }
  return true;
};

const addApplication = (e) => {
  const formData = {
    id: Date.now(),
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

  if (applicationVerified()) {
    prevApplications.push(formData);
    localStorage.setItem("applications", JSON.stringify(prevApplications));
    alert("Application successfully added!");
  } else {
    alert("Please fill out all required fields.");
  }
};


const fetchApplications = () => {
  let applications = JSON.parse(localStorage.getItem("applications")) || [];
  console.log(applications);
  const table = document.getElementById('applicationTable');

  let total = 0, applied = 0, interviewing = 0, hired = 0, rejected = 0;
  applications.forEach(application => {
    const row = document.createElement('tr');
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

    row.innerHTML = `
      <td>${application.companyName}</td>
      <td>${application.jobRole}</td>
      <td>${application.jobType}</td>
      <td style="color: ${statusColor};">${application.jobStatus}</td>
      <td>
        <button class="btn-table" onclick="editApplication('${application.id}')"> 
          <span class="btn-label">Edit</span> 🖊️ 
        </button>
        <button class="btn-table" onclick="deleteApplication('${application.id}')"> 
          <span class="btn-label" >Delete</span> ❌ 
        </button>
      </td>
    `;

    table.appendChild(row);
    total++;
    if (application.jobStatus === 'applied') {
      applied++;
    }
    if (application.jobStatus === 'interviewing') {
      interviewing++
    };
    if (application.jobStatus === 'hired') {
      hired++
    };
    if (application.jobStatus === 'rejected') {
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
    document.getElementById('companyName').value = application.companyName;
    document.getElementById('jobRole').value = application.jobRole;
    document.getElementById('jobType').value = application.jobType;
    document.getElementById('applicationDate').value = application.applicationDate;
    document.getElementById('jobStatus').value = application.jobStatus;
    document.getElementById('notes').value = application.notes;
    if (application.jobType == "remote") {
      document.getElementById('location').style.display = "none";
    } else {
      document.getElementById('location').style.display = "block";
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

  applications[applicationIndex] = formData;
  localStorage.setItem("applications", JSON.stringify(applications))
  alert("Application Updated")
  window.location.reload()
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
