import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const DashboardCard = ({ title, value, icon = <FaChartBar /> }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center space-x-4">
        <div className="text-primary-dark">{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

export default DashboardCard;
