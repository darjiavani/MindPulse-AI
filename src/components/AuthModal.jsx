// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { loginApi, registerApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (isRegister) {
      if (!name.trim() || !email.trim() || !password) {
        setErrorMsg('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }
      const res = await registerApi(name, email, password);
      setIsLoading(false);
      if (res.success) {
        onAuthSuccess(res.user, res.token);
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to register account.');
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter your email and password.');
        setIsLoading(false);
        return;
      }
      const res = await loginApi(email, password);
      setIsLoading(false);
      if (res.success) {
        onAuthSuccess(res.user, res.token);
        onClose();
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    }
  };

  const handleFillDemo = () => {
    setIsRegister(false);
    setEmail('demo@mindpulse.ai');
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 11, 21, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Lock size={24} color="#FFF" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegister ? 'Join MindPulse AI to sync your mental health analytics' : 'Sign in to access your saved stress reports and CBT history'}
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#FB7185',
            fontSize: '0.85rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '8px', justifyContent: 'center' }}>
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{isLoading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Fill Helper */}
        {!isRegister && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              onClick={handleFillDemo}
              className="glass-pill"
              style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
            >
              <Sparkles size={12} /> Auto-fill Demo Account credentials
            </button>
          </div>
        )}

        {/* Footer Toggle */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
            style={{ background: 'transparent', border: 'none', color: '#818CF8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Sign In' : 'Register now'}
          </button>
        </div>

      </div>
    </div>
  );
}
