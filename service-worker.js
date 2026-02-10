/**
 * Shopify Peek – MV3 Service Worker
 *
 * Responsibilities:
 *  1. Detect Shopify stores via chrome.scripting.executeScript (MAIN world)
 *     with a /meta.json fallback for headless storefronts.
 *  2. Cache detection results per-tab so the popup opens instantly.
 *  3. Swap the toolbar icon between gray (not Shopify) and neon (Shopify).
 *  4. Respond to messages from the popup requesting tab data or product/cart JSON.
 */

// ---------------------------------------------------------------------------
// Icon paths
// ---------------------------------------------------------------------------
const ICONS_GRAY = {
  16: 'icons/icon-gray-16.png',
  32: 'icons/icon-gray-32.png',
  48: 'icons/icon-gray-48.png',
  128: 'icons/icon-gray-128.png',
};

const ICONS_NEON = {
  16: 'icons/icon-neon-16.png',
  32: 'icons/icon-neon-32.png',
  48: 'icons/icon-neon-48.png',
  128: 'icons/icon-neon-128.png',
};

// ---------------------------------------------------------------------------
// Per-tab cache   tabId → { isShopify, shopData, url, timestamp }
// ---------------------------------------------------------------------------
const tabCache = new Map();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Set toolbar icon for a given tab. */
function setIcon(tabId, isShopify) {
  chrome.action.setIcon({
    tabId,
    path: isShopify ? ICONS_NEON : ICONS_GRAY,
  }).catch(() => {/* tab may have closed */});
}

/** Returns true for URLs we can inject scripts into. */
function isInjectableUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

// ---------------------------------------------------------------------------
// Primary detection – read window.Shopify from the MAIN world
// ---------------------------------------------------------------------------

async function detectViaShopifyObject(tabId) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: () => {
        /* runs in the page's JS context */
        if (typeof Shopify === 'undefined') return null;
        return {
          shop: Shopify.shop || null,
          theme: Shopify.theme
            ? { id: Shopify.theme.id, name: Shopify.theme.name, role: Shopify.theme.role }
            : null,
          currency: Shopify.currency || null,
          locale: Shopify.locale || null,
        };
      },
    });

    if (result && result.result) {
      return { detected: true, source: 'shopify_object', data: result.result };
    }
  } catch {
    /* scripting can fail on restricted pages – fall through */
  }
  return { detected: false };
}

// ---------------------------------------------------------------------------
// Fallback detection – fetch /meta.json (works for headless/Hydrogen too)
// ---------------------------------------------------------------------------

async function detectViaMetaJson(url) {
  try {
    const origin = new URL(url).origin;
    const resp = await fetch(`${origin}/meta.json`, {
      method: 'GET',
      credentials: 'omit',
      signal: AbortSignal.timeout(3000),
    });
    if (!resp.ok) return { detected: false };
    const meta = await resp.json();
    // Shopify's meta.json includes a myshopify_domain field — use it to
    // distinguish from random sites that might also serve /meta.json.
    if (meta && (meta.myshopify_domain || (meta.name && meta.province !== undefined))) {
      return {
        detected: true,
        source: 'meta_json',
        data: {
          shop: meta.myshopify_domain || (meta.name ? `${meta.name}.myshopify.com` : null),
          theme: null,
          currency: null,
          locale: null,
          meta,
        },
      };
    }
  } catch {
    /* network error or timeout */
  }
  return { detected: false };
}

// ---------------------------------------------------------------------------
// Orchestrate detection for a given tab
// ---------------------------------------------------------------------------

async function detectShopify(tabId, url) {
  if (!isInjectableUrl(url)) {
    tabCache.set(tabId, { isShopify: false, shopData: null, url, ts: Date.now() });
    setIcon(tabId, false);
    return;
  }

  // 1) Try reading window.Shopify (fastest, most data)
  let result = await detectViaShopifyObject(tabId);

  // 2) Fallback: /meta.json
  if (!result.detected) {
    result = await detectViaMetaJson(url);
  }

  const isShopify = result.detected;
  const shopData = result.data || null;
  if (shopData) shopData._source = result.source;

  tabCache.set(tabId, { isShopify, shopData, url, ts: Date.now() });
  setIcon(tabId, isShopify);
}

// ---------------------------------------------------------------------------
// Tab events – trigger detection on navigation
// ---------------------------------------------------------------------------

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    detectShopify(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  // If we already have a fresh cache entry, just update the icon
  const cached = tabCache.get(tabId);
  if (cached) {
    setIcon(tabId, cached.isShopify);
    return;
  }
  // Otherwise detect
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url) detectShopify(tabId, tab.url);
  } catch { /* tab gone */ }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabCache.delete(tabId);
});

// ---------------------------------------------------------------------------
// Messages from the popup
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'getTabData') {
    handleGetTabData(msg.tabId).then(sendResponse);
    return true; // async
  }

  if (msg.type === 'fetchJson') {
    handleFetchJson(msg.url, msg.tabId).then(sendResponse);
    return true;
  }
});

async function handleGetTabData(tabId) {
  let cached = tabCache.get(tabId);

  // If cache miss or stale (>60 s), re-detect
  if (!cached || Date.now() - cached.ts > 60_000) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (tab.url) await detectShopify(tabId, tab.url);
      cached = tabCache.get(tabId);
    } catch { /* tab gone */ }
  }

  if (!cached) return { isShopify: false };

  return {
    isShopify: cached.isShopify,
    shopData: cached.shopData,
    url: cached.url,
  };
}

/**
 * Fetch JSON from a URL. If tabId is provided, fetch runs in that tab's context
 * so the request includes the user's cookies (required for /cart.json).
 */
async function handleFetchJson(url, tabId) {
  if (tabId) {
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: (fetchUrl) =>
          fetch(fetchUrl, { credentials: 'include' })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
        args: [url],
      });
      if (result?.result) return { data: result.result };
      if (result?.error) return { error: result.error.message };
    } catch (e) {
      return { error: e?.message || String(e) };
    }
  }

  try {
    const resp = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return { error: `HTTP ${resp.status}` };
    return { data: await resp.json() };
  } catch (e) {
    return { error: e.message };
  }
}
