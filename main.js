// ====== CONFIG ======
// const API_BASE_URL = "https://dhifulloh-portfolio-proxy.dhifulloh.workers.dev"; // Cloudflare Worker base OR Vercel base
const API_BASE_URL = "https://portfolio-dhifulloh-backend.onrender.com"; // Render base
const DAILY_LIMIT = 40;            // hard cap per browser/day (client-side)
const PER_MINUTE_LIMIT = 4;        // throttle per minute (client-side)
// =====================

const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const $about = $("#about"), $exp = $("#experience"), $proj = $("#projects");

// ====== Theme Toggle ======
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = $('#theme-toggle');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

// Initialize theme on load
initTheme();

// ====== Typing Effect ======
class TypeWriter {
  constructor(element, texts, wait = 3000) {
    this.element = element;
    this.texts = texts;
    this.wait = wait;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.textIndex % this.texts.length;
    const fullText = this.texts[current];

    if (this.isDeleting) {
      this.element.textContent = fullText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = fullText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? 30 : 80;

    if (!this.isDeleting && this.charIndex === fullText.length) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ====== Particle Effect ======
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 50;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 122, 24, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 122, 24, ${0.1 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  resize();
  init();
  animate();
}

// ====== Animated Counter ======
function animateCounter(element, target, suffix = '', duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  function update() {
    current += increment;
    if (current >= target) {
      current = target;
      element.textContent = target + suffix;
    } else {
      element.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }
  }

  update();
}

function initCounters() {
  const counters = $$('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseFloat(entry.target.dataset.counter);
        const suffix = entry.target.dataset.suffix || '';
        const isDecimal = entry.target.dataset.decimal === 'true';

        if (isDecimal) {
          animateDecimal(entry.target, target, suffix);
        } else {
          animateCounter(entry.target, target, suffix);
        }
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateDecimal(element, target, suffix = '', duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  function update() {
    current += increment;
    if (current >= target) {
      current = target;
      element.textContent = target.toFixed(1) + suffix;
    } else {
      element.textContent = current.toFixed(1) + suffix;
      requestAnimationFrame(update);
    }
  }

  update();
}

// ====== Scroll Animations ======
function initScrollAnimations() {
  const elements = $$('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ====== Smooth Scroll ======
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = $(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ====== Render Sections from profileData ======
(function render() {
  const p = window.__PROFILE__;
  if (!p) return;

  // About Section
  $about.innerHTML = `
    <h3>About</h3>
    <div class="card animate-on-scroll">
      <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">${p.summary}</p>
      <div style="margin-bottom: 16px;">
        <span class="badge">${p.education.program}</span>
        <span class="badge">${p.education.gpa}</span>
        <span class="badge">${p.education.school}</span>
        <span class="badge secondary">${p.basics.location}</span>
      </div>
      <h4 style="margin: 20px 0 12px; font-size: 1rem; color: var(--muted);">Top Skills</h4>
      <div class="skills-grid">
        ${p.skillsTop.map(s => `<span class="skill-badge">${s}</span>`).join("")}
      </div>
    </div>`;

  // Experience Section
  $exp.innerHTML = `
    <h3>Experience</h3>
    <div class="grid cols-2">
      ${p.experience.map((e, i) => `
        <div class="card exp-card animate-on-scroll animate-delay-${(i % 4) + 1}">
          <strong>${e.role}</strong>
          <span class="org">${e.org}</span>
          <div class="period">${e.period}</div>
          <p>${e.summary}</p>
        </div>`).join("")}
    </div>`;

  // Projects Section
  $proj.innerHTML = `
    <h3>Projects</h3>
    <div class="grid cols-2">
      ${p.projects.map((pr, i) => `
        <div class="card proj-card ${pr.highlight ? 'highlight' : ''} animate-on-scroll animate-delay-${(i % 4) + 1}">
          <strong>${pr.name}</strong>
          <span class="badge">${pr.year}</span>
          ${pr.highlight ? '<span class="badge" style="background: var(--gradient-primary); color: #111; border: none;">⭐ Featured</span>' : ''}
          <p>${pr.blurb}</p>
          <div>${pr.tags.map(t => `<span class="badge secondary">${t}</span>`).join("")}</div>
        </div>`).join("")}
    </div>`;

  // Initialize typing effect
  const typingElement = $('#typing-text');
  if (typingElement && p.typingTexts) {
    new TypeWriter(typingElement, p.typingTexts, 2500);
  }

  // Initialize counters after DOM is ready
  setTimeout(initCounters, 100);

  // Initialize scroll animations
  setTimeout(initScrollAnimations, 100);
})();

// ====== Chat UI ======
const chatFab = $("#chat-fab"), chatPanel = $("#chat-panel"), chatForm = $("#chat-form");
const chatText = $("#chat-text"), chatBody = $("#chat-body"), openChat = $("#open-chat");
const closeChat = $("#close-chat"), rateInfo = $("#rate-info"), sugWrap = $("#suggestions");

function pills() {
  const s = window.__PROFILE__?.suggestions || [];
  if (!sugWrap) return;
  sugWrap.innerHTML = s.map(x => `<button type="button" data-q="${x}">${x}</button>`).join("");
  sugWrap.querySelectorAll("button").forEach(b => {
    b.onclick = () => {
      if (chatText) {
        chatText.value = b.dataset.q;
        chatText.focus();
      }
    };
  });
}
pills();

openChat?.addEventListener("click", () => toggleChat(true));
chatFab?.addEventListener("click", () => {
  const isOpen = chatPanel?.classList.contains("open");
  toggleChat(!isOpen);
});
closeChat?.addEventListener("click", () => toggleChat(false));

function toggleChat(open) {
  if (chatPanel) {
    chatPanel.classList.toggle("open", open);
    if (open && chatText) chatText.focus();
  }
}

// Theme toggle event
$('#theme-toggle')?.addEventListener('click', toggleTheme);

// ====== Client-side guardrails ======
const todayKey = `rl-${new Date().toISOString().slice(0, 10)}`;
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
setInfo();

// ====== Chat flow ======
chatForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = chatText?.value.trim();
  if (!q) return;

  // local limits
  if (get(todayKey) >= DAILY_LIMIT) {
    toast("Daily limit reached. Please come back tomorrow.");
    return;
  }
  if (get(minuteKey) >= PER_MINUTE_LIMIT) {
    toast("Too fast — try again in a minute.");
    return;
  }

  addMsg(q, "user");
  if (chatText) chatText.value = "";

  // Show loading
  const loadingId = showLoading();

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
  } catch (err) {
    removeLoading(loadingId);
    addMsg("Network error. Please try again.", "bot");
  }
});

function sessionId() {
  const k = "sid";
  let v = localStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    localStorage.setItem(k, v);
  }
  return v;
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
    const el = $(`#${id}`);
    if (el) el.remove();
  }
}

function toast(t) {
  addMsg(t, "bot");
}

// ====== Initialize Everything ======
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSmoothScroll();
});

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    initParticles();
    initSmoothScroll();
  }, 100);
}