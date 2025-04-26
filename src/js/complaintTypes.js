
// Complaint Type

function fetchAndRenderComplaintTypes(){
    fetch(`${URL}/ComplaintTypes`)
        .then(res => res.json())
        .then(data => {
            allComplaintTypes = data;
            renderComplaintType(allComplaintTypes);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
  }
  
  function displayComplaintTypes(data){
    const table = document.createElement("table");
  
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      const query = document.getElementById("query");
    query.innerHTML = "";
      headRow.innerHTML = `
        <th>Complaint Type ID</th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Complaint Type</span>
            <span id="sortArrowComplaintType" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Severity</span>
            <span id="sortArrowSeverity" style="font-size: 25px; cursor: pointer;">↕</span>
          </div>
        </th>
        <th>Actions</th>
      `;
      thead.appendChild(headRow);
      table.appendChild(thead);
  
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
  
        const severityBadge = `<span class="severity-badge ${row.Severity.toLowerCase()}">${row.Severity}</span>`;
  
        tr.innerHTML = `
          <td>${row.CTID}</td>
          <td>${row.ComplaintType}</td>
          <td>${severityBadge}</td>
          <td>
            <button onclick="loadComplaintType('${row.id}')">✏️</button>
            <button onclick="deleteComplaintType('${row.id}')">🗑️</button>
          </td>`;
        tbody.appendChild(tr);
      });
  
      table.appendChild(tbody);
      return table;
  }
  
  
  function renderComplaintType(data) {
  
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
          <button onclick="addComplaintType()" style="background-color: #44B78B; color:white; height: 4vh; padding: 0 1vw; border: none; border-radius: 4px; font-size: 1em; cursor: pointer;">
              Add Complaint Type
          </button>
      </div>
    `;
  
    if (Array.isArray(data) && data.length > 0) {
      const title = document.createElement("h1");
      title.textContent = "Complaint Types";
      container.appendChild(title);
      container.appendChild(displayComplaintTypes(data));
    }
    const sortArrowComplaintType = document.getElementById("sortArrowComplaintType");
  
    sortArrowComplaintType.addEventListener("click", () => {
      const sorted = [...allComplaintTypes].sort((a, b) =>
          a.ComplaintType.localeCompare(b.ComplaintType) * sortedDirectionCompType
      );
      
      sortedDirectionCompType *= -1;
      renderComplaintType(sorted);
    });
    const sortArrowSeverity = document.getElementById("sortArrowSeverity");
  
    sortArrowSeverity.addEventListener("click", () => {
      const sorted = [...allComplaintTypes].sort((a, b) =>
          a.Severity.localeCompare(b.Severity) * sortedDirectionCompType
      );
      
      sortedDirectionCompType *= -1;
      renderComplaintType(sorted);
    });
  }
  
  function deleteComplaintType(id) {
    if (confirm("Are you sure you wanna delete the data?")) {
        fetch(`${URL}/ComplaintTypes/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchAndRenderComplaintTypes())
        .catch(err => console.error("Delete failed:", err));
        sessionStorage.setItem("lastPageVisited", "complaintType");
    }
  }
  
  function addComplaintType(complaintType = "", severity = "", ctID = "") {
    const container = document.getElementById("table-container");
    container.innerHTML = `
      <h1 style="text-align: center; color: #2c3e50;">Add Complaint Types</h1>
  <div style="margin-top: 3vh; padding: 2vh;">
      <div style="display: flex; align-items: center; margin-bottom: 2vh; font-size: 1.1em;">
          <div style="min-width: 20vw; margin-right: 10px;">Complaint Type:</div>
          <input type="text" id="compType" value="${complaintType}" style="height: 3vh; max-width: 20vw; flex: 1; padding: 0.5vh; border: 1px solid #ccc; border-radius: 4px;">
      </div>
  
      <hr style="margin: 2vh 0; border-top: 1px solid #ccc;">
  
      <div style="display: flex; align-items: center; margin-bottom: 2vh; font-size: 1.1em;">
          <div style="min-width: 20vw; margin-right: 10px;">Severity:</div>
          <select id="sever" style="height: 4vh; max-width: 20vw; flex: 1; padding: 0.5vh; border: 1px solid #ccc; border-radius: 4px;">
              <option value="critical" ${severity === 'critical' ? 'selected' : ''}>Critical</option>
              <option value="high" ${severity === 'high' ? 'selected' : ''}>High</option>
              <option value="medium" ${severity === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="minor" ${severity === 'minor' ? 'selected' : ''}>Minor</option>
          </select>
      </div>
  </div>
  
  <div style="text-align: right; background-color: #f1f1f1; padding: 4px">
      <button id="addBtn" type="button" style="background-color: aquamarine; height: 4vh; padding: 0 1vw; border: none; border-radius: 4px; font-size: 1em; cursor: pointer;">
          Save
      </button>
  </div>
  
    `;
  
    document.getElementById("addBtn").addEventListener("click", () => {
      const compType = document.getElementById("compType").value.trim();
      const sever = document.getElementById("sever").value.trim();
      addComplaintTypeToDb(compType, sever, ctID);
    });
    
  }
  
  function addComplaintTypeToDb(complaintType = "", severity = "", ctID = "") {
    const complaintTypes = {
      CTID: ctID,
      ComplaintType: complaintType,
      Severity: severity
    };
  
    if (editIdCompType) {
      fetch(`${URL}/ComplaintTypes/${editIdCompType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintTypes)
      }).then(() => {
        fetchAndRenderComplaintTypes();
        editIdCompType = null;
      });
      sessionStorage.setItem("lastPageVisited", "complaintType");
    } else {
      complaintTypes.CTID = compTypCounter;
  
      fetch(`${URL}/ComplaintTypes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintTypes)
      }).then(() => {
        fetchAndRenderComplaintTypes();
        compTypCounter++;
      });
      sessionStorage.setItem("lastPageVisited", "complaintType");
    }
  }
  
  function loadComplaintType(id) {
    fetch(`${URL}/ComplaintTypes/${id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        const { ComplaintType, Severity, CTID } = data;
        editIdCompType = id; // ✅ updated here too
        addComplaintType(ComplaintType, Severity, CTID);
      });
  }
  