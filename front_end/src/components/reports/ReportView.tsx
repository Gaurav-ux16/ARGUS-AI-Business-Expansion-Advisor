import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { ScoringEngine } from '../../services/scoringEngine';
import { CostCalculatorService } from '../../services/costCalculator';
import { CurrencyService } from '../../services/currencyService';
import { Printer, Download } from 'lucide-react';

export const ReportView: React.FC = () => {
  const { activePlan, currency, selectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const scoreObj = ScoringEngine.calculateCountryScore(activePlan, country);
  const costs = CostCalculatorService.calculatePlanCosts(activePlan, country);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Expansion Decision Report Generator</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Comprehensive investment-grade expansion report for <strong>{activePlan.profile.name}</strong>.
          </p>
        </div>

        <div className="flex-gap-2">
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Download size={16} /> Download Full Report (.PDF)
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div
        className="argus-card"
        style={{
          padding: '48px',
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '960px',
          margin: '0 auto',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Report Header Branding */}
        <div className="flex-between" style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '1px' }}>ARGUS</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              GLOBAL EXPANSION STRATEGY & DECISION REPORT
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div>Date: {activePlan.updatedAt}</div>
            <div>Prepared for: <strong style={{ color: 'var(--text-primary)' }}>{activePlan.profile.name}</strong></div>
            <div>Target Destination: <strong style={{ color: 'var(--text-primary)' }}>{country.name} ({country.flag})</strong></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            1. Executive Summary
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            This strategic report evaluates overseas expansion for <strong>{activePlan.profile.name}</strong> ({activePlan.profile.industry}, {activePlan.profile.businessModel}) from {activePlan.profile.currentCountry}. Based on your expansion budget of <strong>{CurrencyService.format(activePlan.profile.expansionBudgetHomeCurrency, activePlan.profile.homeCurrency)}</strong> and workforce requirement of <strong>{activePlan.workforce.reduce((a, b) => a + b.count, 0)} employees</strong>, <strong>{country.name}</strong> is designated as your #1 target market destination with an Expansion Readiness Score of <strong>{scoreObj.readinessScore}/100</strong>.
          </p>
        </div>

        {/* Section 2: Country Score & Factors */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            2. Expansion Readiness Score & Explainable Factors
          </h2>
          <div className="flex-between" style={{ backgroundColor: 'var(--bg-elevated)', padding: '16px', borderRadius: '6px', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Overall Readiness Rating:</span>
            <span className="score-badge score-high score-badge-lg">{scoreObj.readinessScore} / 100</span>
          </div>

          <table className="argus-table">
            <thead>
              <tr>
                <th>Factor Category</th>
                <th>Contribution</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {scoreObj.factors.map((f, i) => (
                <tr key={i}>
                  <td><strong>{f.category}</strong></td>
                  <td className="text-mono" style={{ color: f.scoreContribution >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
                    {f.scoreContribution >= 0 ? `+${f.scoreContribution}` : `${f.scoreContribution}`} pts
                  </td>
                  <td style={{ fontSize: '12px' }}>{f.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Cost Analysis */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            3. Financial Cost Breakdown ({currency})
          </h2>
          <div className="grid-3" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Initial Setup</div>
              <strong className="text-mono" style={{ color: 'var(--text-primary)' }}>{CurrencyService.format(CurrencyService.convert(costs.initialSetupUSD, 'USD', currency), currency)}</strong>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monthly OpEx</div>
              <strong className="text-mono" style={{ color: 'var(--text-primary)' }}>{CurrencyService.format(CurrencyService.convert(costs.monthlyOperatingUSD, 'USD', currency), currency)}</strong>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 700 }}>1st Year Total</div>
              <strong className="text-mono" style={{ color: 'var(--accent-green)' }}>{CurrencyService.format(CurrencyService.convert(costs.firstYearTotalUSD, 'USD', currency), currency)}</strong>
            </div>
          </div>
        </div>

        {/* Section 4: Sources & Disclaimer */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div className="flex-between">
            <span>Official Sources: ACRA Singapore, IRAS Tax Authority, MOM Singapore, World Bank.</span>
            <span>Generated by ARGUS AI Business Expansion Advisor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
