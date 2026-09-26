// server/aiEngine.js
// Advanced AI & Heuristics engine for Mental Health, Stress & True Cognitive Performance Analytics

const STRESS_KEYWORDS = {
  critical: [
    'suicidal', 'harm myself', 'end it all', 'cannot go on', 'hopeless', 
    'breakdown', 'panicking', 'can\'t breathe', 'suffocating', 'despair'
  ],
  high: [
    'overwhelmed', 'exhausted', 'can\'t take it', 'dreading', 'insomnia', 'terrified', 
    'burnout', 'worthless', 'crisis', 'destroying me', 'too much pressure', 'giving up', 
    'falling apart', 'failing', 'imposter', 'unable to cope', 'drowning'
  ],
  medium: [
    'stressed', 'anxious', 'worried', 'tired', 'nervous', 'pressure',
    'restless', 'frustrated', 'headache', 'tension', 'overthinking',
    'deadlines', 'struggling', 'sleepless', 'drained', 'unfocused', 'distracted'
  ],
  positive: [
    'confident', 'focused', 'calm', 'relaxed', 'peaceful', 'productive',
    'accomplished', 'energized', 'hopeful', 'balanced', 'rested', 'grateful',
    'clear-headed', 'thriving', 'motivated', 'in the zone', 'resilient'
  ]
};

const COGNITIVE_FATIGUE_INDICATORS = [
  'forgetful', 'can\'t concentrate', 'brain fog', 'making mistakes', 'slow',
  'zoning out', 're-reading', 'mind racing', 'decision paralysis', 'overloaded'
];

const IMPOSTER_SYNDROME_INDICATORS = [
  'fraud', 'not good enough', 'luck', 'exposed', 'fake', 'disappointing', 'incompetent'
];

/**
 * Perform Deep Multi-Dimensional Stress & True Performance Analysis
 */
function analyzeTextStress(text) {
  if (!text || text.trim().length === 0) {
    return {
      stressScore: 0,
      stressLevel: 'None',
      sentiment: 'Neutral',
      valence: 50,
      arousal: 50,
      truePerformanceScore: 85,
      cognitiveEfficiency: 90,
      anxietyIndex: 0,
      burnoutRisk: 'Low',
      imposterSyndromeRisk: 'Low',
      cognitiveFatigue: 'Low',
      detectedKeywords: [],
      domains: { anxiety: 10, burnout: 10, fatigue: 10, cognitiveLoad: 10, resilience: 90 },
      insights: ['No text input provided for evaluation.'],
      recommendations: ['Take a moment to write down your current state of mind.']
    };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.match(/\b\w+\b/g) || [];
  const wordCount = words.length;

  let critCount = 0;
  let highCount = 0;
  let medCount = 0;
  let posCount = 0;
  let fatigueCount = 0;
  let imposterCount = 0;

  const foundKeywords = new Set();

  STRESS_KEYWORDS.critical.forEach(kw => {
    if (lowerText.includes(kw)) { critCount++; foundKeywords.add(kw); }
  });
  STRESS_KEYWORDS.high.forEach(kw => {
    if (lowerText.includes(kw)) { highCount++; foundKeywords.add(kw); }
  });
  STRESS_KEYWORDS.medium.forEach(kw => {
    if (lowerText.includes(kw)) { medCount++; foundKeywords.add(kw); }
  });
  STRESS_KEYWORDS.positive.forEach(kw => {
    if (lowerText.includes(kw)) { posCount++; foundKeywords.add(kw); }
  });
  COGNITIVE_FATIGUE_INDICATORS.forEach(kw => {
    if (lowerText.includes(kw)) { fatigueCount++; foundKeywords.add(kw); }
  });
  IMPOSTER_SYNDROME_INDICATORS.forEach(kw => {
    if (lowerText.includes(kw)) { imposterCount++; foundKeywords.add(kw); }
  });

  // Calculate Stress Index (0-100)
  let rawStress = (critCount * 35) + (highCount * 22) + (medCount * 12) - (posCount * 14);
  
  // Punctuation & casing load
  const capsRatio = (text.replace(/[^A-Z]/g, "").length) / Math.max(1, text.length);
  if (capsRatio > 0.2) rawStress += 10;
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 2) rawStress += 8;

  const stressScore = Math.min(98, Math.max(5, Math.round(rawStress + 32)));

  // Calculate True Performance & Cognitive Efficiency Index (0 - 100%)
  // True Performance decreases with fatigue, high stress, and negative valence, but increases with positivity & focus
  let rawPerformance = 100 - (stressScore * 0.55) - (fatigueCount * 12) - (imposterCount * 8) + (posCount * 10);
  const truePerformanceScore = Math.min(99, Math.max(12, Math.round(rawPerformance)));

  const cognitiveEfficiency = Math.min(99, Math.max(15, Math.round(100 - (fatigueCount * 18) - (stressScore * 0.4))));

  // Circumplex Model of Affect (Valence: 0-100, Arousal: 0-100)
  const valence = Math.max(5, Math.min(95, Math.round(100 - stressScore + (posCount * 8))));
  const arousal = Math.max(10, Math.min(98, Math.round((stressScore * 0.7) + (exclamations * 6) + (wordCount * 0.15))));

  // Burnout & Imposter Risk Categorization
  const burnoutRisk = (stressScore > 70 || fatigueCount >= 2) ? 'High' : (stressScore > 45 || medCount >= 2) ? 'Moderate' : 'Low';
  const imposterSyndromeRisk = imposterCount > 0 ? (imposterCount >= 2 ? 'High' : 'Moderate') : 'Low';
  const cognitiveFatigue = fatigueCount > 1 ? 'High' : fatigueCount === 1 ? 'Moderate' : 'Optimal';

  // Level classification
  let stressLevel = 'Optimal / Calm';
  if (stressScore > 75) stressLevel = 'Critical Tension';
  else if (stressScore > 52) stressLevel = 'Elevated Stress';
  else if (stressScore > 32) stressLevel = 'Moderate';

  let sentiment = 'Balanced';
  if (valence < 40) sentiment = 'Distressed';
  else if (valence > 65) sentiment = 'Positive / Flow State';

  // Generate Personalized True Performance Insights
  const insights = [];
  const recommendations = [];

  if (truePerformanceScore < 50) {
    insights.push(`True Performance Capacity is strained (${truePerformanceScore}%). Cognitive fatigue and stress are reducing working memory efficiency.`);
    recommendations.push('Execute a 10-minute mental reset using Binaural Beats audio to restore prefrontal focus.');
    recommendations.push('Break complex tasks into micro-steps to prevent decision fatigue.');
  } else if (truePerformanceScore >= 80) {
    insights.push(`Exceptional True Performance Capacity (${truePerformanceScore}%). Mind is clear, resilient, and ready for high-focus tasks.`);
    recommendations.push('Capitalize on your current Flow State for deep strategic work.');
  } else {
    insights.push(`Moderate Performance Efficiency (${truePerformanceScore}%). Working memory is functional, but energy reserves should be monitored.`);
    recommendations.push('Incorporate brief 5-minute breathing breaks between task switches.');
  }

  if (imposterSyndromeRisk !== 'Low') {
    insights.push('Subconscious perfectionism or imposter syndrome indicators detected in text cadence.');
    recommendations.push('Use the Cognitive Reframer tool to separate facts from automatic negative self-talk.');
  }

  const isCrisis = critCount > 0 || lowerText.includes('suicide') || lowerText.includes('want to die');

  return {
    stressScore,
    stressLevel,
    sentiment,
    valence,
    arousal,
    truePerformanceScore,
    cognitiveEfficiency,
    anxietyIndex: Math.min(98, Math.round(stressScore * 0.9)),
    burnoutRisk,
    imposterSyndromeRisk,
    cognitiveFatigue,
    detectedKeywords: Array.from(foundKeywords),
    domains: {
      anxiety: Math.min(100, Math.round(stressScore * 0.95)),
      burnout: Math.min(100, Math.round(stressScore * 0.85 + fatigueCount * 10)),
      fatigue: Math.min(100, Math.round(fatigueCount * 30 + stressScore * 0.3)),
      cognitiveLoad: Math.min(100, Math.round(100 - cognitiveEfficiency)),
      resilience: truePerformanceScore
    },
    insights,
    recommendations,
    isCrisis,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * CBT AI MindBot response engine
 */
function generateCBTResponse(userMessage, chatHistory = []) {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('suicide') || lowerMsg.includes('end my life') || lowerMsg.includes('want to die') || lowerMsg.includes('kill myself')) {
    return {
      sender: 'bot',
      text: "I am deeply concerned about what you are going through right now. Please know that you are not alone and help is available 24/7. Please contact emergency services or call/text the 988 Suicide & Crisis Lifeline immediately.",
      isCrisis: true,
      action: 'SHOW_SOS_MODAL',
      suggestions: ['Open SOS Crisis Helpline', 'Try Grounding Breathing', 'Contact a Professional']
    };
  }

  if (lowerMsg.includes('performance') || lowerMsg.includes('focus') || lowerMsg.includes('productive') || lowerMsg.includes('fog')) {
    return {
      sender: 'bot',
      text: "Cognitive performance fluctuates naturally based on sleep, stress, and mental fatigue. When brain fog sets in, pushing harder often decreases output. Would you like to run our 30-second Cognitive Focus Test to empirically measure your reaction speed and mental clarity?",
      isCrisis: false,
      suggestions: ['Take 30-Sec Cognitive Test', 'Play 432Hz Focus Audio', 'Help me prioritize tasks']
    };
  }

  if (lowerMsg.includes('anxious') || lowerMsg.includes('panic') || lowerMsg.includes('scared')) {
    return {
      sender: 'bot',
      text: "Anxiety can feel like a high physical and cognitive load. Remember that anxiety is your body's alarm system misinterpreting safe pressure as danger. Let's take a slow breath together. What specific thought is feeling most overwhelming right now?",
      isCrisis: false,
      suggestions: ["I feel like I'm losing control", "Start 4-7-8 Breathing", "Help me reframe this thought"]
    };
  }

  return {
    sender: 'bot',
    text: "Thank you for sharing that with me. Looking at this situation, what automatic narrative is your mind building around it? We can analyze the evidence and reframe it together.",
    isCrisis: false,
    suggestions: ["Help me reframe this thought", "Test my true performance", "Play soothing audio"]
  };
}

/**
 * Standardized Clinical Screening Scorer
 */
function calculateAssessmentScore(type, answers) {
  const scores = Object.values(answers).map(Number);
  const totalScore = scores.reduce((sum, val) => sum + val, 0);

  if (type === 'PHQ-9') {
    let severity = 'Minimal Depression';
    let alertLevel = 'success';
    let recommendation = 'Your score suggests minimal depression symptoms. Maintain healthy sleep and wellness habits.';
    if (totalScore >= 20) {
      severity = 'Severe Depression'; alertLevel = 'danger';
      recommendation = 'Your score indicates severe depression symptoms. We strongly advise consulting a healthcare professional immediately.';
    } else if (totalScore >= 15) {
      severity = 'Moderately Severe Depression'; alertLevel = 'warning';
      recommendation = 'Moderately severe symptoms detected. Professional evaluation and therapy support are recommended.';
    } else if (totalScore >= 10) {
      severity = 'Moderate Depression'; alertLevel = 'warning';
      recommendation = 'Moderate symptoms detected. Regular mindfulness and structured CBT sessions are recommended.';
    } else if (totalScore >= 5) {
      severity = 'Mild Depression'; alertLevel = 'info';
      recommendation = 'Mild depression symptoms detected. Utilize daily wellness and cognitive reframing tools.';
    }
    return { type, totalScore, maxScore: 27, severity, alertLevel, recommendation };
  }

  if (type === 'GAD-7') {
    let severity = 'Minimal Anxiety'; alertLevel = 'success';
    let recommendation = 'Your score indicates minimal anxiety. Keep up your relaxation routines.';
    if (totalScore >= 15) {
      severity = 'Severe Anxiety'; alertLevel = 'danger';
      recommendation = 'Severe anxiety symptoms indicated. Clinical support is strongly recommended.';
    } else if (totalScore >= 10) {
      severity = 'Moderate Anxiety'; alertLevel = 'warning';
      recommendation = 'Moderate anxiety indicated. Incorporate daily 4-7-8 breathing and CBT thought reframing.';
    } else if (totalScore >= 5) {
      severity = 'Mild Anxiety'; alertLevel = 'info';
      recommendation = 'Mild anxiety detected. Use our Web Audio Binaural beats during working sessions.';
    }
    return { type, totalScore, maxScore: 21, severity, alertLevel, recommendation };
  }

  if (type === 'PSS-10') {
    let severity = 'Low Perceived Stress'; alertLevel = 'success';
    let recommendation = 'You are coping well with current life stressors.';
    if (totalScore >= 27) {
      severity = 'High Perceived Stress'; alertLevel = 'danger';
      recommendation = 'High stress perception detected. Reduce non-essential commitments and practice daily relaxation.';
    } else if (totalScore >= 14) {
      severity = 'Moderate Perceived Stress'; alertLevel = 'warning';
      recommendation = 'Moderate stress detected. Take regular work breaks and utilize sensory grounding tools.';
    }
    return { type, totalScore, maxScore: 40, severity, alertLevel, recommendation };
  }

  return { type, totalScore: 0, maxScore: 0, severity: 'Unknown', alertLevel: 'info', recommendation: '' };
}

export {
  analyzeTextStress,
  generateCBTResponse,
  calculateAssessmentScore
};
