// let ws, currentUser;

// function connect() {
//   currentUser = document.getElementById("name").value;
//   if (!currentUser) {
//     alert("Please enter your name before connecting.");
//     return;
//   }

//   // Pass userId in query param
//   ws = new WebSocket("ws://localhost:8080/chat?userId=" + encodeURIComponent(currentUser));

//   ws.onopen = function () {
//     console.log("Connected as", currentUser);
//     document.getElementById("connectButton").disabled = true;
//     document.getElementById("connectButton").value = "Connected";
//     document.getElementById("name").disabled = true;
//   };

//   ws.onmessage = function (e) {
//     let messageData = JSON.parse(e.data);
//     printMessage(messageData);
//   };
  

//   ws.onclose = function () {
//     console.log("Disconnected");
//     document.getElementById("connectButton").disabled = false;
//     document.getElementById("connectButton").value = "Connect";
//     document.getElementById("name").disabled = false;
//   };
// }

// // Print incoming message on browser
// function printMessage(data) {
//     let messages = document.getElementById("messages");
//     let newMessage = document.createElement("div");
//     newMessage.className = "incoming-message";
//     newMessage.innerHTML = data.from + " ➔ " + data.to + ": " + data.message;
//     messages.appendChild(newMessage);
//   }
  

// // Send message to specific user
// function sendToUser() {
//     if (ws == undefined) return;
  
//     let messageText = document.getElementById("message").value;
//     let name = document.getElementById("name").value;
//     let targetUser = document.getElementById("targetUser").value;  // <-- NEW FIELD
  
//     let messageObject = {
//       from: name,
//       to: targetUser,
//       message: messageText,
//     };
  
//     ws.send(JSON.stringify(messageObject));
//   }
  

  // Show own message on screen
//   let messages = document.getElementById("messages");
//   let newMessage = document.createElement("div");
//   newMessage.className = "outgoing-message";
//   newMessage.innerHTML = `<b>${currentUser}</b> ➔ <b>${targetUser}</b>: ${messageText}`;
//   messages.appendChild(newMessage);

//   ws.send(JSON.stringify(messageObject));
// }
let socket;
let currentCompId = null;



function connectToComplaint() {
    let compId = document.getElementById("compId").value;
    if (socket) {
        socket.close();
        console.log(`Disconnected from complaint ${currentCompId}`);
    }

    currentCompId = compId;
    socket = new WebSocket(`ws://localhost:8080/chat?compId=${compId}`);

    socket.onopen = () => {
        console.log(`Connected to complaint ${compId}`);
    };

    socket.onmessage = (event) => {
        const li = document.createElement('li');
        li.textContent = event.data;
        document.getElementById('messages').appendChild(li);
    };

    socket.onclose = () => {
        console.log(`Socket closed for complaint ${compId}`);
    };
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        input.value = '';
    } else {
        console.log('Socket is not connected');
    }
}
