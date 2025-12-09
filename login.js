// ------------------------------------------
// BACKENDLESS API CONFIG
// ------------------------------------------
const APP_ID = "01934801-7990-4C01-B583-16A556577788";
const API_KEY = "FFF3E121-DFAC-4477-9BAE-8127B787E51B";

const SERVICE_NAME = "Login";
const BASE_URL = `https://api.backendless.com/${APP_ID}/${API_KEY}/services/${SERVICE_NAME}`;


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
// UNIVERSAL FETCH WRAPPER (with full debugging)
// ----------------------------------------------------
async function apiRequest(url, body) {
  console.log("📡 Sending Request:", url);
  console.log("📨 Payload:", body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    console.log("📥 Raw Response:", response);

    const text = await response.text();
    console.log("📥 Raw Body Text:", text);

    let json;

    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      console.error("❌ JSON Parse Error:", parseErr);
      return {
        success: false,
        message: "Server returned invalid JSON format!",
        raw: text
      };
    }

    // If backend gives an error
    if (!response.ok) {
      console.error("❌ HTTP ERROR:", response.status, response.statusText);
      return {
        success: false,
        message: json.message || "Unknown server error",
        httpStatus: response.status,
        raw: json
      };
    }

    console.log("✅ Parsed JSON:", json);
    return json;

  } catch (networkErr) {
    console.error("🌐 Network Error:", networkErr);
    return {
      success: false,
      message: "Network error occurred!",
      raw: networkErr
    };
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

  const result = await apiRequest(`${BASE_URL}/signup`, {
    username, email, password
  });

  if (result.success) {
    registerMsg.innerHTML = "<span style='color:green'>🎉 Account created!</span>";
    console.log("🟢 Signup Success:", result);

    setTimeout(() => {
      document.querySelector('.tab[data-target="login"]').click();
    }, 800);

  } else {
    registerMsg.innerHTML = `<span style='color:red'>❌ ${result.message}</span>`;
    console.error("🔴 Signup Error:", result);
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

  const result = await apiRequest(`${BASE_URL}/login`, {
    identifier, password
  });

  if (result.success) {
    loginMsg.innerHTML = "<span style='color:green'>✅ Login successful!</span>";
    console.log("🟢 Login Success:", result);

    setTimeout(() => {
      window.location.href = "https://www.google.com/";
    }, 600);

  } else {
    loginMsg.innerHTML = `<span style='color:red'>❌ ${result.message}</span>`;
    console.error("🔴 Login Error:", result);
  }
});
