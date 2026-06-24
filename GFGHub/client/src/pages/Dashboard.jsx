import React, {
  useEffect,
  useState,
} from "react";

const Dashboard = () => {
  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await fetch(
              `${import.meta.env
                .VITE_BACKEND_URL
              }/dashboard/stats`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          setStats(data);
        } catch (error) {
          console.error(error);
        }
      };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div>
        Loading...
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