import type React from "react"
import { Package, CheckCircle, Download } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string
  icon: string
  color: "blue" | "green" | "indigo"
}

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
  },
}

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  inventory_2: Package,
  check_circle: CheckCircle,
  download: Download,
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  const colors = colorMap[color]
  const IconComponent = iconMap[icon] || Package

  return (
    <div
      className={`bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg border ${colors.border} hover:shadow-xl transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-light text-subtext-light dark:text-subtext-dark">{title}</p>
          <p className="text-4xl font-light mt-3 text-text-light dark:text-text-dark">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg} shadow-md`}>
          <IconComponent className={colors.text} size={24} />
        </div>
      </div>
    </div>
  )
}

export default DashboardCard