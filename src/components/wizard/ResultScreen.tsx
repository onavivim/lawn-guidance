import { CheckCircle, Share2, RefreshCw, ExternalLink, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardState, UserType, PowerType, DriveType } from '@/types/wizard';
import { findBestProducts, RecommendationResult, AlternativeSuggestion } from '@/lib/recommendationEngine';
import { useProducts } from '@/hooks/useProducts';
import { trackProductClick } from '@/lib/analytics';

interface ResultScreenProps {
  state: WizardState;
  onRestart: () => void;
  onChangeSelection?: (powerType: PowerType, driveType: DriveType) => void;
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

const ResultScreen = ({ state, onRestart, onChangeSelection }: ResultScreenProps) => {
  const { products, isLoading, error } = useProducts();
  const recommendation: RecommendationResult | null = findBestProducts(state, products);

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
      } catch {
        // Share was cancelled by user - no action needed
      }
    }
  };

  const handleAlternativeClick = (alt: AlternativeSuggestion) => {
    if (onChangeSelection) {
      onChangeSelection(alt.powerType, alt.driveType);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">שגיאה בטעינת המוצרים</p>
          <Button onClick={onRestart}>נסה שנית</Button>
        </div>
      </div>
    );
  }

  // No match state
  if (recommendation?.noMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stiga-blue-tech via-background to-secondary opacity-50" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-destructive/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-2xl w-full">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6 opacity-0 animate-scale-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-12 h-12 text-background" />
            </div>
          </div>

          <div 
            className="bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-card-hover p-8 opacity-0 animate-slide-up" 
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-card-foreground">
              לא נמצאה התאמה מדויקת
            </h2>
            
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-6">
              <p className="text-card-foreground text-center text-lg leading-relaxed">
                {recommendation.noMatchReason}
              </p>
            </div>

            {/* Summary of choices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <SummaryItem label="סוג משתמש" value={translateUserType(state.userType)} />
              <SummaryItem label="גודל גינה" value={state.gardenSize ? `${state.gardenSize.toLocaleString()} מ"ר` : ''} />
              <SummaryItem label="סוג הנעה" value={translatePowerType(state.powerType)} />
              <SummaryItem label="אופן פעולה" value={translateDriveType(state.driveType)} />
            </div>

            {/* Alternative suggestions */}
            {recommendation.alternatives && recommendation.alternatives.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground text-center mb-3">שילובים שכן מתאימים לגינה שלך:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendation.alternatives.slice(0, 4).map((alt, index) => (
                    <button
                      key={index}
                      onClick={() => handleAlternativeClick(alt)}
                      className="flex items-center justify-between bg-secondary/50 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-4 cursor-pointer hover:bg-secondary/70 hover:border-primary transition-all group text-right"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                          {alt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          עד {alt.maxArea.toLocaleString()} מ"ר
                        </p>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="ghost" size="lg" onClick={onRestart} className="flex-1">
                <RefreshCw className="w-5 h-5" />
                התחל מחדש
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Primary Recommendation */}
          {recommendation && recommendation.products.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground text-center mb-3">הפתרון המומלץ לגינה שלך</p>
              <a 
                href={recommendation.products[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-secondary/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6 cursor-pointer hover:bg-secondary/70 hover:border-primary transition-all group shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 underline underline-offset-4 decoration-primary/50 group-hover:decoration-primary">
                      {recommendation.products[0].name}
                    </h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>עד {recommendation.products[0].maxArea} מ"ר</span>
                      <span>•</span>
                      <span>{translatePowerType(recommendation.products[0].powerType as PowerType)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm font-medium hidden sm:inline">לצפייה באתר</span>
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Other Options */}
          {recommendation && recommendation.products.length > 1 && (
            <div className="mb-8">
              <p className="text-xs text-muted-foreground text-center mb-2">אפשרויות נוספות</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendation.products.slice(1).map((product, index) => (
                  <a 
                    key={index}
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-secondary/30 backdrop-blur-sm border border-border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 hover:border-primary/30 transition-all group"
                  >
                    <h4 className="text-sm font-semibold text-primary mb-1 underline underline-offset-2 decoration-primary/40 group-hover:decoration-primary">
                      {product.name}
                    </h4>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>עד {product.maxArea} מ"ר</span>
                      <span>•</span>
                      <span>{translatePowerType(product.powerType as PowerType)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryItem label="סוג משתמש" value={translateUserType(state.userType)} />
            <SummaryItem label="גודל גינה" value={state.gardenSize ? `${state.gardenSize.toLocaleString()} מ"ר` : ''} />
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
