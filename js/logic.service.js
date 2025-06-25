
const LogicService = (() => {
  function getFormData() {
    return {
      id: document.getElementById('applicationId').value,
      applicantName: document.getElementById('applicantName').value,
      companyName: document.getElementById('companyName').value,
      jobRole: document.getElementById('jobRole').value,
      jobType: document.getElementById('jobType').value,
      location: document.getElementById('locationInput').value,
      applicationDate: document.getElementById('applicationDate').value,
      jobStatus: document.getElementById('jobStatus').value,
      notes: document.getElementById('notes').value
    };
  }

  function validateForm(form) {
    let isValid = true;

    if (!form.applicantName) {
      document.querySelector('.applicantNameError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.applicantNameError').classList.add('hidden');
    }

    if (!form.companyName) {
      document.querySelector('.nameError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.nameError').classList.add('hidden');
    }

    if (!form.jobRole) {
      document.querySelector('.roleError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.roleError').classList.add('hidden');
    }

    if (!form.jobType) {
      document.querySelector('.jobtypeError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.jobtypeError').classList.add('hidden');
    }

    if (form.jobType !== 'remote' && !form.location) {
      document.querySelector('.locationError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.locationError').classList.add('hidden');
    }

    if (!form.applicationDate) {
      document.querySelector('.applicationdateError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.applicationdateError').classList.add('hidden');
    }

    if (!form.jobStatus) {
      document.querySelector('.statusError').classList.remove('hidden');
      isValid = false;
    } else {
      document.querySelector('.statusError').classList.add('hidden');
    }

    return isValid;
  }

  function handleJobTypeChange() {
    const type = document.getElementById('jobType').value;
    const locationField = document.getElementById('location');

    locationField.style.display = type === 'remote' ? 'none' : 'flex';
  }

  function sortTable(field) {
    let applications = state.applications

    if (state.lastSortedBy == field) {
      if (state.sortOrder == 'asc') {
        state.sortOrder = 'desc'
      } else {
        state.sortOrder = 'asc'
      }
    } else {
      state.sortOrder = 'asc'
    }

    state.lastSortedBy = field;

    applications.sort(function (a, b) {
      let valA = a[field];
      let valB = b[field];

      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();

      if (valA < valB) {
        if (state.sortOrder == 'asc') {
          return -1;
        } else {
          return 1;
        }
      }

      if (valA > valB) {
        if (state.sortOrder == 'asc') {
          return 1;
        } else {
          return -1;
        }
      }

      return 0;
    });
    DOMService.renderView('row', applications);
  }

  return {
    getFormData,
    validateForm,
    handleJobTypeChange,
    sortTable
  };
})();
