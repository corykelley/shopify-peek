const themeUrl = document.querySelector('[data-theme-url]');
const themeName = document.querySelector('[data-theme-name]');
const themeId = document.querySelector('[data-theme-id]');
const storeLanguage = document.querySelector('[data-store-language]');
const storeCurrency = document.querySelector('[data-store-currency]');
const isPublished = document.querySelector('[data-published]');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	let msg = { txt: 'hello' };
	chrome.tabs.sendMessage(tab.id, msg, (response) => {
		const urlPathname = response.pathname;
		const url = `${response.shopUrl}${
			urlPathname ? urlPathname : ''
		}?preview_theme_id=${response.themeInfo.id}`;
		const published = response.themeInfo.role == 'published' ? true : false;

		themeUrl.innerHTML = url;
		themeName.innerHTML = response.themeInfo.name;
		themeId.innerHTML = response.themeInfo.id;
		storeLanguage.innerHTML = response.shopLanguage;
		storeCurrency.innerHTML = response.storeCurrency.active;
		isPublished.innerHTML = published;
	});
}

getCurrentTab();
