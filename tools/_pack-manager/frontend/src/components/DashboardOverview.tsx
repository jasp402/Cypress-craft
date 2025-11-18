"use client"

import type React from "react"
import { useState } from "react"
import toast from "react-hot-toast"
import gt from "semver/functions/gt"
import { Search, RefreshCw, Filter, Grid3x3, List } from "lucide-react"
import DashboardCard from "./DashboardCard"
import DashboardPackageCard from "./DashboardPackageCard"
import PackageCard from "./PackageCard"
import type { Plugin, InstalledPlugin } from "../App"

interface DashboardOverviewProps {
  availablePlugins: Plugin[]
  installedPlugins: InstalledPlugin[]
  onRefresh: () => void
  onManualRefresh: () => void
  isRefreshing: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  availablePlugins,
  installedPlugins,
  onRefresh,
  onManualRefresh,
  isRefreshing,
  searchTerm,
  setSearchTerm,
  selectedCategory,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const totalDownloads = "475.1M" // Placeholder

  const filteredPlugins = availablePlugins.filter((plugin) => {
    const matchesCategory = selectedCategory === "All" || (plugin.category || "Other") === selectedCategory
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleInstall = async (pluginId: number) => {
    const promise = fetch("http://localhost:3001/api/plugins/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin_id: pluginId }),
    }).then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        onRefresh()
        return data.message
      } else {
        throw new Error(data.error || "Failed to install")
      }
    })
    toast.promise(promise, {
      loading: "Installing plugin...",
      success: (message) => `Successfully installed: ${message}`,
      error: (err) => `Installation failed: ${err.message}`,
    })
  }

  const handleUninstall = async (pluginId: number) => {
    if (!window.confirm("Are you sure you want to uninstall this plugin?")) return
    const promise = fetch(`http://localhost:3001/api/plugins/uninstall/${pluginId}`, {
      method: "DELETE",
    }).then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        onRefresh()
        return data.message
      } else {
        throw new Error(data.error || "Failed to uninstall")
      }
    })
    toast.promise(promise, {
      loading: "Uninstalling plugin...",
      success: (message) => `Successfully uninstalled: ${message}`,
      error: (err) => `Uninstallation failed: ${err.message}`,
    })
  }

  const handleUpdate = async (pluginId: number) => {
    if (!window.confirm("Are you sure you want to update this plugin?")) return
    const promise = fetch("http://localhost:3001/api/plugins/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin_id: pluginId }),
    }).then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        onRefresh()
        return data.message
      } else {
        throw new Error(data.error || "Failed to update")
      }
    })
    toast.promise(promise, {
      loading: "Updating plugin...",
      success: (message) => `Successfully updated: ${message}`,
      error: (err) => `Update failed: ${err.message}`,
    })
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-slate-900">
      <header>
        <h1 className="text-4xl font-light text-text-light dark:text-text-dark">Package Registry</h1>
        <p className="text-subtext-light dark:text-subtext-dark mt-2 font-light">
          Discover and manage npm packages for your project
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <DashboardCard
          title="Total Packages"
          value={availablePlugins.length.toString()}
          icon="inventory_2"
          color="blue"
        />
        <DashboardCard
          title="Installed Packages"
          value={installedPlugins.length.toString()}
          icon="check_circle"
          color="green"
        />
        <DashboardCard title="Total Downloads" value={totalDownloads} icon="download" color="indigo" />
      </section>

      <section className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark"
                size={20}
              />
              <input
                className="w-full pl-12 pr-4 py-3 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary shadow-sm font-light transition-all"
                placeholder="Search packages..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center border border-border-light dark:border-border-dark rounded-xl bg-card-light dark:bg-card-dark shadow-sm overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all ${viewMode === "grid" ? "text-primary bg-primary/10 dark:bg-primary/20" : "text-subtext-light dark:text-subtext-dark hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800"}`}
              >
                <Grid3x3 size={18} />
              </button>
              <div className="w-px h-6 bg-border-light dark:bg-border-dark"></div>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all ${viewMode === "list" ? "text-primary bg-primary/10 dark:bg-primary/20" : "text-subtext-light dark:text-subtext-dark hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800"}`}
              >
                <List size={18} />
              </button>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-3 border border-border-light dark:border-border-dark rounded-xl bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onManualRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Refresh
                </>
              )}
            </button>
            <button className="flex items-center gap-2 px-5 py-3 border border-border-light dark:border-border-dark rounded-xl bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm font-light transition-all">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>
        <p className="text-sm font-light text-subtext-light dark:text-subtext-dark mb-6">
          Showing <span className="font-medium text-primary">{filteredPlugins.length}</span> packages in{" "}
          <span className="font-medium text-primary">{selectedCategory}</span>
        </p>

        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredPlugins.map((plugin) => {
            const installedPlugin = installedPlugins.find((p) => p.plugin_id === plugin.id)
            const isInstalled = !!installedPlugin
            const installedVersion = installedPlugin?.installed_version
            const isUpdateAvailable =
              isInstalled && installedVersion ? gt(plugin.version, installedVersion) : false

            const cardProps = {
              id: plugin.id,
              name: plugin.name,
              description: plugin.description || "No description available.",
              version: plugin.version,
              status: isInstalled ? (isUpdateAvailable ? "Update Available" : "Installed") : "Not Installed",
              isInstalled: isInstalled,
              installedVersion: installedVersion,
              onInstall: handleInstall,
              onUninstall: handleUninstall,
              onUpdate: handleUpdate,
            }

            return (
              <div key={plugin.id} className="transition-opacity duration-200">
                {viewMode === "grid" ? <DashboardPackageCard {...cardProps} /> : <PackageCard {...cardProps} />}
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default DashboardOverview
