import React, { useEffect, useState } from "react";
import { saveToken, getToken, logout } from "../services/authAPI";
import { getUserProfile, getRepositories, createRepository } from "../services/githubAPI";

export default function Popup() {
  const [token, setToken] = useState(null);
  const [inputToken, setInputToken] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      const savedToken = await getToken();
      setToken(savedToken);

      if (!savedToken) {
        setLoading(false);
        return;
      }

      // Fetch user profile and repositories directly from GitHub
      const userProfile = await getUserProfile(savedToken);
      setUser(userProfile);

      const reposData = await getRepositories();
      setRepos(reposData);

      const stored = await chrome.storage.local.get(["selectedRepo"]);
      if (stored.selectedRepo) {
        setSelectedRepo(stored.selectedRepo);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load data from GitHub");
      // If token is invalid, clear it
      if (err.message?.includes("Invalid GitHub token")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveToken = async () => {
    if (!inputToken.trim()) {
      setMessage("Please enter a valid token");
      return;
    }
    try {
      setLoading(true);
      // Validate token first
      const userProfile = await getUserProfile(inputToken.trim());
      await saveToken(inputToken.trim());
      setToken(inputToken.trim());
      setUser(userProfile);
      setInputToken("");
      setMessage("Token saved successfully!");
      loadAll();
    } catch (err) {
      setMessage("Invalid token. Please make sure it has 'repo' scope.");
      setLoading(false);
    }
  };

  const handleCreateRepo = async () => {
    try {
      if (!repoName.trim()) {
        setMessage("Enter repository name");
        return;
      }

      setMessage("Creating repository on GitHub...");
      const repo = await createRepository(repoName.trim());
      setRepos((prev) => [repo, ...prev]);
      setSelectedRepo(repo.full_name);
      await chrome.storage.local.set({ selectedRepo: repo.full_name });
      setRepoName("");
      setMessage(`Repository "${repo.name}" created and selected!`);
    } catch (err) {
      setMessage(err.message || "Failed to create repo");
    }
  };

  const handleRepoChange = async (e) => {
    const value = e.target.value;
    setSelectedRepo(value);
    await chrome.storage.local.set({ selectedRepo: value });
  };

  const handleLogout = async () => {
    await logout();
    setToken(null);
    setUser(null);
    setRepos([]);
    setSelectedRepo("");
    setMessage("Logged out successfully");
  };

  if (loading) {
    return <div style={{ padding: 16, width: 300, fontFamily: "sans-serif" }}>Loading...</div>;
  }

  if (!token) {
    return (
      <div style={{ padding: 16, width: 320, fontFamily: "sans-serif", boxSizing: "border-box" }}>
        <h2 style={{ marginTop: 0, color: "#2563eb" }}>GFGHub Sync</h2>
        <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.4" }}>
          To sync your GeeksforGeeks solutions directly to GitHub, please enter a GitHub Personal Access Token (PAT) with <strong>repo</strong> scope.
        </p>
        <a
          href="https://github.com/settings/tokens/new?scopes=repo&description=GFGHub%20Sync"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          🔑 Click here to generate a token
        </a>
        <input
          type="password"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          placeholder="Paste your GitHub PAT here"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSaveToken}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Save Token
        </button>
        {message && (
          <p style={{ marginTop: "10px", fontSize: "13px", color: "#dc2626" }}>{message}</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 16, width: 320, fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <h2 style={{ marginTop: 0, color: "#2563eb", display: "flex", alignItems: "center", gap: "8px" }}>
        {user?.avatar_url && (
          <img
            src={user.avatar_url}
            alt="avatar"
            style={{ width: "28px", height: "28px", borderRadius: "50%" }}
          />
        )}
        GFGHub Sync
      </h2>

      {user && (
        <div style={{ marginBottom: 16, fontSize: "14px", color: "#374151" }}>
          Hi <strong>@{user.login}</strong>! 👋
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "600", fontSize: "13px", color: "#374151" }}>
          Select Repository
        </label>
        <select
          value={selectedRepo}
          onChange={handleRepoChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            background: "#fff",
            boxSizing: "border-box",
          }}
        >
          <option value="">Choose repository</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.full_name}>
              {repo.full_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "600", fontSize: "13px", color: "#374151" }}>
          Or Create New Repository
        </label>
        <input
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          placeholder="e.g. gfg-solutions"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "8px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleCreateRepo}
          style={{
            width: "100%",
            padding: "10px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Create & Select
        </button>
      </div>

      {message && (
        <div style={{ marginBottom: 12, fontSize: "13px", color: "#2563eb", fontWeight: "500" }}>
          {message}
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "10px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          marginTop: "8px",
        }}
      >
        Logout
      </button>
    </div>
  );
}