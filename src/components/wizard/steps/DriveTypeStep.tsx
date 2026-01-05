import { DriveType, UserType, PowerType } from '@/types/wizard';
import { driveTypeOptions } from '@/data/wizardData';
import OptionCard from '../OptionCard';

// Import icons
import pushIcon from '@/assets/icons/push.png';
import selfPropelledIcon from '@/assets/icons/self-propelled.png';
import robotIcon from '@/assets/icons/robot.png';
import rideOnIcon from '@/assets/icons/ride-on.png';

const iconMap: Record<string, string> = {
  Move: pushIcon,
  Zap: selfPropelledIcon,
  Bot: robotIcon,
  Car: rideOnIcon,
};

interface DriveTypeStepProps {
  value: DriveType | null;
  onChange: (value: DriveType) => void;
  userType: UserType | null;
  powerType: PowerType | null;
}

const DriveTypeStep = ({ value, onChange, userType, powerType }: DriveTypeStepProps) => {
  const isProfessional = userType === 'professional';
  
  // Filter options based on user type and power type
  let availableOptions = driveTypeOptions;
  
  // Professional filtering (remove robot)
  if (isProfessional) {
    availableOptions = availableOptions.filter(opt => opt.value !== 'robot');
  }
  
  // Power type filtering
  if (powerType === 'electric') {
    // Electric: remove robots and ride-on
    availableOptions = availableOptions.filter(opt => 
      opt.value !== 'robot' && opt.value !== 'ride-on'
    );
  } else if (powerType === 'petrol') {
    // Petrol: remove robots
    availableOptions = availableOptions.filter(opt => opt.value !== 'robot');
  } else if (powerType === 'manual') {
    // Manual: only push
    availableOptions = availableOptions.filter(opt => opt.value === 'push');
  }

  const getGridClass = () => {
    const count = availableOptions.length;
    if (count === 1) return 'grid-cols-1 max-w-xs';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl';
  };

  return (
    <div className={`grid ${getGridClass()} gap-4 mx-auto`}>
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

export default DriveTypeStep;
