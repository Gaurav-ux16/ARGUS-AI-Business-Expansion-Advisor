import React, { useState, useRef } from 'react';
import { usePlan } from '../../context/PlanContext';
import type {
  CurrencyCode,
  ExpansionObjective,
  IndustryType,
} from '../../types';
import { CurrencyService } from '../../services/currencyService';
import {
  Sparkles,
  ChevronRight,
  Globe,
  FileText,
  ArrowRight,
  TrendingUp,
  BarChart3,
  X,
  Building2,
  Clock,
} from 'lucide-react';
import heroGlobe from '../../assets/hero_globe.jpg';

const PREVIOUS_ENTRIES = [
  {
    id: 'entry-1',
    companyName: 'ApexMetrics Technologies',
    industry: 'Software / SaaS',
    homeCountry: 'India',
    targetCountry: 'Singapore',
    date: '23 Sep 2026',
    budgetFormatted: '₹50 Lakhs (INR)',
    employees: 15,
  },
  {
    id: 'entry-2',
    companyName: 'Nova Logistics Global',
    industry: 'Logistics',
    homeCountry: 'India',
    targetCountry: 'United Arab Emirates',
    date: '18 Sep 2026',
    budgetFormatted: '₹40 Lakhs (INR)',
    employees: 25,
  },
  {
    id: 'entry-3',
    companyName: 'Zenith BioPharma',
    industry: 'Healthcare',
    homeCountry: 'India',
    targetCountry: 'Germany',
    date: '14 Sep 2026',
    budgetFormatted: '₹80 Lakhs (INR)',
    employees: 12,
  },
];



const METRICS = [
  { value: '4', label: 'Jurisdictions', sub: 'SG · UAE · DE · IN' },
  { value: '20+', label: 'Business Factors', sub: 'Multi-attribute scoring' },
  { value: 'RAG', label: 'Regulatory Intelligence', sub: 'Source-cited answers' },
];

export const LandingPage: React.FC = () => {
  const { activePlan, updatePlan, setActiveView, setSelectedCountryCode } = usePlan();

  const [companyName, setCompanyName] = useState('ApexMetrics Technologies');
  const [currentCountry, setCurrentCountry] = useState('India');
  const [industry, setIndustry] = useState<IndustryType>('Software / SaaS');
  const [businessScale, setBusinessScale] = useState('Growing Startup (11-50 employees)');
  const [objective, setObjective] = useState<ExpansionObjective>('Enter a new market');
  const [budgetAmount, setBudgetAmount] = useState<number>(5000000);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [timeline, setTimeline] = useState('3-6 months');

  const [showNoPlanMsg, setShowNoPlanMsg] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const hasSavedPlans = PREVIOUS_ENTRIES.length > 0;

  const handleScroll = () => {
    if (pageRef.current) {
      setNavScrolled(pageRef.current.scrollTop > 40);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleViewDashboard = () => {
    if (!hasSavedPlans) {
      setShowNoPlanMsg(true);
      setTimeout(() => setShowNoPlanMsg(false), 4000);
      return;
    }
    if (PREVIOUS_ENTRIES.length === 1) {
      handleSelectPrevious(PREVIOUS_ENTRIES[0]);
    } else {
      setShowPlansModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usdBudget = Math.round(CurrencyService.convert(budgetAmount, currency, 'USD'));
    updatePlan({
      name: `${companyName} Expansion Plan`,
      profile: {
        ...activePlan.profile,
        name: companyName,
        currentCountry,
        industry,
        companySize: businessScale,
        expansionBudgetHomeCurrency: budgetAmount,
        expansionBudgetUSD: usdBudget,
        homeCurrency: currency,
        timeline,
      },
      objectives: [objective],
    });
    setActiveView('overview');
  };

  const handleSelectPrevious = (entry: (typeof PREVIOUS_ENTRIES)[0]) => {
    setCompanyName(entry.companyName);
    setIndustry(entry.industry as IndustryType);
    setCurrentCountry(entry.homeCountry);
    const code = entry.targetCountry.includes('Singapore')
      ? 'SG'
      : entry.targetCountry.includes('Emirates')
      ? 'AE'
      : 'DE';
    setSelectedCountryCode(code);
    updatePlan({
      name: `${entry.companyName} Expansion Plan`,
      targetCountryCode: code,
      profile: {
        ...activePlan.profile,
        name: entry.companyName,
        industry: entry.industry as IndustryType,
        currentCountry: entry.homeCountry,
      },
    });
    setActiveView('overview');
  };

  return (
    <div
      ref={pageRef}
      onScroll={handleScroll}
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F9FC',
        color: 'var(--text-primary)',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ================================================
          PLANS SELECTOR MODAL
          ================================================ */}
      {showPlansModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 36, 58, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => e.target === e.currentTarget && setShowPlansModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 50px rgba(20, 36, 58, 0.18)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
                  Your Expansion Plans
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Select a plan to open its dashboard
                </div>
              </div>
              <button
                onClick={() => setShowPlansModal(false)}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PREVIOUS_ENTRIES.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => { setShowPlansModal(false); handleSelectPrevious(entry); }}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#003E8F';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 62, 143, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0, 62, 143, 0.1)',
                        color: '#003E8F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {entry.companyName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--color-dark-navy)' }}>
                        {entry.companyName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {entry.industry} · {entry.homeCountry} → {entry.targetCountry}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#003E8F',
                      flexShrink: 0,
                    }}
                  >
                    Open <ArrowRight size={13} />
                  </div>
                </button>
              ))}
            </div>
            <div style={{ padding: '12px 24px 20px', borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={() => { setShowPlansModal(false); scrollToForm(); }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px dashed var(--border-highlight)',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#003E8F'; e.currentTarget.style.borderColor = '#003E8F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-highlight)'; }}
              >
                + Create New Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================
          NAVBAR
          ================================================ */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '64px',
          backgroundColor: navScrolled ? 'rgba(255, 255, 255, 0.97)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${navScrolled ? 'var(--border-color)' : 'transparent'}`,
          transition: 'all 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 max(24px, calc((100% - 1280px) / 2 + 24px))',
          boxShadow: navScrolled ? '0 1px 8px rgba(20, 36, 58, 0.06)' : 'none',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #003E8F 0%, #14243A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="#FFD482" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-0.3px', color: '#14243A', lineHeight: 1 }}>
              ARGUS
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', color: '#8F5E01', textTransform: 'uppercase', marginTop: '1px' }}>
              AI Business Expansion Advisor
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {['Overview', 'How It Works', 'Intelligence', 'About'].map((link) => (
            <button
              key={link}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#003E8F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showNoPlanMsg ? (
            <div
              style={{
                fontSize: '12px',
                color: '#B91C1C',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                padding: '6px 12px',
                maxWidth: '280px',
              }}
            >
              No expansion plan created yet. Create one to access the dashboard.
            </div>
          ) : (
            <button
              onClick={handleViewDashboard}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-dark-navy)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#003E8F'; e.currentTarget.style.color = '#003E8F'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--color-dark-navy)'; }}
            >
              View Dashboard <BarChart3 size={14} />
            </button>
          )}
          <button
            onClick={scrollToForm}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #003E8F 0%, #14243A 100%)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Enter Your Business <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#14243A',
          overflow: 'hidden',
          minHeight: 'min(680px, 80vh)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Full-bleed hero image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroGlobe})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
          }}
        />

        {/* Dark gradient overlay — bottom to top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(20, 36, 58, 0.97) 0%, rgba(20, 36, 58, 0.6) 40%, rgba(20, 36, 58, 0.2) 75%, rgba(20, 36, 58, 0.05) 100%)',
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '0 max(24px, calc((100% - 1280px) / 2 + 24px)) 56px',
          }}
        >
          {/* Eyebrow tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 13px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 212, 130, 0.15)',
              border: '1px solid rgba(255, 212, 130, 0.35)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFD482',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={12} /> AI Business Expansion Advisor
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 62px)',
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '18px',
              maxWidth: '780px',
            }}
          >
            Where should your<br />
            <span style={{ color: '#FFD482' }}>business expand next?</span>
          </h1>

          {/* Supporting text */}
          <p
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: 'rgba(173, 208, 255, 0.9)',
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '32px',
              fontWeight: 400,
            }}
          >
            Turn market, cost, labour and regulatory intelligence into a clear expansion strategy.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={scrollToForm}
              style={{
                padding: '13px 28px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #FFD482 0%, #8F5E01 100%)',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#14243A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(255, 212, 130, 0.3)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 212, 130, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 212, 130, 0.3)';
              }}
            >
              Enter Your Business <ArrowRight size={16} />
            </button>
            <button
              onClick={handleViewDashboard}
              style={{
                padding: '13px 24px',
                borderRadius: '10px',
                border: '1.5px solid rgba(173, 208, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ADD0FF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(173, 208, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(173, 208, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(173, 208, 255, 0.4)';
              }}
            >
              View Existing Dashboard
            </button>
          </div>

          {/* Metric cards */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '44px',
              flexWrap: 'wrap',
            }}
          >
            {METRICS.map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(173, 208, 255, 0.2)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  minWidth: '130px',
                }}
              >
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#FFD482',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '10.5px', color: 'rgba(173, 208, 255, 0.7)', marginTop: '2px' }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          FEATURE SHOWCASE — COMPOSER-STYLE 2-COL GRID
          ================================================ */}
      <section
        style={{
          padding: '88px max(24px, calc((100% - 1280px) / 2 + 24px)) 0',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#8F5E01',
              marginBottom: '12px',
            }}
          >
            WHAT ARGUS ANALYSES
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900,
              color: '#14243A',
              letterSpacing: '-1px',
              lineHeight: 1.1,
              maxWidth: '760px',
              margin: '0 auto 16px',
            }}
          >
            Make expansion decisions with<br />intelligence, not fragmented research.
          </h2>
          <p style={{ fontSize: '16px', color: '#526173', maxWidth: '540px', margin: '0 auto', lineHeight: 1.65 }}>
            ARGUS synthesises multi-source indicators, official statistics, and statutory regulatory documents into one structured decision.
          </p>
        </div>

        {/* 2×2 showcase grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            backgroundColor: '#E2E8F0',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >

          {/* ── CELL 1 — Market Intelligence ── */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '48px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Mockup: country score table */}
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(20,36,58,0.12)',
                overflow: 'hidden',
                marginBottom: '32px',
                border: '1px solid #E2E8F0',
              }}
            >
              {/* Mockup header */}
              <div style={{ background: '#14243A', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5F57' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FEBC2E' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28C840' }} />
                <span style={{ marginLeft: '8px', fontSize: '11px', color: '#ADD0FF', fontWeight: 600 }}>Country Suitability Score</span>
              </div>
              {/* Score rows */}
              {[
                { country: '🇸🇬 Singapore', score: 88, color: '#003E8F', bar: '88%' },
                { country: '🇦🇪 UAE', score: 81, color: '#8F5E01', bar: '81%' },
                { country: '🇩🇪 Germany', score: 74, color: '#003E8F', bar: '74%' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#14243A', flex: 1 }}>{row.country}</span>
                  <div style={{ flex: 2, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: row.bar, height: '100%', backgroundColor: row.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: row.color, width: '32px', textAlign: 'right' }}>{row.score}</span>
                </div>
              ))}
              <div style={{ padding: '10px 16px', background: 'rgba(0,62,143,0.04)', fontSize: '11px', color: '#526173', display: 'flex', gap: '12px' }}>
                <span>Industry: <strong style={{ color: '#14243A' }}>Software / SaaS</strong></span>
                <span>Budget: <strong style={{ color: '#14243A' }}>$60k</strong></span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14243A', marginBottom: '8px' }}>Market Intelligence</div>
              <p style={{ fontSize: '14px', color: '#526173', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                Understand market opportunity and country-specific business fit — scored and ranked by your industry and objectives.
              </p>
            </div>
          </div>

          {/* ── CELL 2 — Cost Intelligence ── */}
          <div style={{ backgroundColor: '#FFFDF7', padding: '48px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Mockup: cost breakdown card */}
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(20,36,58,0.10)',
                overflow: 'hidden',
                marginBottom: '32px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#14243A' }}>First-Year Cost Estimate</span>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', backgroundColor: '#FFF2D3', color: '#8F5E01', borderRadius: '4px' }}>SGD</span>
              </div>
              {[
                { label: 'Corporate Setup', amount: 'S$ 4,200', tag: 'Official Fee' },
                { label: 'Office Lease (12mo)', amount: 'S$ 36,000', tag: 'Benchmark' },
                { label: 'Workforce Cost', amount: 'S$ 156,000', tag: 'Dataset' },
                { label: 'Annual Audit', amount: 'S$ 3,500', tag: 'Official Fee' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '9px 16px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#526173' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#F1F5F9', color: '#718096', borderRadius: '3px', fontWeight: 600 }}>{item.tag}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#14243A' }}>{item.amount}</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 16px', background: '#14243A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ADD0FF' }}>Total Year 1</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFD482' }}>S$ 199,700</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14243A', marginBottom: '8px' }}>Cost Intelligence</div>
              <p style={{ fontSize: '14px', color: '#526173', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                Estimate setup and operating costs with line-item transparency — every figure tagged with its official source.
              </p>
            </div>
          </div>

          {/* ── CELL 3 — Labour Intelligence ── */}
          <div style={{ backgroundColor: '#F8FAFF', padding: '48px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Mockup: workforce role cards */}
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(20,36,58,0.10)',
                overflow: 'hidden',
                marginBottom: '32px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 700, color: '#526173', display: 'flex', justifyContent: 'space-between' }}>
                <span>Role</span>
                <span>Avg. Salary / yr</span>
                <span>Visa Status</span>
              </div>
              {[
                { role: 'Software Engineer', salary: 'S$ 78,000', status: 'S-Pass', ok: true },
                { role: 'Product Manager', salary: 'S$ 92,000', status: 'EP', ok: true },
                { role: 'Customer Support', salary: 'S$ 38,400', status: 'Local', ok: true },
                { role: 'Data Analyst', salary: 'S$ 62,000', status: 'S-Pass ⚠', ok: false },
              ].map((row, i) => (
                <div key={i} style={{ padding: '9px 16px', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#14243A', fontWeight: 600, flex: 2 }}>{row.role}</span>
                  <span style={{ fontSize: '12px', color: '#526173', flex: 1.5, textAlign: 'center' }}>{row.salary}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, flex: 1, textAlign: 'right',
                    color: row.ok ? '#003E8F' : '#B91C1C',
                    backgroundColor: row.ok ? 'rgba(0,62,143,0.08)' : 'rgba(185,28,28,0.08)',
                    padding: '2px 6px', borderRadius: '4px',
                  }}>{row.status}</span>
                </div>
              ))}
              <div style={{ padding: '9px 16px', background: 'rgba(0,62,143,0.04)', fontSize: '11px', color: '#526173' }}>
                Foreign quota: <strong style={{ color: '#003E8F' }}>2 of 3 slots used</strong> · COMPASS score: <strong style={{ color: '#003E8F' }}>42 pts</strong>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14243A', marginBottom: '8px' }}>Labour Intelligence</div>
              <p style={{ fontSize: '14px', color: '#526173', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                Evaluate workforce availability, salary benchmarks, and foreign visa quota feasibility for your exact team.
              </p>
            </div>
          </div>

          {/* ── CELL 4 — Regulatory Intelligence ── */}
          <div style={{ backgroundColor: '#FAFAF8', padding: '48px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Mockup: RAG Q&A interface */}
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(20,36,58,0.10)',
                overflow: 'hidden',
                marginBottom: '32px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ background: '#14243A', padding: '10px 14px', fontSize: '11px', color: '#ADD0FF', fontWeight: 600 }}>
                Regulatory Q&amp;A · Singapore
              </div>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>You asked:</div>
                <div style={{ fontSize: '12.5px', color: '#14243A', fontWeight: 600 }}>What is the minimum paid-up capital for a Private Limited Company?</div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '6px' }}>ARGUS RAG Answer:</div>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Singapore requires a minimum paid-up capital of <strong style={{ color: '#003E8F' }}>S$1</strong> for a Private Limited Company registered under the Companies Act.
                </p>
                <div
                  style={{
                    marginTop: '10px',
                    padding: '7px 10px',
                    backgroundColor: 'rgba(0,62,143,0.06)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,62,143,0.15)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <FileText size={12} color="#003E8F" style={{ marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#003E8F', fontWeight: 600 }}>ACRA — Starting a Business Guide, p.4</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14243A', marginBottom: '8px' }}>Regulatory Intelligence</div>
              <p style={{ fontSize: '14px', color: '#526173', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                Access grounded regulatory answers via RAG — every response cited with the official document and page number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          AI-POWERED RAG SPLIT PANEL
          ================================================ */}
      <section
        style={{
          padding: '88px max(24px, calc((100% - 1280px) / 2 + 24px))',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Left: text */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8F5E01', marginBottom: '14px' }}>
            REGULATORY RAG
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              fontWeight: 900,
              color: '#003E8F',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}
          >
            Grounded regulatory answers,
            <span style={{ color: '#14243A' }}> not hallucinations.</span>
          </h2>
          <p style={{ fontSize: '15px', color: '#526173', lineHeight: 1.7, marginBottom: '24px' }}>
            Ask about incorporation rules, visa quotas, tax treaties, or compliance requirements in natural language. ARGUS retrieves the exact statutory clause — and tells you exactly which official document it came from.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Chunked from official government PDFs (ACRA, IRAS, MOM, PDPC)',
              'all-MiniLM-L6-v2 dense embeddings · ChromaDB vector search',
              'Every answer sourced with document title and page number',
            ].map((txt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(0,62,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#003E8F' }} />
                </div>
                <span style={{ fontSize: '13.5px', color: '#14243A', lineHeight: 1.5 }}>{txt}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11.5px', color: '#718096', marginTop: '18px' }}>
            ⚠ ARGUS provides decision support — always verify critical legal matters with qualified counsel.
          </div>
        </div>

        {/* Right: dark mockup */}
        <div
          style={{
            backgroundColor: '#0C1523',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(20,36,58,0.22)',
            border: '1px solid rgba(173,208,255,0.12)',
          }}
        >
          {/* Window chrome */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5F57' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FEBC2E' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28C840' }} />
            <span style={{ marginLeft: '10px', fontSize: '11px', color: '#ADD0FF', fontWeight: 600 }}>Regulations &amp; RAG · Singapore</span>
            <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: '4px', backgroundColor: 'rgba(0,62,143,0.4)', fontSize: '10px', color: '#ADD0FF', fontWeight: 700 }}>LIVE</div>
          </div>
          {/* Chat area */}
          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* User question bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '80%', backgroundColor: '#003E8F', color: '#FFFFFF', borderRadius: '12px 12px 2px 12px', padding: '10px 14px', fontSize: '13px', lineHeight: 1.5, fontWeight: 500 }}>
                What are the CPF contribution rates for local employees in Singapore?
              </div>
            </div>
            {/* AI response bubble */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #FFD482, #8F5E01)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Sparkles size={13} color="#14243A" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ backgroundColor: '#151E2E', borderRadius: '2px 12px 12px 12px', padding: '12px 14px', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.65 }}>
                  For employees aged <strong style={{ color: '#FFD482' }}>55 and below</strong>, CPF contributions are:
                  <div style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '5px', fontSize: '12px' }}>
                      <span style={{ color: '#ADD0FF' }}>Employer contribution</span>
                      <strong style={{ color: '#FFD482' }}>17%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '5px', fontSize: '12px' }}>
                      <span style={{ color: '#ADD0FF' }}>Employee contribution</span>
                      <strong style={{ color: '#FFD482' }}>20%</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', padding: '8px 10px', backgroundColor: 'rgba(0,62,143,0.3)', borderRadius: '6px', border: '1px solid rgba(173,208,255,0.2)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <FileText size={11} color="#ADD0FF" />
                    <span style={{ fontSize: '11px', color: '#ADD0FF', fontWeight: 600 }}>CPF Board — Employer's Guide to CPF, p.12 · iras.gov.sg</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Input bar */}
            <div style={{ backgroundColor: '#151E2E', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(173,208,255,0.15)' }}>
              <span style={{ flex: 1, fontSize: '12px', color: '#4A5568' }}>Ask about Singapore regulations...</span>
              <div style={{ padding: '5px 10px', backgroundColor: '#003E8F', borderRadius: '6px', fontSize: '11px', color: '#FFFFFF', fontWeight: 700 }}>Ask →</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          BUILD YOUR EXPANSION PLAN — FORM SECTION
          ================================================ */}
      <section
        ref={formRef}
        style={{
          padding: '80px max(24px, calc((100% - 1280px) / 2 + 24px)) 64px',
          backgroundColor: '#F7F9FC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Section heading */}
        <div style={{ marginBottom: '40px', maxWidth: '820px', width: '100%' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#003E8F',
              marginBottom: '10px',
            }}
          >
            GET STARTED
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 900,
              color: '#14243A',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              marginBottom: '10px',
            }}
          >
            Build Your Expansion Plan
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            Start with your business profile. ARGUS will build the analysis around your requirements.
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px rgba(20, 36, 58, 0.07)',
            overflow: 'hidden',
            maxWidth: '820px',
            width: '100%',
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: '22px 32px',
              background: 'linear-gradient(135deg, #14243A 0%, #003E8F 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 212, 130, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} color="#FFD482" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                Create New Expansion Plan
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(173, 208, 255, 0.8)', marginTop: '2px' }}>
                Calibrate statutory requirements, foreign work passes, and first-year cost models.
              </div>
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} style={{ padding: '30px 32px 32px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px',
                marginBottom: '24px',
              }}
            >
              {/* 1. Business Name */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                  Business / Project Name
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. ApexMetrics Technologies"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/* 2. Current Country */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={13} style={{ color: 'var(--text-muted)' }} />
                  Current Country / HQ
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. India"
                  value={currentCountry}
                  onChange={(e) => setCurrentCountry(e.target.value)}
                />
              </div>

              {/* 3. Industry */}
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select
                  className="form-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as IndustryType)}
                >
                  <option value="Software / SaaS">Software / SaaS</option>
                  <option value="FinTech">FinTech</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Consulting / Professional Services">Consulting / Professional Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="EdTech">EdTech</option>
                  <option value="Food / Hospitality">Food / Hospitality</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 4. Business Scale */}
              <div className="form-group">
                <label className="form-label">Business Scale</label>
                <select
                  className="form-select"
                  value={businessScale}
                  onChange={(e) => setBusinessScale(e.target.value)}
                >
                  <option value="Early-stage (1-10 employees)">Early-stage (1–10 employees)</option>
                  <option value="Growing Startup (11-50 employees)">Growing Startup (11–50 employees)</option>
                  <option value="Mid-Market (51-200 employees)">Mid-Market (51–200 employees)</option>
                  <option value="Enterprise (201+ employees)">Enterprise (201+ employees)</option>
                </select>
              </div>

              {/* 5. Expansion Objective */}
              <div className="form-group">
                <label className="form-label">Expansion Objective</label>
                <select
                  className="form-select"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as ExpansionObjective)}
                >
                  <option value="Enter a new market">Enter a new market</option>
                  <option value="Open sales office">Open sales office</option>
                  <option value="Open development centre">Open development centre</option>
                  <option value="Hire employees">Hire employees</option>
                  <option value="Manufacturing / production">Manufacturing / production</option>
                  <option value="Retail / physical location">Retail / physical location</option>
                  <option value="Regional headquarters">Regional headquarters</option>
                  <option value="Import / export">Import / export</option>
                  <option value="Remote operations">Remote operations</option>
                </select>
              </div>

              {/* 6. Budget */}
              <div className="form-group">
                <label className="form-label">Expansion Budget Amount</label>
                <input
                  type="number"
                  step="50000"
                  required
                  className="form-input"
                  placeholder="e.g. 5000000"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* 7. Currency */}
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                >
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="GBP">GBP (£ British Pound)</option>
                  <option value="SGD">SGD (S$ Singapore Dollar)</option>
                  <option value="AED">AED (AED UAE Dirham)</option>
                </select>
              </div>

              {/* 8. Timeline */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                  Target Timeline
                </label>
                <select
                  className="form-select"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="1-3 months">1–3 months (Urgent)</option>
                  <option value="3-6 months">3–6 months (Standard Strategy)</option>
                  <option value="6-12 months">6–12 months (Comprehensive)</option>
                  <option value="12+ months">12+ months (Exploratory)</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #003E8F 0%, #14243A 100%)',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(0, 62, 143, 0.25)',
                transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 62, 143, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 62, 143, 0.25)';
              }}
            >
              Build My Expansion Plan <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>

      {/* ================================================
          PREVIOUS EXPANSION PLANS
          ================================================ */}
      <section
        style={{
          padding: '0 max(24px, calc((100% - 1280px) / 2 + 24px)) 80px',
          backgroundColor: '#F7F9FC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '820px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                }}
              >
                PREVIOUS EXPANSION PLANS
              </div>
            </div>
            <button
              onClick={scrollToForm}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '7px',
                padding: '7px 14px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                color: '#003E8F',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 62, 143, 0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              + New Plan
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PREVIOUS_ENTRIES.map((entry) => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 4px rgba(20, 36, 58, 0.04)',
                }}
                onClick={() => handleSelectPrevious(entry)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#003E8F';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 62, 143, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(20, 36, 58, 0.04)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '9px',
                      backgroundColor: 'rgba(0, 62, 143, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#003E8F',
                      fontSize: '15px',
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {entry.companyName[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-dark-navy)', lineHeight: 1.2 }}>
                      {entry.companyName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {entry.industry} &nbsp;·&nbsp; {entry.homeCountry}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Expansion: {entry.targetCountry} &nbsp;·&nbsp; Created: {entry.date}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleSelectPrevious(entry); }}
                  style={{
                    flexShrink: 0,
                    padding: '8px 14px',
                    borderRadius: '7px',
                    border: '1px solid rgba(0, 62, 143, 0.25)',
                    background: 'rgba(0, 62, 143, 0.05)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#003E8F',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#003E8F'; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 62, 143, 0.05)'; e.currentTarget.style.color = '#003E8F'; }}
                >
                  Open Dashboard <ChevronRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          FOOTER
          ================================================ */}
      <footer
        style={{
          backgroundColor: '#14243A',
          padding: '36px max(24px, calc((100% - 1280px) / 2 + 24px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #003E8F 0%, #14243A 100%)',
              border: '1px solid rgba(255, 212, 130, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={13} color="#FFD482" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '14px', color: '#FFFFFF', letterSpacing: '-0.2px' }}>
              ARGUS
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', color: '#8F5E01', textTransform: 'uppercase' }}>
              AI Business Expansion Advisor
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(173, 208, 255, 0.5)' }}>
          © 2026 ARGUS — Research Prototype · Engineering Design and Innovation (EDI)
        </div>
      </footer>
    </div>
  );
};
