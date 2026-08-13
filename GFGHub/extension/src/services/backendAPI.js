import { getToken } from "./authAPI";

const BACKEND_URL = "https://gfgc-xavx.onrender.com";

const parseResponse = async (response) => {
  const data = await response.json();

  if (response.status === 401) {
    await chrome.storage.local.remove("jwt");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};


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

  return parseResponse(response);
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

  return parseResponse(response);
};

export const getCurrentUser = async () => {
  const token = await getToken();

  if (!token) return null;

  const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await chrome.storage.local.remove("jwt");
    return null;
  }

  if (!response.ok) return null;

  return response.json();
};