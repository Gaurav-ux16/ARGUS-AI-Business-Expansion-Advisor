import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import type {
  CurrencyCode,
  ExpansionObjective,
  IndustryType,
} from '../../types';
import { CurrencyService } from '../../services/currencyService';
import { Sparkles, ChevronRight } from 'lucide-react';

const PREVIOUS_ENTRIES = [
  {
    id: 'entry-1',
    companyName: 'ApexMetrics Technologies',
    industry: 'Software / SaaS',
    homeCountry: 'India',
    targetCountry: 'Singapore',
    date: '23 Sep 2026',
    budgetFormatted: '₹50 Lakhs (INR)',
    employees: 15,
  },
  {
    id: 'entry-2',
    companyName: 'Nova Logistics Global',
    industry: 'Logistics',
    homeCountry: 'India',
    targetCountry: 'United Arab Emirates',
    date: '18 Sep 2026',
    budgetFormatted: '₹40 Lakhs (INR)',
    employees: 25,
  },
  {
    id: 'entry-3',
    companyName: 'Zenith BioPharma',
    industry: 'Healthcare',
    homeCountry: 'India',
    targetCountry: 'Germany',
    date: '14 Sep 2026',
    budgetFormatted: '₹80 Lakhs (INR)',
    employees: 12,
  },
];

export const LandingPage: React.FC = () => {
  const { activePlan, updatePlan, setActiveView, setSelectedCountryCode } = usePlan();

  const [companyName, setCompanyName] = useState('ApexMetrics Technologies');
  const [currentCountry, setCurrentCountry] = useState('India');
  const [industry, setIndustry] = useState<IndustryType>('Software / SaaS');
  const [businessScale, setBusinessScale] = useState('Growing Startup (11-50 employees)');
  const [objective, setObjective] = useState<ExpansionObjective>('Enter a new market');
  const [budgetAmount, setBudgetAmount] = useState<number>(5000000);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [timeline, setTimeline] = useState('3-6 months');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usdBudget = Math.round(CurrencyService.convert(budgetAmount, currency, 'USD'));

    updatePlan({
      name: `${companyName} Expansion Plan`,
      profile: {
        ...activePlan.profile,
        name: companyName,
        currentCountry,
        industry,
        companySize: businessScale,
        expansionBudgetHomeCurrency: budgetAmount,
        expansionBudgetUSD: usdBudget,
        homeCurrency: currency,
        timeline,
      },
      objectives: [objective],
    });

    setActiveView('overview');
  };

  const handleSelectPrevious = (entry: typeof PREVIOUS_ENTRIES[0]) => {
    setCompanyName(entry.companyName);
    setIndustry(entry.industry as IndustryType);
    setCurrentCountry(entry.homeCountry);
    const code = entry.targetCountry.includes('Singapore') ? 'SG' : entry.targetCountry.includes('Emirates') ? 'AE' : 'DE';
    setSelectedCountryCode(code);

    updatePlan({
      name: `${entry.companyName} Expansion Plan`,
      targetCountryCode: code,
      profile: {
        ...activePlan.profile,
        name: entry.companyName,
        industry: entry.industry as IndustryType,
        currentCountry: entry.homeCountry,
      },
    });

    setActiveView('overview');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        padding: '48px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 62, 143, 0.08)',
            border: '1px solid rgba(0, 62, 143, 0.2)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--color-primary-blue)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <Sparkles size={13} /> ARGUS • AI BUSINESS EXPANSION ADVISOR
        </div>

        <h1
          style={{
            fontSize: '38px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            color: 'var(--color-dark-navy)',
            marginBottom: '12px',
          }}
        >
          Where should your business expand next?
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Tell ARGUS about your business. We'll turn market, cost, labour and regulatory intelligence into a personalized expansion plan.
        </p>
      </div>

      {/* Main Centered Form Card */}
      <div
        className="argus-card"
        style={{
          width: '100%',
          maxWidth: '720px',
          padding: '32px 36px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '40px',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
            CREATE NEW EXPANSION PLAN
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Calibrate official statutory requirements, foreign work passes, and 3-year OpEx models.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '18px', marginBottom: '24px' }}>
            {/* 1. Business Name */}
            <div className="form-group">
              <label className="form-label">Business / Project Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. ApexMetrics Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* 2. Current Country */}
            <div className="form-group">
              <label className="form-label">Current Country / HQ</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. India"
                value={currentCountry}
                onChange={(e) => setCurrentCountry(e.target.value)}
              />
            </div>

            {/* 3. Industry */}
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select
                className="form-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryType)}
              >
                <option value="Software / SaaS">Software / SaaS</option>
                <option value="FinTech">FinTech</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Logistics">Logistics</option>
                <option value="Consulting / Professional Services">Consulting / Professional Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="EdTech">EdTech</option>
                <option value="Food / Hospitality">Food / Hospitality</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 4. Business Scale */}
            <div className="form-group">
              <label className="form-label">Business Scale</label>
              <select
                className="form-select"
                value={businessScale}
                onChange={(e) => setBusinessScale(e.target.value)}
              >
                <option value="Early-stage (1-10 employees)">Early-stage (1–10 employees)</option>
                <option value="Growing Startup (11-50 employees)">Growing Startup (11–50 employees)</option>
                <option value="Mid-Market (51-200 employees)">Mid-Market (51–200 employees)</option>
                <option value="Enterprise (201+ employees)">Enterprise (201+ employees)</option>
              </select>
            </div>

            {/* 5. Expansion Objective */}
            <div className="form-group">
              <label className="form-label">Expansion Objective</label>
              <select
                className="form-select"
                value={objective}
                onChange={(e) => setObjective(e.target.value as ExpansionObjective)}
              >
                <option value="Enter a new market">Enter a new market</option>
                <option value="Open sales office">Open sales office</option>
                <option value="Open development centre">Open development centre</option>
                <option value="Hire employees">Hire employees</option>
                <option value="Manufacturing / production">Manufacturing / production</option>
                <option value="Retail / physical location">Retail / physical location</option>
                <option value="Regional headquarters">Regional headquarters</option>
                <option value="Import / export">Import / export</option>
                <option value="Remote operations">Remote operations</option>
              </select>
            </div>

            {/* 6. Budget */}
            <div className="form-group">
              <label className="form-label">Expansion Budget Amount</label>
              <input
                type="number"
                step="50000"
                required
                className="form-input"
                placeholder="e.g. 5000000"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* 7. Currency */}
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="SGD">SGD (S$ Singapore Dollar)</option>
                <option value="AED">AED (AED UAE Dirham)</option>
              </select>
            </div>

            {/* 8. Timeline */}
            <div className="form-group">
              <label className="form-label">Target Timeline</label>
              <select
                className="form-select"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="1-3 months">1–3 months (Urgent)</option>
                <option value="3-6 months">3–6 months (Standard Strategy)</option>
                <option value="6-12 months">6–12 months (Comprehensive)</option>
                <option value="12+ months">12+ months (Exploratory)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Build My Expansion Plan →
          </button>
        </form>
      </div>

      {/* ============================================================ */}
      {/* PREVIOUS ENTRIES HORIZONTAL CARDS                            */}
      {/* ============================================================ */}
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '12px',
          }}
        >
          PREVIOUS ENTRIES
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PREVIOUS_ENTRIES.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: '14px 18px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow-sm)',
              }}
              onClick={() => handleSelectPrevious(entry)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary-blue)';
                e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-light-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-blue)',
                    fontSize: '13px',
                    fontWeight: 800,
                  }}
                >
                  {entry.companyName[0]}
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{entry.companyName}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                    {entry.industry} • {entry.homeCountry} → <span style={{ color: 'var(--color-primary-blue)', fontWeight: 600 }}>{entry.targetCountry}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{entry.date}</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
