'use client';
import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  FileCheck, 
  ExternalLink, 
  Activity, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SideSheet } from '../ui/SideSheet';

interface Vendor {
  id: string;
  name: string;
  category: string;
  mappedActivities: number;
  sensitiveActivities: number;
  lastAudit: string;
  status: 'Compliant' | 'At Risk' | 'Audit Required';
}

interface VendorModuleProps {
  navigateTo: (tab: string, filter: string | null) => void;
  selectedId: string | null;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ navigateTo, selectedId }) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const vendors: Vendor[] = [
    { id: 'V-001', name: 'AWS Brazil', category: 'Cloud Infrastructure', mappedActivities: 8, sensitiveActivities: 3, lastAudit: '10/01/2024', status: 'Compliant' },
    { id: 'V-002', name: 'Salesforce (SaaS)', category: 'CRM', mappedActivities: 4, sensitiveActivities: 1, lastAudit: '15/12/2023', status: 'Compliant' },
    { id: 'V-003', name: 'Zendesk Inc.', category: 'Customer Support', mappedActivities: 2, sensitiveActivities: 0, lastAudit: '05/02/2024', status: 'Compliant' },
    { id: 'V-004', name: 'Loggi Tecnologia', category: 'Logistics / Delivery', mappedActivities: 3, sensitiveActivities: 2, lastAudit: '20/03/2024', status: 'At Risk' },
    { id: 'V-005', name: 'Soluções Contábeis LTDA', category: 'Accounting / Payroll', mappedActivities: 1, sensitiveActivities: 1, lastAudit: '02/11/2023', status: 'Audit Required' },
  ];

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateRiskScore = (vendor: Vendor) => {
    // Logic: More sensitive activities = higher risk score
    // Compliant status reduces visual risk weight
    const score = (vendor.sensitiveActivities * 25) + (vendor.mappedActivities * 5);
    return Math.min(score, 100);
  };

  const getRiskLevel = (score: number) => {
    if (score > 70) return { label: 'Crítico', color: 'crimson' };
    if (score > 40) return { label: 'Médio', color: 'amber' };
    return { label: 'Baixo', color: 'emerald' };
  };

  return (
    <div className="module-container anim-fade-in">
      <div className="module-header">
        <div className="header-info">
          <h2 className="header-title">Gestão de Riscos de Terceiros (TPRM)</h2>
          <p className="header-subtitle">Auditoria e conformidade de fornecedores vinculados ao Data Mapping</p>
        </div>
        <button className="primary-btn">
          <Plus size={18} /> Adicionar Fornecedor
        </button>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar fornecedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="summary-stats">
          <div className="stat-card">
            <span className="val">22</span>
            <span className="lab">Vendores</span>
          </div>
          <div className="stat-card">
            <span className="val text-error">3</span>
            <span className="lab">Em Risco</span>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>FORNECEDOR / PARCEIRO</th>
              <th>CATEGORIA</th>
              <th>PROCESSOS VINCULADOS</th>
              <th>SCORE DE RISCO (IA)</th>
              <th>STATUS AUDITORIA</th>
              <th>ÚLTIMA REV.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => {
              const score = calculateRiskScore(vendor);
              const risk = getRiskLevel(score);
              return (
                <tr 
                  key={vendor.id} 
                  onClick={() => setSelectedVendor(vendor)}
                  className={selectedId === vendor.id ? 'active-focus-pulse' : ''}
                >
                  <td>
                    <div className="vendor-cell">
                      <div className="vendor-icon">
                        <Building2 size={16} />
                      </div>
                      <div className="vendor-info">
                        <span className="vendor-name">{vendor.name}</span>
                        <span className="vendor-id">{vendor.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{vendor.category}</td>
                  <td>
                    <div className="activity-count">
                      <Activity size={14} className="text-accent" />
                      <span>{vendor.mappedActivities} atividades</span>
                      {vendor.sensitiveActivities > 0 && (
                        <Badge variant="crimson">{vendor.sensitiveActivities} Sensíveis</Badge>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="risk-indicator">
                      <div className="progress-bar">
                        <div className={`progress-fill bg-${risk.color}`} style={{ width: `${score}%` }}></div>
                      </div>
                      <span className={`risk-text text-${risk.color}`}>{risk.label} ({score})</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={vendor.status === 'Compliant' ? 'emerald' : vendor.status === 'At Risk' ? 'crimson' : 'amber'}>
                      {vendor.status}
                    </Badge>
                  </td>
                  <td className="text-secondary">{vendor.lastAudit}</td>
                  <td>
                    <button className="view-btn">
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SideSheet 
        isOpen={!!selectedVendor} 
        onClose={() => setSelectedVendor(null)}
        title={`Auditoria: ${selectedVendor?.name}`}
      >
        {selectedVendor && (
          <div className="audit-details">
            <div className="summary-banner">
              <ShieldCheck size={48} className="text-accent" />
              <div className="banner-info">
                <h4>Score Geral de Privacidade</h4>
                <div className="big-score">A+</div>
                <p>Último preenchimento por compliance@datasync.com.br</p>
              </div>
            </div>

            <div className="audit-sections">
              <div className="audit-section">
                <h5 className="section-title">CHECKLIST DE CONFORMIDADE</h5>
                <div className="checklist-item done">
                  <FileCheck size={16} />
                  <span>Políticas de Privacidade Atualizadas</span>
                </div>
                <div className="checklist-item done">
                  <FileCheck size={16} />
                  <span>DPA (Data Processing Agreement) Assinado</span>
                </div>
                <div className="checklist-item pending">
                  <AlertCircle size={16} />
                  <span>Certificação ISO 27001 / SOC2</span>
                </div>
                <div className="checklist-item warn">
                  <AlertCircle size={16} />
                  <span>Mapeamento de Sub-operadores</span>
                </div>
              </div>

              <div className="audit-section">
                <h5 className="section-title">PROCESSOS VINCULADOS (DATA MAPPING)</h5>
                <p className="section-desc">Este fornecedor opera os seguintes processos de tratamento mapeados na LGPD:</p>
                <div className="linked-activities">
                  <div 
                    className="activity-link"
                    onClick={() => navigateTo('mapping', 'PROC-001')}
                  >
                    <ExternalLink size={14} />
                    <span>Folha de Pagamento Interna</span>
                  </div>
                  <div 
                    className="activity-link"
                    onClick={() => navigateTo('mapping', 'PROC-003')}
                  >
                    <ExternalLink size={14} />
                    <span>Hospedagem de Dados - Portal Cliente</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="action-button full-width">Nova Auditoria Técnica</button>
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
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
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

        .summary-stats {
          display: flex;
          gap: 16px;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }

        .stat-card .val { font-weight: 700; font-size: 1rem; }
        .stat-card .lab { font-size: 0.625rem; color: var(--secondary); text-transform: uppercase; }

        .table-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .vendor-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .vendor-table th {
          padding: 16px 24px;
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--secondary);
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
        }

        .vendor-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
        }

        .vendor-table tr:hover td {
          background: rgba(255, 255, 255, 0.01);
        }

        .vendor-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vendor-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .vendor-name { display: block; font-weight: 600; font-size: 0.9375rem; }
        .vendor-id { display: block; font-size: 0.6875rem; color: var(--secondary); font-family: monospace; }

        .activity-count {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8125rem;
        }

        .risk-indicator {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .progress-bar {
          width: 120px;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill { height: 100%; transition: width 0.3s; }
        .risk-text { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; }

        .bg-crimson { background: #FF4757; }
        .bg-amber { background: #FFA502; }
        .bg-emerald { background: var(--accent); }

        .text-error { color: #FF4757; }
        .text-secondary { color: var(--secondary); }
        .text-accent { color: var(--accent); }

        .audit-details {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .summary-banner {
          background: rgba(0, 255, 135, 0.05);
          border: 1px solid rgba(0, 255, 135, 0.1);
          padding: 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .big-score {
          font-size: 3rem;
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          margin: 4px 0;
        }

        .summary-banner p { font-size: 0.75rem; color: var(--secondary); }

        .audit-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-title { font-size: 0.6875rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.05em; }
        .section-desc { font-size: 0.8125rem; color: var(--secondary); }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          padding: 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
        }

        .checklist-item.done { color: var(--success); }
        .checklist-item.pending { color: var(--secondary); }
        .checklist-item.warn { color: var(--warning); }

        .linked-activities {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .activity-link {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: var(--foreground);
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
        }

        .activity-link:hover { color: var(--accent); }

        .action-button {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .full-width { width: 100%; }

        @media (max-width: 1024px) {
          .module-container { padding: 16px; gap: 16px; }
          .module-header { flex-direction: column; gap: 12px; }
          .header-title { font-size: 1.5rem; }
          .header-subtitle { font-size: 0.8125rem; }
          .action-bar { flex-direction: column; align-items: stretch; gap: 16px; }
          .search-box { width: 100%; }
          .summary-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .stat-card { min-width: 0; padding: 12px; }
          
          .table-wrapper { 
            overflow-x: auto; 
            -webkit-overflow-scrolling: touch; 
          }
          .vendor-table { min-width: 900px; }
          
          .summary-banner { flex-direction: column; text-align: center; gap: 16px; }
        }
      `}</style>
    </div>
  );
};
