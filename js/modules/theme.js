// js/modules/theme.js

function applyHeroBg(theme) {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (theme === 'light') {
    hero.style.backgroundImage = "linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(248, 249, 250, 0.15)), url('assets/hero-bg-light-white.png')";
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center, center';
    hero.style.backgroundRepeat = 'no-repeat';
  } else {
    hero.style.backgroundImage = "linear-gradient(180deg, rgba(16, 16, 16, 0.95), rgba(11, 11, 11, 0.8)), url('assets/hero-bg-dark-orange.png')";
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center, center';
    hero.style.backgroundRepeat = 'no-repeat';
  }
}

function updateThemeIcon(theme) {
  const btn = document.querySelector('#theme-toggle');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
  applyHeroBg(next);
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Apply hero bg after DOM is ready
  document.addEventListener('DOMContentLoaded', () => applyHeroBg(savedTheme));
  if (document.readyState !== 'loading') applyHeroBg(savedTheme);
}
