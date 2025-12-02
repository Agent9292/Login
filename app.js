// =======================================
// 🔧 Backendless Init
// =======================================
const APP_ID = "312D4559-96D4-4627-9AAE-88BFDC7ED1CC";
const API_KEY = "CDF8B2F0-2693-428B-A125-50CA7F5B7662";

Backendless.initApp(APP_ID, API_KEY);



// =======================================
// 🔁 Tab Toggle (Login / Register)
// =======================================
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.dataset.target;

    panels.forEach(panel => {
      panel.classList.remove("active");
      if (panel.id === target) panel.classList.add("active");
    });
  });
});



// =======================================
// 🧾 REGISTER USER
// =======================================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const user = new Backendless.User();
    user.name = name;
    user.email = email;
    user.password = password;

    const createdUser = await Backendless.UserService.register(user);

    alert("Account created successfully!");

    console.log("REGISTER →", createdUser);

    e.target.reset();

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
});



// =======================================
// 🔐 LOGIN USER
// =======================================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const loggedUser = await Backendless.UserService.login(email, password, true);

    alert("Logged in successfully!");

    console.log("LOGIN →", loggedUser);

    // Yahan tum apna redirect daal sakte ho
    // window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
});

