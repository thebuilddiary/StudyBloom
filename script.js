
/* =================================
   STUDYBLOOM — STUDY PLANNER
================================= */

const plannerForm = document.getElementById("planner-form");
const plannerList = document.getElementById("planner-list");

const plannerSubject = document.getElementById("planner-subject");
const plannerTopic = document.getElementById("planner-topic");
const plannerDate = document.getElementById("planner-date");
const plannerPriority = document.getElementById("planner-priority");

// Load saved study sessions
let plannerSessions = JSON.parse(
  localStorage.getItem("studybloom-planner")
) || [];

// Save sessions
function savePlannerSessions() {
  localStorage.setItem(
    "studybloom-planner",
    JSON.stringify(plannerSessions)
  );
}

// Format date without timezone shifting
function formatPlannerDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Display planned sessions
function renderPlannerSessions() {
  plannerList.innerHTML = "";

  if (plannerSessions.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "No study sessions planned yet.";
    plannerList.appendChild(message);
    return;
  }

  const sortedSessions = [...plannerSessions].sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  sortedSessions.forEach(session => {
    const card = document.createElement("div");
    card.className = "planner-session";

    if (session.completed) {
      card.classList.add("completed");
    }

    const top = document.createElement("div");
    top.className = "planner-session-top";

    const details = document.createElement("div");

    const heading = document.createElement("h4");
    heading.textContent = session.topic;

    const subject = document.createElement("p");
    subject.textContent = session.subject;

    const date = document.createElement("p");
    date.textContent = formatPlannerDate(session.date);

    const priority = document.createElement("span");
    priority.className = "priority-label";
    priority.textContent = session.priority + " priority";

    details.append(heading, subject, date, priority);
    top.appendChild(details);

    const actions = document.createElement("div");
    actions.className = "planner-session-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = session.completed
      ? "Mark incomplete"
      : "Mark complete";

    completeButton.addEventListener("click", () => {
      session.completed = !session.completed;
      savePlannerSessions();
      renderPlannerSessions();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-planner-session";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      plannerSessions = plannerSessions.filter(
        item => item.id !== session.id
      );

      savePlannerSessions();
      renderPlannerSessions();
    });

    actions.append(completeButton, deleteButton);
    card.append(top, actions);

    plannerList.appendChild(card);
  });
}

// Add a new study session
plannerForm.addEventListener("submit", event => {
  event.preventDefault();

  const session = {
    id: Date.now() + Math.random(),
    subject: plannerSubject.value,
    topic: plannerTopic.value.trim(),
    date: plannerDate.value,
    priority: plannerPriority.value,
    completed: false
  };

  if (!session.subject || !session.topic || !session.date) {
    return;
  }

  plannerSessions.push(session);

  savePlannerSessions();
  renderPlannerSessions();

  plannerForm.reset();
  plannerPriority.value = "Medium";
});

// Show previously saved sessions
renderPlannerSessions();

console.log("StudyBloom planner is ready!");
