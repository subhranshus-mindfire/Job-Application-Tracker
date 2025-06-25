
const App = (() => {
  function init() {
    state.applications = StorageService.loadApplications();
    DOMService.renderApplications(state.view, state.applications);
    Events.events();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
