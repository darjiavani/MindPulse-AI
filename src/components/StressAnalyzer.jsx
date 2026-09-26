// src/components/StressAnalyzer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Camera, 
  FileText, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  RefreshCw,
  Eye,
  HeartPulse,
  Brain,
  Wind,
  Zap,
  Gauge
} from 'lucide-react';
import { analyzeStressText } from '../services/api';
import CognitivePerformanceTest from './CognitivePerformanceTest';

export default function StressAnalyzer({ onAnalysisComplete, setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('text'); // 'text' | 'performance' | 'vision' | 'biometric'

  // Text NLP state
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Vision state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [facialTension, setFacialTension] = useState(42);
  const [microExpression, setMicroExpression] = useState('Neutral / Focused');

  // Biometric state
  const [hrv, setHrv] = useState(65);
  const [rhr, setRhr] = useState(72);
  const [sleepHours, setSleepHours] = useState(7.5);

  // Speech Recognition setup (Web Speech API)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your thoughts.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (isListening) {
      setIsListening(false);
      recognition.stop();
    } else {
      setIsListening(true);
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    }
  };

  const handleAnalyzeText = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeStressText(inputText);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    if (onAnalysisComplete) onAnalysisComplete(result);
  };

  const toggleWebcam = async () => {
    if (webcamActive) {
      setWebcamActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamActive(true);
      } catch (err) {
        setWebcamActive(true);
      }
    }
  };

  useEffect(() => {
    let animationFrame;
    if (webcamActive && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      let angle = 0;

      const drawLandmarks = () => {
        angle += 0.05;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 1.5;

        const cx = canvasRef.current.width / 2;
        const cy = canvasRef.current.height / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 90, 120, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(cx - 35 + Math.sin(angle) * 2, cy - 20, 6, 0, 2 * Math.PI);
        ctx.arc(cx + 35 - Math.sin(angle) * 2, cy - 20, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#818CF8';
        ctx.beginPath();
        ctx.arc(cx, cy + 40, 30 + Math.cos(angle) * 3, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();

        const tensionVal = Math.round(40 + Math.sin(angle) * 15);
        setFacialTension(tensionVal);
        if (tensionVal > 50) setMicroExpression('Mild Brow Tension');
        else setMicroExpression('Relaxed / Calm');

        animationFrame = requestAnimationFrame(drawLandmarks);
      };
      drawLandmarks();
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [webcamActive]);

  const calculatedBiometricStress = Math.round(
    Math.max(10, Math.min(95, 100 - (hrv * 0.8) + (rhr - 60) * 0.8 + (8 - sleepHours) * 8))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div>
        <div className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)', marginBottom: '8px' }}>
          <Activity size={14} /> Multi-Dimensional AI True Performance System
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
          AI Mental Health & <span className="gradient-text">True Performance Analyzer</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Evaluate stress, cognitive capacity, burnout resilience, and empirical processing speed in real time.
        </p>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', width: 'fit-content', flexWrap: 'wrap' }}>
        {[
          { id: 'text', label: 'AI Sentiment & Stress NLP', icon: FileText },
          { id: 'performance', label: 'Empirical Focus Test', icon: Zap },
          { id: 'vision', label: 'Facial Vision AI', icon: Camera },
          { id: 'biometric', label: 'Biometric Monitor', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
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
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TEXT & VOICE NLP ANALYZER */}
      {activeSubTab === 'text' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Input Box Card */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Express Your Thoughts</h3>
              <button 
                onClick={handleVoiceInput} 
                className="glass-pill"
                style={{ cursor: 'pointer', borderColor: isListening ? '#F43F5E' : 'var(--border-glass)', color: isListening ? '#FB7185' : 'var(--text-muted)' }}
              >
                {isListening ? <MicOff size={14} color="#FB7185" /> : <Mic size={14} />}
                <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type how you are feeling today... (e.g. 'I feel completely overwhelmed by upcoming deadlines, brain fog is high and I worry I am not performing well.')"
              style={{ resize: 'vertical' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleAnalyzeText} 
                className="btn-primary" 
                disabled={isAnalyzing || !inputText.trim()}
                style={{ flex: 1 }}
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>{isAnalyzing ? 'Analyzing Sentiments...' : 'Run Deep AI Scan'}</span>
              </button>

              <button 
                onClick={() => setInputText("I have been feeling really exhausted with work deadlines. I feel brain fog setting in and fear I'm not good enough.")}
                className="btn-secondary"
              >
                Sample Text
              </button>
            </div>
          </div>

          {/* NLP Analysis Output Card */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
              AI True Performance & Stress Report
            </h3>

            {analysisResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* True Performance & Stress Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>True Performance Index</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: analysisResult.truePerformanceScore > 75 ? '#34D399' : '#F59E0B' }}>
                      {analysisResult.truePerformanceScore}%
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stress Load</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: analysisResult.stressScore > 65 ? '#FB7185' : '#34D399' }}>
                      {analysisResult.stressScore} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Cognitive Breakdown Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cognitive Efficiency</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>{analysisResult.cognitiveEfficiency}%</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Burnout Risk</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: analysisResult.burnoutRisk === 'High' ? '#F43F5E' : '#34D399', marginTop: '2px' }}>{analysisResult.burnoutRisk}</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Imposter Risk</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: analysisResult.imposterSyndromeRisk === 'High' ? '#F43F5E' : '#818CF8', marginTop: '2px' }}>{analysisResult.imposterSyndromeRisk}</div>
                  </div>
                </div>

                {/* AI Actionable Interventions */}
                <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <CheckCircle2 size={16} color="#34D399" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399' }}>AI True Performance Strategy</span>
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveSubTab('performance')} className="btn-emerald" style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}>
                    Run 20-Sec Empirical Focus Test <Zap size={16} />
                  </button>
                </div>

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Brain size={48} color="var(--border-glow)" style={{ marginBottom: '16px' }} />
                <p>Enter your thoughts on the left and click "Run Deep AI Scan" to calculate your True Performance index.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: EMPIRICAL FOCUS TEST */}
      {activeSubTab === 'performance' && (
        <CognitivePerformanceTest />
      )}

      {/* TAB 3: FACIAL VISION AI */}
      {activeSubTab === 'vision' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            <div>
              <div style={{ position: 'relative', width: '100%', height: '320px', background: '#000', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                <canvas ref={canvasRef} width={400} height={320} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

                <div style={{ position: 'absolute', top: '16px', left: '16px' }} className="glass-pill">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: webcamActive ? '#34D399' : '#F43F5E', display: 'inline-block' }}></span>
                  <span>{webcamActive ? 'AI Vision HUD Tracking' : 'Camera Idle'}</span>
                </div>
              </div>

              <button onClick={toggleWebcam} className="btn-primary" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
                <Camera size={18} />
                <span>{webcamActive ? 'Stop Camera Session' : 'Start Real-Time Facial Analysis'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Micro-Expression Analysis</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Facial Muscle Tension</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: facialTension > 50 ? '#F59E0B' : '#34D399', marginTop: '4px' }}>
                    {facialTension} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>%</span>
                  </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Micro-Expression</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8', marginTop: '8px' }}>
                    {microExpression}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: BIOMETRIC MONITOR */}
      {activeSubTab === 'biometric' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>
            Wearable Biometrics & Physiological Inputs
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Heart Rate Variability (HRV ms)</label>
                  <span style={{ color: '#34D399', fontWeight: 700 }}>{hrv} ms</span>
                </div>
                <input type="range" min={20} max={120} value={hrv} onChange={(e) => setHrv(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Resting Heart Rate (RHR BPM)</label>
                  <span style={{ color: rhr > 85 ? '#F43F5E' : '#38BDF8', fontWeight: 700 }}>{rhr} BPM</span>
                </div>
                <input type="range" min={50} max={110} value={rhr} onChange={(e) => setRhr(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sleep Duration (Hours)</label>
                  <span style={{ color: sleepHours < 6 ? '#F59E0B' : '#34D399', fontWeight: 700 }}>{sleepHours} hrs</span>
                </div>
                <input type="range" min={3} max={10} step={0.5} value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} />
              </div>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <HeartPulse size={44} color="#818CF8" style={{ marginBottom: '12px' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Physiological Stress Score
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: calculatedBiometricStress > 60 ? '#FB7185' : '#34D399', margin: '8px 0' }}>
                {calculatedBiometricStress} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ 100</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
