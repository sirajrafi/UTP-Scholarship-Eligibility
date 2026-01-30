import { SCHOLARSHIPS } from '../constants';
import { UserProfile, EligibilityResult } from '../types';

export const checkEligibility = (profile: UserProfile): EligibilityResult[] => {
  return SCHOLARSHIPS.map((scholarship) => {
    const reasons: string[] = [];

    // --- STRICT CHECKS ---
    
    // 1. CGPA
    if (profile.cgpa < scholarship.minCgpa) {
      reasons.push(`Current CGPA (${profile.cgpa.toFixed(2)}) is below the minimum requirement of ${scholarship.minCgpa.toFixed(2)}.`);
    }

    // 2. Income
    if (scholarship.maxIncome !== undefined && profile.income > scholarship.maxIncome) {
      reasons.push(`Household income (RM ${profile.income}) exceeds the limit of RM ${scholarship.maxIncome}.`);
    }

    // 3. Co-Curricular
    if (profile.cocu < scholarship.minCocu) {
      reasons.push(`Co-curricular score (${profile.cocu}) is below the minimum required (${scholarship.minCocu}).`);
    }

    // 4. Citizenship
    if (scholarship.malaysianOnly && !profile.isMalaysian) {
      reasons.push("This scholarship is strictly for Malaysian citizens.");
    }

    // 5. Year of Study
    const isYearAllowed = scholarship.allowedYears.includes("All") || scholarship.allowedYears.includes(profile.year);
    if (!isYearAllowed) {
      reasons.push(`Only open to students in: ${scholarship.allowedYears.join(", ")}.`);
    }

    // 6. Programme
    const isProgrammeAllowed = scholarship.allowedProgrammes.includes("All") || scholarship.allowedProgrammes.includes(profile.programme);
    if (!isProgrammeAllowed) {
      reasons.push(`Your programme (${profile.programme}) is not listed for this scholarship.`);
    }

    const isEligible = reasons.length === 0;
    let matchScore = 0;

    // --- STRENGTH CALCULATION (Only if Eligible) ---
    if (isEligible) {
      // Base score for being eligible
      let score = 60;

      // Bonus for CGPA (Up to 20 pts)
      // Scale: (Actual - Min) / (4.0 - Min)
      const cgpaRange = 4.0 - scholarship.minCgpa;
      if (cgpaRange > 0) {
        const cgpaBonus = ((profile.cgpa - scholarship.minCgpa) / cgpaRange) * 20;
        score += cgpaBonus;
      }

      // Bonus for Co-Curricular (Up to 10 pts)
      const cocuRange = 10 - scholarship.minCocu;
      if (cocuRange > 0) {
        const cocuBonus = ((profile.cocu - scholarship.minCocu) / cocuRange) * 10;
        score += cocuBonus;
      }

      // Bonus for Income (Lower income = higher priority usually, Up to 10 pts)
      // If income is 0 -> full bonus. If income is limit -> 0 bonus.
      if (scholarship.maxIncome) {
        const incomeRatio = 1 - (profile.income / scholarship.maxIncome);
        score += incomeRatio * 10;
      } else {
        score += 5; // Flat bonus if no income limit
      }

      matchScore = Math.round(Math.min(100, score));
    }

    return {
      scholarship,
      isEligible,
      reasons,
      matchScore, // 0 if not eligible
    };
  });
};