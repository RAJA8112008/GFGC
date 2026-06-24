import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSolution } from '../../redux/slices/solutionSlice.js';
import { DIFFICULTIES, LANGUAGES } from '../../utils/constants.js';

const SolutionForm = () => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        problemName: '',
        difficulty: DIFFICULTIES[0],
        language: LANGUAGES[0],
        topic: '',
        code: '',
        problemUrl: ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(addSolution(form));
        setForm({
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
