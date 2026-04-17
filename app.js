//Global statements:
let currentGroup = null; // this is just so we can understand which group is the user currently in, it is not used for anything else in the code

// TJEK TOKEN
//collecting username and password input
async function fetchUserData() { 
    /* fetches user data from the server, in this case users.json. 
        When i first started learning about async functions, i found it really confusing. 
        but its like having a dog, you make it wait until you tell it to ..idk
        */
    try { // for the first time we use "try", this means we want to try this block of code and see if it works, in other words, a test
        let response = await fetch('/data/users.json'); // here it is itself, the exact location of our file.
        let data = await response.json(); // await means, waiting until there's a response. took a while to figure that one out...
        let temp_token = data.temp_token; // here we convert the temp_token to a variable, making it match the python variable name
        // in our case right here we only want to get the temp token from the json
        sendTempTokenToPython(temp_token); // this is where we send the token to the python backend
        // we can also log it for debugging purposes incase that ever happens
        console.log(temp_token); // so just to be sure nothing fucks up, we log the token, if it does, we can easily find it
    
    } catch (error) { //this is the catch block, after allot of time, i found out it is needed when using "try", why we need?
        // well, it is basically a way to catch any errors that might happen in the try block, in other words, if something goes wrong in the try block, we can catch that error and do something with it, in this case, we just log it to the console
        console.error("failed to fetch user data"); // fix btw
    } 
}

// here we send the info to the python
async function sendTempTokenToPython(temp_token) { //instead of a empty bracket, we can now name it temp_token, since we are passing the temp_token variable to this function
    let res = await fetch("http://localhost:5000/check_token", { // reason for http is that we are making a request to a server, and so python server can understand it
        method: "POST", // here we send
        headers: { "Content-Type": "application/json" }, // and here we specify the content type, in this case, we are sending json
        body: JSON.stringify({ temp_token }) // here we convert the temp token to a json string, so python can read it
    }); 
    // responses 
    if (res.status === 401) { // in case of not authorized etc, we get this answer, 401. res means response
        window.location.href = "/login.html"; // and so it should redirect us to the login page afterwards, hrf is an part indicator of where it should go
        return; 
    }
// but if the token is valid, and all goes well we can process the result
    let result = await res.json(); 
    updateUIWithResult(result); // updates the ui
} /* reason we put 401 as the first thing to look out for is because it is an error we can expect,
and also its better, since it first looks for the most common response, and then checks for others 
*/

            // NOTE, I HAVENT FOUND A WAY TO SEND IT BACK TO THE LOGIN.HTML, ITS JUST AN IDEA


//GET ROOMS
async funciton getRooms(){
    try {
    let response = await fetch('/data/users.json');
    let data = await response.json();
    let temp_token = data.tempoken;
        
        
    sendTempTokenToPython(temp_token); 
    console.log(temp_token); 
        
    } catch (error) {
    console.error("failed to fetch user data");
    }
}
async function sendTempTokenToPython(temp_token) {  
    let res = await fetch("http://localhost:5000/get_rooms", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temp_token }) 
    }); 
    // response
    let result = await res.json(); 
    updateUIWithResult(result); 

            // NOTE, I HAVENT FOUND A WAY TO SEND IT BACK TO THE HOMEPAGE.HTML, ITS JUST AN IDEA

/* main idea, ui wants list of rooms, making app send temp token again like last time to server, it checks again, validates, if failed it gives 401
if it succeedes then we get the rooms the user has access to, and send it back to the ui

here we have to somewhat do the same as before, but additionally we need to add allot in the ui, especially when it comes to functionality and multiple choices
not only does it have to show what there is, but also function.
*/








/*
we also need to think about, when we give access:
additional buttons, are needed like "last messages", "back button", "leave group"
we need to allow the user to see aprox the last 30 messages sent, in the group
and find out a way to add a scroll mechanic, to see older messages
adding groups and members to the group
scrolling through groups
adding file selection for pictures and etc when texting, (pretty optional)

we havent even begun encryption, what should we go with,
token expireation
and so much more, we have limited time, but more than enough idk....

*/


//GROUP SELECTION
async function ChooseGroup(group) // this is where we just create a new function called ChooseGroup, which takes in a parameter called group. We choose to use async just so that it allows a long running task such as fetching.
{
currentGroup = group; // this is just so we can understand which group is the user currently in, it is not used for anything else in the code
const temp_token = localStorage.getItem("token"); // Here we just get a token from local storage, which is just a way to store data on the user's browser. We use this token to authenticate the user when we make a request to the server.
const response = await fetch("http://localhost:5000/group",// Here we just make a fetch request to the server, which is just a way to make a request to the server and get a response back. We use the await keyword just so that we can wait for the response before we continue with the rest of the code.
    {
method: "POST", // Here we just specify that we want to make a POST request, which is just a way to send data to the server.
headers: {"content-type": "application/json"},// we tell server that we are sending JSON data, which is just a way to format data so that it can be easily read by the server.
body: JSON.stringify({ // Here we just specify the body of the request, which is just the data that we want to send to the server. We use JSON.stringify just so that we can convert our data into a JSON string, which is just a way to format data so that it can be easily read by the server.
    temp_token: temp_token, // Here we just send the token that we got from local storage, which is just a way to authenticate the user when we make a request to the server.
    group: groupName, // Here we just send the group that the user selected, which is just a way to tell the server which group the user wants to join.
    
})
});
const data = await response.json(); // Here we just get the response from the server and convert it into a JSON object, which is just a way to format data so that it can be easily read by the server.
console.log("MESSAGES:", data); // Here we just log the data that we got from the server, which is just a way to see what the server sent back to us.
displayMessages(data);// we just send message  to the displayMessages function, which is just a way to display the messages that we got from the server on the page.
}




async function fetchMessages(){ // this is where we just create a new function called fetchMessages, which is just a way to get the messages from the server. We use async just so that it allows a long running task such as fetching.

try {
    const temp_token = localStorage.getItem("token"); // Here we just get a token from local storage, which is just a way to store data on the user's browser. We use this token to authenticate the user when we make a request to the server.
    if (!temp_token) {
        window.location.href = "/login.html"; // Here we just check if the token exists, and if it doesn't, we just redirect the user to the login page, which is just a way to make sure that only authenticated users can access the page.
        return null; // Here we just return null, which is just a way to stop the function from running if the token doesn't exist.
    }
if (!currentGroup) {
    console.warn(' fetchMessages : no group selected'); //  Here we just check if the current group is selected, and if it isn't, we just log a warning to the console, which is just a way to let the developer know that there is an issue with the code.
    return null; // Here we just return null, which is just a way to stop the function from running if the current group isn't selected.
}

// Here we just make a fetch request to the server, which is just a way to make a request to the server and get a response back. We use the await keyword just so that we can wait for the response before we continue with the rest of the code.
let  res = await fetch('http://localhost:5000/mmessages',{
    method: "POST", // Here we just specify that we want to make a POST request, which is just a way to send data to the server.
    headers: {"content-type": "application/json"},// we tell server that we are sending JSON data, which is just a way to format data so that it can be easily read by the server.
    body: JSON.stringify({ temp_token, group: currentgroup}) // Here we just specify the body of the request, which is just the data that we want to send to the server. We use JSON.stringify just so that we can convert our data into a JSON string, which is just a way to format data so that it can be easily read by the server. We send the token and the current group that the user selected, which is just a way to tell the server which group we want to get the messages from and also to authenticate the user.
});

if (res.status === 404 || res.status === 405)// here we just check if the response status is 404 or 405, which is just a way to check if there was an error with the request, and if there was, we just log a warning to the console, which is just a way to let the developer know that there is an issue with the code.
{const url = "http://localhost:5000/mmessages?group=${encodeURIComponent(currentGroup)}"; // Here we just create a url variable, which is just a way to store the url that we want to make the request to. We use encodeURIComponent just so that we can encode the current group name, which is just a way to make sure that the group name is properly formatted for the url.
    res = await fetch(url, {headers: {"X-Token": temp_token}});// Here we just make a fetch request to the server, which is just a way to make a request to the server and get a response back. We use the await keyword just so that we can wait for the response before we continue with the rest of the code. We also send the token in the headers, which is just a way to authenticate the user when we make a request to the server.
}

if (res.status === 401) { // Here we just check if the response status is 401, which is just a way to check if the user is not authorized, and if they are not, we just redirect them to the login page, which is just a way to make sure that only authenticated users can access the page.
    window.location.href = "/login.html";
return null; // Here we just return null, which is just a way to stop the function from running if the user is not authorized.
}
if (!res.ok) { // Here we just check if the response is not ok, which is just a way to check if there was an error with the request, and if there was, we just log a warning to the console, which is just a way to let the developer know that there is an issue with the code.
    console.error("fetchMessages failed", res.status, await res.text());}// Here we just log an error to the console, which is just a way to let the developer know that there is an issue with the code. We also log the response status and the response text, which is just a way to get more information about the error.
    return null; // Here we just return null, which is just a way to stop the function from running if there was an error with the request.
}
 const payloaud = await res.json();// Here we just get the response from the server and convert it into a JSON object, which is just a way to format data so that it can be easily read by the server.

//
 const messages = payloaud.messages || payloaud; // Here we just get the messages from the payload, which is just a way to get the data that we want to display on the page. We use the || operator just so that if the messages property doesn't exist in the payload, we can just use the entire payload as the messages, which is just a way to make sure that we have the data that we want to display on the page.
const groupkey = payloaud.groupkey || payloaud.GROUP_KEY || payloaud.group_key || null; // Here we just get the group key from the payload, which is just a way to get the data that we want to use for encryption. We use the || operator just so that if the group key property doesn't exist in the payload, we can just use null as the group key, which is just a way to make sure that we have a value for the group key even if it doesn't exist in the payload.

// keep only the latest 50 messages, in case there are too many, we just want to display the most recent ones, which is just a way to make sure that the page doesn't get too cluttered with messages and also to make sure that we are displaying the most relevant messages to the user.
const last50 = Array.isArray(messages) ? messages.slice(-50) : []; // Here we just check if the messages is an array, which is just a way to make sure that we are working with the correct data type. If it is an array, we just slice the last 50 messages from the array, which is just a way to get the most recent messages. If it is not an array, we just use an empty array as the last 50 messages, which is just a way to make sure that we have a value for the last 50 messages even if the messages is not an array.

// update UI if function exists, which is just a way to check if the function that we want to use to update the UI exists, and if it does, we just call that function with the last 50 messages and the group key, which is just a way to update the UI with the most recent messages and also to use the group key for encryption if needed.
if (typeof displayMessages === "function") // Here we just check if the displayMessages function exists, which is just a way to make sure that we can use that function to update the UI. If it does exist, we just call that function with the last 50 messages and the group key, which is just a way to update the UI with the most recent messages and also to use the group key for encryption if needed.
{
    try{
        displayMessages({messages : last50, groupkey: groupkey}); // Here we just call the displayMessages function with the last 50 messages and the group key, which is just a way to update the UI with the most recent messages and also to use the group key for encryption if needed. We use an object to pass both the messages and the group key, which is just a way to make it easier to pass multiple values to the function.
    } catch (uiErr) {
        console.warn("displayMessages error:", uiErr); // Here we just log a warning to the console if there was an error with the displayMessages function, which is just a way to let the developer know that there is an issue with the code. We also log the error itself, which is just a way to get more information about the error.
    }
}
return { messages: last50, groupkey}; // Here we just return an object with the last 50 messages and the group key, which is just a way to return the data that we got from the server and also to use the group key for encryption if needed. We use an object to return both the messages and the group key, which is just a way to make it easier to return multiple values from the function.
} catch (err) {
    console.error("fetchMessages error:", err); // Here we just log an error to the console if there was an error with the fetchMessages function, which is just a way to let the developer know that there is an issue with the code. We also log the error itself, which is just a way to get more information about the error.
    return null; // Here we just return null, which is just a way to stop the function from running if there was an error with the fetchMessages function.
}
}