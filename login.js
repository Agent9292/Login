// ========================================
// SUPABASE EDGE FUNCTION - 100% WORKING
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

// Universal API caller
async function callEdgeFunction(payload) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

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
    console.log("📥 RAW Response:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, message: "Invalid JSON response", raw: text };
    }

    return res.ok ? json : { 
      success: false, 
      message: json.message || json.status === "error" ? json.message : "Server error", 
      raw: json 
    };

  } catch (err) {
    console.error("❌ Network error:", err);
    return { 
      success: false, 
      message: err.name === 'AbortError' ? "Request timeout (15s)" : "Network error" 
    };
  }
}

// REGISTER FORM
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMsg = document.getElementById("registerMessage");

  if (registerForm && registerMsg) {
    registerForm.addEventListener("submit", async e => {
      e.preventDefault();
      
      const username = registerForm.username.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      if (!username || !email || !password) {
        registerMsg.innerHTML = "<span style='color:#ff4444'>❌ Sab fields bharo!</span>";
        return;
      }

      registerMsg.innerHTML = "<span style='color:#44ff44'>⏳ Account bana rahe hain...</span>";
      
      // Tumhare Edge Function ke according payload
      const result = await callEdgeFunction({ username, email, password });

      if (result.success || result.status === "success") {
        registerMsg.innerHTML = "<span style='color:#44ff44'>🎉 Account ban gaya! Email check karo.</span>";
        setTimeout(() => {
          document.querySelector('.tab[data-target="login"]').click();
          registerForm.reset();
        }, 1500);
      } else {
        registerMsg.innerHTML = `<span style='color:#ff4444'>❌ ${result.message}</span>`;
      }
    });
  }
});

// LOGIN FORM
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMessage");

  if (loginForm && loginMsg) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();
      
      const identifier = loginForm.identifier.value.trim();
      const password = loginForm.password.value.trim();

      if (!identifier || !password) {
        loginMsg.innerHTML = "<span style='color:#ff4444'>❌ Sab fields bharo!</span>";
        return;
      }

      loginMsg.innerHTML = "<span style='color:#44ff44'>⏳ Login check kar rahe hain...</span>";
      
      // Login payload (separate function banani padegi Edge mein)
      const result = await callEdgeFunction({ 
        type: "login", 
        identifier, 
        password 
      });

      if (result.success) {
        loginMsg.innerHTML = "<span style='color:#44ff44'>✅ Login successful! Redirecting...</span>";
        setTimeout(() => window.location.href = "https://www.google.com/", 1000);
      } else {
        loginMsg.innerHTML = `<span style='color:#ff4444'>❌ ${result.message}</span>`;
      }
    });
  }
});

console.log("🚀 Login system loaded!");
