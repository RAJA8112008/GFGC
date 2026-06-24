import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
    const { user } = useAuth();

    return (
        <section className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Welcome to GFGHub</h1>
            <p className="text-lg mb-8">
                Sync your GeeksforGeeks solutions directly to GitHub. Store, manage, and showcase your code effortlessly.
            </p>
            {user ? (
                <Link to="/dashboard" className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark">
                    Go to Dashboard
                </Link>
            ) : (
                <Link to="/login" className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark">
                    Login with GitHub
                </Link>
            )}
        </section>
    );
}
