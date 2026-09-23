import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import type {
  ExpansionObjective,
  IndustryType,
  BusinessModelType,
  RoleCategory,
  CurrencyCode,
  RoleRequirement,
  FactorWeights,
} from '../../types';
import { CurrencyService } from '../../services/currencyService';
import { FactorService, FACTOR_CATEGORIES } from '../../services/factorService';
import { LabourService } from '../../services/labourService';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const WORKFORCE_CATEGORIES: { category: RoleCategory; description: string }[] = [
  { category: 'Software / IT', description: 'Engineers, architects, QA, DevOps, cloud infrastructure' },
  { category: 'Customer Support', description: 'Customer success reps, help desk, contact center agents' },
  { category: 'Sales', description: 'Account executives, SDRs, regional business development' },
  { category: 'Marketing', description: 'Growth marketing, performance marketing, content, brand' },
  { category: 'Finance / Accounting', description: 'CPAs, statutory accountants, financial controllers, payroll' },
  { category: 'Human Resources', description: 'People ops, talent acquisition, employer compliance' },
  { category: 'Management', description: 'Managing directors, VP/C-suite, general managers' },
  { category: 'Skilled Technical Workers', description: 'Technicians, field engineers, electricians, QA inspectors' },
  { category: 'Physical / Manual Labour', description: 'General labourers, construction crew, assembly workers' },
  { category: 'Warehouse / Logistics', description: 'Forklift operators, pickers, inventory coordinators' },
  { category: 'Manufacturing Workers', description: 'Plant operators, machinists, fabrication staff' },
  { category: 'Delivery / Operations', description: 'Drivers, dispatchers, fleet coordinators' },
  { category: 'Healthcare / Specialized Professionals', description: 'Licensed medical, biotech researchers, clinical staff' },
  { category: 'Other', description: 'General administrative or bespoke corporate roles' },
];

const INDUSTRY_OPTIONS: IndustryType[] = [
  'Software / SaaS',
  'E-commerce',
  'Retail',
  'Manufacturing',
  'Logistics',
  'Consulting / Professional Services',
  'Healthcare',
  'FinTech',
  'EdTech',
  'Food / Hospitality',
  'Other',
];

const OBJECTIVE_OPTIONS: ExpansionObjective[] = [
  'Enter a new market',
  'Open sales office',
  'Open development centre',
  'Hire employees',
  'Manufacturing / production',
  'Retail / physical location',
  'Regional headquarters',
  'Import / export',
  'Remote operations',
];

export const OnboardingWizard: React.FC = () => {
  const { activePlan, updatePlan, setActiveView } = usePlan();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [profile, setProfile] = useState(activePlan.profile);
  const [objectives, setObjectives] = useState<ExpansionObjective[]>(activePlan.objectives);
  const [workforce, setWorkforce] = useState<RoleRequirement[]>(activePlan.workforce);
  const [factorWeights, setFactorWeights] = useState<FactorWeights>(
    activePlan.factorWeights || {
      market: 20,
      cost: 25,
      labour: 25,
      businessEnvironment: 10,
      regulatory: 15,
      risk: 5,
    }
  );

  // Role builder state
  const [selectedCategory, setSelectedCategory] = useState<RoleCategory>('Software / IT');
  const [newCount, setNewCount] = useState<number>(3);
  const [newExp, setNewExp] = useState<'Entry' | 'Mid' | 'Senior'>('Mid');
  const [newSalary, setNewSalary] = useState<number>(5500);
  const [newPreference, setNewPreference] = useState<'Local employee' | 'Foreign employee' | 'Either'>('Either');
  const [newWorkMode, setNewWorkMode] = useState<'On-site' | 'Hybrid' | 'Remote'>('Hybrid');
  const [newLanguage, setNewLanguage] = useState<string>('English required');
  const [newQualification, setNewQualification] = useState<string>('');

  const handleObjectiveToggle = (obj: ExpansionObjective) => {
    if (objectives.includes(obj)) {
      setObjectives(objectives.filter((o) => o !== obj));
    } else {
      setObjectives([...objectives, obj]);
    }
  };

  const handleAddRole = () => {
    const item: RoleRequirement = {
      id: `wf-${Date.now()}`,
      role: selectedCategory,
      count: Math.max(1, newCount),
      experience: newExp,
      salaryExpectationMonthlyUSD: Math.max(500, newSalary),
      preference: newPreference,
      workMode: newWorkMode,
      languageRequirement: newLanguage || 'English required',
      qualification: newQualification || undefined,
      languages: ['English'],
    };
    setWorkforce([...workforce, item]);
  };

  const handleRemoveRole = (id: string) => {
    setWorkforce(workforce.filter((w) => w.id !== id));
  };

  const weightsValidation = FactorService.validateWeights(factorWeights);

  const handleFinish = () => {
    const usdBudget = Math.round(
      CurrencyService.convert(profile.expansionBudgetHomeCurrency, profile.homeCurrency, 'USD')
    );

    updatePlan({
      profile: {
        ...profile,
        expansionBudgetUSD: usdBudget,
      },
      objectives,
      workforce,
      factorWeights: FactorService.normalizeWeights(factorWeights),
    });

    setActiveView('overview');
  };

  const totalEmployeesPlanned = workforce.reduce((acc, w) => acc + w.count, 0);

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '24px 0' }}>
      {/* Progress Header */}
      <div className="argus-card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              EXPANSION CONFIGURATOR • STEP {step} OF 5
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
              {step === 1 && '1. Company Profile & Expansion Goals'}
              {step === 2 && '2. Workforce Requirements & Roles'}
              {step === 3 && '3. Expansion Factors & Priorities'}
              {step === 4 && '4. Target Destinations & Currency Budget'}
              {step === 5 && '5. Review & Generate Expansion Plan'}
            </h2>
          </div>
          <span className="score-badge score-high" style={{ fontSize: '13px', padding: '6px 14px' }}>
            {Math.round((step / 5) * 100)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${(step / 5) * 100}%`,
              backgroundColor: 'var(--accent-blue)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* STEP 1: BUSINESS PROFILE & OBJECTIVES                         */}
      {/* ============================================================ */}
      {step === 1 && (
        <div className="argus-card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Company Information</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Configure your core business details so ARGUS can tailor regulatory thresholds, corporate structure, and market sizing.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Startup / Company Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acme Global Tech"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Country / Headquarters</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. India, United States, UK"
                value={profile.currentCountry}
                onChange={(e) => setProfile({ ...profile, currentCountry: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry / Business Type</label>
              <select
                className="form-select"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value as IndustryType })}
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Business Model</label>
              <select
                className="form-select"
                value={profile.businessModel}
                onChange={(e) => setProfile({ ...profile, businessModel: e.target.value as BusinessModelType })}
              >
                <option value="B2B">B2B (Enterprise / SMB)</option>
                <option value="B2C">B2C (Consumer)</option>
                <option value="B2B2C">B2B2C (Partner)</option>
                <option value="Marketplace">Marketplace / Platform</option>
                <option value="Subscription">Subscription / Recurring</option>
                <option value="Physical Product">Physical Product / Hardware</option>
                <option value="Services">Consulting / Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Company Size</label>
              <select
                className="form-select"
                value={profile.companySize}
                onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
              >
                <option value="1-10 employees">1–10 employees</option>
                <option value="11-50 employees">11–50 employees</option>
                <option value="51-200 employees">51–200 employees</option>
                <option value="201+ employees">201+ employees</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Annual Revenue (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. $450,000 USD or ₹3.5 Cr"
                value={profile.currentRevenueText || ''}
                onChange={(e) => setProfile({ ...profile, currentRevenueText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Expansion Timeline</label>
              <select
                className="form-select"
                value={profile.timeline}
                onChange={(e) => setProfile({ ...profile, timeline: e.target.value })}
              >
                <option value="1-3 months">1–3 months (Immediate Execution)</option>
                <option value="3-6 months">3–6 months (Standard Strategy)</option>
                <option value="6-12 months">6–12 months (Medium-term Planning)</option>
                <option value="12+ months">12+ months (Exploratory)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Has Physical Goods / Inventory?</label>
              <select
                className="form-select"
                value={profile.hasPhysicalProducts ? 'yes' : 'no'}
                onChange={(e) => setProfile({ ...profile, hasPhysicalProducts: e.target.value === 'yes' })}
              >
                <option value="no">No (Digital / Software / Pure Services)</option>
                <option value="yes">Yes (Requires warehousing, customs, or physical shipping)</option>
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>
              Primary Expansion Objectives (Select all that apply)
            </label>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              ARGUS uses your selected objectives to evaluate foreign ownership restrictions and local branch vs. subsidiary structures.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {OBJECTIVE_OPTIONS.map((obj) => {
                const selected = objectives.includes(obj);
                return (
                  <button
                    key={obj}
                    type="button"
                    style={{
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: selected ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                      backgroundColor: selected ? 'var(--accent-blue-light)' : '#ffffff',
                      color: selected ? 'var(--accent-blue)' : 'var(--text-primary)',
                      fontWeight: selected ? 700 : 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => handleObjectiveToggle(obj)}
                  >
                    {selected && <Check size={16} />}
                    <span>{obj}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: WORKFORCE REQUIREMENTS ACROSS 14 CATEGORIES          */}
      {/* ============================================================ */}
      {step === 2 && (
        <div>
          <div className="argus-card" style={{ marginBottom: '20px' }}>
            <div className="flex-between">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Workforce Roles & Staffing Requirements</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Specify the exact types of employees you plan to hire. Avoid generic employee numbers.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  TOTAL WORKFORCE
                </span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-blue)' }} className="text-mono">
                  {totalEmployeesPlanned} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Staff</span>
                </div>
              </div>
            </div>

            {/* List of currently added roles */}
            <div style={{ marginTop: '16px' }}>
              {workforce.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px dashed var(--border-color)',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                  }}
                >
                  No roles configured yet. Use the role builder below to select categories, counts, and salary expectations.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {workforce.map((w) => (
                    <div
                      key={w.id}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <div className="flex-gap-2">
                          <strong style={{ fontSize: '15px' }}>{w.role}</strong>
                          <span className="tag-chip score-high" style={{ fontWeight: 700 }}>
                            {w.count} {w.count === 1 ? 'employee' : 'employees'}
                          </span>
                          <span className="tag-chip">{w.experience} Tier</span>
                          <span className="tag-chip">{w.preference}</span>
                          <span className="tag-chip">{w.workMode}</span>
                        </div>

                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-red)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                          }}
                          onClick={() => handleRemoveRole(w.id)}
                        >
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>

                      <div className="grid-3" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <div>
                          <strong>Est. Salary:</strong> ${w.salaryExpectationMonthlyUSD.toLocaleString()} USD / mo
                        </div>
                        <div>
                          <strong>Language:</strong> {w.languageRequirement || 'English'}
                        </div>
                        <div>
                          <strong>Qualification:</strong> {w.qualification || 'Standard'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Role Card */}
          <div
            className="argus-card"
            style={{
              border: '2px solid var(--accent-blue-border)',
              backgroundColor: '#fafcff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Plus size={18} color="var(--accent-blue)" />
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                Add Required Role from 14 Categories
              </h4>
            </div>

            <div className="grid-3" style={{ gap: '16px', marginBottom: '16px' }}>
              {/* Category */}
              <div>
                <label className="form-label">1. Workforce Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    const cat = e.target.value as RoleCategory;
                    setSelectedCategory(cat);
                    const bm = LabourService.getRoleBenchmark('SG', cat);
                    setNewSalary(Math.round((bm.monthlySalaryUSD.mid.min + bm.monthlySalaryUSD.mid.max) / 2));
                  }}
                >
                  {WORKFORCE_CATEGORIES.map((c) => (
                    <option key={c.category} value={c.category}>
                      {c.category}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {WORKFORCE_CATEGORIES.find((c) => c.category === selectedCategory)?.description}
                </div>
              </div>

              {/* Number of Employees */}
              <div>
                <label className="form-label">2. Number of Employees</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  className="form-input"
                  value={newCount}
                  onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Experience Tier */}
              <div>
                <label className="form-label">3. Experience Level</label>
                <select
                  className="form-select"
                  value={newExp}
                  onChange={(e) => {
                    const exp = e.target.value as 'Entry' | 'Mid' | 'Senior';
                    setNewExp(exp);
                    const bm = LabourService.getRoleBenchmark('SG', selectedCategory);
                    const tier = exp === 'Entry' ? bm.monthlySalaryUSD.entry : exp === 'Senior' ? bm.monthlySalaryUSD.senior : bm.monthlySalaryUSD.mid;
                    setNewSalary(Math.round((tier.min + tier.max) / 2));
                  }}
                >
                  <option value="Entry">Entry (0–2 years)</option>
                  <option value="Mid">Mid-level (3–6 years)</option>
                  <option value="Senior">Senior / Lead (7+ years)</option>
                </select>
              </div>

              {/* Salary Expectation */}
              <div>
                <label className="form-label">4. Expected Monthly Salary ($ USD)</label>
                <input
                  type="number"
                  step="250"
                  className="form-input"
                  value={newSalary}
                  onChange={(e) => setNewSalary(parseInt(e.target.value) || 1000)}
                />
              </div>

              {/* Local vs Foreign Preference */}
              <div>
                <label className="form-label">5. Local vs. Foreign Preference</label>
                <select
                  className="form-select"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value as any)}
                >
                  <option value="Local employee">Local employee (Resident / Citizen)</option>
                  <option value="Foreign employee">Foreign employee (Requires Work Pass)</option>
                  <option value="Either">Either (No strict preference)</option>
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="form-label">6. Work Mode</label>
                <select
                  className="form-select"
                  value={newWorkMode}
                  onChange={(e) => setNewWorkMode(e.target.value as any)}
                >
                  <option value="Hybrid">Hybrid (In-office + Remote)</option>
                  <option value="On-site">On-site (Mandatory office presence)</option>
                  <option value="Remote">Remote (Distributed within country)</option>
                </select>
              </div>

              {/* Language Requirement */}
              <div>
                <label className="form-label">7. Language Requirement</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. English required, German B2"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                />
              </div>

              {/* Qualification */}
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label">8. Required Qualification (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B.Tech / B.S. in CS, CFA, Certified Welder"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                />
              </div>
            </div>

            <button type="button" className="btn-primary btn-sm" onClick={handleAddRole}>
              <Plus size={15} /> Add Role to Workforce Plan
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: FACTORS & PRIORITIES (100% SUM VALIDATION)            */}
      {/* ============================================================ */}
      {step === 3 && (
        <div className="argus-card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Expansion Decision Factors & Weights</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Define what matters most for your international expansion. These weights directly calculate your personalized Country Readiness Scores.
            </p>
          </div>

          {/* Validation Alert */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: weightsValidation.isValid ? 'var(--accent-green-bg)' : '#fef2f2',
              border: weightsValidation.isValid ? '1px solid #a7f3d0' : '1px solid #fecaca',
              color: weightsValidation.isValid ? 'var(--accent-green)' : '#dc2626',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
              {weightsValidation.isValid ? <Check size={18} /> : <AlertTriangle size={18} />}
              <span>{weightsValidation.message}</span>
            </div>
            <span className="text-mono" style={{ fontSize: '18px', fontWeight: 800 }}>
              {weightsValidation.sum}% / 100%
            </span>
          </div>

          {/* Factor Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {FACTOR_CATEGORIES.map((cat) => {
              const weightValue = factorWeights[cat.key];
              return (
                <div
                  key={cat.key}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '15px' }}>{cat.name}</strong>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {cat.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                        {weightValue}%
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={weightValue}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setFactorWeights({
                        ...factorWeights,
                        [cat.key]: val,
                      });
                    }}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />

                  {/* Sub-factors checklist */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {cat.subFactors.map((sub) => (
                      <span
                        key={sub.id}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        • {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setFactorWeights(FactorService.normalizeWeights(factorWeights))}
            >
              Auto-Balance to 100%
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: BUDGET & FX CONVERSION PREVIEW                       */}
      {/* ============================================================ */}
      {step === 4 && (
        <div className="argus-card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Expansion Budget & Home Currency</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Set your committed capital. ARGUS converts this into local target country currencies and runs budget sufficiency tests.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Home Currency</label>
              <select
                className="form-select"
                value={profile.homeCurrency}
                onChange={(e) => setProfile({ ...profile, homeCurrency: e.target.value as CurrencyCode })}
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="SGD">SGD (S$ Singapore Dollar)</option>
                <option value="AED">AED (AED UAE Dirham)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Total Expansion Capital ({profile.homeCurrency})
              </label>
              <input
                type="number"
                step="10000"
                className="form-input"
                value={profile.expansionBudgetHomeCurrency}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    expansionBudgetHomeCurrency: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* Dynamic FX Conversion Preview */}
          <div
            style={{
              backgroundColor: 'var(--accent-blue-light)',
              border: '1px solid var(--accent-blue-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '12px' }}>
              REAL-TIME TARGET CURRENCY EQUIVALENTS
            </div>

            <div className="grid-4" style={{ gap: '12px' }}>
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>USD Equivalent (Base)</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }} className="text-mono">
                  {CurrencyService.format(
                    CurrencyService.convert(profile.expansionBudgetHomeCurrency, profile.homeCurrency, 'USD'),
                    'USD'
                  )}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Singapore Dollar (SGD)</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-blue)' }} className="text-mono">
                  {CurrencyService.format(
                    CurrencyService.convert(profile.expansionBudgetHomeCurrency, profile.homeCurrency, 'SGD'),
                    'SGD'
                  )}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>UAE Dirham (AED)</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-green)' }} className="text-mono">
                  {CurrencyService.format(
                    CurrencyService.convert(profile.expansionBudgetHomeCurrency, profile.homeCurrency, 'AED'),
                    'AED'
                  )}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Euro (EUR)</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }} className="text-mono">
                  {CurrencyService.format(
                    CurrencyService.convert(profile.expansionBudgetHomeCurrency, profile.homeCurrency, 'EUR'),
                    'EUR'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 5: REVIEW & GENERATE                                    */}
      {/* ============================================================ */}
      {step === 5 && (
        <div className="argus-card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Confirm Your Expansion Parameters</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              ARGUS is ready to execute personalized scoring, compute initial setup + recurring operating costs, and cross-reference official regulatory documents.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                COMPANY & EXPANSION PROFILE
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>{profile.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {profile.industry} • {profile.businessModel} • Headquartered in {profile.currentCountry}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Target timeline: <strong>{profile.timeline}</strong>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                STAFFING & CAPITAL COMMITMENT
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>
                {totalEmployeesPlanned} Employees across {workforce.length} Roles
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Budget: {CurrencyService.format(profile.expansionBudgetHomeCurrency, profile.homeCurrency)} (≈ $
                {CurrencyService.convert(profile.expansionBudgetHomeCurrency, profile.homeCurrency, 'USD').toLocaleString()} USD)
              </div>
            </div>
          </div>

          {/* Workforce Summary Pill Bar */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Configured Roles:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {workforce.map((w) => (
                <span key={w.id} className="tag-chip score-high" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <strong>{w.role}</strong> ({w.count} • {w.experience} • {w.preference})
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--accent-blue-light)',
              border: '1px solid var(--accent-blue-border)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--accent-blue)',
            }}
          >
            <strong>Note on Official Data:</strong> Statutory fees (e.g. ACRA S$315 incorporation, MOM EP filings) are cited from official registries. Operational cost estimates and benchmark salaries are derived from regional economic datasets.
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* WIZARD NAVIGATION CONTROLS                                   */}
      {/* ============================================================ */}
      <div className="flex-between" style={{ marginTop: '24px' }}>
        <button
          type="button"
          className="btn-secondary"
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          style={{ opacity: step === 1 ? 0.5 : 1 }}
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {step < 5 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              if (step === 3 && !weightsValidation.isValid) {
                alert('Please ensure your factor weights total exactly 100% before proceeding, or click "Auto-Balance to 100%".');
                return;
              }
              setStep(step + 1);
            }}
          >
            Next Step <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: 'var(--accent-green)', padding: '12px 24px' }}
            onClick={handleFinish}
          >
            <Sparkles size={16} /> GENERATE EXPANSION PLAN & ANALYSIS <Check size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
