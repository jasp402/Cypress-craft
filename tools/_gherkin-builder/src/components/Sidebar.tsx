"use client";

import React, { useState } from 'react';
import { FileText, ListChecks, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  featuresCount: number;
  scenariosCount: number;
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <li className="flex justify-between items-center text-text-light dark:text-text-dark bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-light">{label}</span>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
        {value}
      </span>
    </li>
  );
}

const Sidebar: React.FC<SidebarProps> = ({ featuresCount, scenariosCount }) => {
  const [collapsed, setCollapsed] = useState(false);
  const logoUrl = new URL('../../assets/img/logo.png', import.meta.url).href;

  return (
    <aside className={`bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col transition-all duration-300 ${collapsed ? 'w-20 p-4' : 'w-64 p-6'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Cypress-craft logo"
            className="w-10 h-10 object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          {!collapsed && (
            <h1 className="text-base font-semibold text-primary">Cypress-craft</h1>
          )}
        </div>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-gray-300"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-800/50 p-3 shadow-sm">
              <FileText className="text-blue-500" size={20} />
            </div>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold px-1.5 min-w-[18px] h-[18px]">
              {featuresCount}
            </span>
          </div>
          <div className="relative">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-800/50 p-3 shadow-sm">
              <ListChecks className="text-green-500" size={20} />
            </div>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold px-1.5 min-w-[18px] h-[18px]">
              {scenariosCount}
            </span>
          </div>
          <div className="w-full h-px bg-border-light dark:bg-border-dark my-2"></div>
        </div>
      ) : (
        <div className="flex-grow">
          <h2 className="text-xs font-medium text-subtext-light dark:text-subtext-dark mb-4 uppercase tracking-wider">
            Statistics
          </h2>
          <ul className="space-y-2 text-sm">
            <StatRow icon={<FileText className="text-blue-500" size={18} />} label="Features (.feature)" value={featuresCount} />
            <StatRow icon={<ListChecks className="text-green-500" size={18} />} label="Scenarios (total)" value={scenariosCount} />
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
