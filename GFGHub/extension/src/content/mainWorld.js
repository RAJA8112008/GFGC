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
