import { useState, useEffect, useCallback } from 'react';
import WorkflowEditor from './pages/WorkflowEditor';
import FeaturesPage from './pages/FeaturesPage';
import { Node, Edge } from 'react'; // This import is not used, can be removed.

const API_URL = 'http://localhost:3001/api';

export interface Scenario {
  id: string;
  text: string;
  type: string;
  isOutline: boolean;
  examples: string;
  nodes: any[];
  edges: Edge[]; // This is not used in the new model, but keeping for now.
}

export interface Background {
  id: string;
  feature_id: string;
  nodes: any[];
}

export interface Feature {
  id: string;
  name: string;
  scenarios: Scenario[];
  background: Background | null; // Added background
}

export type Page = 'features' | 'editor';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('features');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/features`)
        .then(res => res.json())
        .then(data => setFeatures(data))
        .catch(err => console.error("Failed to fetch features:", err));
  }, []);

  const handleNavigateToEditor = (featureId: string) => {
    setEditingFeatureId(featureId);
    setCurrentPage('editor');
  };

  const handleCreateFeature = async (name: string) => {
    const newFeatureId = `feature_${Date.now()}`;
    const response = await fetch(`${API_URL}/features`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newFeatureId, name }),
    });
    const createdFeature = await response.json();
    setFeatures(prev => [...prev, createdFeature]);
    handleNavigateToEditor(newFeatureId);
  };

  const handleDeleteFeature = async (featureId: string) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId));
    await fetch(`${API_URL}/features/${featureId}`, { method: 'DELETE' });
  };

  const handleNavigateToFeatures = () => {
    setEditingFeatureId(null);
    setCurrentPage('features');
  };

  const updateFeatureInState = (featureId: string, featureUpdater: (prevFeature: Feature) => Feature) => {
    setFeatures(prevFeatures => prevFeatures.map(f =>
        f.id === featureId ? featureUpdater(f) : f
    ));
  };

  const editingFeature = features.find(f => f.id === editingFeatureId);

  return (
      <div className="App">
        {currentPage === 'features' && (
            <FeaturesPage
                features={features}
                onCreateFeature={handleCreateFeature}
                onNavigateToEditor={handleNavigateToEditor}
                onDeleteFeature={handleDeleteFeature}
            />
        )}
        {currentPage === 'editor' && editingFeature && (
            <WorkflowEditor
                key={editingFeature.id}
                feature={editingFeature}
                onNavigateBack={handleNavigateToFeatures}
                updateFeatureInState={updateFeatureInState}
                API_URL={API_URL}
            />
        )}
      </div>
  );
}

export default App;