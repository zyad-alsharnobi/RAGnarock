document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const queryInput = document.getElementById('query-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results-container');
    const answerContent = document.getElementById('answer-content');
    const contextContent = document.getElementById('context-content');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const lightningEffect = document.getElementById('lightning-effect');

    // Thor-inspired lightning effect
    function triggerLightningEffect() {
        lightningEffect.style.opacity = '0.8';
        setTimeout(() => {
            lightningEffect.style.opacity = '0';
        }, 300);
    }

    // Handle form submission
    function handleSubmit() {
        const query = queryInput.value.trim();
        
        if (!query) {
            showError('The mighty Thor demands a question!');
            return;
        }
        
        // Thor's hammer effect
        triggerLightningEffect();
        
        // Clear previous results
        answerContent.innerHTML = '';
        contextContent.innerHTML = '';
        resultsContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Show loading indicator
        loadingElement.classList.remove('hidden');
        
        // Send request to API
        fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Heimdall cannot reach the API');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            loadingElement.classList.add('hidden');
            
            // Thor's hammer effect for results
            setTimeout(() => {
                triggerLightningEffect();
            }, 100);
            
            // Show results
            if (data.error) {
                showError(data.error);
            } else {
                displayResults(data);
            }
        })
        .catch(error => {
            loadingElement.classList.add('hidden');
            showError('By Odin\'s beard! An error occurred: ' + error.message);
        });
    }

    // Display the query results
    function displayResults(data) {
        // Format and display the answer
        answerContent.innerHTML = formatText(data.answer);
        
        // Format and display the context
        contextContent.innerHTML = '';
        if (data.context && data.context.length > 0) {
            data.context.forEach((contextItem, index) => {
                const contextElement = document.createElement('div');
                contextElement.className = 'context-item';
                contextElement.innerHTML = `<strong>Scroll ${index + 1}:</strong><br>${formatText(contextItem)}`;
                contextContent.appendChild(contextElement);
            });
        } else {
            contextContent.innerHTML = '<p>No sacred texts found</p>';
        }
        
        // Show the results container with a dramatic effect
        resultsContainer.style.opacity = '0';
        resultsContainer.classList.remove('hidden');
        setTimeout(() => {
            resultsContainer.style.opacity = '1';
            resultsContainer.style.transition = 'opacity 0.5s ease';
        }, 50);
    }
    
    // Format text with line breaks
    function formatText(text) {
        return text.replace(/\n/g, '<br>');
    }
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // Shake effect for errors
        errorMessage.classList.add('shake');
        setTimeout(() => {
            errorMessage.classList.remove('shake');
        }, 500);
    }
    
    // Add shake effect CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    submitBtn.addEventListener('click', handleSubmit);
    
    queryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Focus on the input field when the page loads
    queryInput.focus();
    
    // Add some "thunder" to the title on page load
    setTimeout(() => {
        triggerLightningEffect();
    }, 500);
});
