import React, { createContext, useContext, useState } from 'react';
import type { CurrencyCode, ExpansionPlan, FactorWeights, NotificationItem } from '../types';
import { DEFAULT_EXPANSION_PLAN, MOCK_SAVED_PLANS } from '../data/mockPlans';

interface PlanContextType {
  activePlan: ExpansionPlan;
  setActivePlan: (plan: ExpansionPlan) => void;
  updatePlan: (updates: Partial<ExpansionPlan>) => void;
  setCostOverride: (itemId: string, amount: number) => void;
  resetCostOverrides: () => void;
  updateFactorWeights: (weights: FactorWeights) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  selectedCountryCode: string;
  setSelectedCountryCode: (code: string) => void;
  isExplainModalOpen: boolean;
  setIsExplainModalOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isSourcesOpen: boolean;
  setIsSourcesOpen: (open: boolean) => void;
  isSavedPlansOpen: boolean;
  setIsSavedPlansOpen: (open: boolean) => void;
  savedPlans: ExpansionPlan[];
  notifications: NotificationItem[];
  toggleChecklistItem: (id: string) => void;
  resetToDemo: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePlan, setActivePlan] = useState<ExpansionPlan>(DEFAULT_EXPANSION_PLAN);
  const [activeView, setActiveView] = useState<string>('landing');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('SG');

  // Modals
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState(false);

  const [savedPlans, setSavedPlans] = useState<ExpansionPlan[]>(MOCK_SAVED_PLANS);

  const [notifications] = useState<NotificationItem[]>([
    { id: 'n1', title: 'Singapore Tax Update 2026', message: 'Startup Tax Exemption scheme updated by IRAS.', date: '2 hours ago', read: false, type: 'update' },
    { id: 'n2', title: 'Checklist Alert', message: 'You have 12 incomplete expansion tasks for Singapore.', date: '1 day ago', read: false, type: 'warning' },
    { id: 'n3', title: 'UAE Freezone Regulatory Change', message: 'New DIFC substance rules announced.', date: '3 days ago', read: true, type: 'info' },
  ]);

  const updatePlan = (updates: Partial<ExpansionPlan>) => {
    setActivePlan((prev) => {
      const updated = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSavedPlans((plans) => plans.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    });
  };

  const setCostOverride = (itemId: string, amount: number) => {
    setActivePlan((prev) => {
      const newOverrides = {
        ...(prev.costOverrides || {}),
        [itemId]: amount,
      };
      return {
        ...prev,
        costOverrides: newOverrides,
        updatedAt: new Date().toISOString().split('T')[0],
      };
    });
  };

  const resetCostOverrides = () => {
    setActivePlan((prev) => ({
      ...prev,
      costOverrides: {},
      updatedAt: new Date().toISOString().split('T')[0],
    }));
  };

  const updateFactorWeights = (weights: FactorWeights) => {
    updatePlan({ factorWeights: weights });
  };

  const toggleChecklistItem = (id: string) => {
    setActivePlan((prev) => {
      const current = prev.completedChecklistIds || [];
      const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...prev, completedChecklistIds: updated };
    });
  };

  const resetToDemo = () => {
    setActivePlan(DEFAULT_EXPANSION_PLAN);
    setCurrency('INR');
    setSelectedCountryCode('SG');
    setActiveView('overview');
  };

  return (
    <PlanContext.Provider
      value={{
        activePlan,
        setActivePlan,
        updatePlan,
        setCostOverride,
        resetCostOverrides,
        updateFactorWeights,
        activeView,
        setActiveView,
        currency,
        setCurrency,
        selectedCountryCode,
        setSelectedCountryCode,
        isExplainModalOpen,
        setIsExplainModalOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        isSourcesOpen,
        setIsSourcesOpen,
        isSavedPlansOpen,
        setIsSavedPlansOpen,
        savedPlans,
        notifications,
        toggleChecklistItem,
        resetToDemo,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
};
