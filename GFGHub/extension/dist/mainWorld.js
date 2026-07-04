/******/ (() => { // webpackBootstrap
/*!**********************************!*\
  !*** ./src/content/mainWorld.js ***!
  \**********************************/
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function pickBest(candidates) {
  var best = "";
  var _iterator = _createForOfIteratorHelper(candidates),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var value = _step.value;
      if (value && value.trim().length > best.trim().length) {
        best = value;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return best.trim();
}
window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "GFG_CODE_REQUEST") {
    var code = "";
    console.log("GFGHub mainWorld extractor running...");

    // 1) window.monaco models
    if (window.monaco && window.monaco.editor) {
      try {
        var models = window.monaco.editor.getModels();
        if (models && models.length) {
          var values = models.map(function (m) {
            try {
              return m.getValue();
            } catch (_unused) {
              return "";
            }
          });
          var best = pickBest(values);
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
      var lines = document.querySelectorAll(".monaco-editor .view-lines .view-line");
      if (lines.length) {
        var joined = Array.from(lines).map(function (line) {
          return line.innerText;
        }).join("\n").trim();
        if (joined) {
          code = joined;
          console.log("GFGHub extractor: found monaco view-lines");
        }
      }
    }

    // 3) Monaco hidden textarea (some editors sync code here)
    if (!code) {
      var monacoTextarea = document.querySelector(".monaco-editor textarea");
      if (monacoTextarea && monacoTextarea.value && monacoTextarea.value.trim()) {
        code = monacoTextarea.value.trim();
        console.log("GFGHub extractor: found monaco textarea");
      }
    }

    // 4) CodeMirror
    if (!code) {
      var cm = document.querySelector(".CodeMirror");
      if (cm && cm.CodeMirror) {
        try {
          var val = cm.CodeMirror.getValue();
          if (val && val.trim()) {
            code = val.trim();
            console.log("GFGHub extractor: found CodeMirror");
          }
        } catch (e) {}
      }
    }

    // 5) Ace editor
    if (!code) {
      var aceEditor = document.querySelector(".ace_editor");
      if (aceEditor && aceEditor.env && aceEditor.env.editor) {
        try {
          var _val = aceEditor.env.editor.getValue();
          if (_val && _val.trim()) {
            code = _val.trim();
            console.log("GFGHub extractor: found Ace editor");
          }
        } catch (e) {}
      }
    }

    // 6) Any textarea with substantial content
    if (!code) {
      var textareas = Array.from(document.querySelectorAll("textarea")).map(function (t) {
        return t.value || "";
      }).filter(function (v) {
        return v.trim().length > 20;
      });
      var _best = pickBest(textareas);
      if (_best) {
        code = _best;
        console.log("GFGHub extractor: found generic textarea");
      }
    }

    // 7) Generic code/pre blocks (ignore problem statement area)
    if (!code) {
      var blocks = Array.from(document.querySelectorAll("pre, code")).filter(function (el) {
        return !el.closest(".problem-statement") && !el.closest(".problems_problem_content") && !el.closest(".description") && !el.closest(".problem-content");
      }).map(function (el) {
        return el.innerText || el.textContent || "";
      }).filter(function (v) {
        return v.trim().length > 20;
      });
      var _best2 = pickBest(blocks);
      if (_best2) {
        code = _best2;
        console.log("GFGHub extractor: found pre/code block");
      }
    }
    window.postMessage({
      type: "GFG_CODE_RESPONSE",
      code: code || ""
    }, "*");
  }
});
/******/ })()
;