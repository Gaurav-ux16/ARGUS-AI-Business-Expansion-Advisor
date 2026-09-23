import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { ScoringEngine } from '../../services/scoringEngine';
import { CostCalculatorService } from '../../services/costCalculator';
import { CurrencyService } from '../../services/currencyService';
import { LabourService } from '../../services/labourService';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ExplainScoreModal } from './ExplainScoreModal';
import {
  ArrowRight,
  Sparkles,
  Map,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    activePlan,
    currency,
    selectedCountryCode,
    setSelectedCountryCode,
    setActiveView,
    setIsExplainModalOpen,
  } = usePlan();

  const rankedScores = ScoringEngine.rankCountries(activePlan);
  const topMatch = rankedScores[0] || rankedScores.find((s) => s.countryCode === 'SG') || rankedScores[0];
  const targetCountryData = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA[topMatch.countryCode] || COUNTRIES_DATA['SG'];
  const costs = CostCalculatorService.calculatePlanCosts(activePlan, targetCountryData);
  const totalEmployees = activePlan.workforce.reduce((s, w) => s + w.count, 0);

  const convertAndFormat = (amountUSD: number, compact: boolean = false) => {
    return CurrencyService.format(
      CurrencyService.convert(amountUSD, 'USD', currency),
      currency,
      compact
    );
  };

  const factorWeights = activePlan.factorWeights || {
    market: 20,
    cost: 25,
    labour: 25,
    businessEnvironment: 10,
    regulatory: 15,
    risk: 5,
  };

  return (
    <div>
      <DisclaimerBanner countryCode={targetCountryData.code} />

      {/* ============================================================ */}
      {/* 1. LARGE HERO CARD: "EXPANSION INTELLIGENCE"                  */}
      {/* ============================================================ */}
      <div
        className="argus-card-hero"
        style={{
          marginBottom: '24px',
        }}
      >
        <div className="flex-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--color-primary-blue)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              <Sparkles size={13} /> EXPANSION INTELLIGENCE
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-dark-navy)', letterSpacing: '-0.3px' }}>
              {activePlan.profile.name}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {activePlan.profile.currentCountry} → Global Expansion
            </div>
          </div>

          {/* Visual Readiness Score Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                EXPANSION READINESS
              </div>
              <div className="text-mono" style={{ fontSize: '38px', fontWeight: 900, color: 'var(--color-primary-blue)', lineHeight: 1.1 }}>
                {topMatch.readinessScore} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>

            {/* Circular Progress Indicator with #003E8F and #ADD0FF */}
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="26" stroke="#ADD0FF" strokeWidth="6" fill="none" opacity="0.5" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#003E8F"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * topMatch.readinessScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'var(--color-primary-blue)',
                }}
              >
                {topMatch.readinessScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Profile Pill Details Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'var(--bg-card-subtle)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '16px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--color-dark-navy)', fontWeight: 600 }}>{activePlan.profile.industry}</span>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>{activePlan.profile.companySize}</span>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Budget: <strong className="text-mono" style={{ color: 'var(--color-golden-brown)' }}>
              {CurrencyService.format(activePlan.profile.expansionBudgetHomeCurrency, activePlan.profile.homeCurrency)}
            </strong>
          </span>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Workforce: <strong style={{ color: 'var(--color-primary-blue)' }}>{totalEmployees} Employees</strong> across {activePlan.workforce.length} Roles
          </span>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>Timeline: {activePlan.profile.timeline}</span>
        </div>

        {/* Recommended Country Callout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
              {COUNTRIES_DATA[topMatch.countryCode]?.flag} {topMatch.countryName}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Strong fit based on your business profile, workforce requirements and selected priorities.
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => {
              setSelectedCountryCode(topMatch.countryCode);
              setIsExplainModalOpen(true);
            }}
          >
            Explain Score →
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. OVERVIEW CARDS (COMPACT GRID WITH "VIEW DETAILS →")       */}
      {/* ============================================================ */}
      <div className="grid-6" style={{ marginBottom: '24px' }}>
        {/* Card 1: Country Fit */}
        <div className="metric-box">
          <div>
            <div className="metric-label">COUNTRY FIT</div>
            <div className="metric-val" style={{ fontSize: '20px' }}>
              {targetCountryData.name}
            </div>
            <div className="metric-sub">{topMatch.readinessScore} / 100 Score</div>
          </div>
          <button type="button" className="metric-link" onClick={() => setActiveView('comparison')}>
            View Details →
          </button>
        </div>

        {/* Card 2: Estimated First Year */}
        <div className="metric-box">
          <div>
            <div className="metric-label">ESTIMATED FIRST YEAR</div>
            <div className="metric-val metric-val-gold" style={{ fontSize: '20px' }}>
              {convertAndFormat(costs.firstYearTotalUSD, true)}
            </div>
            <div className="metric-sub">Setup + 12m OpEx</div>
          </div>
          <button type="button" className="metric-link" onClick={() => setActiveView('costs')}>
            View Details →
          </button>
        </div>

        {/* Card 3: Workforce */}
        <div className="metric-box">
          <div>
            <div className="metric-label">WORKFORCE</div>
            <div className="metric-val metric-val-navy" style={{ fontSize: '20px' }}>
              {totalEmployees} Staff
            </div>
            <div className="metric-sub">{activePlan.workforce.length} Configured Roles</div>
          </div>
          <button type="button" className="metric-link" onClick={() => setActiveView('labour')}>
            View Details →
          </button>
        </div>

        {/* Card 4: Monthly Operating Cost */}
        <div className="metric-box">
          <div>
            <div className="metric-label">MONTHLY OPERATING</div>
            <div className="metric-val metric-val-gold" style={{ fontSize: '20px' }}>
              {convertAndFormat(costs.monthlyOperatingUSD, true)}
            </div>
            <div className="metric-sub">Payroll, Rent & Retainers</div>
          </div>
          <button type="button" className="metric-link" onClick={() => setActiveView('costs')}>
            View Details →
          </button>
        </div>

        {/* Card 5: Market Fit */}
        <div className="metric-box">
          <div>
            <div className="metric-label">MARKET FIT</div>
            <div className="metric-val" style={{ fontSize: '20px' }}>
              {topMatch.metrics.marketFit >= 16 ? 'High' : 'Moderate'}
            </div>
            <div className="metric-sub">{topMatch.metrics.marketFit}/20 Ecosystem Alignment</div>
          </div>
          <button type="button" className="metric-link" onClick={() => setActiveView('market')}>
            View Details →
          </button>
        </div>

        {/* Card 6: Regulatory Status */}
        <div className="metric-box">
          <div>
            <div className="metric-label">REGULATORY STATUS</div>
            <div className="metric-val" style={{ fontSize: '18px' }}>
              RAG Available
            </div>
            <div className="metric-sub">Verified Statutory Sources</div>
          </div>
          <button type="button" className="metric-link" onClick={() => setActiveView('regulations')}>
            View Details →
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. COUNTRY COMPARISON: "COUNTRY LANDSCAPE"                    */}
      {/* ============================================================ */}
      <div className="argus-card" style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              MULTI-MARKET SUITABILITY
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
              COUNTRY LANDSCAPE
            </h2>
          </div>
          <button type="button" className="btn-secondary btn-sm" onClick={() => setActiveView('comparison')}>
            Compare →
          </button>
        </div>

        <div className="grid-3" style={{ gap: '14px' }}>
          {rankedScores.map((sc) => {
            const c = COUNTRIES_DATA[sc.countryCode];
            const isTarget = selectedCountryCode === sc.countryCode;

            // Country visual accent role as specified:
            // Singapore: Primary blue (#003E8F)
            // UAE: Golden-brown (#8F5E01)
            // Germany: Light-blue (#ADD0FF)
            const accentColor =
              sc.countryCode === 'SG'
                ? '#003E8F'
                : sc.countryCode === 'AE'
                ? '#8F5E01'
                : '#ADD0FF';

            const scoreColor = sc.countryCode === 'DE' ? '#003E8F' : accentColor;

            return (
              <div
                key={sc.countryCode}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: isTarget ? `2px solid ${accentColor}` : '1px solid var(--border-color)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: isTarget ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}
                onClick={() => setSelectedCountryCode(sc.countryCode)}
              >
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{c.flag}</span>
                    <div>
                      <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{c.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.region}</div>
                    </div>
                  </div>
                  <div className="text-mono" style={{ fontSize: '22px', fontWeight: 900, color: scoreColor }}>
                    {sc.readinessScore}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
                  <span
                    className="tag-chip"
                    style={{
                      fontSize: '10px',
                      backgroundColor: 'rgba(0, 62, 143, 0.08)',
                      color: 'var(--color-primary-blue)',
                      borderColor: 'rgba(0, 62, 143, 0.2)',
                    }}
                  >
                    {sc.metrics.labourFit >= 16 ? 'High Labour Fit' : 'Medium Labour Fit'}
                  </span>
                  <span className="tag-chip" style={{ fontSize: '10px' }}>
                    {c.corporateTaxRate <= 10 ? 'Low Tax (9%)' : c.corporateTaxRate <= 17 ? 'Medium Cost' : 'Higher Cost'}
                  </span>
                  <span
                    className="tag-chip"
                    style={{
                      fontSize: '10px',
                      backgroundColor: 'rgba(173, 208, 255, 0.3)',
                      color: 'var(--color-primary-blue)',
                      borderColor: 'rgba(0, 62, 143, 0.2)',
                      fontWeight: 700,
                    }}
                  >
                    ● RAG Available
                  </span>
                </div>

                <div className="flex-between" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>First Year Est:</span>
                  <span className="text-mono" style={{ fontWeight: 700, color: 'var(--color-golden-brown)' }}>
                    {convertAndFormat(CostCalculatorService.calculatePlanCosts(activePlan, c).firstYearTotalUSD, true)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. COST SECTION: "WHAT WILL IT COST?"                        */}
      {/* ============================================================ */}
      <div className="argus-card" style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-golden-brown)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              FINANCIAL INTELLIGENCE
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
              WHAT WILL IT COST? ({targetCountryData.name})
            </h2>
          </div>
          <button type="button" className="btn-secondary btn-sm" onClick={() => setActiveView('costs')}>
            Full Breakdown →
          </button>
        </div>

        {/* 3 Top Financial Cards with #FFF2D3 background and #8F5E01 accent */}
        <div className="grid-3" style={{ gap: '14px', marginBottom: '18px' }}>
          <div className="card-financial" style={{ padding: '16px', borderRadius: '8px' }}>
            <div className="metric-label" style={{ color: 'var(--color-dark-brown)' }}>INITIAL SETUP</div>
            <div className="text-mono metric-val metric-val-gold" style={{ fontSize: '22px' }}>
              {convertAndFormat(costs.initialSetupUSD)}
            </div>
            <div className="metric-sub" style={{ color: 'var(--text-secondary)' }}>Registration, Licences & Deposit</div>
          </div>

          <div className="card-financial" style={{ padding: '16px', borderRadius: '8px' }}>
            <div className="metric-label" style={{ color: 'var(--color-dark-brown)' }}>MONTHLY OPERATING</div>
            <div className="text-mono metric-val metric-val-gold" style={{ fontSize: '22px' }}>
              {convertAndFormat(costs.monthlyOperatingUSD)} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/mo</span>
            </div>
            <div className="metric-sub" style={{ color: 'var(--text-secondary)' }}>Payroll, Rent & Compliance Retainers</div>
          </div>

          <div className="card-financial" style={{ padding: '16px', borderRadius: '8px' }}>
            <div className="metric-label" style={{ color: 'var(--color-dark-brown)' }}>FIRST YEAR ESTIMATE</div>
            <div className="text-mono metric-val metric-val-gold" style={{ fontSize: '22px' }}>
              {convertAndFormat(costs.firstYearTotalUSD)}
            </div>
            <div className="metric-sub" style={{ color: 'var(--text-secondary)' }}>Setup + 12 Months Run-rate</div>
          </div>
        </div>

        {/* Horizontal Line-Item Breakdown Pills */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            EXPENSE ALLOCATION BY CATEGORY
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { label: 'Registration', amt: costs.items.find((i) => i.id === 'setup_reg')?.amountUSD || 300 },
              { label: 'Office Lease', amt: (costs.items.find((i) => i.id === 'office_rent')?.amountUSD || 1200) * 12 },
              { label: 'Employees', amt: (costs.items.find((i) => i.id === 'emp_payroll')?.amountUSD || 5000) * 12 },
              { label: 'Visa / Work Pass', amt: costs.items.find((i) => i.id === 'foreign_visa_fee')?.amountUSD || 1000 },
              { label: 'Tax Provision', amt: costs.items.find((i) => i.id === 'tax_annual')?.amountUSD || 2000 },
              { label: 'Insurance', amt: (costs.items.find((i) => i.id === 'emp_insurance')?.amountUSD || 300) * 12 },
              { label: 'Technology', amt: (costs.items.find((i) => i.id === 'office_soft')?.amountUSD || 400) * 12 },
              { label: 'Operations & Acct', amt: (costs.items.find((i) => i.id === 'office_acct')?.amountUSD || 350) * 12 },
            ].map((cat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{cat.label}:</span>
                <strong className="text-mono" style={{ color: 'var(--color-golden-brown)' }}>
                  {convertAndFormat(cat.amt, true)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* DOMINANT TOTAL FIRST-YEAR NUMBER WITH WARM GOLD HIGHLIGHT */}
        <div
          className="card-highlight"
          style={{
            padding: '18px 24px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-dark-brown)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TOTAL FIRST-YEAR EXPANSION COST
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-dark-navy)', marginTop: '2px', opacity: 0.85 }}>
              Formula verified: Initial Setup + (Monthly Operating × 12) + Statutory Tax.
            </div>
          </div>
          <div className="text-mono" style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-golden-brown)' }}>
            {convertAndFormat(costs.firstYearTotalUSD)}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. LABOUR SECTION ("WHO DO YOU NEED?") + 6. FACTORS           */}
      {/* ============================================================ */}
      <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
        {/* LABOUR SECTION */}
        <div className="argus-card">
          <div className="flex-between" style={{ marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                STAFFING REQUIREMENTS
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
                WHO DO YOU NEED? ({targetCountryData.name})
              </h2>
            </div>
            <button type="button" className="btn-secondary btn-sm" onClick={() => setActiveView('labour')}>
              View Details →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activePlan.workforce.map((w) => {
              const bm = LabourService.getRoleBenchmark(targetCountryData.code, w.role);
              return (
                <div
                  key={w.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="flex-between">
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{w.role}</strong>
                      <span
                        className="tag-chip"
                        style={{
                          marginLeft: '8px',
                          fontSize: '10px',
                          backgroundColor: 'rgba(0, 62, 143, 0.08)',
                          color: 'var(--color-primary-blue)',
                          borderColor: 'rgba(0, 62, 143, 0.2)',
                          fontWeight: 700,
                        }}
                      >
                        {w.count} Required
                      </span>
                    </div>
                    <span className="tag-chip" style={{ fontSize: '10px', backgroundColor: 'var(--color-light-blue)', color: 'var(--color-dark-navy)', borderColor: 'rgba(0, 62, 143, 0.2)' }}>
                      {w.preference}
                    </span>
                  </div>

                  <div className="grid-3" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <div>
                      Talent Availability: <strong style={{ color: 'var(--color-primary-blue)' }}>{bm.talentAvailability}</strong>
                    </div>
                    <div>
                      Est. Salary: <strong className="text-mono" style={{ color: 'var(--color-dark-navy)' }}>{convertAndFormat(w.salaryExpectationMonthlyUSD)}/mo</strong>
                    </div>
                    <div>
                      Hiring Difficulty: <strong style={{ color: bm.hiringDifficulty === 'Low' ? 'var(--color-primary-blue)' : 'var(--color-golden-brown)' }}>{bm.hiringDifficulty}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FACTORS SECTION ("WHAT MATTERS TO YOU?") */}
        <div className="argus-card">
          <div className="flex-between" style={{ marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                PRIORITY WEIGHT SYSTEM
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
                WHAT MATTERS TO YOU?
              </h2>
            </div>
            <button type="button" className="btn-secondary btn-sm" onClick={() => setActiveView('factors')}>
              Edit Priorities →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Labour Availability', pct: factorWeights.labour, color: '#003E8F' },
              { label: 'Cost Efficiency', pct: factorWeights.cost, color: '#8F5E01' },
              { label: 'Market Potential', pct: factorWeights.market, color: '#003E8F' },
              { label: 'Regulation & Compliance', pct: factorWeights.regulatory, color: '#4F3B15' },
              { label: 'Institutional Risk', pct: factorWeights.risk, color: '#8F5E01' },
              { label: 'Infrastructure & Banking', pct: factorWeights.businessEnvironment, color: '#ADD0FF' },
            ].map((f, i) => (
              <div key={i}>
                <div className="flex-between" style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{f.label}</span>
                  <span className="text-mono" style={{ fontWeight: 800, color: f.color === '#ADD0FF' ? '#003E8F' : f.color }}>
                    {f.pct}%
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${f.pct}%`,
                      backgroundColor: f.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Weights calibrated to 100%. Calibrates personalized readiness scoring.
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. RAG SECTION: "REGULATORY INTELLIGENCE"                     */}
      {/* ============================================================ */}
      <div className="argus-card" style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              GROUNDED STATUTORY ADVISORY
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
              REGULATORY INTELLIGENCE
            </h2>
          </div>

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setActiveView('regulations')}
          >
            Ask about {targetCountryData.name} regulations →
          </button>
        </div>

        <div className="grid-3" style={{ gap: '14px' }}>
          {/* Singapore RAG Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--color-dark-navy)' }}>🇸🇬 SINGAPORE</strong>
              <span
                className="tag-chip"
                style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(0, 62, 143, 0.08)',
                  color: 'var(--color-primary-blue)',
                  borderColor: 'rgba(0, 62, 143, 0.25)',
                  fontWeight: 700,
                }}
              >
                ● RAG AVAILABLE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              4 Verified Official Knowledge Sources
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary-blue)' }}>ACRA</strong>
                <div style={{ color: 'var(--text-muted)' }}>Biz Registration</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary-blue)' }}>IRAS</strong>
                <div style={{ color: 'var(--text-muted)' }}>Corporate Tax</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-golden-brown)' }}>MOM</strong>
                <div style={{ color: 'var(--text-muted)' }}>Work Passes (EP)</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-dark-brown)' }}>PDPC</strong>
                <div style={{ color: 'var(--text-muted)' }}>Data Protection</div>
              </div>
            </div>
          </div>

          {/* UAE RAG Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--color-dark-navy)' }}>🇦🇪 UAE</strong>
              <span
                className="tag-chip"
                style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(0, 62, 143, 0.08)',
                  color: 'var(--color-primary-blue)',
                  borderColor: 'rgba(0, 62, 143, 0.25)',
                  fontWeight: 700,
                }}
              >
                ● RAG AVAILABLE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              3 Verified Statutory Sources
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-golden-brown)' }}>FTA</strong>
                <div style={{ color: 'var(--text-muted)' }}>Corporate Tax Law</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary-blue)' }}>MOEC</strong>
                <div style={{ color: 'var(--text-muted)' }}>Commercial Licences</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-golden-brown)' }}>MOHRE</strong>
                <div style={{ color: 'var(--text-muted)' }}>Labour & Visas</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-dark-brown)' }}>Freezone</strong>
                <div style={{ color: 'var(--text-muted)' }}>DIFC / DMCC Rules</div>
              </div>
            </div>
          </div>

          {/* Germany RAG Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--color-dark-navy)' }}>🇩🇪 GERMANY</strong>
              <span
                className="tag-chip"
                style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(0, 62, 143, 0.08)',
                  color: 'var(--color-primary-blue)',
                  borderColor: 'rgba(0, 62, 143, 0.25)',
                  fontWeight: 700,
                }}
              >
                ● RAG AVAILABLE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              3 Verified Statutory Sources
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary-blue)' }}>Handelsregister</strong>
                <div style={{ color: 'var(--text-muted)' }}>GmbH Register</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-golden-brown)' }}>BZSt</strong>
                <div style={{ color: 'var(--text-muted)' }}>Federal Tax Office</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary-blue)' }}>BAMF</strong>
                <div style={{ color: 'var(--text-muted)' }}>EU Blue Card (§18g)</div>
              </div>
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-dark-brown)' }}>BfDI</strong>
                <div style={{ color: 'var(--text-muted)' }}>EU GDPR Authority</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. COMPETITOR MAP SHORTCUT BANNER                            */}
      {/* ============================================================ */}
      <div
        className="argus-card"
        style={{
          marginBottom: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setActiveView('competitors')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-light-blue)',
              color: 'var(--color-primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Map size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
              Explore Interactive Competitor & Ecosystem Map
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Visualize industry clusters, innovation zones, and peer entities in {targetCountryData.name}.
            </p>
          </div>
        </div>

        <button type="button" className="btn-secondary btn-sm" style={{ gap: '6px' }}>
          Launch Map View <ArrowRight size={14} />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 9. EXPANSION ROADMAP TIMELINE SHORTCUT                        */}
      {/* ============================================================ */}
      <div className="argus-card">
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              EXECUTION PHASING
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
              7-STEP STATUTORY ROADMAP
            </h2>
          </div>
          <button type="button" className="btn-secondary btn-sm" onClick={() => setActiveView('roadmap')}>
            Full Roadmap Timeline →
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { step: '1', title: 'Market Validation' },
            { step: '2', title: 'Business Reg' },
            { step: '3', title: 'Banking & Finance' },
            { step: '4', title: 'Hiring' },
            { step: '5', title: 'Licensing' },
            { step: '6', title: 'Operations' },
            { step: '7', title: 'Launch' },
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? 'var(--color-primary-blue)' : 'var(--bg-card-subtle)',
                    color: idx === 0 ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 6px',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: idx === 0 ? '2px solid var(--color-light-blue)' : '1px solid var(--border-color)',
                  }}
                >
                  {item.step}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: idx === 0 ? 'var(--color-primary-blue)' : 'var(--text-muted)' }}>
                  {item.title}
                </div>
              </div>
              {idx < 6 && (
                <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--border-color)', minWidth: '20px' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <ExplainScoreModal />
    </div>
  );
};
