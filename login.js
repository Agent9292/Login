/* ============================================================
   PUBLIC EDGE FUNCTION URL (NO ANON KEY REQUIRED)
============================================================ */
const EDGE_URL =
  "https://vbcwluybotksaimqfodf.supabase.co/functions/v1/Logics-Logins";


/* ============================================================
   TAB SWITCHING
============================================================ */
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


/* ============================================================
   UNIVERSAL EDGE FUNCTION CALLER (No anon key)
============================================================ */
async function callEdgeFunction(payload) {
  try {
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("🔵 RAW:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, message: "Invalid JSON returned from server" };
    }

    if (!res.ok) {
      return { success: false, message: json.message || "Unknown error" };
    }

    return json;

  } catch (err) {
    return { success: false, message: "Network error", raw: err };
  }
}



/* ============================================================
   REGISTER FORM HANDLER
============================================================ */
const registerForm = document.getElementById("registerForm");
const registerMsg = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async e => {
  e.preventDefault();

  const username = registerForm.username.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (!username || !email || !password) {
    registerMsg.innerHTML = `<span style="color:#ff4d4d">❌ Fill all fields!</span>`;
    return;
  }

  const result = await callEdgeFunction({
    type: "signup",
    username,
    email,
    password
  });

  if (result.success) {
    registerMsg.innerHTML = `<span style="color:#00c853">🎉 Account created!</span>`;
    registerForm.reset();

    setTimeout(() => {
      document.querySelector('.tab[data-target="login"]').click();
    }, 800);

  } else {
    registerMsg.innerHTML = `<span style="color:#ff4d4d">❌ ${result.message}</span>`;
  }
});



/* ============================================================
   LOGIN FORM HANDLER
============================================================ */
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async e => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim();
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    loginMsg.innerHTML = `<span style="color:#ff4d4d">❌ Fill all fields!</span>`;
    return;
  }

  const result = await callEdgeFunction({
    type: "login",
    identifier,
    password
  });

  if (result.success) {
    loginMsg.innerHTML = `<span style="color:#00c853">✅ Login successful!</span>`;

    setTimeout(() => {
      window.location.href = "https://www.google.com"; // your redirect
    }, 600);

  } else {
    loginMsg.innerHTML = `<span style="color:#ff4d4d">❌ ${result.message}</span>`;
  }
});
