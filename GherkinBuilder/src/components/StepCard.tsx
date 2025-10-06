import { useState, useEffect, useMemo } from 'react';
import { Reorder, useMotionValue } from 'framer-motion';
import { generateStepDisplayText } from '../utils/export';

const typeInfo: { [key: string]: { border: string; text: string; } } = {
  given: { border: 'border-sky-500', text: 'text-sky-500' },
  when: { border: 'border-emerald-500', text: 'text-emerald-500' },
  then: { border: 'border-amber-500', text: 'text-amber-500' },
  and: { border: 'border-gray-500', text: 'text-gray-500' },
};

const parseTemplate = (template: string) => {
  const parts = [];
  let lastIndex = 0;
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: template.substring(lastIndex, match.index) });
    }
    const placeholder = match[1];
    if (placeholder === 'dataTable') {
      parts.push({ type: 'dataTable', placeholder });
    } else if (placeholder.includes('|')) {
      parts.push({ type: 'select', placeholder, options: placeholder.split('|') });
    } else {
      parts.push({ type: 'input', placeholder });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < template.length) {
    parts.push({ type: 'text', value: template.substring(lastIndex) });
  }
  return parts;
};

export const StepCard = ({ step, onDelete, onUpdateStep }: { step: any; onDelete: () => void; onUpdateStep: (newValues: string[]) => void; }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { type: stepType, template, values } = step.data;

  const templateParts = useMemo(() => parseTemplate(template), [template]);
  const [paramValues, setParamValues] = useState(values || []);

  useEffect(() => {
    setParamValues(values || []);
  }, [values, step.id]);

  const handleParamChange = (index: number, value: string) => {
    const newParams = [...paramValues];
    newParams[index] = value;
    setParamValues(newParams);
  };

  const handleSave = () => {
    onUpdateStep(paramValues);
    setIsEditing(false);
  };

  const displayText = useMemo(() => generateStepDisplayText(step.data), [step.data]);
  const info = typeInfo[stepType.toLowerCase()] || { border: 'border-gray-400', text: 'text-gray-400' };
  const y = useMotionValue(0);

  return (
      <Reorder.Item value={step} id={step.id} style={{ y }} as="div" className="relative">
        <div className={`group relative mb-3 rounded-lg shadow-md border-l-4 ${info.border} bg-white dark:bg-gray-800`}>
          <div className="p-3">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 pr-10 whitespace-pre-wrap">{displayText}</p>
              <div className="absolute top-1 right-1 flex">
                <button onClick={() => setIsEditing(!isEditing)} className="p-1 rounded-full text-gray-400 hover:bg-gray-500/20 hover:text-primary">
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button onClick={onDelete} className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-500">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>
            <p className={`text-xs font-semibold mt-1 ${info.text}`}>{stepType.toUpperCase()}</p>
          </div>
          {isEditing && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {templateParts.filter(p => p.type !== 'text').map((part, idx) => {
                  if (part.type === 'input') {
                    return (
                        <div key={idx}>
                          <label className="text-xs font-semibold text-gray-500">{part.placeholder}</label>
                          <input type="text" value={paramValues[idx] || ''} onChange={(e) => handleParamChange(idx, e.target.value)} className="mt-1 w-full text-sm p-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                        </div>
                    );
                  } else if (part.type === 'select') {
                    return (
                        <div key={idx}>
                          <label className="text-xs font-semibold text-gray-500">Options</label>
                          <select value={paramValues[idx] || part.options?.[0]} onChange={(e) => handleParamChange(idx, e.target.value)} className="mt-1 w-full text-sm p-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                            {part.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                    );
                  } else if (part.type === 'dataTable') {
                    return (
                        <div key={idx}>
                          <label className="text-xs font-semibold text-gray-500">Data Table</label>
                          <textarea
                              value={paramValues[idx] || ''}
                              onChange={(e) => handleParamChange(idx, e.target.value)}
                              className="mt-1 w-full text-sm p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 font-mono"
                              rows={5}
                              placeholder="| header1 | header2 |\n| value1  | value2  |"
                          />
                        </div>
                    );
                  }
                  return null;
                })}
                <button onClick={handleSave} className="w-full p-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90">Save Parameters</button>
              </div>
          )}
        </div>
      </Reorder.Item>
  );
};