import { getToken } from "./authAPI";
import { ensureAuthToken, fetchWithAuth } from "./config";

const asRepoArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.repos)) return data.repos;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getRepositories = async () => {
  const token = await ensureAuthToken();
  if (!token) {
    throw new Error("Please login first");
  }

  const data = await fetchWithAuth("/api/github/repos");
  return asRepoArray(data);
};

export const createRepository = async (name) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Please login first");
  }

  return fetchWithAuth("/api/github/repos", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};
