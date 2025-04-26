function loadReport(){
    const container = document.getElementById("query");
    const main = document.getElementById("table-container");
    main.innerHTML = "";
    container.innerHTML = `
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
        <div class="chart-grid" style="margin-top:5px">
                <div class="pie-chart-card">
                  <div class="chart-title">Complaints by Status</div>
                  <canvas id="statusPieChart"></canvas>
                </div>
                <div class="bar-chart-card">
                  <div class="chart-title">Complaints by Department</div>
                  <canvas id="departmentChart"></canvas>
                </div>
              </div>
              
              <div class="dashboard-second-row">
                <!-- Column 1: Two small stat cards -->
                <div class="mini-stats-column">
                  <div class="mini-card" id="userCountCard">
                    <div class="mini-title">Total Users</div>
                    <div class="mini-value" id="userCount">--</div>
                  </div>
                  <div class="mini-card" id="complaintCountCard">
                    <div class="mini-title">Total Complaints</div>
                    <div class="mini-value" id="complaintCount">--</div>
                  </div>
                </div>
                
                <!-- Column 3: Top Complaint Types (Bar Chart) -->
                <div class="chart-card">
                  <div class="chart-title">Top Complaint Types</div>
                  <canvas id="complaintStatusChart" width="400" height="200"></canvas>
                </div>
                <!-- Column 2: Complaints Over Time (Line Chart) -->
                <div class="chart-card">
                  <div class="chart-title">Complaints Over Time</div>
                  <canvas id="complaintsOverTimeChart"></canvas>
                </div>
            </div>
              <div class="dashboard-second-row">
                <!-- Column 1: Two small stat cards -->
                <div class="mini-stats-column">
                  <div class="mini-card" id="userCountCard">
                    <div class="mini-title">Total Users</div>
                    <div class="mini-value" id="userCount">--</div>
                  </div>
                  <div class="mini-card" id="complaintCountCard">
                    <div class="mini-title">Total Complaints</div>
                    <div class="mini-value" id="complaintCount">--</div>
                  </div>
                </div>
                
                <!-- Column 3: Top Complaint Types (Bar Chart) -->
                <div class="chart-card">
                  <div class="chart-title">Top Complaint Types</div>
                  <canvas id="complaintStatusChart" width="400" height="200"></canvas>
                </div>
                <!-- Column 2: Complaints Over Time (Line Chart) -->
                <div class="chart-card">
                  <div class="chart-title">Complaints Over Time</div>
                  <canvas id="complaintsOverTimeChart"></canvas>
                </div>
            </div>
            </div>
            
            </div>
        </div>
        <button id="cmd" onclick="downloadPDF()" style="background-color: #44B78B; color:white; height: 4vh; padding: 0 1vw; border: none; border-radius: 4px; font-size: 1em; cursor: pointer; margin: 10px">
              Download as PDF
          </button>

  `;
  loadCounts();
  renderCharts();
}



// const URL = "http://localhost:4000/"; // change this to your actual URL

    async function loadCounts() {
      try {
        const [users, departments, complaints, resolved] = await Promise.all([
          fetch(`${URL}/Users`).then(res => res.json()),
          fetch(`${URL}/Departments`).then(res => res.json()),
          fetch(`${URL}/Complaints`).then(res => res.json()),
          fetch(`${URL}/Complaints?status=resolved`).then(res => res.json()),
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

    // loadCounts();
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