// js/main.js

// Initialize Theme IMMEDIATELY to avoid page flashes
if (typeof initTheme === 'function') {
  initTheme();
}

// ====== Render Sections from profileData ======
function renderPortfolio() {
  const p = window.__PROFILE__;
  if (!p) return;

  const $about = document.querySelector("#about");
  const $exp = document.querySelector("#experience");
  const $proj = document.querySelector("#projects");

  // About Section
  if ($about) {
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
  }

  // Experience Section
  if ($exp) {
    $exp.innerHTML = `
      <h3>Experience</h3>
      <div class="grid cols-2">
        ${p.experience.map((e, i) => `
          <div class="card exp-card ${e.highlight ? 'highlight' : ''} animate-on-scroll animate-delay-${(i % 4) + 1}">
            <strong>${e.role}</strong>
            <span class="org">${e.org}</span>
            <div class="period">${e.period}</div>
            <p>${e.summary}</p>
          </div>`).join("")}
      </div>`;
  }

  // Projects Section
  if ($proj) {
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
  }

  // Initialize typing effect
  const typingElement = document.querySelector('#typing-text');
  if (typingElement && p.typingTexts && typeof TypeWriter === 'function') {
    new TypeWriter(typingElement, p.typingTexts, 2500);
  }

  // Initialize counters after DOM is ready
  if (typeof initCounters === 'function') {
    setTimeout(initCounters, 100);
  }

  // Initialize scroll animations
  if (typeof initScrollAnimations === 'function') {
    setTimeout(initScrollAnimations, 100);
  }
}

// Render dynamic parts
renderPortfolio();

// Initialize all features once DOM is fully interactive
function initAll() {
  if (typeof initParticles === 'function') initParticles();
  if (typeof initSmoothScroll === 'function') initSmoothScroll();
  if (typeof initChat === 'function') initChat();

  const themeBtn = document.querySelector('#theme-toggle');
  if (themeBtn && typeof toggleTheme === 'function') {
    // Prevent duplicated listener
    themeBtn.removeEventListener('click', toggleTheme);
    themeBtn.addEventListener('click', toggleTheme);
  }
}

document.addEventListener('DOMContentLoaded', initAll);

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initAll, 100);
}
