const apiBase = 'http://localhost:4000';
function renderCharts(){
fetch(`${apiBase}/Users`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("userCount").textContent = data.length;
  });

fetch(`${apiBase}/Complaints`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("complaintCount").textContent = data.length;
    const statusCounts = {};
    const dateCounts = {};

    data.forEach(c => {
      const status = c.Status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const date = c.DateFiled;
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const statusLabels = Object.keys(statusCounts);
    const statusValues = Object.values(statusCounts);

    new Chart(document.getElementById("complaintStatusChart").getContext("2d"), {
      type: 'bar',
      data: {
        labels: statusLabels,
        datasets: [{
          label: 'Complaints by Status',
          data: statusValues,
          backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    const sortedDates = Object.keys(dateCounts).sort();
    const counts = sortedDates.map(d => dateCounts[d]);

    new Chart(document.getElementById("complaintsOverTimeChart").getContext("2d"), {
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

    new Chart(document.getElementById("statusPieChart").getContext("2d"), {
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


Promise.all([
  fetch(`${apiBase}/Complaints`).then(res => res.json()),
  fetch(`${apiBase}/Departments`).then(res => res.json())
]).then(([complaints, departments]) => {
  const deptMap = {};
  departments.forEach(d => deptMap[d.DeptID] = d.Name);

  const complaintCounts = {};
  complaints.forEach(c => {
    const deptName = deptMap[c.DeptID] || `Dept ${c.DeptID}`;
    complaintCounts[deptName] = (complaintCounts[deptName] || 0) + 1;
  });

  const labels = Object.keys(complaintCounts);
  const values = Object.values(complaintCounts);
  new Chart(document.getElementById("departmentChart").getContext("2d"), {
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
console.log(lastPage);
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