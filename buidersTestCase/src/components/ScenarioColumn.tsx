import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { Scenario } from '../App';
import { StepCard } from './StepCard';

interface ScenarioColumnProps {
  scenario: Scenario;
  isSelected: boolean;
  onDeleteStep: (stepId: string) => void;
  onUpdateStep: (stepId: string, newValues: string[]) => void;
  onReorderSteps: (reorderedSteps: any[]) => void;
}

export const ScenarioColumn = ({ scenario, isSelected, onDeleteStep, onUpdateStep, onReorderSteps }: ScenarioColumnProps) => {
  const sortedSteps = scenario.nodes
      .filter(node => node.type !== 'input') // Assuming 'input' type is not a step
      .sort((a, b) => a.position.y - b.position.y);

  return (
      <motion.div
          layout
          animate={{ opacity: isSelected ? 1 : 0.5, filter: isSelected ? 'blur(0px)' : 'blur(2px)' }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 flex-shrink-0 h-full flex flex-col"
      >
        <h3 className="font-bold text-lg mb-4 px-2 text-gray-900 dark:text-white">{scenario.text} [{scenario.type}]</h3>
        <Reorder.Group as="div" axis="y" values={sortedSteps} onReorder={onReorderSteps} className="flex-grow min-h-[200px] p-2 rounded-lg">
          <AnimatePresence>
            {sortedSteps.map((step) => (
                <StepCard
                    key={step.id}
                    step={step}
                    onDelete={() => onDeleteStep(step.id)}
                    onUpdateStep={(newValues) => onUpdateStep(step.id, newValues)}
                />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </motion.div>
  );
};