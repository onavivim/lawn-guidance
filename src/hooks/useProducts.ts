import { useState, useEffect } from 'react';
import { Product } from '@/data/products';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpJsMkEY3f_0z4eacnAXQ8CQDiAiZahmydbwYN5LPT-PudNw959p5rLCmRxpJIAD1Va4dv3DynofQ2/pub?output=csv';

// Map Hebrew values to English types
const userTypeMap: Record<string, Product['userType']> = {
  'בעל בית פרטי': 'homeowner',
  'איש מקצוע': 'professional',
  'בעל בית פרטי\\\\איש מקצוע': 'both',
  'בעל בית פרטי/איש מקצוע': 'both',
};

const powerTypeMap: Record<string, Product['powerType']> = {
  'בנזין': 'petrol',
  'סוללה': 'battery',
  'נטען': 'battery',
  'חשמל': 'electric',
  'חשמלי': 'electric',
  'ידני': 'manual',
};

const driveTypeMap: Record<string, Product['driveType']> = {
  'דחיפה': 'push',
  'הנעה עצמית': 'self-propelled',
  'נסיעה': 'self-propelled',
  'נסיעה עצמית': 'self-propelled',
  'רובוט': 'robot',
  'טרקטורון': 'ride-on',
};

function parseCSV(csv: string): string[][] {
  const lines = csv.split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

function parseProducts(csv: string): Product[] {
  const rows = parseCSV(csv);
  
  // Skip header rows (first 2 rows based on sheet structure)
  const dataRows = rows.slice(2).filter(row => row[0] && row[0].trim() !== '');
  
  return dataRows.map(row => {
    const [name, userTypeHeb, maxAreaStr, powerTypeHeb, driveTypeHeb, link] = row;
    
    // Parse maxArea - extract number from string like \"1800 מ\"ר\"
    const maxAreaMatch = maxAreaStr?.match(/(\d+)/);
    const maxArea = maxAreaMatch ? parseInt(maxAreaMatch[1], 10) : 0;
    
    return {
      name: name?.trim() || '',
      userType: userTypeMap[userTypeHeb?.trim()] || 'homeowner',
      maxArea,
      powerType: powerTypeMap[powerTypeHeb?.trim()] || 'petrol',
      driveType: driveTypeMap[driveTypeHeb?.trim()] || 'push',
      link: link?.trim() || '',
    };
  }).filter(product => product.name && product.link);
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch(CSV_URL);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products from Google Sheets');
        }
        
        const csv = await response.text();
        const parsedProducts = parseProducts(csv);
        
        if (parsedProducts.length === 0) {
          throw new Error('No products found in sheet');
        }
        
        setProducts(parsedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Keep products empty - could fallback to static data if needed
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
