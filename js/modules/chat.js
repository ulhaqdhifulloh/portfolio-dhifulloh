// js/modules/chat.js

const HARDCODE_CHAT = true;
const API_BASE_URL = "https://portfolio-dhifulloh-backend.onrender.com";
const DAILY_LIMIT = 40;
const PER_MINUTE_LIMIT = 4;

function initChat() {
  const chatFab = document.querySelector("#chat-fab");
  const chatPanel = document.querySelector("#chat-panel");
  const chatForm = document.querySelector("#chat-form");
  const chatText = document.querySelector("#chat-text");
  const chatBody = document.querySelector("#chat-body");
  const openChat = document.querySelector("#open-chat");
  const closeChat = document.querySelector("#close-chat");
  const rateInfo = document.querySelector("#rate-info");

  // Local SV-SE formatted YYYY-MM-DD keys for precise local days limit resets (Bug 3)
  const todayKey = `rl-${new Date().toLocaleDateString('sv-SE')}`;
  const minuteKey = `rlm-${Math.floor(Date.now() / 60000)}`;

  function incr(key) {
    const v = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(v));
    return v;
  }

  function get(key) {
    return Number(localStorage.getItem(key) || "0");
  }

  function setInfo() {
    if (rateInfo) {
      rateInfo.textContent = `Daily: ${get(todayKey)}/${DAILY_LIMIT} · Per-minute: ${get(minuteKey)}/${PER_MINUTE_LIMIT}`;
    }
  }

  // Dynamic inline suggestions injector inside chat flow
  function addSuggestions() {
    const s = window.__PROFILE__?.suggestions || [];
    if (!s.length || !chatBody) return;

    // Remove any previous suggestion bubbles in the chat to keep it clean and active
    const oldSugs = chatBody.querySelectorAll(".msg-suggestions");
    oldSugs.forEach(el => el.remove());

    const container = document.createElement("div");
    container.className = "msg-suggestions";
    container.innerHTML = s.map(x => `<button type="button" data-q="${x}">${x}</button>`).join("");

    container.querySelectorAll("button").forEach(b => {
      b.onclick = () => {
        if (chatText) {
          chatText.value = b.dataset.q;
          if (chatForm) {
            chatForm.requestSubmit();
          }
        }
      };
    });

    chatBody.appendChild(container);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function toggleChat(open) {
    if (chatPanel) {
      chatPanel.classList.toggle("open", open);
      if (open && chatText) chatText.focus();
    }
  }

  function findHardcodedAnswer(question) {
    const q = question.toLowerCase();
    const qa = window.__PROFILE__?.chatQA || [];
    for (const item of qa) {
      const matched = item.keywords.some(kw => q.includes(kw.toLowerCase()));
      if (matched) return item.answer;
    }
    return null;
  }

  function addMsg(text, who = "bot") {
    if (!chatBody) return;
    const el = document.createElement("div");
    el.className = `msg ${who}`;
    el.textContent = text;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showLoading() {
    if (!chatBody) return null;
    const el = document.createElement("div");
    el.className = "msg bot";
    el.id = "chat-loading-" + Date.now();
    el.innerHTML = '<span class="loading"></span> Thinking...';
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
    return el.id;
  }

  function removeLoading(id) {
    if (id) {
      const el = document.querySelector(`#${id}`);
      if (el) el.remove();
    }
  }

  function toast(t) {
    addMsg(t, "bot");
  }

  function sessionId() {
    const k = "sid";
    let v = localStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem(k, v);
    }
    return v;
  }

  // Setup Event Listeners
  if (openChat) openChat.addEventListener("click", () => toggleChat(true));
  if (chatFab) {
    chatFab.addEventListener("click", () => {
      const isOpen = chatPanel?.classList.contains("open");
      toggleChat(!isOpen);
    });
  }
  if (closeChat) closeChat.addEventListener("click", () => toggleChat(false));

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const q = chatText?.value.trim();
      if (!q) return;

      // Remove any existing active suggestion pill blocks from the layout
      const activeSugs = chatBody.querySelectorAll(".msg-suggestions");
      activeSugs.forEach(el => el.remove());

      addMsg(q, "user");
      if (chatText) chatText.value = "";

      const loadingId = showLoading();

      if (HARDCODE_CHAT) {
        await new Promise(r => setTimeout(r, 650));
        removeLoading(loadingId);

        const answer = findHardcodedAnswer(q);
        if (answer) {
          addMsg(answer, "bot");
        } else {
          addMsg(
            "Sorry, the AI chat assistant is offline. " +
            "To learn more about Dhifulloh, please click on the quick questions below, " +
            "or contact him directly via email at dhifullohdhiyaulhaq@gmail.com\n\n" +
            "💡 Try asking about: work experience, Hakiu AI Assistant, Platform KORELASI, Teman PDP, backend/full-stack skills, or career plans.",
            "bot"
          );
        }

        // Delay follow-up slightly for a natural feeling conversation
        await new Promise(r => setTimeout(r, 800));
        addMsg("Is there anything else I can help you with? Feel free to ask or pick one of these questions:", "bot");
        addSuggestions();
        return;
      }

      if (get(todayKey) >= DAILY_LIMIT) {
        removeLoading(loadingId);
        toast("Daily limit reached. Please come back tomorrow.");
        return;
      }
      if (get(minuteKey) >= PER_MINUTE_LIMIT) {
        removeLoading(loadingId);
        toast("Too fast — try again in a minute.");
        return;
      }

      try {
        incr(todayKey);
        incr(minuteKey);
        setInfo();

        const res = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "omit",
          body: JSON.stringify({
            question: q,
            session: sessionId(),
            profile: window.__PROFILE__
          })
        });

        removeLoading(loadingId);

        if (!res.ok) {
          const t = await res.text();
          addMsg(`Server says: ${t || res.status}`, "bot");
          return;
        }

        const data = await res.json();
        addMsg(data.answer, "bot");
        if (data.remaining && rateInfo) {
          rateInfo.textContent = `Server quota: ${data.remaining} left today`;
        }

        // Delay follow-up slightly for a natural feeling conversation
        await new Promise(r => setTimeout(r, 800));
        addMsg("Is there anything else I can help you with? Feel free to ask or pick one of these questions:", "bot");
        addSuggestions();
      } catch (err) {
        removeLoading(loadingId);
        addMsg("Network error. Please try again.", "bot");
      }
    });
  }

  // Initialize view dynamically
  if (chatBody) {
    chatBody.innerHTML = "";
    addMsg("Hello! 👋 I can answer questions about Dhifulloh — work experience, projects, skills, or career plans. Select a quick question below or type your own!", "bot");
    addSuggestions();
  }
  setInfo();
}
