import React, { useState } from 'react';
import githubAPI from '../services/githubAPI';
import { useGithub } from '../hooks/useGithub';

export default function Repository() {
    const { repos, fetchRepos } = useGithub();
    const [newRepo, setNewRepo] = useState('');

    const handleCreate = async () => {
        await githubAPI.createRepo({ name: newRepo });
        setNewRepo('');
        fetchRepos();
    };

    return (
        <section className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your GitHub Repositories</h2>

            <ul className="space-y-2 mb-6">
                {repos.map((r) => (
                    <li key={r.id} className="p-2 border rounded">
                        <a href={r.html_url} target="_blank" rel="noreferrer" className="text-primary">
                            {r.name}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="New repo name"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <button onClick={handleCreate} className="bg-primary text-white px-4 rounded">
                    Create
                </button>
            </div>
        </section>
    );
}
