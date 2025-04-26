const URL = "http://localhost:4000";
let sortedDirectionUser = 1;
let sortedDirectionDept = 1;
let sortedDirectionCompType = 1;
let sortedDirectionComp = 1;

let deptCounter = 10;
let compTypCounter = 10;

let editIdDept = null;
let editIdCompType = null;

// Load all the data

fetch(`${URL}/Users`)
      .then(res => res.json())
      .then(data => {
          allUsers = data;
      })
      .catch(err => {
          console.error("Error fetching data:", err);
      });

fetch(`${URL}/Departments`)
      .then(res => res.json())
      .then(data => {
          allDepartments = data;
      })
      .catch(err => {
          console.error("Error fetching data:", err);
      });

fetch(`${URL}/ComplaintTypes`)
      .then(res => res.json())
      .then(data => {
          allComplaintTypes = data;
      })
      .catch(err => {
          console.error("Error fetching data:", err);
      });

fetch(`${URL}/Complaints`)
      .then(res => res.json())
      .then(data => {
          allComplaints = data;
      })
      .catch(err => {
          console.error("Error fetching data:", err);
      });

// Search Bar

let searchInput = document.createElement("input");
searchInput.setAttribute("type", "text");
searchInput.setAttribute("placeholder", "Search in all Database");
searchInput.setAttribute("style","height: 4vh; width: 22.6vw;")
document.querySelector("#sidebar-table").parentNode.insertBefore(searchInput,document.querySelector("#sidebar-analytics"));

searchInput.addEventListener("input", () => {
    let searchTerm = searchInput.value.toLowerCase();
    const search1 = document.getElementById("search-1");
    search1.innerHTML = "";
    const search2 = document.getElementById("search-2");
    search2.innerHTML = "";
    const search3 = document.getElementById("search-3");
    search3.innerHTML = "";
    const search4 = document.getElementById("search-4");
    search4.innerHTML = "";
    searchAll(searchTerm);
});

function searchAll(search){
  const container = document.getElementById("table-container");
  container.innerHTML = '';
  
  const filteredUsers = allUsers.filter(com =>
    com.Name.toLowerCase().includes(search) ||
    com.Email.toLowerCase().includes(search)
  )
  const filteredDepartments = allDepartments.filter(com =>
    com.Name.toLowerCase().includes(search)
  )
  const filteredComplaintTypes = allComplaintTypes.filter(com =>
    com.ComplaintType.toLowerCase().includes(search) ||
    com.Severity.toLowerCase().includes(search) 
  )
  const filteredComplaints = allComplaints.filter(com =>
    com.Description.toLowerCase().includes(search)
  )
  
    const search1 = document.getElementById("search-1");
    let title1 = document.createElement("h1");
    title1.textContent = "Users";
    search1.appendChild(title1);
    search1.appendChild(displayUsers(filteredUsers));

    const search2 = document.getElementById("search-2");
    let title2 = document.createElement("h1");
    title2.textContent = "Departments";
    search2.appendChild(title2);
    search2.appendChild(displayDepartments(filteredDepartments));

    const search3 = document.getElementById("search-3");
    let title3 = document.createElement("h1");
    title3.textContent = "Complaint Types";
    search3.appendChild(title3);
    search3.appendChild(displayComplaintTypes(filteredComplaintTypes));
    
    const search4 = document.getElementById("search-4");
    let title4 = document.createElement("h1");
    title4.textContent = "Complaints";
    search4.appendChild(title4);
    search4.appendChild(displayComplaints(filteredComplaints));
  
}

