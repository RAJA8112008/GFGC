export const saveToken = async (token) => {
  return chrome.storage.local.set({ githubToken: token });
};

export const getToken = async () => {
  const result = await chrome.storage.local.get(["githubToken"]);
  return result.githubToken || null;
};

export const logout = async () => {
  await chrome.storage.local.remove(["githubToken", "selectedRepo", "githubUser"]);
};