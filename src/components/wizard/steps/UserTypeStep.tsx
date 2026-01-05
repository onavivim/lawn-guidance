import { Home, Briefcase } from 'lucide-react';
import { UserType } from '@/types/wizard';
import { userTypeOptions } from '@/data/wizardData';
import OptionCard from '../OptionCard';

const iconMap = {
  Home,
  Briefcase,
};

interface UserTypeStepProps {
  value: UserType | null;
  onChange: (value: UserType) => void;
}

const UserTypeStep = ({ value, onChange }: UserTypeStepProps) => {
  // Reverse the order for RTL so homeowner appears on the right
  const reversedOptions = [...userTypeOptions].reverse();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
      {reversedOptions.map((option, index) => (
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

export default UserTypeStep;
