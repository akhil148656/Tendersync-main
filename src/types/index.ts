export interface Tender {
  id: string;
  title: string;
  source: 'eProcure' | 'GeM';
  deadline: string;
  status: 'New' | 'Processing' | 'Ready';
  description: string;
  productsRequired: string[];
  testRequirements: string[];
  profitabilityScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Bid {
  id: string;
  tenderId: string;
  tenderName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateSubmitted: string;
  aiRecommendation: string;
}

export interface ProductMatch {
  requirement: string;
  matches: {
    sku: string;
    matchPercentage: number;
    price: number;
  }[];
}

export interface SpecComparison {
  parameter: string;
  requirement: string;
  products: {
    name: string;
    value: string;
    isMatch: boolean;
  }[];
}
