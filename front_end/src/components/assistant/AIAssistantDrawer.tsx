import React, { useState } from 'react';
import { X, Send, Sparkles, BookOpen } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { RAGService } from '../../services/ragService';
import { ScoringEngine } from '../../services/scoringEngine';
import { COUNTRIES_DATA } from '../../data/countriesData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: { title: string; source: string; url: string }[];
}

export const AIAssistantDrawer: React.FC = () => {
  const { isAssistantOpen, setIsAssistantOpen, activePlan, selectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];
  const scoreObj = ScoringEngine.calculateCountryScore(activePlan, country);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello Gaurav! I am your ARGUS Expansion Strategist. I have reviewed your profile for **${activePlan.profile.name}** (${activePlan.profile.industry}, ${activePlan.profile.homeCurrency} ${activePlan.profile.expansionBudgetHomeCurrency.toLocaleString()} budget). \n\n**${country.name}** is currently ranked your top target destination with an Expansion Readiness Score of **${scoreObj.readinessScore}/100**.\n\nHow can I assist your expansion planning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isAssistantOpen) return null;

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryText = inputMessage;
    setInputMessage('');

    // Simulate AI synthesis combining Plan Context + RAG
    setTimeout(() => {
      const rag = RAGService.query(queryText, country.code);

      let responseText = '';
      if (queryText.toLowerCase().includes('why') || queryText.toLowerCase().includes('recommend') || queryText.toLowerCase().includes('score')) {
        responseText = `Based on your plan for **${activePlan.profile.name}**, ${country.name} scored **${scoreObj.readinessScore}/100** because:\n\n• **Market Fit (+18 pts):** Strong alignment with your ${activePlan.profile.industry} (${activePlan.profile.businessModel}) model.\n• **Tax (+10 pts):** ${country.corporateTaxRate}% corporate tax rate with startup exemptions.\n• **Talent (+14 pts):** High local tech talent availability.\n\nKey Challenge: S-Pass foreign worker quotas in services sector.`;
      } else {
        responseText = rag.answer;
      }

      const citations = rag.matchedArticles.map((a) => ({
        title: a.title,
        source: a.sourceName,
        url: a.sourceUrl,
      }));

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 19, 43, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsAssistantOpen(false)}
    >
      <div
        style={{
          width: '460px',
          maxWidth: '100vw',
          backgroundColor: 'var(--bg-card)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            backgroundColor: 'var(--bg-surface)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex-gap-2">
            <div className="logo-badge" style={{ width: '30px', height: '30px', fontSize: '13px' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '15px' }}>ARGUS AI Strategist</strong>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Context-Aware Expansion Assistant</div>
            </div>
          </div>
          <button
            onClick={() => setIsAssistantOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: m.sender === 'user' ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                  color: '#ffffff',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}

                {m.citations && m.citations.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>CITATIONS & SOURCES:</div>
                    {m.citations.map((c, idx) => (
                      <div key={idx} style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={10} />
                        <span>{c.source}: {c.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                {m.timestamp}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex-gap-2">
            <input
              type="text"
              className="form-input"
              placeholder="Ask AI about costs, visas, tax, or country comparison..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="btn-primary" onClick={handleSend} style={{ padding: '10px 16px' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
