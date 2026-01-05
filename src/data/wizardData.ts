import { StepOption, UserType, PowerType, DriveType, GardenSizePreset } from '@/types/wizard';

export const userTypeOptions: StepOption<UserType>[] = [
  {
    value: 'homeowner',
    label: 'בעל בית פרטי',
    description: 'מחפש פתרון לגינה הביתית שלי',
    icon: 'Home',
  },
  {
    value: 'professional',
    label: 'איש מקצוע',
    description: 'עובד בתחום הגינון והנוף',
    icon: 'Briefcase',
  },
];

export const gardenSizePresets: GardenSizePreset[] = [
  { label: 'קטנה', value: 100, description: 'עד 100 מ"ר' },
  { label: 'בינונית', value: 300, description: '100-500 מ"ר' },
  { label: 'גדולה', value: 800, description: '500-1000 מ"ר' },
  { label: 'מאוד גדולה', value: 2000, description: 'מעל 1000 מ"ר' },
];

export const powerTypeOptions: StepOption<PowerType>[] = [
  {
    value: 'battery',
    label: 'סוללה',
    description: 'שקט, ידידותי לסביבה, ללא כבלים',
    icon: 'Battery',
  },
  {
    value: 'petrol',
    label: 'בנזין',
    description: 'עוצמתי, לשטחים גדולים',
    icon: 'Fuel',
  },
  {
    value: 'electric',
    label: 'חשמלי (כבל)',
    description: 'קל לתפעול, ללא תחזוקת מנוע',
    icon: 'Plug',
  },
  {
    value: 'manual',
    label: 'ידני',
    description: 'אקולוגי, לגינות קטנות',
    icon: 'Hand',
  },
];

export const driveTypeOptions: StepOption<DriveType>[] = [
  {
    value: 'push',
    label: 'דחיפה',
    description: 'קל ומשתלם, מתאים לשטחים קטנים',
    icon: 'Move',
  },
  {
    value: 'self-propelled',
    label: 'הנעה עצמית',
    description: 'נוח יותר, פחות מאמץ פיזי',
    icon: 'Zap',
  },
  {
    value: 'robot',
    label: 'רובוטי',
    description: 'אוטומטי לחלוטין, עובד בעצמו',
    icon: 'Bot',
  },
  {
    value: 'ride-on',
    label: 'רכיבה',
    description: 'לשטחים גדולים מאוד',
    icon: 'Car',
  },
];

export const stepTitles = [
  'מי אתה?',
  'מה גודל הגינה?',
  'איזה סוג הנעה?',
  'מה אופן הפעולה?',
];

export const stepDescriptions = [
  'בואו נתאים לך את המכסחת המושלמת',
  'כך נמליץ על העוצמה המתאימה',
  'בחר את מקור האנרגיה המועדף עליך',
  'איך תרצה לעבוד עם המכסחת?',
];
