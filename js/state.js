
const state = (() => {
  let applications = [];
  let view = 'grid';
  let prevFocus = null
  let lastSortedBy = '';
  let sortOrder = 'asc';

  function setApplications(apps) {
    applications = apps
  }

  function setView(res) {
    view = res
  }

  return {
    applications,
    view,
    prevFocus,
    lastSortedBy,
    sortOrder,
    setApplications,
    setView
  };
})();
