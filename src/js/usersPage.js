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


const URL = "http://localhost:4000";
let departments = [];
let complaintType = [];

fetch(`${URL}/ComplaintTypes`)
    .then(res => res.json())
    .then(data => {
        complaintType = data;
        
    })
    .catch(error => console.error("Error loading complaint types:", error));

    fetch(`${URL}/Departments`)
    .then(res => res.json())
    .then(data => {
        departments = data;
        
    })
    .catch(error => console.error("Error loading departments:", error));

function loadDepartments(){
    const deptSelect = document.getElementById("deptId");
        departments.forEach(dept => {
            deptSelect.innerHTML += `<option value="${dept.DeptID}">${dept.Name}</option>`;
        });
}

function loadComplaintType(){
    
    const ctSelect = document.getElementById("compId");
    complaintType.forEach(comp => {
        ctSelect.innerHTML += `<option value="${comp.CTID}">${comp.ComplaintType}</option>`;
    });
}
let counter = 2011;

function addComplaint() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const department = document.getElementById("deptId").value;
    const complaintType = document.getElementById("compId").value;
    const description = document.getElementById("comId").value;
    const date = document.getElementById("comDate").value;


    if (!department || !complaintType || !description || !date || !loggedInUser) {
        alert("Please fill all fields and make sure you're logged in.");
        return;
    }

    const complaint = {
        ComplaintID: counter,
        UserID: loggedInUser.UserID,  // assuming your user object has UserID
        DeptID: department,
        CTID: complaintType,
        Description: description,
        DateFiled: date,
        Status: "Pending"
    };

    fetch(`${URL}/Complaints`, {
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
        document.getElementById("empForm").reset(); // reset form after submission
       
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong while filing the complaint.");
    });
    sessionStorage.setItem("lastPageVisited", "fileComplaint");
}
function getDeptName(deptID) {
    const dept = departments.find(d => d.DeptID == deptID);
    return dept ? dept.Name : "Unknown";
}

function getComplaintTypeName(ctID) {
    const ct = complaintType.find(t => t.CTID == ctID);
    return ct ? ct.ComplaintType : "Unknown";
}


function showComplaints(){
    const container = document.getElementById("main-container");
    container.innerHTML = `<h2>Your Complaint History</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; text-align: left; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Complaint ID</th>
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

    fetch(`${URL}/Complaints`)
        .then(res => res.json())
        .then(complaints => {
            const userComplaints = complaints.filter(c => c.UserID === loggedInUser.UserID);

            if (userComplaints.length === 0) {
                document.getElementById("complaintTableBody").innerHTML = `
                    <tr><td colspan="6">No complaints found.</td></tr>`;
                return;
            }

            // Build table rows
            const rows = userComplaints.map(c => `
                <tr>
                    <td>${c.ComplaintID}</td>
                    <td>${getDeptName(c.DeptID)}</td>
                    <td>${getComplaintTypeName(c.CTID)}</td>
                    <td>${c.Description}</td>
                    <td>${c.DateFiled}</td>
                    <td>${c.Status}</td>
                    <td>
                        <div onclick="deleteComplaint('${c.id}')">🗑️</div>
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
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/Complaints/${id}`, {
            method: "DELETE"
        })
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "deleteComp");
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