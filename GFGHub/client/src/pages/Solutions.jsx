import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import SolutionForm from '../components/SolutionForm/SolutionForm.jsx';
import SolutionTable from '../components/SolutionTable/SolutionTable.jsx';
import { fetchSolutions } from '../redux/slices/solutionSlice.js';

export default function Solutions() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSolutions());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Submit a New Solution</h2>
                    <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm">
                        &larr; Back to Dashboard
                    </Link>
                </div>
                <SolutionForm />
                <h2 className="text-2xl font-semibold mt-8">Your Solutions</h2>
                <SolutionTable />
            </div>
        </div>
    );
}
