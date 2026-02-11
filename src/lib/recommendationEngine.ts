import { WizardState, PowerType, DriveType } from '@/types/wizard';
import { Product } from '@/data/products';

export interface RecommendationResult {
  products: Product[];
  reason: string;
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

  // Fallback 2: relax power type but keep drive type
  if (candidates.length === 0) {
    candidates = products.filter(product => {
      const driveTypeMatch = allowedDriveTypes.includes(product.driveType);
      return driveTypeMatch && product.maxArea >= gardenSize;
    });
  }

  // Fallback 3: only drive type
  if (candidates.length === 0) {
    candidates = products.filter(product => allowedDriveTypes.includes(product.driveType));
  }

  // Fallback 4: area-based with drive type
  if (candidates.length === 0) {
    candidates = products.filter(product => product.maxArea >= gardenSize);
  }

  if (candidates.length === 0) {
    const sortedByArea = [...products].sort((a, b) => b.maxArea - a.maxArea);
    return {
      products: [sortedByArea[0]],
      reason: 'המוצר הגדול ביותר שלנו לשטחים מאתגרים',
    };
  }

  // Filter to only products that can handle the garden size
  const suitable = candidates.filter(p => p.maxArea >= gardenSize);
  
  if (suitable.length === 0) {
    const largest = candidates.sort((a, b) => b.maxArea - a.maxArea)[0];
    return {
      products: [largest],
      reason: 'הפתרון הגדול ביותר הזמין בקטגוריה זו',
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
