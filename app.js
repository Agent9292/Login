// app.js - FIXED VERSION - Sab Kaam Karega!
Backendless.initApp("312D4559-96D4-4627-9AAE-88BFDC7ED1CC", "CDF8B2F0-2693-428B-A125-50CA7F5B7662");

// 🚀 TAB SWITCHING - YE SABSE PEHLE FIX KIA
document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        // Sabko active remove karo
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        
        // Jo click hua usko active banao
        this.classList.add('active');
        document.getElementById(this.dataset.target).classList.add('active');
    });
});

// 🔐 LOGIN FORM - NO AUTO CLEAR
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Page reload band
    
    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    
    Backendless.UserService.login(email, password, true)
        .then(function() {
            window.location.href = 'https://google.com'; // Success = Google
        })
        .catch(function(error) {
            alert('Login nahi hua! Email/password check karo');
            console.log('Error:', error);
        });
});

// 📝 REGISTER FORM - NO AUTO CLEAR + NO SWITCH
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Page reload band
    
    const name = this.querySelector('input[name="name"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    
    // Simple check
    if (!name || !email || !password || password.length < 6) {
        alert('Name, email bharo aur password 6+ characters ka karo!');
        return;
    }
    
    const user = new Backendless.User();
    user.name = name;
    user.email = email;
    user.password = password;
    
    Backendless.UserService.register(user)
        .then(function() {
            alert('Account ban gaya! Ab login karo.');
            // FORM CLEAR NHI KAR RAHE - Jaise mangwaya!
        })
        .catch(function(error) {
            alert('Account nahi bana! Email pehle se hai ya password weak hai.');
            console.log('Error:', error);
        });
});

// Page load hone ka wait
window.addEventListener('load', function() {
    console.log('✅ App loaded - Tabs ready!');
});
