// Save options to chrome.storage
const saveOptions = async () => {
  const likesChannelURL = document.getElementById("likesChannelURL").value;
  const likesChannelSplit = likesChannelURL.split("/");
  const likesChannelSlug = likesChannelSplit[likesChannelSplit.length - 1];

  const bookmarksChannelURL = document.getElementById(
    "bookmarksChannelURL"
  ).value;
  const bookmarksChannelSplit = bookmarksChannelURL.split("/");
  const bookmarksChannelSlug =
    bookmarksChannelSplit[bookmarksChannelSplit.length - 1];

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

    if (!likesInvalid && !bookmarksInvalid) {
      chrome.storage.sync.set(
        {
          likesChannelURL: likesChannelURL,
          bookmarksChannelURL: bookmarksChannelURL,
          likesChannelSlug: likesChannelSlug,
          bookmarksChannelSlug: bookmarksChannelSlug,
        },
        () => {
          status.style.color = "gray";
          if (bookmarksChannelURL == "" && likesChannelURL == "") {
            status.textContent =
              "Channels saved. Will not connect liked or bookmarked tweets.";
          } else if (bookmarksChannelURL == "") {
            status.textContent =
              "Channels saved. Will only connect liked tweets.";
          } else if (likesChannelURL == "") {
            status.textContent =
              "Channels saved. Will only connect bookmarked tweets.";
          } else {
            status.textContent = "Channels saved.";
          }
          setTimeout(() => {
            status.textContent = "";
          }, 3000);
        }
      );
    } else {
      status.style.color = "red";

      if (likesInvalid && bookmarksInvalid) {
        status.textContent = "Likes and bookmarks channel invalid.";
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
      document.getElementById("bookmarksChannelURL").value =
        items.bookmarksChannelURL;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);