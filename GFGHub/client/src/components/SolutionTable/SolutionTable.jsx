import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/helperFunctions';

const SolutionTable = () => {
    const { list } = useSelector((state) => state.solution);
    const solutions = Array.isArray(list) ? list : [];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 text-left">Problem</th>
                        <th className="p-2 text-left">Difficulty</th>
                        <th className="p-2 text-left">Language</th>
                        <th className="p-2 text-left">Repo</th>
                        <th className="p-2 text-left">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {solutions.map((s) => (
                        <tr key={s._id} className="border-t">
                            <td className="p-2">{s.problemName}</td>
                            <td className="p-2">{s.difficulty}</td>
                            <td className="p-2">{s.language}</td>
                            <td className="p-2">{s.repository?.repoName ?? '-'}</td>
                            <td className="p-2">{formatDate(s.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SolutionTable;
