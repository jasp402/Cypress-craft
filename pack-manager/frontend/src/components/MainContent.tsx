import type React from 'react';
import DashboardOverview from './DashboardOverview';
import { Plugin, InstalledPlugin } from '../App';

interface MainContentProps {
  availablePlugins: Plugin[];
  installedPlugins: InstalledPlugin[];
  onRefresh: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
}

const MainContent: React.FC<MainContentProps> = (props) => {
  return (
    <DashboardOverview {...props} />
  );
};

export default MainContent;
