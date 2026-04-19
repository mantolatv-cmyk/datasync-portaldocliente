'use client';
import React from 'react';
import { Card } from '../ui/Card';
import { 
  FileCheck, 
  UserPlus, 
  ShieldAlert, 
  Settings, 
  ExternalLink 
} from 'lucide-react';

import { useDataSync } from '@/hooks/use-datasync';

export const ActivityTrail: React.FC = () => {
  const { logs } = useDataSync();

  const getLogIcon = (module: string) => {
    switch (module) {
      case 'Security': return ShieldAlert;
      case 'Vendor': return FileCheck;
      case 'RIPD': return FileCheck;
      default: return Settings;
    }
  };

  const getLogColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#FF4757';
      case 'medium': return '#FFA502';
      default: return 'var(--accent)';
    }
  };

  return (
    <Card 
      title="Feed de Atividades" 
      subtitle="Trilha de Auditoria em Tempo Real"
    >
      <div className="widget-content">
        <div className="timeline">
          {logs.map((item, index) => {
            const Icon = getLogIcon(item.module);
            const color = getLogColor(item.severity);
            return (
              <div key={item.id} className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-icon" style={{ borderColor: color }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  {index !== logs.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-right">
                  <div className="item-main">
                    <p className="item-message">{item.action}</p>
                    <button className="item-link">
                      <ExternalLink size={12} />
                    </button>
                  </div>
                  <div className="item-meta">
                    <span className="item-module">{item.module}</span>
                    <span className="item-dot">•</span>
                    <span className="item-time">{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="view-more">Ver Todos os Registros</button>
      </div>

      <style jsx>{`
        .widget-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          padding-left: 4px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
        }

        .timeline-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timeline-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 1;
        }

        .timeline-line {
          width: 1px;
          flex: 1;
          background: var(--border);
          margin: 4px 0;
        }

        .timeline-right {
          flex: 1;
          padding-bottom: 24px;
        }

        .item-main {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 4px;
        }

        .item-message {
          font-size: 0.8125rem;
          color: var(--foreground);
          line-height: 1.4;
        }

        .item-link {
          background: transparent;
          border: none;
          color: var(--secondary);
          transition: color 0.2s;
          padding-top: 2px;
        }

        .item-link:hover {
          color: var(--accent);
        }

        .item-time {
          font-size: 0.6875rem;
          color: var(--secondary);
        }

        .view-more {
          width: 100%;
          padding: 12px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--secondary);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
          margin-top: auto;
        }

        .view-more:hover {
          background: var(--surface-hover);
          color: var(--foreground);
          border-color: var(--secondary);
        }
      `}</style>
    </Card>
  );
};
