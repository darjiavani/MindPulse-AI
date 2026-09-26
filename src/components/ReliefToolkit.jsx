// src/components/ReliefToolkit.jsx
import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  CloudRain, 
  Waves, 
  Sparkles, 
  CheckCircle2, 
  Compass,
  Headphones,
  Sliders,
  RotateCw,
  Lightbulb
} from 'lucide-react';
import { 
  startBinauralBeats, 
  stopBinauralBeats, 
  startRainSound, 
  stopRainSound, 
  startOceanWaves, 
  stopOceanWaves, 
  playBreathingChime, 
  stopAllAudio 
} from '../utils/audioSynth';

const BRAINWAVE_PRESETS = [
  { name: 'Delta (2Hz)', beat: 2, desc: 'Deep Rest & Physical Healing', color: '#818CF8' },
  { name: 'Theta (6Hz)', beat: 6, desc: 'Deep Relaxation & Meditation', color: '#06B6D4' },
  { name: 'Alpha (10Hz)', beat: 10, desc: 'Calm Focus & Stress Reduction', color: '#10B981' },
  { name: 'Beta (18Hz)', beat: 18, desc: 'Active Focus & Problem Solving', color: '#F59E0B' },
  { name: 'Gamma (40Hz)', beat: 40, desc: 'Peak Performance & Memory', color: '#F43F5E' }
];

const REFRAMING_CARDS = [
  {
    distortion: "All-or-Nothing Thinking",
    negative: "If I make even one mistake on this project, the whole thing is a total failure.",
    reframe: "A mistake is just data for improvement. High quality work is built through iterations, not instant perfection."
  },
  {
    distortion: "Catastrophizing",
    negative: "I feel overwhelmed right now, which means everything in my life is going to fall apart.",
    reframe: "Feeling overwhelmed is a temporary physiological response to high load, not a forecast of disaster. I can handle one step at a time."
  },
  {
    distortion: "Imposter Phenomenon",
    negative: "I only got this far because of luck. Soon everyone will see I don't know what I'm doing.",
    reframe: "My achievements are earned through my skills and effort. Feeling uncertain is a normal part of growth, not evidence of incompetence."
  }
];

export default function ReliefToolkit() {
  const [activeTab, setActiveTab] = useState('breathing'); // 'breathing' | 'soundscapes' | 'reframing' | 'grounding'

  // Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale');
  const [breathingTechnique, setBreathingTechnique] = useState('4-7-8');
  const [breathTimer, setBreathTimer] = useState(4);

  // Soundscape & Tuner state
  const [binauralActive, setBinauralActive] = useState(false);
  const [carrierFreq, setCarrierFreq] = useState(210);
  const [beatFreq, setBeatFreq] = useState(6);
  const [rainActive, setRainActive] = useState(false);
  const [wavesActive, setWavesActive] = useState(false);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState(0);

  // Reframing state
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    let interval;
    if (isBreathingActive) {
      playBreathingChime(432, 1.2);
      
      let phase = 'Inhale';
      let duration = 4;
      setBreathingPhase('Inhale');
      setBreathTimer(4);

      interval = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            if (breathingTechnique === '4-7-8') {
              if (phase === 'Inhale') { phase = 'Hold'; duration = 7; }
              else if (phase === 'Hold') { phase = 'Exhale'; duration = 8; }
              else { phase = 'Inhale'; duration = 4; }
            } else if (breathingTechnique === 'box') {
              if (phase === 'Inhale') { phase = 'Hold'; duration = 4; }
              else if (phase === 'Hold') { phase = 'Exhale'; duration = 4; }
              else { phase = 'Inhale'; duration = 4; }
            } else {
              if (phase === 'Inhale') { phase = 'Exhale'; duration = 5; }
              else { phase = 'Inhale'; duration = 5; }
            }

            setBreathingPhase(phase);
            playBreathingChime(phase === 'Inhale' ? 528 : phase === 'Hold' ? 396 : 432, 1.0);
            return duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingTechnique]);

  const toggleBinaural = () => {
    if (binauralActive) {
      stopBinauralBeats();
      setBinauralActive(false);
    } else {
      startBinauralBeats(carrierFreq, beatFreq);
      setBinauralActive(true);
    }
  };

  const handleTuneFrequencies = (newCarrier, newBeat) => {
    setCarrierFreq(newCarrier);
    setBeatFreq(newBeat);
    if (binauralActive) {
      startBinauralBeats(newCarrier, newBeat);
    }
  };

  const toggleRain = () => {
    if (rainActive) { stopRainSound(); setRainActive(false); }
    else { startRainSound(); setRainActive(true); }
  };

  const toggleWaves = () => {
    if (wavesActive) { stopOceanWaves(); setWavesActive(false); }
    else { startOceanWaves(); setWavesActive(true); }
  };

  const toggleCardFlip = (idx) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const groundingSteps = [
    { title: "5 Things You Can SEE", desc: "Look around your space. Identify 5 objects near you (e.g. a lamp, your cup, a book).", color: '#38BDF8' },
    { title: "4 Things You Can TOUCH", desc: "Feel the texture of your desk, clothes, or your feet grounded on the floor.", color: '#34D399' },
    { title: "3 Things You Can HEAR", desc: "Listen carefully. Can you hear room ambient noise, birds outside, or your breathing?", color: '#818CF8' },
    { title: "2 Things You Can SMELL", desc: "Notice any scents around you, or recall a fresh comforting fragrance.", color: '#F59E0B' },
    { title: "1 Thing You Can TASTE", desc: "Take a sip of water or focus on the current taste in your mouth. You are present and safe.", color: '#FB7185' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)', marginBottom: '8px' }}>
          <Wind size={14} /> Interactive De-stressing & Reframing Suite
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Interactive Web Audio <span className="gradient-text">Relief & Focus Toolkit</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Restore focus and nervous system balance using tuned Web Audio binaural beats, visual breathing guides, and cognitive reframing cards.
        </p>
      </div>

      {/* Tabs */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', width: 'fit-content', flexWrap: 'wrap' }}>
        {[
          { id: 'breathing', label: 'Breathing Sync', icon: Wind },
          { id: 'soundscapes', label: 'Binaural Tuner', icon: Headphones },
          { id: 'reframing', label: 'Cognitive Reframing', icon: Lightbulb },
          { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Compass }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)' : 'transparent',
                color: isActive ? '#FFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BREATHING SYNCHRONIZER */}
      {activeTab === 'breathing' && (
        <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: '4-7-8', label: '4-7-8 Relaxing Breath' },
              { id: 'box', label: 'Box Breathing (4-4-4-4)' },
              { id: 'coherence', label: 'Coherence (5-5)' }
            ].map(tech => (
              <button
                key={tech.id}
                onClick={() => { setBreathingTechnique(tech.id); setIsBreathingActive(false); }}
                className="glass-pill"
                style={{
                  cursor: 'pointer',
                  borderColor: breathingTechnique === tech.id ? '#10B981' : 'var(--border-glass)',
                  color: breathingTechnique === tech.id ? '#34D399' : 'var(--text-muted)'
                }}
              >
                {tech.label}
              </button>
            ))}
          </div>

          <div className={`breathing-circle ${isBreathingActive ? 'active' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isBreathingActive ? breathingPhase : 'Ready'}
              </span>
              {isBreathingActive && (
                <span style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{breathTimer}s</span>
              )}
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', marginBottom: '28px' }}>
            {breathingTechnique === '4-7-8' && 'Inhale quietly through your nose for 4s, hold for 7s, exhale completely for 8s.'}
            {breathingTechnique === 'box' && 'Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s.'}
            {breathingTechnique === 'coherence' && 'Inhale smoothly for 5s and exhale smoothly for 5s.'}
          </p>

          <button 
            onClick={() => setIsBreathingActive(!isBreathingActive)} 
            className={isBreathingActive ? "btn-danger" : "btn-emerald"}
            style={{ minWidth: '180px', justifyContent: 'center' }}
          >
            {isBreathingActive ? <Square size={18} /> : <Play size={18} />}
            <span>{isBreathingActive ? 'Stop Exercise' : 'Begin Breathing'}</span>
          </button>

        </div>
      )}

      {/* TAB 2: BINAURAL BEATS FREQUENCY TUNER */}
      {activeTab === 'soundscapes' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            Binaural Beats Frequency Tuner
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Adjust carrier tone and brainwave differential frequency to optimize focus, physical recovery, or deep meditation.
          </p>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {BRAINWAVE_PRESETS.map(preset => {
              const isSelected = beatFreq === preset.beat;
              return (
                <button
                  key={preset.name}
                  onClick={() => handleTuneFrequencies(carrierFreq, preset.beat)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${preset.color}` : '1px solid var(--border-glass)',
                    background: isSelected ? `${preset.color}22` : 'rgba(255,255,255,0.03)',
                    color: isSelected ? preset.color : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{preset.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{preset.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            
            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Carrier Tone Frequency</label>
                <span style={{ color: '#38BDF8', fontWeight: 700 }}>{carrierFreq} Hz</span>
              </div>
              <input 
                type="range" 
                min={100} 
                max={432} 
                value={carrierFreq} 
                onChange={(e) => handleTuneFrequencies(Number(e.target.value), beatFreq)} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px', display: 'block' }}>
                Base pitch (100Hz deep bass — 432Hz healing harmonic)
              </span>
            </div>

            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Brainwave Beat Offset</label>
                <span style={{ color: '#34D399', fontWeight: 700 }}>{beatFreq} Hz</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={40} 
                value={beatFreq} 
                onChange={(e) => handleTuneFrequencies(carrierFreq, Number(e.target.value))} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px', display: 'block' }}>
                Left/Right Ear Difference (0.5Hz Delta — 40Hz Gamma)
              </span>
            </div>

          </div>

          {/* Control Bar */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={toggleBinaural} className={binauralActive ? "btn-danger" : "btn-primary"} style={{ minWidth: '220px', justifyContent: 'center' }}>
              {binauralActive ? <Square size={18} /> : <Play size={18} />}
              <span>{binauralActive ? 'Stop Tuner Audio' : `Play ${carrierFreq}Hz / ${beatFreq}Hz Beats`}</span>
            </button>
            <button onClick={stopAllAudio} className="btn-secondary">
              <VolumeX size={18} /> Stop All Audio
            </button>
          </div>

        </div>
      )}

      {/* TAB 3: COGNITIVE REFRAMING CARDS */}
      {activeTab === 'reframing' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            Interactive Cognitive Thought Reframer
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Click on any card to flip automatic negative thoughts into empowered, evidence-based perspectives.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {REFRAMING_CARDS.map((card, idx) => {
              const isFlipped = flippedCards[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCardFlip(idx)}
                  className="glass-panel glass-panel-hover"
                  style={{
                    padding: '28px',
                    cursor: 'pointer',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isFlipped ? '1px solid #34D399' : '1px solid rgba(244, 63, 94, 0.3)',
                    background: isFlipped ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.06)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="glass-pill" style={{ color: isFlipped ? '#34D399' : '#FB7185', borderColor: isFlipped ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.3)' }}>
                        {isFlipped ? 'Empowered Reframe' : card.distortion}
                      </span>
                      <RotateCw size={16} color="var(--text-muted)" />
                    </div>

                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {isFlipped ? card.reframe : `"${card.negative}"`}
                    </p>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                    Click card to {isFlipped ? 'view negative trigger' : 'flip reframe'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 5-4-3-2-1 GROUNDING */}
      {activeTab === 'grounding' && (
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-pill" style={{ color: groundingSteps[groundingStep].color, borderColor: groundingSteps[groundingStep].color, margin: '0 auto' }}>
              Step {groundingStep + 1} of 5
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: groundingSteps[groundingStep].color }}>
              {groundingSteps[groundingStep].title}
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {groundingSteps[groundingStep].desc}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              {groundingStep > 0 && (
                <button onClick={() => setGroundingStep(prev => prev - 1)} className="btn-secondary">
                  Previous Step
                </button>
              )}
              {groundingStep < 4 ? (
                <button onClick={() => setGroundingStep(prev => prev + 1)} className="btn-primary">
                  Next Step ({groundingStep + 2}/5)
                </button>
              ) : (
                <button onClick={() => setGroundingStep(0)} className="btn-emerald">
                  <CheckCircle2 size={18} /> Complete Grounding
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
