import { getToken } from "./authAPI";

const BACKEND_URL = "http://localhost:5000";

export const getRepositories = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(`${BACKEND_URL}/api/github/repos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load repositories");
  }

  return data;
};

export const createRepository = async (name) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(`${BACKEND_URL}/api/github/repos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create repository");
  }

  return data;
};