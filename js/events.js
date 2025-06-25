const Events = (() => {
  function events() {
    document.getElementById('applicationDate').max = new Date().toISOString().split('T')[0];
    document.getElementById('submit-btn').addEventListener('click', FormManager.handleAdd);
    document.getElementById('cancel-btn').addEventListener('click', () => window.location.reload());
    document.getElementById('update-btn').addEventListener('click', FormManager.handleUpdate);
    document.getElementById('jobType').addEventListener('change', LogicService.handleJobTypeChange);
    document.getElementById('row-btn').addEventListener('click', () => DOMService.renderView('row', state.applications));
    document.getElementById('grid-btn').addEventListener('click', () => DOMService.renderView('grid', state.applications));

    const jobRoleInput = document.getElementById('jobRole');
    const autocompleteList = document.getElementById('autocompleteRoles');

    jobRoleInput.addEventListener('input', () => DOMService.renderJobRoleSuggestions(jobRoleInput.value));

    document.addEventListener('click', (e) => {
      if (!autocompleteList.contains(e.target) && e.target !== jobRoleInput) {
        autocompleteList.classList.add('hidden');
      }
    });
  }

  function addEventOnButtons() {
    console.log("addEventOnButtons Called")
    state.applications.forEach((app, index) => {
      document.getElementById(`app-edit-${index}`).addEventListener('click', () => DOMService.populateForm(app, index))
      document.getElementById(`app-delete-${index}`).addEventListener('click', () => FormManager.handleDelete(index))
    });
  }

  function addSortOnHeaders() {
    document.getElementById("applicantName-header").addEventListener('click', () => LogicService.sortTable("applicantName"))
    document.getElementById("companyName-header").addEventListener('click', () => LogicService.sortTable("companyName"))
    document.getElementById("jobRole-header").addEventListener('click', () => LogicService.sortTable("jobRole"))
    document.getElementById("jobType-header").addEventListener('click', () => LogicService.sortTable("jobType"))
    document.getElementById("jobStatus-header").addEventListener('click', () => LogicService.sortTable("jobStatus"))
  }

  return {
    events,
    addEventOnButtons,
    addSortOnHeaders
  };
})();
