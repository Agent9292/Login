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

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = registerForm.username.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (!username || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  const newUser = { username, email, password };

  try {
    await Backendless.UserService.register(newUser);
    alert("Account created successfully!");
    document.querySelector('.tab[data-target="login"]').click();
  } catch (err) {
    alert("Registration Error: " + err.message);
  }
});

// ------------------------------------------
// LOGIN FORM (simplified)
// ------------------------------------------
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim(); // username OR email
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    alert("Please enter your login details!");
    return;
  }

  try {
    // Direct login (Backendless accepts either email or username)
    await Backendless.UserService.login(identifier, password, true);

    alert("Login successful!");
    window.location.href = "https://www.google.com"; // redirect
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});
