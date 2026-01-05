import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WizardProgress = ({ currentStep, totalSteps }: WizardProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isComplete = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                isComplete && "bg-step-complete text-background",
                isActive && "bg-primary text-primary-foreground shadow-button animate-scale-in",
                !isComplete && !isActive && "bg-step-pending text-muted-foreground"
              )}
            >
              {isComplete ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm">{stepNumber}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-8 md:w-12 h-1 mx-1 rounded-full transition-all duration-500",
                  currentStep > stepNumber + 1 ? "bg-step-complete" :
                  currentStep > stepNumber ? "bg-primary" : "bg-step-pending"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WizardProgress;
