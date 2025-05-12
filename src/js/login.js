const URL = "http://localhost:8080";  



function validateEmailLogin() {
  const emailInput = document.getElementById("emailInput").value;
  const validEmail = document.getElementById("validEmail");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailInput) && emailInput.length !== 0) {
    validEmail.innerHTML = "";
    return true;
  } else {
    validEmail.innerHTML = "Enter a valid email";
    return false;
  }
}

function checkUsernamePassword() {
  const validPass = document.getElementById("validPass");

  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passInput").value;

  fetch("http://localhost:8080/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password: password})
  })
    .then(response => {
      // Handle HTTP status codes with console logs
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        document.getElementById("error").textContent = "404 Not Found - Users data not available.";
      } else if (response.status === 401) {
        document.getElementById("error").textContent = "401 Unauthorized - Invalid token or access denied.";
      } else if (response.status === 500) {
        document.getElementById("error").textContent = "500 Internal Server Error.";
      } else {
        document.getElementById("error").textContent = `Unexpected status code: ${response.status}`;
      }
    })
    .then(response => {
      if (!response) return;

      if (response.token){
        console.log(response.token)
        localStorage.setItem("token", response.token);}
      else
        throw new Error("Token Not Found");

      const userType = getUserType();
      if (userType == "USER") {
        window.location.href = "../../public/users.html";
      } else {
        window.location.href = "../../public/admin.html";
      }
      
    }
    )
    .catch(error => {
      console.log(error);
      document.getElementById("error").textContent = "Something went wrong. Please try again.";
    });
  
}

// function checkUsernamePassword() {
//   const emailInput = document.getElementById("emailInput").value;
//   const passInput = document.getElementById("passInput").value;
//   const validPass = document.getElementById("validPass");

//   fetch(`${URL}/auth/signin`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json",},
//     body: JSON.stringify({email: emailInput, password: passInput}),
//   })
//   .then((res) => res.text()) 
//   .then((text) => {
//     if (!text) {
//       validPass.innerHTML = "Invalid username or password.";
//       return;
//     }
  
//     const user = JSON.parse(text);
  
//     sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  
//     if (user.userType === "Customer") {
//       window.location.href = "users.html";
//     } else if (user.userType === "Admin") {
//       window.location.href = "admin.html";
//     } else {
//       validPass.innerHTML = "Unknown user type.";
//     }
//   })
//   .catch((error) => {
//     console.error("Login error:", error);
//     validPass.innerHTML = "Something went wrong. Please try again.";
//   });
  
// }

function loginUser() {
  if (validateEmailLogin()) {
    checkUsernamePassword();
  }
}