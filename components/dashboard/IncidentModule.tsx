'use client';
import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Search, 
  Filter, 
  ChevronRight, 
  FileWarning, 
  Bell, 
  CheckCircle2, 
  ExternalLink,
  History,
  LifeBuoy
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SideSheet } from '../ui/SideSheet';

interface Incident {
  id: string;
  type: string;
  asset: string;
  severity: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  status: 'Aberto' | 'Contenção' | 'Investigando' | 'Notificado' | 'Encerrado';
  discoveryDate: string;
  detectedBy: string;
  impactScore: number;
}

export const IncidentModule: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const incidents: Incident[] = [
    { id: 'INC-2024-001', type: 'Vazamento de Credenciais', asset: 'Internal-ERP', severity: 'Crítico', status: 'Investigando', discoveryDate: '18/04/2024 09:12', detectedBy: 'SIEM Core', impactScore: 88 },
    { id: 'INC-2024-002', type: 'Acesso Não Autorizado', asset: 'Database-PROD-01', severity: 'Alto', status: 'Contenção', discoveryDate: '17/04/2024 22:45', detectedBy: 'DLP Agent', impactScore: 65 },
    { id: 'INC-2024-003', type: 'Erro de Configuração S3', asset: 'Public-Assets-Bucket', severity: 'Médio', status: 'Notificado', discoveryDate: '16/04/2024 14:20', detectedBy: 'External Audit', impactScore: 42 },
    { id: 'INC-2024-004', type: 'Phishing Report', asset: 'Corporate-Email', severity: 'Baixo', status: 'Encerrado', discoveryDate: '15/04/2024 11:30', detectedBy: 'User Reported', impactScore: 12 },
  ];

  const filteredIncidents = incidents.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Crítico': return 'crimson';
      case 'Alto': return 'amber';
      case 'Médio': return 'cyan';
      case 'Baixo': return 'emerald';
      default: return undefined;
    }
  };

  return (
    <div className="module-container anim-fade-in">
      <div className="module-header">
        <div className="header-info">
          <h2 className="header-title">Incidentes e Respostas</h2>
          <p className="header-subtitle">Gestão de resposta a incidentes de segurança e conformidade LGPD</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn pulse">
            <AlertOctagon size={18} />
            Declarar Novo Incidente
          </button>
        </div>
      </div>

      <div className="metrics-summary">
        <div className="metric-box">
          <span className="m-label">TOTAL EM ABERTO</span>
          <span className="m-value text-error">03</span>
        </div>
        <div className="metric-box">
          <span className="m-label">MTTR (RESPOSTA MÉDIA)</span>
          <span className="m-value">4.2h</span>
        </div>
        <div className="metric-box">
          <span className="m-label">NOTIFICADOS ANPD</span>
          <span className="m-value text-accent">01</span>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por ID ou tipo de incidente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn"><Filter size={18} /> Filtros Avançados</button>
      </div>

      <div className="table-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>ID INCIDENTE</th>
              <th>TIPO / NATUREZA</th>
              <th>ATIVO AFETADO</th>
              <th>SEVERIDADE</th>
              <th>DATA DESCOBERTA</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((inc) => (
              <tr key={inc.id} onClick={() => setSelectedIncident(inc)}>
                <td className="font-mono text-secondary">{inc.id}</td>
                <td>
                  <div className="type-cell">
                    <span className="inc-type">{inc.type}</span>
                    <span className="inc-origin">Detectado via {inc.detectedBy}</span>
                  </div>
                </td>
                <td>
                  <div className="asset-link">
                    <Activity size={12} className="text-accent" />
                    <span>{inc.asset}</span>
                  </div>
                </td>
                <td>
                  <Badge variant={getSeverityBadge(inc.severity)}>{inc.severity}</Badge>
                </td>
                <td className="font-mono text-sm">{inc.discoveryDate}</td>
                <td>
                  <div className="status-badge-wrapper">
                    <div className={`status-pill ${inc.status.toLowerCase()}`}>
                      {inc.status}
                    </div>
                  </div>
                </td>
                <td>
                  <ChevronRight size={18} className="text-secondary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SideSheet 
        isOpen={!!selectedIncident} 
        onClose={() => setSelectedIncident(null)}
        title={`Incidente: ${selectedIncident?.id}`}
      >
        {selectedIncident && (
          <div className="incident-details">
            <div className="incident-impact-banner">
              <div className="impact-gauge">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${selectedIncident.impactScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">{selectedIncident.impactScore}%</text>
                </svg>
                <span className="gauge-label">Score de Impacto</span>
              </div>
              <div className={`severity-banner bg-${getSeverityBadge(selectedIncident.severity)}`}>
                <h4>{selectedIncident.type}</h4>
                <p>Identificado em {selectedIncident.discoveryDate} por {selectedIncident.detectedBy}.</p>
              </div>
            </div>

            <div className="lifecycle-tracker">
              <h5 className="section-title">CICLO DE VIDA DA RESPOSTA</h5>
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="t-icon"><CheckCircle2 size={14} /></div>
                  <div className="t-content">
                    <h6>Identificação</h6>
                    <p>Detectado por SIEM Core.</p>
                  </div>
                </div>
                <div className="timeline-item active">
                  <div className="t-icon pulse-amber"><Clock size={14} /></div>
                  <div className="t-content">
                    <h6>Contenção</h6>
                    <p>Bloqueio de IPs e isolamento do ativo.</p>
                  </div>
                </div>
                <div className="timeline-item pending">
                  <div className="t-icon"><Search size={14} /></div>
                  <div className="t-content">
                    <h6>Investigação</h6>
                    <p>Análise de logs e origem do vazamento.</p>
                  </div>
                </div>
                <div className="timeline-item pending">
                  <div className="t-icon"><Bell size={14} /></div>
                  <div className="t-content">
                    <h6>Notificação</h6>
                    <p>Avaliação de obrigatoriedade ANPD.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="anpd-assistant">
              <h5 className="section-title">ASSISTENTE DE NOTIFICAÇÃO (ANPD)</h5>
              <Card className="decision-card">
                <div className="decision-header">
                  <FileWarning size={18} className="text-warning" />
                  <span>Critérios de Notificação Obligatória</span>
                </div>
                <div className="checklist">
                  <label className="check-item">
                    <input type="checkbox" checked={selectedIncident.severity === 'Crítico'} readOnly />
                    <span>Afeta dados pessoais sensíveis?</span>
                  </label>
                  <label className="check-item">
                    <input type="checkbox" defaultChecked />
                    <span>Alto risco para direitos e liberdades?</span>
                  </label>
                  <label className="check-item">
                    <input type="checkbox" />
                    <span>Volume de titulares > 1000?</span>
                  </label>
                </div>
                <div className="decision-result required">
                  <AlertOctagon size={14} />
                  <span>NOTIFICAÇÃO PROVÁVEL REQUERIDA (72H)</span>
                </div>
              </Card>
            </div>

            <div className="playbook-actions">
              <h5 className="section-title">PLAYBOOK DE REAÇÃO</h5>
              <div className="action-grid">
                <button className="play-btn">
                  <History size={16} />
                  Coletar Logs Forenses
                </button>
                <button className="play-btn">
                  <LifeBuoy size={16} />
                  Acionar Assessoria Jurídica
                </button>
                <button className="play-btn outline">
                  <ExternalLink size={16} />
                  Gerar Relatório Preliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </SideSheet>

      <style jsx>{`
        .module-container {
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-title {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FFF 0%, #AAA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          color: var(--secondary);
          font-size: 0.9375rem;
        }

        .primary-btn {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.2);
        }

        .pulse { animation: pulseAnim 2s infinite; }
        @keyframes pulseAnim {
          0% { box-shadow: 0 0 0 0 rgba(0, 255, 135, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(0, 255, 135, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 255, 135, 0); }
        }

        .metrics-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .metric-box {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .m-label { font-size: 0.625rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.05em; }
        .m-value { font-size: 1.75rem; font-weight: 800; }

        .action-bar {
          display: flex;
          gap: 16px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .search-box input {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 0.875rem;
          outline: none;
        }

        .filter-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--secondary);
          padding: 0 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .table-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .incident-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .incident-table th {
          padding: 16px 24px;
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--secondary);
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
        }

        .incident-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
        }

        .incident-table tr:hover td { background: rgba(255, 255, 255, 0.01); }

        .type-cell { display: flex; flex-direction: column; gap: 4px; }
        .inc-type { font-weight: 700; color: var(--foreground); }
        .inc-origin { font-size: 0.75rem; color: var(--secondary); }

        .asset-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: #FFF;
        }

        .status-pill {
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          width: fit-content;
        }

        .status-pill.investigando { background: rgba(56, 189, 248, 0.1); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.2); }
        .status-pill.contenção { background: rgba(255, 165, 2, 0.1); color: #FFA502; border: 1px solid rgba(255, 165, 2, 0.2); }
        .status-pill.notificado { background: rgba(255, 255, 255, 0.1); color: #AAA; border: 1px solid rgba(255, 255, 255, 0.2); }
        .status-pill.encerrado { background: rgba(0, 255, 135, 0.1); color: var(--accent); border: 1px solid rgba(0, 255, 135, 0.2); }

        .incident-details { display: flex; flex-direction: column; gap: 40px; }

        .incident-impact-banner {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .impact-gauge { width: 80px; text-align: center; display: flex; flex-direction: column; gap: 8px; }
        .circular-chart { display: block; margin: 0 auto; max-width: 100%; max-height: 250px; }
        .circle-bg { fill: none; stroke: rgba(255, 255, 255, 0.05); stroke-width: 3.8; }
        .circle { fill: none; stroke-width: 2.8; stroke-linecap: round; stroke: var(--error); transition: stroke-dasharray 0.3s ease; }
        .percentage { fill: #FFF; font-family: 'JetBrains Mono', monospace; font-size: 0.5rem; font-weight: 800; text-anchor: middle; }
        .gauge-label { font-size: 0.625rem; color: var(--secondary); font-weight: 600; display: block; }

        .lifecycle-tracker .timeline { display: flex; flex-direction: column; gap: 0; margin-top: 16px; }
        .timeline-item { display: flex; gap: 20px; padding-bottom: 24px; position: relative; }
        .timeline-item:not(:last-child)::after { content: ''; position: absolute; left: 14px; top: 28px; bottom: 0; width: 1px; background: var(--border); }
        .t-icon { width: 30px; height: 30px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--secondary); z-index: 1; }
        .timeline-item.completed .t-icon { background: var(--success); color: #000; border-color: var(--success); }
        .timeline-item.active .t-icon { background: var(--warning); color: #000; border-color: var(--warning); }
        .pulse-amber { box-shadow: 0 0 15px rgba(255, 165, 2, 0.4); animation: pulseWarn 1.5s infinite; }
        @keyframes pulseWarn { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

        .timeline-item .t-content h6 { font-size: 0.8125rem; font-weight: 700; color: #FFF; margin-bottom: 2px; }
        .timeline-item .t-content p { font-size: 0.75rem; color: var(--secondary); }

        .section-title { font-size: 0.625rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.1em; margin-bottom: 12px; }

        .decision-card { padding: 20px !important; }
        .decision-header { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; font-weight: 700; color: #FFF; margin-bottom: 16px; }
        .checklist { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .check-item { display: flex; align-items: center; gap: 12px; font-size: 0.8125rem; color: var(--secondary); cursor: pointer; }
        .check-item input[type="checkbox"] { accent-color: var(--accent); }
        .decision-result { padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-size: 0.75rem; font-weight: 800; }
        .decision-result.required { background: rgba(255, 71, 87, 0.1); color: #FF4757; border: 1px solid rgba(255, 71, 87, 0.2); }

        .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .play-btn { background: var(--surface); border: 1px solid var(--border); color: #FFF; padding: 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
        .play-btn:hover { border-color: var(--accent); transform: translateY(-2px); }
        .play-btn.outline { grid-column: span 2; justify-content: center; background: transparent; border-style: dashed; }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-error { color: var(--error); }
        .text-warning { color: var(--warning); }
        .text-accent { color: var(--accent); }
        .text-secondary { color: var(--secondary); }
        .text-sm { font-size: 0.8125rem; }

        .anim-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
