(function (xhr) {
  let XHR = XMLHttpRequest.prototype;

  let open = XHR.open;
  let send = XHR.send;
  let setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = new Date().toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function (postData) {
    this.addEventListener("load", async function () {
      if (postData) {
        // Get request headers
        if (typeof postData === "string") {
          this._requestHeaders = postData;
        }
      }

      try {
        // Get request payload
        if (
          this._url.endsWith("FavoriteTweet") ||
          this._url.endsWith("CreateBookmark")
        ) {
          const requestPayload = JSON.parse(this._requestHeaders);
          const tweetId = requestPayload.variables.tweet_id;

          // Dispatch custom event i.e. send tweetId back to inject.js
          const event = new CustomEvent("storeTweetId", {
            detail: { 
              tweetId: tweetId, 
              type: this._url.endsWith("FavoriteTweet") ? "favorite" : "bookmark"
            },
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error("Error parsing _requestHeaders.");
        console.error(err);
      }
    });

    return send.apply(this, arguments);
  };
})(XMLHttpRequest);
