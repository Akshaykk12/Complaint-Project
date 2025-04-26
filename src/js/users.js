
// User
function fetchAndRenderUsers(){
    fetch(`${URL}/Users`)
        .then(res => res.json())
        .then(data => {
            allUsers = data;
            renderUsers(allUsers);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
  }
  
  function displayUsers(data){
    const table = document.createElement("table");
  
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      const query = document.getElementById("query");
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
          <td>${row.UserID}</td>
          <td>${row.Name}</td>
          <td>${row.Email}</td>
          <td>${row.Phone}</td>
          <td>${row.UserType}</td>
          <td>${row.Password}</td>
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
        fetch(`${URL}/Users/${id}`, {
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
    if (container) container.innerHTML = '';
  
    if (Array.isArray(data) && data.length > 0) {
      const title = document.createElement("h1");
      title.textContent = "Users";
      container.appendChild(title);
      container.appendChild(displayUsers(data));
    }
    const sortArrowName = document.getElementById("sortArrowName");
  
    sortArrowName.addEventListener("click", () => {
      const sorted = [...allUsers].sort((a, b) =>
          a.Name.localeCompare(b.Name) * sortedDirectionUser
      );
      
      sortedDirectionUser *= -1;
      renderUsers(sorted);
    });
  }