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
// BACKENDLESS API CONFIG
// ------------------------------------------
const APP_ID = "BE4587A1-939B-4462-8DB1-0D3DF406DA08";
const API_KEY = "2224DCAC-4651-478B-A669-1C3C8F8B13DC"; // JS KEY

const BASE_URL = `https://api.backendless.com/${APP_ID}/${API_KEY}/services/AuthService`;


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
    // calling your custom Backendless cloud API
    const res = await fetch(`${BASE_URL}/createAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json();

    if (result.success) {
      registerMsg.innerHTML = "<span style='color:green'>🎉 Account created successfully!</span>";
      console.log("Account created:", username);

      // switch to login tab
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
      body: JSON.stringify({ username: identifier, password })
    });

    const result = await res.json();

    if (result.success) {
      loginMsg.innerHTML = "<span style='color:green'>✅ Login successful!</span>";
      console.log("User logged in:", result.userId);

      // redirect to your page
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
