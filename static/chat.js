// ===============================
// Chat Widget Implementation
// ===============================
function initChatWidget() {
    const chatToggle = document.getElementById("chat-toggle");
    const chatWidget = document.getElementById("chat-widget");
    const chatClose = document.getElementById("chat-close");
    const chatBox = document.getElementById("chat-box");
    let input = document.getElementById("chat-input"); // Changed to let
    let sendBtn = document.getElementById("send-btn"); // Changed to let
    const spinner = document.getElementById("chat-loading");

    // Clean up and reinitialize chat toggle
    if (chatToggle && chatWidget) {
        const newChatToggle = chatToggle.cloneNode(true);
        chatToggle.parentNode.replaceChild(newChatToggle, chatToggle);
        newChatToggle.addEventListener("click", () => {
            chatWidget.style.display = "flex";
            newChatToggle.style.display = "none";
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        });
    }

    // Clean up and reinitialize chat close
    if (chatClose && chatWidget && chatToggle) {
        const newChatClose = chatClose.cloneNode(true);
        chatClose.parentNode.replaceChild(newChatClose, chatClose);
        newChatClose.addEventListener("click", () => {
            chatWidget.style.display = "none";
            const currentToggle = document.getElementById("chat-toggle");
            if (currentToggle) currentToggle.style.display = "block";
        });
    }

    function appendMessage(content, type = "bot") {
        if (!chatBox || !spinner) return;
        const msg = document.createElement("div");
        msg.className = type === "user" ? "user-msg" : "bot-msg";
        msg.innerHTML = content;
        chatBox.insertBefore(msg, spinner);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const currentInput = document.getElementById("chat-input"); // Get current input
        if (!currentInput?.value.trim()) return;
        const message = currentInput.value.trim();
        
        appendMessage(message, "user");
        currentInput.value = "";
        
        if (spinner) spinner.style.display = "flex";
        
        try {
            const res = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            if (spinner) spinner.style.display = "none";
            appendMessage(data.reply || "No response.", "bot");
        } catch (error) {
            if (spinner) spinner.style.display = "none";
            appendMessage("Error: " + error.message, "bot");
        }
    }

    // Clean up and reinitialize send button
    if (sendBtn) {
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        sendBtn = newSendBtn; // Reassign reference
        newSendBtn.addEventListener("click", sendMessage);
    }

    // Clean up and reinitialize input
    if (input) {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        input = newInput; // Reassign reference
        newInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}
