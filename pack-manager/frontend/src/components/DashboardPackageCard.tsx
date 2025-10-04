import React from 'react';

// Usar la misma interfaz que PackageCard para consistencia
interface DashboardPackageCardProps {
  id: number;
  name: string;
  description: string;
  version: string;
  downloads: string;
  status: string;
  isInstalled: boolean;
  installedVersion?: string;
  onInstall: (pluginId: number) => void;
  onUninstall: (pluginId: number) => void;
  onUpdate: (pluginId: number) => void;
}

const DashboardPackageCard: React.FC<DashboardPackageCardProps> = ({ id, name, description, version, downloads, status, isInstalled, installedVersion, onInstall, onUninstall, onUpdate }) => {
  const isUpdateAvailable = isInstalled && installedVersion ? version > installedVersion : false;

  const ActionButton: React.FC = () => {
    if (isUpdateAvailable) {
      return (
        <button 
          className="p-2 bg-yellow-500 text-white rounded-lg text-sm font-medium flex items-center hover:bg-yellow-600"
          onClick={() => onUpdate(id)}
          aria-label="Update plugin"
        >
          <span className="material-icons text-lg">update</span>
        </button>
      );
    }
    if (isInstalled) {
      return (
        <button 
          className="p-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-red-700"
          onClick={() => onUninstall(id)}
          aria-label="Uninstall plugin"
        >
          <span className="material-icons text-lg">delete</span>
        </button>
      );
    }
    return (
      <button 
        className="p-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center hover:bg-blue-700"
        onClick={() => onInstall(id)}
        aria-label="Install plugin"
      >
        <span className="material-icons text-lg">download</span>
      </button>
    );
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-primary truncate">{name}</h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1 line-clamp-2 h-10">{description}</p>
        <div className="text-xs text-subtext-light dark:text-subtext-dark mt-3 flex items-center gap-x-4 flex-wrap">
          <span>v{version}</span>
          <span className={isUpdateAvailable ? 'text-yellow-500 font-semibold' : ''}>{status}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          <button className="text-subtext-light dark:text-subtext-dark hover:text-primary"><span className="material-icons">link</span></button>
        </div>
        <ActionButton />
      </div>
    </div>
  );
};

export default DashboardPackageCard;
