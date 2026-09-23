import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { ScoringEngine } from '../../services/scoringEngine';
import { COUNTRIES_DATA } from '../../data/countriesData';

export const ExplainScoreModal: React.FC = () => {
  const { isExplainModalOpen, setIsExplainModalOpen, activePlan, selectedCountryCode } = usePlan();

  if (!isExplainModalOpen) return null;

  const countryData = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const scoreObj = ScoringEngine.calculateCountryScore(activePlan, countryData);

  return (
    <div className="modal-overlay" onClick={() => setIsExplainModalOpen(false)}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
              EXPLAINABLE ML DECISION LOG
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
              Why {countryData.name} Scored {scoreObj.readinessScore} / 100
            </h2>
          </div>
          <button
            onClick={() => setIsExplainModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Overview Banner */}
        <div
          style={{
            backgroundColor: 'var(--accent-blue-light)',
            border: '1px solid var(--accent-blue-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {scoreObj.recommendationHeadline}
          </div>
        </div>

        {/* Factors List */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Score Contribution Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scoreObj.factors.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: f.type === 'positive' ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)',
                  border: `1px solid ${f.type === 'positive' ? 'var(--accent-green-border)' : 'var(--accent-red-border)'}`,
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {f.type === 'positive' ? (
                    <CheckCircle size={18} color="var(--accent-green)" />
                  ) : (
                    <AlertTriangle size={18} color="var(--accent-red)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{f.category}</strong>
                    <span
                      className="text-mono"
                      style={{
                        fontWeight: 800,
                        fontSize: '14px',
                        color: f.scoreContribution >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                      }}
                    >
                      {f.scoreContribution >= 0 ? `+${f.scoreContribution}` : `${f.scoreContribution}`} pts
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{f.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn-secondary" onClick={() => setIsExplainModalOpen(false)}>
            Close Decision Log
          </button>
        </div>
      </div>
    </div>
  );
};
