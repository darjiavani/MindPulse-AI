// src/components/EmergencySOS.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Globe, 
  X, 
  HeartHandshake, 
  Wind, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { fetchCrisisHelplines } from '../services/api';

export default function EmergencySOS({ isOpen, onClose, setActiveTab }) {
  const [helplines, setHelplines] = useState([]);
  const [safetyContacts, setSafetyContacts] = useState([
    { name: 'Dr. Sarah Jenkins (Therapist)', phone: '+1 (555) 234-5678' },
    { name: 'Close Friend / Support Person', phone: '+1 (555) 987-6543' }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  useEffect(() => {
    fetchCrisisHelplines().then(data => setHelplines(data));
  }, []);

  const addContact = () => {
    if (!newContactName || !newContactPhone) return;
    setSafetyContacts(prev => [...prev, { name: newContactName, phone: newContactPhone }]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const removeContact = (idx) => {
    setSafetyContacts(prev => prev.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 11, 21, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        boxShadow: '0 0 40px rgba(244, 63, 94, 0.25)',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* SOS Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)' }}>
            <ShieldAlert size={28} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text-rose">
              24/7 Crisis Support & Helplines
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              If you or someone you know is in immediate danger, please reach out to these confidential 24/7 free services.
            </p>
          </div>
        </div>

        {/* Quick Grounding Action Banner */}
        <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wind size={22} color="#06B6D4" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38BDF8' }}>Need an Immediate Calming Pause?</h4>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Guided breathing can lower acute panic in 2 minutes.</span>
            </div>
          </div>
          <button onClick={() => { onClose(); setActiveTab('toolkit'); }} className="btn-emerald">
            Open Breathing Guide
          </button>
        </div>

        {/* International Helpline Cards */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Global Emergency Hotlines</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {helplines.map((h, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.78rem', color: '#818CF8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                {h.country}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{h.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a href={`tel:${h.contact}`} style={{ textDecoration: 'none' }} className="glass-pill">
                  <PhoneCall size={14} color="#34D399" /> Call {h.contact}
                </a>
                {h.website && (
                  <a href={h.website} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }} className="glass-pill">
                    <Globe size={14} /> Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Personalized Safety Contacts */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Personal Emergency Safety Network</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {safetyContacts.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{c.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '12px' }}>{c.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`tel:${c.phone}`} className="glass-pill" style={{ textDecoration: 'none', color: '#34D399' }}>
                  <PhoneCall size={14} /> Call
                </a>
                <button onClick={() => removeContact(i)} style={{ background: 'transparent', border: 'none', color: '#F43F5E', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Contact Name (e.g. Mom, Therapist)"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            style={{ flex: 1, minWidth: '180px' }}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            style={{ flex: 1, minWidth: '150px' }}
          />
          <button onClick={addContact} className="btn-secondary">
            <Plus size={16} /> Add Contact
          </button>
        </div>

      </div>
    </div>
  );
}
