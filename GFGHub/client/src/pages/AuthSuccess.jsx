import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "https://gfgc-xavx.onrender.com/api").replace(/\/api\/?$/, "");
export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

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
        // Save token in frontend localStorage
        localStorage.setItem("gfghub_token", token);
        // Send token to extension also
        if (window.chrome?.runtime) {
          chrome.runtime.sendMessage(
            "gpbhnakdinjgcpblbcgcdaacjknhpenb",
            { type: "SAVE_TOKEN", token },
            (response) => {
              console.log("Extension save response:", response);
              navigate("/dashboard");
            }
          );
        } else {
          navigate("/dashboard");
        }
        return;
      }

      // No token anywhere, redirect to login
      navigate("/login");
    };
    handleAuth();
  }, [navigate, location]);

  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      Logging in...
    </div>
  );
}


