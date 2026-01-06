import { PowerType, UserType } from '@/types/wizard';
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
  userType: UserType | null;
  gardenSize: number | null;
}

const PowerTypeStep = ({ value, onChange, userType, gardenSize }: PowerTypeStepProps) => {
  const isProfessional = userType === 'professional';
  const isLargeGarden = gardenSize !== null && gardenSize >= 1500;
  
  // Filter options based on user type and garden size
  let availableOptions = powerTypeOptions;
  
  // Professional filtering (remove electric and manual)
  if (isProfessional) {
    availableOptions = availableOptions.filter(opt => opt.value !== 'electric' && opt.value !== 'manual');
  }
  
  // Large garden filtering (remove electric and manual)
  if (isLargeGarden) {
    availableOptions = availableOptions.filter(opt => opt.value !== 'electric' && opt.value !== 'manual');
  }

  const getGridClass = () => {
    const count = availableOptions.length;
    if (count === 2) return 'lg:grid-cols-2 max-w-2xl';
    return 'lg:grid-cols-4 max-w-4xl';
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${getGridClass()} gap-4 mx-auto`}>
      {availableOptions.map((option, index) => (
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
