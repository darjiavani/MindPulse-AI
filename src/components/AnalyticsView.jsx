// src/components/AnalyticsView.jsx
import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Calendar, 
  Sparkles, 
  Brain, 
  HeartPulse 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsView() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Line Chart: Stress Trend Over Time
  const lineData = {
    labels: days,
    datasets: [
      {
        label: 'Stress Index (0-100)',
        data: [65, 58, 72, 45, 38, 42, 35],
        borderColor: '#818CF8',
        backgroundColor: 'rgba(129, 140, 248, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#38BDF8',
        pointBorderColor: '#FFF',
        pointRadius: 5
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0F172A', titleColor: '#F8FAFC', bodyColor: '#94A3B8' }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' }, min: 0, max: 100 }
    }
  };

  // Doughnut Chart: Mood Distribution
  const doughnutData = {
    labels: ['Calm & Balanced', 'Focused / Productive', 'Mild Stress', 'High Anxiety'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#10B981', '#06B6D4', '#F59E0B', '#F43F5E'],
        borderColor: '#090B15',
        borderWidth: 3
      }
    ]
  };

  // Bar Chart: Sleep vs Stress Correlation
  const barData = {
    labels: days,
    datasets: [
      {
        label: 'Sleep Duration (Hours)',
        data: [6.2, 6.8, 5.5, 7.8, 8.2, 8.5, 8.0],
        backgroundColor: '#06B6D4',
        borderRadius: 6
      },
      {
        label: 'Stress Index',
        data: [65, 58, 72, 45, 38, 42, 35],
        backgroundColor: '#F43F5E',
        borderRadius: 6
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)', marginBottom: '8px' }}>
          <BarChart3 size={14} /> Comprehensive Analytics & Insights
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Mental Health & <span className="gradient-text">Stress Trends</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track your psychological stress patterns, sleep correlations, and mood distribution over time.
        </p>
      </div>

      {/* Grid Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Line Chart: 7-Day Stress Index */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Stress Trajectory</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7-Day rolling average</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={14} /> -18% Stress Reduction
            </span>
          </div>

          <div style={{ height: '240px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Doughnut Chart: Mood Breakdown */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Emotional State Breakdown</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '20px' }}>Monthly sentiment proportion</span>

          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>

      {/* Sleep vs Stress Correlation Bar Chart */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Sleep vs. Stress Load Correlation</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Notice how days with &gt;7.5 hours of sleep directly correlate with lower stress indices.
        </p>

        <div style={{ height: '260px' }}>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

    </div>
  );
}
