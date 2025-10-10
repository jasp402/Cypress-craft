import { useState, useMemo } from 'react';
import { Feature } from "../App";
import Sidebar from '../components/Sidebar';

interface FeaturesPageProps {
  features: Feature[];
  onCreateFeature: (name: string, language: 'es' | 'en') => void;
  onNavigateToEditor: (featureId: string) => void;
  onDeleteFeature: (featureId: string) => void;
}

// --- Utility function to sanitize file names ---
const sanitizeFileName = (name: string) => {
  return name
    .toString()
    .normalize('NFD') // Decompose accented letters into letter + accent
    .replace(/[\u0300-\u036f]/g, '') // Remove the accent characters
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, ''); // Remove all non-alphanumeric characters except underscores
};


function FeaturesPage({ features, onCreateFeature, onNavigateToEditor, onDeleteFeature }: FeaturesPageProps) {
  const [newFeatureName, setNewFeatureName] = useState('');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeatureName.trim()) {
      const sanitizedName = sanitizeFileName(newFeatureName);
      if (sanitizedName) {
        onCreateFeature(sanitizedName, language);
        setNewFeatureName('');
      } else {
        alert('Please enter a valid feature name.');
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, featureId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this feature and all its scenarios?')) {
      onDeleteFeature(featureId);
    }
  };

  const featuresCount = features.length;
  const scenariosCount = useMemo(() => features.reduce((acc, f) => acc + (f.scenarios?.length || 0), 0), [features]);

  return (
    <div className="flex min-h-screen">
      <Sidebar featuresCount={featuresCount} scenariosCount={scenariosCount} />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-8 overflow-y-auto bg-background-light dark:bg-background-dark">
          <header>
            <h1 className="text-4xl font-light text-text-light dark:text-text-dark">Gherkins Build</h1>
            <p className="text-subtext-light dark:text-subtext-dark mt-2 font-light">
              Design and generate .feature test cases visually
            </p>
          </header>
          <div className="container mx-auto mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">Create a New Feature</h2>
                  <p className="mt-4 text-lg text-subtext-light dark:text-subtext-dark">Define a new feature to begin creating test cases.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-8 space-y-6 border border-border-light dark:border-border-dark">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark" htmlFor="feature-name">Feature Name</label>
                    <input autoComplete="off" className="w-full px-4 py-3 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" id="feature-name" name="feature-name" placeholder="e.g., user_login_flow" required type="text" value={newFeatureName} onChange={(e) => setNewFeatureName(e.target.value)} />
                    <p className="text-xs text-subtext-light dark:text-subtext-dark mt-2">Spaces and special characters will be automatically converted.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark">Language</label>
                    <div className="flex items-center gap-3">
                      <label className={`flex-1 cursor-pointer select-none rounded-lg border px-3 py-2 text-sm ${language === 'es' ? 'border-primary bg-primary/10 text-primary' : 'border-border-light dark:border-border-dark'}`}> 
                        <input type="radio" name="feature-lang" value="es" className="hidden" checked={language==='es'} onChange={() => setLanguage('es')} />
                        Español (es)
                      </label>
                      <label className={`flex-1 cursor-pointer select-none rounded-lg border px-3 py-2 text-sm ${language === 'en' ? 'border-primary bg-primary/10 text-primary' : 'border-border-light dark:border-border-dark'}`}>
                        <input type="radio" name="feature-lang" value="en" className="hidden" checked={language==='en'} onChange={() => setLanguage('en')} />
                        English (en)
                      </label>
                    </div>
                  </div>
                  <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-colors" type="submit">
                    Save & Continue
                  </button>
                </form>
              </div>
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">Existing Features</h2>
                  <p className="mt-4 text-lg text-subtext-light dark:text-subtext-dark">Or select an existing feature to continue working.</p>
                </div>
                <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-8 space-y-4 border border-border-light dark:border-border-dark">
                  <div className="space-y-3">
                    {features.length > 0 ? features.map(feature => (
                      <div key={feature.id} onClick={() => onNavigateToEditor(feature.id)} className="group flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all cursor-pointer">
                        <span className="font-mono text-sm text-text-light dark:text-text-dark group-hover:text-primary">{feature.name}.feature</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-subtext-light dark:text-subtext-dark">{feature.scenarios.length} scenarios</span>
                          <button onClick={(e) => handleDeleteClick(e, feature.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-subtext-light dark:text-subtext-dark">No features found. Create one to get started!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FeaturesPage;
