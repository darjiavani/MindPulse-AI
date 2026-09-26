// src/utils/audioSynth.js
// Advanced Web Audio API synthesizer for Binaural Frequency Tuning & Procedural Soundscapes

let audioCtx = null;
let currentNodes = {
  binaural: null,
  rain: null,
  waves: null
};

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Start or Update Binaural Beats Generator with customizable carrier & beat frequency
 * @param {number} baseFreq e.g. 210Hz
 * @param {number} beatFreq e.g. 6Hz (Theta wave)
 */
export function startBinauralBeats(baseFreq = 210, beatFreq = 6) {
  const ctx = getAudioContext();

  // If already playing, dynamically update frequencies for smooth tuning!
  if (currentNodes.binaural) {
    try {
      currentNodes.binaural.leftOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      currentNodes.binaural.rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, ctx.currentTime);
      return;
    } catch (e) {}
  }

  const leftOsc = ctx.createOscillator();
  const rightOsc = ctx.createOscillator();
  const merger = ctx.createChannelMerger(2);
  const masterGain = ctx.createGain();

  leftOsc.type = 'sine';
  rightOsc.type = 'sine';

  leftOsc.frequency.value = baseFreq;
  rightOsc.frequency.value = baseFreq + beatFreq;

  leftOsc.connect(merger, 0, 0);
  rightOsc.connect(merger, 0, 1);

  masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
  merger.connect(masterGain);
  masterGain.connect(ctx.destination);

  leftOsc.start();
  rightOsc.start();

  currentNodes.binaural = { leftOsc, rightOsc, masterGain };
}

export function stopBinauralBeats() {
  if (currentNodes.binaural) {
    try {
      currentNodes.binaural.leftOsc.stop();
      currentNodes.binaural.rightOsc.stop();
    } catch (e) {}
    currentNodes.binaural = null;
  }
}

/**
 * Synthesize Rain Soundscape
 */
export function startRainSound() {
  stopRainSound();
  const ctx = getAudioContext();

  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, ctx.currentTime);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  whiteNoise.start();
  currentNodes.rain = { whiteNoise, gain };
}

export function stopRainSound() {
  if (currentNodes.rain) {
    try { currentNodes.rain.whiteNoise.stop(); } catch (e) {}
    currentNodes.rain = null;
  }
}

/**
 * Synthesize Ocean Waves
 */
export function startOceanWaves() {
  stopOceanWaves();
  const ctx = getAudioContext();

  const bufferSize = ctx.sampleRate * 3;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.12;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gain = ctx.createGain();
  gain.gain.value = 0.18;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  lfo.start();

  currentNodes.waves = { noise, lfo, gain };
}

export function stopOceanWaves() {
  if (currentNodes.waves) {
    try {
      currentNodes.waves.noise.stop();
      currentNodes.waves.lfo.stop();
    } catch (e) {}
    currentNodes.waves = null;
  }
}

export function playBreathingChime(freq = 432, duration = 1.5) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export function stopAllAudio() {
  stopBinauralBeats();
  stopRainSound();
  stopOceanWaves();
}
