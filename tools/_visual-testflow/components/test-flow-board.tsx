"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from "framer-motion";
import io from 'socket.io-client';

import { Header } from "./header";
import { StartNode } from "./nodes/start-node";
import { ScenarioNode, NodeStatus } from "./nodes/scenario-node";
import { X } from 'lucide-react';

// --- Type Definitions ---
type CustomNodeData = {
  label: string;
  description?: string;
  featurePath?: string;
  scenarioName?: string;
  status?: NodeStatus;
  onDelete: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onStartFlow: () => void;
};
type CustomNode = Node<CustomNodeData>;

// --- Initial State ---
const initialNodes: CustomNode[] = [
  { 
    id: "start-1", 
    type: 'start',
    position: { x: 50, y: 150 }, 
    data: { 
      label: "Start Test Flow",
      onDelete: () => {},
      onOpenDetails: () => {},
      onStartFlow: () => {},
    } 
  },
];

let idCounter = 1;
const getNewNodeId = () => `node_${idCounter++}`;

// --- Main Component ---
export function TestFlowBoard() {
  const nodeTypes = useMemo(() => ({ start: StartNode, scenario: ScenarioNode }), []);

  const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

  // --- Socket.IO Connection for Real-time Updates ---
  useEffect(() => {
    const socket = io("http://localhost:4001");

    socket.on('connect', () => {
      console.log('Socket.IO connected!');
    });

    socket.on('status-update', ({ scenarioName, status }) => {
      console.log(`FRONTEND: Received status '${status}' for '${scenarioName}'`);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.data.scenarioName === scenarioName) {
            return { ...node, data: { ...node.data, status: status as NodeStatus } };
          }
          return node;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // --- React Flow Handlers ---
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback((connection) => {
    if (connection.source === 'start-1' && edges.some(edge => edge.source === 'start-1')) {
      return;
    }
    const edge = { ...connection, type: 'smoothstep', animated: true, style: { strokeWidth: 2 } };
    setEdges((eds) => addEdge(edge, eds));
  }, [edges, setEdges]);

  // --- UI Interaction Handlers ---
  const openDetailsPanel = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) setSelectedNode(node);
  };

  const closePanel = () => setSelectedNode(null);

  const deleteNode = (id: string) => {
    if (id === 'start-1') return;
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    if (selectedNode?.id === id) closePanel();
  };

  // --- Drag and Drop Logic ---
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const dataString = event.dataTransfer.getData('application/reactflow');
    if (!dataString) return;

    const { featurePath, scenarioName, title } = JSON.parse(dataString);
    const position = { x: event.clientX - 350, y: event.clientY - 50 };

    const newNode: CustomNode = {
      id: getNewNodeId(),
      type: 'scenario',
      position,
      data: {
        label: title,
        description: `From: ${featurePath}`,
        featurePath,
        scenarioName,
        onDelete: deleteNode,
        onOpenDetails: openDetailsPanel,
        onStartFlow: () => {},
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // --- Workflow Execution ---
  const handleStartFlow = async () => {
    // 1. Reset all node statuses to idle
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle'} })));

    // 2. Send the entire workflow to the backend
    try {
      const response = await fetch('http://localhost:4001/api/run-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        console.error("Failed to start workflow:", errorResult.message);
        // Optionally, show an error toast to the user
        return;
      }

      const result = await response.json();
      console.log("Workflow execution initiated:", result.message);
      // The frontend now just waits for socket events

    } catch (error) {
      console.error("Error calling run-workflow API:", error);
    }
  };

  const nodesWithCallbacks = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onDelete: deleteNode,
        onOpenDetails: openDetailsPanel,
        onStartFlow: handleStartFlow, // Connect the main function
      }
    }))
  }, [nodes, edges]); // Add edges to dependency array

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50">
      <Header onStartFlow={handleStartFlow} />
      <div className="flex-1 relative overflow-hidden"> 
        <ReactFlow
          nodes={nodesWithCallbacks} 
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={closePanel}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
        >
          <Background />
          <Controls />
        </ReactFlow>

        <AnimatePresence>
          {selectedNode && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePanel}
                className="absolute inset-0 bg-black/30 z-10"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl z-20"
              >
                <div className="p-6 overflow-y-auto h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Node Details</h3>
                    <button onClick={closePanel} className="p-1 hover:bg-slate-100 rounded-md">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-mono">ID: {selectedNode.id}</p>
                    <p className="text-lg text-slate-800 font-semibold">{selectedNode.data.label}</p>
                    {selectedNode.data.featurePath && <p className="text-sm text-slate-500 font-mono mt-1 break-words">{selectedNode.data.featurePath}</p>}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
