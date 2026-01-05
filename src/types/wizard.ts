export type UserType = 'homeowner' | 'professional';
export type PowerType = 'battery' | 'petrol' | 'electric' | 'manual';
export type DriveType = 'push' | 'robot' | 'ride-on' | 'self-propelled';

export interface WizardState {
  currentStep: number;
  userType: UserType | null;
  gardenSize: number | null;
  powerType: PowerType | null;
  driveType: DriveType | null;
}

export interface StepOption<T> {
  value: T;
  label: string;
  description: string;
  icon: string;
}

export interface GardenSizePreset {
  label: string;
  value: number;
  description: string;
}
