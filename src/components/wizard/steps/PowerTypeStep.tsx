import { Battery, Fuel, Plug, Hand } from 'lucide-react';
import { PowerType } from '@/types/wizard';
import { powerTypeOptions } from '@/data/wizardData';
import OptionCard from '../OptionCard';

const iconMap = {
  Battery,
  Fuel,
  Plug,
  Hand,
};

interface PowerTypeStepProps {
  value: PowerType | null;
  onChange: (value: PowerType) => void;
}

const PowerTypeStep = ({ value, onChange }: PowerTypeStepProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {powerTypeOptions.map((option, index) => (
        <OptionCard
          key={option.value}
          label={option.label}
          description={option.description}
          icon={iconMap[option.icon as keyof typeof iconMap]}
          isSelected={value === option.value}
          onClick={() => onChange(option.value)}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export default PowerTypeStep;
