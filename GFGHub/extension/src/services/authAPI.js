const BACKEND_URL = "https://gfgc-xavx.onrender.com";

export const loginWithGithub = () => {
  chrome.tabs.create({
    url: `${BACKEND_URL}/api/auth/github`,
  });
};

export const saveToken = async (token) => {
  return chrome.storage.local.set({ jwt: token });
};

export const getToken = async () => {
  const result = await chrome.storage.local.get(["jwt"]);
  return result.jwt || null;
};

export const logout = async () => {
  await chrome.storage.local.remove(["jwt", "savedRepoId"]);
};