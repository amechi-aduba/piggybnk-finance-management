const sendButton = document.querySelector('#send-btn');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector(".chat-container");
const financialForm = document.getElementById('financialForm');

let userText = null;


document.addEventListener('DOMContentLoaded', function () {
    if (sendButton) {
        sendButton.addEventListener('click', handleOutgoingChat);
    }
});

console.log(document.getElementById('send-btn'));


function getCsrfToken() {
    let csrfToken = '';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'csrftoken') {
            csrfToken = value;
            break;
        }
    }
    return csrfToken;
}



const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; 
}

const getChatResponse = async (userText) => {
    try {
        const response = await fetch('/financial-advice/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCsrfToken()
            },
            body: JSON.stringify({ user_question: userText })
        });

        const data = await response.json();
        removeTypingAnimation();  // Remove the typing animation
        console.log("API Response:", data);

        if (data.advice) {
            displayMessage(data.advice, 'assistant');
        } else {
            console.log("No advice key found or no data returned from the API");
            displayMessage("Sorry, I couldn't process that request.", 'assistant');
        }
    } catch (error) {
        console.error("Error fetching the response: ", error);
        displayMessage("An error occurred while fetching the response.", 'assistant');
    }
};

function displayMessage(message, sender) {
    const messageClass = sender === 'user' ? 'outgoing' : 'incoming';
    const iconClass = sender === 'user' ? 'bxs-user' : 'bxs-bot';

    const html = `
        <div class="chat-content">
            <div class="chat-details">
                <i class='bx ${iconClass}'></i>
                <p>${message}</p>
            </div>
        </div>`;
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", messageClass);
    chatDiv.innerHTML = html;
    chatContainer.appendChild(chatDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;  // Auto-scroll to the latest message
    if (sender === 'user') {
        chatInput.value = '';  // Clear the input field after sending
    }
}

const copyResponse = (copy) => {
    const responseTextElement = copy.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copy.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `
        <div class ="chat-content">
            <div class = "chat-details">
                <i class='bx bxs-bot'></i>
                <div class='typing'>
                    <div class='typing-dot' style='-delay: 0.2'></div>
                    <div class='typing-dot' style='-delay: 0.3'></div>
                    <div class='typing-dot' style='-delay: 0.4'></div>
                </div>
            </div>
            <i onclick="copyResponse(this)" class='bx bx-copy-alt'></i>
        </div>`;
        const incomingChatDiv = createElement(html, "incoming");
        chatContainer.appendChild(incomingChatDiv);
}

const removeTypingAnimation = () => {
    const typingAnimation = chatContainer.querySelector(".typing");
    if (typingAnimation) typingAnimation.remove();
};

function handleOutgoingChat() {
    let userText = chatInput.value.trim();  // Trim whitespace from the input
    if (userText) {  // Check if the input is not empty
        displayMessage(userText, 'user');  // Display the user's message
        showTypingAnimation();  // Optional: Show a typing animation
        getChatResponse(userText);  // Send the user's message to the backend
    }
}

console.log(chatInput);
// In your JavaScript

/*
financialForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    // Simulate assistant's response based on financial data
    const response = generateAssistantResponse(amount, category);

    // Display assistant's response
    displayMessage(response, 'assistant');

    // Clear form fields
    financialForm.reset();
});

function generateAssistantResponse(amount, category) {
    // Perform logic to generate response based on financial data
    // This is just a placeholder, you should replace it with your own logic
    let response = `You spent $${amount.toFixed(2)} on ${category}.`;

    // Add more complex logic as needed

    return response;
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatArea.appendChild(messageElement);

    // Scroll to the bottom of the chat area
    chatArea.scrollTop = chatArea.scrollHeight;
}

*/
