import { Handle, Position, NodeProps } from 'reactflow';

const typeInfo: { [key: string]: { bg: string; text: string; icon: string; } } = {
  start: { bg: 'bg-green-500/20', text: 'text-green-500', icon: 'play_arrow' },
  given: { bg: 'bg-sky-500/20', text: 'text-sky-500', icon: 'task_alt' },
  when: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', icon: 'task_alt' },
  then: { bg: 'bg-amber-500/20', text: 'text-amber-500', icon: 'task_alt' },
};

const StepNode = ({ data, type }: NodeProps) => {
  const { label } = data;
  const [stepType, ...stepNameParts] = label.split(':');
  const stepName = stepNameParts.join(':').trim();

  const info = typeInfo[stepType.toLowerCase()] || { bg: 'bg-gray-500/20', text: 'text-gray-500', icon: 'help' };

  // Special node for the start of the scenario
  if (type === 'input') {
    const startInfo = typeInfo['start'];
    return (
      <div className="w-72">
        <div className="relative rounded-xl p-4">
          <Handle type="source" position={Position.Right} id="output" />
          <div className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${startInfo.bg} ${startInfo.text}`}>
                <span className="material-symbols-outlined">{startInfo.icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Start</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Scenario starting point</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72">
        <div className="relative rounded-xl p-4">
            <Handle type="target" position={Position.Left} id="input" />
            <div className="flex items-start gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${info.bg} ${info.text}`}>
                    <span className="material-symbols-outlined">{info.icon}</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{stepType}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stepName}</p>
                </div>
            </div>
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    </div>
  );
};

export default StepNode;
