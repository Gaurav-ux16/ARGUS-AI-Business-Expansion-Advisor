import React from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';

export const SourcesModal: React.FC = () => {
  const { isSourcesOpen, setIsSourcesOpen, selectedCountryCode } = usePlan();

  if (!isSourcesOpen) return null;

  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];

  return (
    <div className="modal-overlay" onClick={() => setIsSourcesOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div className="flex-gap-2">
            <ShieldCheck color="var(--accent-green)" size={22} />
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Sources & Trust Directory</h2>
          </div>
          <button
            onClick={() => setIsSourcesOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          ARGUS grounds all regulatory, tax, and visa recommendations in authoritative official government portals and audited statutory frameworks.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {country.officialSources.map((src, i) => (
            <div key={i} className="flex-between" style={{ padding: '14px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{src.name}</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Authority Type: {src.type}</div>
              </div>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary btn-sm"
                style={{ gap: '4px' }}
              >
                <span>View Official Source</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn-secondary" onClick={() => setIsSourcesOpen(false)}>
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
