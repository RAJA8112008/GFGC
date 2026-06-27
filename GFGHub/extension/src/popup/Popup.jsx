import React, { useEffect, useState } from "react";
import { loginWithGithub, getToken, logout } from "../services/authAPI";
import { getCurrentUser, getStats } from "../services/backendAPI";
import { getRepositories, createRepository } from "../services/githubAPI";

export default function Popup() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      const jwt = await getToken();
      setToken(jwt);

      if (!jwt) {
        setLoading(false);
        return;
      }

      const [me, statsData, reposData] = await Promise.all([
        getCurrentUser(),
        getStats(),
        getRepositories(),
      ]);

      setUser(me);
      setStats(statsData);
      setRepos(reposData);

      const stored = await chrome.storage.local.get(["savedRepoId"]);
      if (stored.savedRepoId) {
        setSelectedRepoId(stored.savedRepoId);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateRepo = async () => {
    try {
      if (!repoName.trim()) {
        setMessage("Enter repository name");
        return;
      }

      setMessage("Creating repository...");
      const repo = await createRepository(repoName.trim());
      setRepos((prev) => [repo, ...prev]);
      setSelectedRepoId(repo._id);
      await chrome.storage.local.set({ savedRepoId: repo._id });
      setRepoName("");
      setMessage("Repository created successfully");
    } catch (err) {
      setMessage(err.message || "Failed to create repo");
    }
  };

  const handleRepoChange = async (e) => {
    const value = e.target.value;
    setSelectedRepoId(value);
    await chrome.storage.local.set({ savedRepoId: value });
  };

  const handleLogout = async () => {
    await logout();
    setToken(null);
    setUser(null);
    setStats(null);
    setRepos([]);
    setSelectedRepoId("");
    setMessage("Logged out");
  };

  if (loading) {
    return <div style={{ padding: 16, width: 300, fontFamily: "sans-serif" }}>Loading...</div>;
  }

  if (!token) {
    return (
      <div style={{ padding: 16, width: 320, fontFamily: "sans-serif", boxSizing: "border-box" }}>
        <h2 style={{ marginTop: 0, color: "#2563eb" }}>GFGHub Sync</h2>
        <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.4", marginBottom: "16px" }}>
          Login to automatically push your GeeksforGeeks solutions directly to your GitHub repositories.
        </p>
        <button
          onClick={loginWithGithub}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Login with GitHub
        </button>
        {message && (
          <p style={{ marginTop: "10px", fontSize: "13px", color: "#dc2626" }}>{message}</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 16, width: 320, fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <h2 style={{ marginTop: 0, color: "#2563eb" }}>GFGHub Sync</h2>

      {user && (
        <div style={{ marginBottom: 12, fontSize: "14px", color: "#374151" }}>
          Welcome, <strong>{user.username}</strong>!
        </div>
      )}

      {stats && (
        <div style={{ marginBottom: 16, fontSize: "13px", padding: "10px", background: "#f3f4f6", borderRadius: "8px", color: "#4b5563" }}>
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>Solved Stats:</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total: <strong>{stats.total}</strong></span>
            <span>Easy: <strong>{stats.easy}</strong></span>
            <span>Medium: <strong>{stats.medium}</strong></span>
            <span>Hard: <strong>{stats.hard}</strong></span>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "600", fontSize: "13px", color: "#374151" }}>
          Select Repository
        </label>
        <select
          value={selectedRepoId}
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
            <option key={repo._id} value={repo._id}>
              {repo.repoName}
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
          Create Repository
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