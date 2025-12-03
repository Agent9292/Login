// ------------------------------------------
// Backendless Init
// ------------------------------------------
Backendless.initApp(
  "BE4587A1-939B-4462-8DB1-0D3DF406DA08",
  "2224DCAC-4651-478B-A669-1C3C8F8B13DC"
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

  const newUser = {
    username: username,
    email: email,
    password: password
  };

  try {
    await Backendless.UserService.register(newUser);
    alert("Account created successfully!");

    // Switch to login tab
    document.querySelector('.tab[data-target="login"]').click();

  } catch (err) {
    alert("Error: " + err.message);
  }
});

// ------------------------------------------
// LOGIN FORM (username OR email)
// ------------------------------------------
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim(); // username OR email
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    alert("Please enter login details!");
    return;
  }

  try {
    let query;

    // identifier is email
    if (identifier.includes("@")) {
      query = `email = '${identifier}'`;
    }
    // identifier is username
    else {
      query = `username = '${identifier}'`;
    }

    // Find user
    const foundUsers = await Backendless.Data.of("Users").find({
      whereClause: query,
      pageSize: 1
    });

    if (foundUsers.length === 0) {
      alert("User not found!");
      return;
    }

    const foundUser = foundUsers[0];

    // Login using user email (Backendless requires email)
    await Backendless.UserService.login(foundUser.email, password, true);

    alert("Login successful!");

    // Redirect to Google
    window.location.href = "https://www.google.com";

  } catch (err) {
    alert("Login failed: " + err.message);
  }
});
