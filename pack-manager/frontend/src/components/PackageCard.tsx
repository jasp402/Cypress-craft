import React from 'react';

interface PackageCardProps {
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

const PackageCard: React.FC<PackageCardProps> = ({ id, name, description, version, downloads, status, isInstalled, installedVersion, onInstall, onUninstall, onUpdate }) => {
  const isUpdateAvailable = isInstalled && installedVersion ? version > installedVersion : false;

  const ActionButton: React.FC = () => {
    if (isUpdateAvailable) {
      return (
        <button 
          className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium flex items-center hover:bg-yellow-600"
          onClick={() => onUpdate(id)}
        >
          <span className="material-icons text-lg mr-2">update</span>
          Update
        </button>
      );
    }
    if (isInstalled) {
      return (
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-red-700"
          onClick={() => onUninstall(id)}
        >
          <span className="material-icons text-lg mr-2">delete</span>
          Uninstall
        </button>
      );
    }
    return (
      <button 
        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700"
        onClick={() => onInstall(id)}
      >
        <span className="material-icons text-lg mr-2">download</span>
        Install
      </button>
    );
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-semibold text-primary">{name}</h3>
          <p className="text-subtext-light dark:text-subtext-dark mt-1 text-sm">{description}</p>
          <div className="text-xs text-subtext-light dark:text-subtext-dark mt-2 flex items-center gap-x-4 flex-wrap">
            <span>Available: {version}</span>
            {isInstalled && <span>Installed: {installedVersion}</span>}
            <span className={isUpdateAvailable ? 'text-yellow-500 font-semibold' : ''}>{status}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-subtext-light dark:text-subtext-dark hover:text-primary"><span className="material-icons">link</span></button>
          <ActionButton />
        </div>
      </div>
      <div className="mt-4 bg-gray-900 dark:bg-black rounded-lg p-3 font-mono text-sm text-gray-300 flex justify-between items-center">
        <code>npm install {name}</code>
        <button className="text-gray-400 hover:text-white"><span className="material-icons text-base">content_copy</span></button>
      </div>
    </div>
  );
};

export default PackageCard;
