# Shopify Peek

Shopify Peek is a Chrome extension that detects Shopify-powered websites and exposes useful store, theme, product, and cart information — all with a single click.

## Features

- **Automatic detection** — The extension icon lights up (neon) when the current page is a Shopify store, and stays gray otherwise. Detection uses `window.Shopify` (via the page's JavaScript context) with a `/meta.json` fallback for headless/Hydrogen storefronts.
- **Theme info** — Theme URL (with preview ID), theme name, theme ID, and active store currency.
- **Product info** — On product pages, view title, ID, tags, variants (with price/SKU), and images.
- **Cart info** — On cart pages, view total price, item count, line items (with price/quantity/SKU/URL), and cart attributes.
- **Helpful links** — Quick access to Shopify Dev Docs, App Docs, Storefront Docs, Marketplace Docs, and the Shopify Cheat Sheet.

## How To Install

1. Download or clone this repository.
2. Go to `chrome://extensions` in your browser.
3. Enable **Developer mode** (toggle in the top-right).
4. Click **Load unpacked** and select this folder.
5. The **Shopify Peek** extension will appear in your toolbar.

## Development

```bash
# Install dependencies
npm install

# Build CSS (one-time)
npm run build:css

# Watch CSS for changes during development
npm run watch:css
```

## Architecture

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome MV3 manifest — permissions, service worker, popup, icons |
| `service-worker.js` | Background service worker — detection (MAIN world + /meta.json), per-tab caching, icon state |
| `popup.js` | Popup script — reads cached data from service worker, renders UI |
| `index.html` | Popup HTML layout |
| `tailwind.css` | Tailwind source + custom retro utilities |
| `tailwind.config.js` | Tailwind config with retro 80s color palette |
| `style.css` | Compiled CSS output (generated — do not edit directly) |
| `icons/` | Gray (inactive) and neon (active) toolbar icons |

## Information Displayed

### All Shopify Pages
- Theme URL (with `preview_theme_id`)
- Theme Name
- Theme ID
- Store Currency

### Product Pages
Click **Product Info** to reveal:
- Title, ID, Tags
- Variants (title, ID, price, compare-at price, SKU)
- Images (thumbnail, ID, alt text)

### Cart Pages
Click **Cart Info** to reveal:
- Total Price, Item Count
- Items (title, ID, price, quantity, SKU, URL)
- Cart Attributes

## Intended Use

Shopify Peek was developed with QA in mind, but is useful for developers, designers, and anyone working with Shopify stores. Feedback is welcome!

&copy; 2026 Cory Kelley
