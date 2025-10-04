"use client"

import type React from "react"
import { Download, Trash2, RefreshCw, ExternalLink, CheckCircle, Tag } from "lucide-react"

interface DashboardPackageCardProps {
  id: number
  name: string
  description: string
  version: string
  downloads: string
  status: string
  isInstalled: boolean
  installedVersion?: string
  onInstall: (pluginId: number) => void
  onUninstall: (pluginId: number) => void
  onUpdate: (pluginId: number) => void
}

const DashboardPackageCard: React.FC<DashboardPackageCardProps> = ({
  id,
  name,
  description,
  version,
  downloads,
  status,
  isInstalled,
  installedVersion,
  onInstall,
  onUninstall,
  onUpdate,
}) => {
  const isUpdateAvailable = isInstalled && installedVersion ? version > installedVersion : false

  const ActionButton: React.FC = () => {
    if (isUpdateAvailable) {
      return (
        <button
          className="p-2.5 bg-yellow-500 text-white rounded-lg text-sm font-light flex items-center hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all"
          onClick={() => onUpdate(id)}
          aria-label="Update plugin"
        >
          <RefreshCw size={20} />
        </button>
      )
    }
    if (isInstalled) {
      return (
        <button
          className="p-2.5 bg-red-500 text-white rounded-lg text-sm font-light flex items-center hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
          onClick={() => onUninstall(id)}
          aria-label="Uninstall plugin"
        >
          <Trash2 size={20} />
        </button>
      )
    }
    return (
      <button
        className="p-2.5 bg-primary text-white rounded-lg text-sm font-light flex items-center hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
        onClick={() => onInstall(id)}
        aria-label="Install plugin"
      >
        <Download size={20} />
      </button>
    )
  }

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg border border-border-light dark:border-border-dark flex flex-col justify-between h-full hover:shadow-xl transition-all hover:-translate-y-1">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium text-primary truncate flex-1">{name}</h3>
          {isInstalled && <CheckCircle className="text-green-500 ml-2" size={18} />}
        </div>
        <p className="text-sm font-light text-subtext-light dark:text-subtext-dark mt-2 line-clamp-2 h-10">
          {description}
        </p>
        <div className="text-xs font-light text-subtext-light dark:text-subtext-dark mt-4 flex items-center gap-x-3 flex-wrap">
          <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            <Tag size={12} />v{version}
          </span>
          <span
            className={`px-2 py-1 rounded-md ${isUpdateAvailable ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 font-medium" : "bg-gray-100 dark:bg-slate-800"}`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-light dark:border-border-dark">
        <button className="text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
          <ExternalLink size={18} />
        </button>
        <ActionButton />
      </div>
    </div>
  )
}

export default DashboardPackageCard