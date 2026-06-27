// extension/src/content/gfgButton.js
import { REPO_SELECT_ID, getRepositories, getSavedRepositoryId, saveRepositoryId } from "./gfgDetector.js";

const BUTTON_ID = "gfhg-push-btn";

async function createPushButton(container) {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.textContent = "Push to GitHub";
    btn.style.padding = "8px 12px";
    btn.style.background = "#0366d6";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";
    btn.style.marginRight = "8px";

    btn.addEventListener("click", async () => {
        const code = getCurrentCode(); // helper defined below
        const repo = document.getElementById(REPO_SELECT_ID)?.value;
        if (!repo) {
            alert("Select a repository first.");
            return;
        }
        chrome.runtime.sendMessage({
            type: "PUSH_CODE",
            payload: { code, repo },
        });
    });

    container.appendChild(btn);
}

// Helper: extract the solution code from the page
function getCurrentCode() {
    const pre = document.querySelector("pre");
    return pre ? pre.innerText : "";
}

// Main entry – find a place near the problem title to inject UI
(async () => {
    // Wait for the DOM area where GFG places its action bar
    const toolbar = document.querySelector(".article-header") || document.body;
    if (!toolbar) return;

    // Create repo selector dropdown (already defined in detector)
    const dropdown = await createRepoDropdown(toolbar);
    await createPushButton(toolbar);
})();
