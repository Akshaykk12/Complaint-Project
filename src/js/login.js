const URL = "http://localhost:4000"; // Adjust if your json-server uses a different port

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
  const passInput = document.getElementById("passInput").value;
  const emailInput = document.getElementById("emailInput").value;
  const validPass = document.getElementById("validPass");

  fetch(`${URL}/Users`)
    .then((res) => res.json())
    .then((data) => {
      const user = data.find(
        (res) => res.Email === emailInput && res.Password === passInput
      );

      if (user) {
        validPass.innerHTML = "";

        // 🧠 Store user data in sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));

        const userType = user.UserType;
        if (userType === "Customer") {
          window.location.href = "users.html";
        } else if (userType === "Admin") {
          window.location.href = "admin.html";
        }

        return true;
      } else {
        validPass.innerHTML = "Incorrect Username or Password";
        return false;
      }
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      validPass.innerHTML = "Something went wrong. Try again later.";
    });
}

function loginUser() {
  if (validateEmailLogin()) {
    checkUsernamePassword();
  }
}
