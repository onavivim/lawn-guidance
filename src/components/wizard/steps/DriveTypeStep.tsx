import { DriveType } from '@/types/wizard';
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
}

const DriveTypeStep = ({ value, onChange }: DriveTypeStepProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {driveTypeOptions.map((option, index) => (
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
