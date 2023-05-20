// Authenticate Are.na user and get OAuth2 access token
async function authenticate() {
  const ARENA = await fetch(chrome.runtime.getURL("config.json"))
    .then((response) => response.json())
    .then((config) => {
      const ARENA_CLIENT_ID = config.ARENA_CLIENT_ID;
      const ARENA_SECRET = config.ARENA_SECRET;
      return {
        clientID: ARENA_CLIENT_ID,
        secret: ARENA_SECRET,
      };
    });

  var CALLBACK_URL = chrome.identity.getRedirectURL();
  var AUTH_URL = `http://dev.are.na/oauth/authorize?client_id=${ARENA.clientID}&redirect_uri=${CALLBACK_URL}&response_type=code`;

  // Opens a window to initiate Are.na OAuth
  chrome.identity.launchWebAuthFlow(
    {
      url: AUTH_URL,
      interactive: true,
    },
    async function (redirectURL) {
      const [_, code] = redirectURL.split("=");
      const access_token_url = `https://dev.are.na/oauth/token?client_id=${ARENA.clientID}&client_secret=${ARENA.secret}&code=${code}&grant_type=authorization_code&redirect_uri=${CALLBACK_URL}`;

      try {
        await fetch(access_token_url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const access_token = data.access_token;
            console.log(access_token);
            chrome.storage.local.set({ authToken: access_token }, function () {
              console.log("Access token successfully saved to storage.");
            });
          });
      } catch (err) {
        console.log(err);
      }
    }
  );
}

// Check if access token already exists
chrome.storage.local.get(["authToken"], function (items) {
  const authToken = items.authToken;
  if (authToken == null) {
    authenticate();
  } else {
    console.log("Access token already exists:", authToken);
  }
});