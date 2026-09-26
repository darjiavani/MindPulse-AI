// src/components/CognitivePerformanceTest.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Brain, 
  Timer, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  BarChart3, 
  Award,
  Activity
} from 'lucide-react';

const COLORS = [
  { name: 'RED', hex: '#F43F5E' },
  { name: 'BLUE', hex: '#38BDF8' },
  { name: 'GREEN', hex: '#10B981' },
  { name: 'YELLOW', hex: '#F59E0B' },
  { name: 'PURPLE', hex: '#8B5CF6' }
];

export default function CognitivePerformanceTest() {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'finished'
  const [timeLeft, setTimeLeft] = useState(20);
  
  // Current challenge
  const [wordText, setWordText] = useState('');
  const [wordColorHex, setWordColorHex] = useState('');
  const [correctColorName, setCorrectColorName] = useState('');
  const [startTime, setStartTime] = useState(null);

  // Statistics
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);

  const generateNewChallenge = () => {
    const textObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    setWordText(textObj.name);
    setWordColorHex(colorObj.hex);
    setCorrectColorName(colorObj.name); // The correct answer is the INK COLOR, not the text word!
    setStartTime(performance.now());
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(20);
    setTotalAttempts(0);
    setCorrectCount(0);
    setReactionTimes([]);
    generateNewChallenge();
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (selectedColorName) => {
    if (gameState !== 'playing') return;
    const elapsed = performance.now() - startTime;
    setReactionTimes(prev => [...prev, elapsed]);
    setTotalAttempts(prev => prev + 1);

    if (selectedColorName === correctColorName) {
      setCorrectCount(prev => prev + 1);
    }

    generateNewChallenge();
  };

  // Calculations
  const avgReactionTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
    : 0;

  const accuracyRate = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  
  // Empirical Performance Score formula: High accuracy + fast reaction time (< 500ms) = High True Performance
  let empiricalPerformance = 0;
  if (totalAttempts > 0) {
    const speedScore = Math.max(10, Math.min(100, 100 - ((avgReactionTime - 300) / 6)));
    empiricalPerformance = Math.round((accuracyRate * 0.6) + (speedScore * 0.4));
    empiricalPerformance = Math.min(99, Math.max(15, empiricalPerformance));
  }

  let fatigueRating = 'Optimal Focus';
  if (empiricalPerformance < 55) fatigueRating = 'High Cognitive Fatigue';
  else if (empiricalPerformance < 75) fatigueRating = 'Moderate Mental Load';

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)', margin: '0 auto 8px auto' }}>
          <Zap size={14} /> Empirical Reaction & Stroop Focus Test
        </div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Empirical <span className="gradient-text">True Performance Detector</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '600px', margin: '6px auto 0 auto' }}>
          Measure actual cognitive speed, decision accuracy, and mental fatigue in 20 seconds. Match the <strong>INK COLOR</strong> of the word, not the text itself!
        </p>
      </div>

      {gameState === 'idle' && (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(99,102,241,0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Brain size={40} color="#38BDF8" />
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '24px' }}>
            Click the color button matching the <strong>color the word is printed in</strong> as fast as possible.
          </p>
          <button onClick={startGame} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <Zap size={20} /> Begin 20-Sec Performance Test
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          
          {/* Header Stats */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="glass-pill" style={{ fontSize: '1.1rem', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)', padding: '8px 20px' }}>
              <Timer size={18} /> {timeLeft}s remaining
            </div>
            <div className="glass-pill" style={{ fontSize: '1rem', color: '#34D399', padding: '8px 20px' }}>
              Score: {correctCount} / {totalAttempts}
            </div>
          </div>

          {/* Word Target Box */}
          <div style={{
            width: '100%',
            maxWidth: '420px',
            height: '140px',
            borderRadius: '20px',
            background: 'rgba(9, 11, 21, 0.9)',
            border: '2px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
          }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: wordColorHex, letterSpacing: '0.05em', textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
              {wordText}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select the INK COLOR above:</p>

          {/* Color Selection Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '500px' }}>
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => handleAnswer(c.name)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${c.hex}`,
                  background: `${c.hex}22`,
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>
      )}

      {gameState === 'finished' && (
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-pill" style={{ color: '#34D399', borderColor: 'rgba(52,211,153,0.3)', margin: '0 auto' }}>
            <CheckCircle2 size={16} /> Test Completed
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Empirical True Performance: <span className="gradient-text">{empiricalPerformance}%</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '12px 0' }}>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Accuracy</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>{accuracyRate}%</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg Speed</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>{avgReactionTime}ms</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>State</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818CF8', marginTop: '6px' }}>{fatigueRating}</div>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="#818CF8" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#818CF8' }}>Empirical Diagnosis</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {empiricalPerformance >= 80 
                ? 'Your prefrontal inhibition speed is exceptional. Brain processing speed is optimal for high-demand analytical work.'
                : empiricalPerformance >= 60
                ? 'Solid cognitive capacity. Moderate processing delay indicates normal working memory load.'
                : 'Elevated cognitive friction detected. Reaction latency indicates brain fatigue — practice 5 minutes of box breathing.'}
            </p>
          </div>

          <button onClick={startGame} className="btn-primary" style={{ margin: '8px auto 0 auto' }}>
            <RotateCcw size={16} /> Retake Performance Test
          </button>

        </div>
      )}

    </div>
  );
}
