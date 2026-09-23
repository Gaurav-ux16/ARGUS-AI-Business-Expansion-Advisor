import React from 'react';
import { X, FolderKanban } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { CurrencyService } from '../../services/currencyService';

export const SavedPlansModal: React.FC = () => {
  const { isSavedPlansOpen, setIsSavedPlansOpen, savedPlans, activePlan, setActivePlan } = usePlan();

  if (!isSavedPlansOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsSavedPlansOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div className="flex-gap-2">
            <FolderKanban color="var(--accent-blue)" size={22} />
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Saved Expansion Plans</h2>
          </div>
          <button
            onClick={() => setIsSavedPlansOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {savedPlans.map((plan) => {
            const isSelected = plan.id === activePlan.id;
            return (
              <div
                key={plan.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--accent-blue-light)' : '#ffffff',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setActivePlan(plan);
                  setIsSavedPlansOpen(false);
                }}
              >
                <div className="flex-between" style={{ marginBottom: '6px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{plan.name}</strong>
                  {isSelected && <span className="tag-chip score-high">ACTIVE PLAN</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Target: {plan.targetCountryCode} • Budget: {CurrencyService.format(plan.profile.expansionBudgetHomeCurrency, plan.profile.homeCurrency)} • Created: {plan.createdAt}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn-secondary" onClick={() => setIsSavedPlansOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
