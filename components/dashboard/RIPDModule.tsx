'use client';
import React, { useState } from 'react';
import { useDataSync } from '@/hooks/use-datasync';
import { RIPD } from '@/context/DataContext';
import { 
  FileText, 
  Search, 
  Plus, 
  FileDown, 
  Filter, 
  MoreHorizontal, 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  History,
  Lock,
  UserCheck
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SideSheet } from '../ui/SideSheet';
import { AIRIPDGenerator } from './AIRIPDGenerator';


interface RIPDModuleProps {
  navigateTo?: (tab: string, filter: string | null) => void;
  onCopilotOpen?: () => void;
}

export const RIPDModule: React.FC<RIPDModuleProps> = ({ navigateTo, onCopilotOpen }) => {
  const { ripds, toggleRIPDStatus } = useDataSync();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRIPD, setSelectedRIPD] = useState<RIPD | null>(null);

  const filteredRIPDs = ripds.filter(r => 
    r.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Crítico': return 'crimson';
      case 'Alto': return 'amber';
      case 'Médio': return 'cyan';
      case 'Baixo': return 'neon';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (ripd: RIPD) => {
    switch (ripd.status) {
      case 'Aprovado': return <Badge variant="emerald">Concluído</Badge>;
      case 'Em Revisão': return <Badge variant="cyan">Em Análise</Badge>;
      case 'Rascunho': return <Badge variant="amber">Pendente</Badge>;
      default: return null;
    }
  };

  if (view === 'create') {
    return (
      <div className="module-container">
        <button className="back-btn" onClick={() => setView('list')}>
          <ArrowLeft size={16} /> Voltar para Inventário
        </button>
        <AIRIPDGenerator />
      </div>
    );
  }

  return (
    <div className="module-container anim-fade-in">
      <div className="module-header">
        <div className="header-info">
          <h2 className="header-title">Inventário de RIPDs</h2>
          <p className="header-subtitle">Gestão centralizada de Relatórios de Impacto à Proteção de Dados</p>
        </div>
        <div className="header-actions">
          <button className="action-btn secondary">
            <Filter size={18} /> Filtrar
          </button>
          <button className="action-btn primary" onClick={() => setView('create')}>
            <Sparkles size={18} /> Novo RIPD com IA
          </button>
        </div>
      </div>

      <div className="table-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por projeto ou ID do relatório..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="stats-mini">
          <div className="stat">
            <span className="stat-value">{ripds.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value text-error">
              {ripds.filter(r => r.riskScore === 'Crítico').length}
            </span>
            <span className="stat-label">Riscos Críticos</span>
          </div>
          <div className="stat">
            <span className="stat-value text-cyan">
              {ripds.filter(r => r.status === 'Em Revisão').length}
            </span>
            <span className="stat-label">Em Revisão</span>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ripd-table">
          <thead>
            <tr>
              <th>ID RELATÓRIO</th>
              <th>PROJETO / ATIVO</th>
              <th>DEPARTAMENTO</th>
              <th>RISCO IA</th>
              <th>STATUS</th>
              <th>PROGRESSO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRIPDs.map((ripd) => (
              <tr key={ripd.id} onClick={() => setSelectedRIPD(ripd)}>
                <td className="font-mono text-secondary">{ripd.id}</td>
                <td>
                  <div className="project-cell">
                    <FileText size={16} className="text-accent" />
                    <div className="project-info">
                      <span className="p-name">{ripd.project}</span>
                      <span className="p-process text-xs text-secondary">ID Mapeamento: {ripd.linkedProcessId}</span>
                    </div>
                  </div>
                </td>
                <td className="text-secondary">{ripd.department}</td>
                <td>
                  <div className="risk-cell">
                    <div className={`risk-dot bg-${getRiskColor(ripd.riskScore)}`}></div>
                    <span>{ripd.riskScore}</span>
                  </div>
                </td>
                <td onClick={(e) => { e.stopPropagation(); toggleRIPDStatus(ripd.id); }} className="cursor-pointer">
                  {getStatusBadge(ripd)}
                </td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar-mini">
                      <div className="progress-fill" style={{ width: `${ripd.progress}%` }}></div>
                    </div>
                    <span className="progress-val">{ripd.progress}%</span>
                  </div>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" onClick={(e) => { e.stopPropagation(); navigateTo?.('mapping', ripd.linkedProcessId); }}>
                      <ExternalLink size={16} />
                    </button>
                    <button className="view-btn"><ChevronRight size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SideSheet
        isOpen={!!selectedRIPD}
        onClose={() => setSelectedRIPD(null)}
        title={`Análise de Impacto: ${selectedRIPD?.id}`}
      >
        {selectedRIPD && (
          <div className="ripd-details">
            <div className="ripd-hero bg-surface-hover">
              <div className={`impact-badge bg-${getRiskColor(selectedRIPD.riskScore)}`}>
                <AlertTriangle size={24} />
                <span>RISCO {selectedRIPD.riskScore.toUpperCase()}</span>
              </div>
              <div className="hero-info">
                <h3>{selectedRIPD.project}</h3>
                <p>Módulo de Governança de Impacto DataSync</p>
              </div>
            </div>

            <div className="action-hub mt-6">
              <button 
                className="ai-btn w-full"
                onClick={() => { onCopilotOpen?.(); setSelectedRIPD(null); }}
              >
                <Sparkles size={18} />
                Analisar Mitigações com Copilot IA
              </button>
            </div>

            <div className="linked-governance mt-8">
              <h5 className="section-title">GOVERNANÇA VINCULADA</h5>
              <Card className="linked-card" onClick={() => navigateTo?.('mapping', selectedRIPD.linkedProcessId)}>
                <div className="card-top">
                  <div className="l-icon"><ExternalLink size={16} /></div>
                  <div className="l-info">
                    <span className="l-label">Processo de Mapeamento (RoPA)</span>
                    <span className="l-value">{selectedRIPD.linkedProcessId} - {selectedRIPD.project}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <Badge variant="cyan">Mapeado</Badge>
                  <span className="text-xs text-secondary">Ver fluxo de dados</span>
                </div>
              </Card>
            </div>

            <div className="mitigation-checklist mt-8">
              <h5 className="section-title">CHECKLIST DE MITIGAÇÃO</h5>
              <div className="check-list">
                <div className="check-item verified">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Criptografia de dados em repouso</span>
                </div>
                <div className="check-item verified">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Controle de acesso granular (RBAC)</span>
                </div>
                <div className="check-item pending">
                  <ShieldCheck size={16} className="text-secondary" />
                  <span>Avaliação de legítimo interesse (LIA)</span>
                </div>
              </div>
            </div>

            <div className="dpo-formalization mt-8">
              <h5 className="section-title">FORMALIZAÇÃO E ASSINATURA</h5>
              <div className="signature-box">
                <div className="sig-header">
                  <UserCheck size={16} className="text-accent" />
                  <span>Aprovação do DPO</span>
                </div>
                {selectedRIPD.status === 'Aprovado' ? (
                  <div className="sig-signed">
                    <p className="sig-date text-xs text-secondary">Assinado digitalmente em {selectedRIPD.date}</p>
                    <div className="sig-stamp">APROVADO</div>
                  </div>
                ) : (
                  <div className="sig-pending">
                    <p className="text-xs text-secondary mb-4">Aguardando validação final das medidas de segurança.</p>
                    <button 
                      className="sig-btn"
                      onClick={() => toggleRIPDStatus(selectedRIPD.id)}
                    >
                      <Lock size={14} /> Assinar e Concluir RIPD
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="audit-trail mt-8">
              <h5 className="section-title">HISTÓRICO DE AUDITORIA</h5>
              <div className="trail-item">
                <History size={14} />
                <span>Relatório criado via AIRIPDGenerator</span>
                <span className="date">há 2 dias</span>
              </div>
            </div>
          </div>
        )}
      </SideSheet>

      <style jsx>{`
        .module-container {
          padding: 24px 40px;
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
          margin-bottom: 4px;
        }

        .header-subtitle {
          color: var(--secondary);
          font-size: 0.9375rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--secondary);
          font-size: 0.875rem;
          cursor: pointer;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--foreground);
        }

        .action-btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: var(--accent);
          color: #000;
          border: none;
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.2);
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0, 255, 135, 0.4);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--foreground);
        }

        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .search-bar {
          flex: 1;
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          transition: border-color 0.2s;
        }

        .search-bar:focus-within {
          border-color: var(--accent);
        }

        .search-icon {
          color: var(--secondary);
        }

        .search-bar input {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 0.875rem;
          outline: none;
        }

        .stats-mini {
          display: flex;
          gap: 24px;
          background: var(--surface);
          padding: 8px 24px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.625rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .table-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .ripd-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .ripd-table th {
          padding: 16px 24px;
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--secondary);
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
        }

        .ripd-table td {
          padding: 20px 24px;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border);
        }

        .ripd-table tr:last-child td {
          border-bottom: none;
        }

        .ripd-table tr:hover td {
          background: rgba(255, 255, 255, 0.01);
        }

        .project-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .project-info {
          display: flex;
          flex-direction: column;
        }

        .p-name { font-weight: 700; color: #FFF; }
        .text-xs { font-size: 0.75rem; }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 120px;
        }

        .progress-bar-mini {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          transition: width 0.3s ease;
        }

        .progress-val { font-size: 0.75rem; font-weight: 700; color: var(--secondary); }

        .risk-layer { display: flex; align-items: center; gap: 8px; }

        .ripd-details { display: flex; flex-direction: column; }

        .ripd-hero {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .impact-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 12px;
          color: #000;
          font-weight: 800;
          font-size: 0.625rem;
          min-width: 90px;
        }

        .hero-info h3 { font-size: 1.125rem; font-weight: 700; color: #FFF; margin-bottom: 4px; }
        .hero-info p { font-size: 0.75rem; color: var(--secondary); }

        .ai-btn {
          background: rgba(0, 255, 135, 0.1);
          color: var(--accent);
          border: 1px solid rgba(0, 255, 135, 0.2);
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-btn:hover { background: var(--accent); color: #000; }

        .section-title { font-size: 0.625rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.1em; margin-bottom: 12px; }

        .linked-card {
          padding: 16px !important;
          cursor: pointer;
          transition: all 0.2s;
        }

        .linked-card:hover { border-color: var(--accent); background: rgba(0, 255, 135, 0.02); }

        .card-top { display: flex; gap: 12px; margin-bottom: 12px; }
        .l-icon { color: var(--accent); }
        .l-info { display: flex; flex-direction: column; }
        .l-label { font-size: 0.625rem; font-weight: 700; color: var(--secondary); }
        .l-value { font-size: 0.8125rem; font-weight: 700; color: #FFF; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; }

        .check-list { display: flex; flex-direction: column; gap: 12px; }
        .check-item { display: flex; align-items: center; gap: 10px; font-size: 0.8125rem; color: var(--secondary); }
        .check-item.verified { color: #FFF; }

        .signature-box {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }

        .sig-header { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; margin-bottom: 16px; color: #FFF; }

        .sig-stamp {
          margin-top: 12px;
          padding: 8px;
          border: 2px solid var(--success);
          color: var(--success);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 1.25rem;
          width: fit-content;
          transform: rotate(-5deg);
        }

        .sig-btn {
          width: 100%;
          padding: 12px;
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .audit-trail { display: flex; flex-direction: column; gap: 12px; }
        .trail-item { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: var(--secondary); }
        .trail-item .date { margin-left: auto; opacity: 0.5; }

        .cursor-pointer { cursor: pointer; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }
        .mt-8 { margin-top: 32px; }
        .mb-4 { margin-bottom: 16px; }
        .w-full { width: 100%; }

        .bg-crimson { background: #FF4757; color: #FFF; }
        .bg-amber { background: #FFA502; color: #000; }
        .bg-cyan { background: #38BDF8; color: #000; }
        .bg-neon { background: var(--accent); color: #000; }

        .anim-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
