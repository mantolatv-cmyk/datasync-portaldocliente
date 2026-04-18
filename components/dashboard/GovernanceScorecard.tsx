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

const data = [
  { subject: 'Transparência', A: 95, B: 65, fullMark: 100 },
  { subject: 'Gestão de Direitos', A: 88, B: 40, fullMark: 100 },
  { subject: 'Segurança Técnica', A: 92, B: 75, fullMark: 100 },
  { subject: 'Minimização', A: 85, B: 55, fullMark: 100 },
  { subject: 'Terceiros', A: 90, B: 50, fullMark: 100 },
];

export const GovernanceScorecard: React.FC = () => {
  return (
    <Card 
      title="Scorecard de Governança" 
      subtitle="Benchmark Setorial: Healthcare (Vantagem Competitiva)"
      action={
        <button className="export-btn">
          <Download size={14} /> Exportar Report
        </button>
      }
    >
      <div className="scorecard-layout">
        <div className="chart-section">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
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
        </div>

        <div className="info-section">
          <div className="score-main">
            <Award className="text-accent" size={24} />
            <div>
              <p className="score-value">Top 5%</p>
              <p className="score-label">Maturidade do Setor</p>
            </div>
          </div>

          <div className="insights-list">
            <div className="insight-item">
              <TrendingUp size={14} className="text-accent" />
              <p>+42% em <strong>Gestão de Direitos</strong> vs Média.</p>
            </div>
            <div className="insight-item">
              <TrendingUp size={14} className="text-accent" />
              <p>Diferencial competitivo em <strong>Transparência</strong>.</p>
            </div>
          </div>

          <div className="competitiveness-badge">
            <p className="badge-title">Compentitividade via Privacidade</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '88%' }}></div>
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
