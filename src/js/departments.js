
// Department

function fetchAndRenderDepartments(){
  let userBreadCrumb = document.getElementById("secondary-nav");
  userBreadCrumb.innerHTML = `
    <div onclick="window.location.href='./admin.html'" style="cursor: pointer; padding-left: 5px;">Home</div>
    <div onclick="fetchAndRenderDepartments()" style="cursor: pointer; padding-left: 5px;"> > Department </div>
  `;
    fetch(`${URL}/api/departments`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
        .then(res => res.json())
        .then(data => {
            allDepartments = data;
            if(allDepartments.length != 0){
              renderDepartments(allDepartments);
            }else{
              displayDeptTable();
            }
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
  }

  function displayDeptTable(){
    const container = document.getElementById("table-container");
    container.innerHTML = `
      <div style="text-align: right;">
          <button onclick="addDepartment()" style="background-color: #44B78B; color:white; height: 4vh; padding: 0 1vw; border: none; border-radius: 4px; font-size: 1em; cursor: pointer;">
              Add Department
          </button>
      </div>
    `;

    const title = document.createElement("h1");
    title.textContent = "Departments";
    container.appendChild(title);

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `
      <th>Department</th>
          <th>
            <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Name</span>
            <span id="sortArrowDname" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
          </th>
          <th>Contact</th>
          <th>Actions</th>
    `;
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    const noDataRow = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 8;
    noDataCell.style.textAlign = "center";
    noDataCell.style.padding = "15px";
    noDataCell.textContent = "No Departments logged";
    noDataRow.appendChild(noDataCell);
    tbody.appendChild(noDataRow);

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  }
  
  function displayDepartments(data){
    const table = document.createElement("table");
  
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      const query = document.getElementById("query-container");
    query.innerHTML = "";
      headRow.innerHTML = `
        <th>Department</th>
          <th>
            <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Name</span>
            <span id="sortArrowDname" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
          </th>
          <th>Contact</th>
          <th>Actions</th>
      `;
      thead.appendChild(headRow);
      table.appendChild(thead);
  
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
  
        tr.innerHTML = `
              <td>${row.deptId}</td>
              <td>${row.deptName}</td>
              <td>${row.deptEmail}</td>
          <td>
            <button onclick="loadDepartment('${row.deptId}')">✏️</button>
            <button onclick="deleteDepartment('${row.deptId}')">🗑️</button>
          </td>`;
        tbody.appendChild(tr);
      });
  
      table.appendChild(tbody);
      return table;
  }
  
  function renderDepartments(data) {
  
    // Check if search elements exist before modifying them
    const search1 = document.getElementById("search-1");
    const search2 = document.getElementById("search-2");
    const search3 = document.getElementById("search-3");
    const search4 = document.getElementById("search-4");

    if (search1) search1.innerHTML = "";
    if (search2) search2.innerHTML = "";
    if (search3) search3.innerHTML = "";
    if (search4) search4.innerHTML = "";
  
    const container = document.getElementById("table-container");

    // Ensure the container exists
    if (!container) {
      console.error("Table container with id 'table-container' not found!");
      return;
    }

    container.innerHTML = `
      <div style="text-align: right;">
          <button onclick="addDepartment()" style="background-color: #44B78B; color:white; height: 4vh; padding: 0 1vw; border: none; border-radius: 4px; font-size: 1em; cursor: pointer;">
              Add Department
          </button>
      </div>
    `;
  
    if (Array.isArray(data) && data.length > 0) {
      const title = document.createElement("h1");
      title.textContent = "Departments";
      container.appendChild(title);
      container.appendChild(displayDepartments(data));
    }

    const sortArrowDname = document.getElementById("sortArrowDname");

    // Ensure the sortArrowDname element exists before adding event listener
    if (sortArrowDname) {
      sortArrowDname.addEventListener("click", () => {
        const sorted = [...allDepartments].sort((a, b) =>
            a.deptName.localeCompare(b.deptName) * sortedDirectionDept
        );
        
        sortedDirectionDept *= -1;
        renderDepartments(sorted);
      });
    }
}

  
  function deleteDepartment(id) {
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/api/departments/${id}`, {
            method: "DELETE",
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }
        })
        .then(() => fetchAndRenderDepartments())
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "department");
    }
  }
  
  function addDepartment(name = "", email = "", deptId = "") {
    if(deptId === ""){

      let userBreadCrumb = document.getElementById("secondary-nav");
      userBreadCrumb.innerHTML = `
        <div onclick="window.location.href='./admin.html'" style="cursor: pointer; padding-left: 5px;">Home</div>
        <div onclick="fetchAndRenderDepartments()" style="cursor: pointer; padding-left: 5px;"> > Department </div>
        <div onclick="addDepartment()" style="cursor: pointer; padding-left: 5px;"> > Add Department </div>
      `;

      const container = document.getElementById("table-container");
      container.innerHTML = `
        <h1 style="text-align: center; color: #2c3e50;">Add Departments</h1>`;
    }
    
    else{

      let userBreadCrumb = document.getElementById("secondary-nav");
      userBreadCrumb.innerHTML = `
        <div onclick="window.location.href='./admin.html'" style="cursor: pointer; padding-left: 5px;">Home</div>
        <div onclick="fetchAndRenderDepartments()" style="cursor: pointer; padding-left: 5px;"> > Department </div>
        <div onclick="addDepartment()" style="cursor: pointer; padding-left: 5px;"> > Edit Department </div>
      `;
    
      const container = document.getElementById("table-container");
      container.innerHTML = `
        <h1 style="text-align: center; color: #2c3e50;">Edit Departments</h1>`;
    
    }
    const container = document.getElementById("table-container");
       container.innerHTML += `
      <div style="margin-top: 3vh; padding: 2vh;">
          <div style="display: flex; align-items: center; margin-bottom: 2vh; font-size: 1.1em;">
              <div style="min-width: 20vw; margin-right: 10px;">Department Name:</div>
              <input type="text" id="deptName" value="${name}" style="height: 3vh; max-width: 20vw; flex: 1; padding: 0.5vh; border: 1px solid #ccc; border-radius: 4px;">
          </div>
  
          <hr style="margin: 2vh 0; border-top: 1px solid #ccc;">
  
          <div style="display: flex; align-items: center; margin-bottom: 2vh; font-size: 1.1em;">
              <div style="min-width: 20vw; margin-right: 10px;">Contact Email:</div>
              <input type="email" id="deptEmail" value="${email}" style="height: 3vh; max-width: 20vw; flex: 1; padding: 0.5vh; border: 1px solid #ccc; border-radius: 4px;">
          </div>
      </div>
  
      <div style="text-align: right; background-color: #f1f1f1; padding: 4px">
          <button id="addBtn" type:"button" style="background-color: aquamarine; height: 4vh; padding: 0 1vw; border: none; border-radius: 4px; font-size: 1em; cursor: pointer;">
              Save
          </button>
      </div>

      <div id="addDeptErrBox" style="color:Red; display:flex; justify-content:center"></div>
    `;
  
    document.getElementById("addBtn").addEventListener("click", () => {
      const dname = document.getElementById("deptName").value.trim();
      const demail = document.getElementById("deptEmail").value.trim();
      addDepartmentToDb(dname, demail, deptId);
    });
    
  }
  
  function addDepartmentToDb(dname = "", demail = "", DeptID = "") {
    const department = {
      deptID: DeptID,
      deptName: dname,
      deptEmail: demail
    };
  
    if (editIdDept) {
      fetch(`${URL}/api/departments/${editIdDept}`, {
        method: "PUT",
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  },
        body: JSON.stringify(department)
      }).then(() => {
        fetchAndRenderDepartments();
        editIdDept = null;
      });
      sessionStorage.setItem("lastPageVisited", "department");
    } else {
      department.DeptID = deptCounter;
  
      fetch(`${URL}/api/departments`, {
        method: "POST",
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  },
        body: JSON.stringify(department)
      })
      .then(response => {
        if(response.status === 409){
          const addDeptError = document.getElementById("addDeptErrBox") ;
          addDeptError.innerHTML = "Department Name already exists";
        }
        else if (response.ok){
          fetchAndRenderDepartments();
        } 
      })
      sessionStorage.setItem("lastPageVisited", "department");
    }
  }
  
  function loadDepartment(id) {
    fetch(`${URL}/api/departments/${id}`, {
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
      .then(res => res.json())
      .then(data => {
        const { deptId, deptName, deptEmail } = data;
        editIdDept = id; 
        addDepartment(deptName, deptEmail, deptId);
      });
  }