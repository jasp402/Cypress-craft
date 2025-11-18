import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

// Tipos
export interface Plugin {
  id: number;
  name: string;
  display_name: string;
  version: string;
  description: string;
  category?: string;
}

export interface InstalledPlugin {
  installed_id: number;
  plugin_id: number;
  installed_version: string;
  installed_at: string;
  status: string;
  name: string;
  display_name: string;
  version: string;
  description: string;
  category?: string;
}

function App() {
  const [availablePlugins, setAvailablePlugins] = useState<Plugin[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<InstalledPlugin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPlugins = async ({ background = false } = {}) => {
    if (!background) {
      setLoading(true);
    }
    setError(null);
    try {
      const [availableRes, installedRes] = await Promise.all([
        fetch('http://localhost:3001/api/plugins/available'),
        fetch('http://localhost:3001/api/plugins/installed')
      ]);

      if (!availableRes.ok) throw new Error(`Backend responded with ${availableRes.status} on /available`);
      const availableData = await availableRes.json();
      if (availableData.message === 'success') {
        setAvailablePlugins(availableData.data);
      } else {
        throw new Error(availableData.error || 'Error fetching available plugins');
      }

      if (!installedRes.ok) throw new Error(`Backend responded with ${installedRes.status} on /installed`);
      const installedData = await installedRes.json();
      if (installedData.message === 'success') {
        setInstalledPlugins(installedData.data);
      } else {
        throw new Error(installedData.error || 'Error fetching installed plugins');
      }
    } catch (err: any) {
      const errorMessage = `Failed to connect to backend. Is it running on port 3001? Details: ${err.message}`;
      setError(errorMessage);
      if (!background) {
          toast.error(errorMessage, { duration: 6000 });
      }
      console.error('Error fetching plugins:', err);
    } finally {
      if (!background) {
        setLoading(false);
      }
    }
  };

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    const promise = fetch('http://localhost:3001/api/plugins/refresh', {
      method: 'POST',
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        await fetchPlugins({ background: true });
        return data.message || 'Plugins refreshed successfully';
      } else {
        throw new Error(data.error || 'Failed to refresh plugins');
      }
    });

    toast.promise(promise, {
      loading: 'Searching for new items...',
      success: (message) => `${message}`,
      error: (err) => `Refresh failed: ${err.message}`,
    });

    try {
      await promise;
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-text-light dark:text-text-dark">Cargando plugins...</div>;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
      <Toaster position="bottom-right" />
      <Sidebar 
        installedCount={installedPlugins.length} 
        availablePlugins={availablePlugins}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <MainContent 
        availablePlugins={availablePlugins} 
        installedPlugins={installedPlugins} 
        onRefresh={() => fetchPlugins({ background: true })}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}

export default App;
