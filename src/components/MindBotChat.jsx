// src/components/MindBotChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  User, 
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function MindBotChat({ onOpenSOS }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI CBT Companion. I am here to provide a safe, non-judgmental space to explore your thoughts, navigate stress, or reframe challenging situations. How are you feeling today?",
      suggestions: [
        "I'm feeling anxious about my workload",
        "Help me reframe a negative thought",
        "I feel exhausted and burnt out"
      ]
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    const botRes = await sendChatMessage(text, messages);
    setIsTyping(false);

    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: botRes.text,
      suggestions: botRes.suggestions,
      isCrisis: botRes.isCrisis
    };

    setMessages(prev => [...prev, botMessage]);

    if (botRes.isCrisis) {
      onOpenSOS();
    } else {
      speakText(botRes.text);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 160px)', minHeight: '600px' }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>
            <Bot size={24} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI CBT Therapist Assistant</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cognitive Behavioral & Mindfulness Support</span>
          </div>
        </div>

        <button 
          onClick={() => setSpeechEnabled(!speechEnabled)} 
          className="glass-pill"
          style={{ cursor: 'pointer', borderColor: speechEnabled ? 'rgba(56,189,248,0.4)' : 'var(--border-glass)', color: speechEnabled ? '#38BDF8' : 'var(--text-muted)' }}
        >
          {speechEnabled ? <Volume2 size={16} color="#38BDF8" /> : <VolumeX size={16} />}
          <span>{speechEnabled ? 'Voice Guidance Active' : 'Muted'}</span>
        </button>
      </div>

      {/* Main Chat Stream */}
      <div className="glass-panel" style={{ flex: 1, padding: '28px', display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '20px' }}>
        
        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              gap: '14px', 
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            {/* Avatar */}
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: msg.sender === 'user' ? 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)' : 'rgba(99,102,241,0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0 
            }}>
              {msg.sender === 'user' ? <User size={18} color="#FFF" /> : <Bot size={18} color="#818CF8" />}
            </div>

            {/* Bubble Container */}
            <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', 
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)' : msg.isCrisis ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.05)',
                border: msg.isCrisis ? '1px solid #F43F5E' : '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(6,182,212,0.3)' : 'none'
              }}>
                {msg.text}
              </div>

              {/* Suggestions chips if bot message */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="glass-pill"
                      style={{ cursor: 'pointer', fontSize: '0.78rem', color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)' }}
                    >
                      <Lightbulb size={12} /> {sug}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Bot size={18} color="#818CF8" />
            <RefreshCw className="animate-spin" size={14} color="#818CF8" />
            <span>AI is synthesizing CBT response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a thought or worry to explore with CBT AI..."
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.95rem' }}
          />

          <button type="submit" className="btn-primary" disabled={!inputMsg.trim() || isTyping}>
            <Send size={18} />
            <span>Send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
