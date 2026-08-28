import { getToken } from "./authAPI";
import { fetchWithAuth } from "./config";

export const pushSolution = async (payload) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Please login first");
  }
  return fetchWithAuth("/api/solutions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getStats = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Please login first");
  }
  return fetchWithAuth("/api/dashboard/stats");
};

export const getCurrentUser = async () => {
  const token = await getToken();
  if (!token) return null;

  try {
    return await fetchWithAuth("/api/auth/me");
  } catch (error) {
    if (/login|401|invalid token|not authorized/i.test(error.message)) {
      await chrome.storage.local.remove("jwt");
      return null;
    }
    return null;
  }
};
