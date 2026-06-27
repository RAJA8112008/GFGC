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

      const stored = await chrome.storage.local.get(["selectedRepoId"]);
      if (stored.selectedRepoId) {
        setSelectedRepoId(stored.selectedRepoId);
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
      setRepoName("");
      setMessage("Repository created successfully");
    } catch (err) {
      setMessage(err.message || "Failed to create repo");
    }
  };

  const handleRepoChange = async (e) => {
    const value = e.target.value;
    setSelectedRepoId(value);
    await chrome.storage.local.set({ selectedRepoId: value });
  };

  const handleLogout = async () => {
    await logout();
    await chrome.storage.local.remove(["selectedRepoId"]);
    setToken(null);
    setUser(null);
    setStats(null);
    setRepos([]);
    setSelectedRepoId("");
    setMessage("Logged out");
  };

  if (loading) {
    return <div style={{ padding: 12 }}>Loading...</div>;
  }

  if (!token) {
    return (
      <div style={{ padding: 8 }}>
        <h2 style={{ marginTop: 0 }}>GFGHub Sync</h2>
        <p>Login to push your GFG solutions to GitHub.</p>
        <button
          onClick={loginWithGithub}
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
          Login with GitHub
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <h2 style={{ marginTop: 0 }}>GFGHub Sync</h2>

      {user && (
        <div style={{ marginBottom: 12 }}>
          <div><strong>User:</strong> {user.username}</div>
          <div><strong>Email:</strong> {user.email || "N/A"}</div>
        </div>
      )}

      {stats && (
        <div style={{ marginBottom: 12, fontSize: "14px" }}>
          <div><strong>Total:</strong> {stats.total}</div>
          <div><strong>Easy:</strong> {stats.easy}</div>
          <div><strong>Medium:</strong> {stats.medium}</div>
          <div><strong>Hard:</strong> {stats.hard}</div>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "600" }}>
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

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "600" }}>
          Create New Repository
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
        <div style={{ marginBottom: 12, fontSize: "13px", color: "#374151" }}>
          {message}
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "10px",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Logout
      </button>
    </div>
  );
}