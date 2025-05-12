const apiBase = 'http://localhost:8080';
let statusPieChartInstance = null; 

function renderCharts(){
  
    
  fetch(`http://localhost:8080/api/users/getTotalUsers`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
  .then(res => res.text())
  .then(data => {

    document.getElementById("userCount").textContent = data
  });

  fetch(`http://localhost:8080/api/complaints/getTotalComp`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
  .then(res => res.text())
  .then(data => {
    
    document.getElementById("complaintCount").textContent = data
  });

  
fetch(`http://localhost:8080/api/complaints/getCompStatusCount`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
.then(res => res.json())
.then(data => {
  const statusLabels = data.map(c => c.status);
  const statusValues = data.map(c => c.count);

  if (statusPieChartInstance !== null) {
    statusPieChartInstance.destroy();
  }

  statusPieChartInstance = new Chart(document.getElementById("statusPieChart").getContext("2d"), {
    type: "pie",
    data: {
      labels: statusLabels,
      datasets: [{
        data: statusValues,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    }
  });
});

  fetch(`http://localhost:8080/api/complaints/getTopDeptCompCount`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
  .then(res => res.json())
  .then(data => {
    const deptContainer = document.getElementById("topDept");

const table = document.createElement("table");

const thead = document.createElement("thead");
const headRow = document.createElement("tr");
const query = document.getElementById("query");
// query.innerHTML = "";

headRow.innerHTML = `
  <th>Department</th>
  <th>Number of Complaints</th>
`;
thead.appendChild(headRow);
table.appendChild(thead);  

const tbody = document.createElement("tbody");
data.forEach(row => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row.deptName}</td>
    <td>${row.count}</td>
  `;
  tbody.appendChild(tr);
});
table.appendChild(tbody);   

deptContainer.appendChild(table);


  });
  let complaintsOverTimeChartInstance = null; // declare globally

fetch(`http://localhost:8080/api/complaints/getCompDateCount`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
  .then(res => res.json())
  .then(data => {
    
    const sortedDates = data.map(c => c.date).sort();
    const counts = data.map(c => c.count);

    // Destroy existing chart if it exists
    if (complaintsOverTimeChartInstance !== null) {
      complaintsOverTimeChartInstance.destroy();
    }

    // Create new chart
    complaintsOverTimeChartInstance = new Chart(document.getElementById("complaintsOverTimeChart").getContext("2d"), {
      type: "line",
      data: {
        labels: sortedDates,
        datasets: [{
          label: "Complaints",
          data: counts,
          borderColor: "#4B77BE",
          backgroundColor: "rgba(75, 119, 190, 0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });


  let departmentChartInstance = null; // Declare globally

fetch(`http://localhost:8080/api/complaints/getDeptCompCount`,{
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // key part
  }})
  .then(res => res.json())
  .then(data => {
    const labels = data.map(d => d.deptName);
    const values = data.map(d => d.count);
    
    // Destroy existing chart if it exists
    if (departmentChartInstance !== null) {
      departmentChartInstance.destroy();
    }

    // Create new chart
    departmentChartInstance = new Chart(document.getElementById("departmentChart").getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Number of Complaints",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  });
}

renderCharts();
let lastPage = sessionStorage.getItem("lastPageVisited");
// console.log(lastPage);
if(lastPage === "user"){
    sessionStorage.removeItem("lastPageVisited");
    fetchAndRenderUsers();
}
else if(lastPage === "complaint"){
    sessionStorage.removeItem("lastPageVisited");
    fetchAndRenderComplaints();
}
else if(lastPage === "complaintType"){
    sessionStorage.removeItem("lastPageVisited");
    fetchAndRenderComplaintTypes();
}
else if(lastPage === "department"){
    sessionStorage.removeItem("lastPageVisited");
    fetchAndRenderDepartments();
}