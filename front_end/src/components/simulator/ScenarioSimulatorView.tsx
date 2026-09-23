import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import type { ScenarioResult } from '../../services/scenarioSimulator';
import { ScenarioSimulatorService } from '../../services/scenarioSimulator';
import { CurrencyService } from '../../services/currencyService';
import { Sliders, RefreshCw, AlertTriangle } from 'lucide-react';

export const ScenarioSimulatorView: React.FC = () => {
  const { activePlan, currency } = usePlan();

  const [targetCountryCode, setTargetCountryCode] = useState(activePlan.targetCountryCode || 'SG');
  const [additionalForeign, setAdditionalForeign] = useState(5);
  const [additionalLocal, setAdditionalLocal] = useState(2);
  const [salaryMultiplier, setSalaryMultiplier] = useState(1.0);
  const [budgetChangePct, setBudgetChangePct] = useState(0);

  const simulationInput = {
    targetCountryCode,
    additionalForeignEmployees: additionalForeign,
    additionalLocalEmployees: additionalLocal,
    officeSpaceSqFt: 1000,
    budgetChangePercentage: budgetChangePct,
    salaryTierMultiplier: salaryMultiplier,
  };

  const result: ScenarioResult = ScenarioSimulatorService.simulate(activePlan, simulationInput);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>"WHAT IF?" Scenario Simulator</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Test strategic changes in team headcount, foreign worker ratios, budget, and salary levels to recalculate Readiness Scores and Cost Deltas in real time.
        </p>
      </div>

      <div className="grid-2">
        {/* Controls Panel */}
        <div className="argus-card">
          <div className="card-header-flex">
            <div className="card-title">
              <Sliders size={20} color="var(--accent-blue)" />
              <span>SIMULATION PARAMETERS</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Destination</label>
            <select
              className="form-select"
              value={targetCountryCode}
              onChange={(e) => setTargetCountryCode(e.target.value)}
            >
              <option value="SG">🇸🇬 Singapore</option>
              <option value="AE">🇦🇪 United Arab Emirates</option>
              <option value="DE">🇩🇪 Germany</option>
            </select>
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Additional Foreign Workers</label>
              <strong className="text-mono">+{additionalForeign} Employees</strong>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={additionalForeign}
              onChange={(e) => setAdditionalForeign(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Additional Local Workers</label>
              <strong className="text-mono">+{additionalLocal} Employees</strong>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={additionalLocal}
              onChange={(e) => setAdditionalLocal(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Salary Benchmark Tier</label>
              <strong className="text-mono">{(salaryMultiplier * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={salaryMultiplier}
              onChange={(e) => setSalaryMultiplier(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Budget Scale Shift (%)</label>
              <strong className="text-mono">{budgetChangePct >= 0 ? `+${budgetChangePct}%` : `${budgetChangePct}%`}</strong>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={budgetChangePct}
              onChange={(e) => setBudgetChangePct(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Dynamic Results Display */}
        <div className="argus-card" style={{ border: '1px solid rgba(59, 130, 246, 0.4)', backgroundColor: 'var(--bg-card)' }}>
          <div className="card-header-flex">
            <div className="card-title">
              <RefreshCw size={20} color="var(--accent-green)" />
              <span>SIMULATED OUTCOME & SCORE RECALCULATION</span>
            </div>
          </div>

          {/* Scores Comparison */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                ORIGINAL READINESS SCORE
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }} className="text-mono">
                {result.originalScore} / 100
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: result.scoreDelta >= 0 ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)',
                borderRadius: '6px',
                textAlign: 'center',
                border: `1px solid ${result.scoreDelta >= 0 ? 'var(--accent-green-border)' : 'var(--accent-red-border)'}`,
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                SIMULATED SCORE
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: result.scoreDelta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                }}
                className="text-mono"
              >
                {result.newScore} / 100
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: result.scoreDelta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {result.scoreDelta >= 0 ? `+${result.scoreDelta} pts shift` : `${result.scoreDelta} pts shift`}
              </div>
            </div>
          </div>

          {/* Financial Delta */}
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
            <div className="flex-between" style={{ fontSize: '13px', marginBottom: '4px' }}>
              <span>Original 1st Year Cost:</span>
              <strong className="text-mono">
                {CurrencyService.format(CurrencyService.convert(result.originalFirstYearCostUSD, 'USD', currency), currency)}
              </strong>
            </div>
            <div className="flex-between" style={{ fontSize: '13px', marginBottom: '4px' }}>
              <span>Simulated 1st Year Cost:</span>
              <strong className="text-mono">
                {CurrencyService.format(CurrencyService.convert(result.newFirstYearCostUSD, 'USD', currency), currency)}
              </strong>
            </div>
            <div className="flex-between" style={{ fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              <span>Financial Impact (Delta):</span>
              <strong className="text-mono" style={{ color: result.costDeltaUSD > 0 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                +{CurrencyService.format(CurrencyService.convert(result.costDeltaUSD, 'USD', currency), currency)}
              </strong>
            </div>
          </div>

          {/* Risk Shift Alert */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--accent-amber-bg)',
              border: '1px solid var(--accent-amber-border)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <AlertTriangle size={16} style={{ marginTop: '2px' }} />
            <span>{result.riskShiftMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
