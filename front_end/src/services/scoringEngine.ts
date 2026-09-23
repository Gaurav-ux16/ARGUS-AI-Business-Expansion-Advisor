import type {
  CountryMasterData,
  CountryScore,
  CountryScoreMetrics,
  ExpansionPlan,
  ScoreFactorBreakdown,
} from '../types';
import { COUNTRIES_DATA } from '../data/countriesData';
import { CostCalculatorService } from './costCalculator';
import { LabourService } from './labourService';
import { FactorService } from './factorService';

export class ScoringEngine {
  public static calculateCountryScore(
    plan: ExpansionPlan,
    countryData: CountryMasterData
  ): CountryScore {
    const { profile, workforce } = plan;
    const factorWeights = FactorService.normalizeWeights(
      plan.factorWeights || {
        market: 20,
        cost: 25,
        labour: 25,
        businessEnvironment: 10,
        regulatory: 15,
        risk: 5,
      }
    );

    const costs = CostCalculatorService.calculatePlanCosts(plan, countryData);
    const labourSummary = LabourService.assessWorkforceFeasibility(countryData.code, workforce);

    // ============================================================
    // 1. MARKET FIT (0 - 20)
    // ============================================================
    let baseMarket = 15;
    const ind = profile.industry;

    if (ind === 'Software / SaaS' || ind === 'SaaS' || ind === 'AI / Software') {
      if (countryData.code === 'SG') baseMarket = 19;
      else if (countryData.code === 'AE') baseMarket = 17;
      else baseMarket = 16;
    } else if (ind === 'FinTech') {
      if (countryData.code === 'SG') baseMarket = 19;
      else if (countryData.code === 'AE') baseMarket = 18;
      else baseMarket = 15;
    } else if (ind === 'E-commerce' || ind === 'Retail') {
      if (countryData.code === 'AE') baseMarket = 19;
      else if (countryData.code === 'SG') baseMarket = 17;
      else baseMarket = 16;
    } else if (ind === 'Manufacturing' || ind === 'Logistics') {
      if (countryData.code === 'DE') baseMarket = 19;
      else if (countryData.code === 'AE') baseMarket = 17;
      else baseMarket = 13;
    } else if (ind === 'Healthcare') {
      if (countryData.code === 'DE') baseMarket = 18;
      else if (countryData.code === 'SG') baseMarket = 18;
      else baseMarket = 15;
    } else if (ind === 'Consulting / Professional Services') {
      if (countryData.code === 'SG') baseMarket = 18;
      else if (countryData.code === 'AE') baseMarket = 18;
      else baseMarket = 16;
    } else {
      if (countryData.code === 'SG') baseMarket = 17;
      else if (countryData.code === 'AE') baseMarket = 16;
      else baseMarket = 15;
    }

    // Objective adjustment
    const objs = plan.objectives || [];
    if (objs.includes('Regional headquarters') && countryData.code === 'SG') baseMarket = Math.min(20, baseMarket + 1);
    if (objs.includes('Manufacturing / production') && countryData.code === 'DE') baseMarket = Math.min(20, baseMarket + 1);
    if (objs.includes('Enter a new market') && countryData.code === 'AE') baseMarket = Math.min(20, baseMarket + 1);

    // Apply factor weight multiplier relative to baseline 20%
    const marketMultiplier = factorWeights.market / 20;
    const marketFit = Math.min(20, Math.max(8, Math.round(baseMarket * (0.7 + 0.3 * marketMultiplier))));

    // ============================================================
    // 2. LABOUR FIT (0 - 20)
    // ============================================================
    let baseLabour = 16;
    if (countryData.code === 'SG') {
      // Singapore has high talent pool for software/management, but S-Pass quota ceilings for foreign volume
      if (labourSummary.totalForeignDesired > 4) baseLabour = 15;
      else baseLabour = 18;
    } else if (countryData.code === 'AE') {
      // UAE has virtually zero foreign visa quotas in Freezones
      baseLabour = 18;
    } else {
      // Germany has high engineering quality, but strict notice periods & works councils
      if (workforce.some((w) => w.role === 'Software / IT' || w.role === 'Skilled Technical Workers')) {
        baseLabour = 17;
      } else {
        baseLabour = 15;
      }
    }

    // Check specific role alignments
    const hasCS = workforce.some((w) => w.role === 'Customer Support');
    if (hasCS && countryData.code === 'AE') baseLabour = Math.min(20, baseLabour + 1);

    const labourMultiplier = factorWeights.labour / 25;
    const labourFit = Math.min(20, Math.max(8, Math.round(baseLabour * (0.7 + 0.3 * labourMultiplier))));

    // ============================================================
    // 3. COST FIT (0 - 20)
    // ============================================================
    let baseCost = 15;
    const userBudgetUSD = profile.expansionBudgetUSD || 0;
    const firstYearCostUSD = costs.firstYearTotalUSD;

    if (userBudgetUSD > 0) {
      const ratio = userBudgetUSD / firstYearCostUSD;
      if (ratio >= 1.4) baseCost = 19;
      else if (ratio >= 1.1) baseCost = 17;
      else if (ratio >= 0.9) baseCost = 15;
      else if (ratio >= 0.7) baseCost = 12;
      else baseCost = 9; // under-budgeted
    } else {
      // Relative country cost level
      if (countryData.code === 'AE') baseCost = 17;
      else if (countryData.code === 'SG') baseCost = 15;
      else baseCost = 13;
    }

    const costMultiplier = factorWeights.cost / 25;
    const costFit = Math.min(20, Math.max(6, Math.round(baseCost * (0.7 + 0.3 * costMultiplier))));

    // ============================================================
    // 4. REGULATORY FIT (0 - 20)
    // ============================================================
    let baseReg = 16;
    if (countryData.code === 'SG') {
      // 1-day ACRA, 100% foreign ownership, 17% tax with exemptions
      baseReg = 19;
    } else if (countryData.code === 'AE') {
      // Freezone flexibility, 0-9% tax, rapid licensing
      baseReg = 18;
    } else {
      // GmbH incorporation formality, ~30% combined tax, strict GDPR
      baseReg = 14;
    }

    const regMultiplier = factorWeights.regulatory / 15;
    const regulatoryFit = Math.min(20, Math.max(8, Math.round(baseReg * (0.7 + 0.3 * regMultiplier))));

    // ============================================================
    // 5. RISK (0 - 10)
    // ============================================================
    let baseRisk = 8;
    if (countryData.code === 'SG') baseRisk = 9;
    else if (countryData.code === 'DE') baseRisk = 9;
    else if (countryData.code === 'AE') baseRisk = 8;

    const riskMultiplier = factorWeights.risk / 5;
    const riskFit = Math.min(10, Math.max(5, Math.round(baseRisk * (0.7 + 0.3 * riskMultiplier))));

    // ============================================================
    // 6. INFRASTRUCTURE & BUSINESS ENVIRONMENT (0 - 10)
    // ============================================================
    let baseInfra = 8;
    if (countryData.code === 'SG') baseInfra = 9;
    else if (countryData.code === 'AE') baseInfra = 9;
    else if (countryData.code === 'DE') baseInfra = 8;

    const infraMultiplier = factorWeights.businessEnvironment / 10;
    const infrastructureFit = Math.min(10, Math.max(5, Math.round(baseInfra * (0.7 + 0.3 * infraMultiplier))));

    // Total Readiness Score: sum of all 6 components
    const totalScore = Math.min(100, marketFit + labourFit + costFit + regulatoryFit + riskFit + infrastructureFit);

    const metrics: CountryScoreMetrics = {
      marketFit,
      labourFit,
      costFit,
      regulatoryFit,
      risk: riskFit,
      infrastructure: infrastructureFit,
    };

    // ============================================================
    // EXPLAINABILITY BREAKDOWN FACTORS
    // ============================================================
    const factors: ScoreFactorBreakdown[] = [
      {
        category: 'Market Fit',
        scoreContribution: marketFit,
        explanation: `${marketFit}/20 score: Tailored ecosystem depth for ${profile.industry} (${profile.businessModel || 'B2B'}).`,
        type: marketFit >= 16 ? 'positive' : 'neutral',
      },
      {
        category: 'Labour & Workforce Fit',
        scoreContribution: labourFit,
        explanation: `${labourFit}/20 score: Availability and visa feasibility assessed for your ${workforce.length} configured workforce roles.`,
        type: labourFit >= 16 ? 'positive' : 'neutral',
      },
      {
        category: 'Cost & Budget Sufficiency',
        scoreContribution: costFit,
        explanation: `${costFit}/20 score: Estimated 1st year total ($${costs.firstYearTotalUSD.toLocaleString()} USD) evaluated against target expansion budget.`,
        type: costFit >= 15 ? 'positive' : 'negative',
      },
      {
        category: 'Regulatory & Governance',
        scoreContribution: regulatoryFit,
        explanation: `${regulatoryFit}/20 score: ${countryData.foreignOwnership}; statutory corporate tax is ${countryData.corporateTaxRate}%.`,
        type: regulatoryFit >= 16 ? 'positive' : 'neutral',
      },
      {
        category: 'Institutional Risk & Security',
        scoreContribution: riskFit,
        explanation: `${riskFit}/10 score: Sovereign rating, regulatory predictability, and dispute enforcement framework.`,
        type: 'positive',
      },
      {
        category: 'Infrastructure & Connectivity',
        scoreContribution: infrastructureFit,
        explanation: `${infrastructureFit}/10 score: High-speed telecommunications, regional transport hubs, and fintech banking rails.`,
        type: 'positive',
      },
    ];

    if (labourSummary.totalForeignDesired > 4 && countryData.code === 'SG') {
      factors.push({
        category: 'Foreign Worker Quota Note',
        scoreContribution: -2,
        explanation: 'Singapore services sector caps S Pass foreign workers at 10% sub-quota; COMPASS points apply to EP candidates.',
        type: 'negative',
      });
    }

    let recommendationHeadline = '';
    if (countryData.code === 'SG') {
      recommendationHeadline = `Singapore scores ${totalScore}/100 for ${profile.name}. It provides premier access to Asian capital, 1-day ACRA incorporation, and 100% foreign ownership with 17% corporate tax exemptions.`;
    } else if (countryData.code === 'AE') {
      recommendationHeadline = `UAE scores ${totalScore}/100 for ${profile.name}. It delivers 0% personal tax, 0–9% corporate tax, 100% Freezone foreign ownership, and virtually unrestricted foreign talent visas.`;
    } else {
      recommendationHeadline = `Germany scores ${totalScore}/100 for ${profile.name}. It offers direct entry to the 450M EU Single Market, world-renowned engineering excellence, and fast-track EU Blue Card pathways.`;
    }

    return {
      countryCode: countryData.code,
      countryName: countryData.name,
      readinessScore: totalScore,
      factors,
      categoryScores: {
        marketFit: Math.round((marketFit / 20) * 100),
        talent: Math.round((labourFit / 20) * 100),
        cost: Math.round((costFit / 20) * 100),
        tax: Math.round((regulatoryFit / 20) * 100),
        regulation: Math.round((regulatoryFit / 20) * 100),
        foreignHiring: Math.round((labourFit / 20) * 100),
        infrastructure: Math.round((infrastructureFit / 10) * 100),
      },
      metrics,
      recommendationHeadline,
      keyAdvantages: [
        `${countryData.foreignOwnership}`,
        `${countryData.corporateTaxRate}% Corporate Tax rate with startup incentives`,
        `High digital infrastructure and global connectivity`,
      ],
      keyChallenges: [
        countryData.labourCostLevel === 'High' ? 'Competitive compensation expectations' : 'Regulatory filing compliance',
        countryData.code === 'SG' ? 'COMPASS points & S-Pass quota ceilings' : countryData.code === 'AE' ? 'Mainland Tawteen Emiratisation checks' : 'German notary and commercial register timelines',
      ],
    };
  }

  public static rankCountries(plan: ExpansionPlan): CountryScore[] {
    const selectedCodes =
      plan.selectedCountries && plan.selectedCountries.length > 0
        ? plan.selectedCountries
        : ['SG', 'AE', 'DE'];
    const scores: CountryScore[] = [];

    for (const code of selectedCodes) {
      const data = COUNTRIES_DATA[code];
      if (data) {
        scores.push(this.calculateCountryScore(plan, data));
      }
    }

    return scores.sort((a, b) => b.readinessScore - a.readinessScore);
  }
}
