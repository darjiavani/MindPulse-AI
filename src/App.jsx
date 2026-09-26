// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StressAnalyzer from './components/StressAnalyzer';
import MindBotChat from './components/MindBotChat';
import ReliefToolkit from './components/ReliefToolkit';
import AssessmentHub from './components/AssessmentHub';
import AnalyticsView from './components/AnalyticsView';
import EmergencySOS from './components/EmergencySOS';
import AuthModal from './components/AuthModal';
import { stopAllAudio } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  
  // User Authentication state initialized from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mindpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [latestStressData, setLatestStressData] = useState({
    stressScore: 38,
    stressLevel: 'Mild',
    sentiment: 'Neutral'
  });

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('mindpulse_user', JSON.stringify(userData));
    localStorage.setItem('mindpulse_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mindpulse_user');
    localStorage.removeItem('mindpulse_token');
  };

  const handleToggleGlobalAudio = () => {
    if (isAudioActive) {
      stopAllAudio();
      setIsAudioActive(false);
    } else {
      setIsAudioActive(true);
    }
  };

  const handleAnalysisComplete = (data) => {
    setLatestStressData(data);
  };

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar 
          activeTab={activeTab} 
          onOpenSOS={() => setIsSOSOpen(true)}
          isAudioActive={isAudioActive}
          onToggleGlobalAudio={handleToggleGlobalAudio}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard setActiveTab={setActiveTab} stressData={latestStressData} user={user} />
          )}

          {activeTab === 'analyzer' && (
            <StressAnalyzer onAnalysisComplete={handleAnalysisComplete} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'chat' && (
            <MindBotChat onOpenSOS={() => setIsSOSOpen(true)} />
          )}

          {activeTab === 'toolkit' && (
            <ReliefToolkit />
          )}

          {activeTab === 'assessments' && (
            <AssessmentHub />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'helplines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button onClick={() => setIsSOSOpen(true)} className="btn-danger" style={{ width: 'fit-content' }}>
                Open Crisis SOS Window
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Emergency SOS Crisis Modal */}
      <EmergencySOS 
        isOpen={isSOSOpen || activeTab === 'helplines'} 
        onClose={() => { setIsSOSOpen(false); if (activeTab === 'helplines') setActiveTab('dashboard'); }} 
        setActiveTab={setActiveTab} 
      />

      {/* Login & Sign Up Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
