// ✅ DOM Elements
const input = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const spinner = document.getElementById("chat-loading");
const chatToggle = document.getElementById("chat-toggle");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");
const sendBtn = document.getElementById("send-btn");

// ✅ Scroll to bottom
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Show Loading Spinner
function showLoading() {
  spinner.style.display = "flex";
  scrollToBottom();
}

// ✅ Hide Loading Spinner
function hideLoading() {
  spinner.style.display = "none";
}

// ✅ Append message to chat box
function appendMessage(content, type = "bot") {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-msg" : "bot-msg";
  msg.innerHTML = content; // ← use innerHTML to render HTML tags properly
  chatBox.insertBefore(msg, spinner);
  scrollToBottom();
}


// ✅ Send Message Function
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // Show user message and clear input
  appendMessage(message, "user");
  input.value = "";

  // Show spinner
  showLoading();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    // Hide spinner
    hideLoading();

    // Show bot reply
    appendMessage(data.reply || "No response.", "bot");

  } catch (error) {
    hideLoading();
    appendMessage("Error: " + error.message, "bot");
  }
}

// ✅ Send on Button Click
sendBtn.addEventListener("click", sendMessage);

// ✅ Send on Enter Key
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ✅ Toggle Chat Widget
chatToggle.addEventListener("click", () => {
  chatWidget.style.display = "flex";
  chatToggle.style.display = "none";
  scrollToBottom();
});

chatClose.addEventListener("click", () => {
  chatWidget.style.display = "none";
  chatToggle.style.display = "block";
});
