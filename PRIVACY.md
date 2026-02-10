# Privacy Policy — Shopify Peek

**Last updated:** February 10, 2026

## What Shopify Peek Does

Shopify Peek is a browser extension that detects Shopify-powered websites and displays store and theme information to the user. It is a developer tool designed for inspecting publicly available Shopify storefront data.

## Data Collection

Shopify Peek does **not** collect, store, or transmit any personal data. Specifically:

- No personal information is collected (name, email, address, etc.)
- No browsing history is recorded or transmitted
- No analytics, tracking, or telemetry of any kind is used
- No data is sent to any external server

## Data Access

To function, the extension reads the following from the active tab:

- The `window.Shopify` JavaScript object exposed by Shopify storefronts
- DOM elements referencing `cdn.shopify.com` (for headless store detection)
- The `/meta.json` endpoint on the current site (for headless store detection)
- Product and cart JSON endpoints when explicitly requested by the user

All data is read locally, displayed in the extension popup, and cached temporarily in browser memory for the current session. No data persists after the browser tab is closed.

## Permissions

- **activeTab / tabs** — Used to access the current tab's URL and detect Shopify stores.
- **scripting** — Used to read page-level JavaScript objects and DOM elements.
- **storage** — Used for local caching of detection results.
- **host_permissions (`<all_urls>`)** — Required to detect Shopify stores on any domain and fetch publicly available JSON endpoints.

## Third Parties

Shopify Peek does not share data with any third parties. There are no ads, analytics services, or external dependencies.

## Changes

If this policy is updated, changes will be reflected in this document with an updated date.

## Contact

For questions about this privacy policy, open an issue at [github.com/corykelley/shopify-peek](https://github.com/corykelley/shopify-peek).
