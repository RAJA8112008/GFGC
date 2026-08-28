function pickBest(candidates) {
  let best = "";
  for (const value of candidates) {
    if (value && value.trim().length > best.trim().length) {
      best = value;
    }
  }
  return best.trim();
}

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GFG_CODE_REQUEST") {
    let code = "";

    console.log("GFGHub mainWorld extractor running...");

    // 1) window.monaco models
    if (window.monaco && window.monaco.editor) {
      try {
        const models = window.monaco.editor.getModels();
        if (models && models.length) {
          const values = models.map(m => {
            try { return m.getValue(); } catch { return ""; }
          });
          const best = pickBest(values);
          if (best) {
            code = best;
            console.log("GFGHub extractor: found monaco model value via window.monaco");
          }
        }
      } catch (e) {
        console.error("GFGHub window.monaco error:", e);
      }
    }

    // 2) Monaco view lines
    if (!code) {
      const lines = document.querySelectorAll(".monaco-editor .view-lines .view-line");
      if (lines.length) {
        const joined = Array.from(lines).map(line => line.innerText).join("\n").trim();
        if (joined) {
          code = joined;
          console.log("GFGHub extractor: found monaco view-lines");
        }
      }
    }

    // 3) Monaco hidden textarea (some editors sync code here)
    if (!code) {
      const monacoTextarea = document.querySelector(".monaco-editor textarea");
      if (monacoTextarea && monacoTextarea.value && monacoTextarea.value.trim()) {
        code = monacoTextarea.value.trim();
        console.log("GFGHub extractor: found monaco textarea");
      }
    }

    // 4) CodeMirror
    if (!code) {
      const cm = document.querySelector(".CodeMirror");
      if (cm && cm.CodeMirror) {
        try {
          const val = cm.CodeMirror.getValue();
          if (val && val.trim()) {
            code = val.trim();
            console.log("GFGHub extractor: found CodeMirror");
          }
        } catch (e) {}
      }
    }

    // 5) Ace editor
    if (!code) {
      const aceEditor = document.querySelector(".ace_editor");
      if (aceEditor && aceEditor.env && aceEditor.env.editor) {
        try {
          const val = aceEditor.env.editor.getValue();
          if (val && val.trim()) {
            code = val.trim();
            console.log("GFGHub extractor: found Ace editor");
          }
        } catch (e) {}
      }
    }

    // 6) Any textarea with substantial content
    if (!code) {
      const textareas = Array.from(document.querySelectorAll("textarea"))
        .map(t => t.value || "")
        .filter(v => v.trim().length > 20);

      const best = pickBest(textareas);
      if (best) {
        code = best;
        console.log("GFGHub extractor: found generic textarea");
      }
    }

    // 7) Generic code/pre blocks (ignore problem statement area)
    if (!code) {
      const blocks = Array.from(document.querySelectorAll("pre, code"))
        .filter(el => {
          return (
            !el.closest(".problem-statement") &&
            !el.closest(".problems_problem_content") &&
            !el.closest(".description") &&
            !el.closest(".problem-content")
          );
        })
        .map(el => el.innerText || el.textContent || "")
        .filter(v => v.trim().length > 20);

      const best = pickBest(blocks);
      if (best) {
        code = best;
        console.log("GFGHub extractor: found pre/code block");
      }
    }

    window.postMessage(
      {
        type: "GFG_CODE_RESPONSE",
        code: code || ""
      },
      "*"
    );
  }
});

function getRequestUrl(input) {
  try {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.href;
    if (input && typeof input.url === "string") return input.url;
  } catch (e) {}
  return "";
}

function isSubmitRequest(url) {
  const value = String(url || "").toLowerCase();
  if (!value) return false;
  return (
    value.includes("practiceapi") && (value.includes("submit") || value.includes("submission")) ||
    value.includes("/submit") ||
    value.includes("/submissions")
  );
}

function isAcceptedResult(data) {
  if (!data || typeof data !== "object") return false;

  if (
    data.view_mode === "correct" ||
    data.sub_status === 1 ||
    data.sub_status === "1" ||
    String(data.status || "").toLowerCase() === "correct" ||
    String(data.result || "").toLowerCase() === "correct"
  ) {
    return true;
  }

  const message = String(data.message || data.msg || "");
  if (/solved successfully|correct answer|congratulations|all test cases passed/i.test(message)) {
    return true;
  }

  const nested = data.data;
  if (nested && typeof nested === "object") {
    return isAcceptedResult(nested);
  }

  return false;
}

function notifyAccepted(payload) {
  window.postMessage(
    {
      type: "GFG_SUBMIT_SUCCESS",
      payload: payload || null
    },
    "*"
  );
}

const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const response = await originalFetch.apply(this, args);
  try {
    const url = getRequestUrl(args[0]);
    if (isSubmitRequest(url) && response.clone) {
      response
        .clone()
        .json()
        .then((data) => {
          if (isAcceptedResult(data)) {
            console.log("GFGHub mainWorld: accepted submit via fetch");
            notifyAccepted(data);
          }
        })
        .catch(() => {});
    }
  } catch (e) {}
  return response;
};

function notifyUrlChange() {
  window.postMessage(
    {
      type: "GFG_URL_CHANGE",
      href: location.href
    },
    "*"
  );
}

const originalPushState = history.pushState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  notifyUrlChange();
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  notifyUrlChange();
};

window.addEventListener("popstate", notifyUrlChange);

const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  this._gfghubUrl = url;
  return originalOpen.call(this, method, url, ...rest);
};

XMLHttpRequest.prototype.send = function (...args) {
  this.addEventListener("load", function () {
    try {
      if (!isSubmitRequest(this._gfghubUrl)) return;
      const data = JSON.parse(this.responseText);
      if (isAcceptedResult(data)) {
        console.log("GFGHub mainWorld: accepted submit via XHR");
        notifyAccepted(data);
      }
    } catch (e) {}
  });
  return originalSend.apply(this, args);
};
