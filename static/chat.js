async function sendMessage() {
      const input = document.getElementById("chat-input");
      const chatBox = document.getElementById("chat-box");
      const message = input.value.trim();
      if (!message) return;
      chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
      input.value = "";

      try {
        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        const data = await res.json();
        chatBox.innerHTML += `<div class="bot-msg">${data.reply || "Error: No response."}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
      } catch (error) {
        chatBox.innerHTML += `<div class="bot-msg">Error: ${error.message}</div>`;
      }
    }

  document.getElementById("chat-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();  // prevents line break
      sendMessage();       // call your send function
    }
  });

// Toggle Chat UI
document.getElementById("chat-toggle").addEventListener("click", () => {
  document.getElementById("chat-widget").style.display = "flex";
  document.getElementById("chat-toggle").style.display = "none";
});

document.getElementById("chat-close").addEventListener("click", () => {
  document.getElementById("chat-widget").style.display = "none";
  document.getElementById("chat-toggle").style.display = "block";
});

// Send message function
async function sendMessage() {
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div class="bot-msg">${data.reply || "Error: No response."}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    chatBox.innerHTML += `<div class="bot-msg">Error: ${error.message}</div>`;
  }
}

// Send on Enter
document.getElementById("chat-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// Send on Button Click
document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("chat-close").addEventListener("click", () => {
  document.getElementById("chat-widget").style.display = "none"; // Hide
});

// make the chat bold or italic
chatbox.innerHTML+=`<div class="bot-msg">${data.reply || "Error: No response."}</div>`;