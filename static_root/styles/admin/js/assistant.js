// Ensure the DOM is fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.querySelector('#send-btn');
    const chatInput = document.querySelector('#chat-input');
    const chatContainer = document.querySelector(".chat-container");

    // Function to get the CSRF token from cookies
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

    // Function to display a message in the chat
    function displayMessage(message, sender) {
        const messageClass = sender === 'user' ? 'outgoing' : 'incoming';
        const chatDiv = document.createElement("div");
        chatDiv.className = `chat ${messageClass}`;
        chatDiv.innerHTML = `<p>${message}</p>`;
        chatContainer.appendChild(chatDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;  // Auto-scroll to the latest message
    }

    // Function to send the user's message and get a response
    async function getChatResponse(userText) {
        console.log("Sending text:", userText);
        try {
            const csrfToken = getCsrfToken();  // Ensure this function is working correctly
            console.log("CSRF Token:", csrfToken);
            const response = await fetch('/finance_app/get_openai_response/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({ userText: userText })
            });
            console.log("Response status:", response.status);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
            }
            const data = await response.json();
            console.log("Received data:", data);
            if (data.advice) {
                displayMessage(data.advice, 'assistant');
            } else {
                throw new Error('No advice received from the server');
            }
        } catch (error) {
            console.error("Error fetching the response: ", error);
            displayMessage("Failed to get a response: " + error.message, 'assistant');
        }
    }
    

    // Event listener for the send button
    sendButton.addEventListener('click', async function() {
        let userText = chatInput.value.trim();
        if (userText) {
            displayMessage(userText, 'user');
            chatInput.value = '';
            sendButton.disabled = true;  // Disable the send button temporarily
            await getChatResponse(userText);
            sendButton.disabled = false;  // Re-enable the send button
        }
    });

    // Handle "Enter" key to send a message
    chatInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    console.log("Chat assistant script loaded successfully.");
});
