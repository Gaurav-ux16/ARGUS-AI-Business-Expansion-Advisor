import type { ExpansionPlan } from '../types';

export const DEFAULT_EXPANSION_PLAN: ExpansionPlan = {
  id: 'plan-default-saas-sg',
  name: 'Global Expansion Plan',
  createdAt: '2026-08-15',
  updatedAt: '2026-08-18',
  targetCountryCode: 'SG',
  selectedCountries: ['SG', 'AE', 'DE'],
  completedChecklistIds: ['chk-1', 'chk-2'],

  profile: {
    name: 'ApexMetrics Global',
    currentCountry: 'India',
    industry: 'Software / SaaS',
    businessModel: 'B2B',
    companySize: '11-50 employees',
    annualRevenueUSD: 450000,
    currentRevenueText: '$450,000 USD / year',
    currentEmployees: 18,
    expansionBudgetHomeCurrency: 6000000, // ₹60 Lakhs
    homeCurrency: 'INR',
    expansionBudgetUSD: 71850,
    timeline: '3-6 months',
    hasPhysicalProducts: false,
  },

  objectives: [
    'Enter a new market',
    'Open sales office',
    'Open development centre',
    'Hire employees',
  ],

  workforce: [
    {
      id: 'wf-1',
      role: 'Customer Support',
      count: 10,
      experience: 'Entry',
      skillLevel: 'Semi-skilled',
      salaryExpectationMonthlyUSD: 2800,
      languages: ['English', 'Hindi'],
      languageRequirement: 'English required',
      workMode: 'On-site',
      preference: 'Local employee',
      qualification: 'Diploma or Bachelor Degree',
    },
    {
      id: 'wf-2',
      role: 'Software / IT',
      count: 5,
      experience: 'Senior',
      skillLevel: 'Skilled',
      salaryExpectationMonthlyUSD: 6500,
      languages: ['English'],
      languageRequirement: 'English fluency',
      workMode: 'Hybrid',
      preference: 'Foreign employee',
      qualification: 'B.S. / M.S. in Computer Science',
    },
  ],

  factorWeights: {
    market: 20,
    cost: 25,
    labour: 25,
    businessEnvironment: 10,
    regulatory: 15,
    risk: 5,
  },

  costOverrides: {},

  priorities: {
    marketFit: 25,
    talentAvailability: 25,
    costEfficiency: 15,
    taxFavorability: 15,
    regulatoryPredictability: 10,
    foreignWorkerEase: 5,
    infrastructure: 5,
  },
};

export const MOCK_SAVED_PLANS: ExpansionPlan[] = [
  DEFAULT_EXPANSION_PLAN,
  {
    ...DEFAULT_EXPANSION_PLAN,
    id: 'plan-uae-support',
    name: 'Dubai Expansion — Customer Support Hub',
    targetCountryCode: 'AE',
    selectedCountries: ['AE', 'SG'],
    profile: {
      ...DEFAULT_EXPANSION_PLAN.profile,
      expansionBudgetHomeCurrency: 4000000,
      expansionBudgetUSD: 47900,
    },
  },
  {
    ...DEFAULT_EXPANSION_PLAN,
    id: 'plan-de-eng',
    name: 'Germany Expansion — EU Engineering Hub',
    targetCountryCode: 'DE',
    selectedCountries: ['DE', 'SG'],
    profile: {
      ...DEFAULT_EXPANSION_PLAN.profile,
      expansionBudgetHomeCurrency: 8000000,
      expansionBudgetUSD: 95800,
    },
  },
];
