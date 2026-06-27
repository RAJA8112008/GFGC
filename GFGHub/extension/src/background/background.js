import { pushSolution } from "../services/backendAPI.js";

// Handle messages from the content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PUSH_CODE") {
    pushSolution(msg.payload)
      .then((res) => {
        console.log("Push success:", res);
        sendResponse({ success: true, data: res });
      })
      .catch((err) => {
        console.error("Push failed:", err);
        sendResponse({ success: false, message: err.message });
      });
    return true; // indicate async reply
  }
});

// Handle messages from the external website (localhost:5173/5174)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_TOKEN") {
    chrome.storage.local.set({ jwt: message.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
