# Pidgin

Pidgin is a Chrome extension that automatically connects liked and/or bookmarked tweets to specified Are.na channels.

## How to use:

1. Download the extension from the Chrome Web Store [here](https://chrome.google.com/webstore/detail/pidgin/maikbdfilhceffcfpenbfcgohpgnjmem?hl=en&authuser=6)
2. Login to your Are.na account 
3. Provide the Are.na channel(s) that you want the tweets to connect to
4. You can leave one or both channel inputs blank if you don't wish to connect one or both types of tweets
5. The extension will now automatically connect tweets to the provided channels when you like / bookmark them

## Development:

```
git clone https://github.com/yihui-hu/pidgin.git
```

You will first need to create an Are.na application via [this link](https://dev.are.na/oauth/applications). Then, create a config.json file in the root directory, providing the client ID and secret of your newly created application:
```javascript
// config.json
{
    "ARENA_CLIENT_ID": "your_client_id",
    "ARENA_SECRET": "your_secret"
}
```

Then, enable development mode in chrome://extensions and drag and drop the folder into the browser window to use locally (ideal for testing, iterating or debugging).

One last thing: include the [redirect URI](https://stackoverflow.com/questions/34420459/what-redirect-url-can-i-set-for-oauth2-callback-in-a-chrome-extension) (i.e. https://\<extension-id\>.chromiumapp.org/) of the locally installed extension in the Are.na application's settings.

## Recommended workflow:

1. Create two Are.na channels, one for your likes and one for your bookmarks
2. Provide their URLs to the extension
3. Collect tweets 🐦
4. To further categorize and organize them, visit the channels on Are.na and connect them to your other channels where appropriate

For tweet hoarders like myself, I imagine that this workflow would be much faster and more convenient than having to sift through liked and bookmarked tweets on Twitter and connecting them one at a time.

## Resources:
- [Are.na authentication](https://dev.are.na/documentation/authentication)
- [Getting OAuth2 access tokens in a Chrome extension](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Setting redirect URI for a Chrome extension](https://stackoverflow.com/questions/34420459/what-redirect-url-can-i-set-for-oauth2-callback-in-a-chrome-extension)
- [Fetching blocked by CORS for a Chrome extension](https://stackoverflow.com/questions/64732755/access-to-fetch-has-been-blocked-by-cors-policy-chrome-extension-error)
- [Getting a tweet from its ID only](https://stackoverflow.com/a/68430741)
- [Capturing HTTP requests & responses](https://stackoverflow.com/questions/8939467/chrome-extension-to-read-http-response)
- [Getting response from an injected XMLHttpRequest script](https://gist.github.com/yihui-hu/43b4c5c45cb2b32cfc7d653a64c5742d)
- [Injecting an iframe into a page](https://stackoverflow.com/questions/24641592/injecting-iframe-into-page-with-restrictive-content-security-policy)
- [What does Pidgin mean?](https://en.wikipedia.org/wiki/Pidgin)