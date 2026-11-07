
// STUDYBLOOM - App Functionality

// Get today's date
const today = new Date();

const formattedDate = today.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

// Display today's date
const overview = document.getElementById("overview-content");

overview.innerHTML = `
  <div class="overview-message">
    <p class="today-date">${formattedDate}</p>

    <h3>Your learning journey starts here.</h3>

    <p>
      Your study planner, timetable, tasks and progress
      will all have a home here.
    </p>
  </div>
`;

console.log("StudyBloom is running!");
