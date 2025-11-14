//remium scroll function
function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

// Auto-hide FAB when at bottom
function updateFabVisibility() {
    const messagesContainer = document.getElementById('messages');
    const fab = document.querySelector('.fab');
    const isAtBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight <= messagesContainer.scrollTop + 1;
    
    if (isAtBottom) {
        fab.style.opacity = '0.3';
        fab.style.transform = 'scale(0.8)';
    } else {
        fab.style.opacity = '1';
        fab.style.transform = 'scale(1)';
    }
}

// Initialize page animations
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll listener for FAB
    const messagesContainer = document.getElementById('messages');
    messagesContainer.addEventListener('scroll', updateFabVisibility);
    
    // Initial FAB state
    updateFabVisibility();
    
    // Add premium loading animation
    document.body.style.animation = 'pageLoad 1s ease-out';
    
    // Initialize welcome message typing effect
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.style.width = '0';
        setTimeout(() => {
            welcomeText.style.width = '100%';
        }, 1000);
    }
});

class ChatBot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.conversationContext = []; // Track conversation for better context
        
        this.initializeEventListeners();
        this.displayWelcomeTime();
        this.initializeEnhancements();
    }
    
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input focus effects
        this.messageInput.addEventListener('focus', () => {
            this.messageInput.parentElement.style.transform = 'scale(1.02)';
        });
        
        this.messageInput.addEventListener('blur', () => {
            this.messageInput.parentElement.style.transform = 'scale(1)';
        });
        
        // Auto-resize input
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }
    
    initializeEnhancements() {
        // Add focus to input on page load
        setTimeout(() => {
            this.messageInput.focus();
        }, 500);
        
        // Add welcome animation
        const welcomeMessage = document.querySelector('.bot-message');
        if (welcomeMessage) {
            setTimeout(() => {
                welcomeMessage.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    welcomeMessage.style.transform = 'scale(1)';
                }, 200);
            }, 1000);
        }
        
        // Initialize quick action buttons
        this.initializeQuickActions();
    }
    
    initializeQuickActions() {
        const quickButtons = document.querySelectorAll('.quick-btn');
        const quickActions = document.getElementById('quickActions');
        
        quickButtons.forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                this.messageInput.value = message;
                
                // Hide quick actions after first use
                if (quickActions) {
                    quickActions.classList.add('hidden');
                }
                
                // Send the message
                this.sendMessage();
            });
        });
    }
    
    displayWelcomeTime() {
        const welcomeTimeElement = document.getElementById('welcomeTime');
        if (welcomeTimeElement) {
            welcomeTimeElement.textContent = this.formatTime(new Date());
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;
        
        // Disable input while processing
        this.setInputState(false);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send message to backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            if (data.status === 'success') {
                // Add bot response to chat
                this.addMessage(data.response, 'bot');
                
                // Play notification sound for new message
                this.playNotificationSound();
            } else {
                // Add error message
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot', true);
                console.error('Chat error:', data.error);
            }
            
        } catch (error) {
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage('Sorry, I\'m having trouble connecting. Please check your internet connection and try again.', 'bot', true);
            console.error('Network error:', error);
        }
        
        // Re-enable input
        this.setInputState(true);
        
        // Focus back to input
        this.messageInput.focus();
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (sender === 'bot') {
            avatarDiv.innerHTML = '<i class="fas fa-graduation-cap"></i>';
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-user-tie"></i>';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const messageP = document.createElement('p');
        
        // Add emojis for better visual appeal
        if (sender === 'bot' && !isError) {
            content = this.addEmojisToResponse(content);
        }
        
        // Convert newlines to HTML line breaks for proper formatting
        const formattedContent = content.replace(/\n/g, '<br>');
        messageP.innerHTML = formattedContent;
        
        if (isError) {
            messageP.className = 'error-message';
        }
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(new Date());
        
        contentDiv.appendChild(messageP);
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        // Add message with animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(30px)';
        this.chatMessages.appendChild(messageDiv);
        
        // Trigger animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add subtle shake to avatar for bot messages
        if (sender === 'bot') {
            setTimeout(() => {
                avatarDiv.style.animation = 'robotPulse 0.6s ease-in-out';
            }, 300);
        }
    }
    
    addEmojisToResponse(content) {
        // Add contextual emojis for institutional topics
        const institutionalMappings = [
            { keywords: ['admission', 'apply', 'application'], emoji: '📝' },
            { keywords: ['university', 'college', 'school'], emoji: '🎓' },
            { keywords: ['hospital', 'healthcare', 'medical'], emoji: '🏥' },
            { keywords: ['government', 'agency', 'federal'], emoji: '🏛️' },
            { keywords: ['corporate', 'company', 'business'], emoji: '🏢' },
            { keywords: ['nonprofit', 'charity', 'foundation'], emoji: '🤝' },
            { keywords: ['research', 'study', 'academic'], emoji: '�' },
            { keywords: ['policy', 'regulation', 'compliance'], emoji: '📋' },
            { keywords: ['scholarship', 'financial aid', 'funding'], emoji: '�' },
            { keywords: ['degree', 'graduation', 'diploma'], emoji: '🎓' },
            { keywords: ['internship', 'career', 'job'], emoji: '💼' },
            { keywords: ['library', 'resources', 'database'], emoji: '📚' },
            { keywords: ['department', 'faculty', 'staff'], emoji: '👥' },
            { keywords: ['requirements', 'criteria', 'eligibility'], emoji: '✅' },
            { keywords: ['deadline', 'timeline', 'schedule'], emoji: '⏰' },
            { keywords: ['help', 'assistance', 'guidance'], emoji: '🎯' }
        ];
        
        for (const mapping of institutionalMappings) {
            for (const keyword of mapping.keywords) {
                if (content.toLowerCase().includes(keyword)) {
                    return content + ' ' + mapping.emoji;
                }
            }
        }
        
        return content;
    }
    
    showTypingIndicator() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.classList.remove('show');
    }
    
    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
        }
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    playNotificationSound() {
        // Create a subtle notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Audio notification not supported');
        }
    }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// Handle page visibility changes (optional enhancement)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, focus on input
        const messageInput = document.getElementById('messageInput');
        if (messageInput && !messageInput.disabled) {
            messageInput.focus();
        }
    }
});
/* --- revealOnScroll --- */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('seen');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.2});

document.querySelectorAll('.fade-in,.slide-up').forEach(el=>observer.observe(el));

