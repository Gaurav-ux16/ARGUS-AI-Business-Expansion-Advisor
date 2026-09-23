import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { Plus } from 'lucide-react';

export const MarketView: React.FC = () => {
  const { selectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];

  const [competitors, setCompetitors] = useState<string[]>(['Local Competitor Alpha', 'Regional SaaS Inc']);
  const [newComp, setNewComp] = useState('');

  const handleAddCompetitor = () => {
    if (newComp.trim()) {
      setCompetitors([...competitors, newComp]);
      setNewComp('');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Market Intelligence & Competitor Entry</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Assess industry demand, digital maturity, and competitor density in <strong>{country.name}</strong>.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            TECHNOLOGY MARKET DEMAND
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)' }}>HIGH</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Strong B2B Cloud Adoption</div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            DIGITAL ADOPTION INDEX
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-green)' }}>94 / 100</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Top regional connectivity</div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            COMPETITION DENSITY
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-amber)' }}>MEDIUM</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Moderate local alternatives</div>
        </div>

        <div className="argus-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            STARTUP ECOSYSTEM
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#8b5cf6' }}>WORLD CLASS</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>EDB & ESG Backed</div>
        </div>
      </div>

      {/* Competitor Analysis Interface */}
      <div className="argus-card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Competitor & Differentiation Matrix</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Enter key local competitors to simulate market entry difficulty.
        </p>

        <div className="flex-gap-2" style={{ marginBottom: '16px', maxWidth: '500px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Enter competitor name..."
            value={newComp}
            onChange={(e) => setNewComp(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAddCompetitor}>
            <Plus size={16} /> Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {competitors.map((c, i) => (
            <div key={i} className="flex-between" style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--border-subtle)' }}>
              <strong>{c}</strong>
              <span className="tag-chip">Local Established</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
