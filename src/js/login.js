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
  const emailInput = document.getElementById("emailInput").value;
  const passInput = document.getElementById("passInput").value;
  const validPass = document.getElementById("validPass");

  fetch(`${URL}/api/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json",},
    body: JSON.stringify({email: emailInput, password: passInput}),
  })
  .then((res) => res.text()) 
  .then((text) => {
    if (!text) {
      validPass.innerHTML = "Invalid username or password.";
      return;
    }
  
    const user = JSON.parse(text);
  
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  
    if (user.userType === "Customer") {
      window.location.href = "users.html";
    } else if (user.userType === "Admin") {
      window.location.href = "admin.html";
    } else {
      validPass.innerHTML = "Unknown user type.";
    }
  })
  .catch((error) => {
    console.error("Login error:", error);
    validPass.innerHTML = "Something went wrong. Please try again.";
  });
  
}

function checkUsernamePassword() {
  const emailInput = document.getElementById("emailInput").value;
  const passInput = document.getElementById("passInput").value;
  const validPass = document.getElementById("validPass");

  fetch(`${URL}/api/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json",},
    body: JSON.stringify({email: emailInput, password: passInput}),
  })
  .then((res) => res.text()) 
  .then((text) => {
    if (!text) {
      validPass.innerHTML = "Invalid username or password.";
      return;
    }
  
    const user = JSON.parse(text);
  
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  
    if (user.userType === "Customer") {
      window.location.href = "users.html";
    } else if (user.userType === "Admin") {
      window.location.href = "admin.html";
    } else {
      validPass.innerHTML = "Unknown user type.";
    }
  })
  .catch((error) => {
    console.error("Login error:", error);
    validPass.innerHTML = "Something went wrong. Please try again.";
  });
  
}

function loginUser() {
  if (validateEmailLogin()) {
    checkUsernamePassword();
  }
}
