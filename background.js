const themeUrl = document.querySelector('[data-theme-url]');
const themeName = document.querySelector('[data-theme-name]');
const themeId = document.querySelector('[data-theme-id]');
const storeCurrency = document.querySelector('[data-store-currency]');
const notAStoreContainer = document.querySelector('.not-a-shop');
const storeContentContainer = document.querySelector('.shop-info');
const productInfoBtn = document.querySelector('[data-product-info-btn]');
const cartInfoBtn = document.querySelector('[data-cart-info-btn]');

const handleInfoButtons = (info) => {
	if (info) {
		productInfoBtn.addEventListener('click', () => {
			const html = `

      `;
			storeContentContainer.innerHTML = info.product.title;
		});
	}
};

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

			console.log(response);
			switch (response.type) {
				case 'product':
					productInfoBtn.disabled = false;
					productInfoBtn.classList.remove('disabled');
					handleInfoButtons(response.info);
					break;
				case 'cart':
					cartInfoBtn.disabled = false;
					cartInfoBtn.classList.remove('disabled');
					handleInfoButtons(response.info);
					break;
			}

			storeContentContainer.classList.remove('hidden');
			notAStoreContainer.classList.add('hidden');
		}
	});
}

getCurrentTab();
