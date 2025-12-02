// app.js - Complete Backendless Auth + CSS Enhanced
const APP_ID = "312D4559-96D4-4627-9AAE-88BFDC7ED1CC";
const API_KEY = "CDF8B2F0-2693-428B-A125-50CA7F5B7662";

// Backendless initialize
Backendless.initApp(APP_ID, API_KEY);

// DOM ready check
document.addEventListener('DOMContentLoaded', function() {
    
    // Tab switching with smooth animation
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.target;
            
            // Remove active classes
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
            
            // Smooth slide effect
            document.querySelectorAll('.panel').forEach(p => {
                p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
        });
    });

    // Enhanced Login Handler
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn');
        const email = this.email.value.trim();
        const password = this.password.value;
        
        // Loading state
        submitBtn.textContent = 'Checking...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        try {
            const user = await Backendless.UserService.login(email, password, true);
            console.log('✅ Login success:', user);
            alert('Login ho gaya bhai! Google pe ja raha hun...');
            window.location.href = 'https://google.com';
        } catch (error) {
            console.error('❌ Login failed:', error);
            let msg = 'Login nahi hua! ';
            if (error.code === 3032) msg += 'Email ya password galat hai';
            else if (error.code === 3100) msg += 'Account locked hai';
            else msg += 'Kuch gadbad hai bhai';
            alert(msg);
        } finally {
            // Reset button
            submitBtn.textContent = 'Sign in';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });

    // Enhanced Register Handler
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn');
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const password = this.password.value;
        
        // Validation
        if (!name || !email || !password || password.length < 6) {
            alert('Name, email bharo aur password 6+ characters ka karo!');
            return;
        }
        
        // Loading state
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        try {
            const user = new Backendless.User();
            user.email = email;
            user.password = password;
            user.name = name;
            
            const registeredUser = await Backendless.UserService.register(user);
            console.log('✅ Account ban gaya:', registeredUser);
            alert('🎉 Account ban gaya! Ab login karo.');
            
            // Auto switch to login + clear form
            document.querySelector('.tab[data-target="login"]').click();
            this.reset();
            
        } catch (error) {
            console.error('❌ Register failed:', error);
            let msg = 'Account nahi bana! ';
            if (error.code === 3033) msg += 'Ye email pehle se hai';
            else if (error.code === 3105) msg += 'Password weak hai';
            else msg += error.message || 'Try again';
            alert(msg);
        } finally {
            submitBtn.textContent = 'Create account';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });

    // Real-time input validation + styling
    function enhanceInputs() {
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('input', function() {
                const field = this.closest('.field');
                if (this.value.trim()) {
                    field.classList.add('valid');
                    this.style.borderColor = 'rgba(111,43,217,0.45)';
                } else {
                    field.classList.remove('valid');
                    this.style.borderColor = 'rgba(255,255,255,0.02)';
                }
            });
            
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = '';
            });
        });
    }
    
    enhanceInputs();
    
    // Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.closest('.form')) {
            const activeForm = document.querySelector('.panel.active .form');
            if (activeForm) activeForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Forgot password placeholder
    document.querySelector('.link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Backendless mein forgot password setup karna padega dashboard se!');
    });
});
