import { getToken } from "../services/authAPI.js";
import { commitFileDirectly } from "../services/githubAPI.js";

// Handle messages from the content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PUSH_CODE") {
    handlePushCode(msg.payload)
      .then((res) => {
        sendResponse({ success: true, data: res });
      })
      .catch((err) => {
        console.error("Push failed:", err);
        sendResponse({ success: false, message: err.message });
      });
    return true; // indicate async reply
  }
});

async function handlePushCode(payload) {
  const {
    code,
    repositoryName, // Format: "owner/repo"
    problemName,
    difficulty,
    language,
  } = payload;

  const token = await getToken();
  if (!token) {
    throw new Error("Please configure your GitHub token in the extension popup first.");
  }

  if (!repositoryName) {
    throw new Error("Please select a repository in the extension popup first.");
  }

  const [owner, repo] = repositoryName.split("/");
  if (!owner || !repo) {
    throw new Error("Invalid repository selected.");
  }

  // Create folder structure (e.g. "Easy", "Medium", "Hard")
  const folder = difficulty || "Easy";

  const extensionMap = {
    cpp: "cpp",
    javascript: "js",
    python: "py",
    java: "java",
  };

  const ext = extensionMap[language] || "txt";

  const safeProblemName = problemName
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "_");

  const filePath = `${folder}/${safeProblemName}.${ext}`;
  const commitMessage = `Add Solution for ${problemName}`;

  return await commitFileDirectly(token, owner, repo, filePath, code, commitMessage);
}
