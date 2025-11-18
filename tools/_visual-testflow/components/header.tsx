"use client"

import { Play } from "lucide-react"

interface HeaderProps {
  onStartFlow: () => void;
}

export function Header({ onStartFlow }: HeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Test Flow Orchestrator</h1>
        <p className="text-sm text-slate-500">Visually build and run your Cypress test suites.</p>
      </div>
      <button
        onClick={onStartFlow}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Run Workflow
      </button>
    </div>
  )
}
