// Background service worker for the KnowMyStatus extension
console.log('KnowMyStatus Teacher Extension - Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  switch (request.action) {
    case 'openDashboard':
      chrome.tabs.create({ 
        url: 'https://knowmystatus.vercel.app/teacher' 
      }).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error('Tab creation error:', error);
        sendResponse({ error: error.message });
      });
      break;
      
    case 'logout':
      chrome.storage.local.clear().then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error('Storage clear error:', error);
        sendResponse({ error: error.message });
      });
      break;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
  
  return true; // Will respond asynchronously
});

// Handle browser action clicks (if popup fails to load)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  chrome.tabs.create({ 
    url: 'https://knowmystatus.vercel.app/teacher' 
  }).catch((error) => {
    console.error('Tab creation error:', error);
  });
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.kms_teacher_token) {
    if (changes.kms_teacher_token.newValue) {
      console.log('User logged in');
    } else {
      console.log('User logged out');
    }
  }
});

console.log('Background script setup complete');
