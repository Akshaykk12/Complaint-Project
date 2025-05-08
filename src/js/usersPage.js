let greetBox = document.getElementById("greet");
const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

if (loggedInUser) {
  greetBox.innerHTML = `WELCOME, ${loggedInUser.Name}`; 
} else {
  window.location.href = "login.html";
}

function fileComplaint() {
    const container = document.getElementById("main-container");
    container.innerHTML = `
   <div class="complaint-form-container">
    <h2 class="complaint-form-caption">File a Complaint</h2>
    <form id="empForm">
        <div class="complaint-input-group">
            <label for="deptId">Department</label>
            <select id="deptId" required>
                <option value="">--SELECT--</option>
            </select>
        </div>

        <div class="complaint-input-group">
            <label for="compId">Complaint Type</label>
            <select id="compId" required>
                <option value="">--SELECT--</option>
            </select>
        </div>

        <div class="complaint-input-group">
            <label for="comId">Description</label>
            <textarea id="comId" placeholder="Enter Description" rows="4" cols="50"></textarea>
        </div>

        <div class="complaint-input-group">
            <label for="comDate">Date</label>
            <input id="comDate" type="date">
        </div>

        <button type="button" id="submit" onclick="addComplaint()">File Complaint</button>
    </form>
</div>

    `;

    loadDepartments();
    loadComplaintType();
}


const URL = "http://localhost:8080";
let departments = [];
let complaintType = [];

fetch(`${URL}/api/users/form-data`)
.then(res => res.json())
.then(data => {
    departments = data.departments;
    complaintType = data.complaintTypes;
    users = data.users;
});

function loadDepartments(){
    const deptSelect = document.getElementById("deptId");
        departments.forEach(dept => {
            deptSelect.innerHTML += `<option value="${dept.deptId}">${dept.deptName}</option>`;
        });
}

function loadComplaintType(){
    
    const ctSelect = document.getElementById("compId");
    complaintType.forEach(comp => {
        ctSelect.innerHTML += `<option value="${comp.compTypeId}">${comp.compType}</option>`;
    });
}


let counter = 2011;

function addComplaint() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const deptId = document.getElementById("deptId").value;
    const compId = document.getElementById("compId").value;
    const description = document.getElementById("comId").value;

    if (!deptId || !compId || !description || !loggedInUser) {
        alert("Please fill all fields and make sure you're logged in.");
        return;
    }
    const complaint = {
        userId: loggedInUser.id,  
        deptId: deptId,
        ctId: compId,
        description: description,
        status: "Pending"
    };

    fetch(`${URL}/api/complaints`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint)
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to log complaint.");
        return res.json();
    })
    .then(() => {
        counter++;
        alert("Complaint logged successfully!");
        document.getElementById("empForm").reset(); 
       
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong while filing the complaint.");
    });
    sessionStorage.setItem("lastPageVisited", "fileComplaint");
}

function getDeptName(deptID) {
    const dept = departments.find(d => d.deptId === deptID);
    return dept ? dept.deptName : "Unknown";
}

function getComplaintTypeName(ctID) {
    const ct = complaintType.find(t => t.compTypeId == ctID);
    return ct ? ct.compType : "Unknown";
}


function showComplaints(){
    const container = document.getElementById("main-container");
    container.innerHTML = `<h2>Your Complaint History</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; text-align: left; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Department</th>
                    <th>Complaint Type</th>
                    <th>Description</th>
                    <th>Date Filed</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="complaintTableBody">
                <tr><td colspan="6">Loading...</td></tr>
            </tbody>
        </table>
    `;

    fetch(`${URL}/api/complaints`)
        .then(res => res.json())
        .then(complaints => {
            const userComplaints = complaints.filter(c => c.userId === loggedInUser.id);

            if (userComplaints.length === 0) {
                document.getElementById("complaintTableBody").innerHTML = `
                    <tr><td colspan="6">No complaints found.</td></tr>`;
                return;
            }

            const rows = userComplaints.map(c => `
                <tr>
                    <td>${getDeptName(c.deptId)}</td>
                    <td>${getComplaintTypeName(c.ctId)}</td>
                    <td>${c.description}</td>
                    <td>${c.date}</td>
                    <td>${c.status}</td>
                    <td>
                        <div onclick="deleteComplaint('${c.compId}')">🗑️</div>
                        <div onclick="chatService('${c.compId}')">💬</div>
                    </td>
                </tr>
            `).join("");

            document.getElementById("complaintTableBody").innerHTML = rows;
        })
        .catch(err => {
            console.error("Error fetching complaints:", err);
            document.getElementById("complaintTableBody").innerHTML = `
                <tr><td colspan="6">Error loading complaint history.</td></tr>`;
        });
}
function deleteComplaint(id) {
    console.log(id);
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/api/complaints/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            console.log("Delete successful");
        })
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "deleteComp");
        showComplaints();
    }
  }
  let socket = null;
  function chatService(id){
    const container = document.getElementById("main-container");
    container.innerHTML = `
    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 80vh; padding: 10px; ">

        <!-- Chat messages section -->
        <div style="flex-grow: 1; overflow-y: auto; background-color: #f5f5f5; padding: 10px; border-radius: 10px;">
            <ul id="messages" style="list-style-type: none; padding: 0; margin: 0;">
                <!-- Example message block -->
                <!-- <li style="margin-bottom: 20px;">
                    <div style="max-width: 60%; background-color: lightgray; border-radius: 10px; padding: 10px;">
                        Hi !! This is a message from Riya. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>
                    <div style="font-size: 12px; color: gray; margin-top: 5px;">18:06 PM | July 24</div>
                </li>
    
                <li style="margin-bottom: 20px; text-align: right;">
                    <div style="display: inline-block; max-width: 60%; background-color: #44B78B; border-radius: 10px; padding: 10px; color: white;">
                        Hi Riya, Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>
                    <div style="font-size: 12px; color: gray; margin-top: 5px;">18:30 PM | July 24</div>
                </li> -->
                <!-- Repeat more <li> as needed -->
            </ul>
        </div>
    
        <!-- Message input section -->
        <div style="margin-top: 10px; display: flex; justify-content: center; align-items: center;">
            <input type="text" id="messageInput" placeholder="Enter message" style="flex: 1; max-width: 70%; height: 40px; border-radius: 20px; border: 1px solid #ccc; padding: 0 15px; background-color: #fff; color: black; margin-right: 10px;">
            <button onclick="sendMessage('${id}')" style="padding: 10px 20px; border-radius: 20px; background-color: #44B78B; color: white; cursor: pointer;">Send</button>
        </div>
    
    </div>
    `;
    
        let currentCompId = null;
    let compId = id;
            let mesgBox = document.getElementById("messages");
            mesgBox.innerText = ""; // Clear existing messages
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
                const message = JSON.parse(event.data);

                
                if (message.from && message.to && message.content) {
                    if(message.from == "0"){
                        mesgBox.innerHTML += `
                        <li style="margin-bottom: 20px; text-align: right;">
                    <div style="display: inline-block; max-width: 60%; background-color: #44B78B; border-radius: 10px; padding: 10px; color: white;">
                    ${message.content}
                    </div>
                </li>
                        `;
                    }
                    else if(message.from == "1"){
                        mesgBox.innerHTML += `
                            <li style="margin-bottom: 20px;">
                    <div style="max-width: 60%; background-color: lightgray; border-radius: 10px; padding: 10px;">
                        ${message.content}
                    </div>
                </li>
                        `;
                    }
                    // const li = document.createElement('li');
                    // li.textContent = `${message.from} ➔ ${message.to}: ${message.content}`;
                    // document.getElementById('messages').appendChild(li);
                } else {
                    console.error('Invalid message format:', message);
                }
                
            };

            socket.onclose = () => {
                console.log(`Socket closed for complaint ${compId}`);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
    
  }
  
  function sendMessage(currentCompId) {
    const input = document.getElementById('messageInput');
    const messageText = input.value;
    const message = {
        from: "0",    // You can change this as per your use case
        to: `1`,       // Assuming 'to' should be formatted like "CompID"
        content: messageText,
        compId: currentCompId
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        input.value = ''; // Clear the input field after sending
    } else {
        console.log('Socket is not connected');
    }
}

// sessionStorage.removeItem("lastPageVisited");
let lastPage = sessionStorage.getItem("lastPageVisited");
if(lastPage === "fileComplaint"){
    sessionStorage.removeItem("lastPageVisited");
    fileComplaint();
}
else if(lastPage === "deleteComp"){
    sessionStorage.removeItem("lastPageVisited");
    showComplaints();
}