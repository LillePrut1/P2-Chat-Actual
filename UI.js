// refresh delay (2 sec for now)
const POLL_MS = 2000;

// basic state
let currentUser = null;
let currentGroup = null;
let messages = [];

// keeping this empty for now. Ill put all the html element refs in here later
const ui = {};

// this will connect buttons and inputs to the functions once i have the actual html ids
function setupUI() {
    // nothing yet
}

// quick error helper
function showError(message) {
    console.error("Error:", message);
}

// just printing things so I can see if stuff works
function updateChatUI() {
    console.log("UI updated");
    console.log("user:", currentUser);
    console.log("group:", currentGroup);
    console.log("messages:", messages);
}

// testing message output
function displayMessages(messages) {
    console.log("=== Messages ===");
    for (let msg of messages) {
        console.log(msg);
    }
}

// fake inputs until html fields are available
function getInputValues() {
    return {
        username: "al1",
        password: "asdfasdf123",
        message: "nissan, suzuki, yamaha",
        groupName: "MyGroup"
    };
}

// nothing to clear yet but keeping this here for later
function clearInputFields() {
    console.log("cleared inputs");
}

// login flow (temp)
function handleLoginClick() {
    const data = getInputValues();

    if (!data.username) {
        showError("username missing");
        return;
    }
    if (!data.password) {
        showError("password missing");
        return;
    }

    currentUser = data.username;
    console.log("logged in as:", currentUser);

    updateChatUI();
}

// same idea as login but separate for later logic
function handleRegisterClick() {
    const data = getInputValues();

    if (!data.username) {
        showError("username missing");
        return;
    }
    if (!data.password) {
        showError("password missing");
        return;
    }

    console.log("registered:", data.username);
    currentUser = data.username;

    updateChatUI();
}

// send a message (fake for now)
function handleSendMessage() {
    const data = getInputValues();

    if (!currentUser) {
        showError("not logged in");
        return;
    }

    if (!data.message || data.message.trim() === "") {
        showError("empty message");
        return;
    }

    if (data.message.length > 200) { 
        showError("message too long");
        return;
    }

    messages.push(data.message);
    console.log("sent:", data.message);

    displayMessages(messages);
    clearInputFields();
    updateChatUI();
}

// create group (still fake)
function handleCreateGroup() {
    const data = getInputValues();

    if (!currentUser) {
        showError("login first");
        return;
    }

    if (!data.groupName || data.groupName.trim() === "") {
        showError("group name missing");
        return;
    }

    if (data.groupName.length > 20) {
        showError("group name too long");
        return;
    }

    currentGroup = data.groupName;
    console.log("new group:", currentGroup);

    updateChatUI();
}

/*
test/scrap:
currentUser = "Ali";
currentGroup = "General";
messages = ["hello", "hi"];
updateChatUI();
*/