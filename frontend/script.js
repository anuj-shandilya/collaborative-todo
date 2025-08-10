// === CONFIG ===
const WS_SERVER = "ws://localhost:8080";
// === STATE ===
let nickname = "";
let allUsers = new Set();
let tasks = [];

// === DOM ===
const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("nickname");
const usersDiv = document.getElementById("users");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const assigneeSelect = document.getElementById("assignee-select");
const tasksUl = document.getElementById("tasks");
const notificationsDiv = document.getElementById("notifications");

let ws;

// === FUNCTIONS ===
function connectWS() {
    ws = new WebSocket(WS_SERVER);
    ws.onopen = () => {
        notify(`Connected as ${nickname}`);
        ws.send(JSON.stringify({ type: "join", nickname }));
    };
    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (!msg || msg.nickname === nickname) return;

            switch (msg.type) {
                case "join":
                    allUsers.add(msg.nickname);
                    renderUsers();
                    notify(`${msg.nickname} joined`);
                    break;
                case "leave":
                    allUsers.delete(msg.nickname);
                    renderUsers();
                    notify(`${msg.nickname} left`);
                    break;
                case "task":
                    applyTaskEvent(msg.data);
                    break;
            }
        } catch { }
    };
}

function broadcast(type, data) {
    if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ type, nickname, data }));
    }
}

function renderUsers() {
    usersDiv.textContent = "Connected: " + Array.from(allUsers).join(", ");
    assigneeSelect.innerHTML = "";
    allUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user;
        opt.textContent = user;
        assigneeSelect.appendChild(opt);
    });
    if (!allUsers.has(nickname) && nickname) {
        const opt = document.createElement("option");
        opt.value = nickname;
        opt.textContent = nickname + " (You)";
        assigneeSelect.appendChild(opt);
    }
    assigneeSelect.value = nickname;
}

function renderTasks() {
    tasksUl.innerHTML = "";
    tasks.forEach((task, idx) => {
        const li = document.createElement("li");
        li.className = task.done ? "done" : "";
        li.innerHTML = `
      <span>${escapeHTML(task.title)} <span class="task-meta">[${task.assignee}]</span></span>
      <span>
        <button onclick="completeTask(${idx})">${task.done ? "Undo" : "Done"}</button>
        <button onclick="deleteTask(${idx})">Delete</button>
      </span>`;
        tasksUl.appendChild(li);
    });
}

window.completeTask = function (idx) {
    tasks[idx].done = !tasks[idx].done;
    saveTasks();
    renderTasks();
    broadcast("task", { action: "complete", idx, done: tasks[idx].done });
};

window.deleteTask = function (idx) {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
    broadcast("task", { action: "delete", idx });
};

function applyTaskEvent(ev) {
    switch (ev.action) {
        case "add":
            tasks.push(ev.task);
            renderTasks();
            notify(`Task added by ${ev.task.assignee}`);
            break;
        case "complete":
            if (tasks[ev.idx]) {
                tasks[ev.idx].done = ev.done;
                renderTasks();
                notify(`Task marked ${ev.done ? "done" : "undone"} by ${tasks[ev.idx].assignee}`);
            }
            break;
        case "delete":
            if (tasks[ev.idx]) {
                const t = tasks[ev.idx];
                tasks.splice(ev.idx, 1);
                renderTasks();
                notify(`Task deleted by ${t.assignee}`);
            }
            break;
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const raw = localStorage.getItem("tasks");
    tasks = raw ? JSON.parse(raw) : [];
}

function notify(text) {
    notificationsDiv.textContent = text;
    setTimeout(() => notificationsDiv.textContent = "", 2000);
}

function escapeHTML(str) {
    return str.replace(/[<>&"]/g, c => {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
}

// === EVENT HANDLERS ===
nicknameForm.onsubmit = (e) => {
    e.preventDefault();
    nickname = nicknameInput.value.trim();
    if (!nickname) return;
    allUsers.add(nickname);
    nicknameForm.style.display = "none";
    taskForm.style.display = "";
    connectWS();
    renderUsers();
    loadTasks();
    renderTasks();
};

taskForm.onsubmit = (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    const assignee = assigneeSelect.value;
    const task = { title, assignee, done: false };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    broadcast("task", { action: "add", task });
};

// Tell others we left
window.addEventListener('beforeunload', () => {
    broadcast("leave", {});
});
