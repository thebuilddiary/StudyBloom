
/* =================================
   STUDYBLOOM — WEEKLY TIMETABLE
================================= */

const timetableForm = document.getElementById("timetable-form");
const timetableList = document.getElementById("timetable-list");
const timetableFilter = document.getElementById("timetable-filter");

const timetableDay = document.getElementById("timetable-day");
const timetableSubject = document.getElementById("timetable-subject");
const timetableStart = document.getElementById("timetable-start");
const timetableEnd = document.getElementById("timetable-end");

// Load saved timetable
let timetableSlots = JSON.parse(
  localStorage.getItem("studybloom-timetable")
) || [];

// Save timetable
function saveTimetable() {
  localStorage.setItem(
    "studybloom-timetable",
    JSON.stringify(timetableSlots)
  );
}

// Weekday order
const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

// Display timetable
function renderTimetable() {
  timetableList.innerHTML = "";

  const selectedDay = timetableFilter.value;

  let visibleSlots = [...timetableSlots];

  if (selectedDay !== "All") {
    visibleSlots = visibleSlots.filter(
      slot => slot.day === selectedDay
    );
  }

  visibleSlots.sort((a, b) => {
    const dayDifference =
      weekdayOrder.indexOf(a.day) -
      weekdayOrder.indexOf(b.day);

    if (dayDifference !== 0) return dayDifference;

    return a.start.localeCompare(b.start);
  });

  if (visibleSlots.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = selectedDay === "All"
      ? "Your timetable is empty."
      : `No study slots planned for ${selectedDay}.`;

    timetableList.appendChild(message);
    return;
  }

  visibleSlots.forEach(slot => {
    const card = document.createElement("div");
    card.className = "timetable-slot";

    const details = document.createElement("div");

    const heading = document.createElement("h4");
    heading.textContent = slot.subject;

    const day = document.createElement("p");
    day.textContent = slot.day;

    const time = document.createElement("p");
    time.textContent = `${slot.start} – ${slot.end}`;

    details.append(heading, day, time);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-timetable-slot";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      timetableSlots = timetableSlots.filter(
        item => item.id !== slot.id
      );

      saveTimetable();
      renderTimetable();
    });

    card.append(details, deleteButton);
    timetableList.appendChild(card);
  });
}

// Add a timetable slot
timetableForm.addEventListener("submit", event => {
  event.preventDefault();

  const start = timetableStart.value;
  const end = timetableEnd.value;

  if (start >= end) {
    alert("End time must be later than start time.");
    return;
  }

  const newSlot = {
    id: Date.now() + Math.random(),
    day: timetableDay.value,
    subject: timetableSubject.value.trim(),
    start: start,
    end: end
  };

  if (!newSlot.day || !newSlot.subject) return;

  timetableSlots.push(newSlot);

  saveTimetable();
  renderTimetable();

  timetableForm.reset();
});

// Change day filter
timetableFilter.addEventListener("change", renderTimetable);

// Display saved slots
renderTimetable();

console.log("StudyBloom timetable is ready!");
