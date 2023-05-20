# Pidgin

Pidgin is a Chrome extension that automatically saves liked / bookmarked tweets to specified Are.na channels.

## How to use:

1. Download the extension on the Chrome extension store [here](https://google.com)
2. Click on the extension in the toolbar and login to your Are.na account
3. Provide the Are.na channel(s) that you want your liked / bookmarked tweets to save to
4. The extension will now automatically save tweets to those channels when you like / bookmark them

## Development:

```
git clone https://github.com/yihui-hu/pidgin.git
```

## Recommended workflow:

1. Create two Are.na channels, one for your likes and one for your bookmarks
2. Collect tweets
3. For organizing them, visit the channels on Are.na and connect them to the appropriate channels

This workflow, I imagine, would be much faster and more convenient than having to sift through your likes and bookmarks on Twitter and connecting them one at a time.

## Resources:
- [Are.na authentication](https://dev.are.na/documentation/authentication)
- [Getting OAuth2 access tokens in a Chrome extension](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Fetching blocked by CORS for Chrome extension](https://stackoverflow.com/questions/64732755/access-to-fetch-has-been-blocked-by-cors-policy-chrome-extension-error)
- [Getting a tweet from its ID only](https://stackoverflow.com/a/68430741)
- [Capturing HTTP requests & responses](https://stackoverflow.com/questions/8939467/chrome-extension-to-read-http-response)
- [Getting response from an injected XMLHttpRequest script](https://gist.github.com/yihui-hu/43b4c5c45cb2b32cfc7d653a64c5742d)
- [What does Pidgin mean?](https://en.wikipedia.org/wiki/Pidgin)