/**
 * Shopify Peek – Popup Script
 *
 * Communicates with the service worker to get detection results and
 * product/cart JSON. Renders all data into the popup UI.
 */

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);

const els = {
  notAStore: $('.not-a-shop'),
  storeContent: $('.shop-info'),
  productCartInfo: $('.product-cart-info'),
  themeUrl: $('[data-theme-url]'),
  themeName: $('[data-theme-name]'),
  themeId: $('[data-theme-id]'),
  storeCurrency: $('[data-store-currency]'),
  detectionSource: $('[data-detection-source]'),
  productInfoBtn: $('[data-product-info-btn]'),
  cartInfoBtn: $('[data-cart-info-btn]'),
  backBtn: $('[data-back-btn]'),
  copyUrlBtn: $('[data-copy-url-btn]'),
  loadingIndicator: $('.loading-indicator'),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function convertPrice(price) {
  return `$${(price / 100).toFixed(2)}`;
}

function show(el) {
  el?.classList.remove('hidden');
}

function hide(el) {
  el?.classList.add('hidden');
}

function setTextContent(el, text) {
  if (el) el.textContent = text ?? '';
}

function getPageType(pathname) {
  if (!pathname) return 'home';
  if (pathname.includes('/products/')) return 'product';
  if (pathname.includes('/cart')) return 'cart';
  return 'home';
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderThemeInfo(shopData, tabUrl) {
  const url = new URL(tabUrl);
  const pathname = url.pathname;
  const themeId = shopData.theme?.id;
  const previewUrl = themeId
    ? `https://${shopData.shop}${pathname}?preview_theme_id=${themeId}`
    : `https://${shopData.shop}${pathname}`;

  setTextContent(els.themeUrl, previewUrl);
  setTextContent(els.themeName, shopData.theme?.name ?? 'N/A (headless)');
  setTextContent(els.themeId, themeId ?? 'N/A');
  setTextContent(
    els.storeCurrency,
    shopData.currency?.active ?? shopData.currency ?? 'N/A'
  );

  // Detection source badge
  if (els.detectionSource) {
    const src = shopData._source;
    if (src === 'meta_json') {
      setTextContent(els.detectionSource, 'Detected via /meta.json (headless)');
      show(els.detectionSource);
    } else {
      hide(els.detectionSource);
    }
  }

  // Copy URL button
  if (els.copyUrlBtn) {
    els.copyUrlBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(previewUrl).then(() => {
        els.copyUrlBtn.textContent = 'Copied!';
        setTimeout(() => (els.copyUrlBtn.textContent = 'Copy URL'), 1500);
      });
    });
  }
}

function renderProductInfo(info, origin) {
  let html = '<ul class="space-y-3">';

  html += field('Title', info.product.title);
  html += field('ID', info.product.id);
  html += field('Tags', info.product.tags || 'None');

  // Variants
  if (info.product.variants?.length) {
    html += `<li><h4 class="label">Variants</h4><ul class="ml-2 space-y-3">`;
    for (const v of info.product.variants) {
      html += `<li class="pl-2 border-l border-neon-cyan/30 space-y-1">
        <p class="value"><span class="sub-label">Title:</span> ${esc(v.title)}</p>
        <p class="value"><span class="sub-label">ID:</span> ${esc(String(v.id))}</p>
        <p class="value"><span class="sub-label">Price:</span> $${esc(v.price)}</p>
        <p class="value"><span class="sub-label">Compare At:</span> $${esc(String(v.compare_at_price ?? 0))}</p>
        <p class="value"><span class="sub-label">SKU:</span> ${esc(v.sku || 'N/A')}</p>
      </li>`;
    }
    html += `</ul></li>`;
  }

  // Images
  if (info.product.images?.length) {
    html += `<li><h4 class="label">Images</h4><ul class="ml-2 space-y-3">`;
    for (const img of info.product.images) {
      html += `<li class="pl-2 border-l border-neon-cyan/30 space-y-1">
        <img class="rounded border border-neon-cyan/20 max-w-[200px] mb-1" loading="lazy"
             alt="${esc(img.alt || '')}" src="${esc(img.src)}" />
        <p class="value"><span class="sub-label">ID:</span> ${esc(String(img.id))}</p>
        <p class="value"><span class="sub-label">Alt:</span> ${esc(img.alt || 'None')}</p>
      </li>`;
    }
    html += `</ul></li>`;
  }

  html += '</ul>';
  els.productCartInfo.innerHTML = html;
}

function renderCartInfo(info, origin) {
  let html = '<ul class="space-y-3">';

  html += field('Total Price', convertPrice(info.total_price));
  html += field('Item Count', info.item_count);

  if (info.items?.length) {
    html += `<li><h4 class="label">Items</h4><ul class="ml-2 space-y-3">`;
    for (const item of info.items) {
      html += `<li class="pl-2 border-l border-neon-cyan/30 space-y-1">
        <p class="value"><span class="sub-label">Title:</span> ${esc(item.title)}</p>
        <p class="value"><span class="sub-label">ID:</span> ${esc(String(item.id))}</p>
        <p class="value"><span class="sub-label">Price:</span> ${convertPrice(item.price)}</p>
        <p class="value"><span class="sub-label">Quantity:</span> ${esc(String(item.quantity))}</p>
        <p class="value"><span class="sub-label">SKU:</span> ${esc(item.sku || 'N/A')}</p>
        <p class="value"><span class="sub-label">URL:</span> <a class="text-neon-cyan hover:text-neon-magenta transition-colors" href="${esc(origin + item.url)}" target="_blank">${esc(origin + item.url)}</a></p>
      </li>`;
    }
    html += `</ul></li>`;
  }

  if (info.attributes && Object.keys(info.attributes).length) {
    html += `<li><h4 class="label">Attributes</h4><ul class="ml-2 space-y-1">`;
    for (const [key, val] of Object.entries(info.attributes)) {
      html += `<li class="value pl-2">${esc(key)}: ${esc(String(val))}</li>`;
    }
    html += `</ul></li>`;
  }

  html += '</ul>';
  els.productCartInfo.innerHTML = html;
}

/** Build one field row. */
function field(label, value) {
  return `<li>
    <h4 class="label">${esc(label)}</h4>
    <p class="value">${esc(String(value ?? ''))}</p>
  </li>`;
}

/** Basic HTML escaping. */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ---------------------------------------------------------------------------
// Button wiring
// ---------------------------------------------------------------------------

function wireButtons(pageType, tabUrl, origin) {
  // Enable the relevant button
  if (pageType === 'product' && els.productInfoBtn) {
    els.productInfoBtn.disabled = false;
    els.productInfoBtn.classList.remove('btn-disabled');
    els.productInfoBtn.addEventListener('click', () => loadProductInfo(tabUrl, origin));
  }
  if (pageType === 'cart' && els.cartInfoBtn) {
    els.cartInfoBtn.disabled = false;
    els.cartInfoBtn.classList.remove('btn-disabled');
    els.cartInfoBtn.addEventListener('click', () => loadCartInfo(tabUrl, origin));
  }

  els.backBtn?.addEventListener('click', () => {
    hide(els.productCartInfo);
    show(els.storeContent);
    showMainButtons();
  });
}

function showMainButtons() {
  show(els.productInfoBtn);
  show(els.cartInfoBtn);
  hide(els.backBtn);
}

function showBackButton() {
  hide(els.productInfoBtn);
  hide(els.cartInfoBtn);
  show(els.backBtn);
}

async function loadProductInfo(tabUrl, origin) {
  const jsonUrl = tabUrl.split('?')[0] + '.json';
  const resp = await chrome.runtime.sendMessage({ type: 'fetchJson', url: jsonUrl });
  if (resp?.data) {
    renderProductInfo(resp.data, origin);
    hide(els.storeContent);
    show(els.productCartInfo);
    showBackButton();
  }
}

async function loadCartInfo(tabUrl, origin) {
  const url = new URL(tabUrl);
  const jsonUrl = `${url.origin}/cart.json`;
  const resp = await chrome.runtime.sendMessage({ type: 'fetchJson', url: jsonUrl });
  if (resp?.data) {
    renderCartInfo(resp.data, origin);
    hide(els.storeContent);
    show(els.productCartInfo);
    showBackButton();
  }
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

async function init() {
  show(els.loadingIndicator);
  hide(els.notAStore);
  hide(els.storeContent);
  hide(els.productCartInfo);

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab) {
    hide(els.loadingIndicator);
    show(els.notAStore);
    return;
  }

  const resp = await chrome.runtime.sendMessage({ type: 'getTabData', tabId: tab.id });
  hide(els.loadingIndicator);

  if (!resp?.isShopify || !resp.shopData) {
    show(els.notAStore);
    return;
  }

  // Shopify detected — render
  renderThemeInfo(resp.shopData, resp.url);
  show(els.storeContent);

  const pageType = getPageType(new URL(resp.url).pathname);
  wireButtons(pageType, resp.url, new URL(resp.url).origin);
}

init();
