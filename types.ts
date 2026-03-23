
export interface InvestmentPlan {
  id: string;
  name: string;
  category: 'Crypto' | 'Stocks' | 'Real Estate' | 'AI Startups' | 'Fixed Income';
  riskLevel: 'Low' | 'Medium' | 'High';
  roi: number; // Percentage total
  dailyEarning: number; // Fixed Naira amount daily
  duration: number; // Days
  minInvestment: number;
  maxInvestment: number;
  description: string;
  trending?: boolean;
}

export interface PortfolioItem {
  id: string;
  planId: string;
  amountInvested: number;
  startDate: string;
  projectedReturn: number;
  dailyEarning: number;
  status: 'Active' | 'Completed';
}

export interface WithdrawalRequest {
  id: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: Date;
}

export interface ReferralRecord {
  id: string;
  date: string;
  amountInvested: number;
  commissionEarned: number;
  status: 'Joined' | 'Invested';
}

export interface UserData {
  balance: number;
  totalInvested: number;
  totalEarnings: number;
  portfolio: PortfolioItem[];
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  referrals: ReferralRecord[];
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  MARKETPLACE = 'marketplace',
  AI_ADVISOR = 'ai_advisor',
  PORTFOLIO = 'portfolio',
  SETTINGS = 'settings',
  ADMIN = 'admin',
  REFERRALS = 'referrals'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}
