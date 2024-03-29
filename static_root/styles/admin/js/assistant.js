console.log(document.getElementById('#send-btn'));
const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector(".chat-container");
const financialForm = document.getElementById('financialForm');

let userText = null;
const API_KEY = "'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'"

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-btn');
    if (sendButton) {
        sendButton.addEventListener('click', handleOutgoingChat);
    }
});

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; 
}

const getChatResponse = async (userText) => {
    const API_URL = "https://api.openai.com/v1/engines/davinci/completions";
    const pElement = document.createElement("p");

    // Example prompt setting a specific identity or role
    const prompt = `You are a financial advisor for my finance management website named Piggybnk. You give advice to users that have questions about their purchases and you should have access to any of their data uploaded on the finances section of the site.\n\nUser: ${userText}\nFinancial Advisor:`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Ensure secure handling of the API key
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        pElement.textContent = response.choices[0].text.trim();
        return data.choices[0].text.trim(); // Extracting and trimming the text response
    } catch (error) {
        console.error("Error fetching the OpenAI response: ", error);
    }
    userText.querySelector("typing-animation").remove();
    userText.querySelector("chat-details").appendChild(pElement);
};


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
    const incomingChatDiv = createElement(html, "incomoing");
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); //gets the input from the chat and removes any extra spaces
    console.log(userText);
    const html = `
        <div class="chat-content">
            <div class="chat-details">
                <i class='bx bxs-user'></i>
                <p>${userText}</p>
            </div>
        </div>`;
    // creates an outgoing chat with the users message and prints it in a chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    
    setTimeout(showTypingAnimation, 500);
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
