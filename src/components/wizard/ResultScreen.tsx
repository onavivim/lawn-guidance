import { CheckCircle, Share2, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardState, UserType, PowerType, DriveType } from '@/types/wizard';
import { findBestProducts, RecommendationResult } from '@/lib/recommendationEngine';
import { Product } from '@/data/products';

interface ResultScreenProps {
  state: WizardState;
  onRestart: () => void;
}

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
    'ride-on': 'טרקטורון',
  };
  return type ? map[type] : '';
};

const ResultScreen = ({ state, onRestart }: ResultScreenProps) => {
  const recommendation: RecommendationResult | null = findBestProducts(state);

  const handleShare = async () => {
    const productNames = recommendation?.products.map(p => p.name).join(', ') || 'מכסחת דשא STIGA';
    const text = `כל גינה והסטיגה שלה! מצאתי את הפתרון המושלם לגינה שלי: ${productNames}`;
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'STIGA - כל גינה והסטיגה שלה!', 
          text,
          url: recommendation?.products[0]?.link 
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleViewProduct = (product: Product) => {
    window.open(product.link, '_blank', 'noopener,noreferrer');
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
            מצאנו את הפתרון המושלם לגינה שלך!
          </h2>
          
          {recommendation && (
            <p className="text-muted-foreground text-center mb-8">
              {recommendation.reason}
            </p>
          )}

          {/* Product Recommendations */}
          {recommendation && (
            <div className="space-y-3 mb-8">
              <p className="text-sm text-muted-foreground text-center">הפתרון המומלץ לגינה שלך</p>
              {recommendation.products.map((product, index) => (
                <div 
                  key={index}
                  onClick={() => handleViewProduct(product)}
                  className="bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 cursor-pointer hover:bg-secondary/70 hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 group-hover:underline">
                        {product.name}
                      </h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>עד {product.maxArea} מ"ר</span>
                        <span>•</span>
                        <span>{translatePowerType(product.powerType as PowerType)}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryItem label="סוג משתמש" value={translateUserType(state.userType)} />
            <SummaryItem label="גודל גינה" value={state.gardenSize ? `${state.gardenSize} מ"ר` : ''} />
            <SummaryItem label="סוג הנעה" value={translatePowerType(state.powerType)} />
            <SummaryItem label="אופן פעולה" value={translateDriveType(state.driveType)} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
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
