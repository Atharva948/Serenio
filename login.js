// Login functionality for Serenio app

function showCollegeLogin() {
    const loginOptions = document.querySelector('.login-options');
    const collegeForm = document.getElementById('collegeLoginForm');
    
    loginOptions.classList.add('hidden');
    collegeForm.classList.remove('hidden');
}

function hideCollegeLogin() {
    const loginOptions = document.querySelector('.login-options');
    const collegeForm = document.getElementById('collegeLoginForm');
    
    loginOptions.classList.remove('hidden');
    collegeForm.classList.add('hidden');
    
    // Clear form
    document.getElementById('collegeId').value = '';
    document.getElementById('password').value = '';
}

function handleCollegeLogin() {
    const collegeId = document.getElementById('collegeId').value;
    const password = document.getElementById('password').value;
    
    if (!collegeId || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    // In a real app, this would validate credentials with a server
    localStorage.setItem('userType', 'college');
    localStorage.setItem('collegeId', collegeId);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Set user type for guest users
function continueAsGuest() {
    localStorage.setItem('userType', 'guest');
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'dashboard.html';
}