import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addSolution } from '../../redux/slices/solutionSlice.js';
import { DIFFICULTIES, LANGUAGES } from '../../utils/constants.js';
import githubAPI from '../../services/githubAPI.js';

const SolutionForm = () => {
    const dispatch = useDispatch();
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [form, setForm] = useState({
        repositoryId: '',
        problemName: '',
        difficulty: DIFFICULTIES[0],
        language: LANGUAGES[0],
        topic: '',
        code: '',
        problemUrl: ''
    });

    // Fetch repositories on mount
    useEffect(() => {
        const loadRepos = async () => {
            try {
                const data = await githubAPI.getRepos();
                setRepos(Array.isArray(data) ? data : []);
                // Auto-select the first repo if available
                if (Array.isArray(data) && data.length > 0) {
                    setForm((prev) => ({ ...prev, repositoryId: data[0]._id }));
                }
            } catch (error) {
                console.error('Failed to fetch repos:', error);
                setRepos([]);
            } finally {
                setLoadingRepos(false);
            }
        };
        loadRepos();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.repositoryId) {
            alert('Please select a repository first.');
            return;
        }
        dispatch(addSolution(form));
        setForm({
            repositoryId: form.repositoryId, // keep the selected repo
            problemName: '',
            difficulty: DIFFICULTIES[0],
            language: LANGUAGES[0],
            topic: '',
            code: '',
            problemUrl: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
            {/* Repository selector */}
            <select
                name="repositoryId"
                value={form.repositoryId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            >
                <option value="" disabled>
                    {loadingRepos ? 'Loading repositories...' : 'Select a repository'}
                </option>
                {repos.map((r) => (
                    <option key={r._id} value={r._id}>
                        {r.repoName}
                    </option>
                ))}
            </select>

            <input
                name="problemName"
                placeholder="Problem Name"
                value={form.problemName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />
            <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-2 border rounded">
                {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                        {d}
                    </option>
                ))}
            </select>
            <select name="language" value={form.language} onChange={handleChange} className="w-full p-2 border rounded">
                {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                        {l}
                    </option>
                ))}
            </select>
            <input
                name="topic"
                placeholder="Topic Tags (comma separated)"
                value={form.topic}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <textarea
                name="code"
                placeholder="Solution Code"
                rows={8}
                value={form.code}
                onChange={handleChange}
                className="w-full p-2 border rounded font-mono"
                required
            />
            <input
                name="problemUrl"
                placeholder="Problem URL"
                value={form.problemUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                Submit Solution
            </button>
        </form>
    );
};

export default SolutionForm;
