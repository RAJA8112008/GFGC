// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-primary dark:bg-primary-dark text-white px-4 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-xl font-bold">GFGHub</Link>
      </div>
      <div className="flex space-x-4 items-center">
        {user && (
          <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
        )}
        {user ? (
          <button onClick={logout} className="bg-white text-primary px-3 py-1 rounded">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-white text-primary px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
