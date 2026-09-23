import { COUNTRIES_DATA } from '../data/countriesData';

export interface TaxEstimateResult {
  countryCode: string;
  headlineCorpTaxRate: number;
  vatGstRate: number;
  effectiveTaxRatePercent: number;
  estimatedAnnualTaxUSD: number;
  qualifyingIncentives: string[];
  exemptionsSummary: string;
  taxSourceNote: string;
}

export class TaxService {
  public static getTaxMetrics(countryCode: string) {
    const data = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA['SG'];
    return data.tax;
  }

  public static estimateTaxes(
    countryCode: string,
    estimatedAnnualProfitUSD: number
  ): TaxEstimateResult {
    const data = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA['SG'];

    let effectiveTaxRate = data.corporateTaxRate;
    let estimatedAnnualTaxUSD = 0;
    let qualifyingIncentives: string[] = [];
    let exemptionsSummary = '';
    const taxSourceNote = `Official statutory tax framework: ${data.tax.taxComplexity} compliance jurisdiction.`;

    if (countryCode === 'SG') {
      // Singapore Start-up Tax Exemption:
      // 75% exemption on first S$100,000 (~$74k USD)
      // 50% exemption on next S$100,000 (~$74k USD)
      // Normal tax rate 17%
      const firstTierCap = 74000;
      const secondTierCap = 74000;

      if (estimatedAnnualProfitUSD <= 0) {
        estimatedAnnualTaxUSD = 0;
      } else {
        const tier1Profit = Math.min(estimatedAnnualProfitUSD, firstTierCap);
        const tier1Taxable = tier1Profit * 0.25;

        const remainingAfterTier1 = Math.max(0, estimatedAnnualProfitUSD - firstTierCap);
        const tier2Profit = Math.min(remainingAfterTier1, secondTierCap);
        const tier2Taxable = tier2Profit * 0.5;

        const remainingAfterTier2 = Math.max(0, remainingAfterTier1 - secondTierCap);
        const tier3Taxable = remainingAfterTier2;

        const totalTaxable = tier1Taxable + tier2Taxable + tier3Taxable;
        estimatedAnnualTaxUSD = Math.round(totalTaxable * 0.17);
      }

      effectiveTaxRate =
        estimatedAnnualProfitUSD > 0
          ? Math.round((estimatedAnnualTaxUSD / estimatedAnnualProfitUSD) * 1000) / 10
          : 0;

      qualifyingIncentives = [
        'Start-up Tax Exemption (SUTE): 75% off first S$100k, 50% off next S$100k',
        'Section 13(8) Foreign-Sourced Income Exemption (0% tax on overseas dividend repatriation)',
        'Enterprise Innovation Scheme (EIS): 400% tax deduction on qualifying R&D expenditure',
      ];
      exemptionsSummary = 'Effective first 3-year tax rate typically ranges between 4.25% and 8.5% under IRAS startup incentives.';
    } else if (countryCode === 'AE') {
      // UAE: 0% up to AED 375,000 (~$102k USD), 9% on excess.
      // 0% on qualifying Free Zone income
      const thresholdUSD = 102000;
      if (estimatedAnnualProfitUSD <= thresholdUSD) {
        estimatedAnnualTaxUSD = 0;
        effectiveTaxRate = 0;
      } else {
        const taxable = estimatedAnnualProfitUSD - thresholdUSD;
        estimatedAnnualTaxUSD = Math.round(taxable * 0.09);
        effectiveTaxRate =
          Math.round((estimatedAnnualTaxUSD / estimatedAnnualProfitUSD) * 1000) / 10;
      }

      qualifyingIncentives = [
        'Small Business Relief: 0% tax liability on revenue under AED 3,000,000 (~$816k USD)',
        'Qualifying Free Zone Person (QFZP): 0% corporate tax on foreign and qualifying wholesale transactions',
        '0% Personal Income Tax on founders and employees',
      ];
      exemptionsSummary = 'Profits under AED 375k are completely 0% corporate taxed. Freezone entities with qualifying trade enjoy 0% corporate tax.';
    } else {
      // Germany: ~30% total (15% Corp + 5.5% Solidarität + ~14% Gewerbesteuer)
      estimatedAnnualTaxUSD = Math.round(Math.max(0, estimatedAnnualProfitUSD) * 0.30);
      effectiveTaxRate = 30.0;
      qualifyingIncentives = [
        'Research Allowance (Forschungszulage): Up to €1,000,000 annual tax credit for R&D personnel',
        'Loss Carryforward (Verlustvortrag): Offset early-year startup setup losses against future taxable profits',
      ];
      exemptionsSummary = 'Combined statutory rate is ~30% (Körperschaftsteuer + Gewerbesteuer). Early-stage operational losses can be carried forward indefinitely.';
    }

    return {
      countryCode,
      headlineCorpTaxRate: data.corporateTaxRate,
      vatGstRate: data.vatGstRate,
      effectiveTaxRatePercent: effectiveTaxRate,
      estimatedAnnualTaxUSD,
      qualifyingIncentives,
      exemptionsSummary,
      taxSourceNote,
    };
  }
}
