
/* =================================
   STUDYBLOOM - INTERACTIVE FEATURES
================================= */

// DATE
const dateElement = document.getElementById("current-date");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});


// TASK MANAGER

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("studybloom-tasks")) || [];

// Save tasks
function saveTasks() {
  localStorage.setItem("studybloom-tasks", JSON.stringify(tasks));
}

// Update statistics
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const remaining = total - completed;

  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  document.getElementById("total-tasks").textContent = total;
  document.getElementById("completed-tasks").textContent = completed;
  document.getElementById("remaining-tasks").textContent = remaining;

  document.getElementById("progress-bar").style.width =
    percentage + "%";

  document.getElementById("progress-text").textContent =
    total === 0
      ? "Complete your first task to start tracking progress."
      : `${percentage}% completed — ${completed} of ${total} tasks finished.`;
}

// Display tasks
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "No tasks added yet.";
    taskList.appendChild(message);
  }

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const taskName = document.createElement("span");
    taskName.textContent = task.name;

    if (task.completed) {
      taskName.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-task";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, taskName, deleteButton);
    taskList.appendChild(item);
  });

  updateProgress();
}

// Add a task
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskName = taskInput.value.trim();

  if (taskName === "") return;

  tasks.push({
    id: Date.now() + Math.random(),
    name: taskName,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
});

// Load saved tasks
renderTasks();


// NOTES

const notesInput = document.getElementById("notes-input");
const notesStatus = document.getElementById("notes-status");

// Load previously saved notes
notesInput.value = localStorage.getItem("studybloom-notes") || "";

// Save notes automatically
notesInput.addEventListener("input", () => {
  localStorage.setItem("studybloom-notes", notesInput.value);
  notesStatus.textContent = "Saved automatically ✓";
});


// SERVICE WORKER

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => {
        console.log("StudyBloom offline support is ready!");
      })
      .catch(error => {
        console.error("Service worker error:", error);
      });
  });
}

console.log("StudyBloom is running!");
