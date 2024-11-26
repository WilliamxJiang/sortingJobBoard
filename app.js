document.addEventListener("DOMContentLoaded", () => {
  // Job class definition to encapsulate job details and related methods
  class Job {
    constructor(
      jobNo, // Job Number
      title, // Job Title
      jobPageLink, // Link to the job page
      postedTime, // Time the job was posted (relative time)
      type, // Type of the job (e.g., "Ongoing project")
      level, // Level of experience required (e.g., "Intermediate")
      estimatedTime = "N/A", // Estimated time to complete the job (default is "N/A")
      skill, // Required skill for the job
      detail // Detailed description of the job
    ) {
      this.jobNo = jobNo;
      this.title = title;
      this.jobPageLink = jobPageLink;
      this.postedTime = this.parseRelativeTime(postedTime); // Parse relative time into a Date object
      this.type = type;
      this.level = level;
      this.estimatedTime = estimatedTime;
      this.skill = skill;
      this.detail = detail;
    }

    // Method to parse relative time (e.g., "8 minutes ago") into a Date object
    parseRelativeTime(relativeTime) {
      const now = new Date();
      if (!relativeTime) return now; // If no time is provided, return the current time

      const [amount, unit] = relativeTime.split(" ");
      const timeMap = {
        minute: 60 * 1000,
        minutes: 60 * 1000,
        hour: 60 * 60 * 1000,
        hours: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
      };
      return new Date(now - timeMap[unit] * parseInt(amount)); // Subtract the relative time from the current time
    }

    // Method to format the posted time into a human-readable string
    getFormattedPostedTime() {
      return this.postedTime.toLocaleString();
    }
  }

  // Global variables for managing job data and DOM elements
  let jobs = []; // Array to hold job data
  const jobListContainer = document.getElementById("jobList"); // Container for displaying job cards
  const modalOverlay = document.getElementById("modalOverlay"); // Background overlay for the modal
  const jobDetailsModal = document.getElementById("jobDetailsModal"); // Modal for displaying job details
  const jobDetailsContent = document.getElementById("jobDetailsContent"); // Content container inside the modal
  const closeModalButton = document.getElementById("closeModal"); // Close button for the modal

  // Function to load job data from a JSON file
  function loadJobsData(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result); // Parse the JSON file
        jobs = data.map(
          (job) =>
            new Job(
              job["Job No"], // Job Number
              job["Title"], // Job Title
              job["Job Page Link"], // Job Page Link
              job["Posted"], // Posted Time
              job["Type"], // Job Type
              job["Level"], // Job Level
              job["Estimated Time"], // Estimated Time
              job["Skill"], // Job Skill
              job["Detail"] // Job Detail
            )
        );
        populateFilters(); // Populate the filter dropdowns
        displayJobs(jobs); // Display the jobs
      } catch (error) {
        alert("Error parsing JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file); // Read the file as text
  }

  // Function to display job cards on the page
  function displayJobs(filteredJobs) {
    jobListContainer.innerHTML = filteredJobs
      .map(
        (job, index) => `
          <div class="job-card" onclick="showJobDetails(${index})">
              <h3>${job.title}</h3>
              <p>${job.getFormattedPostedTime()}</p>
              <p><strong>Type:</strong> ${job.type}</p>
              <p><strong>Level:</strong> ${job.level}</p>
              <p><strong>Skill:</strong> ${job.skill}</p>
          </div>
      `
      )
      .join(""); // Generate and inject job cards into the container
  }

  // Function to show job details in a modal when a job card is clicked
  window.showJobDetails = (index) => {
    const job = jobs[index];
    jobDetailsContent.innerHTML = `
          <h2>${job.title}</h2>
          <p><strong>Job Number:</strong> ${job.jobNo}</p>
          <p><strong>Posted:</strong> ${job.getFormattedPostedTime()}</p>
          <p><strong>Type:</strong> ${job.type}</p>
          <p><strong>Level:</strong> ${job.level}</p>
          <p><strong>Skill:</strong> ${job.skill}</p>
          <p><strong>Estimated Time:</strong> ${job.estimatedTime}</p>
          <p><strong>Details:</strong> ${job.detail}</p>
          <p><a href="${job.jobPageLink}" target="_blank">Job Page Link</a></p>
      `;
    modalOverlay.style.display = "block"; // Show the overlay
    jobDetailsModal.style.display = "block"; // Show the modal
  };

  // Event listener for closing the modal
  closeModalButton.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    jobDetailsModal.style.display = "none";
  });

  // Event listener for clicking on the overlay to close the modal
  modalOverlay.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    jobDetailsModal.style.display = "none";
  });

  // Function to populate filter dropdowns dynamically based on job data
  function populateFilters() {
    const levels = new Set();
    const types = new Set();
    const skills = new Set();

    jobs.forEach((job) => {
      levels.add(job.level);
      types.add(job.type);
      skills.add(job.skill);
    });

    // Populate the Level filter dropdown
    document.getElementById("levelFilter").innerHTML =
      '<option value="">All Levels</option>' +
      Array.from(levels)
        .map((level) => `<option value="${level}">${level}</option>`)
        .join("");

    // Populate the Type filter dropdown
    document.getElementById("typeFilter").innerHTML =
      '<option value="">All Types</option>' +
      Array.from(types)
        .map((type) => `<option value="${type}">${type}</option>`)
        .join("");

    // Populate the Skill filter dropdown
    document.getElementById("skillFilter").innerHTML =
      '<option value="">All Skills</option>' +
      Array.from(skills)
        .map((skill) => `<option value="${skill}">${skill}</option>`)
        .join("");
  }

  // Function to sort jobs by title (ascending or descending)
  function sortJobsByTitle(ascending = true) {
    jobs.sort((a, b) =>
      ascending
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
    displayJobs(jobs); // Display the sorted jobs
  }

  // Function to sort jobs by posted time (ascending or descending)
  function sortJobsByTime(ascending = true) {
    jobs.sort((a, b) =>
      ascending ? a.postedTime - b.postedTime : b.postedTime - a.postedTime
    );
    displayJobs(jobs); // Display the sorted jobs
  }

  // Event listeners for file input and sorting buttons
  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      if (event.target.files.length > 0) {
        loadJobsData(event.target.files[0]); // Load the selected JSON file
      }
    });

  document
    .getElementById("sortTitleAsc")
    .addEventListener("click", () => sortJobsByTitle(true));
  document
    .getElementById("sortTitleDesc")
    .addEventListener("click", () => sortJobsByTitle(false));
  document
    .getElementById("sortTimeAsc")
    .addEventListener("click", () => sortJobsByTime(true));
  document
    .getElementById("sortTimeDesc")
    .addEventListener("click", () => sortJobsByTime(false));
});
