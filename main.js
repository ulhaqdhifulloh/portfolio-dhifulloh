// ====== CONFIG ======
// const API_BASE_URL = "https://dhifulloh-portfolio-proxy.dhifulloh.workers.dev"; // Cloudflare Worker base OR Vercel base
const API_BASE_URL = "https://portfolio-dhifulloh-backend.onrender.com"; // Render base
const DAILY_LIMIT = 40;            // hard cap per browser/day (client-side)
const PER_MINUTE_LIMIT = 4;        // throttle per minute (client-side)
// =====================

const $ = (q)=>document.querySelector(q);
const $about = $("#about"), $exp = $("#experience"), $proj = $("#projects");

// Render sections from profileData
(function render(){
  const p = window.__PROFILE__;

  $about.innerHTML = `
    <h3>About</h3>
    <div class="card">
      <p>${p.summary}</p>
      <div>
        <span class="badge">${p.education.program}</span>
        <span class="badge">${p.education.school}</span>
        <span class="badge">${p.basics.location}</span>
      </div>
      <div style="margin-top:8px">${p.skillsTop.map(s=>`<span class="badge">${s}</span>`).join("")}</div>
    </div>`;

  $exp.innerHTML = `
    <h3>Experience</h3>
    <div class="grid cols-2">
      ${p.experience.map(e=>`
        <div class="card">
          <strong>${e.role}</strong> <span style="color:#bbb">· ${e.org}</span><br/>
          <small style="color:#9aa0a6">${e.period}</small>
          <p style="margin-top:6px">${e.summary}</p>
        </div>`).join("")}
    </div>`;

  $proj.innerHTML = `
    <h3>Projects</h3>
    <div class="grid cols-2">
      ${p.projects.map(pr=>`
        <div class="card">
          <strong>${pr.name}</strong> <span class="badge">${pr.year}</span>
          <p>${pr.blurb}</p>
          <div>${pr.tags.map(t=>`<span class="badge">${t}</span>`).join("")}</div>
        </div>`).join("")}
    </div>`;
})();

// ====== Chat UI ======
const chatFab = $("#chat-fab"), chatPanel = $("#chat-panel"), chatForm = $("#chat-form");
const chatText = $("#chat-text"), chatBody = $("#chat-body"), openChat = $("#open-chat");
const closeChat = $("#close-chat"), rateInfo = $("#rate-info"), sugWrap = $("#suggestions");

function pills(){
  const s = window.__PROFILE__.suggestions;
  sugWrap.innerHTML = s.map(x=>`<button type="button" data-q="${x}">${x}</button>`).join("");
  sugWrap.querySelectorAll("button").forEach(b=>{
    b.onclick = ()=>{ chatText.value=b.dataset.q; chatText.focus(); };
  });
}
pills();

openChat?.addEventListener("click",()=>toggleChat(true));
chatFab?.addEventListener("click",()=>{
  // Toggle chat - if open, close it; if closed, open it
  const isOpen = chatPanel.classList.contains("open");
  toggleChat(!isOpen);
});
closeChat?.addEventListener("click",()=>toggleChat(false));
function toggleChat(open){ chatPanel.classList.toggle("open", open); if(open) chatText.focus(); }

// ====== Client-side guardrails (simple) ======
const todayKey = `rl-${new Date().toISOString().slice(0,10)}`;
const minuteKey = `rlm-${Math.floor(Date.now()/60000)}`;
function incr(key){ const v = Number(localStorage.getItem(key)||"0")+1; localStorage.setItem(key,String(v)); return v; }
function get(key){ return Number(localStorage.getItem(key)||"0"); }
function setInfo(){
  rateInfo.textContent = `Daily: ${get(todayKey)}/${DAILY_LIMIT} · Per-minute: ${get(minuteKey)}/${PER_MINUTE_LIMIT}`;
}
setInfo();

// ====== Chat flow ======
chatForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const q = chatText.value.trim();
  if(!q) return;

  // local limits
  if(get(todayKey) >= DAILY_LIMIT){ toast("Daily limit reached. Please come back tomorrow."); return; }
  if(get(minuteKey) >= PER_MINUTE_LIMIT){ toast("Too fast — try again in a minute."); return; }

  addMsg(q,"user");
  chatText.value="";

  try{
    incr(todayKey); incr(minuteKey); setInfo();
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      credentials:"omit",
      body: JSON.stringify({
        question: q,
        session: sessionId(),
        // lightweight context for the model:
        profile: window.__PROFILE__
      })
    });
    if(!res.ok){
      const t = await res.text();
      addMsg(`Server says: ${t || res.status}`, "bot");
      return;
    }
    const data = await res.json();
    addMsg(data.answer, "bot");
    if(data.remaining) rateInfo.textContent = `Server quota: ${data.remaining} left today`;
  }catch(err){
    addMsg("Network error. Please try again.", "bot");
  }
});

function sessionId(){
  const k="sid"; let v=localStorage.getItem(k);
  if(!v){ v=crypto.randomUUID(); localStorage.setItem(k,v); }
  return v;
}

function addMsg(text, who="bot"){
  const el = document.createElement("div");
  el.className = `msg ${who}`;
  el.textContent = text;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function toast(t){ addMsg(t,"bot"); }