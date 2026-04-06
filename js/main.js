/**
 * main.js — Portfolio interactions & animations
 * Joseph Odhiambo Portfolio
 */

// Custom Cursor
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
  });
  function animateRing() {
    rx += (mx - rx - 18) * 0.15;
    ry += (my - ry - 18) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

// Navigation
function initNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      document.getElementById('mobileNav')?.classList.remove('open');
    });
  });
  document.getElementById('hamburger')?.addEventListener('click', () =>
    document.getElementById('mobileNav').classList.add('open'));
  document.getElementById('mobileClose')?.addEventListener('click', () =>
    document.getElementById('mobileNav').classList.remove('open'));
}

// Typed Effect
function initTyped() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const phrases = ['Full-Stack Developer','AI Builder','Software Engineer','MERN Stack Specialist','Educator & Mentor'];
  let pi = 0, ci = 0, del = false;
  function type() {
    const cur = phrases[pi];
    el.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
    del ? ci-- : ci++;
    if (!del && ci === cur.length) { del = true; setTimeout(type, 2000); return; }
    if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    setTimeout(type, del ? 60 : 90);
  }
  type();
}

// Scroll Reveal
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Counter animation
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const dur = 1800;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = true;
        animateCounter(e.target, parseInt(e.target.dataset.count), e.target.dataset.suffix || '');
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(c => obs.observe(c));
}

// Project Filter
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });
}

// Contact Form
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      document.querySelector('.form-success').style.display = 'block';
    }, 1200);
  });
}

// Active nav
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent-cyan)' : '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCursor(); initNav(); initTyped(); initReveal(); initCounters();
  initProjectFilter(); initContactForm(); initActiveNav();
});
