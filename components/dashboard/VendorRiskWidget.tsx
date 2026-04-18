'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExternalLink } from 'lucide-react';

const data = [
  { name: 'Homologados', value: 42, color: '#00FF87' },
  { name: 'Risco Pendente', value: 12, color: '#FB2E01' },
  { name: 'Críticos', value: 5, color: '#FF0055' },
];

const assessments = [
  { id: 1, name: 'Cloud Provider X', status: 'Homologado', date: '12 Abr 2026' },
  { id: 2, name: 'SaaS Analytics', status: 'Em Revisão', date: '15 Abr 2026' },
];

export const VendorRiskWidget: React.FC = () => {
  return (
    <Card 
      title="Risco de Terceiros" 
      subtitle="Status da Cadeia de Suprimentos"
      action={<button className="text-button">Ver Todos</button>}
    >
      <div className="widget-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-center">
            <span className="total-value">59</span>
            <span className="total-label">Total</span>
          </div>
        </div>

        <div className="assessment-list">
          <p className="section-title">Últimas Avaliações</p>
          {assessments.map((item) => (
            <div key={item.id} className="assessment-item">
              <div className="item-info">
                <p className="item-name">{item.name}</p>
                <p className="item-date">{item.date}</p>
              </div>
              <Badge variant={item.status === 'Homologado' ? 'cyan' : 'amber'}>
                {item.status}
              </Badge>
              <button className="icon-link">
                <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .widget-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .chart-container {
          position: relative;
          height: 180px;
        }

        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .total-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .total-label {
          font-size: 0.75rem;
          color: var(--secondary);
        }

        .assessment-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .assessment-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: border-color 0.2s;
        }

        .assessment-item:hover {
          border-color: rgba(56, 189, 248, 0.2);
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--foreground);
        }

        .item-date {
          font-size: 0.6875rem;
          color: var(--secondary);
        }

        .text-button {
          background: transparent;
          border: none;
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .icon-link {
          background: transparent;
          border: none;
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </Card>
  );
};
