/*
 *  This file injects a script to the DOM that handles the capturing and
 *  intercepting of requests and responses.
 *
 */

// Inject script.js into the DOM
let script = document.createElement("script");
script.src = chrome.runtime.getURL("script.js");
script.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for custom event dispatched from injected script.js
document.addEventListener("storeTweetId", function (event) {
  const type = event.detail.type;
  const tweetId = event.detail.tweetId;
  const tweetURL = `https://twitter.com/i/web/status/${tweetId}`

  chrome.storage.sync.get(["authToken", "likesChannelSlug", "bookmarksChannelSlug"], function (items) {
    const authToken = items.authToken;

    if (authToken == null) {
      console.error("Haven't set up Are.na account.");
    } else {
      const LIKES_CHANNEL_SLUG = items.likesChannelSlug ?? "";
      const BOOKMARKS_CHANNEL_SLUG = items.bookmarksChannelSlug ?? "";
      const postToArenaURL = `https://api.are.na/v2/channels/${type == "favorite" ? LIKES_CHANNEL_SLUG : BOOKMARKS_CHANNEL_SLUG}/blocks?source=${tweetURL}`

      try {
        fetch(postToArenaURL, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          }
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
      } catch (err) {
        console.log("Error posting tweet to Are.na channel.")
        console.log(err);
      }
    }
  });
});