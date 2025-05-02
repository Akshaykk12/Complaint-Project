
// Complaint

// const { table } = require("console");

function fetchAndRenderComplaints(){
  
    fetch(`${URL}/api/complaints`)
        .then(res => res.json())
        .then(data => {
            allComplaints = data;
            if(allComplaints.length != 0){
              renderComplaints(allComplaints);
            }else{
              displayComplaintTable();
            }
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
  }

  function displayComplaintTable(){
    const container = document.getElementById("table-container");
    container.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "Complaints";
    container.appendChild(title);

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `
      <th>Complaint ID</th>
        <th>User</th>
        <th>Department</th>
        <th>Complaint Type</th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Description</span>
            <span id="sortArrowDescription" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Date Filed</span>
            <span id="sortArrowDataFiled" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Status</span>
            <span id="sortArrowStatus" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>Actions</th>
    `;
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    const noDataRow = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 8;
    noDataCell.style.textAlign = "center";
    noDataCell.style.padding = "15px";
    noDataCell.textContent = "No complaints logged";
    noDataRow.appendChild(noDataCell);
    tbody.appendChild(noDataRow);

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  }
  
  function displayComplaints(data){
    fetch(`${URL}/api/users/form-data`)
.then(res => res.json())
.then(data => {
    console.log(data);
    departments = data.departments;
    complaintType = data.complaintTypes;
    users = data.users;

});
    
    const userMap = Object.fromEntries(allUsers.map(u => [u.id, u.name]));
    const deptMap = Object.fromEntries(allDepartments.map(d => [d.deptId, d.deptName]));
    const ctMap = Object.fromEntries(allComplaintTypes.map(c => [c.compTypeId, c.compType]));
    const table = document.createElement("table");
    
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const query = document.getElementById("query");
    query.innerHTML = "";
      headRow.innerHTML = `
        <th>Complaint ID</th>
        <th>User</th>
        <th>Department</th>
        <th>Complaint Type</th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Description</span>
            <span id="sortArrowDescription" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Date Filed</span>
            <span id="sortArrowDataFiled" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Status</span>
            <span id="sortArrowStatus" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>Actions</th>
      `;
      thead.appendChild(headRow);
      table.appendChild(thead);
  
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        const statusClass = row.status.toLowerCase().replace(/\s/g, '-');
        const statusBadge = `<span class="status-badge ${statusClass}">${row.status}</span>`;
  
        tr.innerHTML = `
          <td>${row.compId}</td>
          <td>${userMap[row.userId] || 'Unknown User'}</td>
          <td>${deptMap[row.deptId] || 'Unknown Dept'}</td>
          <td>${ctMap[row.ctId] || 'Unknown Type'}</td>
          <td>${row.description}</td>
          <td>${row.date}</td>
          <td>${statusBadge}</td>
          <td>
            <button onclick="loadComplaint('${row.compId}', '${userMap[row.UserID] || 'Unknown User'}', '${deptMap[row.DeptID] || 'Unknown Dept'}', '${ctMap[row.CTID] || 'Unknown Type'}')">✏️</button>
            <button onclick="deleteComplaint('${row.compId}')">🗑️</button>
          </td>`;
        tbody.appendChild(tr);
      });
  
      table.appendChild(tbody);
      return table;
  }
  
  function deleteComplaint(id) {
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/api/complaints/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchAndRenderComplaints())
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "complaint");
    }
  }
  
  function renderComplaints(data) {
  
    const search1 = document.getElementById("search-1");
    const search2 = document.getElementById("search-2");
    const search3 = document.getElementById("search-3");
    const search4 = document.getElementById("search-4");
    search1.innerHTML = "";
    search2.innerHTML = "";
    search3.innerHTML = "";
    search4.innerHTML = "";
  
    const container = document.getElementById("table-container");
    container.innerHTML = ``;
  
    if (Array.isArray(data) && data.length > 0) {
      const title = document.createElement("h1");
      title.textContent = "Complaints";
      container.appendChild(title);
      container.appendChild(displayComplaints(data));
    }
    const sortArrowDescription = document.getElementById("sortArrowDescription");
  
    sortArrowDescription.addEventListener("click", () => {
      const sorted = [...allComplaints].sort((a, b) =>
          a.Description.localeCompare(b.Description) * sortedDirectionComp
      );
      
      sortedDirectionComp *= -1;
      renderComplaints(sorted);
    });
    const sortArrowStatus = document.getElementById("sortArrowStatus");
  
    sortArrowStatus.addEventListener("click", () => {
      const sorted = [...allComplaints].sort((a, b) =>
          a.Status.localeCompare(b.Status) * sortedDirectionComp
      );
      
      sortedDirectionComp *= -1;
      renderComplaints(sorted);
    });
    const sortArrowDataFiled = document.getElementById("sortArrowDataFiled");
  
    sortArrowDataFiled.addEventListener("click", () => {
      const sorted = [...allComplaints].sort((a, b) =>
          a.DateFiled.localeCompare(b.DateFiled) * sortedDirectionComp
      );
      
      sortedDirectionComp *= -1;
      renderComplaints(sorted);
    });
    
  }
  
  //Incomplete
  
  function addComplaint(cid, user, dept, compType, description, date, status) {
    const container = document.getElementById("table-container");
    container.innerHTML = `
      <div style="max-width: 800px; margin: 5vh auto; padding: 3vh 4vw; background-color: #fdfdfd; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c3e50;">

  <h1 style="text-align: center; margin-bottom: 4vh;">Add Complaint</h1>

  <!-- Complaint ID -->
  <div style="display: flex; margin-bottom: 2vh;">
    <label style="flex: 0 0 25%; font-weight: 500;">Complaint ID:</label>
    <div style="flex: 1;">${cid}</div>
  </div>

  <!-- User -->
  <div style="display: flex; margin-bottom: 2vh;">
    <label style="flex: 0 0 25%; font-weight: 500;">User:</label>
    <div style="flex: 1;">${user}</div>
  </div>

  <!-- Department -->
  <div style="display: flex; margin-bottom: 2vh;">
    <label style="flex: 0 0 25%; font-weight: 500;">Department:</label>
    <div style="flex: 1;">${dept}</div>
  </div>

  <!-- Complaint Type -->
  <div style="display: flex; margin-bottom: 2vh;">
    <label style="flex: 0 0 25%; font-weight: 500;">Complaint Type:</label>
    <div style="flex: 1;">${compType}</div>
  </div>

  <!-- Description -->
  <div style="display: flex; margin-bottom: 2vh;">
    <label style="flex: 0 0 25%; font-weight: 500; padding-top: 0.5vh;">Description:</label>
    <div style="flex: 1;">${description}</div>
  </div>

  <!-- Date Filed -->
  <div style="display: flex; margin-bottom: 2vh;">
    <label style="flex: 0 0 25%; font-weight: 500;">Date Filed:</label>
    <div style="flex: 1;">${date}</div>
  </div>

  <!-- Status -->
  <div style="display: flex; align-items: center; margin-bottom: 3vh;">
    <label style="flex: 0 0 25%; font-weight: 500;">Status:</label>
    <select id="status" style="flex: 1; padding: 0.6vh 1vw; border: 1px solid #ccc; border-radius: 5px; font-size: 1em;">
      <option value="${status}">${status}</option>
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
      <option value="Closed">Closed</option>
    </select>
  </div>

  <!-- Submit Button -->
  <div style="text-align: right;">
    <button id="submitComplaint" type="button" style="background-color: #16a085; color: white; padding: 0.7vh 2vw; border: none; border-radius: 5px; font-size: 1em; cursor: pointer; transition: 0.3s ease;">
      Save
    </button>
  </div>
</div>

    `;
  
    document.getElementById("submitComplaint").addEventListener("click", () => {
      const status = document.getElementById("status").value.trim();
      addComplaintToDb(cid, user, dept, compType, description, date, status);
    });
    
  }
  
  function addComplaintToDb(cid, user, dept, compType, description, date, status) {
    const complaint = {
      userId: user,
      deptId: dept,
      ctId: compType,
      description: description,
      date: date,
      status: status
    };
  
    if (editIdCompType) {
      fetch(`${URL}/api/complaints/${editIdCompType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint)
      }).then(() => {
        fetchAndRenderComplaints();
        editIdCompType = null;
      });
      sessionStorage.setItem("lastPageVisited", "complaint");
    } 
  }
  
  function loadComplaint(id, user, dept, ctId) {
    fetch(`${URL}/api/complaints/${id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        const { compId, ctId, date,deptId, description, status, userId  } = data;
        editIdCompType = id; // ✅ updated here too
        addComplaint(compId, userId, deptId, ctId, description, date, status);
      });
      sessionStorage.setItem("lastPageVisited", "complaint");
  }
  