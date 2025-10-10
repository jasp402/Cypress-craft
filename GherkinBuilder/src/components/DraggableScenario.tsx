import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

interface DraggableScenarioProps {
  id: string;
  text: string;
  index: number;
  moveScenario: (dragIndex: number, hoverIndex: number) => void;
  isSelected: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function DraggableScenario({ id, text, index, moveScenario, isSelected }: DraggableScenarioProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'scenario',
    collect(monitor: any) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: any) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveScenario(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'scenario',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`cursor-move rounded-lg border ${isSelected ? 'border-primary ring-1 ring-primary/30 bg-card-light' : 'border-border-light bg-card-light hover:shadow-md'} shadow-sm px-3 py-2 transition-all`}
      data-handler-id={handlerId}
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-gray-400">drag_indicator</span>
        <span className="text-sm text-text-light">{text}</span>
      </div>
    </div>
  );
}

export default DraggableScenario;
