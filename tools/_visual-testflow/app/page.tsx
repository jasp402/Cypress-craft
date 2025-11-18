"use client"

import { useState } from "react"
import { TestFlowBoard } from "@/components/test-flow-board"
import { FeaturesSidebar } from "@/components/sidebar"
import { ScenarioPanel } from "@/components/scenario-panel"

// Type for the feature object that will be passed around
interface SelectedFeature {
  id: string;
  name: string;
  path: string;
}

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  const handleSelectFeature = (feature: SelectedFeature) => {
    // If the same feature is clicked again, deselect it to close the panel
    if (selectedFeature && selectedFeature.id === feature.id) {
      setSelectedFeature(null);
    } else {
      setSelectedFeature(feature);
    }
  };

  const handleClosePanel = () => {
    setSelectedFeature(null);
  };

  return (
    <main className="w-full h-screen bg-slate-50 flex items-start">
      <FeaturesSidebar onSelectFeature={handleSelectFeature} />
      
      {selectedFeature && (
        <ScenarioPanel 
          feature={selectedFeature} 
          onClose={handleClosePanel} 
        />
      )}

      <div className="flex-1 h-full">
        <TestFlowBoard />
      </div>
    </main>
  )
}
