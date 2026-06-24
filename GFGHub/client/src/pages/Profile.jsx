import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <section className="max-w-md mx-auto text-center">
            <img src={user.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <button onClick={logout} className="mt-4 bg-primary text-white px-4 py-2 rounded">
                Logout
            </button>
        </section>
    );
}
