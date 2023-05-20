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

// Check if access token already exists
chrome.storage.sync.get(["authToken"], function (items) {
  const authToken = items.authToken;
  if (authToken == null) {
    authenticate();
  } else {
    console.log("Access token already exists:", authToken);
  }
});

// Save options to chrome.storage
const saveOptions = async () => {
  const likesChannelURL = document.getElementById("likesChannelURL").value;
  const likesChannelSplit = likesChannelURL.split("/");
  const likesChannelSlug = likesChannelSplit[likesChannelSplit.length - 1];

  const bookmarksChannelURL = document.getElementById("bookmarksChannelURL").value;
  const bookmarksChannelSplit = bookmarksChannelURL.split("/");
  const bookmarksChannelSlug = bookmarksChannelSplit[bookmarksChannelSplit.length - 1];

  const status = document.getElementById("status");

  chrome.storage.sync.get(["authToken"], async function (items) {
    const authToken = items.authToken;

    let likesInvalid = await fetch(
      `https://api.are.na/v2/channels/${likesChannelSlug}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => {
        return response.status != 200 ? true : false;
      })
      .catch((error) => {
        console.log(error);
        return true;
      });

    let bookmarksInvalid = await fetch(
      `https://api.are.na/v2/channels/${bookmarksChannelSlug}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => {
        return response.status != 200 ? true : false;
      })
      .catch((error) => {
        console.log(error);
        return true;
      });

    if (likesChannelURL == "") likesInvalid = false;
    if (bookmarksChannelURL == "") bookmarksInvalid = false;

    if (!likesInvalid && !bookmarksInvalid ) {
      chrome.storage.sync.set(
        {
          likesChannelURL: likesChannelURL,
          bookmarksChannelURL: bookmarksChannelURL,
          likesChannelSlug: likesChannelSlug,
          bookmarksChannelSlug: bookmarksChannelSlug,
        },
        () => {
          status.style.color = "gray";
          status.textContent = "Are.na channels saved.";
          setTimeout(() => {
            status.textContent = "";
          }, 2000);
        }
      );
    } else {
      status.style.color = "red";

      if (likesInvalid && bookmarksInvalid) {
        status.textContent = "Likes & bookmarks channel invalid.";
      } else if (likesInvalid) {
        status.textContent = "Likes channel invalid.";
      } else if (bookmarksInvalid) {
        status.textContent = "Bookmarks channel invalid.";
      }
    }
  });
};

// Restores options using preferences stored in chrome.storage
const restoreOptions = () => {
  chrome.storage.sync.get(
    { likesChannelURL: "", bookmarksChannelURL: "" },
    (items) => {
      document.getElementById("likesChannelURL").value = items.likesChannelURL;
      document.getElementById("bookmarksChannelURL").value = items.bookmarksChannelURL;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
