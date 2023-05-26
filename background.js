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

const convertPrice = (price) => {
	let converted = (price / 100).toFixed(2) * 1;
	return `$${converted}`;
};

const toggleBtnState = (type) => {
	if (type == 'product') {
		productInfoBtn.disabled = false;
		productInfoBtn.classList.remove('!cursor-not-allowed');
	} else if (type == 'cart') {
		cartInfoBtn.disabled = false;
		cartInfoBtn.classList.remove('!cursor-not-allowed');
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
			let variantHtml = `<li><h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Variants:</span></h4><ul>`;
			let imageHtml = `<li><h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Images:</span></h4><ul>`;

			if (info.product.variants.length) {
				info.product.variants.forEach((variant) => {
					variantHtml += `
            <li class="mb-3 pl-1">
            <ul>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">Title: </span>${variant.title}</li>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">Id: </span>${variant.id}</li>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">Price: </span>$${
									variant.price
								}</li>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">Compare At Price: </span>$${
									variant.compare_at_price ? variant.compare_at_price : 0
								}</li>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">sku: </span>${variant.sku}</li>
            </ul>
            </li>
          `;
				});

				variantHtml += `</ul></li>`;
			}

			if (info.product.images.length) {
				info.product.images.forEach((image) => {
					imageHtml += `
            <li class="mb-3 pl-1">
            <ul>
              <li class="text-s pl-1 tracking-wide">
                <img class="rounded-md border border-slate-200 mb-2" loading="lazy" alt="${image.alt}" src="${image.src}" />
              </li>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">Id: </span>${image.id}</li>
              <li class="text-s pl-1 tracking-wide">
                <span class="mr-1 lowercase">Alt: </span>${image.alt}</li>
            </ul>
            </li>
          `;
				});

				imageHtml += `</ul></li>`;
			}

			html += `
        <ul>
          <li class="mb-3">
            <h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Title:</span></h4>
            <p class="text-base pl-1">${info.product.title}</p>
          </li>
          <li class="mb-3">
            <h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Id:</span></h4>
            <p class="text-base pl-1">${info.product.id}</p>
          </li>
          <li class="mb-3">
            <h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Tags:</span></h4>
            <p class="text-base pl-1">${info.product.tags}</p>
          </li>
          ${info.product.variants.length && variantHtml}
          ${info.product.images.length && imageHtml}
        </ul>
        `;

			productCartInfoContainer.innerHTML = html;
			storeContentContainer.classList.add('hidden');
			productCartInfoContainer.classList.remove('hidden');
		});
	} else {
		cartInfoBtn.addEventListener('click', () => {
			showHideBtns(false);
			let itemsHtml = `<li class="mb-3"><h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Items:</span></h4><ul>`;
			let attHtml = `<li class="mb-3"><h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Attributes:</span></h4><ul>`;

			if (info.items.length) {
				info.items.forEach((item) => {
					itemsHtml += `
            <li class="mb-3 pl-1">
              <ul>
                <li class="text-s pl-1 tracking-wide">
                  <span class="mr-1 lowercase">Title: </span>${item.title}</li>
                <li class="text-s pl-1 tracking-wide">
                  <span class="mr-1 lowercase">Id: </span>${item.id}</li>
                <li class="text-s pl-1 tracking-wide">
                  <span class="mr-1 lowercase">Price: </span>${convertPrice(
										item.price
									)}</li>
                <li class="text-s pl-1 tracking-wide">
                  <span class="mr-1 lowercase">Quantity: </span>${
										item.quantity
									}</li>
                <li class="text-s pl-1 tracking-wide">
                  <span class="mr-1 lowercase">SKU: </span>${item.sku}</li>
                <li class="text-s pl-1 tracking-wide">
                  <span class="mr-1 lowercase">URL: </span><a href=${
										origin + item.url
									} target="_blank">${origin + item.url}</a></li>
              </ul>
            </li>
          `;
				});
				itemsHtml += `</ul></li>`;
			}

			if (info.attributes) {
				for (const prop in info.attributes) {
					attHtml += `
            <li class="mb-3">
              <p class="text-s pl-1">${prop}: ${info.attributes[prop]}</p>
            </li>
          `;
				}

				attHtml += `</ul></li>`;
			}

			html += `
        <ul>
          <li class="mb-3">
            <h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Total Price:</span></h4>
            <p class="text-base pl-1">${convertPrice(info.total_price)}</p>
          </li>
          <li class="mb-3">
            <h4 class="font-mono font-light text-xs bg-slate-800 p-1 w-fit"><span class="text-blue-200 lowercase">Item Count:</span></h4>
            <p class="text-base pl-1">${info.item_count}</p>
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
