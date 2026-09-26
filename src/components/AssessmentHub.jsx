// src/components/AssessmentHub.jsx
import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { submitAssessment } from '../services/api';

const ASSESSMENTS_DATA = {
  'PHQ-9': {
    title: 'PHQ-9 (Patient Health Questionnaire)',
    subtitle: 'Standard 9-item depression clinical screening tool',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 }
    ],
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure",
      "Trouble concentrating on things, such as reading or television",
      "Moving or speaking so slowly that other people noticed, or being fidgety/restless",
      "Thoughts that you would be better off dead or of hurting yourself in some way"
    ]
  },
  'GAD-7': {
    title: 'GAD-7 (Generalized Anxiety Screener)',
    subtitle: '7-item clinical tool measuring anxiety severity',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 }
    ],
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen"
    ]
  },
  'PSS-10': {
    title: 'PSS-10 (Perceived Stress Scale)',
    subtitle: '10-item instrument for measuring psychological stress perception',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Almost Never', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Fairly Often', value: 3 },
      { label: 'Very Often', value: 4 }
    ],
    questions: [
      "In the last month, how often have you been upset because of something that happened unexpectedly?",
      "In the last month, how often have you felt unable to control important things in your life?",
      "In the last month, how often have you felt nervous and stressed?",
      "In the last month, how often have you felt confident about your ability to handle personal problems?",
      "In the last month, how often have you felt that things were going your way?",
      "In the last month, how often have you found that you could not cope with all the things you had to do?",
      "In the last month, how often have you been able to control irritations in your life?",
      "In the last month, how often have you felt on top of things?",
      "In the last month, how often have you been angered because of things outside your control?",
      "In the last month, how often have you felt difficulties were piling up so high you could not overcome them?"
    ]
  }
};

export default function AssessmentHub() {
  const [selectedType, setSelectedType] = useState('PHQ-9');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAssessment = ASSESSMENTS_DATA[selectedType];

  const handleOptionChange = (qIndex, val) => {
    setAnswers(prev => ({ ...prev, [qIndex]: val }));
  };

  const handleSubmit = async () => {
    // Ensure all questions are answered
    if (Object.keys(answers).length < activeAssessment.questions.length) {
      alert(`Please answer all ${activeAssessment.questions.length} questions before scoring.`);
      return;
    }

    setIsSubmitting(true);
    const res = await submitAssessment(selectedType, answers);
    setResult(res);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${selectedType}_Health_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)', marginBottom: '8px' }}>
          <ClipboardList size={14} /> Clinical Assessment Hub
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Standardized <span className="gradient-text">Clinical Screening Tools</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Validated psychological screening instruments for evaluating depression (PHQ-9), anxiety (GAD-7), and perceived stress (PSS-10).
        </p>
      </div>

      {/* Assessment Selector Tabs */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', width: 'fit-content' }}>
        {Object.keys(ASSESSMENTS_DATA).map(key => (
          <button
            key={key}
            onClick={() => { setSelectedType(key); handleReset(); }}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              background: selectedType === key ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
              color: selectedType === key ? '#FFF' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {key} Test
          </button>
        ))}
      </div>

      {/* Main Questionnaire Card */}
      {!result ? (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{activeAssessment.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeAssessment.questions.map((q, qIdx) => (
              <div key={qIdx} style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)' }}>
                <p style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '14px' }}>
                  {qIdx + 1}. {q}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  {activeAssessment.options.map(opt => {
                    const isSelected = answers[qIdx] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionChange(qIdx, opt.value)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #818CF8' : '1px solid var(--border-glass)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#FFF' : 'var(--text-muted)',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={handleReset} className="btn-secondary">
              <RotateCcw size={16} /> Reset
            </button>
            <button onClick={handleSubmit} className="btn-primary" disabled={isSubmitting}>
              <Sparkles size={18} />
              <span>Calculate {selectedType} Score</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="glass-pill" style={{ color: '#34D399', borderColor: 'rgba(52,211,153,0.3)', margin: '0 auto' }}>
              <CheckCircle2 size={14} /> Evaluation Completed
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {result.type} Severity: <span style={{ color: result.alertLevel === 'danger' ? '#F43F5E' : result.alertLevel === 'warning' ? '#F59E0B' : '#34D399' }}>{result.severity}</span>
            </h3>

            <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0' }}>
              {result.totalScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {result.maxScore}</span>
            </div>

            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-glass)', textAlign: 'left' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#38BDF8' }}>Clinical Guidance & Recommendation</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {result.recommendation}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
              <button onClick={handleDownloadJSON} className="btn-secondary">
                <Download size={16} /> Export Health JSON
              </button>
              <button onClick={() => window.print()} className="btn-secondary">
                <Printer size={16} /> Print Official Summary
              </button>
              <button onClick={handleReset} className="btn-primary">
                Retake Assessment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
