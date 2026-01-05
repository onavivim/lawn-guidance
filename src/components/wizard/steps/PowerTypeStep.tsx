import { PowerType } from '@/types/wizard';
import { powerTypeOptions } from '@/data/wizardData';
import OptionCard from '../OptionCard';

// Import icons
import batteryIcon from '@/assets/icons/battery.png';
import petrolIcon from '@/assets/icons/petrol.png';
import electricIcon from '@/assets/icons/electric.png';
import manualIcon from '@/assets/icons/manual.png';

const iconMap: Record<string, string> = {
  Battery: batteryIcon,
  Fuel: petrolIcon,
  Plug: electricIcon,
  Hand: manualIcon,
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
          iconSrc={iconMap[option.icon as keyof typeof iconMap]}
          isSelected={value === option.value}
          onClick={() => onChange(option.value)}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export default PowerTypeStep;
