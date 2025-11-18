"use client"

import React, { useState } from "react"
import type { Plugin } from "../App"
import { CheckCircle, Grid3x3, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [collapsed, setCollapsed] = useState(false)
  const categories = ["All", ...new Set(availablePlugins.map((p) => p.category || "Other"))]
  const logoUrl = new URL('../../../assets/img/logo.png', import.meta.url).href;

  return (
    <aside className={`bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col transition-all duration-300 ${collapsed ? 'w-20 p-4' : 'w-64 p-6'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Cypress-craft logo" className="w-10 h-10 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          {!collapsed && <h1 className="text-base font-semibold text-primary">Cypress-craft</h1>}
        </div>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-gray-300"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-800/50 p-3 shadow-sm">
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold px-1.5 min-w-[18px] h-[18px]">
              {installedCount}
            </span>
          </div>
          <div className="relative">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-800/50 p-3 shadow-sm">
              <Grid3x3 className="text-blue-500" size={20} />
            </div>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold px-1.5 min-w-[18px] h-[18px]">
              {availablePlugins.length}
            </span>
          </div>
          <div className="w-full h-px bg-border-light dark:bg-border-dark my-2"></div>
          <div className="flex flex-col items-center gap-3 w-full overflow-y-auto">
            {categories.map((category) => {
              const categoryCount =
                category === 'All'
                  ? availablePlugins.length
                  : availablePlugins.filter((p) => (p.category || 'Other') === category).length
              const isActive = selectedCategory === category
              return (
                <button
                  key={category}
                  title={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative flex items-center justify-center rounded-lg ${isActive ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-slate-800/50 text-text-light dark:text-text-dark'} p-3 shadow-sm hover:shadow-md transition`}
                >
                  <Grid3x3 size={18} />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold px-1.5 min-w-[18px] h-[18px]">
                    {categoryCount}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{installedCount}</span>
            </li>
            <li className="flex justify-between items-center text-text-light dark:text-text-dark bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Grid3x3 className="text-blue-500" size={18} />
                <span className="font-light">Available</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{availablePlugins.length}</span>
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
      )}
    </aside>
  )
}

export default Sidebar
