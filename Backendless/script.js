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
// 🔔 Alert Function (Perfect CSS Classes ke liye)
// =======================================
function showAlert(msg, targetId, type = 'error') {
  const msgBox = document.getElementById(targetId);
  if (msgBox) {
    msgBox.textContent = msg;
    msgBox.className = `msg ${type} show`;
    
    setTimeout(() => {
      msgBox.classList.remove('show');
    }, 4000);
  }
}

// =======================================
// 🧾 REGISTER USER (CREATE ACCOUNT)
// =======================================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  if (!username || !email || !password) {
    showAlert("❌ Please fill all fields!", "registerMessage");
    return;
  }

  try {
    const user = new Backendless.User();
    user.name = username;
    user.email = email;
    user.password = password;

    const created = await Backendless.UserService.register(user);
    
    showAlert("✅ Account created successfully!", "registerMessage", "success");
    console.log("✅ REGISTER SUCCESS:", created);
    
    e.target.reset();

  } catch (err) {
    console.error("❌ Register Error:", err);
    showAlert("❌ Error: " + err.message, "registerMessage");
  }
});

// =======================================
// 🔐 LOGIN USER
// =======================================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = e.target.identifier.value.trim();
  const password = e.target.password.value.trim();

  if (!identifier || !password) {
    showAlert("❌ Enter username/email and password.", "loginMessage");
    return;
  }

  try {
    showAlert("🔄 Logging in...", "loginMessage", "success");
    
    const logged = await Backendless.UserService.login(identifier, password, true);
    
    showAlert("✅ Login successful! Redirecting...", "loginMessage", "success");
    console.log("✅ LOGIN SUCCESS:", logged);
    
    // 1.5 sec wait then redirect to Google
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 1500);

  } catch (err) {
    console.error("❌ Login Error:", err);
    showAlert("❌ Login failed: " + err.message, "loginMessage");
  }
});
