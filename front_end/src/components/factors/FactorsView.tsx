import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { FactorService, FACTOR_CATEGORIES } from '../../services/factorService';
import { ScoringEngine } from '../../services/scoringEngine';
import { COUNTRIES_DATA } from '../../data/countriesData';
import type { FactorPriority, FactorWeights } from '../../types';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Scale,
  ShieldAlert,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Scale,
  ShieldAlert,
};

export const FactorsView: React.FC = () => {
  const { activePlan, updateFactorWeights } = usePlan();

  const [weights, setWeights] = useState<FactorWeights>(
    activePlan.factorWeights || {
      market: 20,
      cost: 25,
      labour: 25,
      businessEnvironment: 10,
      regulatory: 15,
      risk: 5,
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const validation = FactorService.validateWeights(weights);

  // Compute live scores with the current preview weights
  const tempPlan = {
    ...activePlan,
    factorWeights: weights,
  };
  const liveScores = ScoringEngine.rankCountries(tempPlan);

  const handleSliderChange = (key: keyof FactorWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
    setSavedSuccess(false);
  };

  const handlePrioritySelect = (key: keyof FactorWeights, priority: FactorPriority) => {
    const weightVal = FactorService.priorityToWeight(priority);
    setWeights((prev) => ({
      ...prev,
      [key]: weightVal,
    }));
    setSavedSuccess(false);
  };

  const handleAutoBalance = () => {
    const normalized = FactorService.normalizeWeights(weights);
    setWeights(normalized);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    if (!validation.isValid) {
      alert('Please balance weights to 100% before saving, or use the "Auto-Balance to 100%" button.');
      return;
    }
    updateFactorWeights(weights);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Expansion Decision Factors & Priorities</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Configure the strategic pillars that matter most for <strong>{activePlan.profile.name}</strong>. Weights calibrate the personalized Country Readiness Scores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary btn-sm" onClick={handleAutoBalance}>
            <RotateCcw size={14} /> Auto-Balance to 100%
          </button>
          <button
            type="button"
            className="btn-primary btn-sm"
            style={{ backgroundColor: savedSuccess ? 'var(--accent-green)' : 'var(--accent-blue)' }}
            onClick={handleSave}
          >
            {savedSuccess ? (
              <>
                <Check size={14} /> Weights Saved & Active
              </>
            ) : (
              <>
                <Check size={14} /> Save & Apply Weights
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Status Strip */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: validation.isValid ? 'var(--accent-green-bg)' : '#fef2f2',
          border: validation.isValid ? '1px solid #a7f3d0' : '1px solid #fecaca',
          color: validation.isValid ? 'var(--accent-green)' : '#dc2626',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600 }}>
          {validation.isValid ? <Check size={20} /> : <AlertTriangle size={20} />}
          <span>{validation.message}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8, fontWeight: 700, display: 'block' }}>
            TOTAL ALLOCATION
          </span>
          <span className="text-mono" style={{ fontSize: '22px', fontWeight: 900 }}>
            {validation.sum}% / 100%
          </span>
        </div>
      </div>

      {/* Live Preview Score Impact Strip */}
      <div className="argus-card" style={{ marginBottom: '24px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sparkles size={16} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.5px' }}>
            Live Impact on Country Readiness Scores
          </h3>
        </div>

        <div className="grid-3" style={{ gap: '16px' }}>
          {liveScores.map((score, index) => {
            const country = COUNTRIES_DATA[score.countryCode];
            return (
              <div
                key={score.countryCode}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: index === 0 ? '2px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                  position: 'relative',
                }}
              >
                {index === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '12px',
                      backgroundColor: 'var(--color-primary-blue)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    #1 Top Match
                  </span>
                )}
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{country?.flag}</span>
                    <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{score.countryName}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="text-mono" style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {score.readinessScore}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                </div>

                <div className="grid-3" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', backgroundColor: 'var(--bg-elevated)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div>Mkt: {score.metrics.marketFit}/20</div>
                  <div>Lab: {score.metrics.labourFit}/20</div>
                  <div>Cost: {score.metrics.costFit}/20</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Factor Category Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {FACTOR_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.iconName] || TrendingUp;
          const currentVal = weights[cat.key];

          return (
            <div
              key={cat.key}
              className="argus-card"
              style={{
                transition: 'border-color 0.2s ease',
              }}
            >
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--accent-blue-light)',
                      color: 'var(--accent-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{cat.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    WEIGHT ALLOCATED
                  </span>
                  <div className="text-mono" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-blue)' }}>
                    {currentVal}%
                  </div>
                </div>
              </div>

              {/* Priority Fast Selector Buttons + Slider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Priority:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['High', 'Medium', 'Low'] as FactorPriority[]).map((p) => {
                    const isSelected =
                      (p === 'High' && currentVal >= 25) ||
                      (p === 'Medium' && currentVal >= 12 && currentVal < 25) ||
                      (p === 'Low' && currentVal < 12);

                    return (
                      <button
                        key={p}
                        type="button"
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--bg-card)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                        }}
                        onClick={() => handlePrioritySelect(cat.key, p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <div style={{ flex: 1, marginLeft: '12px' }}>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(cat.key, parseInt(e.target.value) || 0)}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Sub-factor taxonomy badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cat.subFactors.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                    }}
                    title={sub.description}
                  >
                    <strong>{sub.name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                      ({sub.description})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
