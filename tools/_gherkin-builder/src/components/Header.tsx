interface HeaderProps {
  featureName: string;
  setFeatureName: (name: string) => void;
  onExport: () => void;
  onNavigateBack: () => void;
}

function Header({ featureName, setFeatureName, onExport, onNavigateBack }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onNavigateBack}
          className="p-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          &larr; Volver
        </button>
        <input 
          type="text"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          className="text-lg p-1 border border-gray-300 rounded"
          placeholder="Nombre del Feature"
        />
      </div>
      <button 
        onClick={onExport}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export to Cypress
      </button>
    </header>
  );
}

export default Header;
