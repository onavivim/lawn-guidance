import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { gardenSizePresets } from '@/data/wizardData';
import { cn } from '@/lib/utils';

// Import icons
import lawnSmallIcon from '@/assets/icons/lawn-small.png';
import lawnMediumIcon from '@/assets/icons/lawn-medium.png';
import lawnLargeIcon from '@/assets/icons/lawn-large.png';

const presetIcons = [lawnSmallIcon, lawnMediumIcon, lawnLargeIcon];

interface GardenSizeStepProps {
  value: number | null;
  onChange: (value: number) => void;
}

const GardenSizeStep = ({ value, onChange }: GardenSizeStepProps) => {
  const [localValue, setLocalValue] = useState(value || 300);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  useEffect(() => {
    if (value) {
      setLocalValue(value);
      const preset = gardenSizePresets.find(p => p.value === value);
      if (preset) {
        setActivePreset(gardenSizePresets.indexOf(preset));
      }
    }
  }, [value]);

  const handleSliderChange = (values: number[]) => {
    setLocalValue(values[0]);
    setActivePreset(null);
    onChange(values[0]);
  };

  const handlePresetClick = (preset: typeof gardenSizePresets[0], index: number) => {
    setLocalValue(preset.value);
    setActivePreset(index);
    onChange(preset.value);
  };

  const getDisplaySize = () => {
    return `${localValue} מ"ר`;
  };

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
          value={[localValue]}
          onValueChange={handleSliderChange}
          min={50}
          max={2000}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>50 מ"ר</span>
          <span>2000 מ"ר</span>
        </div>
      </div>

      {/* Presets with Icons */}
      <div className="grid grid-cols-3 gap-4">
        {gardenSizePresets.map((preset, index) => (
          <Button
            key={preset.label}
            variant={activePreset === index ? "wizardActive" : "wizard"}
            onClick={() => handlePresetClick(preset, index)}
            className={cn(
              "flex flex-col h-auto py-4 px-3 opacity-0 animate-slide-up backdrop-blur-sm",
              activePreset === index && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <img 
              src={presetIcons[index]} 
              alt={preset.label}
              className="w-16 h-16 object-contain mb-2 transition-all duration-300"
            />
            <span className="font-bold text-base">{preset.label}</span>
            <span className="text-xs opacity-75">{preset.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GardenSizeStep;
