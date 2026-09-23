import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { LabourService } from '../../services/labourService';
import { CurrencyService } from '../../services/currencyService';
import { FileText, AlertCircle } from 'lucide-react';

export const LabourView: React.FC = () => {
  const { activePlan, selectedCountryCode, currency, setSelectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const labourSummary = LabourService.assessWorkforceFeasibility(country.code, activePlan.workforce);

  const convertAndFormat = (amountUSD: number) => {
    return CurrencyService.format(
      CurrencyService.convert(amountUSD, 'USD', currency),
      currency
    );
  };

  return (
    <div>
      {/* Page Header & Country Switcher */}
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Labour Intelligence & Visa Feasibility</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Role-specific talent availability, statutory employer contributions, and foreign pass feasibility in <strong>{country.name}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['SG', 'AE', 'DE'].map((code) => {
            const c = COUNTRIES_DATA[code];
            const isSelected = selectedCountryCode === code;
            return (
              <button
                key={code}
                type="button"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--accent-blue-light)' : '#ffffff',
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onClick={() => setSelectedCountryCode(code)}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aggregate Workforce Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            PLANNED WORKFORCE
          </div>
          <div className="text-mono" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
            {labourSummary.totalEmployees} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Staff</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {labourSummary.totalLocalDesired} Local • {labourSummary.totalForeignDesired} Foreign Desired
          </div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            MONTHLY BASE PAYROLL
          </div>
          <div className="text-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '4px' }}>
            {convertAndFormat(labourSummary.monthlyBaseSalaryUSD)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Base compensation across all roles
          </div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            EMPLOYER CONTRIBUTIONS
          </div>
          <div className="text-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
            {convertAndFormat(labourSummary.monthlyEmployerContributionsUSD)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {country.code === 'SG' ? 'CPF (~17% capped)' : country.code === 'AE' ? 'Gratuity / Pension (~8%)' : 'Social Security (~20%)'}
          </div>
        </div>

        <div className="argus-card" style={{ border: '2px solid var(--accent-green)', backgroundColor: 'var(--accent-green-bg)' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 800 }}>
            TOTAL LABOUR OPEX
          </div>
          <div className="text-mono" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-green)', marginTop: '4px' }}>
            {convertAndFormat(labourSummary.totalMonthlyLabourUSD)} <span style={{ fontSize: '13px' }}>/mo</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-green)', marginTop: '4px' }}>
            Base Salary + Mandatory Benefits
          </div>
        </div>
      </div>

      {/* Role-Specific Requirements Matching Cards */}
      <div className="argus-card" style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
              Configured Roles & Local Benchmark Assessment ({country.name})
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Availability statements and salary brackets specific to the roles in your expansion plan.
            </p>
          </div>
          <span className="score-badge score-high">
            Labour Fit: {labourSummary.overallLabourFeasibility} Feasibility
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {labourSummary.roleAssessments.map((ra) => {
            const bm = LabourService.getRoleBenchmark(country.code, ra.role);
            const minFormatted = convertAndFormat(bm.monthlySalaryUSD.mid.min);
            const maxFormatted = convertAndFormat(bm.monthlySalaryUSD.mid.max);

            return (
              <div
                key={ra.roleId}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{ra.role}</strong>
                    <span className="tag-chip score-high" style={{ fontWeight: 700 }}>
                      {ra.count} {ra.count === 1 ? 'employee' : 'employees'}
                    </span>
                    <span className="tag-chip">{ra.experience} Tier</span>
                    <span className="tag-chip">{ra.preference}</span>
                  </div>

                  <span
                    className="tag-chip"
                    style={{
                      backgroundColor: bm.talentAvailability === 'High' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: bm.talentAvailability === 'High' ? 'var(--accent-green)' : 'var(--accent-amber)',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    {ra.availabilityHeadline}
                  </span>
                </div>

                <div className="grid-3" style={{ fontSize: '13px', backgroundColor: 'var(--bg-elevated)', padding: '14px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Benchmark Salary Range ({country.name})
                    </div>
                    <strong className="text-mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {minFormatted} – {maxFormatted} /mo
                    </strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Planned: {convertAndFormat(ra.monthlyAvgSalaryUSD)} /mo
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Recommended Pass / Visa
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{bm.recommendedPassType}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--accent-blue)', marginTop: '2px' }}>
                      {ra.foreignFeasibilityHeadline}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Hiring Lead Time & Difficulty
                    </div>
                    <strong style={{ color: bm.hiringDifficulty === 'Low' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      {bm.hiringDifficulty} Difficulty (approx. {bm.hiringDifficulty === 'Low' ? '2-4' : '4-8'} weeks)
                    </strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Subtotal: {convertAndFormat(ra.subtotalMonthlyUSD)} /mo
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <strong>Statutory Visa & Compliance Notes:</strong> {bm.visaNotes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Founder Relocation & Foreign Quota Risks */}
      <div className="grid-2" style={{ gap: '20px' }}>
        {/* Founder Visa Options */}
        <div className="argus-card">
          <div className="card-header-flex">
            <div className="card-title">
              <FileText size={18} color="var(--accent-blue)" />
              <span style={{ fontSize: '14px', fontWeight: 800 }}>FOUNDER RELOCATION PATHWAYS ({country.name})</span>
            </div>
          </div>

          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {country.code === 'SG' && (
              <>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>EntrePass (Singapore Founder Visa)</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Requires VC backing, proprietary IP registered with IPOS, or incubation with Enterprise Singapore partners.
                  </p>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Employment Pass (EP) via Pte Ltd Incorporation</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Self-sponsored EP for company founders with S$5,000/mo minimum qualifying salary and 40 COMPASS points.
                  </p>
                </div>
              </>
            )}

            {country.code === 'AE' && (
              <>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>10-Year Golden Visa (Founders & Tech Leaders)</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Granted to tech startup founders and senior executives without needing a corporate sponsor.
                  </p>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>5-Year Green Visa / Freezone Residency</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Immediate 2 or 3-year investor/employee visa linked to Free Zone trade license.
                  </p>
                </div>
              </>
            )}

            {country.code === 'DE' && (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>EU Blue Card (§ 18g AufenthG) & Managing Director Permit</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Fast-track work residency for managing directors and STEM/IT professionals earning €41,041+ gross annual salary.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Foreign Worker Quota Assessment */}
        <div className="argus-card">
          <div className="card-header-flex">
            <div className="card-title">
              <AlertCircle size={18} color="var(--accent-amber)" />
              <span style={{ fontSize: '14px', fontWeight: 800 }}>FOREIGN WORKER REGULATIONS</span>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              {country.code === 'SG'
                ? 'Singapore enforces strict service sector dependency ratios: S Pass foreign headcount cannot exceed 10% of total company workforce. EP candidates are evaluated under the 4-criterion COMPASS points grid.'
                : country.code === 'AE'
                ? 'UAE Freezone establishments are completely exempt from domestic workforce quotas, enabling 100% expatriate talent recruitment with rapid 5-day electronic visas.'
                : 'Germany permits frictionless hiring from the 27 EU member states. Non-EU talent utilizes the skilled immigration act (Fachkräfteeinwanderungsgesetz) with recognized university degrees.'}
            </p>

            <div
              style={{
                padding: '12px 14px',
                backgroundColor: country.code === 'SG' ? 'var(--accent-amber-bg)' : '#eff6ff',
                border: country.code === 'SG' ? '1px solid var(--accent-amber-border)' : '1px solid #bfdbfe',
                borderRadius: '6px',
                fontSize: '12px',
                color: country.code === 'SG' ? 'var(--accent-amber)' : 'var(--accent-blue)',
              }}
            >
              <strong>ARGUS Staffing Advisory:</strong>{' '}
              {country.code === 'SG'
                ? 'We recommend hiring at least 2 local resident staff early in Singapore to establish your CPF contributions baseline for S-Pass sponsorship.'
                : country.code === 'AE'
                ? 'Ensure health insurance is arranged immediately upon visa issuance to prevent MOHRE fines.'
                : 'Account for 20% employer social security on top of gross contractual salaries.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
