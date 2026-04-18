'use client';
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  FileDown, 
  Filter, 
  MoreHorizontal, 
  ChevronRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AIRIPDGenerator } from './AIRIPDGenerator';

interface RIPD {
  id: string;
  project: string;
  department: string;
  riskScore: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  status: 'Aprovado' | 'Em Revisão' | 'Rascunho';
  date: string;
}

export const RIPDModule: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const ripds: RIPD[] = [
    { id: 'RIPD-2024-001', project: 'App Fidelidade Mobile', department: 'Marketing', riskScore: 'Alto', status: 'Aprovado', date: '12/04/2024' },
    { id: 'RIPD-2024-002', project: 'API Integração Checkout', department: 'E-commerce', riskScore: 'Médio', status: 'Em Revisão', date: '15/04/2024' },
    { id: 'RIPD-2024-003', project: 'Sistema Biometria RH', department: 'Recursos Humanos', riskScore: 'Crítico', status: 'Rascunho', date: '17/04/2024' },
    { id: 'RIPD-2024-004', project: 'Data Lake Snowflake', department: 'Data Intelligence', riskScore: 'Baixo', status: 'Aprovado', date: '10/04/2024' },
    { id: 'RIPD-2024-005', project: 'Chatbot Atendimento IA', department: 'CS', riskScore: 'Médio', status: 'Em Revisão', date: '18/04/2024' },
  ];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
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
            <span className="stat-value text-warning">2</span>
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
              <th>ÚLTIMA ATUALIZAÇÃO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRIPDs.map((ripd) => (
              <tr key={ripd.id}>
                <td className="font-mono text-secondary">{ripd.id}</td>
                <td>
                  <div className="project-cell">
                    <FileText size={16} className="text-accent" />
                    <span>{ripd.project}</span>
                  </div>
                </td>
                <td className="text-secondary">{ripd.department}</td>
                <td>
                  <div className="risk-cell">
                    <div className={`risk-dot bg-${getRiskColor(ripd.riskScore)}`}></div>
                    <span>{ripd.riskScore}</span>
                  </div>
                </td>
                <td>{getStatusBadge(ripd.status)}</td>
                <td className="text-secondary">{ripd.date}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn"><FileDown size={16} /></button>
                    <button className="icon-btn"><MoreHorizontal size={16} /></button>
                    <button className="view-btn"><ChevronRight size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          font-weight: 600;
        }

        .risk-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .risk-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .bg-crimson { background: #FF4757; box-shadow: 0 0 8px #FF4757; }
        .bg-amber { background: #FFA502; box-shadow: 0 0 8px #FFA502; }
        .bg-cyan { background: #2ED573; box-shadow: 0 0 8px #2ED573; }
        .bg-neon { background: var(--accent); box-shadow: 0 0 8px var(--accent); }

        .row-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-end;
        }

        .icon-btn, .view-btn {
          background: transparent;
          border: none;
          color: var(--secondary);
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          color: var(--foreground);
          background: rgba(255, 255, 255, 0.05);
        }

        .view-btn {
          color: var(--accent);
        }

        .view-btn:hover {
          transform: translateX(3px);
          color: #FFF;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-secondary { color: var(--secondary); }
        .text-accent { color: var(--accent); }
        .text-warning { color: var(--warning); }

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
