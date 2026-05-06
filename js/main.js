/* =============================================
   JUNINHO — MAIN
   ============================================= */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => observer.observe(s));

// ===== SCROLL REVEAL =====
function initReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));
}
initReveal();

// ===== CATEGORIES =====
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const cat = card.dataset.cat;
    loadAllProducts(cat);
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== COUNTDOWN =====
function startCountdown() {
  const end = new Date();
  end.setHours(23, 59, 59, 0);

  function tick() {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    document.getElementById('cd-h').textContent = pad(h);
    document.getElementById('cd-m').textContent = pad(m);
    document.getElementById('cd-s').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}
startCountdown();

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${Math.random() * 3 + 1}px;
      height:${Math.random() * 3 + 1}px;
      animation-duration:${Math.random() * 8 + 6}s;
      animation-delay:${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== INIT DATA =====
loadFeaturedProducts();
loadPromoProducts();
loadAllProducts();
