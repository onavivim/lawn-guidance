import { WizardState, PowerType, DriveType } from '@/types/wizard';
import { Product } from '@/data/products';

export interface AlternativeSuggestion {
  driveType: DriveType;
  powerType: PowerType;
  label: string;
  maxArea: number;
}

export interface RecommendationResult {
  products: Product[];
  reason: string;
  noMatch?: boolean;
  noMatchReason?: string;
  alternatives?: AlternativeSuggestion[];
}

// Map wizard power types to product power types
const powerTypeMapping: Record<PowerType, Product['powerType'][]> = {
  battery: ['battery'],
  petrol: ['petrol'],
  electric: ['electric'],
  manual: ['manual'],
};

// Map wizard drive types to product drive types
const driveTypeMapping: Record<DriveType, Product['driveType'][]> = {
  push: ['push'],
  'self-propelled': ['self-propelled'],
  robot: ['robot'],
  'ride-on': ['ride-on'],
};

const translatePower = (type: PowerType): string => {
  const map: Record<PowerType, string> = {
    battery: 'סוללה',
    petrol: 'בנזין',
    electric: 'חשמל',
    manual: 'ידני',
  };
  return map[type];
};

const translateDrive = (type: DriveType): string => {
  const map: Record<DriveType, string> = {
    push: 'דחיפה',
    'self-propelled': 'הנעה עצמית',
    robot: 'רובוט',
    'ride-on': 'טרקטורון',
  };
  return map[type];
};

function findAlternatives(gardenSize: number, products: Product[], currentPower: PowerType, currentDrive: DriveType): AlternativeSuggestion[] {
  const allDriveTypes: DriveType[] = ['push', 'self-propelled', 'robot', 'ride-on'];
  const allPowerTypes: PowerType[] = ['battery', 'petrol', 'electric', 'manual'];
  const alternatives: AlternativeSuggestion[] = [];

  for (const dt of allDriveTypes) {
    for (const pt of allPowerTypes) {
      if (dt === currentDrive && pt === currentPower) continue;
      
      const matching = products.filter(p => 
        driveTypeMapping[dt].includes(p.driveType) &&
        powerTypeMapping[pt].includes(p.powerType) &&
        p.maxArea >= gardenSize
      );
      
      if (matching.length > 0) {
        const maxArea = Math.max(...matching.map(p => p.maxArea));
        alternatives.push({
          driveType: dt,
          powerType: pt,
          label: `${translateDrive(dt)} + ${translatePower(pt)}`,
          maxArea,
        });
      }
    }
  }

  return alternatives;
}

export function findBestProducts(state: WizardState, products: Product[]): RecommendationResult | null {
  const { userType, gardenSize, powerType, driveType } = state;
  
  if (!userType || !gardenSize || !powerType || !driveType) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  const allowedPowerTypes = powerTypeMapping[powerType];
  const allowedDriveTypes = driveTypeMapping[driveType];

  // Filter products by user type, power type, and drive type
  let candidates = products.filter(product => {
    const productUserType: string = product.userType;
    const userTypeMatch = productUserType === 'both' || 
      (userType === 'homeowner' && productUserType === 'homeowner') ||
      (userType === 'professional' && (productUserType === 'professional' || productUserType === 'both'));
    
    const powerTypeMatch = allowedPowerTypes.includes(product.powerType);
    const driveTypeMatch = allowedDriveTypes.includes(product.driveType);
    
    return userTypeMatch && powerTypeMatch && driveTypeMatch;
  });

  // Fallback 1: relax user type but keep power + drive
  if (candidates.length === 0) {
    candidates = products.filter(product => {
      const powerTypeMatch = allowedPowerTypes.includes(product.powerType);
      const driveTypeMatch = allowedDriveTypes.includes(product.driveType);
      return powerTypeMatch && driveTypeMatch;
    });
  }

  // If we have candidates but none can handle the garden size - show no match
  if (candidates.length > 0) {
    const suitable = candidates.filter(p => p.maxArea >= gardenSize);
    
    if (suitable.length === 0) {
      const maxAvailable = Math.max(...candidates.map(p => p.maxArea));
      const alternatives = findAlternatives(gardenSize, products, powerType, driveType);
      
      return {
        products: [],
        reason: '',
        noMatch: true,
        noMatchReason: `מכסחות ${translateDrive(driveType)} בהנעת ${translatePower(powerType)} מתאימות לשטחים עד ${maxAvailable.toLocaleString()} מ"ר בלבד. הגינה שלך (${gardenSize.toLocaleString()} מ"ר) דורשת פתרון אחר.`,
        alternatives,
      };
    }

    // Sort by closest maxArea (smallest that fits)
    const sorted = suitable.sort((a, b) => a.maxArea - b.maxArea);
    
    const reason = sorted.length > 1 
      ? 'הפתרונות המתאימים ביותר לגינה שלך'
      : 'התאמה מושלמת לגודל הגינה שלך';

    return {
      products: sorted,
      reason,
    };
  }

  // No candidates at all for this power+drive combo
  const alternatives = findAlternatives(gardenSize, products, powerType, driveType);
  
  return {
    products: [],
    reason: '',
    noMatch: true,
    noMatchReason: `לא נמצאו מוצרים בקטגוריית ${translateDrive(driveType)} + ${translatePower(powerType)}. נסה שילוב אחר.`,
    alternatives,
  };
}

export function getAlternativeProducts(
  state: WizardState, 
  excludeProduct: Product, 
  products: Product[],
  limit: number = 2
): Product[] {
  const { userType, gardenSize, powerType, driveType } = state;
  
  if (!userType || !gardenSize || !powerType || !driveType) {
    return [];
  }

  const allowedPowerTypes = powerTypeMapping[powerType];
  const allowedDriveTypes = driveTypeMapping[driveType];

  return products
    .filter(product => {
      if (product.link === excludeProduct.link) return false;
      
      const productUserType: string = product.userType;
      const userTypeMatch = productUserType === 'both' || 
        (userType === 'homeowner' && productUserType === 'homeowner') ||
        (userType === 'professional' && (productUserType === 'professional' || productUserType === 'both'));
      
      const powerTypeMatch = allowedPowerTypes.includes(product.powerType);
      const driveTypeMatch = allowedDriveTypes.includes(product.driveType);
      
      return userTypeMatch && powerTypeMatch && driveTypeMatch && product.maxArea >= gardenSize;
    })
    .sort((a, b) => Math.abs(a.maxArea - gardenSize) - Math.abs(b.maxArea - gardenSize))
    .slice(0, limit);
}
