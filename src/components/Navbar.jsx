// src/components/Navbar.jsx
import React from 'react';
import { BrainCircuit, ShieldAlert, Volume2, VolumeX, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ activeTab, onOpenSOS, isAudioActive, onToggleGlobalAudio, user, onOpenAuth, onLogout }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <BrainCircuit size={24} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }} className="gradient-text">
              MindPulse AI
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              INTELLIGENT STRESS & MENTAL WELLNESS SYSTEM
            </span>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Audio Quick Sound Toggle */}
          <button 
            onClick={onToggleGlobalAudio}
            className="glass-pill"
            style={{ cursor: 'pointer', border: isAudioActive ? '1px solid var(--accent-emerald)' : '1px solid var(--border-glass)', color: isAudioActive ? '#34D399' : 'var(--text-muted)' }}
            title="Toggle Ambient Audio"
          >
            {isAudioActive ? <Volume2 size={16} color="#34D399" /> : <VolumeX size={16} />}
            <span>{isAudioActive ? 'Soundscapes On' : 'Muted'}</span>
          </button>

          {/* User Auth Profile / Login Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="glass-pill" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#FFF' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: user.avatarColor || '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#000'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user.name}</span>
              </div>

              <button onClick={onLogout} className="glass-pill" style={{ cursor: 'pointer', color: '#FB7185', borderColor: 'rgba(244, 63, 94, 0.3)' }} title="Sign Out">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <LogIn size={16} />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Emergency Crisis Button */}
          <button onClick={onOpenSOS} className="btn-danger">
            <ShieldAlert size={18} />
            <span>Crisis SOS</span>
          </button>

        </div>

      </div>
    </header>
  );
}
