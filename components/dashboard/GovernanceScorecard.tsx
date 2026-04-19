'use client';
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card } from '../ui/Card';
import { Download, Award, TrendingUp } from 'lucide-react';

import { calculateGovernanceScores, ScoreResult, getMaturityInsights } from '../../utils/scoring-engine';

interface GovernanceScorecardProps {
  data?: ScoreResult[];
  isLoading?: boolean;
}

export const GovernanceScorecard: React.FC<GovernanceScorecardProps> = ({ data: initialData, isLoading = false }) => {
  const [activeData, setActiveData] = React.useState<ScoreResult[]>(initialData || []);
  const [isCalculating, setIsCalculating] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        setActiveData(initialData);
        setIsCalculating(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const insights = getMaturityInsights(activeData);
  const globalScore = Math.round(activeData.reduce((acc, curr) => acc + curr.A, 0) / activeData.length) || 0;

  return (
    <Card 
      title="Scorecard de Governança" 
      subtitle="Benchmark Setorial: Healthcare (Algoritmo v2.1)"
      action={
        <div className="card-actions">
          {isCalculating && <span className="calculating-tag">Calculando...</span>}
          <button className="export-btn">
            <Download size={14} /> Exportar Report
          </button>
        </div>
      }
    >
      <div className={`scorecard-layout ${isCalculating ? 'calculating' : ''}`}>
        <div className="chart-section">
          {activeData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activeData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#888', fontSize: 10, fontWeight: 600 }} 
                />
                <Radar
                  name="Sua Empresa"
                  dataKey="A"
                  stroke="#00FF87"
                  fill="#00FF87"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Média Healthcare"
                  dataKey="B"
                  stroke="#444"
                  fill="#444"
                  fillOpacity={0.2}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121212', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    fontSize: '0.75rem' 
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="info-section">
          <div className="score-main">
            <div className="score-gauge-ring">
              <svg viewBox="0 0 36 36" className="circular-chart accent">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${globalScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="score-text">
                <span className="val">{globalScore}</span>
                <span className="pct">%</span>
              </div>
            </div>
            <div>
              <p className="score-value">{globalScore > 85 ? 'Top 5%' : globalScore > 70 ? 'Top 15%' : 'Setorial'}</p>
              <p className="score-label">Maturidade Algorítmica</p>
            </div>
          </div>

          <div className="insights-list">
            {insights.length > 0 ? insights.map((insight, idx) => (
              <div key={idx} className={`insight-item ${insight.type}`}>
                <TrendingUp size={14} />
                <p>{insight.text}</p>
              </div>
            )) : (
              <div className="insight-item success">
                <Award size={14} />
                <p>Maturidade estável. Nenhuma anomalia algorítmica detectada.</p>
              </div>
            )}
          </div>

          <div className="competitiveness-badge">
            <p className="badge-title">Compentitividade via Privacidade</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${globalScore}%` }}></div>
            </div>
            <p className="badge-footer">Liderança em Confiança Digital</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scorecard-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          align-items: center;
          transition: opacity 0.3s;
        }

        .scorecard-layout.calculating { opacity: 0.5; filter: blur(2px); }

        .card-actions { display: flex; align-items: center; gap: 16px; }

        .calculating-tag {
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: blink 1s infinite;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 8px;
          color: var(--foreground);
          font-size: 0.6875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover {
          background: rgba(0, 255, 135, 0.1);
          border-color: var(--accent);
          color: var(--accent);
        }

        .info-section {
          background: rgba(0, 0, 0, 0.3);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .score-main {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .score-gauge-ring {
          position: relative;
          width: 64px;
          height: 64px;
        }

        .score-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          line-height: 1;
        }

        .score-text .val { font-size: 1.125rem; font-weight: 800; color: var(--accent); }
        .score-text .pct { font-size: 0.5rem; color: var(--secondary); font-weight: 700; }

        .circular-chart { display: block; filter: drop-shadow(0 0 5px rgba(0, 255, 135, 0.2)); }
        .circle-bg { fill: none; stroke: rgba(255, 255, 255, 0.05); stroke-width: 3; }
        .circle { fill: none; stroke-width: 3; stroke-linecap: round; stroke: var(--accent); transition: stroke-dasharray 0.8s ease; }

        .score-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--foreground);
          line-height: 1;
        }

        .score-label {
          font-size: 0.6875rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .insight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--foreground);
          line-height: 1.4;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid transparent;
        }

        .insight-item.critical { border-color: rgba(255, 71, 87, 0.2); background: rgba(255, 71, 87, 0.02); }
        .insight-item.critical p strong { color: #FF4757; }
        
        .insight-item.success { border-color: rgba(0, 255, 135, 0.2); background: rgba(0, 255, 135, 0.02); }
        .insight-item.success p strong { color: var(--accent); }

        .competitiveness-badge {
          padding: 16px;
          background: rgba(0, 255, 135, 0.03);
          border: 1px dashed rgba(0, 255, 135, 0.2);
          border-radius: 8px;
        }

        .badge-title {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          margin-bottom: 8px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          transition: width 0.8s ease;
        }

        .badge-footer {
          font-size: 0.625rem;
          color: var(--secondary);
        }

        .text-accent { color: var(--accent); }

        @media (max-width: 1200px) {
          .scorecard-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Card>
  );
};

      <style jsx>{`
        .scorecard-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          align-items: center;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 8px;
          color: var(--foreground);
          font-size: 0.6875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover {
          background: rgba(0, 255, 135, 0.1);
          border-color: var(--accent);
          color: var(--accent);
        }

        .info-section {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .score-main {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--foreground);
          line-height: 1;
        }

        .score-label {
          font-size: 0.6875rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .insight-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--foreground);
          line-height: 1.4;
        }

        .competitiveness-badge {
          padding: 16px;
          background: rgba(0, 255, 135, 0.03);
          border: 1px dashed rgba(0, 255, 135, 0.2);
          border-radius: 8px;
        }

        .badge-title {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          margin-bottom: 8px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }

        .badge-footer {
          font-size: 0.625rem;
          color: var(--secondary);
        }

        .text-accent {
          color: var(--accent);
        }

        @media (max-width: 1200px) {
          .scorecard-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Card>
  );
};
