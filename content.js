/**
 * Shopify Peek – Content Script (intentionally minimal)
 *
 * Detection and data fetching have been moved to the service worker
 * which uses chrome.scripting.executeScript({ world: "MAIN" }) and
 * direct fetch() calls respectively.
 *
 * This file is kept only as a placeholder if future features require
 * content-script-level DOM access. It performs no work on page load.
 */
