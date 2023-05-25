let response = { store: false };
let themeInfo = {};
let shopUrl = '';
let storeCurrency = 'USD';
let published = false;
let type = 'home';
let info = {};
const pathname = window.location.pathname || null;
const origin = window.location.origin;

const cleanInfo = (info) => {
	return JSON.parse(info.split(' = ')[1]);
};

const scripts = Array.from(document.getElementsByTagName('script'));
scripts.forEach((script) => {
	if (script.innerHTML.indexOf('Shopify.theme') !== -1) {
		const html = script.innerHTML.split(';');

		html.forEach((line) => {
			if (line.includes('Shopify.theme =')) {
				themeInfo = cleanInfo(line);
			} else if (line.includes('Shopify.shop =')) {
				shopUrl = cleanInfo(line);
			} else if (line.includes('Shopify.currency =')) {
				storeCurrency = cleanInfo(line);
			}
		});

		if (pathname.includes('products')) {
			type = 'product';
		} else if (pathname.includes('cart')) {
			type = 'cart';
		}

		fetch(`${window.location.href.split('?')[0]}.json`)
			.then((res) => res.json())
			.then((data) => (info = data));

		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (themeInfo) {
				response = {
					store: true,
					themeInfo: themeInfo,
					shopUrl: shopUrl,
					storeCurrency: storeCurrency,
					pathname: pathname,
					origin: origin,
					type: type,
					info: info,
				};
			}
			sendResponse(response);
		});
	}
});
