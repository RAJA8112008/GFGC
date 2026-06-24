import React from 'react';
import SolutionForm from '../components/SolutionForm/SolutionForm.jsx';
import SolutionTable from '../components/SolutionTable/SolutionTable.jsx';

export default function Solutions() {
    return (
        <section className="space-y-8">
            <h2 className="text-2xl font-semibold">Submit a New Solution</h2>
            <SolutionForm />
            <h2 className="text-2xl font-semibold mt-8">Your Solutions</h2>
            <SolutionTable />
        </section>
    );
}
