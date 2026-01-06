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

  // Score candidates based on how well they match the garden size
  const scored = candidates.map(product => {
    let score = 100;
    let reason = '';

    // Perfect match: product can handle the garden with some margin
    const margin = product.maxArea - gardenSize;
    const marginPercentage = (margin / gardenSize) * 100;

    if (margin < 0) {
      // Product is too small
      score -= 40;
      reason = 'מתאים לשטח קטן יותר, אך עדיין אפשרי';
    } else if (marginPercentage <= 20) {
      // Perfect match - product is just right (up to 20% larger)
      score = 100;
      reason = 'התאמה מושלמת לגודל הגינה שלך';
    } else if (marginPercentage <= 50) {
      // Good match - product has some extra capacity
      score = 90;
      reason = 'מתאים מצוין עם יכולת גדילה';
    } else if (marginPercentage <= 100) {
      // Decent match - product is somewhat oversized
      score = 75;
      reason = 'מתאים לגינה עם מרווח נוח';
    } else {
      // Product is much larger than needed
      score = 60;
      reason = 'חזק מהנדרש, מתאים גם לשטחים גדולים יותר';
    }

    return { product, matchScore: score, reason };
  });

  // Sort by score (highest first), then by how close the capacity is to the garden size
  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // If same score, prefer the one closest to garden size (but still >= garden size)
    const aMargin = a.product.maxArea - gardenSize;
    const bMargin = b.product.maxArea - gardenSize;
    
    // Prefer products that can handle the garden
    if (aMargin >= 0 && bMargin < 0) return -1;
    if (bMargin >= 0 && aMargin < 0) return 1;
    
    // Among suitable products, prefer the one with smaller margin
    return Math.abs(aMargin) - Math.abs(bMargin);
  });

  return scored[0];
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
