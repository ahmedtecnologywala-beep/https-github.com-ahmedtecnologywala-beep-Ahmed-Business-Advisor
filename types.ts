export interface UserProfile {
  fullName: string;
  city: string;
  age: string;
  budget: string;
  skills: string;
  interests: string;
}

export interface BusinessIdea {
  title: string;
  description: string;
  profitEstimate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  monthlyExpenses: string;
  suitability: string;
}

export interface InvestmentItem {
  item: string;
  cost: string;
}

export interface StartupPlan {
  ideaTitle: string;
  investmentBreakdown: InvestmentItem[];
  materials: string[];
  marketingStrategy: string[];
  staffing: string;
  timeline: string;
  locationRecommendation: string;
  imagePrompt: string;
  generatedImageUrl?: string;
}

export interface MarketAnalysis {
  demand: string;
  competition: string;
  tipsToStandOut: string[];
}

export interface LegalRequirements {
  licenses: string[];
  registration: string;
  guidance: string;
}

export interface SmartTips {
  businessNames: string[];
  logoIdeas: string[];
  socialMedia: string;
  actionPlan: string[];
}

export interface AdvisorResponse {
  businessIdeas: BusinessIdea[];
  bestIdeaPlan: StartupPlan;
  marketAnalysis: MarketAnalysis;
  legalRequirements: LegalRequirements;
  smartTips: SmartTips;
  motivationalNote: string;
}

export interface SavedProject extends AdvisorResponse {
  id: string;
  createdAt: number;
  userName: string;
  userCity: string;
  userBudget: string;
}

export type ViewState = 'HOME' | 'INPUT' | 'LOADING' | 'RESULTS' | 'SAVED';

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}