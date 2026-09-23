import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { ScoringEngine } from '../../services/scoringEngine';
import { CostCalculatorService } from '../../services/costCalculator';
import { CurrencyService } from '../../services/currencyService';
export const CountryComparisonView: React.FC = () => {
  const { activePlan, currency } = usePlan();
  const countries = Object.values(COUNTRIES_DATA);

  const rankedScores = ScoringEngine.rankCountries(activePlan);
  const topCode = rankedScores[0]?.countryCode || 'SG';

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>Side-by-Side Country Comparison Engine</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Comprehensive side-by-side metric comparison for candidate market destinations.
        </p>
      </div>

      <div className="argus-card" style={{ overflowX: 'auto', backgroundColor: '#FFFFFF' }}>
        <table className="argus-table">
          <thead>
            <tr>
              <th style={{ minWidth: '180px' }}>Metric / Destination</th>
              {countries.map((c) => {
                const isTop = c.code === topCode;
                return (
                  <th
                    key={c.code}
                    style={{
                      minWidth: '200px',
                      backgroundColor: isTop ? 'rgba(0, 62, 143, 0.08)' : '#F8FAFC',
                      borderBottom: isTop ? '2px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                    }}
                  >
                    <div className="flex-gap-2" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>{c.flag}</span>
                      <span style={{ fontSize: '15px', color: 'var(--color-dark-navy)', fontWeight: 800 }}>{c.name}</span>
                    </div>
                    {isTop && (
                      <span className="tag-chip" style={{ backgroundColor: 'var(--color-primary-blue)', color: '#ffffff', fontSize: '10px' }}>
                        TOP FIT FOR {activePlan.profile.industry.toUpperCase()}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Readiness Score Row */}
            <tr>
              <td><strong>Expansion Readiness Score</strong></td>
              {countries.map((c) => {
                const scoreObj = ScoringEngine.calculateCountryScore(activePlan, c);
                return (
                  <td key={c.code}>
                    <span className={`score-badge ${scoreObj.readinessScore >= 80 ? 'score-high' : 'score-medium'}`}>
                      {scoreObj.readinessScore} / 100
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Est 1st Year Cost */}
            <tr>
              <td><strong>Est. 1st Year Cost ({currency})</strong></td>
              {countries.map((c) => {
                const costs = CostCalculatorService.calculatePlanCosts(activePlan, c);
                const formatted = CurrencyService.format(
                  CurrencyService.convert(costs.firstYearTotalUSD, 'USD', currency),
                  currency,
                  true
                );
                return <td key={c.code} className="text-mono" style={{ fontWeight: 700 }}>{formatted}</td>;
              })}
            </tr>

            {/* Corporate Tax Rate */}
            <tr>
              <td><strong>Corporate Tax Rate</strong></td>
              {countries.map((c) => (
                <td key={c.code} style={{ fontWeight: 700, color: c.corporateTaxRate <= 17 ? 'var(--color-primary-blue)' : 'var(--text-primary)' }}>
                  {c.corporateTaxRate}%
                </td>
              ))}
            </tr>

            {/* Foreign Ownership */}
            <tr>
              <td><strong>Foreign Ownership</strong></td>
              {countries.map((c) => (
                <td key={c.code} style={{ fontSize: '12px' }}>{c.foreignOwnership}</td>
              ))}
            </tr>

            {/* Setup Complexity */}
            <tr>
              <td><strong>Business Setup Complexity</strong></td>
              {countries.map((c) => (
                <td key={c.code}>
                  <span className={`tag-chip ${c.businessSetupComplexity === 'Low' ? 'score-high' : ''}`}>
                    {c.businessSetupComplexity}
                  </span>
                </td>
              ))}
            </tr>

            {/* Talent Availability */}
            <tr>
              <td><strong>Talent Availability</strong></td>
              {countries.map((c) => (
                <td key={c.code} style={{ fontWeight: 700 }}>{c.talentAvailability}</td>
              ))}
            </tr>

            {/* Banking Setup Ease */}
            <tr>
              <td><strong>Banking Account Setup</strong></td>
              {countries.map((c) => (
                <td key={c.code}>{c.bankingEase}</td>
              ))}
            </tr>

            {/* Data Protection Law */}
            <tr>
              <td><strong>Data Privacy Regulation</strong></td>
              {countries.map((c) => (
                <td key={c.code} style={{ fontSize: '12px' }}>{c.dataPrivacy.lawName}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
