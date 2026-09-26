// src/components/Sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Bot, 
  ClipboardList, 
  Wind, 
  BarChart3, 
  PhoneCall, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analyzer', label: 'AI Stress Analyzer', icon: Activity, badge: 'AI Multi-Modal' },
    { id: 'chat', label: 'CBT MindBot', icon: Bot, badge: 'Interactive' },
    { id: 'toolkit', label: 'Relief Toolkit', icon: Wind, badge: 'Audio Synth' },
    { id: 'assessments', label: 'Clinical Tests', icon: ClipboardList, badge: 'PHQ-9/GAD-7' },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, badge: null },
    { id: 'helplines', label: 'Crisis Resources', icon: PhoneCall, badge: '24/7' }
  ];

  return (
    <aside style={{ width: '280px', flexShrink: 0, padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="glass-panel">
      <div style={{ padding: '0 12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Navigation Hub
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '14px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)' : 'transparent',
                borderLeft: isActive ? '4px solid var(--accent-indigo)' : '4px solid transparent',
                color: isActive ? '#FFF' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={20} color={isActive ? '#38BDF8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#38BDF8' : 'var(--text-dim)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight size={16} color="#38BDF8" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick AI Quote Card */}
      <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="#818CF8" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818CF8' }}>Daily Mindful AI Tip</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          "Stress is a signal to reset, not a measure of your worth. Take 3 deep breaths right now."
        </p>
      </div>
    </aside>
  );
}
