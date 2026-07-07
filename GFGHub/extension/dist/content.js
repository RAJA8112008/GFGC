/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services/authAPI.js"
/*!*********************************!*\
  !*** ./src/services/authAPI.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getToken: () => (/* binding */ getToken),
/* harmony export */   loginWithGithub: () => (/* binding */ loginWithGithub),
/* harmony export */   logout: () => (/* binding */ logout),
/* harmony export */   saveToken: () => (/* binding */ saveToken)
/* harmony export */ });
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var BACKEND_URL = "https://gfgc-xavx.onrender.com";
var loginWithGithub = function loginWithGithub() {
  chrome.tabs.create({
    url: "".concat(BACKEND_URL, "/api/auth/github")
  });
};
var saveToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(token) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          return _context.a(2, chrome.storage.local.set({
            jwt: token
          }));
      }
    }, _callee);
  }));
  return function saveToken(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var result;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return chrome.storage.local.get(["jwt"]);
        case 1:
          result = _context2.v;
          return _context2.a(2, result.jwt || null);
      }
    }, _callee2);
  }));
  return function getToken() {
    return _ref2.apply(this, arguments);
  };
}();
var logout = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return chrome.storage.local.remove(["jwt", "savedRepoId"]);
        case 1:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return function logout() {
    return _ref3.apply(this, arguments);
  };
}();

/***/ },

/***/ "./src/services/githubAPI.js"
/*!***********************************!*\
  !*** ./src/services/githubAPI.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRepository: () => (/* binding */ createRepository),
/* harmony export */   getRepositories: () => (/* binding */ getRepositories)
/* harmony export */ });
/* harmony import */ var _authAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./authAPI */ "./src/services/authAPI.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }

var BACKEND_URL = "https://gfgc-xavx.onrender.com";
var getRepositories = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var token, response, data;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return (0,_authAPI__WEBPACK_IMPORTED_MODULE_0__.getToken)();
        case 1:
          token = _context.v;
          if (token) {
            _context.n = 2;
            break;
          }
          throw new Error("Please login first");
        case 2:
          _context.n = 3;
          return fetch("".concat(BACKEND_URL, "/api/github/repos"), {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          });
        case 3:
          response = _context.v;
          _context.n = 4;
          return response.json();
        case 4:
          data = _context.v;
          if (response.ok) {
            _context.n = 5;
            break;
          }
          throw new Error(data.message || "Failed to load repositories");
        case 5:
          return _context.a(2, data);
      }
    }, _callee);
  }));
  return function getRepositories() {
    return _ref.apply(this, arguments);
  };
}();
var createRepository = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(name) {
    var token, response, data;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return (0,_authAPI__WEBPACK_IMPORTED_MODULE_0__.getToken)();
        case 1:
          token = _context2.v;
          if (token) {
            _context2.n = 2;
            break;
          }
          throw new Error("Please login first");
        case 2:
          _context2.n = 3;
          return fetch("".concat(BACKEND_URL, "/api/github/repos"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(token)
            },
            body: JSON.stringify({
              name: name
            })
          });
        case 3:
          response = _context2.v;
          _context2.n = 4;
          return response.json();
        case 4:
          data = _context2.v;
          if (response.ok) {
            _context2.n = 5;
            break;
          }
          throw new Error(data.message || "Failed to create repository");
        case 5:
          return _context2.a(2, data);
      }
    }, _callee2);
  }));
  return function createRepository(_x) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/content/gfgDetector.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_githubAPI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/githubAPI.js */ "./src/services/githubAPI.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
console.log("🚀 GFGHub content script loaded1");

var REPO_SELECT_ID = "gfghub-repo-select";
var BUTTON_ID = "gfghub-push-btn";
var CONTAINER_ID = "gfghub-floating-container";
function getSavedRepositoryId() {
  return _getSavedRepositoryId.apply(this, arguments);
}
function _getSavedRepositoryId() {
  _getSavedRepositoryId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          return _context2.a(2, new Promise(function (resolve) {
            chrome.storage.local.get(["savedRepoId"], function (result) {
              resolve(result.savedRepoId || "");
            });
          }));
      }
    }, _callee2);
  }));
  return _getSavedRepositoryId.apply(this, arguments);
}
console.log("🚀 GFGHub content script loaded 2");
function saveRepositoryId(_x) {
  return _saveRepositoryId.apply(this, arguments);
}
function _saveRepositoryId() {
  _saveRepositoryId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id) {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          return _context3.a(2, new Promise(function (resolve) {
            chrome.storage.local.set({
              savedRepoId: id
            }, function () {
              resolve();
            });
          }));
      }
    }, _callee3);
  }));
  return _saveRepositoryId.apply(this, arguments);
}
function createRepoDropdown(_x2) {
  return _createRepoDropdown.apply(this, arguments);
}
function _createRepoDropdown() {
  _createRepoDropdown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(container) {
    var select, defaultOption, repos, savedRepoId, _t2;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          select = document.createElement("select");
          select.id = REPO_SELECT_ID;
          select.style.padding = "10px";
          select.style.borderRadius = "8px";
          select.style.border = "1px solid #d1d5db";
          select.style.fontSize = "14px";
          select.style.marginRight = "10px";
          select.style.minWidth = "220px";
          select.style.background = "#fff";
          defaultOption = document.createElement("option");
          defaultOption.value = "";
          defaultOption.textContent = "Select repository";
          select.appendChild(defaultOption);
          _context5.p = 1;
          _context5.n = 2;
          return (0,_services_githubAPI_js__WEBPACK_IMPORTED_MODULE_0__.getRepositories)();
        case 2:
          repos = _context5.v;
          _context5.n = 3;
          return getSavedRepositoryId();
        case 3:
          savedRepoId = _context5.v;
          console.log("GFGHub repos response:", repos);
          repos.forEach(function (repo) {
            var option = document.createElement("option");
            option.value = repo._id;
            option.textContent = repo.repoName;
            select.appendChild(option);
          });
          if (savedRepoId) {
            select.value = savedRepoId;
          }
          select.addEventListener("change", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
            return _regenerator().w(function (_context4) {
              while (1) switch (_context4.n) {
                case 0:
                  _context4.n = 1;
                  return saveRepositoryId(select.value);
                case 1:
                  return _context4.a(2);
              }
            }, _callee4);
          })));
          _context5.n = 5;
          break;
        case 4:
          _context5.p = 4;
          _t2 = _context5.v;
          console.error("Failed to load repositories:", _t2);
        case 5:
          container.appendChild(select);
          return _context5.a(2, select);
      }
    }, _callee5, null, [[1, 4]]);
  }));
  return _createRepoDropdown.apply(this, arguments);
}
console.log("🚀 GFGHub content script loaded3");
function createPushButton(container) {
  var btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.textContent = "Push to GitHub";
  btn.style.padding = "10px 15px";
  btn.style.background = "#2563EB";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "600";
  btn.addEventListener("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _document$getElementB, repositoryId, code, problemName, difficulty, language, problemUrl, payload, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          repositoryId = (_document$getElementB = document.getElementById(REPO_SELECT_ID)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value;
          if (repositoryId) {
            _context.n = 1;
            break;
          }
          alert("Please select a repository first.");
          return _context.a(2);
        case 1:
          console.log("GFGHub: extracting code...");
          _context.n = 2;
          return getCurrentCode();
        case 2:
          code = _context.v;
          console.log("GFGHub extracted code:", code);
          if (!(!code || !code.trim())) {
            _context.n = 3;
            break;
          }
          alert("Could not extract code from the editor.");
          return _context.a(2);
        case 3:
          problemName = extractProblemName();
          difficulty = extractDifficulty();
          language = extractLanguage();
          problemUrl = location.href;
          payload = {
            code: code,
            repositoryId: repositoryId,
            problemName: problemName,
            difficulty: difficulty,
            language: language,
            topic: ["GeeksForGeeks"],
            problemUrl: problemUrl
          };
          console.log("GFGHub push payload:", payload);
          chrome.runtime.sendMessage({
            type: "PUSH_CODE",
            payload: payload
          }, function (response) {
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
          });
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.error("Push button error:", _t);
          alert("Push failed. Check console for details.");
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[0, 4]]);
  })));
  container.appendChild(btn);
}

/* ---------------------------
   Problem metadata extractors
---------------------------- */

function extractProblemName() {
  try {
    // 1. Try to get the name from page headings first (most accurate)
    var headingSelectors = ["div[class^='problems_header_content'] h3", ".problem-statement h3", ".problem-tab__name", "div[class^='problem_heading']", "h3[class^='problem_heading']", "div[class*='ProblemName']", "h1"];
    for (var _i = 0, _headingSelectors = headingSelectors; _i < _headingSelectors.length; _i++) {
      var sel = _headingSelectors[_i];
      var el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.trim()) {
        return el.innerText.trim();
      }
    }

    // 2. Try document title
    if (document.title) {
      var titleMatch = document.title.split(/\||-/)[0].trim();
      if (titleMatch && !titleMatch.toLowerCase().includes("geeksforgeeks") && !titleMatch.toLowerCase().includes("practice")) {
        return titleMatch;
      }
    }

    // 3. Fallback: from URL slug
    // Example: /problems/reverse-a-linked-list/1 or /problems/key-pair5616/1
    var parts = location.pathname.split("/");
    var slugIndex = parts.indexOf("problems") + 1;
    if (slugIndex > 0 && parts[slugIndex]) {
      var slug = parts[slugIndex];
      // Remove trailing digits with or without hyphen (e.g., -1587115621 or 5616)
      slug = slug.replace(/-?\d+$/, "");
      return slug.split("-").filter(function (word) {
        return word.length > 0;
      }).map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(" ");
    }
  } catch (e) {
    console.error("extractProblemName error:", e);
  }
  return "Untitled Problem";
}
function extractDifficulty() {
  try {
    var text = document.body.innerText;
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
    var selectors = ['[class*="language"]', '[class*="lang"]', 'button[aria-selected="true"]', '.tabs__tab.active', '.selected'];
    for (var _i2 = 0, _selectors = selectors; _i2 < _selectors.length; _i2++) {
      var sel = _selectors[_i2];
      var nodes = document.querySelectorAll(sel);
      var _iterator = _createForOfIteratorHelper(nodes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _node$innerText;
          var node = _step.value;
          var txt = (_node$innerText = node.innerText) === null || _node$innerText === void 0 || (_node$innerText = _node$innerText.trim()) === null || _node$innerText === void 0 ? void 0 : _node$innerText.toLowerCase();
          if (!txt) continue;
          if (txt.includes("c++")) return "cpp";
          if (txt.includes("java")) return "java";
          if (txt.includes("python")) return "python";
          if (txt.includes("javascript")) return "javascript";
          if (txt.includes("js")) return "javascript";
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
  return new Promise(function (resolve) {
    var _listener = function listener(event) {
      var _event$data;
      if (event.source === window && ((_event$data = event.data) === null || _event$data === void 0 ? void 0 : _event$data.type) === "GFG_CODE_RESPONSE") {
        window.removeEventListener("message", _listener);
        resolve(event.data.code || "");
      }
    };
    window.addEventListener("message", _listener);
    window.postMessage({
      type: "GFG_CODE_REQUEST"
    }, "*");
    setTimeout(function () {
      window.removeEventListener("message", _listener);
      resolve("");
    }, 2500);
  });
}

/* ---------------------------
   UI bootstrap
---------------------------- */

function mountUI() {
  if (document.getElementById(CONTAINER_ID)) return;
  var container = document.createElement("div");
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
  createRepoDropdown(container).then(function () {
    createPushButton(container);
  });
  document.body.appendChild(container);
}
function initWhenReady() {
  // Check if we are on the frontend website (Vercel or localhost)
  if (window.location.hostname.includes("vercel.app") || window.location.hostname.includes("localhost")) {
    if (window.location.pathname.startsWith("/auth-success")) {
      var urlParams = new URLSearchParams(window.location.search);
      var token = urlParams.get("token");
      if (token) {
        chrome.storage.local.set({
          jwt: token
        }, function () {
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
  var checkSuccess = function checkSuccess() {
    if (document.getElementById(CONTAINER_ID)) return; // Already mounted

    var text = document.body.innerText || "";
    // Common GFG success texts
    if (text.includes("Problem Solved Successfully") || text.includes("Correct Answer") || text.includes("Attempt Successful")) {
      mountUI();
    }
  };
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", function () {
      setInterval(checkSuccess, 2000);
    });
  } else {
    setInterval(checkSuccess, 2000);
  }
}
initWhenReady();
})();

/******/ })()
;