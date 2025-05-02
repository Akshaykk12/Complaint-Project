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