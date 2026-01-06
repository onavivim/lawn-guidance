import { WizardState, PowerType, DriveType } from '@/types/wizard';
import { products, Product } from '@/data/products';

export interface RecommendationResult {
  product: Product;
  matchScore: number;
  reason: string;
}

// Map wizard power types to product power types
const powerTypeMapping: Record<PowerType, Product['powerType'][]> = {
  battery: ['battery'],
  petrol: ['petrol'],
  electric: ['electric'],
  manual: ['electric', 'battery'], // Manual mowers don't exist in catalog, fallback to electric/battery push
};

// Map wizard drive types to product drive types
const driveTypeMapping: Record<DriveType, Product['driveType'][]> = {
  push: ['push'],
  'self-propelled': ['self-propelled'],
  robot: ['robot'],
  'ride-on': ['ride-on'],
};

export function findBestProduct(state: WizardState): RecommendationResult | null {
  const { userType, gardenSize, powerType, driveType } = state;
  
  if (!userType || !gardenSize || !powerType || !driveType) {
    return null;
  }

  const allowedPowerTypes = powerTypeMapping[powerType];
  const allowedDriveTypes = driveTypeMapping[driveType];

  // Filter products by user type, power type, and drive type
  let candidates = products.filter(product => {
    // Check user type
    const productUserType: string = product.userType;
    const userTypeMatch = productUserType === 'both' || 
      (userType === 'homeowner' && productUserType === 'homeowner') ||
      (userType === 'professional' && (productUserType === 'professional' || productUserType === 'both'));
    
    // Check power type
    const powerTypeMatch = allowedPowerTypes.includes(product.powerType);
    
    // Check drive type
    const driveTypeMatch = allowedDriveTypes.includes(product.driveType);
    
    return userTypeMatch && powerTypeMatch && driveTypeMatch;
  });

  if (candidates.length === 0) {
    // Fallback: try to find any product that matches power and drive type
    candidates = products.filter(product => {
      const powerTypeMatch = allowedPowerTypes.includes(product.powerType);
      const driveTypeMatch = allowedDriveTypes.includes(product.driveType);
      return powerTypeMatch && driveTypeMatch;
    });
  }

  if (candidates.length === 0) {
    // Last fallback: any product that can handle the garden size
    candidates = products.filter(product => product.maxArea >= gardenSize);
  }

  if (candidates.length === 0) {
    // If still no candidates, return the largest capacity product
    const sortedByArea = [...products].sort((a, b) => b.maxArea - a.maxArea);
    return {
      product: sortedByArea[0],
      matchScore: 50,
      reason: 'המוצר הגדול ביותר שלנו לשטחים מאתגרים',
    };
  }

  // Find the product with the closest maxArea to the garden size
  const sorted = candidates.sort((a, b) => {
    const aDiff = Math.abs(a.maxArea - gardenSize);
    const bDiff = Math.abs(b.maxArea - gardenSize);
    return aDiff - bDiff;
  });

  const bestProduct = sorted[0];
  const diff = bestProduct.maxArea - gardenSize;
  
  let reason = '';
  if (Math.abs(diff) <= 100) {
    reason = 'התאמה מושלמת לגודל הגינה שלך';
  } else if (diff > 0) {
    reason = 'מתאים מצוין עם יכולת גדילה';
  } else {
    reason = 'הפתרון הקרוב ביותר לצרכים שלך';
  }

  return {
    product: bestProduct,
    matchScore: 100 - Math.min(50, Math.abs(diff) / 100),
    reason,
  };
}

export function getAlternativeProducts(
  state: WizardState, 
  excludeProduct: Product, 
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
