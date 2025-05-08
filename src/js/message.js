function fetchAndRenderComplaintsChat(){
    let userBreadCrumb = document.getElementById("secondary-nav");
    userBreadCrumb.innerHTML = `
    <div onclick="window.location.href='./admin.html'" style="cursor: pointer; padding-left: 5px;">Home</div>
    <div onclick="fetchAndRenderComplaintsChat()" style="cursor: pointer; padding-left: 5px;"> > Complaint Messaging </div>
    `;
    
      fetch(`${URL}/api/complaints`)
          .then(res => res.json())
          .then(data => {
              allComplaints = data;
              if(allComplaints.length != 0){
                renderComplaintsChat(allComplaints);
              }else{
                displayComplaintChatTable();
              }
          })
          .catch(err => {
              console.error("Error fetching data:", err);
          });
    }

    function displayComplaintChatTable(){
        const container = document.getElementById("table-container");
        container.innerHTML = "";
    
        const title = document.createElement("h1");
        title.textContent = "Complaints";
        container.appendChild(title);
    
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
    
        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        headRow.innerHTML = `
          <th>Complaint ID</th>
            <th>User</th>
            <th>Department</th>
            <th>Complaint Type</th>
            <th>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Description</span>
                <span id="sortArrowDescription" style="font-size: 25px; cursor: pointer;">↕</span>
              </div>
            </th>
            <th>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Date Filed</span>
                <span id="sortArrowDataFiled" style="font-size: 25px; cursor: pointer;">↕</span>
              </div>
            </th>
            <th>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Status</span>
                <span id="sortArrowStatus" style="font-size: 25px; cursor: pointer;">↕</span>
              </div>
            </th>
        `;
        thead.appendChild(headRow);
    
        const tbody = document.createElement("tbody");
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.colSpan = 8;
        noDataCell.style.textAlign = "center";
        noDataCell.style.padding = "15px";
        noDataCell.textContent = "No complaints logged";
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
    
        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
      }

      function displayComplaintsChats(data){
        fetch(`${URL}/api/users/form-data`)
    .then(res => res.json())
    .then(data => {
        departments = data.departments;
        complaintType = data.complaintTypes;
        users = data.users;
    
    });
        
        const userMap = Object.fromEntries(allUsers.map(u => [u.id, u.name]));
        const deptMap = Object.fromEntries(allDepartments.map(d => [d.deptId, d.deptName]));
        const ctMap = Object.fromEntries(allComplaintTypes.map(c => [c.compTypeId, c.compType]));
        const table = document.createElement("table");
        
        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        const query = document.getElementById("query-container");
        query.innerHTML = "";
          headRow.innerHTML = `
            <th style="width: 4vw">User</th>
            <th style="width: 4vw">Department</th>
            <th style="width: 4vw">Complaint Type</th>
            <th>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Description</span>
                <span id="sortArrowDescription" style="font-size: 25px; cursor: pointer;">↕</span>
              </div>
            </th>
            <th>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Date Filed</span>
                <span id="sortArrowDataFiled" style="font-size: 25px; cursor: pointer;">↕</span>
              </div>
            </th>
            <th>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Status</span>
                <span id="sortArrowStatus" style="font-size: 25px; cursor: pointer;">↕</span>
              </div>
            </th>
          `;
          thead.appendChild(headRow);
          table.appendChild(thead);
      
          const tbody = document.createElement("tbody");
          data.forEach(row => {
            const statusClass = row.status.toLowerCase().replace(/\s/g, '-');
            const statusBadge = `<span onclick="editStatus('${row.compId}')" class="status-badge ${statusClass}">${row.status}</span>`;
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${userMap[row.userId] || 'Unknown User'}</td>
              <td>${deptMap[row.deptId] || 'Unknown Dept'}</td>
              <td>${ctMap[row.ctId] || 'Unknown Type'}</td>
              <td>${row.description}</td>
              <td>${row.date}</td>
              <td>${statusBadge}</td>`;
            
            tr.onclick = function() {
                chatService(row.compId);
            };
            tbody.appendChild(tr);
          });
      
          table.appendChild(tbody);
          return table;
      }
      function renderComplaintsChat(data) {
  
        const search1 = document.getElementById("search-1");
        const search2 = document.getElementById("search-2");
        const search3 = document.getElementById("search-3");
        const search4 = document.getElementById("search-4");
        search1.innerHTML = "";
        search2.innerHTML = "";
        search3.innerHTML = "";
        search4.innerHTML = "";
      
        const container = document.getElementById("table-container");
        container.innerHTML = ``;
      
        if (Array.isArray(data) && data.length > 0) {
          const title = document.createElement("h1");
          title.textContent = "Complaints";
          container.appendChild(title);
          container.appendChild(displayComplaintsChats(data));
        }
        const sortArrowDescription = document.getElementById("sortArrowDescription");
      
        sortArrowDescription.addEventListener("click", () => {
          const sorted = [...allComplaints].sort((a, b) =>
              a.description.localeCompare(b.description) * sortedDirectionComp
          );
          
          sortedDirectionComp *= -1;
          renderComplaintsChat(sorted);
        });
        const sortArrowStatus = document.getElementById("sortArrowStatus");
      
        sortArrowStatus.addEventListener("click", () => {
          const sorted = [...allComplaints].sort((a, b) =>
              a.status.localeCompare(b.status) * sortedDirectionComp
          );
          
          sortedDirectionComp *= -1;
          renderComplaintsChat(sorted);
        });
        const sortArrowDataFiled = document.getElementById("sortArrowDataFiled");
      
        sortArrowDataFiled.addEventListener("click", () => {
          const sorted = [...allComplaints].sort((a, b) =>
              a.date.localeCompare(b.date) * sortedDirectionComp
          );
          
          sortedDirectionComp *= -1;
          renderComplaintsChat(sorted);
        });
        
      }
      