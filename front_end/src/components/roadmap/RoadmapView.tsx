import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { CheckSquare, Square, CheckCircle2, Clock } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { activePlan, selectedCountryCode, toggleChecklistItem } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];

  const checklistItems = [
    { id: 'chk-1', stepNumber: 1, label: 'Market sizing, competitor benchmarking & local TAM/SAM validation', phase: 'Step 1: Market Validation' },
    { id: 'chk-2', stepNumber: 1, label: 'Determine company corporate entity structure (Pte Ltd / FZ-LLC / GmbH)', phase: 'Step 1: Market Validation' },
    { id: 'chk-3', stepNumber: 2, label: country.code === 'SG' ? 'Reserve company name with ACRA BizFile+' : country.code === 'AE' ? 'Reserve trade name with DED / Free Zone authority' : 'Reserve trade name with Handelsregister', phase: 'Step 2: Business Registration' },
    { id: 'chk-4', stepNumber: 2, label: 'Appoint local resident director / company secretary / legal agent', phase: 'Step 2: Business Registration' },
    { id: 'chk-5', stepNumber: 2, label: 'Complete incorporation filing & obtain Certificate of Incorporation', phase: 'Step 2: Business Registration' },
    { id: 'chk-6', stepNumber: 3, label: 'Open multi-currency corporate bank account (DBS / Wio / Deutsche Bank / Aspire)', phase: 'Step 3: Banking & Finance' },
    { id: 'chk-7', stepNumber: 3, label: 'Register for national Corporate Tax ID & GST/VAT identification number', phase: 'Step 3: Banking & Finance' },
    { id: 'chk-8', stepNumber: 4, label: country.code === 'SG' ? 'Submit EP / COMPASS work pass applications on MOM portal' : 'Process local residence visas & MOHRE labor registration', phase: 'Step 4: Hiring' },
    { id: 'chk-9', stepNumber: 4, label: 'Set up statutory payroll & mandatory pension contribution system (CPF / GPSSA / Pension)', phase: 'Step 4: Hiring' },
    { id: 'chk-10', stepNumber: 5, label: country.code === 'SG' ? 'Appoint Data Protection Officer (DPO) under PDPA' : 'Appoint Data Protection Officer under GDPR / UAE Data Law', phase: 'Step 5: Licensing & Compliance' },
    { id: 'chk-11', stepNumber: 5, label: 'Obtain sector-specific operating licenses (FinTech/MAS, Health, E-commerce)', phase: 'Step 5: Licensing & Compliance' },
    { id: 'chk-12', stepNumber: 6, label: 'Secure physical or flex-office commercial lease agreement', phase: 'Step 6: Operations' },
    { id: 'chk-13', stepNumber: 6, label: 'Procure mandatory commercial insurance & statutory workplace coverage', phase: 'Step 6: Operations' },
    { id: 'chk-14', stepNumber: 7, label: 'Final end-to-end operational dry run & customer transaction audit', phase: 'Step 7: Launch' },
    { id: 'chk-15', stepNumber: 7, label: 'Official commercial market launch & public PR campaign', phase: 'Step 7: Launch' },
  ];

  const completedIds = activePlan.completedChecklistIds || [];
  const completedCount = completedIds.length;
  const progressPct = Math.round((completedCount / checklistItems.length) * 100);

  // 7-step timeline requested by user
  const steps = [
    {
      number: 1,
      title: 'Market Validation',
      duration: 'Weeks 1–2',
      authority: 'Internal & Market Intelligence',
      desc: 'TAM/SAM validation, competitor mapping, target customer research, and corporate structure evaluation.',
    },
    {
      number: 2,
      title: 'Business Registration',
      duration: 'Weeks 2–4',
      authority: country.code === 'SG' ? 'ACRA Singapore (BizFile+)' : country.code === 'AE' ? 'DET / DED / Free Zone Authority' : 'Commercial Register (Handelsregister)',
      desc: 'Company name reservation, constitution filing, resident director appointment, and official registration.',
    },
    {
      number: 3,
      title: 'Banking & Finance',
      duration: 'Weeks 4–6',
      authority: country.code === 'SG' ? 'MAS / Tier-1 Banks' : country.code === 'AE' ? 'CBUAE / Wio / Emirates NBD' : 'BaFin / Bundesbank / Tier-1 Bank',
      desc: 'Corporate business account opening, initial capital deposit, tax ID, and VAT/GST registration.',
    },
    {
      number: 4,
      title: 'Hiring',
      duration: 'Weeks 6–8',
      authority: country.code === 'SG' ? 'Ministry of Manpower (MOM)' : country.code === 'AE' ? 'MOHRE & ICP' : 'Federal Employment Agency (Arbeitsagentur)',
      desc: 'Job listings, work pass sponsorship (COMPASS / Green Visa / EU Blue Card), payroll and mandatory pension registration.',
    },
    {
      number: 5,
      title: 'Licensing & Compliance',
      duration: 'Weeks 8–10',
      authority: country.code === 'SG' ? 'PDPC & Industry Regulators' : country.code === 'AE' ? 'Federal Data Office & Sector Regulators' : 'BfDI & Sector Supervisory Bodies',
      desc: 'Data privacy framework implementation (PDPA/GDPR), DPO appointment, and industry license acquisition.',
    },
    {
      number: 6,
      title: 'Operations',
      duration: 'Weeks 10–12',
      authority: 'Commercial Landlord / Insurer',
      desc: 'Office lease execution, IT infrastructure deployment, legal supplier agreements, and corporate insurance.',
    },
    {
      number: 7,
      title: 'Launch',
      duration: 'Week 12+',
      authority: 'Market Operations & Go-to-Market',
      desc: 'First commercial transactions, localized marketing campaigns, support operations, and go-to-market execution.',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
          STRATEGIC ROADMAP
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-dark-navy)', marginBottom: '6px' }}>
          Expansion Roadmap & 7-Step Timeline
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Sequential execution path and milestone checklist for expanding to <strong>{country.name}</strong>.
        </p>
      </div>

      {/* Progress Header */}
      <div className="argus-card" style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderTop: '4px solid var(--color-primary-blue)' }}>
        <div className="flex-between" style={{ marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EXPANSION READINESS PROGRESS
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '4px' }}>
              {completedCount} of {checklistItems.length} Milestones Completed ({progressPct}%)
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`score-badge ${progressPct >= 70 ? 'score-high' : 'score-medium'}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
              {progressPct}% READY
            </span>
          </div>
        </div>

        <div style={{ height: '8px', backgroundColor: 'var(--color-light-blue)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              backgroundColor: 'var(--color-primary-blue)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* 7-Step Timeline */}
        <div className="argus-card">
          <div className="flex-between" style={{ marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
                7-Step Execution Timeline
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Sequential expansion milestones for {country.name}
              </p>
            </div>
            <span className="tag-chip" style={{ color: 'var(--color-primary-blue)', borderColor: 'rgba(0, 62, 143, 0.25)', backgroundColor: 'var(--color-light-blue)' }}>
              12 Weeks Total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
            {steps.map((s) => {
              const stepTasks = checklistItems.filter((i) => i.stepNumber === s.number);
              const stepDone = stepTasks.length > 0 && stepTasks.every((i) => completedIds.includes(i.id));

              return (
                <div
                  key={s.number}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: stepDone ? 'rgba(0, 62, 143, 0.04)' : 'var(--bg-card-subtle)',
                    borderRadius: '8px',
                    border: stepDone ? '1px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: stepDone ? 'var(--color-primary-blue)' : 'var(--color-light-blue)',
                          color: stepDone ? '#FFFFFF' : 'var(--color-primary-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}
                      >
                        {stepDone ? <CheckCircle2 size={16} /> : s.number}
                      </div>
                      <strong style={{ fontSize: '14px', color: 'var(--color-dark-navy)' }}>
                        {s.number}. {s.title}
                      </strong>
                    </div>
                    <span className="tag-chip" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {s.duration}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
                    {s.desc}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Regulatory Authority: <span style={{ color: 'var(--color-dark-navy)', fontWeight: 600 }}>{s.authority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Checklist */}
        <div className="argus-card">
          <div className="flex-between" style={{ marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-dark-navy)' }}>
                Milestone Action Items
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Click to mark operational steps complete
              </p>
            </div>
            <span className="score-badge score-high" style={{ fontSize: '11px' }}>
              {completedCount} / {checklistItems.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {checklistItems.map((item) => {
              const checked = completedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: checked ? '1px solid var(--color-primary-blue)' : '1px solid var(--border-color)',
                    backgroundColor: checked ? 'rgba(0, 62, 143, 0.05)' : 'var(--bg-card-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <div style={{ marginTop: '2px', color: checked ? 'var(--color-primary-blue)' : 'var(--text-muted)' }}>
                    {checked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: checked ? 600 : 500,
                        color: checked ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: checked ? 'line-through' : 'none',
                        lineHeight: '1.4',
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: '11px', color: checked ? 'var(--color-primary-blue)' : 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                      {item.phase}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
