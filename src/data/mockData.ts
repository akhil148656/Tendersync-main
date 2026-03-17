import { Tender, Bid } from '../types';

export const MOCK_TENDERS: Tender[] = [
  { id: 'TND-8821', title: 'Smart City Surveillance System', source: 'eProcure', deadline: '2026-04-12', status: 'Processing', description: 'Implementation of AI-powered surveillance cameras across major city intersections.' },
  { id: 'TND-4412', title: 'Cloud Infrastructure for Health Dept', source: 'GeM', deadline: '2026-04-08', status: 'Ready', description: 'Migration of legacy health records to a secure hybrid cloud environment.' },
  { id: 'TND-9010', title: 'Solar Grid Implementation Phase 2', source: 'eProcure', deadline: '2026-04-20', status: 'New', description: 'Expansion of existing solar grid capacity by 50MW in the western region.' },
  { id: 'TND-2234', title: 'AI-Based Traffic Management', source: 'State Portal', deadline: '2026-04-15', status: 'Ready', description: 'Real-time traffic flow optimization using deep learning models.' },
  { id: 'TND-2847', title: 'Supply of Lab Testing Equipment', source: 'GeM', deadline: '2026-03-25', status: 'New', description: 'Procurement of advanced diagnostic tools for regional laboratories.' },
  { id: 'TND-2846', title: 'Industrial Chemical Reagents', source: 'eProcure', deadline: '2026-03-22', status: 'Processing', description: 'Bulk supply of specialized reagents for industrial water treatment.' },
  { id: 'TND-2845', title: 'Quality Control Instruments', source: 'GeM', deadline: '2026-03-28', status: 'Ready', description: 'Precision measuring instruments for manufacturing quality assurance.' },
  { id: 'TND-2844', title: 'Safety Equipment & PPE', source: 'eProcure', deadline: '2026-03-20', status: 'New', description: 'Annual contract for personal protective equipment for field staff.' },
  { id: 'TND-2843', title: 'Calibration Services', source: 'GeM', deadline: '2026-04-01', status: 'Processing', description: 'On-site calibration of laboratory and industrial sensors.' },
  { id: 'TND-2842', title: 'Pharmaceutical Raw Materials', source: 'eProcure', deadline: '2026-03-30', status: 'Ready', description: 'Supply of active pharmaceutical ingredients for generic drug production.' },
  { id: 'TND-2841', title: 'Environmental Monitoring Equipment', source: 'GeM', deadline: '2026-04-05', status: 'New', description: 'Sensors for real-time monitoring of air and water quality parameters.' },
  { id: 'TND-2840', title: 'Electrical Components Supply', source: 'eProcure', deadline: '2026-03-19', status: 'Processing', description: 'Standard electrical fittings and components for government buildings.' },
];

export const MOCK_BIDS: Bid[] = [
  { id: 'BID-001', tenderName: 'Lab Testing Equipment', amount: 755000, status: 'Pending', dateSubmitted: '2026-03-17', tenderId: 'TND-2847', aiRecommendation: 'High probability of success based on technical match.' },
  { id: 'BID-002', tenderName: 'Chemical Reagents', amount: 420000, status: 'Approved', dateSubmitted: '2026-03-10', tenderId: 'TND-2846', aiRecommendation: 'Pricing optimized for maximum margin.' },
  { id: 'BID-003', tenderName: 'Safety Equipment Supply', amount: 289000, status: 'Rejected', dateSubmitted: '2026-03-05', tenderId: 'TND-2844', aiRecommendation: 'Competitor pricing was 12% lower.' },
  { id: 'BID-004', tenderName: 'Calibration Services', amount: 195000, status: 'Pending', dateSubmitted: '2026-03-15', tenderId: 'TND-2843', aiRecommendation: 'Technical specifications match 98%.' },
  { id: 'BID-005', tenderName: 'Electrical Components', amount: 560000, status: 'Approved', dateSubmitted: '2026-02-28', tenderId: 'TND-2840', aiRecommendation: 'Strong historical performance in this category.' },
];
