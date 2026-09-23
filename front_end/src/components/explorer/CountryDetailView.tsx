import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { ScoringEngine } from '../../services/scoringEngine';
import { CostCalculatorService } from '../../services/costCalculator';
import { CurrencyService } from '../../services/currencyService';
import { ArrowLeft, CheckCircle, ShieldAlert, ExternalLink } from 'lucide-react';

interface Props {
  countryCode: string;
  onBack: () => void;
}

export const CountryDetailView: React.FC<Props> = ({ countryCode, onBack }) => {
  const { activePlan, currency } = usePlan();
  const [activeTab, setActiveTab] = useState('overview');

  const country = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA['SG'];
  const scoreObj = ScoringEngine.calculateCountryScore(activePlan, country);
  const costs = CostCalculatorService.calculatePlanCosts(activePlan, country);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'market', label: 'Market' },
    { id: 'costs', label: 'Costs' },
    { id: 'labour', label: 'Labour' },
    { id: 'tax', label: 'Tax' },
    { id: 'regulations', label: 'Regulations' },
    { id: 'setup', label: 'Business Setup' },
    { id: 'banking', label: 'Banking' },
    { id: 'trade', label: 'Trade & Logistics' },
    { id: 'risk', label: 'Risk' },
    { id: 'roadmap', label: 'Roadmap' },
  ];

  return (
    <div>
      <button className="btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Country Explorer
      </button>

      {/* Header Banner */}
      <div
        className="argus-card"
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #0b132b 0%, #1e293b 100%)',
          color: '#ffffff',
        }}
      >
        <div className="flex-between">
          <div className="flex-gap-4">
            <span style={{ fontSize: '48px' }}>{country.flag}</span>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{country.name}</h1>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                {country.region} • {country.foreignOwnership}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              EXPANSION READINESS
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-blue)', fontFamily: 'var(--font-mono)' }}>
              {scoreObj.readinessScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === t.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          <div className="argus-card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Executive Country Summary</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {country.overviewText}
            </p>

            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Key Advantages</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {scoreObj.keyAdvantages.map((adv, i) => (
                <div key={i} className="flex-gap-2" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  <CheckCircle size={16} color="var(--accent-green)" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Key Challenges</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scoreObj.keyChallenges.map((ch, i) => (
                <div key={i} className="flex-gap-2" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  <ShieldAlert size={16} color="var(--accent-amber)" />
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="argus-card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Key Country Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div className="flex-between"><span>Corporate Tax:</span><strong>{country.corporateTaxRate}%</strong></div>
              <div className="flex-between"><span>VAT / GST Rate:</span><strong>{country.vatGstRate}%</strong></div>
              <div className="flex-between"><span>Setup Complexity:</span><strong>{country.businessSetupComplexity}</strong></div>
              <div className="flex-between"><span>Talent Availability:</span><strong>{country.talentAvailability}</strong></div>
              <div className="flex-between"><span>Data Confidence Score:</span><strong style={{ color: 'var(--accent-green)' }}>{country.dataConfidenceScore}%</strong></div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Official Authorities & Sources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {country.officialSources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '12px', color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>{src.name} ({src.type})</span>
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Market */}
      {activeTab === 'market' && (
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Market Intelligence & Ecosystem</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            {country.name} represents a {country.marketPotential} market potential for {activePlan.profile.industry} software platforms with rapid digital adoption.
          </p>
          <div className="grid-3">
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Technology Market</div>
              <strong style={{ fontSize: '18px', color: 'var(--accent-blue)' }}>HIGH</strong>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Digital Adoption</div>
              <strong style={{ fontSize: '18px', color: 'var(--accent-green)' }}>VERY HIGH</strong>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Startup Ecosystem</div>
              <strong style={{ fontSize: '18px', color: '#8b5cf6' }}>WORLD CLASS</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Costs */}
      {activeTab === 'costs' && (
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Financial Estimates in {currency}</h3>
          <table className="argus-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Item</th>
                <th>Official Govt Fee</th>
                <th>Est. Business Cost</th>
              </tr>
            </thead>
            <tbody>
              {costs.items.map((item, i) => (
                <tr key={i}>
                  <td><strong>{item.category}</strong></td>
                  <td>{item.item}</td>
                  <td>{item.officialFeeUSD > 0 ? CurrencyService.format(CurrencyService.convert(item.officialFeeUSD, 'USD', currency), currency) : '—'}</td>
                  <td>{item.estimatedBusinessCostUSD > 0 ? CurrencyService.format(CurrencyService.convert(item.estimatedBusinessCostUSD, 'USD', currency), currency) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Labour */}
      {activeTab === 'labour' && (
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Workforce & Visas ({country.name})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {country.labourMetrics.map((l, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{l.roleCategory}</strong>
                  <span className="tag-chip">{l.foreignWorkerPassType}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <strong>Quota & Levy:</strong> {l.quotaOrLevyDetails}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Tax */}
      {activeTab === 'tax' && (
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Tax Environment</h3>
          <div className="grid-2" style={{ marginBottom: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Corporate Tax</div>
              <strong style={{ fontSize: '24px', color: 'var(--accent-blue)' }}>{country.tax.corporateTaxRate}%</strong>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VAT / GST</div>
              <strong style={{ fontSize: '24px', color: 'var(--accent-green)' }}>{country.tax.headlineVatGstRate}%</strong>
            </div>
          </div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Available Incentives</h4>
          <ul>
            {country.tax.startupIncentives.map((inc, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                • {inc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 6: Regulations */}
      {activeTab === 'regulations' && (
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Data Protection & Compliance</h3>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--border-subtle)' }}>
            <p><strong>Law:</strong> {country.dataPrivacy.lawName}</p>
            <p style={{ marginTop: '8px' }}><strong>DPO Requirement:</strong> {country.dataPrivacy.dpoRequirement}</p>
            <p style={{ marginTop: '8px' }}><strong>Cross Border Rules:</strong> {country.dataPrivacy.crossBorderTransferRules}</p>
          </div>
        </div>
      )}

      {/* Tab 7: Setup */}
      {activeTab === 'setup' && (
        <div className="argus-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Available Entity Structures</h3>
          <table className="argus-table">
            <thead>
              <tr>
                <th>Structure</th>
                <th>Legal Status</th>
                <th>Foreign Ownership</th>
                <th>Official Reg Fee</th>
              </tr>
            </thead>
            <tbody>
              {country.businessStructures.map((bs, i) => (
                <tr key={i}>
                  <td><strong>{bs.name}</strong></td>
                  <td>{bs.legalStatus}</td>
                  <td>{bs.foreignOwnership}</td>
                  <td>{CurrencyService.format(CurrencyService.convert(bs.officialRegFeeUSD, 'USD', currency), currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
