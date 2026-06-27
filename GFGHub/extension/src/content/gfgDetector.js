import { getRepositories } from "../services/githubAPI.js";

const REPO_SELECT_ID = "gfghub-repo-select";
const BUTTON_ID = "gfghub-push-btn";
const CONTAINER_ID = "gfghub-floating-container";

async function getSavedRepository() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["selectedRepo"], (result) => {
      resolve(result.selectedRepo || "");
    });
  });
}

async function saveRepository(repo) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ selectedRepo: repo }, () => {
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
    const savedRepo = await getSavedRepository();

    console.log("GFGHub repos response:", repos);

    repos.forEach((repo) => {
      const option = document.createElement("option");
      option.value = repo.full_name;
      option.textContent = repo.full_name;
      select.appendChild(option);
    });

    if (savedRepo) {
      select.value = savedRepo;
    }

    select.addEventListener("change", async () => {
      await saveRepository(select.value);
    });
  } catch (err) {
    console.error("Failed to load repositories:", err);
  }

  container.appendChild(select);
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
      const repositoryName = document.getElementById(REPO_SELECT_ID)?.value;
      if (!repositoryName) {
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
        repositoryName,
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
    // Preferred: from URL slug
    // Example: /problems/reverse-a-linked-list/1
    const parts = location.pathname.split("/");
    const slugIndex = parts.indexOf("problems") + 1;

    if (slugIndex > 0 && parts[slugIndex]) {
      let slug = parts[slugIndex];
      // Remove trailing random digits (e.g., -1587115621)
      slug = slug.replace(/-\d+$/, "");
      
      return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Fallback from page headings
    const heading =
      document.querySelector(".problem-statement h3") ||
      document.querySelector(".problem-tab__name") ||
      document.querySelector("h1");

    if (heading?.innerText?.trim()) {
      return heading.innerText.trim();
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
  const observer = new MutationObserver((mutations) => {
    const bodyText = document.body?.innerText || "";
    if (bodyText.includes("Problem Solved Successfully")) {
      mountUI();
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    // Check in case it is already solved on load
    if (document.body.innerText.includes("Problem Solved Successfully")) {
      mountUI();
    }
  } else {
    window.addEventListener("load", () => {
      observer.observe(document.body, { childList: true, subtree: true });
      if (document.body.innerText.includes("Problem Solved Successfully")) {
        mountUI();
      }
    });
  }
}

initWhenReady();