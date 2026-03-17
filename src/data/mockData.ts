import { Tender, Bid } from '../types';

export const MOCK_TENDERS: Tender[] = [
  {
    id: 'TND-2024-001',
    title: 'Supply of High-Performance Server Racks',
    source: 'eProcure',
    deadline: '2024-04-15',
    status: 'Ready',
    description: 'Procurement of 50 units of 42U server racks with advanced thermal management and integrated PDU systems for the National Data Center expansion project.',
    productsRequired: ['42U Server Rack', 'Intelligent PDU', 'Rack Cooling Unit'],
    testRequirements: ['Load Bearing Test', 'Thermal Efficiency Certification', 'Electrical Safety Compliance'],
    profitabilityScore: 85,
    riskLevel: 'Low',
  },
  {
    id: 'TND-2024-002',
    title: 'Smart City Surveillance System Phase II',
    source: 'GeM',
    deadline: '2024-04-20',
    status: 'Processing',
    description: 'Implementation of AI-powered surveillance cameras and central monitoring station for the metropolitan area. Requires high-definition night vision and real-time analytics.',
    productsRequired: ['4K AI Camera', 'Network Video Recorder', 'Video Wall Display'],
    testRequirements: ['IP67 Waterproof Test', 'Night Vision Range Verification', 'AI Detection Accuracy'],
    profitabilityScore: 72,
    riskLevel: 'Medium',
  },
  {
    id: 'TND-2024-003',
    title: 'Renewable Energy Storage Solution',
    source: 'eProcure',
    deadline: '2024-05-05',
    status: 'New',
    description: 'Design and supply of industrial-grade battery storage systems for a 10MW solar farm. Must include BMS and fire suppression systems.',
    productsRequired: ['Lithium Iron Phosphate Battery', 'Battery Management System', 'Power Inverter'],
    testRequirements: ['Cycle Life Test', 'Thermal Runaway Simulation', 'Grid Synchronization Test'],
    profitabilityScore: 92,
    riskLevel: 'High',
  },
];

export const MOCK_BIDS: Bid[] = [
  {
    id: 'BID-001',
    tenderId: 'TND-2024-001',
    tenderName: 'Supply of High-Performance Server Racks',
    amount: 1250000,
    status: 'Approved',
    dateSubmitted: '2024-03-10',
    aiRecommendation: 'High match with existing inventory. Competitive pricing suggested.',
  },
  {
    id: 'BID-002',
    tenderId: 'TND-2024-002',
    tenderName: 'Smart City Surveillance System Phase II',
    amount: 4500000,
    status: 'Pending',
    dateSubmitted: '2024-03-15',
    aiRecommendation: 'Moderate risk due to supply chain delays. Recommended 15% margin buffer.',
  },
];
