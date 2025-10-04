"use client"

import type React from "react"
import type { Plugin } from "../App"
import { Package, CheckCircle, Grid3x3 } from "lucide-react"

interface SidebarProps {
  installedCount: number
  availablePlugins: Plugin[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  installedCount,
  availablePlugins,
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = ["All", ...new Set(availablePlugins.map((p) => p.category || "Other"))]

  return (
    <aside className="w-64 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Package className="text-primary" size={24} />
        </div>
        <h1 className="text-2xl font-semibold text-primary">Package Manager</h1>
      </div>

      <div className="flex-grow">
        <h2 className="text-xs font-medium text-subtext-light dark:text-subtext-dark mb-4 uppercase tracking-wider">
          Statistics
        </h2>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between items-center text-text-light dark:text-text-dark bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={18} />
              <span className="font-light">Installed</span>
            </div>
            <span className="font-semibold text-primary">{installedCount}</span>
          </li>
          <li className="flex justify-between items-center text-text-light dark:text-text-dark bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Grid3x3 className="text-blue-500" size={18} />
              <span className="font-light">Available</span>
            </div>
            <span className="font-semibold text-primary">{availablePlugins.length}</span>
          </li>
        </ul>

        <h2 className="text-xs font-medium text-subtext-light dark:text-subtext-dark mt-8 mb-4 uppercase tracking-wider">
          Categories
        </h2>
        <ul className="space-y-1">
          {categories.map((category) => {
            const categoryCount =
              category === "All"
                ? availablePlugins.length
                : availablePlugins.filter((p) => (p.category || "Other") === category).length
            const isActive = selectedCategory === category

            return (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex justify-between items-center px-4 py-2.5 rounded-lg text-left text-sm transition-all ${isActive ? "bg-primary text-white font-medium shadow-md" : "font-light hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:shadow-sm"}`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-200 dark:bg-slate-700"}`}
                  >
                    {categoryCount}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
