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
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPlugins = async () => {
    setLoading(true);
    setError(null);
    try {
      const availableRes = await fetch('http://localhost:3001/api/plugins/available');
      if (!availableRes.ok) throw new Error(`Backend responded with ${availableRes.status}`);
      const availableData = await availableRes.json();
      if (availableData.message === 'success') {
        setAvailablePlugins(availableData.data);
      } else {
        throw new Error(availableData.error || 'Error fetching available plugins');
      }

      const installedRes = await fetch('http://localhost:3001/api/plugins/installed');
      if (!installedRes.ok) throw new Error(`Backend responded with ${installedRes.status}`);
      const installedData = await installedRes.json();
      if (installedData.message === 'success') {
        setInstalledPlugins(installedData.data);
      } else {
        throw new Error(installedData.error || 'Error fetching installed plugins');
      }
    } catch (err: any) {
      const errorMessage = `Failed to connect to backend. Is it running on port 3001? Details: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage, { duration: 6000 });
      console.error('Error fetching plugins:', err);
    } finally {
      setLoading(false);
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
        onRefresh={fetchPlugins}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}

export default App;
