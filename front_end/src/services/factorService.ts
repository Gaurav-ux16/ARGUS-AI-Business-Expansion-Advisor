import type { FactorWeights, FactorPriority } from '../types';

export interface FactorSubItem {
  id: string;
  name: string;
  description: string;
}

export interface FactorCategoryDefinition {
  key: keyof FactorWeights;
  name: string;
  iconName: string;
  description: string;
  subFactors: FactorSubItem[];
}

export const FACTOR_CATEGORIES: FactorCategoryDefinition[] = [
  {
    key: 'market',
    name: 'Market',
    iconName: 'TrendingUp',
    description: 'Addressable customer base, target segment expansion, and competitive intensity.',
    subFactors: [
      { id: 'm_size', name: 'Market size', description: 'Total revenue and addressable population in your vertical' },
      { id: 'm_growth', name: 'Market growth', description: 'Year-over-year CAGR and sector expansion pace' },
      { id: 'm_demand', name: 'Customer demand', description: 'Local purchasing power and product-market receptivity' },
      { id: 'm_comp', name: 'Competition', description: 'Market saturation vs. whitespace opportunity' },
    ],
  },
  {
    key: 'cost',
    name: 'Cost',
    iconName: 'DollarSign',
    description: 'Capital required for incorporation, physical/flexi presence, payroll, and recurring operational burn.',
    subFactors: [
      { id: 'c_setup', name: 'Setup cost', description: 'Government registration, agency fees, and initial licensing' },
      { id: 'c_office', name: 'Office cost', description: 'CBD vs. suburban commercial lease and flexi-desk rates' },
      { id: 'c_labour', name: 'Labour cost', description: 'Average compensation benchmarks across requested roles' },
      { id: 'c_tax', name: 'Tax burden', description: 'Effective corporate, VAT/GST, and withholding tax liabilities' },
      { id: 'c_op', name: 'Operating cost', description: 'Utilities, accounting retainers, telecom, and travel expenses' },
      { id: 'c_fx', name: 'Currency impact', description: 'Exchange volatility and repatriation friction vs. home currency' },
    ],
  },
  {
    key: 'labour',
    name: 'Labour',
    iconName: 'Users',
    description: 'Availability of specialized talent, local hiring lead times, and foreign pass feasibility.',
    subFactors: [
      { id: 'l_avail', name: 'Talent availability', description: 'Qualified candidate depth for your specific workforce requirements' },
      { id: 'l_salary', name: 'Salary levels', description: 'Competitiveness of compensation needed to attract tier-1 talent' },
      { id: 'l_hiring', name: 'Hiring difficulty', description: 'Average time-to-hire and skill scarcity in target jurisdiction' },
      { id: 'l_foreign', name: 'Foreign worker accessibility', description: 'Quota constraints, COMPASS/Blue Card points, and visa speed' },
    ],
  },
  {
    key: 'businessEnvironment',
    name: 'Business Environment',
    iconName: 'Building2',
    description: 'Corporate governance ease, international trade access, foreign ownership, and infrastructure.',
    subFactors: [
      { id: 'b_reg', name: 'Company registration', description: 'Turnaround speed (1 day to 3 weeks) and digital submission portal' },
      { id: 'b_owner', name: 'Foreign ownership', description: 'Allowance of 100% foreign equity without mandatory local partners' },
      { id: 'b_ease', name: 'Ease of doing business', description: 'Predictability of administrative procedures and institutional trust' },
      { id: 'b_bank', name: 'Banking', description: 'Corporate bank account onboarding ease and fintech alternatives' },
      { id: 'b_infra', name: 'Infrastructure', description: 'High-speed fiber connectivity, airport hubs, and logistics supply chain' },
    ],
  },
  {
    key: 'regulatory',
    name: 'Regulatory',
    iconName: 'Scale',
    description: 'Statutory compliance, employment contracts, mandatory data privacy, and sectoral licensing.',
    subFactors: [
      { id: 'r_lic', name: 'Licensing', description: 'Specialized approvals required (MAS, FTA, BaFin, ACRA, etc.)' },
      { id: 'r_comp', name: 'Compliance complexity', description: 'Annual audits, secretarial filings, and substance rules' },
      { id: 'r_emp', name: 'Employment regulations', description: 'Termination notice, mandatory employee funds (CPF/social security)' },
      { id: 'r_data', name: 'Data protection', description: 'Statutory data residency, cross-border transfers (PDPA/GDPR)' },
    ],
  },
  {
    key: 'risk',
    name: 'Risk',
    iconName: 'ShieldAlert',
    description: 'Downside exposure across regulatory shifts, legal enforcement, inflation, and currency depreciation.',
    subFactors: [
      { id: 'rk_mkt', name: 'Market risk', description: 'Demand fluctuations, recessions, and localized consumer shifts' },
      { id: 'rk_reg', name: 'Regulatory risk', description: 'Policy unpredictability, sudden tariff increases, or rule changes' },
      { id: 'rk_lab', name: 'Labour risk', description: 'High turnover, salary inflation, and unionization disputes' },
      { id: 'rk_cur', name: 'Currency risk', description: 'Devaluation relative to revenue receipts and capital transfer risks' },
      { id: 'rk_ops', name: 'Operational risk', description: 'Timezone coordination, legal enforcement speed, and supply disruptions' },
    ],
  },
];

export const DEFAULT_FACTOR_WEIGHTS: FactorWeights = {
  market: 20,
  cost: 25,
  labour: 25,
  businessEnvironment: 10,
  regulatory: 15,
  risk: 5,
};

export class FactorService {
  public static getCategories(): FactorCategoryDefinition[] {
    return FACTOR_CATEGORIES;
  }

  public static validateWeights(weights: FactorWeights): { isValid: boolean; sum: number; message: string } {
    const sum =
      (weights.market || 0) +
      (weights.cost || 0) +
      (weights.labour || 0) +
      (weights.businessEnvironment || 0) +
      (weights.regulatory || 0) +
      (weights.risk || 0);

    const isValid = sum === 100;
    let message = 'Weights perfectly balance to 100%.';

    if (sum < 100) {
      message = `Weights sum to ${sum}%. Add ${100 - sum}% more across categories to total 100%.`;
    } else if (sum > 100) {
      message = `Weights sum to ${sum}%. Reduce ${sum - 100}% to balance to 100%.`;
    }

    return { isValid, sum, message };
  }

  public static normalizeWeights(weights: FactorWeights): FactorWeights {
    const sum =
      (weights.market || 0) +
      (weights.cost || 0) +
      (weights.labour || 0) +
      (weights.businessEnvironment || 0) +
      (weights.regulatory || 0) +
      (weights.risk || 0);

    if (sum === 0) return { ...DEFAULT_FACTOR_WEIGHTS };

    return {
      market: Math.round(((weights.market || 0) / sum) * 100),
      cost: Math.round(((weights.cost || 0) / sum) * 100),
      labour: Math.round(((weights.labour || 0) / sum) * 100),
      businessEnvironment: Math.round(((weights.businessEnvironment || 0) / sum) * 100),
      regulatory: Math.round(((weights.regulatory || 0) / sum) * 100),
      risk: Math.max(0, 100 - (
        Math.round(((weights.market || 0) / sum) * 100) +
        Math.round(((weights.cost || 0) / sum) * 100) +
        Math.round(((weights.labour || 0) / sum) * 100) +
        Math.round(((weights.businessEnvironment || 0) / sum) * 100) +
        Math.round(((weights.regulatory || 0) / sum) * 100)
      )),
    };
  }

  public static priorityToWeight(p: FactorPriority): number {
    switch (p) {
      case 'High':
        return 30;
      case 'Medium':
        return 15;
      case 'Low':
        return 5;
      default:
        return 15;
    }
  }
}
