import React from 'react';
import { PlanProvider, usePlan } from './context/PlanContext';
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { FactorsView } from './components/factors/FactorsView';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CountryExplorer } from './components/explorer/CountryExplorer';
import { CountryComparisonView } from './components/comparison/CountryComparisonView';
import { CostsView } from './components/costs/CostsView';
import { LabourView } from './components/labour/LabourView';
import { TaxView } from './components/tax/TaxView';
import { RegulationsView } from './components/regulations/RegulationsView';
import { CompetitorLandscapeView } from './components/map/CompetitorLandscapeView';
import { MarketView } from './components/market/MarketView';
import { RiskView } from './components/risk/RiskView';
import { ScenarioSimulatorView } from './components/simulator/ScenarioSimulatorView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportView } from './components/reports/ReportView';
import { AIAssistantDrawer } from './components/assistant/AIAssistantDrawer';
import { SourcesModal } from './components/sources/SourcesModal';
import { SavedPlansModal } from './components/plans/SavedPlansModal';

const AppContent: React.FC = () => {
  const { activeView } = usePlan();

  if (activeView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Global Nav */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar />

        <main className="content-container">
          {activeView === 'overview' && <DashboardOverview />}
          {activeView === 'onboarding' && <OnboardingWizard />}
          {activeView === 'factors' && <FactorsView />}
          {activeView === 'explorer' && <CountryExplorer />}
          {activeView === 'comparison' && <CountryComparisonView />}
          {activeView === 'costs' && <CostsView />}
          {activeView === 'labour' && <LabourView />}
          {activeView === 'tax' && <TaxView />}
          {activeView === 'regulations' && <RegulationsView />}
          {activeView === 'competitors' && <CompetitorLandscapeView />}
          {activeView === 'market' && <MarketView />}
          {activeView === 'risk' && <RiskView />}
          {activeView === 'simulator' && <ScenarioSimulatorView />}
          {activeView === 'roadmap' && <RoadmapView />}
          {activeView === 'documents' && <DocumentsView />}
          {activeView === 'reports' && <ReportView />}
        </main>
      </div>

      {/* Slide-over & Modal Overlays */}
      <AIAssistantDrawer />
      <SourcesModal />
      <SavedPlansModal />
    </div>
  );
};

export function App() {
  return (
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  );
}

export default App;
