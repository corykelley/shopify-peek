const themeUrl = document.querySelector('[data-theme-url]');
const themeName = document.querySelector('[data-theme-name]');
const themeId = document.querySelector('[data-theme-id]');
const storeCurrency = document.querySelector('[data-store-currency]');
const notAStoreContainer = document.querySelector('.not-a-shop');
const storeContentContainer = document.querySelector('.shop-info');
const productCartInfoContainer = document.querySelector('.product-cart-info');
const productInfoBtn = document.querySelector('[data-product-info-btn]');
const cartInfoBtn = document.querySelector('[data-cart-info-btn]');
const backBtn = document.querySelector('[data-back-btn]');

const toggleBtnState = (type) => {
	if (type == 'product') {
		productInfoBtn.disabled = false;
		productInfoBtn.classList.remove('disabled');
	} else if (type == 'cart') {
		cartInfoBtn.disabled = false;
		cartInfoBtn.classList.remove('disabled');
	}
};

const showHideBtns = (index = true) => {
	if (index) {
		productInfoBtn.classList.remove('hidden');
		cartInfoBtn.classList.remove('hidden');
		backBtn.classList.add('hidden');
	} else {
		productInfoBtn.classList.add('hidden');
		cartInfoBtn.classList.add('hidden');
		backBtn.classList.remove('hidden');
	}
};

const handleInfoButtons = (type, info, origin) => {
	let html = ``;

	if (type == 'product') {
		productInfoBtn.addEventListener('click', () => {
			showHideBtns(false);
			let variantHtml = `<li><h4>Variants:</h4><ul>`;

			if (info.product.variants.length) {
				info.product.variants.forEach((variant) => {
					variantHtml += `
            <li>
              <p>Title: ${variant.title}</p>
              <p>Id: ${variant.id}</p>
              <p>Price: ${variant.price}</p>
              <p>SKU: ${variant.sku}</p>
            </li>
          `;
				});

				variantHtml += `</ul></li>`;
			}

			html += `
        <ul>
          <li>
            <h4>Title:</h4>
            <p>${info.product.title}</p>
          </li>
          <li>
            <h4>Id:</h4>
            <p>${info.product.id}</p>
          </li>
          <li>
            <h4>Tags:</h4>
            <p>${info.product.tags}</p>
          </li>
          ${info.product.variants.length && variantHtml}
        </ul>
        `;

			productCartInfoContainer.innerHTML = html;
			storeContentContainer.classList.add('hidden');
			productCartInfoContainer.classList.remove('hidden');
		});
	} else {
		cartInfoBtn.addEventListener('click', () => {
			showHideBtns(false);
			let itemsHtml = `<li><h4>Items:</h4><ul>`;
			let attHtml = `<li><h4>Attributes:</h4><ul>`;

			if (info.items.length) {
				info.items.forEach((item) => {
					itemsHtml += `
            <li>
              <p>Title: ${item.title}</p>
              <p>Id: ${item.id}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: ${item.quantity}</p>
              <p>SKU: ${item.sku}</p>
              <p>URL: <a href=${origin + item.url} target="_blank">${
						origin + item.url
					}</a></p>
            </li>
          `;
				});
				itemsHtml += `</ul></li>`;
			}

			if (info.attributes) {
				for (const prop in info.attributes) {
					attHtml += `
            <li>
              <p>${prop}: ${info.attributes[prop]}</p>
            </li>
          `;
				}

				attHtml += `</ul></li>`;
			}

			html += `
        <ul>
          <li>
            <h4>Total Price:</h4>
            <p>${info.total_price}</p>
          </li>
          <li>
            <h4>Item Count:</h4>
            <p>${info.item_count}</p>
          </li>
          ${info.items && itemsHtml}
          ${info.attributes && attHtml}
        </ul>
        `;

			productCartInfoContainer.innerHTML = html;
			storeContentContainer.classList.add('hidden');
			productCartInfoContainer.classList.remove('hidden');
		});
	}
};

async function getCurrentTab(id) {
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	let msg = { txt: 'hello' };
	let tabId = id ? parseInt(id) : tab.id;
	localStorage.setItem('tabId', tabId);

	chrome.tabs.sendMessage(tabId, msg, (response) => {
		if (response.store) {
			const urlPathname = response.pathname;
			const url = `https://${response.shopUrl}${
				urlPathname ? urlPathname : ''
			}?preview_theme_id=${response.themeInfo.id}`;

			themeUrl.innerHTML = url;
			themeName.innerHTML = response.themeInfo.name;
			themeId.innerHTML = response.themeInfo.id;
			storeCurrency.innerHTML = response.storeCurrency.active;

			switch (response.type) {
				case 'product':
					if (response.info) {
						showHideBtns(true);
						toggleBtnState(response.type);
						handleInfoButtons(response.type, response.info, response.origin);
						backBtn.addEventListener('click', () => {
							getCurrentTab(localStorage.tabId);
							productCartInfoContainer.classList.add('hidden');
							storeContentContainer.classList.remove('hidden');
						});
					}
					break;
				case 'cart':
					if (response.info) {
						showHideBtns(true);
						toggleBtnState(response.type);
						handleInfoButtons(response.type, response.info, response.origin);
						backBtn.addEventListener('click', () => {
							getCurrentTab(localStorage.tabId);
							productCartInfoContainer.classList.add('hidden');
							storeContentContainer.classList.remove('hidden');
						});
					}
					break;
			}

			storeContentContainer.classList.remove('hidden');
			notAStoreContainer.classList.add('hidden');
		}
	});
}

getCurrentTab();
