'use client';
import React, { useState, useEffect } from 'react';
import { useDataSync } from '@/hooks/use-datasync';
import { DSARRequest } from '@/context/DataContext';
import { 
  UserSearch, 
  UserCheck, 
  Clock, 
  Search, 
  FileDown, 
  Trash2, 
  Fingerprint, 
  Share2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Activity,
  History,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SideSheet } from '../ui/SideSheet';


interface DSARModuleProps {
  navigateTo?: (tab: string, filter: string | null) => void;
  onCopilotOpen?: () => void;
}

export const DSARModule: React.FC<DSARModuleProps> = ({ navigateTo, onCopilotOpen }) => {
  const { dsars, toggleDSARStatus } = useDataSync();
  const [selectedRequest, setSelectedRequest] = useState<DSARRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fulfillmentStep, setFulfillmentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleComplete = () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    setTimeout(() => {
      toggleDSARStatus(selectedRequest.id);
      setIsProcessing(false);
      setSelectedRequest(null);
    }, 1500);
  };

  const filteredRequests = dsars.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Concluído': return 'emerald';
      case 'Processando': return 'cyan';
      case 'Triagem': return 'amber';
      case 'Aguardando Titular': return 'amber';
      default: return undefined;
    }
  };

  const getSLAColor = (days: number) => {
    if (days <= 2) return 'text-error';
    if (days <= 5) return 'text-warning';
    return 'text-accent';
  };

  const handleStartFulfillment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setFulfillmentStep(2);
    }, 1500);
  };

  return (
    <div className="module-container anim-fade-in">
      <div className="module-header">
        <div className="header-info">
          <h2 className="header-title">Atendimento a Titulares (DSAR)</h2>
          <p className="header-subtitle">Gestão centralizada de direitos de privacidade e conformidade com os prazos da LGPD</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <UserSearch size={18} />
            Novo Pedido Manual
          </button>
        </div>
      </div>

      <div className="dsar-metrics">
        <div className="metric-box">
          <div className="metric-top">
            <span className="m-label">TOTAL PENDENTE</span>
            <Activity size={16} className="text-accent" />
          </div>
          <span className="m-value">12</span>
          <div className="m-footer text-warning">03 Pedidos com SLA crítico</div>
        </div>
        <div className="metric-box">
          <div className="metric-top">
            <span className="m-label">MTTR (ATENDIMENTO)</span>
            <Clock size={16} className="text-accent" />
          </div>
          <span className="m-value">4.8d</span>
          <div className="m-footer text-emerald">↓ 12% vs mês anterior</div>
        </div>
        <div className="metric-box">
          <div className="metric-top">
            <span className="m-label">VERIFICAÇÃO DE ID</span>
            <Fingerprint size={16} className="text-accent" />
          </div>
          <span className="m-value">94%</span>
          <div className="m-footer">Média de assertividade AI</div>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por titular ou ID do pedido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filters">
          <button className="filter-tab active">Abertos</button>
          <button className="filter-tab">Concluídos</button>
          <button className="filter-tab">Todos</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="dsar-table">
          <thead>
            <tr>
              <th>PEDIDO ID</th>
              <th>TITULAR / CONTATO</th>
              <th>OPERACIONAL</th>
              <th>PRAZO LEGAL (SLA)</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} onClick={() => { setSelectedRequest(req); setFulfillmentStep(1); }}>
                <td className="font-mono text-secondary">{req.id}</td>
                <td>
                  <div className="subject-cell">
                    <span className="sub-name">{req.name}</span>
                    <span className="sub-email">{req.email}</span>
                  </div>
                </td>
                <td>
                  <Badge variant={req.type === 'Exclusão' ? 'crimson' : 'cyan'}>{req.type}</Badge>
                </td>
                <td>
                  <div className="sla-cell">
                    <span className={`sla-days ${getSLAColor(req.daysRemaining)}`}>
                      {req.daysRemaining} dias restantes
                    </span>
                    <div className="sla-progress">
                      <div 
                        className={`sla-bar ${req.daysRemaining <= 5 ? 'critical' : ''}`} 
                        style={{ width: `${(req.daysRemaining / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
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
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        title={`Atendimento de Pedido: ${selectedRequest?.id}`}
      >
        {selectedRequest && (
          <div className="fulfillment-flow">
            <div className="subject-summary-banner">
              <div className="subject-avatar">
                {selectedRequest.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="info">
                <h3>{selectedRequest.name}</h3>
                <p>{selectedRequest.email}</p>
                <div className="verification-status">
                  {selectedRequest.idVerified ? (
                    <span className="verified"><UserCheck size={14} /> Identidade Verificada</span>
                  ) : (
                    <span className="unverified"><ShieldAlert size={14} /> Aguardando Validação ID</span>
                  )}
                </div>
              </div>
            </div>

            <div className="workflow-steps">
              <div className={`w-step ${fulfillmentStep >= 1 ? 'active' : ''}`}>
                <div className="step-num">{fulfillmentStep > 1 ? <CheckCircle2 size={16} /> : '1'}</div>
                <div className="step-content">
                  <h6>Triagem e Validação</h6>
                  <p>Verificação de legitimidade e identidade do solicitante.</p>
                </div>
              </div>
              <div className={`w-step ${fulfillmentStep >= 2 ? 'active' : ''}`}>
                <div className="step-num">{fulfillmentStep > 2 ? <CheckCircle2 size={16} /> : '2'}</div>
                <div className="step-content">
                  <h6>Mapeamento de Dados</h6>
                  <p>Localização de registros nos sistemas vinculados (ERP, CRM, RH).</p>
                </div>
              </div>
              <div className={`w-step ${fulfillmentStep >= 3 ? 'active' : ''}`}>
                <div className="step-num">3</div>
                <div className="step-content">
                  <h6>Extração e Resposta</h6>
                  <p>Geração do relatório final e envio seguro ao titular.</p>
                </div>
              </div>
            </div>

            {fulfillmentStep === 1 && (
              <div className="step-detail-view anim-fade-in">
                <Card className="action-card">
                  <h5 className="section-title">AÇÕES DE VALIDAÇÃO</h5>
                  <div className="validation-list">
                    <div className="v-item">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>Documento de Identidade Anexado</span>
                    </div>
                    <div className="v-item">
                      <AlertCircle size={16} className="text-warning" />
                      <span>Selfie de Segurança (Aguardando)</span>
                    </div>
                  </div>
                  <button 
                    className={`fulfill-btn ${isProcessing ? 'loading' : ''}`}
                    onClick={handleStartFulfillment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processando...' : 'Iniciar Localização de Dados'}
                  </button>
                </Card>
              </div>
            )}

            {fulfillmentStep === 2 && (
              <div className="step-detail-view anim-fade-in">
                <h5 className="section-title">SISTEMAS COM DADOS ENCONTRADOS</h5>
                <div className="asset-match-list">
                  <div className="asset-row">
                    <FileText size={18} className="text-cyan" />
                    <div className="asset-info">
                      <span className="a-name">SAP ERP Core</span>
                      <span className="a-type">Dados Cadastrais, Financeiro</span>
                    </div>
                    <button className="extract-btn">Extrair</button>
                  </div>
                  <div className="asset-row">
                    <Share2 size={18} className="text-emerald" />
                    <div className="asset-info">
                      <span className="a-name">Salesforce CRM</span>
                      <span className="a-type">Interações, Marketing</span>
                    </div>
                    <button className="extract-btn">Extrair</button>
                  </div>
                </div>
                <button className="fulfill-btn secondary mt-4" onClick={() => setFulfillmentStep(3)}>
                  Gerar Relatório de Resposta
                </button>
              </div>
            )}

            <div className="fulfillment-footer">
              <button className="ghost-btn text-error"><Trash2 size={16} /> Cancelar Pedido</button>
              <button className="ghost-btn"><History size={16} /> Log de Auditoria</button>
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

        .dsar-metrics {
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

        .metric-top { display: flex; justify-content: space-between; align-items: center; }
        .m-label { font-size: 0.625rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.05em; }
        .m-value { font-size: 2rem; font-weight: 800; color: #FFF; }
        .m-footer { font-size: 0.6875rem; font-weight: 600; opacity: 0.8; }

        .action-bar {
          display: flex;
          gap: 24px;
          align-items: center;
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

        .status-filters {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.02);
          padding: 6px;
          border-radius: 10px;
          border: 1px solid var(--border);
        }

        .filter-tab {
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
          background: transparent;
          border: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .filter-tab.active { background: var(--accent); color: #000; }

        .table-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow-x: auto;
        }

        .dsar-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 900px;
        }

        .dsar-table th {
          padding: 16px 24px;
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--secondary);
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
        }

        .dsar-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s;
        }

        .dsar-table tr:hover td { background: rgba(255, 255, 255, 0.01); }

        .subject-cell { display: flex; flex-direction: column; gap: 4px; }
        .sub-name { font-weight: 700; color: #FFF; }
        .sub-email { font-size: 0.75rem; color: var(--secondary); }

        .sla-cell { display: flex; flex-direction: column; gap: 6px; width: 140px; }
        .sla-days { font-size: 0.75rem; font-weight: 700; }
        .sla-progress { height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; }
        .sla-bar { height: 100%; background: var(--accent); border-radius: 2px; }
        .sla-bar.critical { background: var(--error); }

        /* SideSheet Detail Styles */
        .fulfillment-flow { display: flex; flex-direction: column; gap: 32px; }

        .subject-summary-banner {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .subject-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: var(--surface-hover);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
        }

        .verification-status { margin-top: 8px; font-size: 0.75rem; }
        .verified { color: var(--accent); display: flex; align-items: center; gap: 6px; }
        .unverified { color: var(--warning); display: flex; align-items: center; gap: 6px; }

        .workflow-steps { display: flex; flex-direction: column; gap: 0; }
        .w-step { display: flex; gap: 16px; position: relative; padding-bottom: 24px; opacity: 0.5; }
        .w-step.active { opacity: 1; }
        .w-step:not(:last-child)::after { content: ''; position: absolute; left: 14px; top: 28px; bottom: 0; width: 1px; background: var(--border); }
        .step-num { width: 30px; height: 30px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; z-index: 1; }
        .w-step.active .step-num { border-color: var(--accent); color: var(--accent); }

        .step-content h6 { font-size: 0.875rem; font-weight: 700; color: #FFF; margin-bottom: 2px; }
        .step-content p { font-size: 0.75rem; color: var(--secondary); }

        .fulfill-btn {
          width: 100%;
          padding: 16px;
          background: var(--accent);
          border: none;
          border-radius: 12px;
          color: #000;
          font-weight: 700;
          margin-top: 20px;
          cursor: pointer;
        }

        .fulfill-btn.secondary { background: rgba(56, 189, 248, 0.1); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.2); }

        .asset-match-list { display: flex; flex-direction: column; gap: 12px; }
        .asset-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          border: 1px solid var(--border);
        }

        .asset-info { flex: 1; display: flex; flex-direction: column; }
        .a-name { font-size: 0.8125rem; font-weight: 600; color: #FFF; }
        .a-type { font-size: 0.6875rem; color: var(--secondary); }

        .extract-btn { font-size: 0.625rem; font-weight: 800; color: var(--accent); background: transparent; border: 1px solid var(--accent); padding: 4px 10px; border-radius: 4px; }

        .fulfillment-footer { display: flex; justify-content: space-between; margin-top: 20px; }
        .ghost-btn { background: transparent; border: none; color: var(--secondary); font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        .text-accent { color: var(--accent); }
        .text-warning { color: var(--warning); }
        .text-emerald { color: #10B981; }
        .text-error { color: var(--error); }
        .text-secondary { color: var(--secondary); }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .anim-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) {
          .module-container { padding: 16px; }
          .dsar-metrics { grid-template-columns: 1fr; }
          .action-bar { flex-direction: column; align-items: stretch; }
          .status-filters { overflow-x: auto; white-space: nowrap; padding: 4px; }
          .header-title { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};
