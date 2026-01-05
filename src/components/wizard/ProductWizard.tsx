import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardState, UserType, PowerType, DriveType } from '@/types/wizard';
import { stepTitles, stepDescriptions } from '@/data/wizardData';
import WizardProgress from './WizardProgress';
import UserTypeStep from './steps/UserTypeStep';
import GardenSizeStep from './steps/GardenSizeStep';
import PowerTypeStep from './steps/PowerTypeStep';
import DriveTypeStep from './steps/DriveTypeStep';
import ResultScreen from './ResultScreen';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;

const initialState: WizardState = {
  currentStep: 1,
  userType: null,
  gardenSize: null,
  powerType: null,
  driveType: null,
};

const ProductWizard = () => {
  const [state, setState] = useState<WizardState>(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const canProceed = useCallback(() => {
    switch (state.currentStep) {
      case 1: return state.userType !== null;
      case 2: return state.gardenSize !== null;
      case 3: return state.powerType !== null;
      case 4: return state.driveType !== null;
      default: return false;
    }
  }, [state]);

  const handleNext = () => {
    if (!canProceed()) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    if (state.currentStep === 1) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
      setIsTransitioning(false);
    }, 200);
  };

  const handleRestart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setState(initialState);
      setIsTransitioning(false);
    }, 200);
  };

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  // Show results
  if (state.currentStep > TOTAL_STEPS) {
    return <ResultScreen state={state} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-stiga-grey-10">
      {/* Header */}
      <header className="pt-6 pb-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="text-3xl font-bold text-stiga-dark-deep tracking-wider">
            STIGA
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 py-4">
        <WizardProgress currentStep={state.currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pb-8">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          {/* Step Header */}
          <div className={cn(
            "text-center mb-8 transition-opacity duration-200",
            isTransitioning && "opacity-0"
          )}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 opacity-0 animate-slide-up" 
                style={{ animationFillMode: 'forwards' }}
                key={`title-${state.currentStep}`}>
              {stepTitles[state.currentStep - 1]}
            </h1>
            <p className="text-lg text-muted-foreground opacity-0 animate-slide-up" 
               style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
               key={`desc-${state.currentStep}`}>
              {stepDescriptions[state.currentStep - 1]}
            </p>
          </div>

          {/* Step Content */}
          <div className={cn(
            "flex-1 flex items-start justify-center transition-opacity duration-200",
            isTransitioning && "opacity-0"
          )}
          key={state.currentStep}>
            {state.currentStep === 1 && (
              <UserTypeStep 
                value={state.userType} 
                onChange={(value: UserType) => updateState('userType', value)} 
              />
            )}
            {state.currentStep === 2 && (
              <GardenSizeStep 
                value={state.gardenSize} 
                onChange={(value: number) => updateState('gardenSize', value)} 
              />
            )}
            {state.currentStep === 3 && (
              <PowerTypeStep 
                value={state.powerType} 
                onChange={(value: PowerType) => updateState('powerType', value)} 
              />
            )}
            {state.currentStep === 4 && (
              <DriveTypeStep 
                value={state.driveType} 
                onChange={(value: DriveType) => updateState('driveType', value)} 
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              disabled={state.currentStep === 1}
              className={cn(state.currentStep === 1 && "invisible")}
            >
              <ArrowRight className="w-5 h-5" />
              חזור
            </Button>

            <Button
              variant="cta"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(!canProceed() && "opacity-50 cursor-not-allowed")}
            >
              {state.currentStep === TOTAL_STEPS ? 'הצג המלצות' : 'המשך'}
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductWizard;
