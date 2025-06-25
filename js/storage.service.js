const StorageService = (() => {

  function loadApplications() {
    return JSON.parse(localStorage.getItem("applications")) || [];
  }

  function saveApplications(applications) {
    localStorage.setItem("applications", JSON.stringify(applications));
  }

  return {
    loadApplications,
    saveApplications,
  };
})();
