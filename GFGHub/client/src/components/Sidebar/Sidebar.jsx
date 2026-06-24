import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGithub } from '../../hooks/useGithub';

const Sidebar = () => {
  const { repos, loading } = useGithub();

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Repositories</h2>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <NavLink
                to="/solutions"
                className={({ isActive }) =>
                  `block py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-primary text-white' : 'text-gray-800 dark:text-gray-200'
                  }`
                }
              >
                {repo.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
