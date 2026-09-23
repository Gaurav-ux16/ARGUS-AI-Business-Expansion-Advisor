import type { CountryScore, ExpansionPlan, ScenarioInput } from '../types';
import { COUNTRIES_DATA } from '../data/countriesData';
import { ScoringEngine } from './scoringEngine';
import { CostCalculatorService } from './costCalculator';

export interface ScenarioResult {
  originalScore: number;
  newScore: number;
  scoreDelta: number;
  originalFirstYearCostUSD: number;
  newFirstYearCostUSD: number;
  costDeltaUSD: number;
  riskShiftMessage: string;
  recalculatedCountryScore: CountryScore;
}

export class ScenarioSimulatorService {
  public static simulate(plan: ExpansionPlan, input: ScenarioInput): ScenarioResult {
    const targetCountryCode = input.targetCountryCode || plan.targetCountryCode || 'SG';
    const countryData = COUNTRIES_DATA[targetCountryCode] || COUNTRIES_DATA['SG'];

    const originalScore = ScoringEngine.calculateCountryScore(plan, countryData);
    const originalCosts = CostCalculatorService.calculatePlanCosts(plan, countryData);

    // Create modified plan
    const modifiedPlan: ExpansionPlan = JSON.parse(JSON.stringify(plan));

    // Modify workforce based on input
    if (input.additionalForeignEmployees > 0 || input.additionalLocalEmployees > 0) {
      modifiedPlan.workforce.push({
        id: `sim-role-${Date.now()}`,
        role: 'Customer Support',
        count: input.additionalForeignEmployees + input.additionalLocalEmployees,
        experience: 'Mid-level',
        skillLevel: 'Skilled',
        salaryExpectationMonthlyUSD: 3000,
        languages: ['English'],
        workMode: 'Hybrid',
        preference: input.additionalForeignEmployees > 0 ? 'Foreign worker' : 'Local worker',
      });
    }

    // Salary multiplier adjustment
    if (input.salaryTierMultiplier && input.salaryTierMultiplier !== 1.0) {
      modifiedPlan.workforce.forEach((w) => {
        w.salaryExpectationMonthlyUSD = Math.round(w.salaryExpectationMonthlyUSD * input.salaryTierMultiplier);
      });
    }

    // Budget percentage change
    if (input.budgetChangePercentage !== 0) {
      modifiedPlan.profile.expansionBudgetUSD = Math.round(
        modifiedPlan.profile.expansionBudgetUSD * (1 + input.budgetChangePercentage / 100)
      );
    }

    const newScoreObj = ScoringEngine.calculateCountryScore(modifiedPlan, countryData);
    const newCosts = CostCalculatorService.calculatePlanCosts(modifiedPlan, countryData);

    const scoreDelta = newScoreObj.readinessScore - originalScore.readinessScore;
    const costDeltaUSD = newCosts.firstYearTotalUSD - originalCosts.firstYearTotalUSD;

    let riskShiftMessage = 'Negligible risk impact. Requirements remain within expected bounds.';
    if (input.additionalForeignEmployees >= 10 && targetCountryCode === 'SG') {
      riskShiftMessage = '⚠ High Labour Quota Risk: Adding 10+ foreign employees in Singapore triggers strict S-Pass quota ceilings (10% limit) and COMPASS EP salary tier evaluations.';
    } else if (costDeltaUSD > plan.profile.expansionBudgetUSD * 0.4) {
      riskShiftMessage = '⚠ High Financial Risk: The scenario cost exceeds initial budget runway by >40%.';
    } else if (scoreDelta > 3) {
      riskShiftMessage = '✓ Positive Scenario: Increased budget or local workforce allocation boosts expansion readiness.';
    }

    return {
      originalScore: originalScore.readinessScore,
      newScore: newScoreObj.readinessScore,
      scoreDelta,
      originalFirstYearCostUSD: originalCosts.firstYearTotalUSD,
      newFirstYearCostUSD: newCosts.firstYearTotalUSD,
      costDeltaUSD,
      riskShiftMessage,
      recalculatedCountryScore: newScoreObj,
    };
  }
}
