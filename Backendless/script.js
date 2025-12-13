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
// 🧾 REGISTER USER (CREATE ACCOUNT)
// =======================================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // IMPORTANT!

  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  if (!name || !email || !password) {
    showAlert("❌ Please fill all fields!");
    return;
  }

  try {
    const user = new Backendless.User();
    user.name = name;
    user.email = email;
    user.password = password;

    const created = await Backendless.UserService.register(user);

    showAlert("✅ Account created successfully!");
    console.log("REGISTER:", created);

    e.target.reset();

  } catch (err) {
    showAlert("❌ Error: " + err.message);
  }
});



// =======================================
// 🔐 LOGIN USER
// =======================================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // IMPORTANT!

  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  if (!email || !password) {
    showAlert("❌ Enter email and password.");
    return;
  }

  try {
    const logged = await Backendless.UserService.login(email, password, true);

    showAlert("✅ Login successful!");
    console.log("LOGIN:", logged);

    // SUCCESS → Redirect to Google
    window.location.href = "https://www.google.com";

  } catch (err) {
    showAlert("❌ Login failed: " + err.message);
  }
});



// =======================================
// 🔔 SIMPLE ALERT (Top Message)
// =======================================
function showAlert(msg) {
  let box = document.getElementById("msgBox");

  if (!box) {
    box = document.createElement("div");
    box.id = "msgBox";
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.padding = "12px 25px";
    box.style.background = "#ff0044";
    box.style.color = "#fff";
    box.style.borderRadius = "8px";
    box.style.fontSize = "15px";
    box.style.zIndex = "9999";
    box.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
    document.body.appendChild(box);
  }

  box.innerHTML = msg;
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}
