// refresh delay on 3 sec, meaning the server will refresh every 3 seconds
const POLL_MS = 3000;


























/*------THIS PART IS UNDER DEV...

this is the basic state, holding user, group, and messages that are being used at the moment
it will be updated as the user interacts with the app, making so easy to tell what is what and what is active
messages are different since it is an array that holds all messages sent in the current group, compared to user and group that are single values
static and dynamic :)

let currentUser = null;
let currentGroup = null;
let messages = [];

// this is state of the ui, meaning it will hold all the references to the html elements
const ui = {};
//------

// here is where the error messages will be displayed
function showError(message) {
    console.error("Error:", message);
}
*/

/*
//NEW
// dont know how and where i should put this, this took me awhile, but ig well let it stay here for now, untill we find a better soultuion..
function updateUIWithResult(result) { 
    console.log(result);
/* up untill this was made i ran through most of the other functions in ther ui
and we removed the ones not used and kept the rest
This is also more simple to call it updateuiwithresults, instead of ui, or what?
maybe well change it to just update ui.

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

// Initialize UI element references
function initializeUI() {
    ui.messageContainer = document.getElementById('messages');
    ui.roomList = document.getElementById('rooms');
    ui.currentGroupName = document.getElementById('current-group');
    ui.errorMessage = document.getElementById('error-message');
    ui.userDisplay = document.getElementById('user-display');
}

// Call this when page loads
initializeUI();

function updateUIWithResult(result) { 
    if (result.error) {
        showError(result.error);
        ui.errorMessage.textContent = result.error;
    } else {
        console.log("User:", result.user);
        ui.userDisplay.textContent = `Logged in as: ${result.user}`;
    }
}
*/