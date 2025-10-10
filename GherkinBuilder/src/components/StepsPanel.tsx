import { useState } from 'react';
import { stepTemplates } from '../data/steps';
import { KEYWORDS } from '../utils/keywords';

interface StepLibraryProps {
  onAddStep: (stepType: string, stepText: string) => void;
  language?: 'es' | 'en';
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

function StepLibrary({ onAddStep, language = 'es' }: StepLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filterSteps = (steps: string[]) => {
    if (!searchTerm) return steps;
    return steps.filter((step) => step.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <aside className="flex w-80 flex-col bg-card-light dark:bg-card-dark border-l border-border-light dark:border-border-dark">
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="pb-3 pt-1 text-xl font-bold text-text-light dark:text-text-dark">Step Library</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-2.5 h-4 w-4 text-gray-400">search</span>
          <input
            placeholder="Search steps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2 py-2 text-sm rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(stepTemplates).map(([type, steps]) => {
          const kw = KEYWORDS[language];
          const displayType = type === 'Given' ? kw.given : type === 'When' ? kw.when : type === 'Then' ? kw.then : type;
          return (
          <div key={type}>
            <div className={`flex items-center gap-2 mb-2 ${colorMap[type]}`}>
              <span className="material-symbols-outlined text-base">{iconMap[type]}</span>
              <h3 className="font-semibold text-sm">{displayType}</h3>
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
          );
        })}
      </div>
    </aside>
  );
}

export default StepLibrary;
