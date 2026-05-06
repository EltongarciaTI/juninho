/* =============================================
   JUNINHO — NAVBAR & FOOTER COMPARTILHADOS
   ============================================= */

const NAV_LINKS = [
  { href: 'index.html',       label: 'Início',      icon: '🏠' },
  { href: 'lancamentos.html', label: 'Lançamentos', icon: '✨' },
  { href: 'promocoes.html',   label: 'Promoções',   icon: '🔥' },
  { href: 'produtos.html',    label: 'Produtos',    icon: '👕' },
  { href: 'sobre.html',       label: 'Sobre',       icon: '👑' },
];

function renderNavbar() {
  const current = location.pathname.split('/').pop() || 'index.html';

  const linksHtml = NAV_LINKS.map(l => `
    <a href="${l.href}" class="nav-link${current === l.href ? ' nav-link--active' : ''}">${l.label}</a>
  `).join('');

  const mobileLinksHtml = NAV_LINKS.map(l => `
    <a href="${l.href}" class="${current === l.href ? 'active' : ''}">${l.icon} ${l.label}</a>
  `).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo">
          <span>JUNINHO<span class="logo-sub">MULTI MARCAS</span></span>
        </a>
        <div class="navbar-desktop-links">
          ${linksHtml}
        </div>
        <div class="navbar-actions">
          <button class="navbar-cart" id="cartBtn" aria-label="Carrinho">
            🛍️
            <span class="cart-badge" id="cartBadge" style="display:none">0</span>
          </button>
          <button class="navbar-menu-btn" id="menuBtn" aria-label="Menu">
            <div class="hamburger" id="hamburger">
              <span></span><span></span><span></span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <div class="mobile-menu" id="mobileMenu">
      ${mobileLinksHtml}
      <div class="mobile-menu-social">
        <a href="https://wa.me/5575991748725" target="_blank">📱 WhatsApp</a>
        <a href="https://www.instagram.com/junninho_multimarcas" target="_blank">📸 Instagram</a>
      </div>
    </div>

    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h3>🛍️ Seu Carrinho</h3>
        <button class="cart-close" id="cartClose">✕</button>
      </div>
      <div class="cart-items" id="cartItems">
        <div class="cart-empty">
          <div class="cart-empty-icon">🛍️</div>
          <p>Seu carrinho está vazio</p>
        </div>
      </div>
      <div class="cart-footer" id="cartFooter" style="display:none">
        <div class="cart-total">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-value" id="cartTotal">R$ 0,00</span>
        </div>
        <div class="cart-checkout-btns">
          <a class="btn-whatsapp" id="btnWhatsapp" href="#" target="_blank">📱 Finalizar pelo WhatsApp</a>
          <button class="btn btn-gold" onclick="window.location.href='checkout.html'">💳 Pagar Online</button>
        </div>
      </div>
    </aside>

    <div class="product-modal-overlay" id="productModal">
      <div class="product-modal" id="productModalContent"></div>
    </div>

    <div class="toast-container" id="toastContainer"></div>
  `);

  initNavbarEvents();
}

function renderFooter() {
  document.body.insertAdjacentHTML('beforeend', `
    <footer>
      <div class="container">
        <div class="footer-logo">
          <p style="font-size:22px;font-weight:900;letter-spacing:3px;color:var(--white);margin-bottom:4px">JUNINHO</p>
          <p>MULTI MARCAS · SINCE 2018</p>
        </div>
        <div class="footer-links">
          ${NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
          <a href="admin/login.html">Admin</a>
        </div>
        <div class="footer-bottom">
          <p>© 2024 Juninho Multi Marcas · Rua Castro Alves, Quijingue-BA · Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
    <a class="whatsapp-float" href="https://wa.me/5575991748725" target="_blank" aria-label="WhatsApp">📱</a>
  `);
}

function initNavbarEvents() {
  const navbar    = document.getElementById('navbar');
  const menuBtn   = document.getElementById('menuBtn');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

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

  document.getElementById('cartBtn').addEventListener('click', () => openCart());
  document.getElementById('cartClose').addEventListener('click', () => closeCart());
  document.getElementById('cartOverlay').addEventListener('click', () => closeCart());
  document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
  });
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}
