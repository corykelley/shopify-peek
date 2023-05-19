const themeUrl = document.querySelector('[data-theme-url]');
const themeName = document.querySelector('[data-theme-name]');
const themeId = document.querySelector('[data-theme-id]');
const storeCurrency = document.querySelector('[data-store-currency]');
const notAStoreContainer = document.querySelector('.not-a-shop');
const storeContentContainer = document.querySelector('.shop-info');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	let msg = { txt: 'hello' };

	chrome.tabs.sendMessage(tab.id, msg, (response) => {
		if (response.store) {
			const urlPathname = response.pathname;
			const url = `https://${response.shopUrl}${
				urlPathname ? urlPathname : ''
			}?preview_theme_id=${response.themeInfo.id}`;

			themeUrl.innerHTML = url;
			themeName.innerHTML = response.themeInfo.name;
			themeId.innerHTML = response.themeInfo.id;
			storeCurrency.innerHTML = response.storeCurrency.active;

			storeContentContainer.classList.remove('hidden');
			notAStoreContainer.classList.add('hidden');
		}
	});
}

getCurrentTab();
