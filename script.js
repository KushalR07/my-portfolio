// ── CHAT STATE ──────────────────────────────
let chatOpen = false;
let chatHistory = [];

// ── TOGGLE CHAT ─────────────────────────────
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById("chat-panel").classList.toggle("open", chatOpen);
  const notification = document.querySelector(".chat-notification");
  if (chatOpen && notification) notification.style.display = "none";
  if (chatOpen) {
    setTimeout(() => document.getElementById("chat-input").focus(), 300);
  }
}

// ── SEND MESSAGE ─────────────────────────────
async function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  document.getElementById("chat-suggestions").style.display = "none";
  appendMessage("user", text);
  const typing = appendTyping();

  try {
    const reply = await callClaude(text);
    typing.remove();
    appendMessage("bot", reply);
  } catch (e) {
    console.error("Grok API error:", e.message);
    typing.remove();
    appendMessage(
      "bot",
      "Sorry, I'm having trouble connecting right now. You can reach Kushal directly at kushal.r2912@gmail.com!",
    );
  }
}

function sendSuggestion(btn) {
  document.getElementById("chat-input").value = btn.textContent;
  sendMessage();
}

// ── APPEND MESSAGE ───────────────────────────
function appendMessage(role, text) {
  const msgs = document.getElementById("chat-messages");
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div><div class="msg-time">${now}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function appendTyping() {
  const msgs = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = "msg bot";
  div.innerHTML = `<div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── CALL GROK API ───────────────────────────
// ⚠️  For production: move this to a backend proxy so your API key is never exposed in the browser.
async function callClaude(userMessage) {
  const response = await fetch("/api/chat", {
    // ✅ calls your serverless function
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMessage,
      history: chatHistory,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);

  // Save history for multi-turn memory
  chatHistory.push({ role: "user", content: userMessage });
  chatHistory.push({ role: "assistant", content: data.reply });
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

  return data.reply;
}

// ── SCROLL REVEAL ────────────────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

