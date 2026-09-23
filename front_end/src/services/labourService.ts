import type { RoleCategory, RoleRequirement } from '../types';

export interface RoleBenchmarkData {
  role: RoleCategory;
  monthlySalaryUSD: {
    entry: { min: number; max: number };
    mid: { min: number; max: number };
    senior: { min: number; max: number };
  };
  talentAvailability: 'High' | 'Medium' | 'Low';
  availabilityStatement: string;
  hiringDifficulty: 'Low' | 'Medium' | 'High';
  recommendedPassType: string;
  foreignPassFeasibility: 'High' | 'Medium' | 'Challenging' | 'Low';
  visaNotes: string;
}

export interface WorkforceFeasibilitySummary {
  totalEmployees: number;
  totalLocalDesired: number;
  totalForeignDesired: number;
  monthlyBaseSalaryUSD: number;
  monthlyEmployerContributionsUSD: number;
  totalMonthlyLabourUSD: number;
  roleAssessments: {
    roleId: string;
    role: RoleCategory;
    count: number;
    experience: string;
    preference: string;
    availabilityHeadline: string;
    foreignFeasibilityHeadline: string;
    monthlyAvgSalaryUSD: number;
    subtotalMonthlyUSD: number;
    passRequirement: string;
  }[];
  overallLabourFeasibility: 'High' | 'Medium' | 'Challenging';
  summaryText: string;
}

const COUNTRY_ROLE_BENCHMARKS: Record<string, Record<RoleCategory, RoleBenchmarkData>> = {
  SG: {
    'Software / IT': {
      role: 'Software / IT',
      monthlySalaryUSD: { entry: { min: 3800, max: 5200 }, mid: { min: 5500, max: 8500 }, senior: { min: 9000, max: 14000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Software engineers: High availability across deep tech & cloud talent pools.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Employment Pass (EP) / Tech.Pass',
      foreignPassFeasibility: 'High',
      visaNotes: 'EP threshold S$5,000/mo (S$5,500 in finance); COMPASS points framework applies.',
    },
    'Customer Support': {
      role: 'Customer Support',
      monthlySalaryUSD: { entry: { min: 2200, max: 3000 }, mid: { min: 3200, max: 4200 }, senior: { min: 4500, max: 6000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Customer support talent: High availability with multilingual fluency (English/Mandarin).',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Local hire preferred or S Pass',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Services sector S Pass sub-quota capped at 10% of total company workforce; foreign levy S$330-S$650/mo.',
    },
    'Sales': {
      role: 'Sales',
      monthlySalaryUSD: { entry: { min: 3000, max: 4200 }, mid: { min: 5000, max: 7500 }, senior: { min: 8000, max: 13000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Sales & BD professionals: High availability with ASEAN market reach.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Employment Pass (EP)',
      foreignPassFeasibility: 'High',
      visaNotes: 'Regional enterprise sales professionals readily meet S$5,000 EP qualification salary.',
    },
    'Marketing': {
      role: 'Marketing',
      monthlySalaryUSD: { entry: { min: 2800, max: 3800 }, mid: { min: 4500, max: 6500 }, senior: { min: 7000, max: 10500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Marketing specialists: High availability in digital growth & performance marketing.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Local hire or EP',
      foreignPassFeasibility: 'High',
      visaNotes: 'Strong domestic pool of digital agency and brand marketing talent.',
    },
    'Finance / Accounting': {
      role: 'Finance / Accounting',
      monthlySalaryUSD: { entry: { min: 3200, max: 4200 }, mid: { min: 5200, max: 7500 }, senior: { min: 8500, max: 13500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Finance & accounting talent: High availability with ISCA / ACCA certifications.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Local hire or EP',
      foreignPassFeasibility: 'High',
      visaNotes: 'Singapore has Asia’s densest pool of qualified corporate accountants and treasury specialists.',
    },
    'Human Resources': {
      role: 'Human Resources',
      monthlySalaryUSD: { entry: { min: 2600, max: 3500 }, mid: { min: 4200, max: 6000 }, senior: { min: 7000, max: 10000 } },
      talentAvailability: 'High',
      availabilityStatement: 'HR professionals: High availability with familiarity in MOM Employment Act.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Local hire preferred',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Local HR hires ensure strict compliance with Tripartite Guidelines on Fair Employment (TAFEP).',
    },
    'Management': {
      role: 'Management',
      monthlySalaryUSD: { entry: { min: 5500, max: 7500 }, mid: { min: 8000, max: 12000 }, senior: { min: 13000, max: 22000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Executive management: High availability with global MNC leadership backgrounds.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Employment Pass (EP) / ONE Pass',
      foreignPassFeasibility: 'High',
      visaNotes: 'High-earning C-suite can utilize Overseas Networks & Expertise (ONE) Pass for 5-year flexibility.',
    },
    'Skilled Technical Workers': {
      role: 'Skilled Technical Workers',
      monthlySalaryUSD: { entry: { min: 3000, max: 4200 }, mid: { min: 4800, max: 7000 }, senior: { min: 7500, max: 11000 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Skilled technical workers: Medium availability with strong polytechnic graduate pipeline.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'S Pass or EP',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'S Pass minimum salary S$3,150; subject to dependency ratio ceilings.',
    },
    'Physical / Manual Labour': {
      role: 'Physical / Manual Labour',
      monthlySalaryUSD: { entry: { min: 1400, max: 2000 }, mid: { min: 2100, max: 2800 }, senior: { min: 2900, max: 3800 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Physical labour: Medium availability, primarily reliant on Work Permit source countries.',
      hiringDifficulty: 'High',
      recommendedPassType: 'Work Permit (WP)',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Work permit quotas, security bonds (S$5,000), and monthly foreign worker levies (S$350–S$750) apply.',
    },
    'Warehouse / Logistics': {
      role: 'Warehouse / Logistics',
      monthlySalaryUSD: { entry: { min: 2000, max: 2800 }, mid: { min: 3000, max: 4000 }, senior: { min: 4500, max: 6500 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Warehouse & logistics staff: Medium availability around Jurong and Changi hub clusters.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local or Work Permit / S Pass',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Competitive demand from PSA port and Changi air cargo operators.',
    },
    'Manufacturing Workers': {
      role: 'Manufacturing Workers',
      monthlySalaryUSD: { entry: { min: 1800, max: 2600 }, mid: { min: 2800, max: 3800 }, senior: { min: 4000, max: 6000 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Manufacturing workers: Medium availability; advanced precision engineering focus.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Work Permit (WP) / S Pass',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Manufacturing sector has higher dependency ratio ceilings (up to 60%) compared to services.',
    },
    'Delivery / Operations': {
      role: 'Delivery / Operations',
      monthlySalaryUSD: { entry: { min: 2000, max: 2800 }, mid: { min: 2900, max: 3800 }, senior: { min: 4000, max: 5500 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Delivery & fleet operations: Medium availability; high gig-economy competition.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local hires required for gig/delivery vehicles',
      foreignPassFeasibility: 'Low',
      visaNotes: 'Commercial vehicle licenses (Class 3/4) strictly favor resident workforce.',
    },
    'Healthcare / Specialized Professionals': {
      role: 'Healthcare / Specialized Professionals',
      monthlySalaryUSD: { entry: { min: 3500, max: 4800 }, mid: { min: 5500, max: 8000 }, senior: { min: 9000, max: 15000 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Healthcare specialists: Medium availability; high regulatory licensing standards.',
      hiringDifficulty: 'High',
      recommendedPassType: 'Employment Pass with SMC / SNB statutory registration',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Practicing licenses require approval from Singapore Medical Council or relevant board.',
    },
    'Other': {
      role: 'Other',
      monthlySalaryUSD: { entry: { min: 2500, max: 3500 }, mid: { min: 4000, max: 6000 }, senior: { min: 6500, max: 10000 } },
      talentAvailability: 'High',
      availabilityStatement: 'General business roles: High availability across diverse cosmopolitan talent.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Standard EP or local hire',
      foreignPassFeasibility: 'High',
      visaNotes: 'Standard MOM compliance rules apply.',
    },
    // Backwards compatibility aliases
    'Finance': { role: 'Finance / Accounting', monthlySalaryUSD: { entry: { min: 3200, max: 4200 }, mid: { min: 5200, max: 7500 }, senior: { min: 8500, max: 13500 } }, talentAvailability: 'High', availabilityStatement: 'Finance: High availability.', hiringDifficulty: 'Low', recommendedPassType: 'EP', foreignPassFeasibility: 'High', visaNotes: 'Standard.' },
    'HR': { role: 'Human Resources', monthlySalaryUSD: { entry: { min: 2600, max: 3500 }, mid: { min: 4200, max: 6000 }, senior: { min: 7000, max: 10000 } }, talentAvailability: 'High', availabilityStatement: 'HR: High availability.', hiringDifficulty: 'Low', recommendedPassType: 'Local', foreignPassFeasibility: 'Medium', visaNotes: 'Standard.' },
    'Warehouse Workers': { role: 'Warehouse / Logistics', monthlySalaryUSD: { entry: { min: 2000, max: 2800 }, mid: { min: 3000, max: 4000 }, senior: { min: 4500, max: 6500 } }, talentAvailability: 'Medium', availabilityStatement: 'Logistics: Medium.', hiringDifficulty: 'Medium', recommendedPassType: 'WP', foreignPassFeasibility: 'Medium', visaNotes: 'Standard.' },
    'Delivery Workers': { role: 'Delivery / Operations', monthlySalaryUSD: { entry: { min: 2000, max: 2800 }, mid: { min: 2900, max: 3800 }, senior: { min: 4000, max: 5500 } }, talentAvailability: 'Medium', availabilityStatement: 'Delivery: Medium.', hiringDifficulty: 'Medium', recommendedPassType: 'Local', foreignPassFeasibility: 'Low', visaNotes: 'Standard.' },
    'Healthcare Workers': { role: 'Healthcare / Specialized Professionals', monthlySalaryUSD: { entry: { min: 3500, max: 4800 }, mid: { min: 5500, max: 8000 }, senior: { min: 9000, max: 15000 } }, talentAvailability: 'Medium', availabilityStatement: 'Healthcare: Medium.', hiringDifficulty: 'High', recommendedPassType: 'EP', foreignPassFeasibility: 'Medium', visaNotes: 'Standard.' },
  },
  AE: {
    'Software / IT': {
      role: 'Software / IT',
      monthlySalaryUSD: { entry: { min: 3200, max: 4500 }, mid: { min: 5000, max: 7800 }, senior: { min: 8200, max: 13000 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Software engineers: Medium availability locally; fast-growing tech expat influx into Dubai.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Freezone Tech Visa / Green Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Fast 5-day visa issuance in DMCC/DIFC/Dtec; 0% personal income tax makes talent relocation attractive.',
    },
    'Customer Support': {
      role: 'Customer Support',
      monthlySalaryUSD: { entry: { min: 1600, max: 2400 }, mid: { min: 2500, max: 3500 }, senior: { min: 3800, max: 5200 } },
      talentAvailability: 'High',
      availabilityStatement: 'Customer support talent: High availability with native Arabic, English, and Hindi speakers.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Freezone Employment Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Virtually 100% expatriate workforce permitted in Free Zones with zero domestic quota restrictions.',
    },
    'Sales': {
      role: 'Sales',
      monthlySalaryUSD: { entry: { min: 2600, max: 3800 }, mid: { min: 4500, max: 7000 }, senior: { min: 7500, max: 12000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Sales professionals: High availability across GCC B2B enterprise distribution.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Freezone / Mainland Employment Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Abundant talent with established client networks across UAE and Saudi Arabia.',
    },
    'Marketing': {
      role: 'Marketing',
      monthlySalaryUSD: { entry: { min: 2400, max: 3500 }, mid: { min: 4000, max: 6000 }, senior: { min: 6500, max: 10000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Marketing specialists: High availability across Dubai media city and agency networks.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Freezone Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Vibrant creative ecosystem with streamlined visa quotas.',
    },
    'Finance / Accounting': {
      role: 'Finance / Accounting',
      monthlySalaryUSD: { entry: { min: 2500, max: 3500 }, mid: { min: 4200, max: 6500 }, senior: { min: 7200, max: 11500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Finance & accounting: High availability with corporate tax and VAT expertise.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Employment Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Growing demand following UAE Corporate Tax implementation; abundant qualified professionals.',
    },
    'Human Resources': {
      role: 'Human Resources',
      monthlySalaryUSD: { entry: { min: 2200, max: 3200 }, mid: { min: 3800, max: 5500 }, senior: { min: 6000, max: 9000 } },
      talentAvailability: 'High',
      availabilityStatement: 'HR specialists: High availability with MOHRE and Freezone authority onboarding experience.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Employment Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Emiratisation (Tawteen) rules apply primarily to mainland firms with >50 employees, not Freezones.',
    },
    'Management': {
      role: 'Management',
      monthlySalaryUSD: { entry: { min: 4500, max: 6500 }, mid: { min: 7500, max: 11000 }, senior: { min: 12000, max: 20000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Executive management: High availability; Dubai attracts global regional directors.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Golden Visa (10-year) / General Manager Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Executives earning >AED 30,000/mo qualify for 10-year renewable Golden Visa.',
    },
    'Skilled Technical Workers': {
      role: 'Skilled Technical Workers',
      monthlySalaryUSD: { entry: { min: 2200, max: 3200 }, mid: { min: 3500, max: 5200 }, senior: { min: 5800, max: 8800 } },
      talentAvailability: 'High',
      availabilityStatement: 'Skilled technical workers: High availability through regional engineering recruitment.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Skilled Employment Visa (Skill Level 1–3)',
      foreignPassFeasibility: 'High',
      visaNotes: 'Attested university or diploma degree required for skilled MOHRE labor categorization.',
    },
    'Physical / Manual Labour': {
      role: 'Physical / Manual Labour',
      monthlySalaryUSD: { entry: { min: 500, max: 900 }, mid: { min: 950, max: 1400 }, senior: { min: 1500, max: 2200 } },
      talentAvailability: 'High',
      availabilityStatement: 'Physical labour: High availability; world-class migration channels from South Asia.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'MOHRE Work Permit (Skill Level 4–5)',
      foreignPassFeasibility: 'High',
      visaNotes: 'Mandatory employer-provided medical insurance and Wage Protection System (WPS) compliance.',
    },
    'Warehouse / Logistics': {
      role: 'Warehouse / Logistics',
      monthlySalaryUSD: { entry: { min: 1100, max: 1700 }, mid: { min: 1800, max: 2600 }, senior: { min: 3000, max: 4800 } },
      talentAvailability: 'High',
      availabilityStatement: 'Warehouse & logistics talent: High availability around JAFZA port and Dubai South.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Logistics Freezone Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Jebel Ali Free Zone offers turnkey warehouse labor licensing and shared accommodation camps.',
    },
    'Manufacturing Workers': {
      role: 'Manufacturing Workers',
      monthlySalaryUSD: { entry: { min: 700, max: 1200 }, mid: { min: 1300, max: 2000 }, senior: { min: 2200, max: 3500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Manufacturing workers: High availability in industrial clusters (KEZAD, DIP).',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Industrial Work Permit',
      foreignPassFeasibility: 'High',
      visaNotes: 'Low per-worker cost structure with robust safety compliance.',
    },
    'Delivery / Operations': {
      role: 'Delivery / Operations',
      monthlySalaryUSD: { entry: { min: 900, max: 1400 }, mid: { min: 1500, max: 2200 }, senior: { min: 2500, max: 3800 } },
      talentAvailability: 'High',
      availabilityStatement: 'Delivery & riders: High availability with established bike fleet operator partnerships.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Rider Visa via 3PL fleet contractors',
      foreignPassFeasibility: 'High',
      visaNotes: 'RTA delivery permit required; outsourcing to third-party logistics common.',
    },
    'Healthcare / Specialized Professionals': {
      role: 'Healthcare / Specialized Professionals',
      monthlySalaryUSD: { entry: { min: 3000, max: 4500 }, mid: { min: 5000, max: 8000 }, senior: { min: 8500, max: 15000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Healthcare professionals: High availability via DHA / DOH licensing pipelines.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'DHA Licensed Medical Professional Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Dubai Healthcare City offers simplified healthcare registration and 10-year Golden Visas.',
    },
    'Other': {
      role: 'Other',
      monthlySalaryUSD: { entry: { min: 2000, max: 3000 }, mid: { min: 3500, max: 5500 }, senior: { min: 6000, max: 9500 } },
      talentAvailability: 'High',
      availabilityStatement: 'General business roles: High availability with global expatriate workforce.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Standard Freezone Visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Straightforward residency process.',
    },
    // Backwards compatibility aliases
    'Finance': { role: 'Finance / Accounting', monthlySalaryUSD: { entry: { min: 2500, max: 3500 }, mid: { min: 4200, max: 6500 }, senior: { min: 7200, max: 11500 } }, talentAvailability: 'High', availabilityStatement: 'Finance: High availability.', hiringDifficulty: 'Low', recommendedPassType: 'Visa', foreignPassFeasibility: 'High', visaNotes: 'Standard.' },
    'HR': { role: 'Human Resources', monthlySalaryUSD: { entry: { min: 2200, max: 3200 }, mid: { min: 3800, max: 5500 }, senior: { min: 6000, max: 9000 } }, talentAvailability: 'High', availabilityStatement: 'HR: High availability.', hiringDifficulty: 'Low', recommendedPassType: 'Visa', foreignPassFeasibility: 'High', visaNotes: 'Standard.' },
    'Warehouse Workers': { role: 'Warehouse / Logistics', monthlySalaryUSD: { entry: { min: 1100, max: 1700 }, mid: { min: 1800, max: 2600 }, senior: { min: 3000, max: 4800 } }, talentAvailability: 'High', availabilityStatement: 'Warehouse: High.', hiringDifficulty: 'Low', recommendedPassType: 'Visa', foreignPassFeasibility: 'High', visaNotes: 'Standard.' },
    'Delivery Workers': { role: 'Delivery / Operations', monthlySalaryUSD: { entry: { min: 900, max: 1400 }, mid: { min: 1500, max: 2200 }, senior: { min: 2500, max: 3800 } }, talentAvailability: 'High', availabilityStatement: 'Delivery: High.', hiringDifficulty: 'Low', recommendedPassType: 'Visa', foreignPassFeasibility: 'High', visaNotes: 'Standard.' },
    'Healthcare Workers': { role: 'Healthcare / Specialized Professionals', monthlySalaryUSD: { entry: { min: 3000, max: 4500 }, mid: { min: 5000, max: 8000 }, senior: { min: 8500, max: 15000 } }, talentAvailability: 'High', availabilityStatement: 'Healthcare: High.', hiringDifficulty: 'Medium', recommendedPassType: 'Visa', foreignPassFeasibility: 'High', visaNotes: 'Standard.' },
  },
  DE: {
    'Software / IT': {
      role: 'Software / IT',
      monthlySalaryUSD: { entry: { min: 4200, max: 5500 }, mid: { min: 6000, max: 8800 }, senior: { min: 9200, max: 13500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Software engineers: High availability across Berlin & Munich tech ecosystems.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'EU Blue Card',
      foreignPassFeasibility: 'High',
      visaNotes: 'Fast-track EU Blue Card threshold: €41,041/yr for shortage occupations like IT/engineering.',
    },
    'Customer Support': {
      role: 'Customer Support',
      monthlySalaryUSD: { entry: { min: 2600, max: 3400 }, mid: { min: 3600, max: 4600 }, senior: { min: 4800, max: 6200 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Customer support: Medium availability; German B2/C1 fluency strictly required locally.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local hire or EU citizen relocation',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'EU freedom of movement allows hiring across Poland, Czechia, and Southern Europe without visas.',
    },
    'Sales': {
      role: 'Sales',
      monthlySalaryUSD: { entry: { min: 3500, max: 4800 }, mid: { min: 5500, max: 8000 }, senior: { min: 8500, max: 13000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Sales professionals: High availability across DACH regional commercial corridors.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local or EU Blue Card',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'DACH enterprise sales candidates require fluent native German for Mittelstand engagement.',
    },
    'Marketing': {
      role: 'Marketing',
      monthlySalaryUSD: { entry: { min: 3000, max: 4200 }, mid: { min: 4800, max: 6800 }, senior: { min: 7200, max: 10500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Marketing professionals: High availability in Berlin startup and corporate marketing sectors.',
      hiringDifficulty: 'Low',
      recommendedPassType: 'Local or EU national',
      foreignPassFeasibility: 'High',
      visaNotes: 'Broad creative agency talent in Berlin, Cologne, and Hamburg.',
    },
    'Finance / Accounting': {
      role: 'Finance / Accounting',
      monthlySalaryUSD: { entry: { min: 3500, max: 4600 }, mid: { min: 5200, max: 7500 }, senior: { min: 8000, max: 12500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Finance & accounting: High availability with HGB and German tax accounting expertise.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local Steuerberater / accountant',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'HGB / DATEV software proficiency essential for local accounting operations.',
    },
    'Human Resources': {
      role: 'Human Resources',
      monthlySalaryUSD: { entry: { min: 3000, max: 4000 }, mid: { min: 4500, max: 6200 }, senior: { min: 6800, max: 9800 } },
      talentAvailability: 'High',
      availabilityStatement: 'HR specialists: High availability with expertise in German works councils (Betriebsrat).',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local HR manager',
      foreignPassFeasibility: 'Low',
      visaNotes: 'Deep familiarity with German Labour Code and dismissal protection (KSchG) is critical.',
    },
    'Management': {
      role: 'Management',
      monthlySalaryUSD: { entry: { min: 6000, max: 8000 }, mid: { min: 9000, max: 13000 }, senior: { min: 14000, max: 22000 } },
      talentAvailability: 'High',
      availabilityStatement: 'Executive management: High availability with pan-European scaling experience.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Managing Director (Geschäftsführer) visa',
      foreignPassFeasibility: 'High',
      visaNotes: 'Foreign managing directors of a GmbH can obtain self-employment / residence permits.',
    },
    'Skilled Technical Workers': {
      role: 'Skilled Technical Workers',
      monthlySalaryUSD: { entry: { min: 3400, max: 4500 }, mid: { min: 5000, max: 7000 }, senior: { min: 7500, max: 10500 } },
      talentAvailability: 'High',
      availabilityStatement: 'Skilled technical workers: High availability through dual-education vocational system (Duale Ausbildung).',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Skilled Immigration Act (Fachkräfteeinwanderungsgesetz)',
      foreignPassFeasibility: 'High',
      visaNotes: 'New Opportunity Card (Chancenkarte) points system allows direct jobseeker migration.',
    },
    'Physical / Manual Labour': {
      role: 'Physical / Manual Labour',
      monthlySalaryUSD: { entry: { min: 2200, max: 2800 }, mid: { min: 2900, max: 3600 }, senior: { min: 3800, max: 4800 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Physical labour: Medium availability; statutory minimum wage is €12.82/hour.',
      hiringDifficulty: 'High',
      recommendedPassType: 'Local or EU East freedom of movement',
      foreignPassFeasibility: 'Low',
      visaNotes: 'Strict non-EU work permit restrictions for unskilled roles; reliant on EU single market.',
    },
    'Warehouse / Logistics': {
      role: 'Warehouse / Logistics',
      monthlySalaryUSD: { entry: { min: 2400, max: 3200 }, mid: { min: 3400, max: 4400 }, senior: { min: 4600, max: 6200 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Warehouse & logistics: Medium availability around logistics crossroads (Frankfurt, Leipzig, Duisburg).',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local or EU hire',
      foreignPassFeasibility: 'Low',
      visaNotes: 'High employer social contributions (~20%) add to warehouse unit labor cost.',
    },
    'Manufacturing Workers': {
      role: 'Manufacturing Workers',
      monthlySalaryUSD: { entry: { min: 2600, max: 3500 }, mid: { min: 3800, max: 5000 }, senior: { min: 5200, max: 7200 } },
      talentAvailability: 'High',
      availabilityStatement: 'Manufacturing workers: High availability in automotive and machinery corridors.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local / Skilled Vocational Pass',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'IG Metall collective bargaining agreements may influence compensation baselines.',
    },
    'Delivery / Operations': {
      role: 'Delivery / Operations',
      monthlySalaryUSD: { entry: { min: 2300, max: 3000 }, mid: { min: 3100, max: 3900 }, senior: { min: 4000, max: 5200 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Delivery & logistics ops: Medium availability; high parcel and postal unionization.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Local / EU national',
      foreignPassFeasibility: 'Low',
      visaNotes: 'Standard statutory holiday (min 20-24 days) and sick leave requirements apply.',
    },
    'Healthcare / Specialized Professionals': {
      role: 'Healthcare / Specialized Professionals',
      monthlySalaryUSD: { entry: { min: 3800, max: 5000 }, mid: { min: 5500, max: 8000 }, senior: { min: 8500, max: 14000 } },
      talentAvailability: 'Medium',
      availabilityStatement: 'Healthcare specialists: Medium availability; acute nursing and medical doctor demand.',
      hiringDifficulty: 'High',
      recommendedPassType: 'Approbation / Fast-track healthcare worker visa',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'German B2/C1 medical language examination (Fachsprachenprüfung) mandatory.',
    },
    'Other': {
      role: 'Other',
      monthlySalaryUSD: { entry: { min: 2800, max: 3800 }, mid: { min: 4200, max: 6000 }, senior: { min: 6500, max: 9500 } },
      talentAvailability: 'High',
      availabilityStatement: 'General business roles: High availability with high language competency.',
      hiringDifficulty: 'Medium',
      recommendedPassType: 'Standard employment permit',
      foreignPassFeasibility: 'Medium',
      visaNotes: 'Subject to standard German residence act.',
    },
    // Backwards compatibility aliases
    'Finance': { role: 'Finance / Accounting', monthlySalaryUSD: { entry: { min: 3500, max: 4600 }, mid: { min: 5200, max: 7500 }, senior: { min: 8000, max: 12500 } }, talentAvailability: 'High', availabilityStatement: 'Finance: High availability.', hiringDifficulty: 'Medium', recommendedPassType: 'Pass', foreignPassFeasibility: 'Medium', visaNotes: 'Standard.' },
    'HR': { role: 'Human Resources', monthlySalaryUSD: { entry: { min: 3000, max: 4000 }, mid: { min: 4500, max: 6200 }, senior: { min: 6800, max: 9800 } }, talentAvailability: 'High', availabilityStatement: 'HR: High availability.', hiringDifficulty: 'Medium', recommendedPassType: 'Local', foreignPassFeasibility: 'Low', visaNotes: 'Standard.' },
    'Warehouse Workers': { role: 'Warehouse / Logistics', monthlySalaryUSD: { entry: { min: 2400, max: 3200 }, mid: { min: 3400, max: 4400 }, senior: { min: 4600, max: 6200 } }, talentAvailability: 'Medium', availabilityStatement: 'Warehouse: Medium.', hiringDifficulty: 'Medium', recommendedPassType: 'Local', foreignPassFeasibility: 'Low', visaNotes: 'Standard.' },
    'Delivery Workers': { role: 'Delivery / Operations', monthlySalaryUSD: { entry: { min: 2300, max: 3000 }, mid: { min: 3100, max: 3900 }, senior: { min: 4000, max: 5200 } }, talentAvailability: 'Medium', availabilityStatement: 'Delivery: Medium.', hiringDifficulty: 'Medium', recommendedPassType: 'Local', foreignPassFeasibility: 'Low', visaNotes: 'Standard.' },
    'Healthcare Workers': { role: 'Healthcare / Specialized Professionals', monthlySalaryUSD: { entry: { min: 3800, max: 5000 }, mid: { min: 5500, max: 8000 }, senior: { min: 8500, max: 14000 } }, talentAvailability: 'Medium', availabilityStatement: 'Healthcare: Medium.', hiringDifficulty: 'High', recommendedPassType: 'Pass', foreignPassFeasibility: 'Medium', visaNotes: 'Standard.' },
  },
};

export class LabourService {
  public static getRoleBenchmark(countryCode: string, role: RoleCategory): RoleBenchmarkData {
    const cData = COUNTRY_ROLE_BENCHMARKS[countryCode] || COUNTRY_ROLE_BENCHMARKS['SG'];
    return (
      cData[role] || {
        role,
        monthlySalaryUSD: { entry: { min: 2500, max: 3500 }, mid: { min: 4000, max: 6000 }, senior: { min: 6500, max: 10000 } },
        talentAvailability: 'High',
        availabilityStatement: `${role}: High availability across general candidate pools.`,
        hiringDifficulty: 'Medium',
        recommendedPassType: 'Standard Work Visa',
        foreignPassFeasibility: 'Medium',
        visaNotes: 'Standard immigration regulations apply.',
      }
    );
  }

  public static getEstimatedSalary(countryCode: string, role: RoleCategory, experience: string): number {
    const bm = this.getRoleBenchmark(countryCode, role);
    const exp = experience.toLowerCase();
    let tier = bm.monthlySalaryUSD.mid;
    if (exp.includes('entry')) tier = bm.monthlySalaryUSD.entry;
    else if (exp.includes('senior') || exp.includes('exec')) tier = bm.monthlySalaryUSD.senior;
    return Math.round((tier.min + tier.max) / 2);
  }

  public static assessWorkforceFeasibility(countryCode: string, requirements: RoleRequirement[]): WorkforceFeasibilitySummary {
    let totalEmployees = 0;
    let totalLocalDesired = 0;
    let totalForeignDesired = 0;
    let monthlyBaseSalaryUSD = 0;

    const roleAssessments = requirements.map((req) => {
      const bm = this.getRoleBenchmark(countryCode, req.role);
      const avgSalary = this.getEstimatedSalary(countryCode, req.role, req.experience);
      const subtotal = avgSalary * req.count;

      totalEmployees += req.count;
      if (req.preference === 'Local employee' || req.preference === 'Local worker') {
        totalLocalDesired += req.count;
      } else if (req.preference === 'Foreign employee' || req.preference === 'Foreign worker') {
        totalForeignDesired += req.count;
      } else {
        totalLocalDesired += Math.ceil(req.count / 2);
        totalForeignDesired += Math.floor(req.count / 2);
      }
      monthlyBaseSalaryUSD += subtotal;

      let foreignFeasibilityHeadline = `Foreign feasibility: ${bm.foreignPassFeasibility}`;
      if (req.preference === 'Foreign employee' && countryCode === 'SG' && bm.foreignPassFeasibility === 'Medium') {
        foreignFeasibilityHeadline = 'Foreign worker feasibility: Medium (S-Pass Quota applies)';
      }

      return {
        roleId: req.id,
        role: req.role,
        count: req.count,
        experience: req.experience,
        preference: req.preference,
        availabilityHeadline: bm.availabilityStatement,
        foreignFeasibilityHeadline,
        monthlyAvgSalaryUSD: avgSalary,
        subtotalMonthlyUSD: subtotal,
        passRequirement: bm.recommendedPassType,
      };
    });

    // Employer statutory contributions
    // SG: ~17% CPF capped or ~10% blended
    // AE: ~5.75% end-of-service / gratuity + insurance
    // DE: ~20% social security (health, pension, unemployment)
    let contribRate = 0.12;
    if (countryCode === 'SG') contribRate = 0.14;
    else if (countryCode === 'AE') contribRate = 0.08;
    else if (countryCode === 'DE') contribRate = 0.20;

    const monthlyEmployerContributionsUSD = Math.round(monthlyBaseSalaryUSD * contribRate);
    const totalMonthlyLabourUSD = monthlyBaseSalaryUSD + monthlyEmployerContributionsUSD;

    let overallLabourFeasibility: 'High' | 'Medium' | 'Challenging' = 'High';
    if (countryCode === 'SG' && totalForeignDesired > 4) overallLabourFeasibility = 'Medium';
    if (countryCode === 'DE' && totalEmployees > 10) overallLabourFeasibility = 'Medium';

    const summaryText = `${totalEmployees} total staff planned across ${requirements.length} roles. Monthly payroll base estimated at $${monthlyBaseSalaryUSD.toLocaleString()} USD with ~$${monthlyEmployerContributionsUSD.toLocaleString()} USD in mandatory statutory benefits.`;

    return {
      totalEmployees,
      totalLocalDesired,
      totalForeignDesired,
      monthlyBaseSalaryUSD,
      monthlyEmployerContributionsUSD,
      totalMonthlyLabourUSD,
      roleAssessments,
      overallLabourFeasibility,
      summaryText,
    };
  }
}
