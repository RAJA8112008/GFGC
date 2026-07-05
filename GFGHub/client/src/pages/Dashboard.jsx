import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaCode,
  FaCheckCircle,
  FaFire,
  FaSignOutAlt,
  FaGithub,
  FaListAlt,
  FaFolder,
  FaPlusCircle
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("gfghub_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      setFetching(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.error("Failed to fetch stats", response.status);
          setStats({ error: true });
          return;
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        setStats({ error: true });
      } finally {
        setFetching(false);
      }
    };
    fetchStats();
  }, [navigate]);

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Premium Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-bold text-lg">
                G
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                GFGHub
              </span>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-slate-700"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-slate-300">
                    {user.username}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-1.5 rounded-lg text-sm transition-all"
              >
                <FaSignOutAlt className="text-xs" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Welcome back, {user?.username || "Coder"}!
            </h1>
            <p className="text-slate-400 max-w-xl text-sm sm:text-base">
              Monitor your synced GeeksforGeeks solutions. Track your coding progress across different difficulty tiers and sync with your GitHub repositories.
            </p>
          </div>
        </div>

        {/* Quick Actions / Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/solutions"
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
              <FaPlusCircle className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Submit Solution</h3>
              <p className="text-xs text-slate-400">Add a new GFG solution</p>
            </div>
          </Link>

          <Link
            to="/repositories"
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FaFolder className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Repositories</h3>
              <p className="text-xs text-slate-400">Manage connected repositories</p>
            </div>
          </Link>

          <Link
            to="/solutions"
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
              <FaListAlt className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">View History</h3>
              <p className="text-xs text-slate-400">View all submitted solution logs</p>
            </div>
          </Link>
        </div>

        {/* Statistics Section */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>Overview Statistics</span>
          <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
        </h2>

        {fetching ? (
          // Loading Skeleton
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-slate-900 border border-slate-800 p-6 rounded-xl h-28" />
            ))}
          </div>
        ) : stats?.error ? (
          <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl text-center">
            <p className="text-red-400 font-medium">Failed to load statistics.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800 px-3 py-1 rounded transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Solutions */}
            <div className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-blue-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[20px] pointer-events-none group-hover:bg-blue-500/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <FaCode className="text-base" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">{stats.total || 0}</p>
                <p className="text-xs text-slate-400 mt-1">solutions synced</p>
              </div>
            </div>

            {/* Easy Solutions */}
            <div className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-[20px] pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Easy</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FaCheckCircle className="text-base" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">{stats.easy || 0}</p>
                <p className="text-xs text-emerald-400 mt-1">easy level</p>
              </div>
            </div>

            {/* Medium Solutions */}
            <div className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-amber-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[20px] pointer-events-none group-hover:bg-amber-500/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Medium</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <FaCode className="text-base" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">{stats.medium || 0}</p>
                <p className="text-xs text-amber-400 mt-1">medium level</p>
              </div>
            </div>

            {/* Hard Solutions */}
            <div className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-red-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-[20px] pointer-events-none group-hover:bg-red-500/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hard</span>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <FaFire className="text-base" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">{stats.hard || 0}</p>
                <p className="text-xs text-red-400 mt-1">hard level</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Call to Action */}
        {!fetching && !stats?.error && stats?.total === 0 && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-xl">
            <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4">
              <FaGithub className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No solutions synced yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              To begin automatic synchronization of your GeeksforGeeks solutions, make sure to load your chrome extension, configure a Github PAT or repository, and start solving!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/solutions"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all"
              >
                Add Solution Manually
              </Link>
              <Link
                to="/repositories"
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm px-5 py-2.5 rounded-lg transition-all"
              >
                Configure Repository
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;