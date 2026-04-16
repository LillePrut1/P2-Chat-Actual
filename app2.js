// TJEK TOKEN

//collecting username and password input
async function fetchUserData() { 
    /* fetches user data from the server, in this case users.json. 
        When i first started learning about async functions, i found it really confusing. 
        but its like having a dog, you make it wait until you tell it to ..idk
        */
    try { // for the first time we use "try", this means we want to try this block of code and see if it works, in other words, a test
        let response = await fetch('/path/to/users.json'); // here it is itself, the exact location of our file.
        let data = await response.json(); // await means, waiting until there's a response. took a while to figure that one out...
        let temp_token = data.temp_token; // here we convert the temp_token to a variable, making it match the python variable name
        // in our case right here we only want to get the temp token from the json
        sendTempTokenToPython(temp_token); // this is where we send the token to the python backend
        // we can also log it for debugging purposes incase that ever happens
        console.log(temp_token); // so just to be sure nothing fucks up, we log the token, if it does, we can easily find it
    
    } catch (error) { //this is the catch block, after allot of time, i found out it is needed when using "try", why we need?
        // well, it is basically a way to catch any errors that might happen in the try block, in other words, if something goes wrong in the try block, we can catch that error and do something with it, in this case, we just log it to the console
        console.error("failed to fetch user data"); // wi fix btw
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

//GET ROOMS

/* main idea, ui wants list of rooms, making app send temp token again like last time to server, it checks again, validates, if failed it gives 401
if it succeedes then we get the rooms the user has access to, and send it back to the ui

here we have to somewhat do the same as before, but additionally we need to add allot in the ui, especially when it comes to functionality and multiple choices
not only does it have to show what there is, but also function.

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
