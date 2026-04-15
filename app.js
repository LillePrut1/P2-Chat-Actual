//Global statements:
let currentGroup = null; // this is just so we can understand which group is the user currently in, it is not used for anything else in the code

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