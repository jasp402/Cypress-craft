"use client"

import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeProps } from 'reactflow';
import { motion, AnimatePresence } from "framer-motion";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, Package, Maximize2, Minimize2, X, Info } from "lucide-react"; // Import Info icon
import { Card } from "@/components/ui/card";

// --- Types ---
type ScenarioStep = { keyword: string; text: string; };
type ScenarioDetails = {
  type: string;
  steps: ScenarioStep[];
  examplesCount: number;
  language: string;
};
type NodeData = {
  label: string;
  featurePath?: string;
  scenarioName?: string;
  onDelete: (id: string) => void;
  onOpenDetails: (id: string) => void; // New prop for opening the panel
};
type ExecutionMode = "N" | "S" | "F"; // Normal, Skip, Focus

const StepCard = ({ step }: { step: ScenarioStep }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="bg-white border border-border rounded-lg">
      <Collapsible.Trigger asChild>
        <button className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600">{step.keyword}</span>
              <span className="text-muted-foreground truncate">{step.text}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        {/* Content for the step can go here in the future */}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const ScenarioNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
  const [details, setDetails] = useState<ScenarioDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState<"maximized" | "minimized">("maximized");
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("N");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!data.featurePath || !data.scenarioName) return;
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:4001/api/scenario-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featurePath: data.featurePath, scenarioName: data.scenarioName }),
        });
        if (!response.ok) throw new Error('Failed to fetch scenario details');
        const scenarioData = await response.json();
        setDetails(scenarioData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [data.featurePath, data.scenarioName]);

  const testTypeMatch = data.label.match(/\b\[(happy|unhappy)\]/i);
  const testType = testTypeMatch ? testTypeMatch[1] : 'Happy';

  return (
    <div className={`w-96 transition-all duration-300 ${
      selected ? 'ring-2 ring-blue-400 ring-offset-2 rounded-lg' : ''
    }`}>
      <Handle type="target" position={Position.Left} id="input" className="!bg-slate-400 w-3 h-3" style={{left: -14}} />
      <Handle type="source" position={Position.Right} id="output-success" className="!bg-green-500 w-3 h-3" style={{right: -14, top: 'auto', bottom: 56}} />
      <Handle type="source" position={Position.Right} id="output-failure" className="!bg-red-500 w-3 h-3" style={{right: -14, top: 'auto', bottom: 20}} />

      <Card className="bg-white shadow-lg">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 border border-gray-300 rounded-lg p-2"><Package className="w-5 h-5 text-muted-foreground" /></div>
              <span className="text-sm text-muted-foreground font-medium">{details?.type || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* New Details Button */}
              <button onClick={() => data.onOpenDetails(id)} className="p-2 hover:bg-muted rounded-md">
                <Info className={`w-4 h-4 text-muted-foreground`} />
              </button>
              <button onClick={() => setViewState("maximized")} className="p-2 hover:bg-muted rounded-md" disabled={viewState === "maximized"}><Maximize2 className={`w-4 h-4 ${viewState === "maximized" ? "text-blue-500" : "text-muted-foreground"}`} /></button>
              <button onClick={() => setViewState("minimized")} className="p-2 hover:bg-muted rounded-md" disabled={viewState === "minimized"}><Minimize2 className={`w-4 h-4 ${viewState === "minimized" ? "text-blue-500" : "text-muted-foreground"}`} /></button>
              <button onClick={() => data.onDelete(id)} className="p-2 hover:bg-red-50 rounded-md group"><X className="w-4 h-4 text-muted-foreground group-hover:text-red-500" /></button>
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground mb-2 truncate">TestCase: {id.split('_')[1]}</h1>
            <p className="text-md text-muted-foreground font-light leading-7 text-xl truncate" title={data.label}>{data.label}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
            <div><p className="text-xs text-muted-foreground font-medium mb-1">Environment</p><span className="font-medium text-foreground">{process.env.CYPRESS_environment || 'QA-LIVE'}</span></div>
            <div><p className="text-xs text-muted-foreground font-medium mb-1">Test Type</p><span className="font-medium text-foreground">[{testType}]</span></div>
            <div><p className="text-xs text-muted-foreground font-medium mb-1">Steps</p><span className="font-medium text-foreground">{details?.steps.length || 0}</span></div>
            <div><p className="text-xs text-muted-foreground font-medium mb-1">Examples</p><span className="font-medium text-foreground">{details?.examplesCount || 0}</span></div>
            <div><p className="text-xs text-muted-foreground font-medium mb-1">Feature</p><p className="font-medium text-secondary-foreground truncate">{data.featurePath}</p></div>
          </div>
        </div>

        <AnimatePresence>
          {viewState === "maximized" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
              <div className="bg-gray-50 p-4 m-6 mt-0 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-foreground">TEST BODY</h2>
                  <div className="flex items-center gap-2">
                    {(["N", "S", "F"] as ExecutionMode[]).map(mode => (
                      <button key={mode} onClick={() => setExecutionMode(mode)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                        executionMode === mode ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                      }`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {isLoading ? <p>Loading steps...</p> : details?.steps.map((step, index) => (
                    <StepCard key={index} step={step} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
});

ScenarioNode.displayName = 'ScenarioNode';
