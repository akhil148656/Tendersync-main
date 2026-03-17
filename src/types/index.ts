export interface Tender {
  id: string;
  title: string;
  source: string;
  deadline: string;
  status: string;
  description: string;
}

export interface Bid {
  id: string;
  tenderName: string;
  amount: number;
  status: string;
  dateSubmitted: string;
  tenderId: string;
  aiRecommendation: string;
}
