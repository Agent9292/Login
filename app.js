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
    // remove active from all
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    // add active to current
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
    username,
    email,
    password
  };

  try {
    await Backendless.UserService.register(newUser);
    alert("Account created successfully!");

    // Switch to login tab automatically
    document.querySelector('.tab[data-target="login"]').click();

  } catch (err) {
    alert("Error: " + err.message);
  }
});

// ------------------------------------------
// LOGIN FORM
// Username OR Email + Password
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
    // If input contains "@" treat as email, else username
    let loginField;

    if (identifier.includes("@")) {
      loginField = { email: identifier };
    } else {
      loginField = { username: identifier };
    }

    // search DB for user
    const foundUser = await Backendless.Data.of("Users").findFirst(loginField);

    // then login using email + password (Backendless requires email for login)
    const loggedIn = await Backendless.UserService.login(foundUser.email, password, true);

    alert("Login successful!");

    // redirect to Google (you can change the link)
    window.location.href = "https://www.google.com";

  } catch (err) {
    alert("Login failed: " + err.message);
  }
});
