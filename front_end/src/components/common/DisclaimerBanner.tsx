import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { COUNTRIES_DATA } from '../../data/countriesData';

interface Props {
  countryCode?: string;
}

export const DisclaimerBanner: React.FC<Props> = ({ countryCode = 'SG' }) => {
  const data = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA['SG'];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="flex-gap-2">
        <ShieldAlert size={16} color="var(--accent-amber)" />
        <span>
          <strong>Informational Guidance:</strong> ARGUS provides decision intelligence based on official government records (IRAS, ACRA, MOM, EDB) and estimated financial models. It does not replace professional legal, tax, or immigration counsel.
        </span>
      </div>

      <div className="flex-gap-4">
        <div className="flex-gap-2">
          <Info size={14} color="var(--accent-blue)" />
          <span>Data Confidence for {data.name}:</span>
          <span className="score-badge score-high" style={{ fontSize: '11px', padding: '2px 8px' }}>
            {data.dataConfidenceScore}% High
          </span>
        </div>
      </div>
    </div>
  );
};
