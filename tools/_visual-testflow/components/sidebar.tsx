"use client"
import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react"

// --- Data Fetching and Transformation ---

// Matches the structure from the /api/features endpoint
interface BackendTreeNode {
  name: string;
  isDirectory: boolean;
  path?: string;
  children?: BackendTreeNode[];
}

// The structure the component uses internally
interface FeatureItem {
  id: string
  name: string
  type: "folder" | "file"
  children?: FeatureItem[]
  path?: string
}

// Recursively transforms backend data into the component's desired format
const transformData = (node: BackendTreeNode): FeatureItem => {
  const id = node.path || node.name; // Use path for files, name for folders as a unique key
  return {
    id,
    name: node.name,
    type: node.isDirectory ? "folder" : "file",
    path: node.path,
    children: node.children?.map(transformData),
  };
};

// --- Components ---

interface TreeItemProps {
  item: FeatureItem
  level: number
  onSelectFeature: (feature: FeatureItem) => void
}

function TreeItem({ item, level, onSelectFeature }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first few levels

  const handleToggle = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded)
    }
  }

  const handleSelect = () => {
    if (item.type === "file") {
      onSelectFeature(item)
    } else {
      handleToggle()
    }
  }

  const onDragStart = (event: React.DragEvent, node: FeatureItem) => {
    if (node.type !== 'file' || !node.path) return;
    // This is the data that will be available on drop
    const nodeData = JSON.stringify({ type: 'feature', featurePath: node.path, title: node.name });
    event.dataTransfer.setData('application/reactflow', nodeData);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded cursor-pointer group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
        onDragStart={(event) => onDragStart(event, item)}
        draggable={item.type === "file"}
      >
        {item.type === "folder" ? (
          <>
            <button
              className="flex-shrink-0 p-0 hover:bg-slate-200 rounded"
              onClick={(e) => {
                e.stopPropagation() // Prevent handleSelect from firing
                handleToggle()
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 truncate">{item.name}</span>
          </>
        ) : (
          <>
            {/* Indentation spacer */}
            <div className="w-4 flex-shrink-0" /> 
            <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 truncate">{item.name}</span>
          </>
        )}
      </div>

      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <TreeItem key={child.id} item={child} level={level + 1} onSelectFeature={onSelectFeature} />
          ))}
        </div>
      )}
    </div>
  )
}

interface FeaturesSidebarProps {
  // onSelectFeature is kept as the user might want to implement a feature with it later
  onSelectFeature?: (feature: FeatureItem) => void;
}

export function FeaturesSidebar({ onSelectFeature = () => {} }: FeaturesSidebarProps) {
  const [features, setFeatures] = useState<FeatureItem[]>([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/features');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BackendTreeNode[] = await response.json();
        const transformedData = data.map(transformData);
        setFeatures(transformedData);
      } catch (error) {
        console.error("Failed to fetch features:", error);
        // Optionally, set some error state to show in the UI
      }
    };

    fetchFeatures();
  }, []);

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-2rem)] m-4">
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Features</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {features.length > 0 ? (
          features.map((item) => (
            <TreeItem key={item.id} item={item} level={0} onSelectFeature={onSelectFeature} />
          ))
        ) : (
          <p className="p-4 text-sm text-slate-500">Loading features...</p>
        )}
      </div>
    </div>
  )
}
