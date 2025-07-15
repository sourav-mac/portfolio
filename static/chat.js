// ✅ DOM Elements
const input = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const spinner = document.getElementById("chat-loading");
const chatToggle = document.getElementById("chat-toggle");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");
const sendBtn = document.getElementById("send-btn");

// ✅ Send Message Function
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
  input.value = "";

  // Show spinner
  spinner.style.display = "block";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    // Hide spinner
    spinner.style.display = "none";

    // Show bot response
    chatBox.innerHTML += `<div class="bot-msg">${data.reply || "No response."}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    spinner.style.display = "none";
    chatBox.innerHTML += `<div class="bot-msg">Error: ${error.message}</div>`;
  }
}

// ✅ Send on Button Click
sendBtn.addEventListener("click", sendMessage);

// ✅ Send on Enter Key
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent newline
    sendMessage();
  }
});

// ✅ Toggle Chat UI
chatToggle.addEventListener("click", () => {
  chatWidget.style.display = "flex";
  chatToggle.style.display = "none";
});

chatClose.addEventListener("click", () => {
  chatWidget.style.display = "none";
  chatToggle.style.display = "block";
});
