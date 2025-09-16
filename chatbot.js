// Chatbot functionality for Serenio app

let chatHistory = [];
let currentExercise = null;

// Predefined responses for the chatbot
const botResponses = {
    anxiety: [
        "I understand you're feeling anxious. Here are some techniques that might help:",
        "• Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste",
        "• Take slow, deep breaths - in for 4 counts, hold for 4, out for 4",
        "• Remember: This feeling is temporary and will pass ✨",
        "Would you like me to guide you through a breathing exercise?"
    ],
    
    relaxation: [
        "Here's a quick relaxation tip for you! 🌸",
        "• Progressive muscle relaxation: Tense and then relax each muscle group, starting from your toes and working up to your head",
        "• Try the 'body scan' technique: Mentally scan your body from head to toe, noticing areas of tension",
        "• Listen to calming nature sounds or gentle music",
        "• Practice gentle stretching or yoga poses",
        "Would you like me to start a guided relaxation exercise?"
    ],
    
    sleep: [
        "Having trouble sleeping? Here are some helpful tips: 😴",
        "• Create a bedtime routine: Same time each night, no screens 1 hour before bed",
        "• Try the '4-7-8' breathing technique: Breathe in for 4, hold for 7, exhale for 8",
        "• Keep your room cool, dark, and quiet",
        "• If you can't sleep after 20 minutes, get up and do a quiet activity until you feel sleepy",
        "• Avoid caffeine after 2 PM",
        "Would you like a guided sleep meditation?"
    ],
    
    motivation: [
        "Here's some motivation to brighten your day! 💪✨",
        "• Remember: Progress, not perfection. Every small step counts!",
        "• You've overcome challenges before, and you can do it again",
        "• It's okay to have difficult days - they help you appreciate the good ones",
        "• Your feelings are valid, and seeking help shows strength, not weakness",
        "• You are worthy of love, care, and happiness",
        "What's one small thing you can do today to take care of yourself?"
    ],
    
    counselor: [
        "I'd be happy to help you connect with a professional counselor! 👨‍⚕️",
        "Professional support can be really helpful for:",
        "• Working through persistent anxiety or depression",
        "• Developing coping strategies for stress",
        "• Processing difficult experiences or emotions",
        "• Building better relationships and communication skills",
        "Would you like me to show you available counselors, or would you prefer to explore our anonymous chat first?"
    ],
    
    default: [
        "Thank you for sharing that with me. I'm here to help! 💙",
        "Here are some things I can help you with:",
        "• Anxiety and stress management techniques",
        "• Sleep and relaxation tips",
        "• Motivational support and encouragement",
        "• Connecting you with professional counselors",
        "• Guided breathing and meditation exercises",
        "What would be most helpful for you right now?"
    ]
};

// Exercise templates
const exercises = {
    breathing: {
        title: "4-4-4 Breathing Exercise",
        content: `
            <div class="breathing-circle" id="exerciseBreathingCircle">
                <div class="breathing-text" id="exerciseBreathingText">Get Ready</div>
            </div>
            <p>This exercise helps calm your nervous system and reduce anxiety.</p>
            <p><strong>Instructions:</strong></p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>Breathe in slowly for 4 counts</li>
                <li>Hold your breath for 4 counts</li>
                <li>Exhale slowly for 4 counts</li>
                <li>Repeat for 2 minutes</li>
            </ul>
        `,
        duration: 120000 // 2 minutes
    },
    
    grounding: {
        title: "5-4-3-2-1 Grounding Exercise",
        content: `
            <div style="font-size: 3rem; margin: 1rem 0;">🌍</div>
            <p>This technique helps you stay present and calm your mind.</p>
            <div style="text-align: left; margin: 1rem 0;">
                <p><strong>Name:</strong></p>
                <ul>
                    <li><strong>5</strong> things you can <strong>see</strong></li>
                    <li><strong>4</strong> things you can <strong>touch</strong></li>
                    <li><strong>3</strong> things you can <strong>hear</strong></li>
                    <li><strong>2</strong> things you can <strong>smell</strong></li>
                    <li><strong>1</strong> thing you can <strong>taste</strong></li>
                </ul>
            </div>
            <p>Take your time with each step. There's no rush.</p>
        `,
        duration: 300000 // 5 minutes
    },
    
    sleep: {
        title: "Sleep Relaxation Exercise",
        content: `
            <div style="font-size: 3rem; margin: 1rem 0;">😴</div>
            <p>This progressive relaxation will help prepare your body for sleep.</p>
            <div style="text-align: left; margin: 1rem 0;">
                <p><strong>Instructions:</strong></p>
                <ol>
                    <li>Lie down comfortably</li>
                    <li>Start with your toes - tense for 5 seconds, then relax</li>
                    <li>Move up to your calves, thighs, abdomen, etc.</li>
                    <li>End with your face and scalp</li>
                    <li>Focus on the feeling of relaxation spreading through your body</li>
                </ol>
            </div>
        `,
        duration: 600000 // 10 minutes
    }
};

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addBotResponse(response);
    }, 500);
}

function sendQuickReply(message) {
    // Hide quick replies temporarily
    document.getElementById('quickReplies').style.display = 'none';
    
    // Add user message
    addMessage(message, 'user');
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addBotResponse(response);
        
        // Show quick replies again after response
        setTimeout(() => {
            document.getElementById('quickReplies').style.display = 'flex';
        }, 1000);
    }, 500);
}

function addMessage(message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message message-${type}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = message;
    
    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to history
    chatHistory.push({ message, type, timestamp: new Date() });
}

function addBotResponse(responses) {
    const messagesContainer = document.getElementById('chatMessages');
    
    responses.forEach((response, index) => {
        setTimeout(() => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message message-bot';
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            
            // Check if response includes exercise suggestion
            if (response.includes('Would you like me to guide you') || 
                response.includes('Would you like me to start') ||
                response.includes('Would you like a guided')) {
                
                bubbleDiv.innerHTML = response + '<br><br>' +
                    '<button class="btn-primary btn-small mt-1" onclick="showExerciseSuggestions()" style="margin: 0.5rem 0;">' +
                    '<i class="fas fa-play"></i> Start Exercise</button>';
            } 
            else if (response.includes('Would you like me to show you available counselors')) {
                bubbleDiv.innerHTML = response + '<br><br>' +
                    '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">' +
                    '<button class="btn-primary btn-small" onclick="window.location.href=\'counselors.html\'" style="margin: 0;">' +
                    '<i class="fas fa-user-md"></i> View Counselors</button>' +
                    '<button class="btn-secondary btn-small" onclick="window.location.href=\'anonymous-chat.html\'" style="margin: 0;">' +
                    '<i class="fas fa-comments"></i> Anonymous Chat</button></div>';
            } 
            else {
                bubbleDiv.textContent = response;
            }
            
            messageDiv.appendChild(bubbleDiv);
            messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, index * 500); // Stagger responses
    });
    
    // Save to history
    chatHistory.push({ message: responses.join(' '), type: 'bot', timestamp: new Date() });
}

function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
        return botResponses.anxiety;
    }
    else if (lowerMessage.includes('relaxation') || lowerMessage.includes('relax') || lowerMessage.includes('calm')) {
        return botResponses.relaxation;
    }
    else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
        return botResponses.sleep;
    }
    else if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('sad')) {
        return botResponses.motivation;
    }
    else if (lowerMessage.includes('counselor') || lowerMessage.includes('therapist') || lowerMessage.includes('professional')) {
        return botResponses.counselor;
    }
    else {
        return botResponses.default;
    }
}

function showExerciseSuggestions() {
    const response = [
        "Great! I have several exercises that might help:",
        "• Breathing Exercise (2 minutes) - Helps with anxiety and stress",
        "• Grounding Exercise (5 minutes) - Helps you stay present",
        "• Sleep Relaxation (10 minutes) - Helps prepare for sleep",
        "Which one would you like to try?"
    ];
    
    setTimeout(() => {
        addBotResponse(response);
        
        // Add exercise buttons
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message message-bot';
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            bubbleDiv.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="btn-primary btn-small" onclick="startSpecificExercise('breathing')" style="margin: 0;">
                        🫁 Breathing Exercise
                    </button>
                    <button class="btn-primary btn-small" onclick="startSpecificExercise('grounding')" style="margin: 0;">
                        🌍 Grounding Exercise
                    </button>
                    <button class="btn-primary btn-small" onclick="startSpecificExercise('sleep')" style="margin: 0;">
                        😴 Sleep Relaxation
                    </button>
                </div>
            `;
            
            messageDiv.appendChild(bubbleDiv);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }, 500);
}

function startSpecificExercise(exerciseType) {
    currentExercise = exercises[exerciseType];
    document.getElementById('exerciseTitle').textContent = currentExercise.title;
    document.getElementById('exerciseContent').innerHTML = currentExercise.content;
    document.getElementById('exerciseModal').classList.remove('hidden');
}

function startExercise() {
    // This would start the actual exercise (implementation depends on exercise type)
    alert('Exercise started! Follow the instructions on screen.');
}

function closeExerciseModal() {
    document.getElementById('exerciseModal').classList.add('hidden');
    currentExercise = null;
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        document.getElementById('chatMessages').innerHTML = `
            <div class="chat-message message-bot">
                <div class="message-bubble">
                    Hi! I'm CalmBot 🤖 I can suggest exercises, share quick tips, or connect you with a counselor. How can I help you today?
                </div>
            </div>
        `;
        chatHistory = [];
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Auto-focus on input
    document.getElementById('chatInput').focus();
});