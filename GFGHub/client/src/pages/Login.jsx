import React from "react";

const Login = () => {

  const handleLogin = () => {
    // VITE_BACKEND_URL ends with /api, so strip that to get the base
    const backendBase = (import.meta.env.VITE_BACKEND_URL || "https://gfgc-xavx.onrender.com/api").replace(/\/api\/?$/, "");
    window.location.href =
      `${backendBase}/api/auth/github`;
  };

  return (
    <div
      className="
      min-h-screen
      flex
      justify-center
      items-center
      bg-gray-100
    "
    >
      <div
        className="
        bg-white
        p-10
        rounded-xl
        shadow-lg
      "
      >
        <h1
          className="
          text-3xl
          font-bold
          mb-6
          text-center
        "
        >
          GFGHub
        </h1>

        <button
          onClick={handleLogin}
          className="
          w-full
          bg-black
          text-white
          py-3
          rounded-lg
        "
        >
          Login With GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;