import { useDrag } from 'react-dnd';

interface DraggableStepProps {
  step: {
    id: string;
    name: string;
  };
  type: string;
}

function DraggableStep({ step, type }: DraggableStepProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'step',
    item: { id: step.id, name: step.name, stepType: type },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex cursor-grab items-center gap-3 rounded-lg p-2 hover:bg-gray-500/10"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-gray-500/10">
        <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16">
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
        </svg>
      </div>
      <p className="flex-1 truncate text-sm font-medium text-gray-900 dark:text-white">{step.name}</p>
    </div>
  );
}

export default DraggableStep;
