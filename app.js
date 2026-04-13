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
            const token = data.token;

            if (rememberMe) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }

            loadGroups();
            showApp();
        } else {
            alert(data.error);
        }

    } catch (error) {
        alert("Server not running");
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

    li.addEventListener("click", () => {
        selectGroup(groupName);

        document.querySelectorAll("#group-list li").forEach(item => {
            item.classList.remove("active-group");
        });

        li.classList.add("active-group");
    });

    groupList.appendChild(li);

    messages[groupName] = [];

    document.getElementById("group-name").value = "";

    console.log("Group created:", groupName);
}


// =======================
// SELECT GROUP
// =======================
async function selectGroup(groupName) {
    currentGroup = groupName;

    document.getElementById("current-group").textContent = groupName;

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const response = await fetch("http://localhost:8000/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token,
            group: groupName
        })
    });

    const data = await response.json();

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    data.messages.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = msg.sender + ": " + msg.ciphertext;
        chatBox.appendChild(div);
    });
}


// =======================
// SEND MESSAGE
// =======================
async function sendMessage() {
    const message = document.getElementById("message-input").value;

    if (!currentGroup) {
        alert("Select a group first!");
        return;
    }

    if (message === "") return;

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:8000/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                group: currentGroup,
                ciphertext: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert("Failed to send message");
            return;
        }

        // VIS BESKED I UI
        const chatBox = document.getElementById("chat-box");

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", "my-message");

        const text = document.createElement("div");
        text.textContent = message;

        const time = document.createElement("div");
        time.classList.add("timestamp");
        time.textContent = new Date().toLocaleTimeString();

        msgDiv.appendChild(text);
        msgDiv.appendChild(time);

        chatBox.appendChild(msgDiv);

        document.getElementById("message-input").value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.log("Error sending message:", error);
        alert("Server error");
    }
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

// =======================
// THEME TOGGLE (PLACER HER)
// =======================
document.getElementById("theme-toggle").addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
    }
});


async function loadGroups() {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const response = await fetch("http://localhost:8000/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    });

    const data = await response.json();

    const groupList = document.getElementById("group-list");
    groupList.innerHTML = "";

    data.groups.forEach(group => {
        const li = document.createElement("li");
        li.textContent = group;

        li.onclick = () => selectGroup(group);

        groupList.appendChild(li);
    });
}