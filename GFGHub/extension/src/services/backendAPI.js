import { getToken } from "./authAPI";

const BACKEND_URL = "https://gfgc-1.onrender.com/";

export const pushSolution = async (payload) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(`${BACKEND_URL}/api/solutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Push failed");
  }

  return data;
};

export const getStats = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load stats");
  }

  return data;
};

export const getCurrentUser = async () => {
  const token = await getToken();

  if (!token) return null;

  const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  return await response.json();
};