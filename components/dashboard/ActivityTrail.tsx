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

const activities = [
  {
    id: 1,
    type: 'ripd',
    message: 'RIPD do sistema financeiro assinado eletronicamente',
    time: 'Há 12 min',
    icon: FileCheck,
    color: 'var(--success)'
  },
  {
    id: 2,
    type: 'vendor',
    message: 'Fornecedor X classificado como Risco Médio',
    time: 'Há 45 min',
    icon: ShieldAlert,
    color: 'var(--warning)'
  },
  {
    id: 3,
    type: 'user',
    message: 'Novo gestor de privacidade adicionado: Mariana Silva',
    time: 'Há 2 horas',
    icon: UserPlus,
    color: 'var(--accent)'
  },
  {
    id: 4,
    type: 'system',
    message: 'Scaneamento de vulnerabilidades rotineiro concluído',
    time: 'Há 5 horas',
    icon: Settings,
    color: 'var(--secondary)'
  },
];

export const ActivityTrail: React.FC = () => {
  return (
    <Card 
      title="Feed de Atividades" 
      subtitle="Trilha de Auditoria em Tempo Real"
    >
      <div className="widget-content">
        <div className="timeline">
          {activities.map((item, index) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-left">
                <div className="timeline-icon" style={{ borderColor: item.color }}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                {index !== activities.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-right">
                <div className="item-main">
                  <p className="item-message">{item.message}</p>
                  <button className="item-link">
                    <ExternalLink size={12} />
                  </button>
                </div>
                <p className="item-time">{item.time}</p>
              </div>
            </div>
          ))}
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
