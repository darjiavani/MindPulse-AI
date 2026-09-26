// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  Brain, 
  Sparkles, 
  ArrowUpRight, 
  Smile, 
  Meh, 
  Frown, 
  Wind, 
  Bot, 
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

export default function Dashboard({ setActiveTab, stressData, user }) {
  const [selectedMood, setSelectedMood] = useState('Calm');

  const currentScore = stressData?.stressScore ?? 42;
  const stressLevel = stressData?.stressLevel ?? 'Mild';

  // SVG Gauge calculations
  const circumference = 2 * Math.PI * 70;
  const strokeOffset = circumference - (currentScore / 100) * circumference;

  let gaugeColor = '#10B981'; // emerald
  if (currentScore > 70) gaugeColor = '#F43F5E'; // rose
  else if (currentScore > 45) gaugeColor = '#F59E0B'; // amber

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
          <div>
            <div className="glass-pill" style={{ marginBottom: '12px', color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)' }}>
              <Sparkles size={14} /> AI Personal Health Monitor
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
              Welcome back{user ? `, ${user.name}` : ''} to your <span className="gradient-text">Mindful Space</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '600px' }}>
              Your real-time AI biometrics indicate your stress levels are currently stable. Explore guided tools or run a quick scan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveTab('analyzer')} className="btn-primary">
              <Activity size={18} />
              <span>Start AI Stress Scan</span>
            </button>
            <button onClick={() => setActiveTab('toolkit')} className="btn-secondary">
              <Wind size={18} />
              <span>Quick Reliever</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Stress Meter & Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Stress Meter Card */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Stress Gauge</h3>
            <span className={`badge ${currentScore > 70 ? 'badge-high' : currentScore > 45 ? 'badge-medium' : 'badge-low'}`}>
              {stressLevel}
            </span>
          </div>

          <div className="gauge-container" style={{ margin: '16px 0' }}>
            <svg className="gauge-svg" viewBox="0 0 160 160">
              <circle className="gauge-bg" cx="80" cy="80" r="70" />
              <circle 
                className="gauge-progress" 
                cx="80" 
                cy="80" 
                r="70" 
                stroke={gaugeColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                style={{ filter: `drop-shadow(0 0 12px ${gaugeColor})` }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{currentScore}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>/ 100 Index</span>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {currentScore > 70 
              ? 'High cognitive tension detected. We recommend taking an immediate breathing pause.'
              : currentScore > 45
              ? 'Moderate stress load. Your nervous system is coping, but rest is recommended.'
              : 'Optimal psychological state. Your cognitive load and heart rate are balanced.'}
          </p>

          <button onClick={() => setActiveTab('analyzer')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Full Multi-Modal AI Analysis <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Biometrics & Indicators Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} color="#10B981" />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>HRV Index</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>68 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>ms</span></div>
            <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <TrendingDown size={12} /> Optimal parasympathetic activity
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={20} color="#818CF8" />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sleep Rest Score</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>84 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>%</span></div>
            <span style={{ fontSize: '0.75rem', color: '#818CF8', marginTop: '6px', display: 'block' }}>
              7h 45m deep sleep recorded
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} color="#06B6D4" />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cognitive Load</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>38 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>%</span></div>
            <span style={{ fontSize: '0.75rem', color: '#06B6D4', marginTop: '6px', display: 'block' }}>
              Focus levels optimal
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#F59E0B" />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Burnout Guard</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>Low Risk</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
              No critical fatigue flags
            </span>
          </div>

        </div>

      </div>

      {/* Mood Check-In & Quick Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Daily Mood Check-In */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
            Daily Emotional Check-In
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            How would you describe your mental state right now?
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {[
              { label: 'Calm', icon: Smile, color: '#10B981' },
              { label: 'Focused', icon: Brain, color: '#06B6D4' },
              { label: 'Anxious', icon: Meh, color: '#F59E0B' },
              { label: 'Exhausted', icon: Frown, color: '#F43F5E' }
            ].map(m => {
              const Icon = m.icon;
              const isSelected = selectedMood === m.label;
              return (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  style={{
                    flex: 1,
                    minWidth: '70px',
                    padding: '14px 10px',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-glass)',
                    background: isSelected ? `${m.color}22` : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? m.color : 'var(--text-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={22} color={isSelected ? m.color : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            💡 Logged state: <strong style={{ color: 'var(--text-main)' }}>{selectedMood}</strong>. AI is tuning your recommendations accordingly.
          </div>
        </div>

        {/* Quick Therapy & AI Modules */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
            Recommended AI Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div 
              onClick={() => setActiveTab('chat')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} color="#818CF8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Chat with AI CBT MindBot</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guided thought reframing assistant</span>
                </div>
              </div>
              <ArrowUpRight size={18} color="#818CF8" />
            </div>

            <div 
              onClick={() => setActiveTab('assessments')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} color="#06B6D4" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Take PHQ-9 / GAD-7 Test</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standardized clinical self-assessment</span>
                </div>
              </div>
              <ArrowUpRight size={18} color="#06B6D4" />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
