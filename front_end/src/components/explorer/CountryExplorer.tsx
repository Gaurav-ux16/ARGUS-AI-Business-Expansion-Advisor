import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { ScoringEngine } from '../../services/scoringEngine';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { CountryDetailView } from './CountryDetailView';

export const CountryExplorer: React.FC = () => {
  const { activePlan, selectedCountryCode, setSelectedCountryCode } = usePlan();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [viewingDetail, setViewingDetail] = useState(false);

  const countries = Object.values(COUNTRIES_DATA);

  const filteredCountries = countries.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'ALL' || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  if (viewingDetail) {
    return (
      <CountryDetailView
        countryCode={selectedCountryCode}
        onBack={() => setViewingDetail(false)}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Country Explorer & Discovery
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Browse global expansion destinations, compare tax environments, setup complexities, and talent availability.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="argus-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div className="flex-between" style={{ gap: '16px', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: '240px' }}>
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by country name, region, or tax rate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-gap-2">
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Region:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="ALL">All Regions</option>
              <option value="Southeast Asia">Southeast Asia</option>
              <option value="Middle East">Middle East</option>
              <option value="Europe (EU)">Europe (EU)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Country Cards Grid */}
      <div className="grid-3">
        {filteredCountries.map((country) => {
          const score = ScoringEngine.calculateCountryScore(activePlan, country);
          return (
            <div key={country.code} className="argus-card">
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div className="flex-gap-2">
                  <span style={{ fontSize: '28px' }}>{country.flag}</span>
                  <div>
                    <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{country.name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{country.region}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    READINESS SCORE
                  </div>
                  <span className={`score-badge ${score.readinessScore >= 80 ? 'score-high' : 'score-medium'}`}>
                    {score.readinessScore} / 100
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 0' }}>
                <div className="flex-between">
                  <span>Corporate Tax:</span>
                  <strong>{country.corporateTaxRate}%</strong>
                </div>
                <div className="flex-between">
                  <span>Setup Complexity:</span>
                  <strong style={{ color: country.businessSetupComplexity === 'Low' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                    {country.businessSetupComplexity}
                  </strong>
                </div>
                <div className="flex-between">
                  <span>Talent Pool:</span>
                  <strong>{country.talentAvailability}</strong>
                </div>
                <div className="flex-between">
                  <span>Labour Cost:</span>
                  <strong>{country.labourCostLevel}</strong>
                </div>
                <div className="flex-between">
                  <span>Regulatory Burden:</span>
                  <strong>{country.regulatoryComplexity}</strong>
                </div>
              </div>

              <button
                className="btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setSelectedCountryCode(country.code);
                  setViewingDetail(true);
                }}
              >
                <span>VIEW COUNTRY INTELLIGENCE</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
