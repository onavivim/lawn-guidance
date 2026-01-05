import { DriveType, UserType } from '@/types/wizard';
import { driveTypeOptions } from '@/data/wizardData';
import OptionCard from '../OptionCard';
import { Bot, Car } from 'lucide-react';

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
}

const DriveTypeStep = ({ value, onChange, userType }: DriveTypeStepProps) => {
  const isProfessional = userType === 'professional';
  
  // Filter options for professionals (remove robot)
  const availableOptions = isProfessional 
    ? driveTypeOptions.filter(opt => opt.value !== 'robot')
    : driveTypeOptions;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isProfessional ? 'lg:grid-cols-3 max-w-3xl' : 'lg:grid-cols-4 max-w-4xl'} gap-4 mx-auto`}>
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
