import { getToken } from "./authAPI";

const GITHUB_API_URL = "https://api.github.com";

// Helper for GitHub API headers
const getHeaders = (token) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "Content-Type": "application/json",
});

export const getUserProfile = async (token) => {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Invalid GitHub token");
  }

  return await response.json();
};

export const getRepositories = async () => {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${GITHUB_API_URL}/user/repos?per_page=100&sort=updated`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  return await response.json();
};

export const createRepository = async (name) => {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      name,
      description: "My GeeksforGeeks solutions synced automatically using GFGHub",
      private: false,
      auto_init: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create repository");
  }

  return await response.json();
};

// Push a solution directly to GitHub
export const commitFileDirectly = async (token, owner, repo, path, content, commitMessage) => {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;
  let sha = null;

  // 1. Try to get the file to check if it exists (for its SHA)
  try {
    const checkResponse = await fetch(url, {
      headers: getHeaders(token),
    });
    if (checkResponse.ok) {
      const fileData = await checkResponse.json();
      sha = fileData.sha;
    }
  } catch (e) {
    console.log("File does not exist yet (creating new file)");
  }

  // 2. Base64 encode the content
  // btoa handles ASCII; to handle Unicode characters (utf-8) safely, we do:
  const utf8Bytes = new TextEncoder().encode(content);
  const base64Content = btoa(String.fromCharCode(...utf8Bytes));

  // 3. Commit the file
  const body = {
    message: commitMessage,
    content: base64Content,
  };
  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to commit file to GitHub");
  }

  return responseData;
};