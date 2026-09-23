import type { CountryMasterData, CurrencyRate } from '../types';

export const SUPPORTED_CURRENCIES: Record<string, CurrencyRate> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 83.5, rateFromUSD: 0.011976, lastUpdated: '2026-08-18 (Live API Ready)', source: 'RBI / FX Reference' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0, rateFromUSD: 1.0, lastUpdated: '2026-08-18 (Base)', source: 'Federal Reserve FX' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToUSD: 1.34, rateFromUSD: 0.746268, lastUpdated: '2026-08-18 (MAS FX API)', source: 'Monetary Authority of Singapore' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateToUSD: 3.67, rateFromUSD: 0.272479, lastUpdated: '2026-08-18 (CBUAE FX)', source: 'Central Bank of the UAE' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92, rateFromUSD: 1.08695, lastUpdated: '2026-08-18 (ECB Reference)', source: 'European Central Bank' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79, rateFromUSD: 1.26582, lastUpdated: '2026-08-18 (BoE FX)', source: 'Bank of England' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.51, rateFromUSD: 0.66225, lastUpdated: '2026-08-18 (RBA FX)', source: 'Reserve Bank of Australia' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToUSD: 1.36, rateFromUSD: 0.73529, lastUpdated: '2026-08-18 (BoC FX)', source: 'Bank of Canada' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 155.2, rateFromUSD: 0.006443, lastUpdated: '2026-08-18 (BoJ FX)', source: 'Bank of Japan' },
};

export const COUNTRIES_DATA: Record<string, CountryMasterData> = {
  SG: {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    region: 'Southeast Asia',
    currency: 'SGD',
    corporateTaxRate: 17.0,
    vatGstRate: 9.0,
    businessSetupComplexity: 'Low',
    talentAvailability: 'High',
    labourCostLevel: 'High',
    regulatoryComplexity: 'Medium',
    marketPotential: 'High',
    foreignOwnership: '100% Foreign Ownership Permitted',
    dataConfidenceScore: 94,
    overviewText:
      'Singapore is Asia’s premier global tech and business hub, offering 100% foreign ownership, intellectual property protection, a 17% corporate tax rate with partial exemptions, and seamless access to ASEAN markets.',

    businessStructures: [
      {
        name: 'Private Limited Company (Pte. Ltd.)',
        legalStatus: 'Separate legal entity',
        liability: 'Limited to paid-up share capital',
        foreignOwnership: '100% foreign-owned permitted',
        setupComplexity: 'Low',
        setupTimeWeeks: 1,
        officialRegFeeUSD: 235, // S$315 ACRA fee
        estimatedLegalAgencyFeeUSD: 850,
        basicRequirements: ['At least 1 Singapore Resident Director', 'At least 1 Shareholder', 'Qualified Company Secretary within 6 months', 'S$1 minimum initial capital'],
        officialSource: 'Accounting and Corporate Regulatory Authority (ACRA)',
      },
      {
        name: 'Branch Office',
        legalStatus: 'Extension of parent company',
        liability: 'Parent company assumes full liability',
        foreignOwnership: '100% foreign parent owned',
        setupComplexity: 'Medium',
        setupTimeWeeks: 2,
        officialRegFeeUSD: 235,
        estimatedLegalAgencyFeeUSD: 1200,
        basicRequirements: ['2 Local Agents resident in Singapore', 'Audited accounts of parent company submitted annually'],
        officialSource: 'ACRA Singapore',
      },
      {
        name: 'Representative Office (RO)',
        legalStatus: 'Non-operating entity (Market research only)',
        liability: 'Parent company liability',
        foreignOwnership: '100% foreign parent owned',
        setupComplexity: 'Low',
        setupTimeWeeks: 1,
        officialRegFeeUSD: 150,
        estimatedLegalAgencyFeeUSD: 500,
        basicRequirements: ['Cannot engage in commercial revenue activities', 'Maximum duration 3 years', 'Parent entity must be >3 years old'],
        officialSource: 'Enterprise Singapore (ESG)',
      },
    ],

    licenses: [
      { name: 'General Wholesale Trade Licence', regulator: 'ACRA', status: 'Likely required', description: 'Standard baseline registration for B2B tech and service invoices.' },
      { name: 'Payment Services Licence (MAS)', regulator: 'Monetary Authority of Singapore', status: 'Check required', description: 'Only required if processing local payments, crypto, or e-wallet custody.' },
      { name: 'Telecommunications Services Licence (IMDA)', regulator: 'Infocomm Media Development Authority', status: 'Possibly not applicable', description: 'Required for VoIP/telecom service providers.' },
    ],

    labourMetrics: [
      {
        roleCategory: 'Customer Support',
        talentAvailability: 'High',
        estimatedSalaryRangeUSD: { min: 2400, max: 4000 },
        hiringDifficulty: 'Low',
        foreignWorkerPassType: 'S Pass / Work Permit',
        foreignWorkerMinSalaryUSD: 2350, // S$3,150
        quotaOrLevyDetails: 'S Pass quota capped at 10% of total workforce in services sector. Monthly levy S$450-S$650.',
      },
      {
        roleCategory: 'Software / IT',
        talentAvailability: 'High',
        estimatedSalaryRangeUSD: { min: 4500, max: 9000 },
        hiringDifficulty: 'Medium',
        foreignWorkerPassType: 'Employment Pass (EP) / Tech.Pass',
        foreignWorkerMinSalaryUSD: 3730, // S$5,000 EP threshold (S$5,500 for financial services)
        quotaOrLevyDetails: 'COMPASS points evaluation (minimum 40 points required). No monthly levy for EP holders.',
      },
      {
        roleCategory: 'Sales',
        talentAvailability: 'High',
        estimatedSalaryRangeUSD: { min: 3500, max: 7500 },
        hiringDifficulty: 'Medium',
        foreignWorkerPassType: 'Employment Pass / S Pass',
        foreignWorkerMinSalaryUSD: 3730,
        quotaOrLevyDetails: 'COMPASS points system applies for foreign sales executives on EP.',
      },
    ],

    tax: {
      corporateTaxRate: 17.0,
      headlineVatGstRate: 9.0,
      payrollTaxRateEst: 17.0, // Central Provident Fund (CPF) employer contribution up to 17% for local employees
      withholdingTaxDividend: 0.0, // 0% withholding tax on dividends distributed to overseas shareholders
      taxComplexity: 'Low',
      startupIncentives: ['Tax Exemption Scheme for New Startups (75% exemption on first S$100K normal chargeable income)', 'Pioneer Certificate Incentive (PCI)', 'Development and Expansion Incentive (DEI)'],
      taxImpactSummary: 'Singapore features zero dividend tax, zero capital gains tax, and tax treaties (DTAA) with 90+ countries including India.',
    },

    dataPrivacy: {
      lawName: 'Personal Data Protection Act 2012 (PDPA)',
      dpoRequirement: 'Mandatory designation of at least 1 Data Protection Officer (DPO).',
      crossBorderTransferRules: 'Transfers permissible if recipient country ensures comparable protection or standard contractual clauses are executed.',
      riskLevel: 'Medium',
      officialSource: 'Personal Data Protection Commission (PDPC) Singapore',
    },

    bankingEase: 'Easy',
    bankingRequirements: ['Certificate of Incorporation (ACRA)', 'Company Constitution (M&A)', 'Board Resolution authorizing account opening', 'Passport & Proof of Address for ultimate beneficial owners (UBO >25%)'],

    importExportReqs: {
      required: false,
      customsDetails: 'Singapore is virtually a free port. GST (9%) applies to imported goods for local consumption. Customs permit via TradeNet.',
      tradeDocName: 'Customs Account Registration & TradeNet Permit',
    },

    ipProtectionInfo: 'Ranked #1 in Asia for IP protection by World Economic Forum. IP Office of Singapore (IPOS) provides fast-track patent & trademark grants.',
    insuranceRecommendations: ['Work Injury Compensation Insurance (WICA) - Mandatory for manual and salary <S$2,600 employees', 'Public Liability Insurance', 'Cyber Security Liability Insurance'],

    incentives: [
      {
        id: 'inc-sg-1',
        programName: 'Startup SG Tech Grant',
        qualifyingCriteria: 'Early-stage tech startups incorporated in SG with >30% local shareholding.',
        potentialBenefit: 'Proof-of-Concept grant up to S$250,000 or Proof-of-Value grant up to S$500,000.',
        applicationRequirements: 'Proprietary technology project proposal and commercialization strategy.',
        officialSource: 'Enterprise Singapore (ESG)',
      },
      {
        id: 'inc-sg-2',
        programName: 'EDG Innovation & Capability Grant',
        qualifyingCriteria: 'SG registered business expanding regional capabilities.',
        potentialBenefit: 'Co-funding up to 50%-70% of qualified consultancy and tech deployment costs.',
        applicationRequirements: 'Project implementation plan and auditor breakdown.',
        officialSource: 'EnterpriseSG',
      },
    ],

    risks: [
      {
        id: 'rk-sg-1',
        category: 'Labour',
        level: 'MEDIUM',
        title: 'High Talent Costs & EP COMPASS Quotas',
        cause: 'Singapore talent commands high compensation; foreign S-Pass quotas (10% ceiling) restrict mass low-cost hiring.',
        mitigation: 'Hire key tech leads locally or on EP, while leveraging regional remote teams for baseline support.',
        verificationSteps: ['Check COMPASS calculator on MOM portal', 'Verify salary benchmarks against Ministry of Manpower salary table'],
      },
      {
        id: 'rk-sg-2',
        category: 'Financial',
        level: 'LOW',
        title: 'Office Rental Premium',
        cause: 'Grade A office space in CBD commands premium rents (S$10-14 / sq ft).',
        mitigation: 'Utilize flexible co-working spaces (WeWork, JustCo, CapitaLand Bridge+) for initial 12-24 months.',
        verificationSteps: ['Compare co-working hot desk vs dedicated office rates'],
      },
    ],

    officialSources: [
      { name: 'IRAS (Inland Revenue Authority of Singapore)', url: 'https://www.iras.gov.sg', type: 'Tax' },
      { name: 'ACRA (Accounting and Corporate Regulatory Authority)', url: 'https://www.acra.gov.sg', type: 'Registration' },
      { name: 'MOM (Ministry of Manpower Singapore)', url: 'https://www.mom.gov.sg', type: 'Labour & Visas' },
      { name: 'EDB (Singapore Economic Development Board)', url: 'https://www.edb.gov.sg', type: 'Incentives' },
      { name: 'PDPC (Personal Data Protection Commission)', url: 'https://www.pdpc.gov.sg', type: 'Data Privacy' },
    ],
  },

  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    currency: 'AED',
    corporateTaxRate: 9.0,
    vatGstRate: 5.0,
    businessSetupComplexity: 'Medium',
    talentAvailability: 'Medium',
    labourCostLevel: 'Medium',
    regulatoryComplexity: 'Medium',
    marketPotential: 'High',
    foreignOwnership: '100% Foreign Ownership in Freezones & Mainland (selected activities)',
    dataConfidenceScore: 91,
    overviewText:
      'The UAE (Dubai/Abu Dhabi) is the gateway to MENA, offering 0% personal income tax, 9% corporate tax (0% for qualifying free zone entities), 100% capital repatriation, and world-class digital infrastructure.',

    businessStructures: [
      {
        name: 'Freezone Limited Liability Company (FZ-LLC)',
        legalStatus: 'Separate legal entity inside Free Zone (e.g. IFZA, DMCC, DIFC)',
        liability: 'Limited to share capital',
        foreignOwnership: '100% foreign ownership guaranteed',
        setupComplexity: 'Low',
        setupTimeWeeks: 1,
        officialRegFeeUSD: 3200, // ~AED 11,500
        estimatedLegalAgencyFeeUSD: 1500,
        basicRequirements: ['1 Shareholder', '1 Director', 'Registered Free Zone Flexi-Desk address'],
        officialSource: 'DMCC / IFZA / DIFC Authority',
      },
      {
        name: 'Mainland LLC (DED Dubai)',
        legalStatus: 'Mainland entity permitted to trade directly anywhere in UAE market',
        liability: 'Limited liability',
        foreignOwnership: '100% foreign ownership for 1,000+ commercial activities',
        setupComplexity: 'Medium',
        setupTimeWeeks: 2,
        officialRegFeeUSD: 4500, // ~AED 16,500
        estimatedLegalAgencyFeeUSD: 2000,
        basicRequirements: ['Commercial license from DED', 'Physical office tenancy contract (Ejari)'],
        officialSource: 'Dubai Department of Economy & Tourism (DET)',
      },
    ],

    licenses: [
      { name: 'Commercial License / Software Trading', regulator: 'DED Dubai / DMCC', status: 'Likely required', description: 'Standard commercial trading license for software platforms.' },
      { name: 'VARA License (Virtual Assets)', regulator: 'Dubai Virtual Assets Regulatory Authority', status: 'Check required', description: 'Only required if handling crypto or digital asset custody.' },
    ],

    labourMetrics: [
      {
        roleCategory: 'Customer Support',
        talentAvailability: 'High',
        estimatedSalaryRangeUSD: { min: 1600, max: 3200 },
        hiringDifficulty: 'Low',
        foreignWorkerPassType: 'Employment Residence Visa',
        foreignWorkerMinSalaryUSD: 1000,
        quotaOrLevyDetails: 'Visa quota tied to office space size (e.g., flexi-desk grants 2-3 visas). MOHRE work permit fee ~AED 600-2,000.',
      },
      {
        roleCategory: 'Software / IT',
        talentAvailability: 'Medium',
        estimatedSalaryRangeUSD: { min: 3800, max: 7500 },
        hiringDifficulty: 'Medium',
        foreignWorkerPassType: 'Green Visa / Employment Visa / Golden Visa',
        foreignWorkerMinSalaryUSD: 4000, // AED 15,000 for Green Visa
        quotaOrLevyDetails: 'No local citizen hiring quota (Emiratisation) for Free Zone companies under 50 employees.',
      },
    ],

    tax: {
      corporateTaxRate: 9.0, // 0% on taxable income up to AED 375,000; 9% thereafter. 0% for qualifying Qualifying Free Zone Persons (QFZP).
      headlineVatGstRate: 5.0,
      payrollTaxRateEst: 0.0, // No social security payroll tax for expatriate employees (End of Service Gratuity applies)
      withholdingTaxDividend: 0.0,
      taxComplexity: 'Low',
      startupIncentives: ['Small Business Relief (SBR) - Tax exemption for revenue below AED 3M until 2026', '0% Personal Income Tax for founders and employees'],
      taxImpactSummary: '0% income tax on personal salaries and dividends. Corporate tax is capped at 9% for profits exceeding AED 375,000.',
    },

    dataPrivacy: {
      lawName: 'Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL)',
      dpoRequirement: 'Required for high-risk data processing or large scale sensitive data operations.',
      crossBorderTransferRules: 'Permitted to countries with adequate protection or via standard data transfer agreements.',
      riskLevel: 'Low',
      officialSource: 'UAE Data Office',
    },

    bankingEase: 'Moderate',
    bankingRequirements: ['Company License & MOA', 'Ejari office tenancy contract', '6-month bank statements of parent company/founder', 'Proof of funds & business background check'],

    importExportReqs: {
      required: false,
      customsDetails: '5% customs duty on goods imported into mainland UAE. Freezone-to-Freezone transfer 0%.',
      tradeDocName: 'Dubai Customs Code Registration',
    },

    ipProtectionInfo: 'Ministry of Economy regulates trademarks, patents, and copyrights in line with WIPO treaties.',
    insuranceRecommendations: ['Mandatory Employee Health Insurance (DHA In Dubai / DOH in Abu Dhabi)', 'Workmen Compensation'],

    incentives: [
      {
        id: 'inc-ae-1',
        programName: 'Hub71 Incentive Program (Abu Dhabi)',
        qualifyingCriteria: 'Tech startups establishing regional HQ in Abu Dhabi.',
        potentialBenefit: '100% subsidized housing, office space, and health insurance for up to 3 years.',
        applicationRequirements: 'Pitch deck, financial projections, and tech demo.',
        officialSource: 'Hub71 / Mubadala',
      },
    ],

    risks: [
      {
        id: 'rk-ae-1',
        category: 'Financial',
        level: 'MEDIUM',
        title: 'Corporate Banking Onboarding Timeline',
        cause: 'UAE traditional banks (ENBD, FAB) perform extensive compliance checks taking 4-8 weeks.',
        mitigation: 'Apply simultaneously to digital business banks (Wio Bank, Mashreq NeoBiz) for rapid 48-hr account opening.',
        verificationSteps: ['Prepare certified UBO documents and 6 months personal/company bank statements upfront'],
      },
    ],

    officialSources: [
      { name: 'Federal Tax Authority (FTA UAE)', url: 'https://tax.gov.ae', type: 'Tax' },
      { name: 'Ministry of Economy UAE', url: 'https://www.moec.gov.ae', type: 'Business Licensing' },
      { name: 'MOHRE (Ministry of Human Resources & Emiratisation)', url: 'https://www.mohre.gov.ae', type: 'Labour & Visas' },
    ],
  },

  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe (EU)',
    currency: 'EUR',
    corporateTaxRate: 15.825, // 15% Körperschaftsteuer + 5.5% Solidaritätszuschlag + Gewerbesteuer ~14% = Total ~30%
    vatGstRate: 19.0,
    businessSetupComplexity: 'High',
    talentAvailability: 'High',
    labourCostLevel: 'High',
    regulatoryComplexity: 'High',
    marketPotential: 'High',
    foreignOwnership: '100% Foreign Ownership Permitted',
    dataConfidenceScore: 92,
    overviewText:
      'Germany is Europe’s largest economy and premier technology market. It grants direct access to the 450M EU Single Market, backed by strict legal certainty, top-tier engineering talent, and strong EU Blue Card migration paths.',

    businessStructures: [
      {
        name: 'Gesellschaft mit beschränkter Haftung (GmbH)',
        legalStatus: 'Limited liability company',
        liability: 'Limited to company share capital',
        foreignOwnership: '100% foreign owned',
        setupComplexity: 'High',
        setupTimeWeeks: 4,
        officialRegFeeUSD: 650, // ~€600 notary & Handelsregister fees
        estimatedLegalAgencyFeeUSD: 2500,
        basicRequirements: ['€25,000 minimum share capital (at least €12,500 paid up upfront)', 'Notarized articles of association', 'Handelsregister entry'],
        officialSource: 'Federal Ministry for Economic Affairs (BMWK)',
      },
      {
        name: 'Unternehmergesellschaft (UG haftungsbeschränkt)',
        legalStatus: 'Mini-GmbH for startups',
        liability: 'Limited liability',
        foreignOwnership: '100% foreign owned',
        setupComplexity: 'Medium',
        setupTimeWeeks: 3,
        officialRegFeeUSD: 350,
        estimatedLegalAgencyFeeUSD: 1200,
        basicRequirements: ['€1 minimum capital (must retain 25% annual profit until €25K capital reached)', 'Standardized notarized contract'],
        officialSource: 'BMWK Germany',
      },
    ],

    licenses: [
      { name: 'Gewerbeanmeldung (Trade Registration)', regulator: 'Gewerbeamt Local Office', status: 'Likely required', description: 'Mandatory commercial notification for business operations.' },
      { name: 'BaFin Financial License', regulator: 'Bundesanstalt für Finanzdienstleistungsaufsicht', status: 'Check required', description: 'Required for FinTech, loan brokerage, or payment handling.' },
    ],

    labourMetrics: [
      {
        roleCategory: 'Customer Support',
        talentAvailability: 'Medium',
        estimatedSalaryRangeUSD: { min: 3200, max: 5200 },
        hiringDifficulty: 'Medium',
        foreignWorkerPassType: 'EU Blue Card / Work Visa',
        foreignWorkerMinSalaryUSD: 3800,
        quotaOrLevyDetails: 'No formal quota, but employment contract must meet statutory minimum wage (€12.41/hr) and local salary standards.',
      },
      {
        roleCategory: 'Software / IT',
        talentAvailability: 'High',
        estimatedSalaryRangeUSD: { min: 5500, max: 10500 },
        hiringDifficulty: 'Medium',
        foreignWorkerPassType: 'EU Blue Card (IT Specialist Path)',
        foreignWorkerMinSalaryUSD: 4100, // ~€41,000/yr for shortage occupations in 2024+
        quotaOrLevyDetails: 'Fast-track Blue Card processing available without formal Federal Employment Agency labor market check for qualified IT leads.',
      },
    ],

    tax: {
      corporateTaxRate: 30.0, // Combined Corporate (15%), Soli (0.825%), and Trade Tax Gewerbesteuer (~14%)
      headlineVatGstRate: 19.0, // Mehrwertsteuer (MwSt.)
      payrollTaxRateEst: 20.0, // Employer social security contributions (~19-21% for health, pension, care, unemployment)
      withholdingTaxDividend: 26.375, // 25% + Soli (reduced under DTAA)
      taxComplexity: 'High',
      startupIncentives: ['INVEST Grant for Venture Capital (20% reimbursement to angel investors)', 'ZIM Innovation Research Grant'],
      taxImpactSummary: 'Higher nominal tax burden (~30% effective corp tax + 20% employer social security), offset by EU single market scale and high buyer purchasing power.',
    },

    dataPrivacy: {
      lawName: 'General Data Protection Regulation (GDPR / DSGVO)',
      dpoRequirement: 'Mandatory if 20 or more employees regularly process personal data automatically.',
      crossBorderTransferRules: 'Strict EU adequacy decisions or Standard Contractual Clauses (SCCs) + Transfer Impact Assessment.',
      riskLevel: 'High',
      officialSource: 'Federal Commissioner for Data Protection and Freedom of Information (BfDI)',
    },

    bankingEase: 'Moderate',
    bankingRequirements: ['Notarized GmbH Founding Deed', 'Handelsregister HRB Registration Certificate', 'Commercial Tax ID (Steuernummer)', 'Passport identification via PostIdent or VideoIdent'],

    importExportReqs: {
      required: false,
      customsDetails: 'Free movement of goods across 27 EU member states. EORI number required for imports outside EU.',
      tradeDocName: 'EORI Number (Zoll / Customs Germany)',
    },

    ipProtectionInfo: 'German Patent and Trade Mark Office (DPMA) & EUIPO grant pan-European trademark and patent protection.',
    insuranceRecommendations: ['Betriebshaftpflichtversicherung (Commercial General Liability)', 'Berufsgenossenschaft (Mandatory statutory accident insurance for employees)'],

    incentives: [
      {
        id: 'inc-de-1',
        programName: 'ZIM (Central Innovation Programme for SMEs)',
        qualifyingCriteria: 'SMEs & startups developing innovative technical products or software.',
        potentialBenefit: 'Non-repayable grant covering up to 45% of personnel & R&D costs.',
        applicationRequirements: 'Detailed technical R&D project plan.',
        officialSource: 'BMWK Germany',
      },
    ],

    risks: [
      {
        id: 'rk-de-1',
        category: 'Regulatory',
        level: 'HIGH',
        title: 'GDPR Compliance & Fines',
        cause: 'Strict privacy enforcement by German data protection authorities (LDI) with fines up to 4% global turnover.',
        mitigation: 'Implement clear privacy policy, cookie consent manager, and appoint a certified DPO early.',
        verificationSteps: ['Conduct GDPR compliance audit on user data collection pipelines'],
      },
      {
        id: 'rk-de-2',
        category: 'Labour',
        level: 'MEDIUM',
        title: 'Rigid Employment Protection Laws (KSchG)',
        cause: 'After 6-month probation, termination of employees in firms >10 headcount requires statutory cause.',
        mitigation: 'Utilize 6-month probation period thoroughly and offer competitive performance incentive models.',
        verificationSteps: ['Consult German employment lawyer before drafting employment contracts'],
      },
    ],

    officialSources: [
      { name: 'Federal Central Tax Office (BZSt)', url: 'https://www.bzst.de', type: 'Tax' },
      { name: 'Handelsregister (German Register Portal)', url: 'https://www.handelsregister.de', type: 'Registration' },
      { name: 'BfDI (Federal Data Protection Controller)', url: 'https://www.bfdi.bund.de', type: 'Data Privacy' },
      { name: 'GTAI (Germany Trade & Invest)', url: 'https://www.gtai.de', type: 'Investment & Strategy' },
    ],
  },
};
