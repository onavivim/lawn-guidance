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
import stigaLogo from '@/assets/stiga-logo.png';

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
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-stiga-blue-tech via-background to-secondary opacity-50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Header */}
      <header className="relative pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <p className="text-2xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            לכל דשא יש
            <img src={stigaLogo} alt="Stiga" className="h-8 md:h-12 inline-block" />
            משלו
          </p>
        </div>
      </header>

      {/* Progress */}
      <div className="relative px-4 py-4">
        <WizardProgress currentStep={state.currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col px-4 pb-8">
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
                userType={state.userType}
              />
            )}
            {state.currentStep === 3 && (
              <PowerTypeStep 
                value={state.powerType} 
                onChange={(value: PowerType) => updateState('powerType', value)}
                userType={state.userType}
                gardenSize={state.gardenSize}
              />
            )}
            {state.currentStep === 4 && (
              <DriveTypeStep 
                value={state.driveType} 
                onChange={(value: DriveType) => updateState('driveType', value)}
                userType={state.userType}
                powerType={state.powerType}
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
