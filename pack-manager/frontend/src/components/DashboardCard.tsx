import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'indigo'; // Nueva prop para el color
}

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-500',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-500',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/50',
    text: 'text-indigo-500',
  },
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  const colors = colorMap[color];

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors.bg}`}>
          <span className={`material-icons ${colors.text}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
