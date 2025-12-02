// ==========================================
// 🔧 Backendless Config
// ==========================================
const APP_ID = "312D4559-96D4-4627-9AAE-88BFDC7ED1CC";
const API_KEY = "CDF8B2F0-2693-428B-A125-50CA7F5B7662";

Backendless.initApp(APP_ID, API_KEY);


// ==========================================
// 👤 Create New Account (Sign Up)
// ==========================================
async function createAccount(email, password, username) {
  try {
    const user = new Backendless.User();
    user.email = email;
    user.password = password;
    user.username = username;

    const created = await Backendless.UserService.register(user);
    console.log("User Created:", created);

    return created;
  } catch (e) {
    console.error("Sign-Up Error:", e.message);
    return { error: e.message };
  }
}


// ==========================================
// 🔐 Login User (Sign In)
// ==========================================
async function loginUser(email, password) {
  try {
    const loggedIn = await Backendless.UserService.login(email, password, true);

    console.log("User Logged In:", loggedIn);
    return loggedIn;

  } catch (e) {
    console.error("Login Error:", e.message);
    return { error: e.message };
  }
}


// ==========================================
// 🚪 Logout User
// ==========================================
async function logoutUser() {
  try {
    await Backendless.UserService.logout();
    console.log("User Logged Out");
  } catch (e) {
    console.error("Logout Error:", e.message);
  }
}
