// ===============================
// Chat Widget Implementation
// ===============================
function initChatWidget() {
    // Ensure elements are properly positioned as fixed
    const chatToggle = document.getElementById("chat-toggle");
    const chatWidget = document.getElementById("chat-widget");
    const toggleContainer = document.querySelector(".toggle-container");
    
    // Force proper positioning for floating elements
    if (chatToggle) {
        chatToggle.style.position = "fixed";
        chatToggle.style.bottom = "20px";
        chatToggle.style.right = "20px";
        chatToggle.style.zIndex = "10001";
        chatToggle.style.pointerEvents = "auto";
    }
    
    if (chatWidget) {
        chatWidget.style.position = "fixed";
        chatWidget.style.bottom = "80px";
        chatWidget.style.right = "20px";
        chatWidget.style.zIndex = "10000";
        chatWidget.style.pointerEvents = "auto";
    }
    
    if (toggleContainer) {
        toggleContainer.style.position = "fixed";
        toggleContainer.style.top = "20px";
        toggleContainer.style.right = "20px";
        toggleContainer.style.zIndex = "10000";
        toggleContainer.style.pointerEvents = "auto";
    }

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
            // Show chat widget with proper positioning
            chatWidget.style.cssText = `
                position: fixed !important;
                bottom: 80px !important;
                right: 20px !important;
                z-index: 10000 !important;
                pointer-events: auto !important;
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important;
            `;
            
            // Hide the toggle button
            newChatToggle.style.display = "none";
            
            // Scroll chat to bottom if there are messages
            if (chatBox) {
                setTimeout(() => {
                    chatBox.scrollTop = chatBox.scrollHeight;
                }, 100);
            }
        });
        
        // Ensure the new toggle is properly positioned
        newChatToggle.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 10001 !important;
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
        `;
    }

    // Clean up and reinitialize chat close
    if (chatClose && chatWidget) {
        const newChatClose = chatClose.cloneNode(true);
        chatClose.parentNode.replaceChild(newChatClose, chatClose);
        newChatClose.addEventListener("click", () => {
            // Hide chat widget
            chatWidget.style.display = "none";
            
            // Show the toggle button again
            const currentToggle = document.getElementById("chat-toggle");
            if (currentToggle) {
                currentToggle.style.cssText = `
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    z-index: 10001 !important;
                    pointer-events: auto !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: block !important;
                `;
            }
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
