import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { gardenSizePresets } from '@/data/wizardData';
import { cn } from '@/lib/utils';
import { UserType } from '@/types/wizard';

// Import icons
import lawnSmallIcon from '@/assets/icons/lawn-small.png';
import lawnMediumIcon from '@/assets/icons/lawn-medium.png';
import lawnLargeIcon from '@/assets/icons/lawn-large.png';

const presetIcons = [lawnSmallIcon, lawnMediumIcon, lawnLargeIcon];

interface GardenSizeStepProps {
  value: number | null;
  onChange: (value: number) => void;
  userType: UserType | null;
}

// Non-linear slider mapping:
// Slider positions 0-80 map to 50-2000 (step 50), positions 80-100 map to 2000-10000 (step 1000)
const SLIDER_BREAK = 80; // slider position where we switch from fine to coarse
const VALUE_BREAK = 2000; // actual value at the break point

function sliderToValue(pos: number, min: number): number {
  if (pos <= SLIDER_BREAK) {
    // Linear from min to VALUE_BREAK
    const ratio = pos / SLIDER_BREAK;
    const val = min + ratio * (VALUE_BREAK - min);
    return Math.round(val / 50) * 50; // snap to 50
  } else {
    // Linear from VALUE_BREAK to 10000
    const ratio = (pos - SLIDER_BREAK) / (100 - SLIDER_BREAK);
    const val = VALUE_BREAK + ratio * (10000 - VALUE_BREAK);
    return Math.round(val / 1000) * 1000; // snap to 1000
  }
}

function valueToSlider(val: number, min: number): number {
  if (val <= VALUE_BREAK) {
    return ((val - min) / (VALUE_BREAK - min)) * SLIDER_BREAK;
  } else {
    return SLIDER_BREAK + ((val - VALUE_BREAK) / (10000 - VALUE_BREAK)) * (100 - SLIDER_BREAK);
  }
}

const GardenSizeStep = ({ value, onChange, userType }: GardenSizeStepProps) => {
  const isProfessional = userType === 'professional';
  
  // Filter presets for professionals (only large gardens)
  const availablePresets = isProfessional 
    ? gardenSizePresets.filter(p => p.value >= 1500) // Only large
    : gardenSizePresets;
  
  const availablePresetIndices = isProfessional ? [2] : [0, 1, 2]; // Indices in original array
  
  const defaultValue = isProfessional ? 1500 : 300;
  const sliderMin = isProfessional ? 1000 : 50;
  const [localValue, setLocalValue] = useState(value || defaultValue);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  useEffect(() => {
    if (value) {
      setLocalValue(value);
      const presetIndex = gardenSizePresets.findIndex(p => p.value === value);
      if (presetIndex !== -1 && availablePresetIndices.includes(presetIndex)) {
        setActivePreset(presetIndex);
      }
    }
  }, [value]);

  // Set default for professionals
  useEffect(() => {
    if (isProfessional && !value) {
      onChange(defaultValue);
    }
  }, [isProfessional, value, onChange, defaultValue]);

  const handleSliderChange = (values: number[]) => {
    const actualValue = sliderToValue(values[0], sliderMin);
    setLocalValue(actualValue);
    setActivePreset(null);
    onChange(actualValue);
  };

  const handlePresetClick = (preset: typeof gardenSizePresets[0], originalIndex: number) => {
    setLocalValue(preset.value);
    setActivePreset(originalIndex);
    onChange(preset.value);
  };

  const getDisplaySize = () => {
    return `${localValue.toLocaleString()} מ"ר`;
  };

  const sliderPosition = valueToSlider(localValue, sliderMin);

  return (
    <div className="max-w-xl mx-auto space-y-8 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
      {/* Size Display */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-2xl px-8 py-6 shadow-card">
          <span className="text-5xl md:text-6xl font-bold text-primary">
            {getDisplaySize()}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="px-4" dir="ltr">
        <Slider
          value={[sliderPosition]}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>{sliderMin} מ"ר</span>
          <span>10,000 מ"ר</span>
        </div>
      </div>

      {/* Presets with Icons */}
      <div className={cn(
        "grid gap-4",
        availablePresets.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-3"
      )}>
        {availablePresets.map((preset, idx) => {
          const originalIndex = gardenSizePresets.indexOf(preset);
          return (
            <Button
              key={preset.label}
              variant={activePreset === originalIndex ? "wizardActive" : "wizard"}
              onClick={() => handlePresetClick(preset, originalIndex)}
              className={cn(
                "flex flex-col h-auto py-4 px-3 opacity-0 animate-slide-up backdrop-blur-sm",
                activePreset === originalIndex && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              style={{ animationDelay: `${200 + idx * 100}ms`, animationFillMode: 'forwards' }}
            >
              <img 
                src={presetIcons[originalIndex]} 
                alt={preset.label}
                className="w-16 h-16 object-contain mb-2 transition-all duration-300"
              />
              <span className="font-bold text-base">{preset.label}</span>
              <span className="text-xs opacity-75">{preset.description}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default GardenSizeStep;
