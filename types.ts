
export interface Scholarship {
  id: string;
  name: string;
  minCgpa: number;
  maxIncome?: number; // Some might not have a limit stated
  minCocu: number;
  allowedYears: string[]; // "All" or ["Year 1", "Year 2"]
  malaysianOnly: boolean;
  allowedProgrammes: string[]; // "All" or specific list
  applicationLink: string;
}

export interface UserProfile {
  cgpa: number;
  income: number;
  programme: string;
  year: string;
  cocu: number;
  isMalaysian: boolean;
}

export interface EligibilityResult {
  scholarship: Scholarship;
  isEligible: boolean;
  reasons: string[];
  matchScore: number; // 0 to 100
}

export interface EssayAnalysis {
  overallScore: number;
  relevanceScore: number;
  vocabularyScore: number;
  sentimentScore: number;
  tone: string;
  feedback: string[];
  strengths: string[];
  improvements: string[];
}
