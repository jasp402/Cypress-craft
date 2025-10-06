import { useState, useCallback } from 'react';
import ScenariosPanel from '../components/ScenariosPanel';
import StepLibrary from '../components/StepsPanel';
import { Feature, Scenario } from '../App';
import { ScenarioColumn } from '../components/ScenarioColumn';
import BddCodePanel from '../components/BddCodePanel';
import { AnimatePresence, Reorder } from 'framer-motion';
import { ScenarioSettingsPanel } from '../components/ScenarioSettingsPanel';

// --- Main Workflow Editor Component ---

const getUniqueNodeId = () => `step_${Date.now()}_${Math.random()}`;

function WorkflowEditor({ feature, onNavigateBack, updateFeatureInState, API_URL }: { 
  feature: Feature; 
  onNavigateBack: () => void; 
  updateFeatureInState: (featureId: string, featureUpdater: (prevFeature: Feature) => Feature) => void;
  API_URL: string;
}) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);

  const selectedScenario = feature.scenarios.find(s => s.id === selectedScenarioId) || null;
  const scenarioToEdit = feature.scenarios.find(s => s.id === editingScenarioId) || null;

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
  };

  // --- API-Driven Handlers ---

  const handleAddScenario = async () => {
    const newId = `scenario_${Date.now()}`;
    const newScenarioData: Omit<Scenario, 'nodes' | 'edges'> = { 
      id: newId, text: "New Scenario", type: "Happy", isOutline: false, examples: '',
    };
    
    // BUG FIX: Correctly update the feature's scenarios array within the feature object
    updateFeatureInState(feature.id, (prevFeature) => ({
      ...prevFeature,
      scenarios: [...prevFeature.scenarios, { ...newScenarioData, nodes: [], edges: [] }]
    }));
    handleSelectScenario(newId);

    await fetch(`${API_URL}/features/${feature.id}/scenarios`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newScenarioData, idx: feature.scenarios.length }),
    });
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    // BUG FIX: Correctly update the feature's scenarios array within the feature object
    updateFeatureInState(feature.id, (prevFeature) => ({
      ...prevFeature,
      scenarios: prevFeature.scenarios.filter(sc => sc.id !== scenarioId)
    }));
    if (selectedScenarioId === scenarioId) setSelectedScenarioId(null);
    if (editingScenarioId === scenarioId) setEditingScenarioId(null);

    await fetch(`${API_URL}/scenarios/${scenarioId}`, { method: 'DELETE' });
  };

  const handleUpdateScenario = async (scenarioId: string, newName: string, newType?: string, isOutline?: boolean, examples?: string) => {
    const scenario = feature.scenarios.find(sc => sc.id === scenarioId);
    if (!scenario) return;

    const updatedData = { text: newName, type: newType ?? scenario.type, isOutline: isOutline ?? scenario.isOutline, examples: examples ?? scenario.examples };
    // BUG FIX: Correctly update the feature's scenarios array within the feature object
    updateFeatureInState(feature.id, (prevFeature) => ({
      ...prevFeature,
      scenarios: prevFeature.scenarios.map(sc => sc.id === scenarioId ? { ...sc, ...updatedData } : sc)
    }));

    await fetch(`${API_URL}/scenarios/${scenarioId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
  };

  const handleReorderScenarios = (reorderedScenarios: Scenario[]) => {
    // BUG FIX: Correctly update the feature's scenarios array within the feature object
    updateFeatureInState(feature.id, (prevFeature) => ({
      ...prevFeature,
      scenarios: reorderedScenarios
    }));
    fetch(`${API_URL}/features/${feature.id}/reorder`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarios: reorderedScenarios.map(s => s.id) })
    });
  };

  const updateScenarioNodes = useCallback(async (scenarioId: string, nodes: any[]) => {
    // BUG FIX: Correctly update the feature's scenarios array within the feature object
    updateFeatureInState(feature.id, (prevFeature) => ({
      ...prevFeature,
      scenarios: prevFeature.scenarios.map(sc => sc.id === scenarioId ? { ...sc, nodes } : sc)
    }));
    await fetch(`${API_URL}/scenarios/${scenarioId}/nodes`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes }),
    });
  }, [feature.id, updateFeatureInState, API_URL]);

  const handleReorderSteps = (scenarioId: string, reorderedSteps: any[]) => {
    const updatedNodes = reorderedSteps.map((node, index) => ({ ...node, position: { ...node.position, y: index * 100 } }));
    updateScenarioNodes(scenarioId, updatedNodes);
  };

  const handleAddStep = (stepType: string, stepTemplate: string) => {
    if (!selectedScenarioId || !selectedScenario) return;
    const placeholderRegex = new RegExp('\\{([^}]+)\\}', 'g');
    const placeholders = stepTemplate.match(placeholderRegex) || [];
    const newStep = {
      id: getUniqueNodeId(), type: 'stepNode', position: { x: 0, y: (selectedScenario.nodes.length + 1) * 100 },
      data: { type: stepType, template: stepTemplate, values: new Array(placeholders.length).fill('') },
    };
    updateScenarioNodes(selectedScenarioId, [...selectedScenario.nodes, newStep]);
  };

  const handleDeleteStep = (stepId: string, scenarioId: string) => {
    const targetScenario = feature.scenarios.find(sc => sc.id === scenarioId);
    if (!targetScenario) return;
    const updatedNodes = targetScenario.nodes.filter(node => node.id !== stepId);
    updateScenarioNodes(scenarioId, updatedNodes);
  };

  const handleUpdateStep = (stepId: string, newValues: string[], scenarioId: string) => {
    const targetScenario = feature.scenarios.find(sc => sc.id === scenarioId);
    if (!targetScenario) return;
    const updatedNodes = targetScenario.nodes.map(node => node.id === stepId ? { ...node, data: { ...node.data, values: newValues } } : node);
    updateScenarioNodes(scenarioId, updatedNodes);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200/10 bg-background-light/80 px-6 backdrop-blur-sm dark:bg-background-dark/80">
        <div className="flex items-center gap-4">
            <button onClick={onNavigateBack} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
                <span>Back</span>
            </button>
            <div className="h-6 border-l border-gray-200/50 dark:border-gray-700/50"></div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.name}.feature</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <ScenariosPanel scenarios={feature.scenarios} onAddScenario={handleAddScenario} onSelectScenario={handleSelectScenario} onDeleteScenario={handleDeleteScenario} onUpdateScenario={handleUpdateScenario} onOpenSettings={setEditingScenarioId} onReorderScenarios={handleReorderScenarios} selectedScenarioId={selectedScenarioId} />
        <main className="flex-1 grid grid-rows-[1fr_auto]">
            <div className="overflow-x-auto p-6">
                <div className="flex gap-6 h-full">
                  <AnimatePresence>
                    <Reorder.Group as="div" axis="x" values={feature.scenarios} onReorder={handleReorderScenarios} className="flex gap-6 h-full">
                      {feature.scenarios.map(scenario => (
                          <Reorder.Item key={scenario.id} value={scenario} as="div">
                            <ScenarioColumn 
                              scenario={scenario} 
                              isSelected={scenario.id === selectedScenarioId}
                              onDeleteStep={(stepId) => handleDeleteStep(stepId, scenario.id)} 
                              onUpdateStep={(stepId, newValues) => handleUpdateStep(stepId, newValues, scenario.id)} 
                              onReorderSteps={(reorderedSteps) => handleReorderSteps(scenario.id, reorderedSteps)}
                            />
                          </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </AnimatePresence>
                </div>
            </div>
            <BddCodePanel feature={feature} selectedScenario={selectedScenario} />
          </main>
          <StepLibrary onAddStep={handleAddStep} />
          <ScenarioSettingsPanel scenario={scenarioToEdit} onClose={() => setEditingScenarioId(null)} onUpdate={handleUpdateScenario} />
        </div>
      </div>
  );
}

export default WorkflowEditor;
