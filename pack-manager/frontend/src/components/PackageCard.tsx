"use client"

import type React from "react"
import { Download, Trash2, RefreshCw, ExternalLink, Copy, CheckCircle, Tag, Check } from "lucide-react"

interface PackageCardProps {
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

const PackageCard: React.FC<PackageCardProps> = ({
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
          className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-light flex items-center gap-2 hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all"
          onClick={() => onUpdate(id)}
        >
          <RefreshCw size={18} />
          Update
        </button>
      )
    }
    if (isInstalled) {
      return (
        <button
          className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-light flex items-center gap-2 hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
          onClick={() => onUninstall(id)}
        >
          <Trash2 size={18} />
          Uninstall
        </button>
      )
    }
    return (
      <button
        className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-light flex items-center gap-2 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
        onClick={() => onInstall(id)}
      >
        <Download size={18} />
        Install
      </button>
    )
  }

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg border border-border-light dark:border-border-dark hover:shadow-xl transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-primary">{name}</h3>
            {isInstalled && <CheckCircle className="text-green-500" size={18} />}
          </div>
          <p className="text-subtext-light dark:text-subtext-dark mt-1 text-sm font-light leading-relaxed">
            {description}
          </p>
          <div className="text-xs font-light text-subtext-light dark:text-subtext-dark mt-3 flex items-center gap-x-4 flex-wrap">
            <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Tag size={12} />
              Available: {version}
            </span>
            {isInstalled && (
              <span className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-md">
                <Check size={12} />
                Installed: {installedVersion}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-md ${isUpdateAvailable ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 font-medium" : "bg-gray-100 dark:bg-slate-800"}`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
            <ExternalLink size={18} />
          </button>
          <ActionButton />
        </div>
      </div>
      <div className="mt-5 bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm text-gray-300 flex justify-between items-center shadow-inner border border-gray-800">
        <code className="font-light">npm install {name}</code>
        <button className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded">
          <Copy size={16} />
        </button>
      </div>
    </div>
  )
}

export default PackageCard
