import React, { useState } from 'react';
import toast from 'react-hot-toast';
import semver from 'semver';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from './DashboardCard';
import DashboardPackageCard from './DashboardPackageCard';
import PackageCard from './PackageCard';
import { Plugin, InstalledPlugin } from '../App';

interface DashboardOverviewProps {
  availablePlugins: Plugin[];
  installedPlugins: InstalledPlugin[];
  onRefresh: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ availablePlugins, installedPlugins, onRefresh, searchTerm, setSearchTerm, selectedCategory }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const totalDownloads = "475.1M"; // Placeholder

  const filteredPlugins = availablePlugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'All' || (plugin.category || 'Other') === selectedCategory;
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ... (funciones handleInstall, handleUninstall, handleUpdate sin cambios) ...
  const handleInstall = async (pluginId: number) => {
    const promise = fetch('http://localhost:3001/api/plugins/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin_id: pluginId }),
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        onRefresh();
        return data.message;
      } else {
        throw new Error(data.error || 'Failed to install');
      }
    });
    toast.promise(promise, {
      loading: 'Installing plugin...',
      success: (message) => `Successfully installed: ${message}`,
      error: (err) => `Installation failed: ${err.message}`,
    });
  };

  const handleUninstall = async (pluginId: number) => {
    if (!window.confirm('Are you sure you want to uninstall this plugin?')) return;
    const promise = fetch(`http://localhost:3001/api/plugins/uninstall/${pluginId}`, {
      method: 'DELETE',
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        onRefresh();
        return data.message;
      } else {
        throw new Error(data.error || 'Failed to uninstall');
      }
    });
    toast.promise(promise, {
      loading: 'Uninstalling plugin...',
      success: (message) => `Successfully uninstalled: ${message}`,
      error: (err) => `Uninstallation failed: ${err.message}`,
    });
  };

  const handleUpdate = async (pluginId: number) => {
    if (!window.confirm('Are you sure you want to update this plugin?')) return;
    const promise = fetch('http://localhost:3001/api/plugins/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin_id: pluginId }),
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        onRefresh();
        return data.message;
      } else {
        throw new Error(data.error || 'Failed to update');
      }
    });
    toast.promise(promise, {
      loading: 'Updating plugin...',
      success: (message) => `Successfully updated: ${message}`,
      error: (err) => `Update failed: ${err.message}`,
    });
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <header>
        <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">Dashboard Overview</h1>
        <p className="text-subtext-light dark:text-subtext-dark mt-1">Quick stats and package management at a glance</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <DashboardCard title="Total Packages" value={availablePlugins.length.toString()} icon="list_alt" color="blue" />
        <DashboardCard title="Installed Packages" value={installedPlugins.length.toString()} icon="check_circle" color="green" />
        <DashboardCard title="Recent Downloads" value={totalDownloads} icon="download" color="indigo" />
      </section>

      <section className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Search packages..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-l-md ${viewMode === 'grid' ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-subtext-light dark:text-subtext-dark hover:text-primary'}`}>
                <span className="material-icons text-lg">grid_view</span>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-r-md ${viewMode === 'list' ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-subtext-light dark:text-subtext-dark hover:text-primary'}`}>
                <span className="material-icons text-lg">view_list</span>
              </button>
            </div>
            <button 
              className="flex items-center px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={onRefresh}
            >
              <span className="material-icons text-sm mr-2">refresh</span>
              Refresh
            </button>
          </div>
        </div>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-4">Showing {filteredPlugins.length} packages in {selectedCategory}</p>
        
        <motion.div 
          layout
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}
        >
          <AnimatePresence>
            {filteredPlugins.map(plugin => {
              const installedPlugin = installedPlugins.find(p => p.plugin_id === plugin.id);
              const isInstalled = !!installedPlugin;
              const installedVersion = installedPlugin?.installed_version;
              const isUpdateAvailable = isInstalled && installedVersion ? semver.gt(plugin.version, installedVersion) : false;

              const cardProps = {
                id: plugin.id,
                name: plugin.name,
                description: plugin.description || 'No description available.',
                version: plugin.version,
                downloads: "N/A",
                status: isInstalled ? (isUpdateAvailable ? 'Update Available' : 'Installed') : 'Not Installed',
                isInstalled: isInstalled,
                installedVersion: installedVersion,
                onInstall: handleInstall,
                onUninstall: handleUninstall,
                onUpdate: handleUpdate,
              };

              return (
                <motion.div
                  key={plugin.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {viewMode === 'grid' ? <DashboardPackageCard {...cardProps} /> : <PackageCard {...cardProps} />}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
};

export default DashboardOverview;
