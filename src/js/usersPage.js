let greetBox = document.getElementById("greet");
const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

// const token = sessionStorage.getItem("token");
const token = localStorage.getItem("token");

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

        <input type="file" id="myFile" name="filename">

        <div id="error-box"></div>

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
console.log(`Bearer ${token}`);

fetch(`${URL}/api/users/form-data`,{
    method: 'GET', // or 'POST', 'PUT', etc.
    headers: {
    'Content-Type': 'application/json',
        'Authorization':  `Bearer ${token}`, 
    }
})
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

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (err) {
        return null;
    }
}
console.log(getUserId());

let counter = 2011;

function addComplaint() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
const deptId = document.getElementById("deptId").value;
const compId = document.getElementById("compId").value;
const description = document.getElementById("comId").value;
const proofImageInput = document.getElementById("myFile");
const error = document.getElementById("error-box");

if (!deptId || !compId || !description || !loggedInUser) {
    alert("Please fill all fields and make sure you're logged in.");
    return;
}

if (!proofImageInput.files || proofImageInput.files.length === 0) {
    alert("Please upload a proof image.");
    return;
}
// console.log(loggedInUser.id);
const formData = new FormData();
formData.append("userId", getUserId());
formData.append("deptId", deptId);
formData.append("ctId", compId);
formData.append("description", description);
formData.append("status", "Pending");
formData.append("date", "2025-05-09");
formData.append("updateDate", "2025-05-09");
formData.append("proofImage", proofImageInput.files[0]);

fetch(`${URL}/api/complaints`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
})
.then(res => {
    if (res.status === 413) {
        error.textContent = "Image size is too big";
    } else if (!res.ok) {
        console.log(res.status);
        throw new Error("Bad request");
    } else {
        return res.json();
    }
})
.then(() => {
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
    const userId = getUserId();
    fetch(`${URL}/api/complaints/getByUserId/${userId}`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
        .then(res => res.json())
        .then(userComplaints => {
            // const userComplaints = complaints.filter(c => c.userId === loggedInUser.id);

            if (userComplaints.length === 0) {
                document.getElementById("complaintTableBody").innerHTML = `
                    <tr><td colspan="6">No complaints found.</td></tr>`;
                return;
            }

            const rows = userComplaints.map(c => `
                <tr onclick="chatService('${c.compId}')">
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
            method: "DELETE",
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  },
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
            fetch(`http://localhost:8080/api/complaints/${compId}`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
            .then(res => res.json())
            .then(data => {
              fetch(`http://localhost:8080/api/complaints/resource/${data.proofImage}`,{
                method: 'GET', // or 'POST', 'PUT', etc.
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // key part
                }})
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                    const imageUrl = reader.result; 
                    mesgBox.innerHTML += `
                        <li style="margin-bottom: 20px; display: flex; align-items: center; gap: 20px;">
                        <div style="flex: 1; background-color: #f0f0f0; border-radius: 10px; padding: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
                        <img src="${imageUrl}" style="max-width: 10vw; height: auto; border-radius: 10px; object-fit: cover;"> 
                    ${data.description}
                </div>
                </li>

      `;
    };
    reader.readAsDataURL(blob);
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
        });
            });
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