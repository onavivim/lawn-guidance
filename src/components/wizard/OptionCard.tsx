import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  label: string;
  description: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
}

const OptionCard = ({ 
  label, 
  description, 
  icon: Icon, 
  isSelected, 
  onClick,
  delay = 0 
}: OptionCardProps) => {
  return (
    <Button
      variant={isSelected ? "wizardActive" : "wizard"}
      size="card"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden",
        "opacity-0 animate-slide-up",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        "bg-gradient-to-br from-primary/10 to-transparent",
        "group-hover:opacity-100"
      )} />
      
      <div className={cn(
        "w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
        isSelected ? "bg-primary-foreground/20" : "bg-stiga-grey-10 group-hover:bg-primary/10"
      )}>
        <Icon className={cn(
          "w-8 h-8 transition-colors duration-300",
          isSelected ? "text-primary-foreground" : "text-stiga-dark group-hover:text-primary"
        )} />
      </div>
      
      <span className={cn(
        "text-lg font-bold mb-1 transition-colors duration-300",
        isSelected && "text-primary-foreground"
      )}>
        {label}
      </span>
      
      <span className={cn(
        "text-sm transition-colors duration-300",
        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        {description}
      </span>
    </Button>
  );
};

export default OptionCard;
