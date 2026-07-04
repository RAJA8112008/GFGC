import React, { createContext, useEffect, useState } from "react";
import authAPI from "../services/authAPI";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("gfghub_token") || null);
  const [loading, setLoading] = useState(true);

  // Fetch the user profile when a token is present
  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authAPI.getProfile(token);
      setUser(data);
    } catch (_) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount and whenever the token changes
  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Keep token in localStorage for page reloads
  useEffect(() => {
    if (token) {
      localStorage.setItem("gfghub_token", token);
    } else {
      localStorage.removeItem("gfghub_token");
    }
  }, [token]);

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
