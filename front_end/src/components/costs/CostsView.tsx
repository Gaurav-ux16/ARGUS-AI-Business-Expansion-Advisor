import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { CostCalculatorService } from '../../services/costCalculator';
import { CurrencyService } from '../../services/currencyService';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import type { CostBreakdownItem, CostSourceType } from '../../types';
import {
  Building,
  Users,
  Briefcase,
  Scale,
  Globe,
  Edit2,
  Check,
  RotateCcw,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export const CostsView: React.FC = () => {
  const {
    activePlan,
    currency,
    selectedCountryCode,
    setSelectedCountryCode,
    setCostOverride,
    resetCostOverrides,
  } = usePlan();

  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const costs = CostCalculatorService.calculatePlanCosts(activePlan, country);

  // Section collapse state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
  });

  // Inline editing state: { [itemId]: number }
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<number>(0);

  const toggleSection = (sec: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  const convertAndFormat = (amountUSD: number, compact: boolean = false) => {
    return CurrencyService.format(
      CurrencyService.convert(amountUSD, 'USD', currency),
      currency,
      compact
    );
  };

  const startEditing = (item: CostBreakdownItem) => {
    // Convert current USD amount to active currency for friendly user editing
    const currentInUserCurrency = Math.round(
      CurrencyService.convert(item.amountUSD, 'USD', currency)
    );
    setEditingItemId(item.id);
    setEditingValue(currentInUserCurrency);
  };

  const saveEditing = (item: CostBreakdownItem) => {
    // Convert user's input back to USD base
    const usdAmount = Math.round(
      CurrencyService.convert(editingValue, currency, 'USD')
    );
    setCostOverride(item.id, usdAmount);
    setEditingItemId(null);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  const renderSourceBadge = (source: CostSourceType, isOverridden?: boolean) => {
    if (isOverridden || source === 'User Entered') {
      return (
        <span
          className="tag-chip"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent-amber)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontWeight: 700,
          }}
        >
          USER ENTERED
        </span>
      );
    }
    if (source === 'Official Fee') {
      return (
        <span
          className="tag-chip score-high"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 700,
          }}
        >
          <ShieldCheck size={12} /> OFFICIAL FEE
        </span>
      );
    }
    if (source === 'Dataset Estimate') {
      return (
        <span
          className="tag-chip"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: 'var(--accent-blue)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          DATASET ESTIMATE
        </span>
      );
    }
    return (
      <span
        className="tag-chip"
        style={{
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          color: '#a78bfa',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        MODEL ESTIMATE
      </span>
    );
  };

  const renderSectionTable = (sectionCode: 'A' | 'B' | 'C' | 'D' | 'E', sectionTitle: string, icon: React.ReactNode, subtitle: string) => {
    const sectionItems = costs.items.filter((it) => it.section === sectionCode);
    if (sectionItems.length === 0) return null;

    const isCollapsed = collapsedSections[sectionCode];
    const sectionSubtotal = sectionItems.reduce((sum, it) => {
      if (it.period === 'monthly') return sum + it.amountUSD * 12;
      return sum + it.amountUSD;
    }, 0);

    return (
      <div className="argus-card" style={{ marginBottom: '20px' }}>
        <div
          className="flex-between"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => toggleSection(sectionCode)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {icon}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                Section {sectionCode}: {sectionTitle}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                {sectionCode === 'B' || sectionCode === 'C' ? 'ANNUAL ESTIMATE' : 'SECTION TOTAL'}
              </span>
              <div className="text-mono" style={{ fontSize: '16px', fontWeight: 800 }}>
                {convertAndFormat(sectionSubtotal)}
              </div>
            </div>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {!isCollapsed && (
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <table className="argus-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Line Item</th>
                  <th style={{ width: '18%' }}>Category</th>
                  <th style={{ width: '16%' }}>Data Source</th>
                  <th style={{ width: '10%' }}>Cadence</th>
                  <th style={{ width: '18%', textAlign: 'right' }}>Amount ({currency})</th>
                  <th style={{ width: '16%', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectionItems.map((item) => {
                  const isEditingThis = editingItemId === item.id;

                  return (
                    <tr key={item.id} style={{ backgroundColor: item.isUserOverridden ? '#fffbeb' : undefined }}>
                      <td>
                        <strong>{item.item}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {item.notes}
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>{renderSourceBadge(item.sourceType, item.isUserOverridden)}</td>
                      <td>
                        <span className="tag-chip" style={{ fontSize: '11px' }}>
                          {item.period}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isEditingThis ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              className="form-input text-mono"
                              style={{ width: '110px', padding: '4px 8px', fontSize: '13px' }}
                              value={editingValue}
                              onChange={(e) => setEditingValue(parseFloat(e.target.value) || 0)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <span className="text-mono" style={{ fontWeight: 700, fontSize: '14px' }}>
                            {convertAndFormat(item.amountUSD)}
                            {item.period === 'monthly' && (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}> /mo</span>
                            )}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isEditingThis ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              style={{ padding: '4px 8px', backgroundColor: 'var(--accent-green)' }}
                              onClick={() => saveEditing(item)}
                            >
                              <Check size={13} /> Save
                            </button>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              style={{ padding: '4px 8px' }}
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            onClick={() => startEditing(item)}
                          >
                            <Edit2 size={12} /> {item.isUserOverridden ? 'Edit Override' : 'Override'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Top Header & Destination Switcher */}
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Complete Expansion Cost Calculator</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Comprehensive initial setup, workforce compensation, office OpEx, and statutory taxes for <strong>{country.name}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Target Country:</span>
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
      </div>

      <DisclaimerBanner countryCode={country.code} />

      {/* ============================================================ */}
      {/* PROMINENT TOTAL EXPANSION COST SECTION                       */}
      {/* ============================================================ */}
      <div
        className="argus-card"
        style={{
          marginBottom: '24px',
          background: 'var(--color-dark-navy)',
          color: '#ffffff',
          borderColor: 'transparent',
          padding: '24px 28px',
          borderRadius: '12px',
        }}
      >
        <div className="flex-between" style={{ marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-light-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TOTAL EXPANSION FINANCIAL SUMMARY ({country.name.toUpperCase()})
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
              {country.flag} {country.name} Cost Projection
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#ADD0FF', textTransform: 'uppercase', fontWeight: 700 }}>
              FIRST YEAR TOTAL COMMITMENT
            </span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-warm-gold)' }} className="text-mono">
              {convertAndFormat(costs.firstYearTotalUSD)}
            </div>
          </div>
        </div>

        {/* 3 Primary Financial Pillars */}
        <div className="grid-3" style={{ gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#ADD0FF', textTransform: 'uppercase', fontWeight: 700 }}>
              TOTAL INITIAL SETUP COST
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }} className="text-mono">
              {convertAndFormat(costs.initialSetupUSD)}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '4px' }}>
              Registration + Legal + Licence + Dep + Hardware
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#ADD0FF', textTransform: 'uppercase', fontWeight: 700 }}>
              MONTHLY OPERATING COST
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-warm-gold)', marginTop: '4px' }} className="text-mono">
              {convertAndFormat(costs.monthlyOperatingUSD)} <span style={{ fontSize: '13px', color: '#CBD5E1' }}>/mo</span>
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
              Payroll (${costs.monthlyPayrollUSD.toLocaleString()} USD) + Office Rent + Compliance
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              YEAR 2 & 3 PROJECTIONS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }} className="text-mono">
              Y2: {convertAndFormat(costs.year2EstimateUSD)}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }} className="text-mono">
              Y3: {convertAndFormat(costs.year3EstimateUSD)}
            </div>
          </div>
        </div>

        {/* Formula Guarantee Banner */}
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={14} color="#60a5fa" />
          <span>
            <strong>Calculation Integrity:</strong> First Year Total = Initial Setup Cost + (Monthly Operating Cost × 12) + Corporate Tax. Employee salaries are strictly counted once within monthly operating burn.
          </span>
        </div>
      </div>

      {/* Manual Override & Transparency Controls */}
      {Object.keys(activePlan.costOverrides || {}).length > 0 && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#92400e' }}>
            <Info size={16} />
            <span>
              You have active custom overrides applied. All total calculations, comparisons, and dashboard views reflect your modified figures.
            </span>
          </div>
          <button
            type="button"
            className="btn-secondary btn-sm"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={resetCostOverrides}
          >
            <RotateCcw size={12} /> Reset to Default Benchmarks
          </button>
        </div>
      )}

      {/* Waterfall Visualization */}
      <div className="argus-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Annual Cost Waterfall Breakdown</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {costs.waterfall.map((w, idx) => {
            const pct = Math.round((w.amountUSD / costs.firstYearTotalUSD) * 100);
            return (
              <div key={idx}>
                <div className="flex-between" style={{ fontSize: '13px', marginBottom: '4px' }}>
                  <span>
                    <strong>{w.label}</strong> ({pct}%)
                  </span>
                  <span className="text-mono" style={{ fontWeight: 700 }}>
                    {convertAndFormat(w.amountUSD)}
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor:
                        w.type === 'setup'
                          ? 'var(--color-primary-blue)'
                          : w.type === 'payroll'
                          ? 'var(--color-primary-blue)'
                          : w.type === 'office'
                          ? 'var(--color-golden-brown)'
                          : w.type === 'compliance'
                          ? 'var(--color-dark-brown)'
                          : 'var(--color-light-blue)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Distinct Collapsible Cost Sections */}
      {renderSectionTable(
        'A',
        'Initial Setup Cost',
        <Building size={20} color="var(--accent-blue)" />,
        'Government incorporation, legal drafting, trade licensing, and facility security deposits.'
      )}

      {renderSectionTable(
        'B',
        'Employee Cost',
        <Users size={20} color="var(--accent-green)" />,
        `Monthly base compensation for ${activePlan.workforce.reduce((s, w) => s + w.count, 0)} staff, statutory contributions, recruitment, and onboarding.`
      )}

      {renderSectionTable(
        'C',
        'Office & Operating Cost',
        <Briefcase size={20} color="#8b5cf6" />,
        'Commercial flexi-desk lease, enterprise telecom, cloud SaaS subscriptions, bookkeeping, and marketing.'
      )}

      {renderSectionTable(
        'D',
        'Tax & Government Statutory Costs',
        <Scale size={20} color="#f59e0b" />,
        'Corporate income tax provision and annual statutory compliance filing fees. Kept distinct from setup.'
      )}

      {renderSectionTable(
        'E',
        'Foreign Worker Cost',
        <Globe size={20} color="#06b6d4" />,
        'Visa application & issuance fees, COMPASS/residency clearances, and statutory foreign worker levies.'
      )}
    </div>
  );
};
