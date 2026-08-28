console.log("🚀 GFGHub content script loaded1");

const REPO_SELECT_ID = "gfghub-repo-select";
const BUTTON_ID = "gfghub-push-btn";
const CONTAINER_ID = "gfghub-floating-container";

let selectedRepoId = "";
let repoList = [];

function sendToBackground(message, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    if (!chrome.runtime?.id) {
      reject(new Error("Extension runtime unavailable"));
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error("Timed out loading repositories"));
    }, timeoutMs);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

async function getSavedRepositoryId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["savedRepoId"], (result) => {
      resolve(result.savedRepoId || "");
    });
  });
}

async function saveRepositoryId(id) {
  selectedRepoId = id;
  return new Promise((resolve) => {
    chrome.storage.local.set({ savedRepoId: id }, () => resolve());
  });
}

async function loadRepositories() {
  const savedRepoId = await getSavedRepositoryId();
  selectedRepoId = savedRepoId;

  const response = await sendToBackground({ type: "GET_REPOS" });
  repoList = Array.isArray(response?.data) ? response.data : [];

  if (!response?.success) {
    throw new Error(response?.message || "Failed to load repositories");
  }

  return repoList;
}

function styleSelect(select) {
  select.style.padding = "8px 10px";
  select.style.borderRadius = "8px";
  select.style.border = "1px solid #d1d5db";
  select.style.fontSize = "13px";
  select.style.minWidth = "200px";
  select.style.maxWidth = "260px";
  select.style.background = "#fff";
  select.style.color = "#111827";
  select.style.appearance = "auto";
  select.style.display = "inline-block";
  select.style.visibility = "visible";
  select.style.opacity = "1";
  select.style.height = "auto";
  select.style.zIndex = "2147483647";
}

function fillRepoSelect(select, repos, savedRepoId) {
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = repos.length ? "Select repository" : "No repositories found";
  select.appendChild(defaultOption);

  repos.forEach((repo) => {
    const option = document.createElement("option");
    option.value = repo._id;
    option.textContent = repo.repoName || repo.name || "Repository";
    select.appendChild(option);
  });

  if (savedRepoId && repos.some((repo) => repo._id === savedRepoId)) {
    select.value = savedRepoId;
    selectedRepoId = savedRepoId;
  }
}

async function createRepoDropdown(container) {
  const select = document.createElement("select");
  select.id = REPO_SELECT_ID;
  styleSelect(select);

  const loadingOption = document.createElement("option");
  loadingOption.value = "";
  loadingOption.textContent = "Loading repositories...";
  select.appendChild(loadingOption);

  select.addEventListener("change", async () => {
    await saveRepositoryId(select.value);
  });

  const button = container.querySelector(`#${BUTTON_ID}`);
  if (button) {
    container.insertBefore(select, button);
  } else {
    container.appendChild(select);
  }

  try {
    const repos = await loadRepositories();
    fillRepoSelect(select, repos, selectedRepoId);
  } catch (err) {
    console.error("Failed to load repositories:", err);
    select.innerHTML = "";
    const errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = /login|authorized|token/i.test(err.message)
      ? "Login on GFGHub website, keep it open, refresh"
      : err.message || "Could not load repositories";
    select.appendChild(errorOption);
  }

  return select;
}
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
      const repositoryId =
        document.getElementById(REPO_SELECT_ID)?.value || selectedRepoId;
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
    const header =
      document.querySelector("[class*='problems_header']") ||
      document.querySelector("[class*='problem_heading']") ||
      document.body;
    const text = header.innerText || "";
    const labeled = text.match(/Difficulty:\s*(Easy|Medium|Hard)/i);
    if (labeled) {
      const value = labeled[1].toLowerCase();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (/\bHard\b/.test(text)) return "Hard";
    if (/\bMedium\b/.test(text)) return "Medium";
    if (/\bEasy\b/.test(text)) return "Easy";
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

function applyContainerStyles(container) {
  container.style.position = "fixed";
  container.style.bottom = "24px";
  container.style.right = "24px";
  container.style.zIndex = "2147483647";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "10px";
  container.style.background = "#ffffff";
  container.style.padding = "12px 14px";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
  container.style.border = "1px solid #e5e7eb";
  container.style.fontFamily = "sans-serif";
}

function highlightAfterSuccess() {
  const container = document.getElementById(CONTAINER_ID);
  const btn = document.getElementById(BUTTON_ID);
  if (!container || !btn) return;

  container.style.border = "2px solid #16a34a";
  container.style.boxShadow = "0 8px 28px rgba(22,163,74,0.35)";
  btn.textContent = "Solved — Push to GitHub";
  btn.style.background = "#16a34a";
}

function mountUI() {
  if (!document.body) return;
  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  applyContainerStyles(container);
  createPushButton(container);
  document.body.appendChild(container);
  createRepoDropdown(container);
}

const SUCCESS_PATTERNS = [
  /problem solved successfully/i,
  /solved successfully/i,
  /correct answer/i,
  /attempt successful/i,
  /congratulations/i,
  /all test cases passed/i,
  /successfully submitted/i,
  /your code is correct/i,
];

function pageLooksSolved() {
  const text = document.body?.innerText || "";
  return SUCCESS_PATTERNS.some((pattern) => pattern.test(text));
}

function isProblemPage() {
  return /\/problems\//i.test(window.location.pathname);
}

function syncProblemUI() {
  if (!isProblemPage()) {
    document.getElementById(CONTAINER_ID)?.remove();
    return;
  }

  mountUI();
  if (pageLooksSolved()) {
    highlightAfterSuccess();
  }
}

function watchSpaNavigation() {
  let lastUrl = location.href;

  const onChange = () => {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    setTimeout(syncProblemUI, 300);
  };

  const originalPush = history.pushState;
  const originalReplace = history.replaceState;
  history.pushState = function (...args) {
    originalPush.apply(this, args);
    onChange();
  };
  history.replaceState = function (...args) {
    originalReplace.apply(this, args);
    onChange();
  };
  window.addEventListener("popstate", onChange);
}

function syncWebsiteToken() {
  try {
    const fromStorage = window.localStorage.getItem("gfghub_token");
    const fromQuery = new URLSearchParams(window.location.search).get("token");
    const token = fromQuery || fromStorage;
    if (!token) return;

    chrome.storage.local.set({ jwt: token }, () => {
      console.log("GFGHub: synced login token from website");
    });
  } catch (error) {
    console.warn("GFGHub: token sync failed", error);
  }
}

function initWhenReady() {
  // Check if we are on the frontend website (Vercel or localhost)
  if (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1")
  ) {
    syncWebsiteToken();
    window.addEventListener("message", (event) => {
      if (event.source !== window) return;
      if (event.data?.type === "GFGHUB_SAVE_TOKEN" && event.data.token) {
        chrome.storage.local.set({ jwt: event.data.token });
      }
    });
    return;
  }

  const start = () => {
    syncProblemUI();
    watchSpaNavigation();

    window.addEventListener("message", (event) => {
      if (event.source !== window) return;
      if (event.data?.type === "GFG_SUBMIT_SUCCESS") {
        console.log("GFGHub: detected accepted submission");
        mountUI();
        highlightAfterSuccess();
      }
      if (event.data?.type === "GFG_URL_CHANGE") {
        setTimeout(syncProblemUI, 200);
      }
    });

    let checkScheduled = false;
    const observer = new MutationObserver(() => {
      if (checkScheduled) return;
      checkScheduled = true;
      setTimeout(() => {
        checkScheduled = false;
        if (!isProblemPage()) return;
        if (!document.getElementById(CONTAINER_ID)) {
          mountUI();
        }
      }, 400);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    document.addEventListener(
      "click",
      (event) => {
        const label = event.target?.innerText || event.target?.textContent || "";
        if (!/submit/i.test(label)) return;
        [1500, 4000, 8000].forEach((ms) => {
          setTimeout(() => {
            if (pageLooksSolved()) {
              mountUI();
              highlightAfterSuccess();
            }
          }, ms);
        });
      },
      true
    );
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}

initWhenReady();