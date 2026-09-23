import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import type { RiskFactor } from '../../types';
import { ChevronRight } from 'lucide-react';

export const RiskView: React.FC = () => {
  const { selectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const [selectedRisk, setSelectedRisk] = useState<RiskFactor | null>(country.risks[0] || null);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Expansion Risk Analysis Engine</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Risk heatmap across 8 critical categories for expanding into <strong>{country.name}</strong>.
        </p>
      </div>

      {/* Risk Heatmap Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {country.risks.map((risk) => (
          <div
            key={risk.id}
            className="argus-card"
            style={{
              borderColor: selectedRisk?.id === risk.id ? 'var(--accent-blue)' : 'var(--border-color)',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedRisk(risk)}
          >
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span className="tag-chip">{risk.category} Risk</span>
              <span className={`score-badge ${risk.level === 'HIGH' ? 'score-low' : risk.level === 'MEDIUM' ? 'score-medium' : 'score-high'}`}>
                {risk.level}
              </span>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{risk.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {risk.cause.substring(0, 100)}...
            </p>

            <div style={{ textAlign: 'right', marginTop: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View Risk Details <ChevronRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drill-down Detail Panel */}
      {selectedRisk && (
        <div className="argus-card" style={{ border: '1px solid rgba(59, 130, 246, 0.4)', backgroundColor: 'var(--bg-card)' }}>
          <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div>
              <span className="tag-chip" style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', fontWeight: 700 }}>
                {selectedRisk.category} RISK • {selectedRisk.level} SEVERITY
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{selectedRisk.title}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Why does this risk exist?</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.6 }}>{selectedRisk.cause}</p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--accent-green-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-green-border)' }}>
              <strong style={{ color: 'var(--accent-green)' }}>Mitigation Strategy:</strong>
              <p style={{ color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.6 }}>{selectedRisk.mitigation}</p>
            </div>

            <div>
              <strong style={{ color: 'var(--text-primary)' }}>What should you verify?</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                {selectedRisk.verificationSteps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
