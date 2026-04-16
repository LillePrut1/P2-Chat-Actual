// refresh delay on 2 sec, meaning the server will refresh every 2 seconds
const POLL_MS = 2000;

/*this is the basic state, holding user, group, and messages that are being used at the moment
it will be updated as the user interacts with the app, making so easy to tell what is what and what is active
messages are different since it is an array that holds all messages sent in the current group, compared to user and group that are single values
static and dynamic :)
*/ 
let currentUser = null;
let currentGroup = null;
let messages = [];

// this is state of the ui, meaning it will hold all the references to the html elements
const ui = {};

// and this is a reference to the chat messages container
function setupUI() {
    // im pretty confused on this part, so ill put it on hold for now..    
}

// here is where the error messages will be displayed
function showError(message) {
    console.error("Error:", message);
}

// this is where the chat ui will be updated, meaning it will show the state of the app,
// such also very important, its showing/converts the current user, group, messages etc to a new state
function updateChatUI() {
    console.log("UI updated");
    console.log("user:", currentUser);
    console.log("group:", currentGroup);
    console.log("messages:", messages);
}

// this is where the messages will be displayed, meaning it will show all messages in the current group
    //- note, we need to make a limit for the ones joining, so on log in they can see prox the last 50 messages
    // and we need to research how scrolling and the message part will work, since its a chat app
function displayMessages(messages) {
    console.log("=== Messages ===");
    for (let msg of messages) {
        console.log(msg);
    }
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

// dont know how and where i should put this, this took me awhile, but ig well let it stay here for now, untill we find a better soultuion..
function updateUIWithResult(result) { 
    console.log(result);

    if (result.error) {
        // show error in UI
        console.log("Invalid token");
    } else {
        // show user in UI
        console.log("User:", result.user);
    }
}function updateUIWithUser(user) {
    console.log("Logged in as:", user);
}

function updateUIWithError(msg) {
    console.log(msg);
}
