// ========================================
// SUPABASE EDGE FUNCTION – FRONTEND (FIXED)
// ========================================

const EDGE_URL =
  "https://vbcwluybotksaimqfodf.supabase.co/functions/v1/Logics-Logins";

// --------------------
// TAB SWITCHING
// --------------------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.remove("active")
    );
    document.querySelectorAll(".panel").forEach((p) =>
      p.classList.remove("active")
    );
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

// --------------------
// EDGE FUNCTION CALLER
// --------------------
async function callEdgeFunction(payload) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(EDGE_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    clearTimeout(timeout);

    const text = await res.text();
    console.log("📥 RAW Response:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        message: "Invalid server response",
      };
    }

    return res.ok
      ? json
      : {
          success: false,
          message: json.message || "Server error",
        };
  } catch (err) {
    console.error("❌ Network error:", err);
    return {
      success: false,
      message:
        err.name === "AbortError"
          ? "Request timeout (15s)"
          : "Network error",
    };
  }
}

// --------------------
// REGISTER
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMsg = document.getElementById("registerMessage");

  if (!registerForm || !registerMsg) return;

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = registerForm.username.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value.trim();

    if (!username || !email || !password) {
      registerMsg.innerHTML =
        "<span style='color:#ff4444'>❌ All fields are required</span>";
      return;
    }

    registerMsg.innerHTML =
      "<span style='color:#44ff44'>⏳ Creating account...</span>";

    const result = await callEdgeFunction({
      username,
      email,
      password,
    });

    if (result.success) {
      registerMsg.innerHTML =
        "<span style='color:#44ff44'>✅ Account created. Please verify your email.</span>";
      setTimeout(() => {
        document.querySelector('.tab[data-target=\"login\"]').click();
        registerForm.reset();
      }, 1500);
    } else {
      registerMsg.innerHTML = `<span style='color:#ff4444'>❌ ${result.message}</span>`;
    }
  });
});

// --------------------
// LOGIN
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMessage");

  if (!loginForm || !loginMsg) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = loginForm.identifier.value.trim();
    const password = loginForm.password.value.trim();

    if (!identifier || !password) {
      loginMsg.innerHTML =
        "<span style='color:#ff4444'>❌ All fields are required</span>";
      return;
    }

    loginMsg.innerHTML =
      "<span style='color:#44ff44'>⏳ Checking credentials...</span>";

    const result = await callEdgeFunction({
      type: "login",
      identifier,
      password,
    });

    if (result.success) {
      loginMsg.innerHTML =
        "<span style='color:#44ff44'>✅ Login successful</span>";
      setTimeout(() => {
        window.location.href = "https://www.google.com/";
      }, 1000);
    } else {
      loginMsg.innerHTML = `<span style='color:#ff4444'>❌ ${result.message}</span>`;
    }
  });
});

console.log("🚀 Login system loaded");
