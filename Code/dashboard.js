// Dashboard functionality for Serenio app

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        
        return;
    }
    
    // Set personalized greeting
    setPersonalizedGreeting();
});

function setPersonalizedGreeting() {
    const userType = localStorage.getItem('userType');
    const collegeId = localStorage.getItem('collegeId');
    const greetingElement = document.getElementById('userGreeting');
    
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    
    if (hour < 12) {
        timeGreeting = 'Good morning';
    } else if (hour < 17) {
        timeGreeting = 'Good afternoon';
    } else {
        timeGreeting = 'Good evening';
    }
    
    if (userType === 'college' && collegeId) {
        greetingElement.textContent = `${timeGreeting}, ${collegeId}! How are you feeling today?`;
    } else {
        greetingElement.textContent = `${timeGreeting}! How are you feeling today?`;
    }
}

function showUserMenu() {
    const modal = document.getElementById('userMenuModal');
    modal.classList.remove('hidden');
}

function hideUserMenu() {
    const modal = document.getElementById('userMenuModal');
    modal.classList.add('hidden');
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('collegeId');
    window.location.href = 'index.html';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('userMenuModal');
    if (event.target === modal) {
        hideUserMenu();
    }
});

// Navigation function for feature cards
function navigateToFeature(feature) {
    switch(feature) {
        case 'chat':
            window.location.href = 'anonymous-chat.html';
            break;
        case 'emergency':
            window.location.href = 'emergency-help.html';
            break;
        case 'resources':
            window.location.href = 'resources.html';
            break;
        default:
            console.log('Unknown feature:', feature);
    }
}