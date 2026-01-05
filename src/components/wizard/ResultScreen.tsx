import { CheckCircle, ArrowLeft, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardState, UserType, PowerType, DriveType } from '@/types/wizard';
import { cn } from '@/lib/utils';

interface ResultScreenProps {
  state: WizardState;
  onRestart: () => void;
}

const categoryMapping: Record<string, string> = {
  'homeowner-battery-robot': 'מכסחות רובוטיות לבית',
  'homeowner-battery-push': 'מכסחות סוללה ידניות',
  'homeowner-battery-self-propelled': 'מכסחות סוללה הנעה עצמית',
  'homeowner-electric-push': 'מכסחות חשמליות',
  'homeowner-petrol-push': 'מכסחות בנזין קטנות',
  'homeowner-petrol-self-propelled': 'מכסחות בנזין הנעה עצמית',
  'homeowner-manual-push': 'מכסחות ידניות',
  'professional-petrol-ride-on': 'טרקטורוני כיסוח מקצועיים',
  'professional-petrol-self-propelled': 'מכסחות בנזין מקצועיות',
  'professional-battery-self-propelled': 'מכסחות סוללה מקצועיות',
};

const getRecommendation = (state: WizardState) => {
  const key = `${state.userType}-${state.powerType}-${state.driveType}`;
  return categoryMapping[key] || 'מכסחות דשא STIGA';
};

const getSizeRecommendation = (size: number | null) => {
  if (!size) return '';
  if (size <= 200) return 'מומלץ לך דגם קומפקטי וקל לתפעול';
  if (size <= 500) return 'מומלץ לך דגם בינוני עם יעילות גבוהה';
  if (size <= 1000) return 'מומלץ לך דגם חזק עם רוחב כיסוח גדול';
  return 'מומלץ לך רכב כיסוח או רובוט מתקדם';
};

const translateUserType = (type: UserType | null) => {
  if (type === 'homeowner') return 'בעל בית';
  if (type === 'professional') return 'איש מקצוע';
  return '';
};

const translatePowerType = (type: PowerType | null) => {
  const map: Record<PowerType, string> = {
    battery: 'סוללה',
    petrol: 'בנזין',
    electric: 'חשמל',
    manual: 'ידני',
  };
  return type ? map[type] : '';
};

const translateDriveType = (type: DriveType | null) => {
  const map: Record<DriveType, string> = {
    push: 'דחיפה',
    'self-propelled': 'הנעה עצמית',
    robot: 'רובוט',
    'ride-on': 'רכיבה',
  };
  return type ? map[type] : '';
};

const ResultScreen = ({ state, onRestart }: ResultScreenProps) => {
  const recommendation = getRecommendation(state);
  const sizeRecommendation = getSizeRecommendation(state.gardenSize);

  const handleShare = async () => {
    const text = `כל גינה והסטיגה שלה! מצאתי את הפתרון המושלם לגינה שלי: ${recommendation}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'STIGA - כל גינה והסטיגה שלה!', text });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-stiga-blue-tech via-background to-secondary opacity-50" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-step-complete/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 opacity-0 animate-scale-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="w-20 h-20 rounded-full bg-step-complete flex items-center justify-center shadow-glow">
            <CheckCircle className="w-12 h-12 text-background" />
          </div>
        </div>

        {/* Main Card */}
        <div 
          className="bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-card-hover p-8 opacity-0 animate-slide-up" 
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <p className="text-primary font-medium text-center mb-2">כל גינה והסטיגה שלה!</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-card-foreground">
            מצאנו את הפתרון לגינה שלך!
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {sizeRecommendation}
          </p>

          {/* Recommendation */}
          <div className="bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2 text-center">הפתרון המומלץ לגינה שלך</p>
            <h3 className="text-2xl md:text-3xl font-bold text-center text-primary">
              {recommendation}
            </h3>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryItem label="סוג משתמש" value={translateUserType(state.userType)} />
            <SummaryItem label="גודל גינה" value={state.gardenSize ? `${state.gardenSize} מ"ר` : ''} />
            <SummaryItem label="סוג הנעה" value={translatePowerType(state.powerType)} />
            <SummaryItem label="אופן פעולה" value={translateDriveType(state.driveType)} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="cta" size="lg" className="flex-1">
              <ArrowLeft className="w-5 h-5" />
              צפה במוצרים
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
              שתף
            </Button>
            <Button variant="ghost" size="lg" onClick={onRestart}>
              <RefreshCw className="w-5 h-5" />
              התחל מחדש
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-3 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="font-bold text-foreground">{value}</p>
  </div>
);

export default ResultScreen;
