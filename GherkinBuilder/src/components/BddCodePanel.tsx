import { Feature, Scenario } from "../App";
import { generateFeatureFile } from "../utils/export";
import { downloadFile } from "../utils/download";

interface BddCodePanelProps {
  feature: Feature | null;
  selectedScenario: Scenario | null; // Keep for potential future use (e.g., highlighting)
}

function BddCodePanel({ feature, selectedScenario }: BddCodePanelProps) {

  const generateBddCode = () => {
    if (!feature) {
      return '';
    }
    // BUG FIX: Always generate the code for the entire feature, not just the selected scenario.
    return generateFeatureFile(feature.name, feature.scenarios);
  };

  const code = generateBddCode();

  const handleDownload = () => {
    if (feature && code) {
      downloadFile(`${feature.name}.feature`, code);
    }
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        alert('Copied to clipboard!');
      });
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-200/10 bg-background-light/50 dark:bg-background-dark/50" style={{ height: '300px' }}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-200/10 px-4 py-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">Generated BDD Code (.feature)</h3>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-300/10">
                <span className="material-symbols-outlined text-base">download</span>
                <span>Download</span>
            </button>
            <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-300/10">
                <span className="material-symbols-outlined text-base">content_copy</span>
                <span>Copy</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-background-dark/50 p-4 font-mono text-sm dark:bg-background-dark/80">
          <div className="grid" style={{ counterReset: 'line' }}>
            {code.split('\n').map((line, index) => (
              <div key={index} className="code-line whitespace-pre">
                {line.includes('Feature:') && <><span className="text-[#569cd6]">Feature:</span><span>{line.substring(line.indexOf(':') + 1)}</span></>}
                {line.includes('Scenario:') && <><span className="text-[#569cd6]">Scenario:</span><span>{line.substring(line.indexOf(':') + 1)}</span></>}
                {(line.trim().startsWith('Given') || line.trim().startsWith('When') || line.trim().startsWith('Then') || line.trim().startsWith('And')) && (
                    <><span className="ml-4 text-[#569cd6]">{line.trim().split(' ')[0]}</span><span> {line.trim().substring(line.trim().indexOf(' ') + 1)}</span></>
                )}
                {line.trim().startsWith('#') && <span className="text-gray-500">{line}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BddCodePanel;
