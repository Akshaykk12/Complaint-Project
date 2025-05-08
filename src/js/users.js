


// User
function fetchAndRenderUsers(){
  let userBreadCrumb = document.getElementById("secondary-nav");
  userBreadCrumb.innerHTML = `
  <div onclick="window.location.href='./admin.html'" style="cursor: pointer; padding-left: 5px;">Home</div>
  <div onclick:"fetchAndRenderUsers()" style="cursor: pointer; padding-left: 5px;"> > User </div>
  `;
    fetch(`${URL}/api/users`)
        .then(res => res.json())
        .then(data => {
            allUsers = data;
            if (allUsers.length != 0){
              renderUsers(allUsers);
            }else{
              displayUsersTable();
            }
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
  }

  function displayUsersTable(){
    
    const container = document.getElementById("table-container");
    container.innerHTML = ``;

    const title = document.createElement("h1");
    title.textContent = "Departments";
    container.appendChild(title);

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `
      <th>User ID</th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Name</span>
            <span id="sortArrowName" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>Email</th>
        <th>Phone no.</th>
        <th>UserType</th>
        <th>Password</th>
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
  
  function displayUsers(data){
    const table = document.createElement("table");
  
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      const query = document.getElementById("query-container");
      query.innerHTML = "";
      headRow.innerHTML = `
        <th>User ID</th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Name</span>
            <span id="sortArrowName" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>Email</th>
        <th>Phone no.</th>
        <th>UserType</th>
        <th>Password</th>
        <th>Actions</th>
      `;
      thead.appendChild(headRow);
      table.appendChild(thead);
  
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
  
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.phone}</td>
          <td>${row.userType}</td>
          <td>${row.password}</td>
          <td>
            <button onclick="deleteUser('${row.id}')">🗑️</button>
          </td>`;
        tbody.appendChild(tr);
      });
  
      table.appendChild(tbody);
      return table;
  }
  function deleteUser(id) {
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/api/users/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchAndRenderUsers())
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "user");
    }
  }
  
  function renderUsers(data = allUsers) {
    const search1 = document.getElementById("search-1");
    const search2 = document.getElementById("search-2");
    const search3 = document.getElementById("search-3");
    const search4 = document.getElementById("search-4");
  
    if (search1) search1.innerHTML = "";
    if (search2) search2.innerHTML = "";
    if (search3) search3.innerHTML = "";
    if (search4) search4.innerHTML = "";
  
    const container = document.getElementById("table-container");
    
  // const reportContainer = document.getElementById("report-container");
  // reportContainer.innerText = "";
    // Check if the container exists
    if (!container) {
      console.error("Table container with id 'table-main' not found!");
      return;
    }
  
    container.innerHTML = '';  // Clear previous content
  
    if (Array.isArray(data) && data.length > 0) {
      const title = document.createElement("h1");
      title.textContent = "Users";
      container.appendChild(title);
      container.appendChild(displayUsers(data));
    }
  
    const sortArrowName = document.getElementById("sortArrowName");
  
    if (sortArrowName) {
      sortArrowName.addEventListener("click", () => {
        const sorted = [...allUsers].sort((a, b) =>
          a.name.localeCompare(b.name) * sortedDirectionUser
        );
        sortedDirectionUser *= -1;
        renderUsers(sorted);
      });
    }
  }
  