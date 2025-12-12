// ------------------------------------------
// SUPABASE EDGE FUNCTION CONFIG
// ------------------------------------------
const EDGE_URL =
  "https://vbcwluybotksaimqfodf.supabase.co/functions/v1/Logics-Logins";

const SUPABASE_ANON_KEY =
  "eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M101JzdXBhYmFzZSIsInJlZiI6InZiY3dsdXlib3Rrc2FpbXFmb2RmIiwicm9sZSI6ImFub241LCJpYXQiOjE3NjUwMzA4NDcsImV4cCI6MjA4MDYwNjg3MH0.Ihjp_kpy8W2dcJGSKHOcb4rqMMnbYcegWiST3tEh-KO";


// ------------------------------------------
// TAB SWITCHING UI
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


// ----------------------------------------------------
// UNIVERSAL REQUEST WRAPPER
// ----------------------------------------------------
async function callEdgeFunction(payload) {

  try {
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("📥 RAW:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, message: "Server returned invalid JSON" };
    }

    if (!res.ok) {
      return { success: false, message: json.message || "Unknown error", raw: json };
    }

    return json;

  } catch (err) {
    return { success: false, message: "Network error", raw: err };
  }
}


// ------------------------------------------
// REGISTER FORM
// ------------------------------------------
const registerForm = document.getElementById("registerForm");
const registerMsg = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async e => {
  e.preventDefault();

  const username = registerForm.username.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (!username || !email || !password) {
    registerMsg.innerHTML = "<span style='color:red'>❌ Fill all fields!</span>";
    return;
  }

  const result = await callEdgeFunction({
    type: "signup",
    username,
    email,
    password
  });

  if (result.success) {
    registerMsg.innerHTML = "<span style='color:green'>🎉 Account created!</span>";

    setTimeout(() => {
      document.querySelector('.tab[data-target="login"]').click();
    }, 800);

  } else {
    registerMsg.innerHTML = `<span style='color:red'>❌ ${result.message}</span>`;
  }
});


// ------------------------------------------
// LOGIN FORM
// ------------------------------------------
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async e => {
  e.preventDefault();

  const identifier = loginForm.identifier.value.trim();
  const password = loginForm.password.value.trim();

  if (!identifier || !password) {
    loginMsg.innerHTML = "<span style='color:red'>❌ Fill all fields!</span>";
    return;
  }

  const result = await callEdgeFunction({
    type: "login",
    identifier,
    password
  });

  if (result.success) {
    loginMsg.innerHTML = "<span style='color:green'>✅ Login successful!</span>";

    setTimeout(() => {
      window.location.href = "https://www.google.com/";
    }, 600);

  } else {
    loginMsg.innerHTML = `<span style='color:red'>❌ ${result.message}</span>`;
  }
});
