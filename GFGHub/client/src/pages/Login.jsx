import React from "react";
import { FaGithub } from "react-icons/fa";

const Login = () => {
  const handleLogin = () => {
    // VITE_BACKEND_URL ends with /api, so strip that to get the base
    const backendBase = (import.meta.env.VITE_BACKEND_URL || "https://gfgc-2.onrender.com/api").replace(/\/api\/?$/, "");
    window.location.href = `${backendBase}/api/auth/github`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background radial glowing effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-slate-700/80">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-bold text-3xl shadow-lg shadow-blue-500/20 mb-4">
            G
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-blue-400 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
            GFGHub
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Sync your GeeksforGeeks solutions directly to your GitHub repository in real time.
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3.5 px-5 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaGithub className="text-xl" />
            <span>Login with GitHub</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500">
            Secure connection via GitHub OAuth
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;