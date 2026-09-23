export type CurrencyCode = 'INR' | 'USD' | 'SGD' | 'AED' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
  rateFromUSD: number; // 1 Currency = X USD
  lastUpdated: string;
  source: string;
}

export type IndustryType =
  | 'Software / SaaS'
  | 'E-commerce'
  | 'Retail'
  | 'Manufacturing'
  | 'Logistics'
  | 'Consulting / Professional Services'
  | 'Healthcare'
  | 'FinTech'
  | 'EdTech'
  | 'Food / Hospitality'
  | 'SaaS'
  | 'AI / Software'
  | 'Other';

export type BusinessModelType =
  | 'B2B'
  | 'B2C'
  | 'B2B2C'
  | 'Marketplace'
  | 'Subscription'
  | 'Physical Product'
  | 'Services'
  | 'Other';

export type ExpansionObjective =
  | 'Enter a new market'
  | 'Open sales office'
  | 'Open development centre'
  | 'Hire employees'
  | 'Manufacturing / production'
  | 'Retail / physical location'
  | 'Regional headquarters'
  | 'Import / export'
  | 'Remote operations'
  | 'Establish a sales office'
  | 'Establish a development centre'
  | 'Manufacture products'
  | 'Open retail operations'
  | 'Set up regional headquarters'
  | 'Acquire another company'
  | 'Establish remote operations';

export type RoleCategory =
  | 'Software / IT'
  | 'Customer Support'
  | 'Sales'
  | 'Marketing'
  | 'Finance / Accounting'
  | 'Human Resources'
  | 'Management'
  | 'Skilled Technical Workers'
  | 'Physical / Manual Labour'
  | 'Warehouse / Logistics'
  | 'Manufacturing Workers'
  | 'Delivery / Operations'
  | 'Healthcare / Specialized Professionals'
  | 'Finance'
  | 'HR'
  | 'Warehouse Workers'
  | 'Delivery Workers'
  | 'Healthcare Workers'
  | 'Other';

export interface RoleRequirement {
  id: string;
  role: RoleCategory;
  count: number;
  experience: 'Entry' | 'Mid' | 'Senior' | 'Entry-level' | 'Mid-level' | 'Executive';
  skillLevel?: 'Unskilled' | 'Semi-skilled' | 'Skilled' | 'Highly Specialized';
  salaryExpectationMonthlyUSD: number;
  languages?: string[];
  languageRequirement?: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  preference: 'Local employee' | 'Foreign employee' | 'Either' | 'Local worker' | 'Foreign worker' | 'No preference';
  qualification?: string;
}

export interface StartupProfile {
  name: string;
  currentCountry: string;
  industry: IndustryType;
  businessModel: BusinessModelType;
  companySize: string; // e.g. "1-10", "11-50", "51-200", "201+"
  annualRevenueUSD: number;
  currentRevenueText?: string;
  currentEmployees: number;
  expansionBudgetUSD: number; // Stored in USD base
  expansionBudgetHomeCurrency: number; // e.g. 5,00,0000 INR
  homeCurrency: CurrencyCode;
  timeline: string; // e.g. "3-6 months"
  hasPhysicalProducts: boolean;
}

export type FactorPriority = 'High' | 'Medium' | 'Low';

export interface FactorWeights {
  market: number; // percentage weight, e.g. 20%
  cost: number; // percentage weight, e.g. 25%
  labour: number; // percentage weight, e.g. 25%
  businessEnvironment: number; // percentage weight, e.g. 10%
  regulatory: number; // percentage weight, e.g. 15%
  risk: number; // percentage weight, e.g. 5%
}

export interface PriorityWeights {
  marketFit: number;
  talentAvailability: number;
  costEfficiency: number;
  taxFavorability: number;
  regulatoryPredictability: number;
  foreignWorkerEase: number;
  infrastructure: number;
}

export interface ScoreFactorBreakdown {
  category: string;
  scoreContribution: number; // +18, -5, etc.
  explanation: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface CountryScoreMetrics {
  marketFit: number; // 0 - 20
  labourFit: number; // 0 - 20
  costFit: number; // 0 - 20
  regulatoryFit: number; // 0 - 20
  risk: number; // 0 - 10
  infrastructure: number; // 0 - 10
}

export interface CountryScore {
  countryCode: string;
  countryName: string;
  readinessScore: number; // 0-100
  factors: ScoreFactorBreakdown[];
  categoryScores: {
    marketFit: number;
    talent: number;
    cost: number;
    tax: number;
    regulation: number;
    foreignHiring: number;
    infrastructure: number;
  };
  metrics: CountryScoreMetrics;
  recommendationHeadline: string;
  keyAdvantages: string[];
  keyChallenges: string[];
}

export interface BusinessStructure {
  name: string;
  legalStatus: string;
  liability: string;
  foreignOwnership: string;
  setupComplexity: 'Low' | 'Medium' | 'High';
  setupTimeWeeks: number;
  officialRegFeeUSD: number;
  estimatedLegalAgencyFeeUSD: number;
  basicRequirements: string[];
  officialSource: string;
}

export interface LicenseRequirement {
  name: string;
  regulator: string;
  status: 'Likely required' | 'Check required' | 'Possibly not applicable';
  description: string;
}

export interface LabourMetric {
  roleCategory: RoleCategory;
  talentAvailability: 'High' | 'Medium' | 'Low';
  estimatedSalaryRangeUSD: { min: number; max: number };
  hiringDifficulty: 'Low' | 'Medium' | 'High';
  foreignWorkerPassType: string;
  foreignWorkerMinSalaryUSD: number;
  quotaOrLevyDetails: string;
}

export interface TaxMetrics {
  corporateTaxRate: number; // e.g., 17 for 17%
  headlineVatGstRate: number; // e.g., 9 for 9%
  payrollTaxRateEst: number;
  withholdingTaxDividend: number;
  taxComplexity: 'Low' | 'Medium' | 'High';
  startupIncentives: string[];
  taxImpactSummary: string;
}

export interface DataPrivacyMetrics {
  lawName: string; // e.g., PDPA (Singapore), GDPR (Germany), UAE Data Protection Law
  dpoRequirement: string;
  crossBorderTransferRules: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  officialSource: string;
}

export interface RiskFactor {
  id: string;
  category: 'Financial' | 'Regulatory' | 'Labour' | 'Currency' | 'Political' | 'Compliance' | 'Operational' | 'Data';
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  cause: string;
  mitigation: string;
  verificationSteps: string[];
}

export interface IncentiveProgram {
  id: string;
  programName: string;
  qualifyingCriteria: string;
  potentialBenefit: string;
  applicationRequirements: string;
  officialSource: string;
}

export type CostSourceType = 'Official Fee' | 'API Data' | 'Dataset Estimate' | 'Model Estimate' | 'User Entered';

export interface CostBreakdownItem {
  id: string;
  section: 'A' | 'B' | 'C' | 'D' | 'E';
  sectionTitle: string;
  category: string;
  item: string;
  amountUSD: number;
  officialFeeUSD: number;
  estimatedBusinessCostUSD: number;
  userProvidedCostUSD: number;
  modelGeneratedEstimateUSD: number;
  sourceType: CostSourceType;
  isOfficialFee: boolean;
  isUserOverridden?: boolean;
  period: 'one-time' | 'monthly' | 'annual';
  notes: string;
}

export interface CostCalculationResult {
  initialSetupUSD: number;
  monthlyOperatingUSD: number;
  monthlyPayrollUSD: number;
  firstYearTotalUSD: number;
  year2EstimateUSD: number;
  year3EstimateUSD: number;
  sectionATotalUSD: number; // Initial Setup Cost
  sectionBTotalUSD: number; // Employee Cost (Monthly * 12)
  sectionCTotalUSD: number; // Office / Operating Cost (Monthly * 12)
  sectionDTotalUSD: number; // Tax / Govt Cost
  sectionETotalUSD: number; // Foreign Worker Cost
  items: CostBreakdownItem[];
  waterfall: { label: string; amountUSD: number; type: 'setup' | 'payroll' | 'office' | 'compliance' | 'other' }[];
}

export interface CountryMasterData {
  code: string; // 'SG', 'AE', 'DE'
  name: string;
  flag: string;
  region: string;
  currency: CurrencyCode;
  corporateTaxRate: number;
  vatGstRate: number;
  businessSetupComplexity: 'Low' | 'Medium' | 'High';
  talentAvailability: 'High' | 'Medium' | 'Low';
  labourCostLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  regulatoryComplexity: 'Low' | 'Medium' | 'High';
  marketPotential: 'High' | 'Medium' | 'Low';
  foreignOwnership: string; // e.g., "100% Foreign Ownership Permitted"
  dataConfidenceScore: number; // e.g. 92 for 92%

  overviewText: string;
  businessStructures: BusinessStructure[];
  licenses: LicenseRequirement[];
  labourMetrics: LabourMetric[];
  tax: TaxMetrics;
  dataPrivacy: DataPrivacyMetrics;
  bankingEase: 'Easy' | 'Moderate' | 'Challenging';
  bankingRequirements: string[];
  importExportReqs: { required: boolean; customsDetails: string; tradeDocName: string };
  ipProtectionInfo: string;
  insuranceRecommendations: string[];
  incentives: IncentiveProgram[];
  risks: RiskFactor[];
  officialSources: { name: string; url: string; type: string }[];
}

export interface ExpansionPlan {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  profile: StartupProfile;
  objectives: ExpansionObjective[];
  workforce: RoleRequirement[];
  priorities: PriorityWeights;
  factorWeights: FactorWeights;
  costOverrides?: Record<string, number>;
  selectedCountries: string[];
  targetCountryCode: string;
  completedChecklistIds: string[];
}

export interface RoadmapStep {
  id: string;
  phaseNumber: number;
  phaseName: string;
  title: string;
  description: string;
  estimatedDuration: string;
  authority: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  requiredDocuments: string[];
  officialSource: string;
}

export interface DocumentItem {
  id: string;
  category: 'Company' | 'Founder' | 'Employees' | 'Tax' | 'Banking' | 'Licensing' | 'Trade' | 'Compliance';
  name: string;
  isMandatory: boolean;
  purpose: string;
  authority: string;
  status: 'Completed' | 'Pending Upload' | 'Not Required';
  fileUrl?: string;
}

export interface RAGArticle {
  id: string;
  countryCode: string;
  title: string;
  category: 'Registration' | 'Tax' | 'Immigration' | 'Data Protection' | 'Banking' | 'Licensing';
  section: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'update' | 'warning' | 'info';
}

export interface ScenarioInput {
  targetCountryCode: string;
  additionalForeignEmployees: number;
  additionalLocalEmployees: number;
  officeSpaceSqFt: number;
  budgetChangePercentage: number;
  salaryTierMultiplier: number; // 0.8 to 1.5
}
