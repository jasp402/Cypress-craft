import React from 'react';
import { Plugin } from '../App';

interface SidebarProps {
  installedCount: number;
  availablePlugins: Plugin[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ installedCount, availablePlugins, selectedCategory, setSelectedCategory }) => {
  const categories = ['All', ...new Set(availablePlugins.map(p => p.category || 'Other'))];

  return (
    <aside className="w-64 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-8">Package Manager</h1>
      <div className="flex-grow">
        <h2 className="text-sm font-semibold text-subtext-light dark:text-subtext-dark mb-4">STATISTICS</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between items-center text-text-light dark:text-text-dark">
            <span>Installed</span>
            <span className="font-semibold">{installedCount}</span>
          </li>
          <li className="flex justify-between items-center text-text-light dark:text-text-dark">
            <span>Available</span>
            <span className="font-semibold">{availablePlugins.length}</span>
          </li>
        </ul>

        <h2 className="text-sm font-semibold text-subtext-light dark:text-subtext-dark mt-8 mb-4">CATEGORIES</h2>
        <ul className="space-y-1">
          {categories.map(category => {
            const categoryCount = category === 'All' 
              ? availablePlugins.length 
              : availablePlugins.filter(p => (p.category || 'Other') === category).length;
            const isActive = selectedCategory === category;

            return (
              <li key={category}>
                <button 
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex justify-between items-center px-4 py-2 rounded-lg text-left text-sm font-medium ${isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                  <span>{category}</span>
                  <span>{categoryCount}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
