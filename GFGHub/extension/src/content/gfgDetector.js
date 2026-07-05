console.log("🚀 GFGHub content script loaded1");

import { getRepositories } from "../services/githubAPI.js";

const REPO_SELECT_ID = "gfghub-repo-select";
const BUTTON_ID = "gfghub-push-btn";
const CONTAINER_ID = "gfghub-floating-container";

async function getSavedRepositoryId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["savedRepoId"], (result) => {
      resolve(result.savedRepoId || "");
    });
  });
}
console.log("🚀 GFGHub content script loaded 2");
async function saveRepositoryId(id) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ savedRepoId: id }, () => {
      resolve();
    });
  });
}

async function createRepoDropdown(container) {
  const select = document.createElement("select");
  select.id = REPO_SELECT_ID;
  select.style.padding = "10px";
  select.style.borderRadius = "8px";
  select.style.border = "1px solid #d1d5db";
  select.style.fontSize = "14px";
  select.style.marginRight = "10px";
  select.style.minWidth = "220px";
  select.style.background = "#fff";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select repository";
  select.appendChild(defaultOption);

  try {
    const repos = await getRepositories();
    const savedRepoId = await getSavedRepositoryId();

    console.log("GFGHub repos response:", repos);

    repos.forEach((repo) => {
      const option = document.createElement("option");
      option.value = repo._id;
      option.textContent = repo.repoName;
      select.appendChild(option);
    });

    if (savedRepoId) {
      select.value = savedRepoId;
    }

    select.addEventListener("change", async () => {
      await saveRepositoryId(select.value);
    });
  } catch (err) {
    console.error("Failed to load repositories:", err);
  }

  container.appendChild(select);
  return select;
}
console.log("🚀 GFGHub content script loaded3");
function createPushButton(container) {
  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.textContent = "Push to GitHub";
  btn.style.padding = "10px 15px";
  btn.style.background = "#2563EB";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "600";

  btn.addEventListener("click", async () => {
    try {
      const repositoryId = document.getElementById(REPO_SELECT_ID)?.value;
      if (!repositoryId) {
        alert("Please select a repository first.");
        return;
      }

      console.log("GFGHub: extracting code...");
      const code = await getCurrentCode();
      console.log("GFGHub extracted code:", code);

      if (!code || !code.trim()) {
        alert("Could not extract code from the editor.");
        return;
      }

      const problemName = extractProblemName();
      const difficulty = extractDifficulty();
      const language = extractLanguage();
      const problemUrl = location.href;

      const payload = {
        code,
        repositoryId,
        problemName,
        difficulty,
        language,
        topic: ["GeeksForGeeks"],
        problemUrl,
      };

      console.log("GFGHub push payload:", payload);

      chrome.runtime.sendMessage(
        {
          type: "PUSH_CODE",
          payload,
        },
        (response) => {
          console.log("GFGHub background response:", response);

          if (chrome.runtime.lastError) {
            console.error("Runtime message error:", chrome.runtime.lastError);
            alert("Failed to talk to extension background script.");
            return;
          }

          if (!response) {
            alert("No response from extension background.");
            return;
          }

          if (response.success) {
            alert("Solution pushed successfully!");
          } else {
            alert(response.message || "Push failed.");
          }
        }
      );
    } catch (err) {
      console.error("Push button error:", err);
      alert("Push failed. Check console for details.");
    }
  });

  container.appendChild(btn);
}

/* ---------------------------
   Problem metadata extractors
---------------------------- */

function extractProblemName() {
  try {
    // 1. Try to get the name from page headings first (most accurate)
    const headingSelectors = [
      "div[class^='problems_header_content'] h3",
      ".problem-statement h3",
      ".problem-tab__name",
      "div[class^='problem_heading']",
      "h3[class^='problem_heading']",
      "div[class*='ProblemName']",
      "h1"
    ];

    for (let sel of headingSelectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.trim()) {
        return el.innerText.trim();
      }
    }

    // 2. Try document title
    if (document.title) {
      const titleMatch = document.title.split(/\||-/)[0].trim();
      if (titleMatch && !titleMatch.toLowerCase().includes("geeksforgeeks") && !titleMatch.toLowerCase().includes("practice")) {
        return titleMatch;
      }
    }

    // 3. Fallback: from URL slug
    // Example: /problems/reverse-a-linked-list/1 or /problems/key-pair5616/1
    const parts = location.pathname.split("/");
    const slugIndex = parts.indexOf("problems") + 1;

    if (slugIndex > 0 && parts[slugIndex]) {
      let slug = parts[slugIndex];
      // Remove trailing digits with or without hyphen (e.g., -1587115621 or 5616)
      slug = slug.replace(/-?\d+$/, "");
      
      return slug
        .split("-")
        .filter(word => word.length > 0)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

  } catch (e) {
    console.error("extractProblemName error:", e);
  }

  return "Untitled Problem";
}

function extractDifficulty() {
  try {
    const text = document.body.innerText;

    if (/hard/i.test(text)) return "Hard";
    if (/medium/i.test(text)) return "Medium";
    if (/easy/i.test(text)) return "Easy";
  } catch (e) {
    console.error("extractDifficulty error:", e);
  }

  return "Easy";
}

function extractLanguage() {
  try {
    // Try active language label / selected tab / button text
    const selectors = [
      '[class*="language"]',
      '[class*="lang"]',
      'button[aria-selected="true"]',
      '.tabs__tab.active',
      '.selected',
    ];

    for (const sel of selectors) {
      const nodes = document.querySelectorAll(sel);
      for (const node of nodes) {
        const txt = node.innerText?.trim()?.toLowerCase();
        if (!txt) continue;

        if (txt.includes("c++")) return "cpp";
        if (txt.includes("java")) return "java";
        if (txt.includes("python")) return "python";
        if (txt.includes("javascript")) return "javascript";
        if (txt.includes("js")) return "javascript";
      }
    }
  } catch (e) {
    console.error("extractLanguage error:", e);
  }

  return "javascript";
}

/* ---------------------------
   Strong code extractor
---------------------------- */

function getCurrentCode() {
  return new Promise((resolve) => {
    const listener = (event) => {
      if (event.source === window && event.data?.type === "GFG_CODE_RESPONSE") {
        window.removeEventListener("message", listener);
        resolve(event.data.code || "");
      }
    };

    window.addEventListener("message", listener);

    window.postMessage({ type: "GFG_CODE_REQUEST" }, "*");

    setTimeout(() => {
      window.removeEventListener("message", listener);
      resolve("");
    }, 2500);
  });
}

/* ---------------------------
   UI bootstrap
---------------------------- */

function mountUI() {
  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "999999";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "10px";
  container.style.background = "#ffffff";
  container.style.padding = "12px";
  container.style.borderRadius = "10px";
  container.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";

  createRepoDropdown(container).then(() => {
    createPushButton(container);
  });

  document.body.appendChild(container);
}

function initWhenReady() {
  // Check if we are on the frontend website (Vercel or localhost)
  if (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("localhost")
  ) {
    if (window.location.pathname.startsWith("/auth-success")) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        chrome.storage.local.set({ jwt: token }, () => {
          console.log("GFGHub: Token saved successfully from auth-success page.");
        });
      }
    }
    return; // Exit early — not a GFG problem page
  }

  // Only activate on GFG problem pages
  if (!window.location.pathname.includes("/problems/")) {
    return;
  }

  // Wait for the success message to appear before mounting the UI
  const checkSuccess = () => {
    if (document.getElementById(CONTAINER_ID)) return; // Already mounted

    const text = document.body.innerText || "";
    // Common GFG success texts
    if (
      text.includes("Problem Solved Successfully") ||
      text.includes("Correct Answer") ||
      text.includes("Attempt Successful")
    ) {
      mountUI();
    }
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(checkSuccess, 2000);
    });
  } else {
    setInterval(checkSuccess, 2000);
  }
}

initWhenReady();