import express from 'express';
import cors from 'cors';
import { analyzeTextStress, generateCBTResponse, calculateAssessmentScore } from './aiEngine.js';
import { registerUser, loginUser } from './authEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const result = registerUser(name, email, password);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const result = loginUser(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }
  res.json(result);
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MindPulse AI Engine', timestamp: new Date().toISOString() });
});


// AI Stress Detection Endpoint (NLP Text Analysis)
app.post('/api/analyze-stress', (req, res) => {
  try {
    const { text } = req.body;
    const result = analyzeTextStress(text);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error analyzing stress:', error);
    res.status(500).json({ success: false, error: 'Internal AI engine error' });
  }
});

// AI CBT MindBot Endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message, history } = req.body;
    const botResponse = generateCBTResponse(message, history);
    res.json({ success: true, response: botResponse });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ success: false, error: 'Failed to process AI chat message' });
  }
});

// Clinical Screening Assessment Scorer
app.post('/api/assessments', (req, res) => {
  try {
    const { type, answers } = req.body;
    const result = calculateAssessmentScore(type, answers);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error scoring assessment:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate assessment score' });
  }
});

// Crisis & Helplines Database API
app.get('/api/resources', (req, res) => {
  const helplines = [
    { country: 'United States & Canada', name: 'Suicide & Crisis Lifeline', contact: '988', text: 'Text 988', website: 'https://988lifeline.org' },
    { country: 'United Kingdom', name: 'NHS Mental Health / Samaritans', contact: '111 / 116 123', website: 'https://www.samaritans.org' },
    { country: 'India', name: 'KIRAN Mental Health Helpline', contact: '1800-599-0019 / 14416', website: 'https://telemanas.mohfw.gov.in' },
    { country: 'Australia', name: 'Lifeline Australia', contact: '13 11 14', website: 'https://www.lifeline.org.au' },
    { country: 'International / Global', name: 'Befrienders Worldwide', contact: 'Find local center', website: 'https://www.befrienders.org' }
  ];

  res.json({ success: true, helplines });
});

app.listen(PORT, () => {
  console.log(`🧠 MindPulse AI Server running on http://localhost:${PORT}`);
});
