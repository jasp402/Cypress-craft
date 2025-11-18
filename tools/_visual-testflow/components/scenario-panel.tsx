"use client"

import { useEffect, useState } from "react"
import { FileText, X } from "lucide-react"

interface ScenarioPanelProps {
  feature: {
    id: string
    name: string
    path: string
  }
  onClose: () => void
}

const NO_SCENARIOS_MESSAGES = {
  en: "No scenarios found.",
  es: "No se encontraron escenarios.",
};

export function ScenarioPanel({ feature, onClose }: ScenarioPanelProps) {
  const [scenarios, setScenarios] = useState<string[]>([])
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!feature.path) return

    const fetchScenarios = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:4001/api/scenarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ featurePath: feature.path }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { scenarios: newScenarios, language: newLang } = await response.json();
        setScenarios(newScenarios || []);
        setLanguage(newLang || 'en');

      } catch (error) {
        console.error("Failed to fetch scenarios:", error)
        setScenarios([])
        setLanguage('en');
      } finally {
        setIsLoading(false)
      }
    }

    fetchScenarios()
  }, [feature.path])

  const onDragStart = (event: React.DragEvent, scenarioName: string) => {
    const nodeData = JSON.stringify({
      type: 'scenario',
      featurePath: feature.path,
      scenarioName,
      title: scenarioName,
    });
    event.dataTransfer.setData('application/reactflow', nodeData);
    event.dataTransfer.effectAllowed = 'move';
  };

  const noScenariosMessage = NO_SCENARIOS_MESSAGES[language as keyof typeof NO_SCENARIOS_MESSAGES] || NO_SCENARIOS_MESSAGES.en;

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-2rem)] m-4 ml-0">
      <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-900 truncate" title={feature.name}>
          {feature.name}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Loading scenarios...</p>
        ) : scenarios.length > 0 ? (
          scenarios.map((scenario, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-md cursor-grab border border-slate-200"
              onDragStart={(event) => onDragStart(event, scenario)}
              draggable
            >
              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-slate-800">{scenario}</span>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-slate-500">{noScenariosMessage}</p>
        )}
      </div>
    </div>
  )
}
