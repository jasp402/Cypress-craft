"use client"

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export const StartNode = memo(({ data, selected }: NodeProps<{ label: string, onStartFlow: () => void }>) => {
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-md p-4 min-w-48 transition-all ${
      selected ? "border-green-600 ring-2 ring-green-200" : "border-green-500"
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <Play className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="font-semibold text-slate-900">{data.label}</h3>
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          data.onStartFlow();
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
      >
        Start Flow
      </Button>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-400" />
    </div>
  );
});

StartNode.displayName = 'StartNode';
