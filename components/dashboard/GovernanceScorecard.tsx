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
import { Download, Award, TrendingUp, Camera, ChevronUp, ChevronDown } from 'lucide-react';

import { ScoreResult, getMaturityInsights, getMaturityTier } from '../../utils/scoring-engine';
import { useDataSync } from '../../hooks/use-datasync';

interface GovernanceScorecardProps {
  data?: ScoreResult[];
  isLoading?: boolean;
}

export const GovernanceScorecard: React.FC<GovernanceScorecardProps> = ({ data: initialData, isLoading = false }) => {
  const { takeSnapshot, getTrend } = useDataSync();
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
  const { tier, color } = getMaturityTier(globalScore);
  const trend = getTrend();

  return (
    <Card 
      title="Scorecard de Governança" 
      subtitle="Benchmark Setorial: Healthcare (Motor Next-Gen v3.0)"
      action={
        <div className="card-actions">
          {isCalculating && <span className="calculating-tag">Calculando...</span>}
          <button className="snapshot-btn" onClick={takeSnapshot} title="Gerar Snapshot Histórico">
            <Camera size={14} /> Snapshot
          </button>
          <button className="export-btn" onClick={() => window.open('/report', '_blank')}>
            <Download size={14} /> Report
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
                  stroke={color}
                  fill={color}
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
              <svg viewBox="0 0 36 36" className="circular-chart" style={{ stroke: color }}>
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" style={{ stroke: color }} strokeDasharray={`${globalScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="score-text">
                <span className="val" style={{ color: color }}>{globalScore}</span>
                <span className="pct">%</span>
              </div>
            </div>
            <div>
              <div className="tier-badge" style={{ 
                backgroundColor: `rgba(${color.includes('var') ? '0, 255, 135' : '251, 165, 2'}, 0.1)`, 
                color: color,
                borderColor: `rgba(${color.includes('var') ? '0, 255, 135' : '251, 165, 2'}, 0.3)`
              }}>
                <Award size={12} />
                Nível: {tier}
              </div>
              <div className="trend-indicator">
                {trend !== 0 ? (
                  <div className={`trend-val ${trend > 0 ? 'up' : 'down'}`}>
                    {trend > 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    <span>{Math.abs(trend)}% vs histórico</span>
                  </div>
                ) : (
                  <span className="score-label">Estável</span>
                )}
              </div>
            </div>
          </div>

          <div className="insights-list">
            {insights.length > 0 ? insights.map((insight, idx) => (
              <div key={idx} className={`insight-item ${insight.type}`}>
                {insight.type === 'success' ? <Award size={14} /> : <TrendingUp size={14} />}
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
              <div className="progress-fill" style={{ width: `${globalScore}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
            </div>
            <p className="badge-footer">Benchmark Healthcare: Top 10% do setor.</p>
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

        .card-actions { display: flex; align-items: center; gap: 8px; }

        .calculating-tag {
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: blink 1s infinite;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .snapshot-btn, .export-btn {
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

        .snapshot-btn:hover { background: rgba(56, 189, 248, 0.1); border-color: #38BDF8; color: #38BDF8; }
        .export-btn:hover { background: rgba(0, 255, 135, 0.1); border-color: var(--accent); color: var(--accent); }

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

        .score-text .val { font-size: 1.25rem; font-weight: 800; }
        .score-text .pct { font-size: 0.5rem; color: var(--secondary); font-weight: 700; }

        .circular-chart { display: block; filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.1)); }
        .circle-bg { fill: none; stroke: rgba(255, 255, 255, 0.05); stroke-width: 3; }
        .circle { fill: none; stroke-width: 3; stroke-linecap: round; transition: stroke-dasharray 0.8s ease; }

        .tier-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          border: 1px solid transparent;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .trend-val { display: flex; align-items: center; gap: 2px; font-weight: 700; font-size: 0.75rem; }
        .trend-val.up { color: var(--accent); }
        .trend-val.down { color: var(--error); }

        .score-label {
          font-size: 0.6875rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
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
        .insight-item.warning { border-color: rgba(255, 165, 2, 0.2); background: rgba(255, 165, 2, 0.02); }
        .insight-item.success { border-color: rgba(0, 255, 135, 0.2); background: rgba(0, 255, 135, 0.02); }

        .competitiveness-badge {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--border);
          border-radius: 8px;
        }

        .badge-title {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--secondary);
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
          transition: width 0.8s ease;
        }

        .badge-footer {
          font-size: 0.625rem;
          color: var(--secondary);
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
