/* =============================================
   JUNINHO — PRODUTOS
   ============================================= */

const CATEGORY_ICONS = {
  'roupas': '👕', 'oculos': '🕶️', 'calcados': '👟',
  'bones': '🧢', 'sandalias': '🩴', 'shorts-praia': '🩱', 'shorts-jeans': '👖'
};

function formatPrice(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcDiscount(price, original) {
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
}

function buildProductCard(p) {
  const discount = calcDiscount(p.price, p.original_price);
  const icon = CATEGORY_ICONS[p.categories?.slug] || '👕';
  const imgEl = p.images && p.images.length > 0
    ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">`
    : `<div class="product-image-placeholder">${icon}<span>${p.categories?.name || ''}</span></div>`;

  const tagsHtml = [
    p.is_featured ? `<span class="tag tag-new">Novo</span>` : '',
    p.is_promotion && discount > 0 ? `<span class="tag tag-promo">-${discount}%</span>` : ''
  ].join('');

  const sizesHtml = p.sizes && p.sizes.length
    ? `<div class="product-sizes">${p.sizes.slice(0,4).map(s => `<span class="size-tag">${s}</span>`).join('')}</div>`
    : '';

  const priceHtml = p.original_price && p.original_price > p.price
    ? `<span class="product-price">${formatPrice(p.price)}</span>
       <span class="product-price-old">${formatPrice(p.original_price)}</span>
       <span class="product-discount">-${discount}%</span>`
    : `<span class="product-price">${formatPrice(p.price)}</span>`;

  return `
    <div class="product-card reveal" data-id="${p.id}" onclick="openProductModal('${p.id}')">
      <div class="product-image">
        ${imgEl}
        ${tagsHtml ? `<div class="product-tags">${tagsHtml}</div>` : ''}
        <button class="product-wishlist" onclick="event.stopPropagation()">♡</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brands?.name || 'Juninho'}</div>
        <div class="product-name">${p.name}</div>
        ${sizesHtml}
        <div class="product-prices">${priceHtml}</div>
        <button class="product-btn" onclick="event.stopPropagation();addToCart('${p.id}')">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>`;
}

async function loadFeaturedProducts() {
  try {
    const { data, error } = await db
      .from('products')
      .select('*, categories(name,slug), brands(name)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    const grid = document.getElementById('launchesGrid');
    if (error || !data || data.length === 0) {
      grid.innerHTML = '<p style="color:var(--gray-400);text-align:center;grid-column:1/-1;padding:40px">Novidades chegando em breve!</p>';
      return;
    }
    grid.innerHTML = data.map(buildProductCard).join('');
    initReveal();
  } catch (e) {
    console.error('loadFeaturedProducts:', e);
  }
}

async function loadPromoProducts() {
  try {
    const { data, error } = await db
      .from('products')
      .select('*, categories(name,slug), brands(name)')
      .eq('is_promotion', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    const grid = document.getElementById('promoGrid');
    if (error || !data || data.length === 0) {
      grid.innerHTML = '<p style="color:var(--gray-400);text-align:center;grid-column:1/-1;padding:40px">Promoções chegando em breve!</p>';
      return;
    }
    grid.innerHTML = data.map(buildProductCard).join('');
    initReveal();
  } catch (e) {
    console.error('loadPromoProducts:', e);
  }
}

async function loadAllProducts(categorySlug = null) {
  const grid = document.getElementById('allProductsGrid');
  const title = document.getElementById('allProductsTitle');

  grid.innerHTML = `
    <div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton-info"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line-sm"></div></div></div>
    <div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton-info"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line-sm"></div></div></div>
    <div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton-info"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line-sm"></div></div></div>
    <div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton-info"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line-sm"></div></div></div>`;

  try {
    let query = db
      .from('products')
      .select('*, categories(name,slug), brands(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (categorySlug && categorySlug !== 'todos') {
      const { data: cat } = await db.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    const { data, error } = await query.limit(20);

    if (error || !data || data.length === 0) {
      grid.innerHTML = '<p style="color:var(--gray-400);text-align:center;grid-column:1/-1;padding:60px">Nenhum produto encontrado</p>';
      return;
    }
    grid.innerHTML = data.map(buildProductCard).join('');
    initReveal();
  } catch (e) {
    console.error('loadAllProducts:', e);
  }
}

async function openProductModal(productId) {
  const overlay = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');

  content.innerHTML = '<div style="padding:60px;text-align:center;font-size:32px">⏳</div>';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    const { data: p } = await db
      .from('products')
      .select('*, categories(name,slug), brands(name)')
      .eq('id', productId)
      .single();

    if (!p) return;

    const discount = calcDiscount(p.price, p.original_price);
    const icon = CATEGORY_ICONS[p.categories?.slug] || '👕';
    const imgEl = p.images && p.images.length > 0
      ? `<img class="modal-img" src="${p.images[0]}" alt="${p.name}">`
      : `<div class="modal-img-placeholder">${icon}</div>`;

    const sizesHtml = p.sizes && p.sizes.length
      ? `<p class="modal-sizes-label">Tamanho</p>
         <div class="modal-sizes">${p.sizes.map(s => `<button class="size-btn" onclick="selectSize(this,'${s}')">${s}</button>`).join('')}</div>`
      : '';

    const priceHtml = p.original_price && p.original_price > p.price
      ? `${formatPrice(p.price)} <span style="font-size:16px;color:var(--gray-400);text-decoration:line-through;font-weight:400">${formatPrice(p.original_price)}</span> <span style="font-size:14px;background:var(--danger);color:#fff;padding:2px 8px;border-radius:4px">-${discount}%</span>`
      : formatPrice(p.price);

    content.innerHTML = `
      ${imgEl}
      <div class="modal-body">
        <div class="modal-close"><button onclick="closeProductModal()">✕</button></div>
        <div class="modal-brand">${p.brands?.name || 'Juninho'}</div>
        <div class="modal-name">${p.name}</div>
        ${p.description ? `<p style="color:var(--gray-300);font-size:14px;line-height:1.6;margin-bottom:16px">${p.description}</p>` : ''}
        <div class="modal-price">${priceHtml}</div>
        ${sizesHtml}
        <div class="modal-actions">
          <button class="btn btn-gold" style="padding:14px" onclick="addToCartFromModal('${p.id}')">
            🛍️ Adicionar ao Carrinho
          </button>
          <a class="btn-whatsapp" href="https://wa.me/5575991748725?text=Olá! Tenho interesse em: ${encodeURIComponent(p.name)} — ${formatPrice(p.price)}" target="_blank">
            📱 Perguntar no WhatsApp
          </a>
        </div>
      </div>`;
  } catch (e) {
    console.error('openProductModal:', e);
  }
}

function selectSize(btn, size) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  window._selectedSize = size;
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
  window._selectedSize = null;
}

function addToCartFromModal(productId) {
  addToCart(productId, window._selectedSize);
  closeProductModal();
}

document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeProductModal();
});
