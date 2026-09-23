import React from 'react';
import { Search, Bell, Sparkles, FolderKanban, ShieldCheck, User } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import type { CurrencyCode } from '../../types';
import { SUPPORTED_CURRENCIES } from '../../data/countriesData';

export const Topbar: React.FC = () => {
  const {
    currency,
    setCurrency,
    activePlan,
    setIsAssistantOpen,
    setIsSourcesOpen,
    setIsSavedPlansOpen,
    notifications,
  } = usePlan();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      {/* Search Input */}
      <div className="topbar-left">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search countries, tax laws, visas, regulations..."
          />
        </div>
      </div>

      {/* Control Actions */}
      <div className="topbar-right">
        {/* Currency Selector */}
        <div className="flex-gap-2">
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Currency:
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}
          >
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} ({c.name})
              </option>
            ))}
          </select>
        </div>

        {/* AI Assistant Button */}
        <button
          className="btn-primary btn-sm"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)' }}
          onClick={() => setIsAssistantOpen(true)}
        >
          <Sparkles size={15} />
          <span>AI Advisor</span>
        </button>

        {/* Sources & Trust Modal */}
        <button
          className="btn-secondary btn-sm"
          onClick={() => setIsSourcesOpen(true)}
          title="Data Sources & Trust"
        >
          <ShieldCheck size={15} color="#059669" />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Sources</span>
        </button>

        {/* Current Plan Indicator */}
        <button
          className="btn-secondary btn-sm"
          onClick={() => setIsSavedPlansOpen(true)}
          style={{ gap: '6px' }}
        >
          <FolderKanban size={15} />
          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activePlan.name}
          </span>
        </button>

        {/* Notifications Button */}
        <button
          className="btn-secondary btn-sm"
          style={{ position: 'relative', padding: '8px 10px' }}
          onClick={() => alert(`Notifications (${unreadCount} unread):\n\n` + notifications.map((n) => `• ${n.title}: ${n.message}`).join('\n\n'))}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--accent-red)',
                borderRadius: '50%',
              }}
            />
          )}
        </button>

        {/* User Profile */}
        <div className="flex-gap-2" style={{ paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <User size={18} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.2 }}>Gaurav S.</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Founder / Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
