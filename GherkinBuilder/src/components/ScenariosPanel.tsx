import { useState, useEffect } from 'react';
import { Scenario } from "../App";
import { Reorder, AnimatePresence } from 'framer-motion';

interface ScenariosPanelProps {
  scenarios: Scenario[];
  onAddScenario: () => void;
  onSelectScenario: (id: string) => void;
  onDeleteScenario: (id: string) => void;
  onUpdateScenario: (id: string, newName: string) => void;
  onOpenSettings: (id: string) => void;
  onReorderScenarios: (reorderedScenarios: Scenario[]) => void;
  selectedScenarioId: string | null;
}

function ScenariosPanel({ scenarios, onAddScenario, onSelectScenario, onDeleteScenario, onUpdateScenario, onOpenSettings, onReorderScenarios, selectedScenarioId }: ScenariosPanelProps) {
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const lastScenario = scenarios[scenarios.length - 1];
    if (lastScenario && lastScenario.text === "New Scenario" && lastScenario.id !== editingScenarioId) {
      setEditingScenarioId(lastScenario.id);
      setEditingText(lastScenario.text);
    }
  }, [scenarios, editingScenarioId]);

  const handleDeleteClick = (e: React.MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      onDeleteScenario(scenarioId);
    }
  };

  const handleSettingsClick = (e: React.MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    onOpenSettings(scenarioId);
  };

  const handleDoubleClick = (scenario: Scenario) => {
    setEditingScenarioId(scenario.id);
    setEditingText(scenario.text);
  };

  const handleNameBlur = (scenarioId: string) => {
    if (editingText.trim()) {
      onUpdateScenario(scenarioId, editingText.trim());
    }
    setEditingScenarioId(null);
    setEditingText('');
  };

  return (
      <aside className="flex w-80 flex-col bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark p-4">
        <div className="flex items-center justify-between pb-3 pt-1">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Scenarios</h2>
          <button onClick={onAddScenario} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Scenario</span>
          </button>
        </div>
        <Reorder.Group as="div" axis="y" values={scenarios} onReorder={onReorderScenarios} className="flex-1 space-y-2 overflow-y-auto">
          <AnimatePresence>
            {scenarios.map((scenario, index) => {
              const isActive = scenario.id === selectedScenarioId;
              const positionalId = `CP${String(index + 1).padStart(3, '0')}`;
              const isEditing = scenario.id === editingScenarioId;

              return (
                  <Reorder.Item key={scenario.id} value={scenario} as="div" layoutId={scenario.id}>
                    <div
                        onClick={() => onSelectScenario(scenario.id)}
                        onDoubleClick={() => handleDoubleClick(scenario)}
                        className={`group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-gray-500/10'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-primary/20 text-primary dark:bg-primary/30' : 'bg-gray-500/10'}`}>
                          <span className="material-symbols-outlined">list_alt</span>
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                              <input
                                  type="text"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  onBlur={() => handleNameBlur(scenario.id)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleNameBlur(scenario.id)}
                                  className="w-full bg-transparent border-b border-primary focus:outline-none"
                                  autoFocus
                              />
                          ) : (
                              <p className={`text-text-light dark:text-text-dark ${isActive ? 'font-semibold' : 'font-medium'}`}>{`${positionalId}: ${scenario.text} [${scenario.type}]`}</p>
                          )}
                          <p className={`text-sm ${isActive ? 'text-subtext-light dark:text-subtext-dark' : 'text-subtext-light dark:text-subtext-dark'}`}>{isActive ? 'Active Scenario' : 'Inactive'}</p>
                        </div>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleSettingsClick(e, scenario.id)} className="text-gray-400 hover:text-primary dark:hover:text-primary p-1">
                          <span className="material-symbols-outlined">settings</span>
                        </button>
                        <button onClick={(e) => handleDeleteClick(e, scenario.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
              );
            })}
          </AnimatePresence>
        </Reorder.Group>
      </aside>
  );
}

export default ScenariosPanel;