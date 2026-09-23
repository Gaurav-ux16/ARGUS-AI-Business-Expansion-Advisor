import React from 'react';
import {
  LayoutDashboard,
  Compass,
  GitCompare,
  DollarSign,
  Users,
  Building2,
  Scale,
  TrendingUp,
  ShieldAlert,
  MapPin,
  FileText,
  SlidersHorizontal,
  Map,
  Sparkles,
  RotateCcw,
  Sliders,
  FolderOpen,
} from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setIsSavedPlansOpen } = usePlan();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'explorer', label: 'Country Explorer', icon: Compass },
    { id: 'comparison', label: 'Country Comparison', icon: GitCompare },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    { id: 'labour', label: 'Labour', icon: Users },
    { id: 'factors', label: 'Factors', icon: SlidersHorizontal },
    { id: 'tax', label: 'Tax & Finance', icon: Building2 },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'regulations', label: 'Regulations & RAG', icon: Scale },
    { id: 'competitors', label: 'Competitor Landscape', icon: Map },
    { id: 'risk', label: 'Risk', icon: ShieldAlert },
    { id: 'simulator', label: 'Scenario Simulator', icon: Sliders },
    { id: 'roadmap', label: 'Expansion Roadmap', icon: MapPin },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="logo-badge">A</div>
        <div className="brand-info">
          <h1>ARGUS</h1>
          <p>Expansion Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">MAIN NAVIGATION</div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="sidebar-footer">
        <button
          className="nav-item"
          style={{ color: 'var(--color-warm-gold)' }}
          onClick={() => setActiveView('onboarding')}
        >
          <Sparkles size={16} />
          <span>Configurator Wizard</span>
        </button>
        <button className="nav-item" onClick={() => setIsSavedPlansOpen(true)}>
          <FolderOpen size={16} />
          <span>Saved Plans</span>
        </button>
        <button className="nav-item" onClick={() => setActiveView('landing')}>
          <RotateCcw size={16} />
          <span>New Entry Screen</span>
        </button>
      </div>
    </aside>
  );
};
