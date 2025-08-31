// Simple background service worker for KnowMyStatus extension
console.log('KnowMyStatus Teacher Extension - Background script started');

// Basic installation handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  if (request.action === 'openDashboard') {
    chrome.tabs.create({ 
      url: 'https://knowmystatus.vercel.app/teacher' 
    });
    sendResponse({ success: true });
  } else if (request.action === 'logout') {
    chrome.storage.local.clear();
    sendResponse({ success: true });
  } else {
    sendResponse({ error: 'Unknown action' });
  }
  
  return true;
});

// Handle extension icon clicks (fallback)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked - opening dashboard');
  chrome.tabs.create({ 
    url: 'https://knowmystatus.vercel.app/teacher' 
  });
});

console.log('Background script setup complete');
