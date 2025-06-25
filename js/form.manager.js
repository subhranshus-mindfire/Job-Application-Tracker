
const FormManager = (() => {
  function handleAdd(e) {
    e.preventDefault();

    const formData = LogicService.getFormData();
    if (!LogicService.validateForm(formData)) return;

    formData.id = Date.now();
    state.applications.push(formData);
    StorageService.saveApplications(state.applications);

    DOMService.showAlert('Application added!');
    DOMService.resetForm();
    DOMService.renderApplications(state.view, state.applications);
  }

  function handleUpdate() {
    const formData = LogicService.getFormData();
    if (!LogicService.validateForm(formData)) return;

    const index = state.applications.findIndex(app => app.id == formData.id);
    if (index !== -1) {
      state.applications[index] = formData;
      StorageService.saveApplications(state.applications);

      DOMService.showAlert('Application updated!');
      DOMService.resetForm();
      DOMService.renderApplications(state.view, state.applications);
    }
  }

  function handleEdit(id) {
    const app = state.applications.find(a => a.id == id);
    if (app) {
      DOMService.populateForm(app);
    }
  }

  function handleDelete(index) {
    const confirmed = window.confirm('Are you sure you want to delete this application?');
    if (!confirmed) return;

    state.applications = state.applications.splice(state.applications[index], 1);
    StorageService.saveApplications(state.applications);

    DOMService.showAlert('Application deleted!');
    DOMService.renderApplications(state.view, state.applications);
  }
  function handleDelete(index) {
    const confirmed = window.confirm('Are you sure you want to delete this application?');
    if (!confirmed) return;

    state.applications.splice(index, 1);
    StorageService.saveApplications(state.applications);
    DOMService.showAlert('Application deleted!');
    DOMService.renderApplications(state.view, state.applications);
  }

  return {
    handleAdd,
    handleUpdate,
    handleEdit,
    handleDelete
  };
})();
