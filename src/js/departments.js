
// Department

function fetchAndRenderDepartments(){
    fetch(`${URL}/Departments`)
        .then(res => res.json())
        .then(data => {
            allDepartments = data;
            renderDepartments(allDepartments);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
  }
  
  function displayDepartments(data){
    const table = document.createElement("table");
  
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      const query = document.getElementById("query");
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
          <td>${row.DeptID}</td>
              <td>${row.Name}</td>
              <td>${row.Contact}</td>
          <td>
            <button onclick="loadDepartment('${row.id}')">✏️</button>
            <button onclick="deleteDepartment('${row.id}')">🗑️</button>
          </td>`;
        tbody.appendChild(tr);
      });
  
      table.appendChild(tbody);
      return table;
  }
  
  function renderDepartments(data) {
  
    const search1 = document.getElementById("search-1");
    const search2 = document.getElementById("search-2");
    const search3 = document.getElementById("search-3");
    const search4 = document.getElementById("search-4");
    search1.innerHTML = "";
    search2.innerHTML = "";
    search3.innerHTML = "";
    search4.innerHTML = "";
  
    const container = document.getElementById("table-container");
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
  
    sortArrowDname.addEventListener("click", () => {
      const sorted = [...allDepartments].sort((a, b) =>
          a.Name.localeCompare(b.Name) * sortedDirectionDept
      );
      
      sortedDirectionDept *= -1;
      renderDepartments(sorted);
    });
  }
  
  function deleteDepartment(id) {
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/Departments/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchAndRenderDepartments())
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "department");
    }
  }
  
  function addDepartment(name = "", email = "", deptId = "") {
    const container = document.getElementById("table-container");
    container.innerHTML = `
      <h1 style="text-align: center; color: #2c3e50;">Add Departments</h1>
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
    `;
  
    document.getElementById("addBtn").addEventListener("click", () => {
      const dname = document.getElementById("deptName").value.trim();
      const demail = document.getElementById("deptEmail").value.trim();
      addDepartmentToDb(dname, demail, deptId);
    });
    
  }
  
  function addDepartmentToDb(dname = "", demail = "", DeptID = "") {
    const department = {
      DeptID: DeptID,
      Name: dname,
      Contact: demail
    };
  
    if (editIdDept) {
      fetch(`${URL}/Departments/${editIdDept}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(department)
      }).then(() => {
        fetchAndRenderDepartments();
        editIdDept = null;
      });
      sessionStorage.setItem("lastPageVisited", "department");
    } else {
      department.DeptID = deptCounter;
  
      fetch(`${URL}/Departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(department)
      }).then(() => {
        fetchAndRenderDepartments();
        deptCounter++;
      });
      sessionStorage.setItem("lastPageVisited", "department");
    }
  }
  
  function loadDepartment(id) {
    fetch(`${URL}/Departments/${id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        const { Name, Contact, DeptID } = data;
        editIdDept = id; // ✅ updated here too
        addDepartment(Name, Contact, DeptID);
      });
  }