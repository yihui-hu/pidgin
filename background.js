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

  let CALLBACK_URL = chrome.identity.getRedirectURL();
  let AUTH_URL = `http://dev.are.na/oauth/authorize?client_id=${ARENA.clientID}&redirect_uri=${CALLBACK_URL}&response_type=code`;

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
            chrome.storage.sync.set({ authToken: access_token }, function () {
              console.log("Access token successfully saved to storage.");
            });
          });
      } catch (err) {
        console.log(err);
      }
    }
  );
}

// Handle the extension icon click event
chrome.action.onClicked.addListener(async (tab) => {
  // Check if access token already exists
  chrome.storage.sync.get(["authToken"], async function (items) {
    const authToken = items.authToken;
    if (authToken == null) {
      authenticate();
    } else {
      // Check if iframe exists
      await chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          function: iframeExists,
        })
        .then(async (response) => {
          // If iframe exists, toggle between hiding / showing
          if (response[0].result) {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              function: toggleiframe,
            });
          } else {
            // Create iframe and inject into page
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              function: injectiframe,
            });
          }
        });
    }
  });
});

async function iframeExists() {
  const iframe = document.getElementById("pidgin-iframe");
  return iframe !== null ? true : false;
}

async function injectiframe() {
  let iframe = document.createElement("iframe");
  iframe.id = "pidgin-iframe";
  iframe.style.display = "block";
  iframe.src = await chrome.runtime.getURL("frame.html");
  document.body.appendChild(iframe);
}

async function toggleiframe() {
  const display = document.getElementById("pidgin-iframe").style.display;
  document.getElementById("pidgin-iframe").style.display = display == "block" ? "none" : "block";
}