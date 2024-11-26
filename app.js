document.addEventListener("DOMContentLoaded", () => {
  // Job class definition
  class Job {
    // Constructor to initialize a job object with all its properties
    constructor(
      jobNo,
      title,
      jobPageLink,
      postedTime,
      type,
      level,
      estimatedTime,
      skill,
      detail
    ) {
      this.jobNo = jobNo; // Job number (unique identifier)
      this.title = title; // Job title
      this.jobPageLink = jobPageLink; // Link to the job posting
      this.postedTime = this.parseRelativeTime(postedTime); // Parsed posted time as a Date object
      this.type = type; // Type of job (e.g., "Ongoing Project")
      this.level = level; // Experience level required (e.g., "Intermediate")
      this.estimatedTime = estimatedTime || "N/A"; // Estimated time to complete the job
      this.skill = skill; // Primary skill required for the job
      this.detail = detail; // Detailed description of the job
    }

    // Parses a relative time string (e.g., "2 hours ago") into a Date object
    parseRelativeTime(relativeTime) {
      const now = new Date(); // Get the current time
      if (!relativeTime) return now; // If no time is provided, return the current time

      const [amount, unit] = relativeTime.split(" "); // Split relative time into amount and unit
      const timeMap = {
        minute: 60 * 1000, // Convert minutes to milliseconds
        minutes: 60 * 1000,
        hour: 60 * 60 * 1000, // Convert hours to milliseconds
        hours: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000, // Convert days to milliseconds
        days: 24 * 60 * 60 * 1000,
      };
      return new Date(now - timeMap[unit] * parseInt(amount)); // Subtract the time difference from now
    }

    // Returns a human-readable string of the posted time
    getFormattedPostedTime() {
      return this.postedTime.toLocaleString();
    }
  }

  // Array to store job objects
  let jobs = [];

  // DOM elements for job display and modal functionality
  const jobListContainer = document.getElementById("jobList"); // Container to display job cards
  const modalOverlay = document.getElementById("modalOverlay"); // Overlay background for modal
  const jobDetailsModal = document.getElementById("jobDetailsModal"); // Modal to display job details
  const jobDetailsContent = document.getElementById("jobDetailsContent"); // Content container inside the modal

  // Load job data from a JSON file uploaded by the user
  function loadJobsData(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result); // Parse the uploaded JSON file
        jobs = data.map(
          (job) =>
            new Job(
              job["Job No"], // Initialize a Job object with data from the JSON
              job["Title"],
              job["Job Page Link"],
              job["Posted"],
              job["Type"],
              job["Level"],
              job["Estimated Time"],
              job["Skill"],
              job["Detail"]
            )
        );
        populateFilters(); // Populate filter dropdowns with unique values from the jobs
        displayJobs(jobs); // Display all jobs
      } catch (error) {
        alert("Error parsing JSON file. Please check the file format."); // Handle invalid JSON
      }
    };
    reader.readAsText(file); // Read the file as plain text
  }

  // Displays job cards in the job list container
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
      .join(""); // Combine all job cards into a single string
  }

  // Populates the filter dropdowns dynamically based on job data
  function populateFilters() {
    const levels = new Set(); // Set to store unique levels
    const types = new Set(); // Set to store unique types
    const skills = new Set(); // Set to store unique skills

    // Iterate over all jobs to populate the sets
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

  // Filters the jobs based on selected values from the dropdowns
  function filterJobs() {
    const selectedLevel = document.getElementById("levelFilter").value; // Selected level
    const selectedType = document.getElementById("typeFilter").value; // Selected type
    const selectedSkill = document.getElementById("skillFilter").value; // Selected skill

    // Filter the jobs based on selected criteria
    const filteredJobs = jobs.filter((job) => {
      const matchesLevel = !selectedLevel || job.level === selectedLevel;
      const matchesType = !selectedType || job.type === selectedType;
      const matchesSkill = !selectedSkill || job.skill === selectedSkill;
      return matchesLevel && matchesType && matchesSkill;
    });

    displayJobs(filteredJobs); // Display the filtered jobs
  }

  // Sorts jobs alphabetically by title
  function sortJobsByTitle(ascending) {
    jobs.sort((a, b) =>
      ascending
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
    displayJobs(jobs); // Display sorted jobs
  }

  // Sorts jobs by posted time
  function sortJobsByTime(ascending) {
    jobs.sort((a, b) =>
      ascending ? a.postedTime - b.postedTime : b.postedTime - a.postedTime
    );
    displayJobs(jobs); // Display sorted jobs
  }

  // Displays job details in a modal when a job card is clicked
  window.showJobDetails = (index) => {
    const job = jobs[index]; // Get the clicked job
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

  // Closes the modal when the close button or overlay is clicked
  document.getElementById("closeModal").addEventListener("click", () => {
    modalOverlay.style.display = "none";
    jobDetailsModal.style.display = "none";
  });

  modalOverlay.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    jobDetailsModal.style.display = "none";
  });

  // Event listeners for file upload, filtering, and sorting
  document.getElementById("fileInput").addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
      loadJobsData(event.target.files[0]); // Load data from the uploaded file
    }
  });

  document.getElementById("levelFilter").addEventListener("change", filterJobs);
  document.getElementById("typeFilter").addEventListener("change", filterJobs);
  document.getElementById("skillFilter").addEventListener("change", filterJobs);

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
