
function loadDepartments(){
    fetch(`http://localhost:8080/api/departments/deptName`)
    .then(res => res.json())
    .then(data => {
        const deptSelect = document.getElementById("deptQuery");
        data.forEach(dept => {
            deptSelect.innerHTML += `<option value="${dept.deptName}">${dept.deptName}</option>`;
        });
    });
}

function getQueries(){
    const container = document.getElementById("query");
    const graph = document.getElementById("table-container");
    if(graph) graph.innerHTML = "";
    container.innerHTML = `
    <div id="main-container" style="padding: 20px; max-width: 600px; margin: auto;">
  <h2 style="margin-bottom: 1em;">Query Complaints by Department</h2>
  
  <div style="margin-bottom: 1em;">
    <label for="deptQuery" style="font-weight: bold; display: block; margin-bottom: 0.5em;">
      Select Department:
    </label>
    <select id="deptQuery" style="width: 100%; padding: 0.5em; border-radius: 4px; border: 1px solid #ccc;">
      <option value="">-- SELECT --</option>
    </select>
  </div>

  <button 
    onclick="fetchComplaintsByDepartment()" 
    style="padding: 0.5em 1em; background-color: Green; color: white; border: none; border-radius: 4px; cursor: pointer;">
    Search
  </button>

  <div id="complaints-result" style="margin-top: 2em;"></div>
</div>

    `;
    loadDepartments();
}

// Fetch complaints for selected department
function fetchComplaintsByDepartment() {
  const deptId = document.getElementById("deptQuery").value;
  const resultDiv = document.getElementById("complaints-result");
  resultDiv.innerHTML = ""; // clear previous results

  if (!deptId) {
    resultDiv.innerHTML = "<p>Please select a department.</p>";
    return;
  }

  fetch(`${URL}/api/complaints/getCompByDept/${deptId}`)
    .then(res => res.json())
    .then(complaints => {
      if (!Array.isArray(complaints) || complaints.length === 0) {
        resultDiv.innerHTML = "<p>No complaints found for this department.</p>";
        return;
      }

      // Create table
      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";
      table.innerHTML = `
        <thead style="background-color: #f0f0f0;">
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px;">Complaint ID</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Description</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Status</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Date Filed</th>
          </tr>
        </thead>
        <tbody>
          ${complaints.map(c => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${c.compId}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${c.description}</td>
              <td style="border: 1px solid #ccc; padding: 8px;"><span class="status-badge ${c.status.toLowerCase().replace(/\s/g, '-')}">${c.status}</span></td>
              <td style="border: 1px solid #ccc; padding: 8px;">${c.date}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
      resultDiv.appendChild(table);
    })
    .catch(err => {
      console.error("Error fetching complaints:", err);
      resultDiv.innerHTML = "<p>Failed to fetch complaints.</p>";
    });
}
