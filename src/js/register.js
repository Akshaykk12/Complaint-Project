const URL = "http://localhost:8080";
let counter = 10;

function validateName() {
  const name = document.getElementById("nameInputInReg").value.trim();
  const msg = document.getElementById("validNameInReg");
  if (name.length <= 3) {
    msg.innerHTML = "<p style='color:red'>Characters must be greater than 3.</p>";
    return false;
  }
  msg.innerHTML = "";
  return true;
}

function validatePhone() {
  const phone = document.getElementById("phoneInputInReg").value.trim();
  const msg = document.getElementById("validphoneInReg");
  if (phone.length !== 10 || isNaN(phone)) {
    msg.innerHTML = "<p style='color:red'>Must be 10 digits long</p>";
    return false;
  }
  msg.innerHTML = "";
  return true;
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email = document.getElementById("emailInputInReg").value.trim();
  const msg = document.getElementById("validEmailInReg");
  const name = document.getElementById("nameInputInReg").value.trim();
  const phone = document.getElementById("phoneInputInReg").value.trim();
  const pass = document.getElementById("passInputInReg").value.trim();

  if (emailRegex.test(email) && email.length !== 0) {
    const user = {
      name: name,
      email: email,
      phone: Number(phone),
      userType: "USER",
      password: pass,
    };
    console.log(user);

    fetch(`${URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
  })
      .then(res => {
          if (res.status === 409) {
              msg.innerHTML = "<div style='color: red'>Email already registered</div>";
              return;
          }
          if (!res.ok) {
              throw new Error(`Registration failed: ${res.status}`);
          }
          // On success, redirect
          window.location.href = "./login.html";
      })
      .catch(err => {
          console.error("Error:", err);
          msg.innerHTML = "<div style='color: red'>An error occurred. Please try again later.</div>";
      });
  } else {
    msg.innerHTML = "<div style='color: red'>Enter valid email</div>";
  }
}

function validatePassword() {
  const pass = document.getElementById("passInputInReg").value;
  const msg = document.getElementById("validPassInReg");
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[a#$%^&+=!]).{8,}$/;
  if (regex.test(pass)) {
    msg.innerHTML = "";
    return true;
  }
  msg.innerHTML = "<p style='color:red'>Must be 8+ chars with upper, lower, digit & special char</p>";
  return false;
}

function validateConfirmPassword() {
  const pass = document.getElementById("passInputInReg").value;
  const confirm = document.getElementById("confirmPassInputInReg").value;
  const msg = document.getElementById("validComfPassInReg");
  if (pass === confirm) {
    msg.innerHTML = "";
    return true;
  }
  msg.innerHTML = "<p style='color:red'>Doesn't match with the above password</p>";
  return false;
}

function registerUser() {
  if (validateName() & validatePhone() & validatePassword() & validateConfirmPassword()) {
    validateEmail();
  }
}
