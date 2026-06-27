import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("gfghub_token");
  console.log("Dashboard token:", token);
  if (!token) {
    // No token, redirect to login
    navigate("/login");
    // Show loading until navigation occurs
    return;
  }
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.error('Failed to fetch stats', response.status);
          setStats({ error: true });
          return;
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        setStats({ error: true });
      }
    };
    fetchStats();
  }, [navigate]);

  if (!stats) {
    return (
      <div>Loading...</div>
    );
  }

  if (stats.error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <p className="text-red-600">Failed to load statistics. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="p-6 shadow rounded bg-white">
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>

        <div className="p-6 shadow rounded bg-white">
          <h3>Easy</h3>
          <p>{stats.easy}</p>
        </div>

        <div className="p-6 shadow rounded bg-white">
          <h3>Medium</h3>
          <p>{stats.medium}</p>
        </div>

        <div className="p-6 shadow rounded bg-white">
          <h3>Hard</h3>
          <p>{stats.hard}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;