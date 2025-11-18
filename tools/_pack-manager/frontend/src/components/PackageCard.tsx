"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Download, Trash2, RefreshCw, ExternalLink, Copy, CheckCircle, Tag, Check } from "lucide-react"

interface PackageCardProps {
  id: number
  name: string
  description: string
  version: string
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
  status,
  isInstalled,
  installedVersion,
  onInstall,
  onUninstall,
  onUpdate,
}) => {
  const isUpdateAvailable = isInstalled && installedVersion ? version > installedVersion : false

  type Snippet = { type: string; target_file: string; content: string }
  const [snippets, setSnippets] = useState<Snippet[] | null>(null)
  const [loadingSnippets, setLoadingSnippets] = useState(false)
  const [errorSnippets, setErrorSnippets] = useState<string | null>(null)
  // Track expanded/collapsed state per snippet kind for the preview blocks
  const [expandedSnippets, setExpandedSnippets] = useState<{ [k: string]: boolean }>({})

  useEffect(() => {
    let cancelled = false
    setLoadingSnippets(true)
    fetch(`http://localhost:3001/api/plugins/${id}/snippets`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Failed to load snippets (${res.status})`)
        return data.data as Snippet[]
      })
      .then((snips) => { if (!cancelled) setSnippets(snips) })
      .catch((err) => { if (!cancelled) setErrorSnippets(err.message) })
      .finally(() => { if (!cancelled) setLoadingSnippets(false) })
    return () => { cancelled = true }
  }, [id])

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
      {/* Snippets area (list view only component) */}
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-text-light dark:text-text-dark">Step definitions snippets Usage:</h4>
        {loadingSnippets && (
          <div className="text-xs text-subtext-light dark:text-subtext-dark">Loading snippets…</div>
        )}
        {errorSnippets && (
          <div className="text-xs text-red-600">{errorSnippets}</div>
        )}
        {snippets && snippets.length > 0 && (
          <div className="grid gap-3">
            {["step_definition", "pom_function"].map((kind) => {
              const snip = snippets.find((s) => s.type === kind)
              if (!snip) return null
              const title = kind === "step_definition" ? "stepDefinition" : "Source code"
              // Determine if we should truncate based on length or lines
              const lineCount = snip.content.split('\n').length
              const needTruncate = lineCount > 12 || snip.content.length > 600
              const isExpanded = !!expandedSnippets[kind]
              const toggle = () => setExpandedSnippets((prev) => ({ ...prev, [kind]: !prev[kind] }))

              return (
                <div key={kind}>
                  {kind === "pom_function" && (
                    <h4 className="text-sm font-medium text-text-light dark:text-text-dark">Source code snippets Usage:</h4>
                  )}
                  <div className="bg-gray-900 dark:bg-black rounded-lg p-3 border border-gray-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-subtext-light dark:text-subtext-dark">{title} · <span className="font-mono text-gray-300">{snip.target_file}</span></span>
                      <button className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded" onClick={() => navigator.clipboard.writeText(snip.content)}>
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className={`relative ${!isExpanded && needTruncate ? 'max-h-40 overflow-hidden' : ''}`}>
                      <pre className="whitespace-pre-wrap text-[11px] leading-5 text-gray-200">{snip.content}</pre>
                      {!isExpanded && needTruncate && (
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))' }}
                        />
                      )}
                    </div>
                    {needTruncate && (
                      <div className="mt-2 flex justify-end">
                        <button
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={toggle}
                        >
                          {isExpanded ? 'Ver menos' : 'Ver más'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PackageCard
