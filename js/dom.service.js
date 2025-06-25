
const DOMService = (() => {
  function renderApplications(view, applications) {
    const container = document.getElementById('applicationTable');
    container.innerHTML = '';

    let total = 0, applied = 0, interviewing = 0, hired = 0, rejected = 0;

    if (view === 'row') {
      container.classList.remove('grid');
      container.classList.add('flex');
      document.getElementById('row-btn').classList.add('active-btn');
      document.getElementById('grid-btn').classList.remove('active-btn');

      const table = document.createElement('table');
      table.classList.add('application-table');
      table.setAttribute('align', 'center');

      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th id='applicantName-header'>Applicant <i class="fa-solid fa-sort"></i></th>
          <th id='companyName-header' class="nowrap">Company <i class="fa-solid fa-sort"></i></th>
          <th id='jobRole-header'>Role <i class="fa-solid fa-sort"></i></th>
          <th id='jobType-header' class="nowrap">Job Type <i class="fa-solid fa-sort"></i></th>
          <th id='jobStatus-header'>Status <i class="fa-solid fa-sort"></i></th>
          <th>Actions</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      applications.forEach((app, index) => {
        const row = document.createElement('tr');
        row.setAttribute("id", `app-${index}`)
        row.innerHTML = `
          <td>${app.applicantName}</td>
          <td>${app.companyName}</td>
          <td>${app.jobRole}</td>
          <td>${app.jobType}</td>
          <td>${app.jobStatus}</td>
          <td>
            <div class="actions flex">
              <a class="edit" href="#form-heading" id="app-edit-${index}"><i class="fa-solid fa-pen"></i> Edit</a>
              <a class="delete" id="app-delete-${index}"><i class="fa-solid fa-trash"></i> Delete</a>
            </div>
          </td>
        `;
        total++;
        if (app.jobStatus === 'applied') applied++;
        if (app.jobStatus === 'interviewing') interviewing++;
        if (app.jobStatus === 'hired') hired++;
        if (app.jobStatus === 'rejected') rejected++;
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    } else {
      container.classList.remove('flex');
      container.classList.add('grid');
      document.getElementById('grid-btn').classList.add('active-btn');
      document.getElementById('row-btn').classList.remove('active-btn');

      applications.forEach((application, index) => {
        const li = document.createElement('li');
        li.className = 'application-card';
        li.setAttribute("id", `app-${index}`)
        li.innerHTML = `
          <div class="application-card-header flex">
            <div class="application-card-header-left">
              <div class="application-card-status">
                <span class="${application.jobStatus === 'hired' ? 'text-success' : application.jobStatus === 'rejected' ? 'text-danger' : ''}">${application.jobStatus}</span>
              </div>
              <div class="application-card-applicantName"><b>${application.applicantName}</b></div>
              <div class="application-card-role">${application.jobRole}</div>
            </div>
            <div class="application-card-header-right">
              <div class="actions flex nowrap">
                <a class="edit" href="#form-heading" id="app-edit-${index}"><i class="fa-solid fa-pen"></i> Edit</a>
              <a class="delete" id="app-delete-${index}"><i class="fa-solid fa-trash"></i> Delete</a>
              </div>
            </div>
          </div>
          <div class="application-card-body">
            <div class="application-card-name">
              <span title="Company"><i class="fa-solid fa-building"></i> ${application.companyName}</span>
            </div>
            <div class="flex application-card-footer">
              <div class="application-card-location" title="Job Location">
                <span><i class="fa-solid fa-location-dot"></i> ${application.jobType === 'remote' ? 'Remote' : application.location}</span>
              </div>
              <div class="application-card-date">Applied On ${application.applicationDate}</div>
            </div>
          </div>
        `;
        total++;
        if (application.jobStatus === 'applied') applied++;
        if (application.jobStatus === 'interviewing') interviewing++;
        if (application.jobStatus === 'hired') hired++;
        if (application.jobStatus === 'rejected') rejected++;
        container.appendChild(li);
      });
    }

    updateCounters({ total, applied, interviewing, hired, rejected });
    Events.addEventOnButtons()
  }

  function updateCounters({ total, applied, interviewing, hired, rejected }) {
    document.getElementById('totalApplications').textContent = total;
    document.getElementById('appliedCount').textContent = applied;
    document.getElementById('interviewingCount').textContent = interviewing;
    document.getElementById('hiredCount').textContent = hired;
    document.getElementById('rejectedCount').textContent = rejected;
  }

  function renderView(view, applications) {
    renderApplications(view, applications);
    if (view == "row") {
      Events.addSortOnHeaders()
    }
  }

  function renderJobRoleSuggestions(input) {
    const list = document.getElementById('autocompleteRoles');
    list.innerHTML = '';
    if (!input) {
      list.classList.add('hidden');
      return;
    }

    const matches = constants.JOB_ROLES.filter(role =>
      role.toLowerCase().includes(input.toLowerCase())
    );

    if (!matches.length) {
      list.classList.add('hidden');
      return;
    }

    matches.forEach(role => {
      const li = document.createElement('li');
      li.textContent = role;
      li.addEventListener('click', () => {
        document.getElementById('jobRole').value = role;
        list.innerHTML = '';
        list.classList.add('hidden');
      });
      list.appendChild(li);
    });
    list.classList.remove('hidden');
  }

  function resetForm() {
    document.querySelector('form').reset();
    document.getElementById('location').style.display = 'flex';
    document.getElementById('update').classList.add('hidden');
    document.getElementById('submit').classList.remove('hidden');
  }

  function populateForm(app, index) {
    console.log(index)
    if (state.prevFocus != null) {
      document.getElementById(state.prevFocus).classList.remove("add-focus")
    }
    state.prevFocus = `app-${index}`
    document.getElementById(`app-${index}`).classList.add("add-focus")
    console.log(document.getElementById(`app-${index}`).focus())
    document.getElementById('applicationId').value = app.id;
    document.getElementById('applicantName').value = app.applicantName;
    document.getElementById('companyName').value = app.companyName;
    document.getElementById('jobRole').value = app.jobRole;
    document.getElementById('jobType').value = app.jobType;
    document.getElementById('applicationDate').value = app.applicationDate;
    document.getElementById('jobStatus').value = app.jobStatus;
    document.getElementById('notes').value = app.notes;
    if (app.jobType !== 'remote') {
      document.getElementById('location').style.display = 'flex';
      document.getElementById('locationInput').value = app.location;
    } else {
      document.getElementById('location').style.display = 'none';
    }
    document.getElementById('update').classList.remove('hidden');
    document.getElementById('submit').classList.add('hidden');
  }

  function showAlert(message) {
    const alertBox = document.getElementById('customAlert');
    alertBox.textContent = message;
    alertBox.className = `custom-alert show success`;
    setTimeout(() => {
      alertBox.classList.remove('show');
    }, 3000);
  }

  return {
    renderApplications,
    renderView,
    renderJobRoleSuggestions,
    resetForm,
    populateForm,
    showAlert
  };
})();
