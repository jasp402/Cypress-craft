import { useState } from 'react';
import { stepTemplates } from '../data/steps';

interface StepLibraryProps {
  onAddStep: (stepType: string, stepText: string) => void;
}

const iconMap: { [key: string]: string } = {
  Given: 'check_circle',
  When: 'play_circle',
  Then: 'track_changes',
  And: 'add',
};

const colorMap: { [key: string]: string } = {
  Given: 'text-purple-600 hover:bg-purple-50',
  When: 'text-orange-600 hover:bg-orange-50',
  Then: 'text-pink-600 hover:bg-pink-50',
  And: 'text-gray-600 hover:bg-gray-50',
};

function StepLibrary({ onAddStep }: StepLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filterSteps = (steps: string[]) => {
    if (!searchTerm) return steps;
    return steps.filter((step) => step.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <aside className="flex w-80 flex-col border-l border-gray-200/10 bg-background-light/50 dark:bg-background-dark/50">
      <div className="p-4 border-b border-gray-200/10">
        <h2 className="pb-3 pt-1 text-xl font-bold text-gray-900 dark:text-white">Step Library</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-2.5 h-4 w-4 text-gray-400">search</span>
          <input
            placeholder="Search steps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2 py-2 text-sm rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(stepTemplates).map(([type, steps]) => (
          <div key={type}>
            <div className={`flex items-center gap-2 mb-2 ${colorMap[type]}`}>
              <span className="material-symbols-outlined text-base">{iconMap[type]}</span>
              <h3 className="font-semibold text-sm">{type}</h3>
            </div>
            <div className="space-y-1">
              {filterSteps(steps).map((step, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left text-xs h-auto py-2 px-2 rounded ${colorMap[type]}`}
                  onClick={() => onAddStep(type, step)}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default StepLibrary;
