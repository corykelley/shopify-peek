# Shopify Peek
Shopify Peek is a helpful extension for exposing useful information about the current Shopify store your viewing.

## How To Install (if not using Google Chrome extension browser)
- Download the entire repository.
    - Click the green `<> Code` button, select `Download Zip`.
- Once files are downloaded and unzipped, go to [chrome://extensions](chrome://extensions) in your browser > toggle on developer mode > click `load unpacked` > upload the entire folder. After that you should have the new `Shopify Peek` extension in your browser's extensions.
- Visit any Shopify theme and click on the extension in your browser.

## Information
### Non Product or Cart Pages
Shopify Peek can show useful information such as:
- Theme Url: page url with specific theme id appended. This makes it easy to copy the url for the current page and ensure that the url links a user to not only the correct Shopify page, but also the correct theme. ex. `
https://usbns.myshopify.com/?preview_theme_id=122813677656`
- Theme Name: ex. `Testing | eHouse`
- Theme Id: ex. `122813677656`
- Store Currency: `USD`

### Product Page
If on a product page, Shopify Peek will allow a user to reveal product information by clicking the `See Product Info` button (button will be disabled if not). Product data exposed includes:
- Title
- Id
- Tags
- Variants (with appropriate variant information)
- Images (with id and alt information)
### Cart Page
If on a cart page, Shopify Peek will allow a user to reveal cart information by clicking the `See Cart Info` button (button will be disabled if not). Cart data exposed includes:
- Total Cart Price
- Item Count
- Items (list of items with appropriate item information)
- Any attributes

## Intended Use
Shopify Peek was developed with QA in mind, but can be helpful for everyone. Shopify Peek is still a work in progress. It can, will, and should be improved, and new features will be added as need arises!

`FEEDBACK IS WELCOMED!`

