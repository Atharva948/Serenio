// Mood Check functionality for Serenio app

let moodData = {
    overall: 0,
    energy: 5,
    stress: 0,
    sleep: 5,
    social: 0
};

let breathingTimer = null;
let breathingInterval = null;
let breathingTimeLeft = 300; // 5 minutes in seconds
let breathingPhase = 'inhale'; // 'inhale' or 'exhale'

function selectEmoji(element, category) {
    // Remove selected class from all emojis in this category
    const categoryQuestions = element.parentElement.querySelectorAll('.emoji-option');
    categoryQuestions.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked emoji
    element.classList.add('selected');
    
    // Store the value
    moodData[category] = parseInt(element.dataset.value);
    
    // Check if all questions are answered
    checkAllAnswered();
}

function updateSliderValue(category, value) {
    document.getElementById(category + 'Value').textContent = value;
    moodData[category] = parseInt(value);
    
    // Check if all questions are answered
    checkAllAnswered();
}

function checkAllAnswered() {
    const submitBtn = document.getElementById('submitMoodCheck');
    const allAnswered = moodData.overall > 0 && moodData.stress > 0 && moodData.social > 0;
    
    if (allAnswered) {
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
    } else {
        submitBtn.style.opacity = '0.5';
        submitBtn.style.pointerEvents = 'none';
    }
}

function calculateMoodResult() {
    // Check if all emoji questions are answered
    if (moodData.overall === 0 || moodData.stress === 0 || moodData.social === 0) {
        alert('Please answer all questions before seeing your results.');
        return;
    }
    
    // Calculate overall mood score
    const moodScore = (moodData.overall + moodData.social + (6 - moodData.stress) + 
                      (moodData.energy / 2) + (moodData.sleep / 2)) / 5;
    
    let moodLevel, emoji, description, suggestion;
    
    if (moodScore <= 2) {
        moodLevel = 'Struggling';
        emoji = '😔';
        description = 'It seems like you\'re having a tough day. Remember, it\'s okay to not be okay.';
        suggestion = 'Consider reaching out to a counselor or try some grounding exercises';
    } else if (moodScore <= 3) {
        moodLevel = 'Low';
        emoji = '😐';
        description = 'You might be feeling a bit down today. Small steps can make a big difference.';
        suggestion = 'Try a short meditation or connect with friends';
    } else if (moodScore <= 4) {
        moodLevel = 'Good';
        emoji = '😊';
        description = 'You\'re doing well today! Keep maintaining this positive energy.';
        suggestion = 'Try a 5-minute breathing exercise to maintain your well-being';
    } else {
        moodLevel = 'Great';
        emoji = '😁';
        description = 'You\'re feeling fantastic today! This is wonderful to see.';
        suggestion = 'Share your positive energy with others or try a gratitude exercise';
    }
    
    // Update results display
    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = `Your Mood Today: ${moodLevel}`;
    document.getElementById('resultDescription').textContent = description;
    document.getElementById('suggestionText').textContent = suggestion;
    
    // Hide questions, show results
    document.getElementById('moodQuestions').classList.add('hidden');
    document.getElementById('moodResults').classList.remove('hidden');
    
    // Save mood data to localStorage
    saveMoodData(moodLevel, moodScore);
}

function saveMoodData(moodLevel, score) {
    const today = new Date().toISOString().split('T')[0];
    let moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    
    // Add today's mood (remove existing entry for today if present)
    moodHistory = moodHistory.filter(entry => entry.date !== today);
    moodHistory.push({
        date: today,
        level: moodLevel,
        score: score,
        details: {...moodData}
    });
    
    // Keep only last 30 entries
    if (moodHistory.length > 30) {
        moodHistory = moodHistory.slice(-30);
    }
    
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
}

function retakeMoodCheck() {
    // Reset mood data
    moodData = {
        overall: 0,
        energy: 5,
        stress: 0,
        sleep: 5,
        social: 0
    };
    
    // Reset UI
    document.querySelectorAll('.emoji-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('energySlider').value = 5;
    document.getElementById('energyValue').textContent = '5';
    document.getElementById('sleepSlider').value = 5;
    document.getElementById('sleepValue').textContent = '5';
    
    // Show questions, hide results
    document.getElementById('moodResults').classList.add('hidden');
    document.getElementById('moodQuestions').classList.remove('hidden');
    
    // Disable submit button
    checkAllAnswered();
}

// Breathing Exercise Functions
function startBreathingExercise() {
    document.getElementById('breathingModal').classList.remove('hidden');
    breathingTimeLeft = 300; // Reset to 5 minutes
    updateBreathingTimer();
}

function stopBreathingExercise() {
    stopBreathing();
    document.getElementById('breathingModal').classList.add('hidden');
}

function startBreathing() {
    document.getElementById('breathingStartBtn').classList.add('hidden');
    document.getElementById('breathingStopBtn').classList.remove('hidden');
    
    breathingPhase = 'inhale';
    animateBreathing();
    
    breathingTimer = setInterval(() => {
        breathingTimeLeft--;
        updateBreathingTimer();
        
        if (breathingTimeLeft <= 0) {
            stopBreathing();
            alert('Great job! You completed the 5-minute breathing exercise.');
        }
    }, 1000);
    
    breathingInterval = setInterval(() => {
        breathingPhase = breathingPhase === 'inhale' ? 'exhale' : 'inhale';
        animateBreathing();
    }, 4000); // 4 seconds per phase
}

function stopBreathing() {
    if (breathingTimer) {
        clearInterval(breathingTimer);
        breathingTimer = null;
    }
    
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    
    document.getElementById('breathingStartBtn').classList.remove('hidden');
    document.getElementById('breathingStopBtn').classList.add('hidden');
    document.getElementById('breathingText').textContent = 'Get Ready';
    document.getElementById('breathingCircle').style.transform = 'scale(1)';
}

function animateBreathing() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    
    if (breathingPhase === 'inhale') {
        text.textContent = 'Breathe In';
        circle.style.transform = 'scale(1.3)';
        circle.style.transition = 'transform 4s ease-in-out';
    } else {
        text.textContent = 'Breathe Out';
        circle.style.transform = 'scale(1)';
        circle.style.transition = 'transform 4s ease-in-out';
    }
}

function updateBreathingTimer() {
    const minutes = Math.floor(breathingTimeLeft / 60);
    const seconds = breathingTimeLeft % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('breathingTimer').textContent = display;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAllAnswered();
});