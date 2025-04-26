const URL = "http://localhost:4000";
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
  counter++;

  if (emailRegex.test(email) && email.length !== 0) {
    const user = {
      UserID: counter,
      Name: name,
      Email: email,
      Phone: Number(phone),
      UserType: "Customer",
      Password: pass,
    };

    fetch(`${URL}/Users`)
      .then(res => res.json())
      .then(data => {
        const exists = data.some(user => user.Email === email);
        if (exists) {
          msg.innerHTML = "<div style='color: red'> Email already registered</div>";
        } else {
          msg.innerHTML = "";
          fetch(`${URL}/Users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          })
            .then(() => (window.location.href = "./login.html"))
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
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
