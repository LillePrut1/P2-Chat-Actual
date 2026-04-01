// =======================
// GLOBAL STATE
// =======================
let currentGroup = null;
let messages = {};


// =======================
// EVENT LISTENERS
// =======================
document.getElementById("login-btn").addEventListener("click", handleLogin);
document.getElementById("create-group-btn").addEventListener("click", createGroup);
document.getElementById("send-btn").addEventListener("click", sendMessage);


// =======================
// LOGIN
// =======================
async function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    console.log("Trying login:", username);

    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login success:", data);

            const token = data.token || "fake-token";

            // 🔥 REMEMBER ME LOGIC
            if (rememberMe) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }

            showApp();

        } else {
            alert("Login failed");
        }

    } catch (error) {
        console.log("Backend not running → using fake login");

        const token = "fake-token";

        if (rememberMe) {
            localStorage.setItem("token", token);
        } else {
            sessionStorage.setItem("token", token);
        }

        showApp();
    }
}


// =======================
// SHOW APP / HIDE LOGIN
// =======================
function showApp() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("app").style.display = "block";
}


// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    document.getElementById("app").style.display = "none";
    document.getElementById("login-section").style.display = "block";
}


// =======================
// GROUPS
// =======================
function createGroup() {
    const groupName = document.getElementById("group-name").value;

    if (groupName === "") return;

    const groupList = document.getElementById("group-list");

    const li = document.createElement("li");
    li.textContent = groupName;

    li.addEventListener("click", () => selectGroup(groupName));

    groupList.appendChild(li);

    messages[groupName] = [];

    document.getElementById("group-name").value = "";

    console.log("Group created:", groupName);
}


// =======================
// SELECT GROUP
// =======================
function selectGroup(groupName) {
    currentGroup = groupName;

    document.getElementById("current-group").textContent = groupName;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    const groupMessages = messages[groupName];

    groupMessages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = msg;
        chatBox.appendChild(msgDiv);
    });
}


// =======================
// SEND MESSAGE
// =======================
function sendMessage() {
    const message = document.getElementById("message-input").value;

    if (!currentGroup) {
        alert("Select a group first!");
        return;
    }

    if (message === "") return;

    const formattedMessage = "You: " + message;

    messages[currentGroup].push(formattedMessage);

    const chatBox = document.getElementById("chat-box");

    const msgDiv = document.createElement("div");
    msgDiv.textContent = formattedMessage;

    chatBox.appendChild(msgDiv);

    document.getElementById("message-input").value = "";
}


// =======================
// AUTO LOGIN (SESSION)
// =======================
window.onload = function () {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {
        console.log("Auto login");

        showApp();
    }
};