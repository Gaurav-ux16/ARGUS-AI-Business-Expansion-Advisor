import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { CheckCircle } from 'lucide-react';

export const TaxView: React.FC = () => {
  const { selectedCountryCode, activePlan } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>Tax & Finance Dashboard</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Corporate tax rates, GST/VAT obligations, double-taxation relief (DTAA), and startup tax incentives for <strong>{country.name}</strong>.
        </p>
      </div>

      <DisclaimerBanner countryCode={country.code} />

      {/* Tax Grid Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            HEADLINE CORPORATE TAX
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-blue)' }} className="text-mono">
            {country.corporateTaxRate}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {country.code === 'SG' ? 'Partial exemptions available' : country.code === 'AE' ? '0% up to AED 375K' : '30% effective rate'}
          </div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            VAT / GST RATE
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-golden-brown)' }} className="text-mono">
            {country.vatGstRate}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Applied on local sales
          </div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            WITHHOLDING TAX (DIVIDENDS)
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-golden-brown)' }} className="text-mono">
            {country.tax.withholdingTaxDividend}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            0% dividend tax to parent entity
          </div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            TAX COMPLEXITY RATING
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
            {country.tax.taxComplexity}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            IRAS / Tax Authority Rating
          </div>
        </div>
      </div>

      {/* Tax Impact Breakdown */}
      <div className="grid-2">
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-dark-navy)', marginBottom: '12px' }}>
            How Tax Affects {activePlan.profile.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            {country.tax.taxImpactSummary}
          </p>

          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-dark-navy)', marginBottom: '8px' }}>Key Tax Exemptions & Schemes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {country.tax.startupIncentives.map((inc, i) => (
              <div key={i} className="flex-gap-2" style={{ fontSize: '13px' }}>
                <CheckCircle size={16} color="var(--color-primary-blue)" />
                <span>{inc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-dark-navy)', marginBottom: '12px' }}>Double Taxation Avoidance Agreement (DTAA)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            {country.name} maintains a comprehensive DTAA treaty with {activePlan.profile.currentCountry}. Profits earned by your {country.name} entity can be repatriated without double taxation.
          </p>

          <div className="card-financial" style={{ padding: '12px 16px', borderRadius: '6px', fontSize: '12px' }}>
            <strong>Official Source:</strong> Inland Revenue Authority / Treaty Register.
          </div>
        </div>
      </div>
    </div>
  );
};
