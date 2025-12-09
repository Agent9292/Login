// ------------------------------------------
// BACKENDLESS API CONFIG
// ------------------------------------------
const APP_ID = "01934801-7990-4C01-B583-16A556577788";
const API_KEY = "FFF3E121-DFAC-4477-9BAE-8127B787E51B"; // JS KEY

// Your Cloud Code Service: CLASS NAME = Login
const SERVICE_NAME = "Login";

const BASE_URL = `https://api.backendless.com/${APP_ID}/${API_KEY}/services/${SERVICE_NAME}`;


// ------------------------------------------
// TAB SWITCHING (login <-> register)
// ------------------------------------------
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});


// ------------------------------------------
// REGISTER FORM
// ------------------------------------------
const registerForm = document.getElementById("registerForm");
const registerMsg = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = registerForm.username.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (!username || !email || !password) {
    registerMsg.innerHTML = "<span style='color:red'>❌ Fill all fields!</span>";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const result = await res.json();
    console.log("Signup Response:", result);

    if (result.success) {
      registerMsg.innerHTML = "<span style='color:green'>🎉 Account created successfully!</span>";

      setTimeout(() => {
        document.querySelector('.tab[data-target="login"]').click();
      }, 800);

    } else {
      registerMsg.innerHTML = `<span style='color:red'>❌ ${result.message}</span>`;
    }

  } catch (err) {
    registerMsg.innerHTML = `<span style='color:red'>❌ ${err.message}</span>`;
  }
});


// ------------------------------------------
// LOGIN FORM
// ------------------------------------------
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim();
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    loginMsg.innerHTML = "<span style='color:red'>❌ Fill all fields!</span>";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier,
        password
      })
    });

    const result = await res.json();
    console.log("Login Response:", result);

    if (result.success) {
      loginMsg.innerHTML = "<span style='color:green'>✅ Login successful!</span>";

      setTimeout(() => {
        window.location.href = "https://www.google.com/";
      }, 600);

    } else {
      loginMsg.innerHTML = `<span style='color:red'>❌ ${result.message}</span>`;
    }

  } catch (err) {
    loginMsg.innerHTML = `<span style='color:red'>❌ ${err.message}</span>`;
  }
});
