import type {
  CostBreakdownItem,
  CostCalculationResult,
  CostSourceType,
  CountryMasterData,
  ExpansionPlan,
} from '../types';
import { LabourService } from './labourService';
import { TaxService } from './taxService';

export class CostCalculatorService {
  public static calculatePlanCosts(
    plan: ExpansionPlan,
    countryData: CountryMasterData
  ): CostCalculationResult {
    const primaryStructure = countryData.businessStructures[0];
    const overrides = plan.costOverrides || {};

    const resolveAmount = (
      id: string,
      defaultAmount: number,
      defaultSource: CostSourceType
    ): { amount: number; source: CostSourceType; isOverridden: boolean } => {
      if (overrides[id] !== undefined && !isNaN(overrides[id])) {
        return { amount: overrides[id], source: 'User Entered', isOverridden: true };
      }
      return { amount: defaultAmount, source: defaultSource, isOverridden: false };
    };

    const items: CostBreakdownItem[] = [];

    // ============================================================
    // SECTION A: INITIAL SETUP COST (One-time)
    // ============================================================
    // 1. Company Registration
    const officialRegUSD = primaryStructure?.officialRegFeeUSD || (countryData.code === 'SG' ? 235 : countryData.code === 'AE' ? 3200 : 800);
    const regRes = resolveAmount('setup_reg', officialRegUSD, 'Official Fee');
    items.push({
      id: 'setup_reg',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Corporate Registration',
      item: `Government Incorporation Fee (${primaryStructure?.name || 'Company Reg'})`,
      amountUSD: regRes.amount,
      officialFeeUSD: regRes.isOverridden ? 0 : officialRegUSD,
      estimatedBusinessCostUSD: regRes.isOverridden ? regRes.amount : 0,
      userProvidedCostUSD: regRes.isOverridden ? regRes.amount : 0,
      modelGeneratedEstimateUSD: officialRegUSD,
      sourceType: regRes.source,
      isOfficialFee: !regRes.isOverridden,
      isUserOverridden: regRes.isOverridden,
      period: 'one-time',
      notes: primaryStructure?.officialSource || 'Official authority statutory filing',
    });

    // 2. Legal / Professional Fees
    const defaultLegalUSD = primaryStructure?.estimatedLegalAgencyFeeUSD || (countryData.code === 'SG' ? 850 : countryData.code === 'AE' ? 1500 : 2200);
    const legalRes = resolveAmount('setup_legal', defaultLegalUSD, 'Dataset Estimate');
    items.push({
      id: 'setup_legal',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Legal & Agency Setup',
      item: 'Registered Agent, Corporate Secretary & Nominee Services',
      amountUSD: legalRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: legalRes.amount,
      userProvidedCostUSD: legalRes.isOverridden ? legalRes.amount : 0,
      modelGeneratedEstimateUSD: defaultLegalUSD,
      sourceType: legalRes.source,
      isOfficialFee: false,
      isUserOverridden: legalRes.isOverridden,
      period: 'one-time',
      notes: 'Local secretarial appointment & drafting articles of association.',
    });

    // 3. Business Licence Fees
    const defaultLicenceUSD = countryData.code === 'SG' ? 150 : countryData.code === 'AE' ? 2500 : 350;
    const licRes = resolveAmount('setup_licence', defaultLicenceUSD, 'Official Fee');
    items.push({
      id: 'setup_licence',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Licensing & Permits',
      item: 'Commercial Trade / Sector Operational Licence',
      amountUSD: licRes.amount,
      officialFeeUSD: licRes.isOverridden ? 0 : defaultLicenceUSD,
      estimatedBusinessCostUSD: licRes.isOverridden ? licRes.amount : 0,
      userProvidedCostUSD: licRes.isOverridden ? licRes.amount : 0,
      modelGeneratedEstimateUSD: defaultLicenceUSD,
      sourceType: licRes.source,
      isOfficialFee: !licRes.isOverridden,
      isUserOverridden: licRes.isOverridden,
      period: 'one-time',
      notes: 'General business license issuance fee from municipal / freezone regulator.',
    });

    // 4. Initial Office Deposit
    const defaultOfficeDepUSD = countryData.code === 'SG' ? 2400 : countryData.code === 'AE' ? 1800 : 2200;
    const offDepRes = resolveAmount('setup_office_dep', defaultOfficeDepUSD, 'Dataset Estimate');
    items.push({
      id: 'setup_office_dep',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Workplace & Facility',
      item: 'Office Lease Security Deposit (2 months refundable)',
      amountUSD: offDepRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: offDepRes.amount,
      userProvidedCostUSD: offDepRes.isOverridden ? offDepRes.amount : 0,
      modelGeneratedEstimateUSD: defaultOfficeDepUSD,
      sourceType: offDepRes.source,
      isOfficialFee: false,
      isUserOverridden: offDepRes.isOverridden,
      period: 'one-time',
      notes: 'Refundable commercial deposit for dedicated flexi/co-working space.',
    });

    // 5. Equipment & Workplace Furnishing
    const workforceCount = plan.workforce.reduce((sum, w) => sum + w.count, 0) || 1;
    const defaultEquipUSD = workforceCount * 650;
    const equipRes = resolveAmount('setup_equip', defaultEquipUSD, 'Model Estimate');
    items.push({
      id: 'setup_equip',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Hardware & Infrastructure',
      item: `Workstation Equipment & Hardware (${workforceCount} Workstations)`,
      amountUSD: equipRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: equipRes.amount,
      userProvidedCostUSD: equipRes.isOverridden ? equipRes.amount : 0,
      modelGeneratedEstimateUSD: defaultEquipUSD,
      sourceType: equipRes.source,
      isOfficialFee: false,
      isUserOverridden: equipRes.isOverridden,
      period: 'one-time',
      notes: 'Monitors, peripherals, enterprise laptop provisioning allowance.',
    });

    // 6. Technology Setup & Infrastructure
    const defaultTechUSD = 1200;
    const techRes = resolveAmount('setup_tech', defaultTechUSD, 'Model Estimate');
    items.push({
      id: 'setup_tech',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'IT & Cloud Systems',
      item: 'Local Cloud Tenant, Domain, SSO & VPN Setup',
      amountUSD: techRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: techRes.amount,
      userProvidedCostUSD: techRes.isOverridden ? techRes.amount : 0,
      modelGeneratedEstimateUSD: defaultTechUSD,
      sourceType: techRes.source,
      isOfficialFee: false,
      isUserOverridden: techRes.isOverridden,
      period: 'one-time',
      notes: 'Configuration of country-localized data storage and enterprise security.',
    });

    // 7. Banking Setup & KYC Filing
    const defaultBankUSD = countryData.code === 'SG' ? 500 : countryData.code === 'AE' ? 950 : 600;
    const bankRes = resolveAmount('setup_bank', defaultBankUSD, 'Dataset Estimate');
    items.push({
      id: 'setup_bank',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Banking & Financial',
      item: 'Corporate Bank Account Onboarding & Compliance KYC',
      amountUSD: bankRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: bankRes.amount,
      userProvidedCostUSD: bankRes.isOverridden ? bankRes.amount : 0,
      modelGeneratedEstimateUSD: defaultBankUSD,
      sourceType: bankRes.source,
      isOfficialFee: false,
      isUserOverridden: bankRes.isOverridden,
      period: 'one-time',
      notes: 'Commercial bank documentation review and video verification setup.',
    });

    // 8. Initial Commercial Insurance
    const defaultInsurSetupUSD = 750;
    const insurSetupRes = resolveAmount('setup_insur', defaultInsurSetupUSD, 'Dataset Estimate');
    items.push({
      id: 'setup_insur',
      section: 'A',
      sectionTitle: 'Initial Setup Cost',
      category: 'Insurance Setup',
      item: 'Initial Commercial General Liability & Indemnity Deposit',
      amountUSD: insurSetupRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: insurSetupRes.amount,
      userProvidedCostUSD: insurSetupRes.isOverridden ? insurSetupRes.amount : 0,
      modelGeneratedEstimateUSD: defaultInsurSetupUSD,
      sourceType: insurSetupRes.source,
      isOfficialFee: false,
      isUserOverridden: insurSetupRes.isOverridden,
      period: 'one-time',
      notes: 'Mandatory commercial liability policy inception.',
    });

    // ============================================================
    // SECTION B: EMPLOYEE COST (Monthly recurring payroll & benefits)
    // ============================================================
    const labourSummary = LabourService.assessWorkforceFeasibility(countryData.code, plan.workforce);

    // B1. Base Monthly Salaries
    const salaryRes = resolveAmount('emp_payroll', labourSummary.monthlyBaseSalaryUSD, 'Dataset Estimate');
    items.push({
      id: 'emp_payroll',
      section: 'B',
      sectionTitle: 'Employee Cost',
      category: 'Payroll & Compensation',
      item: `Base Salaries (${workforceCount} Employees across ${plan.workforce.length} Roles)`,
      amountUSD: salaryRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: salaryRes.amount,
      userProvidedCostUSD: salaryRes.isOverridden ? salaryRes.amount : 0,
      modelGeneratedEstimateUSD: labourSummary.monthlyBaseSalaryUSD,
      sourceType: salaryRes.source,
      isOfficialFee: false,
      isUserOverridden: salaryRes.isOverridden,
      period: 'monthly',
      notes: `Grounded in ${countryData.name} benchmark salary tiers for selected roles.`,
    });

    // B2. Employer Mandatory Contributions
    const contribRes = resolveAmount('emp_contrib', labourSummary.monthlyEmployerContributionsUSD, 'Official Fee');
    items.push({
      id: 'emp_contrib',
      section: 'B',
      sectionTitle: 'Employee Cost',
      category: 'Statutory Benefits',
      item: `Employer Contributions (${countryData.code === 'SG' ? 'CPF ~17%' : countryData.code === 'AE' ? 'End of Service / Pension' : 'Social Security ~20%'})`,
      amountUSD: contribRes.amount,
      officialFeeUSD: contribRes.isOverridden ? 0 : labourSummary.monthlyEmployerContributionsUSD,
      estimatedBusinessCostUSD: contribRes.isOverridden ? contribRes.amount : 0,
      userProvidedCostUSD: contribRes.isOverridden ? contribRes.amount : 0,
      modelGeneratedEstimateUSD: labourSummary.monthlyEmployerContributionsUSD,
      sourceType: contribRes.source,
      isOfficialFee: !contribRes.isOverridden,
      isUserOverridden: contribRes.isOverridden,
      period: 'monthly',
      notes: 'Statutory employer contributions to national social security / retirement schemes.',
    });

    // B3. Employee Health Insurance (Monthly)
    const defaultEmpInsurMonthly = workforceCount * (countryData.code === 'SG' ? 90 : countryData.code === 'AE' ? 120 : 0);
    const empInsurRes = resolveAmount('emp_insurance', defaultEmpInsurMonthly, 'Dataset Estimate');
    items.push({
      id: 'emp_insurance',
      section: 'B',
      sectionTitle: 'Employee Cost',
      category: 'Health & Medical',
      item: `Group Medical & Healthcare Coverage (${workforceCount} Staff)`,
      amountUSD: empInsurRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: empInsurRes.amount,
      userProvidedCostUSD: empInsurRes.isOverridden ? empInsurRes.amount : 0,
      modelGeneratedEstimateUSD: defaultEmpInsurMonthly,
      sourceType: empInsurRes.source,
      isOfficialFee: false,
      isUserOverridden: empInsurRes.isOverridden,
      period: 'monthly',
      notes: countryData.code === 'AE' ? 'Mandatory health insurance under DHA/DOH regulations.' : 'Group hospitalization & outpatient rider.',
    });

    // B4. Recruitment & Talent Acquisition (One-time setup addition)
    const defaultRecruitmentUSD = Math.round(labourSummary.monthlyBaseSalaryUSD * 0.15); // ~15% one-month recruitment cost
    const recruitRes = resolveAmount('emp_recruitment', defaultRecruitmentUSD, 'Model Estimate');
    items.push({
      id: 'emp_recruitment',
      section: 'B',
      sectionTitle: 'Employee Cost',
      category: 'Hiring & Sourcing',
      item: 'Talent Acquisition, Job Board Listings & Background Screening',
      amountUSD: recruitRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: recruitRes.amount,
      userProvidedCostUSD: recruitRes.isOverridden ? recruitRes.amount : 0,
      modelGeneratedEstimateUSD: defaultRecruitmentUSD,
      sourceType: recruitRes.source,
      isOfficialFee: false,
      isUserOverridden: recruitRes.isOverridden,
      period: 'one-time',
      notes: 'Local recruitment agency, LinkedIn recruiter seats, and verification checks.',
    });

    // B5. Onboarding & Training (One-time)
    const defaultOnboardingUSD = workforceCount * 300;
    const onboardRes = resolveAmount('emp_onboarding', defaultOnboardingUSD, 'Model Estimate');
    items.push({
      id: 'emp_onboarding',
      section: 'B',
      sectionTitle: 'Employee Cost',
      category: 'Onboarding & Enablement',
      item: `Employee Onboarding & Compliance Training (${workforceCount} Staff)`,
      amountUSD: onboardRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: onboardRes.amount,
      userProvidedCostUSD: onboardRes.isOverridden ? onboardRes.amount : 0,
      modelGeneratedEstimateUSD: defaultOnboardingUSD,
      sourceType: onboardRes.source,
      isOfficialFee: false,
      isUserOverridden: onboardRes.isOverridden,
      period: 'one-time',
      notes: 'Mandatory workplace safety, data security training, and HR compliance packets.',
    });

    // ============================================================
    // SECTION C: OFFICE / OPERATING COST (Monthly recurring)
    // ============================================================
    // C1. Office Rent
    const defaultRentUSD = countryData.code === 'SG' ? 1200 : countryData.code === 'AE' ? 950 : 1100;
    const rentRes = resolveAmount('office_rent', defaultRentUSD, 'Dataset Estimate');
    items.push({
      id: 'office_rent',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'Commercial Space',
      item: 'Co-working Dedicated Desks / Managed Office Space',
      amountUSD: rentRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: rentRes.amount,
      userProvidedCostUSD: rentRes.isOverridden ? rentRes.amount : 0,
      modelGeneratedEstimateUSD: defaultRentUSD,
      sourceType: rentRes.source,
      isOfficialFee: false,
      isUserOverridden: rentRes.isOverridden,
      period: 'monthly',
      notes: 'Flexible grade-A office membership with registered commercial address.',
    });

    // C2. Utilities, Power & Facility Services
    const defaultUtilUSD = 180;
    const utilRes = resolveAmount('office_util', defaultUtilUSD, 'Dataset Estimate');
    items.push({
      id: 'office_util',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'Utilities',
      item: 'Power, Building Maintenance & Facility Operations',
      amountUSD: utilRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: utilRes.amount,
      userProvidedCostUSD: utilRes.isOverridden ? utilRes.amount : 0,
      modelGeneratedEstimateUSD: defaultUtilUSD,
      sourceType: utilRes.source,
      isOfficialFee: false,
      isUserOverridden: utilRes.isOverridden,
      period: 'monthly',
      notes: 'Facility maintenance and standard operational utilities.',
    });

    // C3. Internet & High-Speed Telecom
    const defaultNetUSD = 120;
    const netRes = resolveAmount('office_net', defaultNetUSD, 'Dataset Estimate');
    items.push({
      id: 'office_net',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'Telecommunications',
      item: 'Enterprise Fiber Internet & VOIP Local Trunking',
      amountUSD: netRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: netRes.amount,
      userProvidedCostUSD: netRes.isOverridden ? netRes.amount : 0,
      modelGeneratedEstimateUSD: defaultNetUSD,
      sourceType: netRes.source,
      isOfficialFee: false,
      isUserOverridden: netRes.isOverridden,
      period: 'monthly',
      notes: 'Symmetric high-speed connectivity and local virtual phone numbers.',
    });

    // C4. Software & IT Subscriptions
    const defaultSoftUSD = workforceCount * 110;
    const softRes = resolveAmount('office_soft', defaultSoftUSD, 'Model Estimate');
    items.push({
      id: 'office_soft',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'SaaS & Subscriptions',
      item: `Productivity & Security SaaS Suite (${workforceCount} Users)`,
      amountUSD: softRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: softRes.amount,
      userProvidedCostUSD: softRes.isOverridden ? softRes.amount : 0,
      modelGeneratedEstimateUSD: defaultSoftUSD,
      sourceType: softRes.source,
      isOfficialFee: false,
      isUserOverridden: softRes.isOverridden,
      period: 'monthly',
      notes: 'Google Workspace/M365, Slack, endpoint protection, and project tools.',
    });

    // C5. Accounting & Monthly Bookkeeping
    const defaultAcctUSD = countryData.code === 'SG' ? 350 : countryData.code === 'AE' ? 300 : 450;
    const acctRes = resolveAmount('office_acct', defaultAcctUSD, 'Dataset Estimate');
    items.push({
      id: 'office_acct',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'Accounting & Finance',
      item: 'Monthly Bookkeeping, Management Accounts & GST/VAT Filing',
      amountUSD: acctRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: acctRes.amount,
      userProvidedCostUSD: acctRes.isOverridden ? acctRes.amount : 0,
      modelGeneratedEstimateUSD: defaultAcctUSD,
      sourceType: acctRes.source,
      isOfficialFee: false,
      isUserOverridden: acctRes.isOverridden,
      period: 'monthly',
      notes: 'Local certified accountant retainer for statutory ledger maintenance.',
    });

    // C6. Compliance & Secretarial Retainer
    const defaultCompUSD = countryData.code === 'SG' ? 180 : countryData.code === 'AE' ? 150 : 220;
    const compRes = resolveAmount('office_comp', defaultCompUSD, 'Dataset Estimate');
    items.push({
      id: 'office_comp',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'Governance & Compliance',
      item: 'Company Secretary & Statutory Filing Maintenance Retainer',
      amountUSD: compRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: compRes.amount,
      userProvidedCostUSD: compRes.isOverridden ? compRes.amount : 0,
      modelGeneratedEstimateUSD: defaultCompUSD,
      sourceType: compRes.source,
      isOfficialFee: false,
      isUserOverridden: compRes.isOverridden,
      period: 'monthly',
      notes: 'ACRA/DIFC annual return preparation, director resolutions, and register upkeep.',
    });

    // C7. Marketing & Client Acquisition
    const defaultMktUSD = 500;
    const mktRes = resolveAmount('office_mkt', defaultMktUSD, 'Model Estimate');
    items.push({
      id: 'office_mkt',
      section: 'C',
      sectionTitle: 'Office & Operating Cost',
      category: 'Marketing & Growth',
      item: 'Target Market Outreach & Digital Marketing Allowance',
      amountUSD: mktRes.amount,
      officialFeeUSD: 0,
      estimatedBusinessCostUSD: mktRes.amount,
      userProvidedCostUSD: mktRes.isOverridden ? mktRes.amount : 0,
      modelGeneratedEstimateUSD: defaultMktUSD,
      sourceType: mktRes.source,
      isOfficialFee: false,
      isUserOverridden: mktRes.isOverridden,
      period: 'monthly',
      notes: 'Localized demand generation, events attendance, and localized SEO.',
    });

    // ============================================================
    // SECTION D: TAX / GOVERNMENT COSTS (Annual statutory provision)
    // ============================================================
    const taxEstimate = TaxService.estimateTaxes(countryData.code, plan.profile.annualRevenueUSD * 0.2); // assumed 20% margin
    const taxRes = resolveAmount('tax_annual', taxEstimate.estimatedAnnualTaxUSD, 'Official Fee');
    items.push({
      id: 'tax_annual',
      section: 'D',
      sectionTitle: 'Tax / Government Costs',
      category: 'Corporate Income Tax',
      item: `Estimated Corporate Income Tax Provision (${countryData.name})`,
      amountUSD: taxRes.amount,
      officialFeeUSD: taxRes.isOverridden ? 0 : taxEstimate.estimatedAnnualTaxUSD,
      estimatedBusinessCostUSD: taxRes.isOverridden ? taxRes.amount : 0,
      userProvidedCostUSD: taxRes.isOverridden ? taxRes.amount : 0,
      modelGeneratedEstimateUSD: taxEstimate.estimatedAnnualTaxUSD,
      sourceType: taxRes.source,
      isOfficialFee: !taxRes.isOverridden,
      isUserOverridden: taxRes.isOverridden,
      period: 'annual',
      notes: `${taxEstimate.exemptionsSummary} Statutory rate: ${countryData.corporateTaxRate}%.`,
    });

    // ============================================================
    // SECTION E: FOREIGN WORKER COST
    // ============================================================
    const foreignWorkers = labourSummary.totalForeignDesired;
    let foreignVisaFeeUSD = 0;
    let foreignMonthlyLevyUSD = 0;

    if (foreignWorkers > 0) {
      if (countryData.code === 'SG') {
        // S$105 submit + S$225 issue = S$330 (~$246 USD) per EP pass
        foreignVisaFeeUSD = foreignWorkers * 250;
        // Foreign worker levy applies if on S-Pass (~S$330-S$650/mo, avg $350 USD)
        foreignMonthlyLevyUSD = foreignWorkers * 350;
      } else if (countryData.code === 'AE') {
        // Freezone employment visa ~AED 3,500 - 4,500 (~$1,000 USD)
        foreignVisaFeeUSD = foreignWorkers * 1000;
        foreignMonthlyLevyUSD = 0; // Zero levy in Freezones
      } else {
        // Germany Blue Card visa ~€75 (~$85 USD) + relocation assist
        foreignVisaFeeUSD = foreignWorkers * 300;
        foreignMonthlyLevyUSD = 0;
      }

      const visaRes = resolveAmount('foreign_visa_fee', foreignVisaFeeUSD, 'Official Fee');
      items.push({
        id: 'foreign_visa_fee',
        section: 'E',
        sectionTitle: 'Foreign Worker Cost',
        category: 'Visa & Pass Processing',
        item: `Government Visa Application & Issuance Fees (${foreignWorkers} Foreign Hires)`,
        amountUSD: visaRes.amount,
        officialFeeUSD: visaRes.isOverridden ? 0 : foreignVisaFeeUSD,
        estimatedBusinessCostUSD: visaRes.isOverridden ? visaRes.amount : 0,
        userProvidedCostUSD: visaRes.isOverridden ? visaRes.amount : 0,
        modelGeneratedEstimateUSD: foreignVisaFeeUSD,
        sourceType: visaRes.source,
        isOfficialFee: !visaRes.isOverridden,
        isUserOverridden: visaRes.isOverridden,
        period: 'one-time',
        notes: `Official immigration authority filing fees for ${foreignWorkers} foreign workers.`,
      });

      if (foreignMonthlyLevyUSD > 0) {
        const levyRes = resolveAmount('foreign_levy', foreignMonthlyLevyUSD, 'Official Fee');
        items.push({
          id: 'foreign_levy',
          section: 'E',
          sectionTitle: 'Foreign Worker Cost',
          category: 'Foreign Worker Levy',
          item: `MOM Monthly Foreign Worker Levy (${foreignWorkers} Staff)`,
          amountUSD: levyRes.amount,
          officialFeeUSD: levyRes.isOverridden ? 0 : foreignMonthlyLevyUSD,
          estimatedBusinessCostUSD: levyRes.isOverridden ? levyRes.amount : 0,
          userProvidedCostUSD: levyRes.isOverridden ? levyRes.amount : 0,
          modelGeneratedEstimateUSD: foreignMonthlyLevyUSD,
          sourceType: levyRes.source,
          isOfficialFee: !levyRes.isOverridden,
          isUserOverridden: levyRes.isOverridden,
          period: 'monthly',
          notes: 'Statutory monthly foreign worker levy payable to Ministry of Manpower.',
        });
      }
    }

    // ============================================================
    // AGGREGATION & STRICT NON-DUPLICATION FORMULA
    // ============================================================
    // 1. One-time Setup Items:
    // All items where period === 'one-time'
    const sectionAItems = items.filter((it) => it.section === 'A');
    const oneTimeSectionA = sectionAItems.reduce((sum, it) => sum + it.amountUSD, 0);

    // One-time employee items (recruitment, onboarding)
    const oneTimeSectionB = items
      .filter((it) => it.section === 'B' && it.period === 'one-time')
      .reduce((sum, it) => sum + it.amountUSD, 0);

    // One-time foreign visa items
    const oneTimeSectionE = items
      .filter((it) => it.section === 'E' && it.period === 'one-time')
      .reduce((sum, it) => sum + it.amountUSD, 0);

    const initialSetupTotalUSD = oneTimeSectionA + oneTimeSectionB + oneTimeSectionE;

    // 2. Monthly Recurring Operating Items:
    // Monthly payroll + monthly contributions + monthly health insurance
    const monthlySectionB = items
      .filter((it) => it.section === 'B' && it.period === 'monthly')
      .reduce((sum, it) => sum + it.amountUSD, 0);

    // Monthly office & operations (rent, util, net, soft, acct, comp, mkt)
    const monthlySectionC = items
      .filter((it) => it.section === 'C' && it.period === 'monthly')
      .reduce((sum, it) => sum + it.amountUSD, 0);

    // Monthly foreign worker levies
    const monthlySectionE = items
      .filter((it) => it.section === 'E' && it.period === 'monthly')
      .reduce((sum, it) => sum + it.amountUSD, 0);

    const totalMonthlyOpCostUSD = monthlySectionB + monthlySectionC + monthlySectionE;

    // Annualized sections
    const annualSectionB = monthlySectionB * 12 + oneTimeSectionB;
    const annualSectionC = monthlySectionC * 12;
    const annualSectionD = items
      .filter((it) => it.section === 'D')
      .reduce((sum, it) => sum + it.amountUSD, 0);
    const annualSectionE = monthlySectionE * 12 + oneTimeSectionE;

    // First Year Total Formula:
    // First Year Total = Initial Setup Cost + (Monthly Operating Cost * 12) + Annual Tax Provision
    // NOTE: Employee salaries are counted strictly ONCE as part of (Monthly Operating Cost * 12)
    const firstYearTotalUSD = initialSetupTotalUSD + (totalMonthlyOpCostUSD * 12) + annualSectionD;
    const year2EstimateUSD = Math.round(totalMonthlyOpCostUSD * 12 * 1.08 + annualSectionD * 1.15);
    const year3EstimateUSD = Math.round(totalMonthlyOpCostUSD * 12 * 1.18 + annualSectionD * 1.25);

    // Waterfall for visual clarity
    const waterfall = [
      { label: 'Initial Setup & Licensing (Section A)', amountUSD: oneTimeSectionA, type: 'setup' as const },
      { label: 'Annual Workforce Compensation (Section B)', amountUSD: annualSectionB, type: 'payroll' as const },
      { label: 'Annual Office & Operations (Section C)', amountUSD: annualSectionC, type: 'office' as const },
      { label: 'Corporate Tax Provision (Section D)', amountUSD: annualSectionD, type: 'compliance' as const },
      { label: 'Foreign Worker Passes & Levies (Section E)', amountUSD: annualSectionE, type: 'other' as const },
    ];

    return {
      initialSetupUSD: initialSetupTotalUSD,
      monthlyOperatingUSD: totalMonthlyOpCostUSD,
      monthlyPayrollUSD: salaryRes.amount,
      firstYearTotalUSD,
      year2EstimateUSD,
      year3EstimateUSD,
      sectionATotalUSD: initialSetupTotalUSD,
      sectionBTotalUSD: annualSectionB,
      sectionCTotalUSD: annualSectionC,
      sectionDTotalUSD: annualSectionD,
      sectionETotalUSD: annualSectionE,
      items,
      waterfall,
    };
  }
}
