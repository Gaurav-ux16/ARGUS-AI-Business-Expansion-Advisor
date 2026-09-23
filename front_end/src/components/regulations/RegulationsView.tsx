import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import type { RAGSearchResponse } from '../../services/ragService';
import { RAGService } from '../../services/ragService';
import { COUNTRIES_DATA } from '../../data/countriesData';
import {
  Search,
  ShieldAlert,
  ExternalLink,
  Sparkles,
  BookOpen,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const SUPPORTED_RAG_COUNTRIES = ['SG', 'AE', 'DE'];

export const RegulationsView: React.FC = () => {
  const { selectedCountryCode, setSelectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];

  const [userQuery, setUserQuery] = useState('');
  const [ragResult, setRagResult] = useState<RAGSearchResponse | null>(null);

  const isRagAvailable = SUPPORTED_RAG_COUNTRIES.includes(country.code);

  const sampleQueries = [
    'Can I hire 10 foreign customer-support employees?',
    'What are the company registration requirements?',
    'Do I need a local resident director?',
    'What corporate tax exemptions apply to my business?',
    'Does data protection law (PDPA/GDPR) apply to my company?',
  ];

  const handleSearch = (queryText: string) => {
    const q = queryText || userQuery;
    if (!q.trim()) return;
    const res = RAGService.query(q, country.code);
    setRagResult(res);
  };

  return (
    <div>
      {/* Page Header & Country Switcher */}
      <div className="flex-between" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            STATUTORY GROUNDED INTELLIGENCE
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '2px' }}>
            REGULATORY INTELLIGENCE ({country.name.toUpperCase()})
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Statutory legal and tax intelligence grounded in curated official government sources.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['SG', 'AE', 'DE'].map((code) => {
            const c = COUNTRIES_DATA[code];
            const isSelected = selectedCountryCode === code;
            return (
              <button
                key={code}
                type="button"
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--color-primary-blue)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                }}
                onClick={() => {
                  setSelectedCountryCode(code);
                  setRagResult(null);
                }}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RAG Availability Status Strip */}
      <div
        className="argus-card"
        style={{
          marginBottom: '20px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isRagAvailable ? 'rgba(0, 62, 143, 0.05)' : '#F8FAFC',
          border: isRagAvailable ? '1px solid rgba(0, 62, 143, 0.25)' : '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isRagAvailable ? '#003E8F' : '#718096',
              boxShadow: isRagAvailable ? '0 0 8px rgba(0, 62, 143, 0.5)' : 'none',
            }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: isRagAvailable ? '#003E8F' : '#718096', textTransform: 'uppercase' }}>
              {isRagAvailable ? `${country.name.toUpperCase()} — RAG AVAILABLE` : `${country.name.toUpperCase()} — RAG NOT AVAILABLE`}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
              {isRagAvailable
                ? `Verified statutory knowledge base connected for ${country.name}. Cites official laws, gazettes, and ministry guidelines.`
                : 'Regulatory intelligence has not yet been configured for this country. Official source records are pending verification.'}
            </div>
          </div>
        </div>

        {isRagAvailable && (
          <span
            className="tag-chip"
            style={{
              fontSize: '11px',
              backgroundColor: 'var(--color-light-blue)',
              color: 'var(--color-primary-blue)',
              borderColor: 'rgba(0, 62, 143, 0.2)',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={13} /> {country.officialSources.length} Official Sources
          </span>
        )}
      </div>

      {/* Knowledge Sources Grid */}
      {isRagAvailable && (
        <div className="grid-4" style={{ gap: '12px', marginBottom: '24px' }}>
          {country.officialSources.map((s, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex-between">
                <span
                  className="tag-chip"
                  style={{
                    fontSize: '10px',
                    backgroundColor: 'var(--color-light-blue)',
                    color: 'var(--color-primary-blue)',
                    borderColor: 'rgba(0, 62, 143, 0.2)',
                  }}
                >
                  {s.type}
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--color-primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11px' }}
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--color-dark-navy)', display: 'block', marginTop: '6px' }}>
                {s.name}
              </strong>
            </div>
          ))}
        </div>
      )}

      {/* RAG Search Engine Query Box */}
      {isRagAvailable ? (
        <div className="argus-card" style={{ marginBottom: '24px', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', marginBottom: '8px' }}>
            GROUNDED REGULATORY SEARCH
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div className="search-input-wrapper" style={{ flex: 1, minWidth: '280px' }}>
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                style={{ padding: '12px 14px 12px 38px', fontSize: '13px' }}
                placeholder={`Ask any regulatory question about ${country.name} (e.g. visa quotas, director rules, corporate tax)...`}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(userQuery)}
              />
            </div>

            <button type="button" className="btn-primary" onClick={() => handleSearch(userQuery)}>
              <Sparkles size={15} /> Ask RAG Advisor
            </button>
          </div>

          {/* Sample Prompts */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, marginRight: '8px', color: 'var(--text-primary)' }}>Quick Questions:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '5px 10px', backgroundColor: '#FFFFFF' }}
                  onClick={() => {
                    setUserQuery(sq);
                    handleSearch(sq);
                  }}
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="argus-card"
          style={{
            padding: '36px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            marginBottom: '24px',
          }}
        >
          <AlertCircle size={32} color="#718096" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>RAG Not Available for {country.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '6px auto 0' }}>
            Official statutory documents have not yet been ingested for this jurisdiction. Switch to Singapore, UAE, or Germany to query verified official records.
          </p>
        </div>
      )}

      {/* RAG Answer Display Card */}
      {ragResult && (
        <div
          className="argus-card"
          style={{
            marginBottom: '24px',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid var(--color-primary-blue)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div className="flex-gap-2">
              <BookOpen size={18} color="var(--color-primary-blue)" />
              <strong style={{ fontSize: '14px', color: 'var(--color-dark-navy)' }}>STATUTORY ADVISORY RESPONSE</strong>
            </div>
            <span
              className="tag-chip"
              style={{
                fontSize: '11px',
                backgroundColor: 'var(--color-light-blue)',
                color: 'var(--color-primary-blue)',
                borderColor: 'rgba(0, 62, 143, 0.2)',
                fontWeight: 700,
              }}
            >
              {ragResult.matchedArticles.length} Statutory Records Cited
            </span>
          </div>

          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              marginBottom: '20px',
              backgroundColor: 'var(--bg-card-subtle)',
              padding: '16px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {ragResult.answer}
          </div>

          {/* Matched Statutory Articles */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase', color: 'var(--color-dark-navy)' }}>
              CITED STATUTORY PROVISIONS & AUTHORITIES
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ragResult.matchedArticles.map((art) => (
                <div
                  key={art.id}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--color-dark-navy)' }}>
                      {art.title} ({art.section})
                    </strong>
                    <a
                      href={art.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '11px', color: 'var(--color-primary-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>{art.sourceName}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last Verified: {art.lastVerified}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Banner in Financial Tint */}
          <div
            className="card-financial"
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ShieldAlert size={15} style={{ flexShrink: 0 }} />
            <span>{ragResult.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
