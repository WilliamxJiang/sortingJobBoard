[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/fcr-Lcjc)
# Mini Project 3: Upwork Jobs Analysis

The Job Analysis Project involves analyzing job data from a JSON file, implementing filtering and sorting functionality on a webpage to help users easily explore job listings. The project aims to build a comprehensive user interface that allows for interactive data exploration, including filtering by job attributes and sorting job listings. This will give you practical experience in working with JSON data, JavaScript, and DOM manipulation.

## Basic Requirements

1. **HTML Layout**: Create a well-structured HTML page that provides an intuitive user interface for users to upload data, filter job listings, and apply sorting. The layout should include an input element for file uploads, filter forms for different criteria, and a display area for job listings. Ensure the page is styled appropriately for easy navigation.

![HTML Layout](Examples/layout.png)

2. **Data Loading**: The webpage should allow users to load job data from a JSON file. The data must be properly parsed, and any errors during loading should be handled gracefully, ensuring the program doesn't crash. Users will first browse and upload the JSON file containing job listings, after which the job data will be displayed in a list format. **Note: Due to browser security restrictions, JavaScript cannot directly access local files without user interaction. Therefore, users must manually select and upload the JSON file; attempting to directly load local files via JavaScript will not work.**

![Data Loading](Examples/loaddata.png)

3. **Job Class Definition**: Define a `Job` class to encapsulate the details of each job entry, such as title, posted time, type, level, skill, and detail. Use JavaScript to create methods for retrieving and formatting job details.

4. **Filtering Functionality**: Implement filtering functionality that allows users to filter jobs based on criteria such as job `Level`, `Type`, and `Skill`. The filtering options should be generated based on the available data. As users select different filters, the job listing will be updated to reflect only those jobs that match the selected criteria.

![Filter](Examples/filter.png)

5. **Sorting Functionality**: Provide sorting options to allow users to sort job listings by title or by posted time, ensuring that time values are standardized for correct sorting.

![Sorting](Examples/sorting.png)

6. **Error Handling**: Ensure the application handles incomplete or incorrect data gracefully, providing informative error messages without crashing.

![Error](Examples/error.png)


7. **Interactive Job Details**: Users can click on each job listing to view more detailed information about the job, including attributes such as title, type, level, skill, and detail. This ensures users can easily access all relevant information for a given job.

![Details](Examples/details.png)
