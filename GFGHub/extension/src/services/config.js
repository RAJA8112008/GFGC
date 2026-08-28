const CANDIDATE_URLS = [
  "https://gfgc-xavx.onrender.com",
  "http://localhost:5001",
];

const WEBSITE_TAB_PATTERNS = [
  "http://localhost:5173/*",
  "http://127.0.0.1:5173/*",
  "https://gfgc-tawny.vercel.app/*",
];

export function normalizeToken(raw) {
  if (!raw) return null;
  if (typeof raw === "object") {
    raw = raw.token || raw.jwt || raw.accessToken || "";
  }

  let token = String(raw).trim();
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim();
  }
  token = token.replace(/^Bearer\s+/i, "").trim();

  if (token.split(".").length !== 3) return null;
  return token;
}

export async function getBackendUrl() {
  const stored = await chrome.storage.local.get(["backendUrl"]);
  if (stored.backendUrl) return stored.backendUrl;
  return CANDIDATE_URLS[0];
}

export async function rememberBackendUrl(url) {
  await chrome.storage.local.set({ backendUrl: url });
}

async function stealTokenFromWebsiteTabs() {
  if (!chrome.tabs?.query || !chrome.scripting?.executeScript) return null;

  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (!tab.id || !tab.url) continue;
      if (
        !/localhost:5173|127\.0\.0\.1:5173|gfgc-tawny\.vercel\.app/.test(tab.url)
      ) {
        continue;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => localStorage.getItem("gfghub_token"),
      });
      const token = normalizeToken(results?.[0]?.result);
      if (token) {
        await chrome.storage.local.set({ jwt: token });
        return token;
      }
    }
  } catch (error) {
    console.warn("GFGHub: could not read website token", error);
  }

  return null;
}

export async function ensureAuthToken() {
  const stored = await chrome.storage.local.get(["jwt"]);
  let token = normalizeToken(stored.jwt);
  if (token) return token;
  return stealTokenFromWebsiteTabs();
}

async function fetchFromBase(base, path, options, token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWithAuth(path, options = {}) {
  let token = await ensureAuthToken();
  if (!token) {
    throw new Error("Please login first");
  }

  const stored = await chrome.storage.local.get(["backendUrl"]);
  const urls = stored.backendUrl
    ? [stored.backendUrl, ...CANDIDATE_URLS.filter((url) => url !== stored.backendUrl)]
    : CANDIDATE_URLS;

  let lastError = new Error("Request failed");
  let triedStolenToken = false;

  for (const base of urls) {
    try {
      let { response, data } = await fetchFromBase(base, path, options, token);

      if (!response.ok && response.status === 401 && !triedStolenToken) {
        const stolen = await stealTokenFromWebsiteTabs();
        triedStolenToken = true;
        if (stolen && stolen !== token) {
          token = stolen;
          ({ response, data } = await fetchFromBase(base, path, options, token));
        }
      }

      if (response.ok) {
        await rememberBackendUrl(base);
        await chrome.storage.local.set({ jwt: token });
        return data;
      }
      lastError = new Error(data.message || `Request failed (${response.status})`);
    } catch (error) {
      lastError = error.name === "AbortError" ? new Error(`Timeout contacting ${base}`) : error;
    }
  }

  throw lastError;
}

export { CANDIDATE_URLS, WEBSITE_TAB_PATTERNS };
