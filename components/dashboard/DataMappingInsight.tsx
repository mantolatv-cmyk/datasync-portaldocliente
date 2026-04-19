'use client';
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { Database, Activity } from 'lucide-react';

const trendData = [
  { value: 120 }, { value: 132 }, { value: 145 }, { value: 140 }, 
  { value: 155 }, { value: 168 }, { value: 182 }, { value: 175 },
  { value: 190 }, { value: 205 }, { value: 212 }, { value: 234 }
];

import { useDataSync } from '@/hooks/use-datasync';

interface DataMappingInsightProps {
  navigateTo: (tab: string, filter: string | null) => void;
}

export const DataMappingInsight: React.FC<DataMappingInsightProps> = ({ navigateTo }) => {
  const { activities } = useDataSync();

  const totalProcesses = activities.length;
  const sensitiveAssets = activities.filter(a => a.isSensitive).length;

  return (
    <Card 
      title="Fluxo de Dados" 
      subtitle="Inventário Dinâmico de Ativos"
      onClick={() => navigateTo('mapping', null)}
      isClickable
    >
      <div className="widget-content">
        <div className="metrics-row">
          <div className="metric-item">
            <div className="metric-header">
              <Database size={16} className="metric-icon" />
              <span>Processos Mapeados</span>
            </div>
            <div className="metric-body">
              <span className="metric-value">{totalProcesses}</span>
              <span className="metric-trend positive">+{(totalProcesses * 0.1).toFixed(1)}%</span>
            </div>
          </div>

          <div className="vertical-divider"></div>

          <div className="metric-item">
            <div className="metric-header">
              <Activity size={16} className="metric-icon" />
              <span>Processos Sensíveis</span>
            </div>
            <div className="metric-body">
              <span className="metric-value">{sensitiveAssets}</span>
              <span className="metric-trend positive">+{(sensitiveAssets * 0.2).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="trend-container">
          <div className="trend-header">
            <p className="section-title">Tendência de Inserção de Dados</p>
            <span className="trend-period">Últimos 12 meses</span>
          </div>
          <div className="micro-chart">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF87" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FF87" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00FF87" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .widget-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .metrics-row {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(15, 23, 42, 0.3);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .metric-item {
          flex: 1;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--secondary);
          margin-bottom: 8px;
        }

        .metric-icon {
          color: var(--accent);
        }

        .metric-body {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .metric-trend {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .metric-trend.positive { color: var(--success); }

        .vertical-divider {
          width: 1px;
          height: 40px;
          background: var(--border);
        }

        .trend-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trend-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .trend-period {
          font-size: 0.6875rem;
          color: var(--secondary);
        }

        .micro-chart {
          background: rgba(56, 189, 248, 0.02);
          border-radius: 8px;
          padding-top: 10px;
          overflow: hidden;
        }
      `}</style>
    </Card>
  );
};
