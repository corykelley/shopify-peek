let themeInfo = '';
let shopUrl = '';
let shopLocation = 'en';
let storeCurrency = 'USD';
let published = false;
const pathname = window.location.pathname || null;

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
			} else if (line.includes('Shopify.locale =')) {
				shopLanguage = cleanInfo(line);
			} else if (line.includes('Shopify.currency =')) {
				storeCurrency = cleanInfo(line);
			}
		});
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	sendResponse({
		themeInfo: themeInfo,
		shopUrl: shopUrl,
		shopLanguage: shopLanguage,
		storeCurrency: storeCurrency,
		pathname: pathname,
	});
});
