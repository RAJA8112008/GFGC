import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "/api").replace(/\/api\/?$/, "");
export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

    useEffect(() => {
    const handleAuth = async () => {
      // Try to get token from query or hash
      let token = new URLSearchParams(location.search).get("token");
      if (!token && location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        token = hashParams.get("token");
      }

      // If no token but we have an OAuth 'code', exchange it with backend for a token
      if (!token) {
        const code = new URLSearchParams(location.search).get("code");
        if (code) {
          try {
            const resp = await fetch(`${BACKEND_URL}/api/auth/github/callback?code=${code}`);
            const data = await resp.json();
            if (resp.ok && data.token) {
              token = data.token;
            } else {
              console.error("Failed to exchange code for token", data);
            }
          } catch (e) {
            console.error("Error exchanging code", e);
          }
        }
      }

      console.log("Token from URL:", token);

      if (token) {
        // Save token in frontend localStorage AND update React state
        localStorage.setItem("gfghub_token", token);
        setToken(token);
        window.postMessage({ type: "GFGHUB_SAVE_TOKEN", token }, "*");
        if (window.chrome?.runtime?.sendMessage) {
          try {
            chrome.runtime.sendMessage(
              { type: "SAVE_TOKEN", token },
              (response) => {
                console.log("Extension save response:", response);
              }
            );
          } catch (e) {
            console.error("Error sending token to extension:", e);
          }
        }
        navigate("/dashboard");
        return;
      }

      // No token anywhere, redirect to login
      navigate("/login");
    };
    handleAuth();
  }, [navigate, location, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-lg">Logging in...</p>
      </div>
    </div>
  );
}
