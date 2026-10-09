const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const taskList = document.getElementById("taskList");
const resultMessage = document.getElementById("resultMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

displayTasks(tasks);

searchBtn.addEventListener("click", function () {
    searchTasks();
});

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchTasks();
    }
});

function searchTasks() {
    const searchText = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(function (task) {
        return task.text.toLowerCase().includes(searchText);
    });

    displayTasks(filteredTasks);
}

clearSearchBtn.addEventListener("click", function () {
    searchInput.value = "";
    displayTasks(tasks);
});

function displayTasks(taskArray) {
    taskList.innerHTML = "";

    resultMessage.textContent =
        taskArray.length + " task(s) found.";

    if (taskArray.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No tasks found.";
        taskList.appendChild(li);
        return;
    }

    taskArray.forEach(function (task) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.appendChild(span);
        taskList.appendChild(li);
    });
}
