// js/modules/counter.js

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

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
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
