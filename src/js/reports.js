function loadReport() {
  const container = document.getElementById("query");
  const report = document.getElementById("report");
  
  report.innerHTML = `
      <h1> Complaints Report </h1>
      <div class="card-container">
          <div class="card">
          <h3>Total Users</h3>
          <p id="usersCount">Loading...</p>
          </div>
          <div class="card">
          <h3>Total Departments</h3>
          <p id="departmentsCount">Loading...</p>
          </div>
          <div class="card">
          <h3>Total Complaints</h3>
          <p id="complaintsCount">Loading...</p>
          </div>
      </div>
      <div>
          <h1>Insights</h1>
      </div>
  `;
  report.appendChild(container);

  container.innerHTML = "";

  loadCounts();
}



// const URL = "http://localhost:4000/"; // change this to your actual URL

    async function loadCounts() {
      try {
        const [users, departments, complaints, resolved] = await Promise.all([
          fetch(`${URL}/api/users`).then(res => res.json()),
          fetch(`${URL}/api/departments`).then(res => res.json()),
          fetch(`${URL}/api/complaints`).then(res => res.json()),
          fetch(`${URL}/api/complaints?status=resolved`).then(res => res.json()),
        ]);

        document.getElementById("usersCount").textContent = users.length;
        document.getElementById("departmentsCount").textContent = departments.length;
        document.getElementById("complaintsCount").textContent = complaints.length;
        let count = document.getElementById("resolvedCount");
        if (count)count.textContent = resolved.length;
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    }

    async function downloadPDF() {
        const container = document.getElementById('query');     
        const canvas = await html2canvas(container);
    
        const imgData = canvas.toDataURL('image/png');
    
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('report.pdf');
      }