import { pushSolution } from "../services/backendAPI.js";
import { getRepositories } from "../services/githubAPI.js";

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
    return true;
  }

  if (msg.type === "GET_REPOS") {
    getRepositories()
      .then((data) => {
        sendResponse({ success: true, data: Array.isArray(data) ? data : [] });
      })
      .catch((err) => {
        console.error("GET_REPOS failed:", err);
        sendResponse({ success: false, message: err.message, data: [] });
      });
    return true;
  }
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_TOKEN") {
    chrome.storage.local.set({ jwt: message.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status !== "complete" || !tab?.url) return;
  if (!/geeksforgeeks\.org/i.test(tab.url)) return;

  chrome.scripting
    .executeScript({
      target: { tabId, allFrames: true },
      files: ["dist/content.js"],
    })
    .catch(() => {});
});
