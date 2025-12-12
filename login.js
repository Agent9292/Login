// ========================================
// SUPABASE EDGE FUNCTION - FIXED VERSION
// ========================================
const EDGE_URL = "https://vbcwluybotksaimqfodf.supabase.co/functions/v1/Logics-Logins";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiY3dsdXlib3Rrc2FpbXFmb2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMzA4NDcsImV4cCI6MjA4MDYwNjg0N30.Ihjp_kpy8W2dcJGsKHOcb4rqMMnbYcegWiST3tEh-K0";

// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

// Universal API caller - FIXED CORS handling
async function callEdgeFunction(payload) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(EDGE_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY
      },
      body: JSON.stringify(payload)
    });

    clearTimeout(timeout);
    const text = await res.text();
    console.log("📥 Response:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, message: "Invalid JSON response", raw: text };
    }

    return res.ok ? json : { success: false, message: json.message || "Server error", raw: json };

  } catch (err) {
    console.error("❌ Network error:", err);
    return { success: false, message: err.name === 'AbortError' ? "Request timeout" : "Network error" };
  }
}

// Register form handler
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const registerMsg = document.getElementById("registerMessage");
  
  const formData = new FormData(e.target);
  const username = formData.get("username").trim();
  const email = formData.get("email").trim();
  const password = formData.get("password").trim();

  if (!username || !email || !password) {
    registerMsg.innerHTML = "<span style='color:#ff4444'>❌ Sab fields bharo!</span>";
    return;
  }

  registerMsg.innerHTML = "<span style='color:#44ff44'>⏳ Account bana rahe hain...</span>";
  
  const result = await callEdgeFunction({ type: "signup", username, email, password });

  if (result.success) {
    registerMsg.innerHTML = "<span style='color:#44ff44'>🎉 Account ban gaya! Login karo.</span>";
    setTimeout(() => document.querySelector('.tab[data-target="login"]').click(), 1200);
  } else {
    registerMsg.innerHTML = `<span style='color:#ff4444'>❌ ${result.message}</span>`;
  }
});

// Login form handler
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const loginMsg = document.getElementById("loginMessage");
  
  const formData = new FormData(e.target);
  const identifier = formData.get("identifier").trim();
  const password = formData.get("password").trim();

  if (!identifier || !password) {
    loginMsg.innerHTML = "<span style='color:#ff4444'>❌ Sab fields bharo!</span>";
    return;
  }

  loginMsg.innerHTML = "<span style='color:#44ff44'>⏳ Login ho raha hai...</span>";
  
  const result = await callEdgeFunction({ type: "login", identifier, password });

  if (result.success) {
    loginMsg.innerHTML = "<span style='color:#44ff44'>✅ Login successful! Redirecting...</span>";
    setTimeout(() => window.location.href = "https://www.google.com/", 800);
  } else {
    loginMsg.innerHTML = `<span style='color:#ff4444'>❌ ${result.message}</span>`;
  }
});
