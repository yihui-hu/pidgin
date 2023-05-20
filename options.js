// Saves options to chrome.storage
const saveOptions = () => {
    const likesChannel = document.getElementById('likesChannel').value;
    const bookmarksChannel = document.getElementById('bookmarksChannel').value;
  
    chrome.storage.sync.set(
      { likesChannel: likesChannel, 
        bookmarksChannel: bookmarksChannel },
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Are.na channels saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { likesChannel: '', bookmarksChannel: '' },
      (items) => {
        document.getElementById('likesChannel').value = items.likesChannel;
        document.getElementById('bookmarksChannel').value = items.bookmarksChannel;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);