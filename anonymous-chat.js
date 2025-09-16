// Anonymous Chat functionality for Serenio app

let isConnected = false;
let anonymousUsername = '';
let chatMessages = [];
let simulatedUsers = ['User123', 'Helper456', 'Friend789', 'Support012', 'Care345'];
let onlineUsers = 8; // Simulated online user count
let messageCounter = 0;

// Predefined supportive messages for simulation
const simulatedMessages = [
    {
        user: 'Helper456',
        message: 'Remember, you\'re not alone in this journey. We\'re all here to support each other. 💙',
        delay: 15000
    },
    {
        user: 'Support012', 
        message: 'I\'ve been where you are. It gets better with time and the right support. Hang in there!',
        delay: 25000
    },
    {
        user: 'Care345',
        message: 'Taking care of your mental health is so important. Proud of everyone here for reaching out! 🌟',
        delay: 40000
    },
    {
        user: 'Friend789',
        message: 'Some days are harder than others, but every small step forward counts. You\'ve got this!',
        delay: 60000
    }
];

let simulationTimeouts = [];

function joinChat() {
    if (isConnected) return;
    
    // Generate anonymous username
    anonymousUsername = 'User' + Math.floor(Math.random() * 1000);
    
    // Update UI
    isConnected = true;
    document.getElementById('chatStatus').textContent = 'Connected';
    document.getElementById('chatStatus').className = 'status-indicator status-online';
    document.getElementById('joinBtn').classList.add('hidden');
    document.getElementById('leaveBtn').classList.remove('hidden');
    document.getElementById('chatContainer').style.display = 'block';
    document.getElementById('connectionGuide').style.display = 'none';
    
    // Update user count
    onlineUsers += 1;
    updateUserCount();
    
    // Add join message
    addSystemMessage(`${anonymousUsername} joined the chat`);
    
    // Focus on input
    document.getElementById('anonymousChatInput').focus();
    
    // Start simulated activity
    startSimulatedActivity();
}

function leaveChat() {
    if (!isConnected) return;
    
    // Clear any pending simulations
    clearSimulations();
    
    // Add leave message
    addSystemMessage(`${anonymousUsername} left the chat`);
    
    // Update UI
    isConnected = false;
    document.getElementById('chatStatus').textContent = 'Not Connected';
    document.getElementById('chatStatus').className = 'status-indicator status-offline';
    document.getElementById('joinBtn').classList.remove('hidden');
    document.getElementById('leaveBtn').classList.add('hidden');
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('connectionGuide').style.display = 'block';
    
    // Update user count
    onlineUsers -= 1;
    updateUserCount();
    
    // Clear input
    document.getElementById('anonymousChatInput').value = '';
}

function sendAnonymousMessage() {
    if (!isConnected) return;
    
    const input = document.getElementById('anonymousChatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addAnonymousMessage(anonymousUsername, message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate responses to user messages
    if (message.toLowerCase().includes('help') || message.toLowerCase().includes('support')) {
        setTimeout(() => {
            const responses = [
                'We\'re here for you. What\'s going on?',
                'You\'re brave for reaching out. How can we support you?',
                'Sending you virtual hugs. You\'re not alone. 🤗'
            ];
            const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addAnonymousMessage(randomUser, randomResponse, 'other');
        }, 2000 + Math.random() * 3000);
    } else if (message.toLowerCase().includes('thank')) {
        setTimeout(() => {
            const responses = [
                'You\'re so welcome! We\'re all in this together. 💪',
                'That\'s what community is for! Take care of yourself.',
                'Glad we could help. You\'d do the same for us! ❤️'
            ];
            const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addAnonymousMessage(randomUser, randomResponse, 'other');
        }, 1500 + Math.random() * 2000);
    }
}

function addAnonymousMessage(username, message, type) {
    const messagesContainer = document.getElementById('anonymousMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'anonymous-message';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.textContent = username;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${type === 'user' ? 'message-user' : 'message-bot'}`;
    bubbleDiv.textContent = message;
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save message
    chatMessages.push({
        username,
        message,
        type,
        timestamp: new Date()
    });
    
    // Limit message history
    if (chatMessages.length > 100) {
        chatMessages = chatMessages.slice(-100);
        
        // Remove oldest message from DOM
        const firstMessage = messagesContainer.querySelector('.anonymous-message:not(.system-message)');
        if (firstMessage) {
            firstMessage.remove();
        }
    }
}

function addSystemMessage(message) {
    const messagesContainer = document.getElementById('anonymousMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'anonymous-message system-message';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.textContent = 'System';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble message-bot';
    bubbleDiv.style.background = 'rgba(108, 117, 125, 0.1)';
    bubbleDiv.style.color = 'var(--medium-gray)';
    bubbleDiv.style.fontStyle = 'italic';
    bubbleDiv.textContent = message;
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function startSimulatedActivity() {
    // Clear any existing timeouts
    clearSimulations();
    
    // Schedule simulated messages
    simulatedMessages.forEach(simMsg => {
        const timeout = setTimeout(() => {
            if (isConnected) {
                addAnonymousMessage(simMsg.user, simMsg.message, 'other');
            }
        }, simMsg.delay);
        
        simulationTimeouts.push(timeout);
    });
    
    // Add random user activity
    for (let i = 0; i < 5; i++) {
        const timeout = setTimeout(() => {
            if (isConnected && Math.random() > 0.7) {
                simulateUserJoin();
            }
        }, Math.random() * 120000); // Random within 2 minutes
        
        simulationTimeouts.push(timeout);
    }
}

function simulateUserJoin() {
    const newUser = 'User' + Math.floor(Math.random() * 1000);
    addSystemMessage(`${newUser} joined the chat`);
    onlineUsers += 1;
    updateUserCount();
    
    // Simulate them leaving later
    setTimeout(() => {
        if (isConnected) {
            addSystemMessage(`${newUser} left the chat`);
            onlineUsers -= 1;
            updateUserCount();
        }
    }, 30000 + Math.random() * 60000);
}

function clearSimulations() {
    simulationTimeouts.forEach(timeout => clearTimeout(timeout));
    simulationTimeouts = [];
}

function updateUserCount() {
    document.getElementById('userCount').textContent = Math.max(0, onlineUsers);
}

function showChatInfo() {
    document.getElementById('chatInfoModal').classList.remove('hidden');
}

function hideChatInfo() {
    document.getElementById('chatInfoModal').classList.add('hidden');
}

function handleAnonymousKeyPress(event) {
    if (event.key === 'Enter') {
        sendAnonymousMessage();
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateUserCount();
    
    // Add some initial activity to make it feel active
    setTimeout(() => {
        addAnonymousMessage('Helper456', 'Good evening everyone! Hope you\'re all doing well tonight. 🌙', 'other');
    }, 3000);
    
    setTimeout(() => {
        addAnonymousMessage('Support012', 'Thanks Helper456! It\'s nice to see friendly faces here.', 'other');
    }, 8000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    clearSimulations();
});