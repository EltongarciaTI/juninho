/* =============================================
   JUNINHO — CARRINHO
   ============================================= */

let cart = JSON.parse(localStorage.getItem('jm_cart') || '[]');

function saveCart() { localStorage.setItem('jm_cart', JSON.stringify(cart)); }

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  const waBtnEl = document.getElementById('btnWhatsapp');

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><p>Seu carrinho está vazio</p></div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = formatCartPrice(total);

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:var(--gray-700);display:flex;align-items:center;justify-content:center;font-size:24px">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">` : '🛍️'}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand || 'Juninho'}</div>
        <div class="cart-item-name">${item.name}</div>
        ${item.size ? `<div class="cart-item-size">Tamanho: ${item.size}</div>` : ''}
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <span class="cart-item-price">${formatCartPrice(item.price * item.qty)}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">🗑️</button>
      </div>
    </div>`).join('');

  const waText = buildWhatsAppMessage();
  waBtnEl.href = `https://wa.me/5575991748725?text=${encodeURIComponent(waText)}`;
}

function formatCartPrice(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildWhatsAppMessage() {
  const lines = ['🛍️ *Pedido — Juninho Multi Marcas*\n'];
  cart.forEach(item => {
    lines.push(`• ${item.name}${item.size ? ` (${item.size})` : ''} x${item.qty} — ${formatCartPrice(item.price * item.qty)}`);
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  lines.push(`\n💰 *Total: ${formatCartPrice(total)}*`);
  lines.push('\nOlá! Gostaria de finalizar esse pedido. 😊');
  return lines.join('\n');
}

async function addToCart(productId, size = null) {
  try {
    const { data: p } = await db.from('products').select('*, brands(name)').eq('id', productId).single();
    if (!p) return;

    const existing = cart.find(i => i.id === productId && i.size === size);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id: productId,
        name: p.name,
        brand: p.brands?.name || '',
        price: p.price,
        image: p.images?.[0] || null,
        size: size,
        qty: 1
      });
    }
    saveCart();
    updateCartUI();
    showToast('✅ Adicionado ao carrinho!');
    openCart();
  } catch (e) {
    console.error('addToCart:', e);
  }
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartUI();
  showToast('🗑️ Item removido');
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
    showToast('🗑️ Item removido');
  }
  saveCart();
  updateCartUI();
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getCartData() { return cart; }
function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

// Event listeners
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

// Init
updateCartUI();
