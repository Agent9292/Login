// ------------------------------------------
// Backendless Init
// ------------------------------------------
Backendless.initApp(
  "BE4587A1-939B-4462-8DB1-0D3DF406DA08",   // App ID
  "2224DCAC-4651-478B-A669-1C3C8F8B13DC"    // JS Key
);

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
    registerMsg.innerHTML = "<span style='color:red'>❌ Please fill all fields!</span>";
    return;
  }

  const newUser = { username, email, password };

  try {
    await Backendless.UserService.register(newUser);

    registerMsg.innerHTML = "<span style='color:green'>✔ Account created successfully!</span>";

    setTimeout(() => {
      document.querySelector('.tab[data-target="login"]').click();
    }, 800);

  } catch (err) {
    registerMsg.innerHTML = "<span style='color:red'>❌ " + err.message + "</span>";
  }
});

// ------------------------------------------
// LOGIN FORM (fixed + success message)
// ------------------------------------------
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim(); // email or username
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    loginMsg.innerHTML = "<span style='color:red'>❌ Please fill all fields!</span>";
    return;
  }

  try {
    // Backendless expects email by default
    // username login automatically works if username field exists in DB
    const user = await Backendless.UserService.login(identifier, password, true);

    loginMsg.innerHTML = "<span style='color:green'>✔ Login successful! Redirecting...</span>";

    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 1200);

  } catch (err) {
    loginMsg.innerHTML = "<span style='color:red'>❌ Login failed: " + err.message + "</span>";
  }
});
