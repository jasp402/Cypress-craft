import { motion, AnimatePresence } from 'framer-motion';
import { Scenario } from '../App';
import { useEffect, useState } from 'react';

interface ScenarioSettingsPanelProps {
  scenario: Scenario | null;
  onClose: () => void;
  onUpdate: (id: string, newName: string, newType: string, isOutline: boolean, examples: string) => void;
}

export function ScenarioSettingsPanel({ scenario, onClose, onUpdate }: ScenarioSettingsPanelProps) {
  const [data, setData] = useState(scenario);

  useEffect(() => {
    setData(scenario);
  }, [scenario]);

  if (!data) return null;

  const handleUpdate = () => {
    onUpdate(data.id, data.text, data.type, data.isOutline, data.examples);
    onClose();
  };

  return (
    <AnimatePresence>
      {scenario && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 h-full w-96 bg-background-light dark:bg-background-dark shadow-2xl z-20 border-l border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Scenario Settings</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-500/20">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 space-y-6 flex-grow overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scenario Name</label>
              <input type="text" value={data.text} onChange={(e) => setData({ ...data, text: e.target.value })} className="mt-1 w-full text-sm p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scenario Type</label>
              <select value={data.type} onChange={(e) => setData({ ...data, type: e.target.value })} className="mt-1 w-full text-sm p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <option>Happy</option>
                <option>UnHappy</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
              <label htmlFor="is-outline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scenario Outline</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" checked={data.isOutline} onChange={(e) => setData({ ...data, isOutline: e.target.checked })} id="is-outline" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label htmlFor="is-outline" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
              </div>
            </div>

            <AnimatePresence>
              {data.isOutline && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Examples</label>
                  <textarea 
                    value={data.examples} 
                    onChange={(e) => setData({ ...data, examples: e.target.value })} 
                    className="mt-1 w-full text-sm p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 font-mono" 
                    rows={8}
                    placeholder="| user_type | password |\n| admin       | pass123  |\n| guest       | pass456  |"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleUpdate} className="w-full p-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
