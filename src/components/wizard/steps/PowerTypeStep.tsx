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
}

const PowerTypeStep = ({ value, onChange, userType }: PowerTypeStepProps) => {
  const isProfessional = userType === 'professional';
  
  // Filter options for professionals (remove electric and manual)
  const availableOptions = isProfessional 
    ? powerTypeOptions.filter(opt => opt.value !== 'electric' && opt.value !== 'manual')
    : powerTypeOptions;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isProfessional ? 'lg:grid-cols-2 max-w-2xl' : 'lg:grid-cols-4 max-w-4xl'} gap-4 mx-auto`}>
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
