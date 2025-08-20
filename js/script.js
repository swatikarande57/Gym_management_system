// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Modal functionality
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

function showLoginModal() {
    loginModal.style.display = 'block';
    registerModal.style.display = 'none';
}

function showRegisterModal() {
    registerModal.style.display = 'block';
    loginModal.style.display = 'none';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
}

function closeRegisterModal() {
    registerModal.style.display = 'none';
}

function switchToRegister() {
    closeLoginModal();
    showRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    showLoginModal();
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == loginModal) {
        closeLoginModal();
    }
    if (event.target == registerModal) {
        closeRegisterModal();
    }
}

// Initialize localStorage for user data
if (!localStorage.getItem('gymMembers')) {
    localStorage.setItem('gymMembers', JSON.stringify([]));
}

// Registration Form Handler
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const age = document.getElementById('regAge').value;
    const gender = document.getElementById('regGender').value;
    const membership = document.getElementById('regMembership').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Check if email already exists
    const members = JSON.parse(localStorage.getItem('gymMembers'));
    if (members.some(member => member.email === email)) {
        alert('Email already registered!');
        return;
    }

    // Create new member object
    const newMember = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        age: age,
        gender: gender,
        membership: membership,
        password: password,
        joinDate: new Date().toLocaleDateString()
    };

    // Add to localStorage
    members.push(newMember);
    localStorage.setItem('gymMembers', JSON.stringify(members));

    alert('Registration successful! Please login.');
    closeRegisterModal();
    showLoginModal();
    
    // Reset form
    document.getElementById('registerForm').reset();
});

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const members = JSON.parse(localStorage.getItem('gymMembers'));
    const member = members.find(m => m.email === email && m.password === password);

    if (member) {
        alert(`Welcome back, ${member.name}!`);
        localStorage.setItem('currentUser', JSON.stringify(member));
        closeLoginModal();
        updateUIForLoggedInUser(member);
    } else {
        alert('Invalid email or password!');
    }
});

// Update UI when user is logged in
function updateUIForLoggedInUser(member) {
    // Hide login/register buttons
    document.querySelector('.btn-login').style.display = 'none';
    document.querySelector('.btn-register').style.display = 'none';
    
    // Add welcome message and logout button
    const navMenu = document.querySelector('.nav-menu');
    const welcomeItem = document.createElement('li');
    welcomeItem.className = 'nav-item';
    welcomeItem.innerHTML = `<span style="color: #ff6b35;">Welcome, ${member.name}!</span>`;
    
    const logoutItem = document.createElement('li');
    logoutItem.className = 'nav-item';
    logoutItem.innerHTML = '<button class="btn-login" onclick="logout()">Logout</button>';
    
    navMenu.appendChild(welcomeItem);
    navMenu.appendChild(logoutItem);
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Check if user is already logged in
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
};

// Membership plan selection
function selectPlan(planType) {
    showRegisterModal();
    document.getElementById('regMembership').value = planType;
}

// Contact form handler
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});
