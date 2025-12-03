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
    registerMsg.innerHTML = "<span style='color:red'>❌ Fill all fields!</span>";
    return;
  }

  try {
    const newUser = { username, email, password };
    await Backendless.UserService.register(newUser);

    // UI message
    registerMsg.innerHTML = "<span style='color:green'>🎉 Account created successfully!</span>";

    // Console log
    console.log("🎉 Your account was successfully created!");

    // Auto switch to login
    setTimeout(() => {
      document.querySelector('.tab[data-target=\"login\"]').click();
    }, 800);

  } catch (err) {
    registerMsg.innerHTML = "<span style='color:red'>❌ " + err.message + "</span>";
  }
});

// ------------------------------------------
// LOGIN FORM
// ------------------------------------------
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim(); // username or email
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    loginMsg.innerHTML = "<span style='color:red'>❌ Fill all fields!</span>";
    return;
  }

  try {
    const user = await Backendless.UserService.login(identifier, password, true);

    // UI success message
    loginMsg.innerHTML = "<span style='color:green'>✅ Login successful!</span>";

    // Console success message
    console.log(`🎉 User logged in successfully: ${identifier}`);

  } catch (err) {
    loginMsg.innerHTML = "<span style='color:red'>❌ Login failed: " + err.message + "</span>";
  }
});
