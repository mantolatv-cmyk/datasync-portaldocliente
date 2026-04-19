'use client';
import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Table as TableIcon, 
  Network, 
  Filter, 
  ShieldAlert, 
  Users, 
  Scale,
  Download,
  ExternalLink,
  Building2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DataLineage } from './DataLineage';

interface ProcessingActivity {
  id: string;
  name: string;
  purpose: string;
  categories: string[];
  subjects: string;
  legalBase: string;
  isSensitive: boolean;
  status: 'Ativo' | 'Em Revisão' | 'Arquivado';
  department: 'RH' | 'TI' | 'Marketing' | 'Financeiro' | 'Jurídico';
  vendorId?: string;
  vendorName?: string;
}

interface MappingModuleProps {
  navigateTo: (tab: string, filter: string | null) => void;
  selectedId: string | null;
}

export const MappingModule: React.FC<MappingModuleProps> = ({ navigateTo, selectedId }) => {
  const [viewMode, setViewMode] = useState<'table' | 'visual'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDept, setActiveDept] = useState('Todos');

  const [activities, setActivities] = useState<ProcessingActivity[]>([
    { 
      id: 'PROC-001', 
      name: 'Gestão de Folha de Pagamento', 
      purpose: 'Cumprimento de obrigações trabalhistas e pagamentos.', 
      categories: ['Identificação', 'Financeiro', 'Saúde'], 
      subjects: 'Colaboradores', 
      legalBase: 'Cumprimento de Contrato / Obrigação Legal',
      isSensitive: true,
      status: 'Ativo',
      department: 'RH',
      vendorId: 'V-005',
      vendorName: 'Soluções Contábeis'
    },
    { 
      id: 'PROC-002', 
      name: 'Marketing Direto & Newsletter', 
      purpose: 'Envio de ofertas e comunicações institucionais.', 
      categories: ['Nome', 'E-mail', 'Preferências'], 
      subjects: 'Leads / Clientes', 
      legalBase: 'Consentimento / Legítimo Interesse',
      isSensitive: false,
      status: 'Ativo',
      department: 'Marketing',
      vendorName: 'Interno'
    },
    { 
      id: 'PROC-003', 
      name: 'Plataforma de E-commerce', 
      purpose: 'Processamento de vendas e entrega de produtos.', 
      categories: ['Identificação', 'Endereço', 'Cartão'], 
      subjects: 'Clientes', 
      legalBase: 'Execução de Contrato',
      isSensitive: false,
      status: 'Em Revisão',
      department: 'TI',
      vendorId: 'V-001',
      vendorName: 'AWS Brazil'
    },
    { 
      id: 'PROC-004', 
      name: 'Controle de Acesso Físico (Sede)', 
      purpose: 'Segurança patrimonial e controle de entrada/saída.', 
      categories: ['Biometria', 'Imagem (CFTV)'], 
      subjects: 'Visitantes / Terceiros', 
      legalBase: 'Prevenção à Fraude e Segurança do Titular',
      isSensitive: true,
      status: 'Ativo',
      department: 'TI'
    },
    { 
      id: 'PROC-005', 
      name: 'Pesquisa de Clima Organizacional', 
      purpose: 'Análise de satisfação interna e melhoria de processos.', 
      categories: ['Opinião', 'Cargo', 'E-mail (Anonimizado)'], 
      subjects: 'Colaboradores', 
      legalBase: 'Legítimo Interesse',
      isSensitive: false,
      status: 'Arquivado',
      department: 'RH'
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<ProcessingActivity | null>(null);

  const calculateHealth = (activity: ProcessingActivity) => {
    let score = 0;
    if (activity.legalBase) score += 40;
    if (activity.purpose) score += 20;
    if (activity.categories.length > 0) score += 20;
    if (activity.vendorName) score += 20;
    return score;
  };

  const toggleStatus = (id: string) => {
    setActivities(prev => prev.map(a => {
      if (a.id === id) {
        const statuses: ProcessingActivity['status'][] = ['Ativo', 'Em Revisão', 'Arquivado'];
        const nextIdx = (statuses.indexOf(a.status) + 1) % statuses.length;
        return { ...a, status: statuses[nextIdx] };
      }
      return a;
    }));
  };

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = activeDept === 'Todos' || a.department === activeDept;
    return matchesSearch && matchesDept;
  });

  if (viewMode === 'visual') {
    return (
      <div className="module-container">
        <div className="view-header">
          <div className="header-info">
            <h2 className="header-title">Linhagem de Dados Técnica</h2>
            <p className="header-subtitle">Visualização gráfica do fluxo de informação e interconexões</p>
          </div>
          <div className="switcher-group">
            <button className="switch-btn" onClick={() => setViewMode('table')}>
              <TableIcon size={16} /> Ver Tabela
            </button>
            <button className="switch-btn active">
              <Network size={16} /> Mapa Visual
            </button>
          </div>
        </div>
        <DataLineage />
      </div>
    );
  }

  return (
    <div className="module-container anim-fade-in">
      <div className="module-header">
        <div className="header-info">
          <h2 className="header-title">Mapeamento de Dados (RoPA)</h2>
          <p className="header-subtitle">Registro de Operações de Tratamento de Dados Pessoais - Art. 37 LGPD</p>
        </div>
        <div className="dept-ribbon">
          {['Todos', 'RH', 'TI', 'Marketing', 'Financeiro', 'Jurídico'].map(dept => (
            <button 
              key={dept} 
              className={`dept-tab ${activeDept === dept ? 'active' : ''}`}
              onClick={() => setActiveDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por atividade ou id..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="btn secondary"><Download size={18} /> Exportar RoPA</button>
          <button className="btn primary"><Plus size={18} /> Novo Mapeamento</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ropa-table">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>SAÚDE</th>
              <th>ATIVIDADE DE TRATAMENTO</th>
              <th>CATEGORIAS</th>
              <th>BASE LEGAL</th>
              <th>OPERADOR</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => (
              <tr 
                key={activity.id} 
                className={selectedId === activity.id ? 'active-focus-pulse' : ''}
              >
                <td className="font-mono text-secondary">{activity.id}</td>
                <td>
                  <div className="health-cell">
                    <div className="health-gauge">
                      <div 
                        className={`health-fill ${calculateHealth(activity) < 50 ? 'critical' : calculateHealth(activity) < 80 ? 'warning' : 'success'}`}
                        style={{ width: `${calculateHealth(activity)}%` }}
                      ></div>
                    </div>
                    <span className="health-value">{calculateHealth(activity)}%</span>
                  </div>
                </td>
                <td>
                  <div className="activity-cell">
                    <div className="name-wrapper">
                      <span className="activity-name">{activity.name}</span>
                      <span className="activity-purpose">{activity.department} • {activity.subjects}</span>
                    </div>
                    {activity.isSensitive && (
                      <div className="sensitive-indicator" title="Contém Dados Sensíveis">
                        <ShieldAlert size={14} />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="tags-list">
                    {activity.categories.map(cat => (
                      <span key={cat} className="category-tag">{cat}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="legal-cell">
                    <Scale size={14} className="text-accent" />
                    <span>{activity.legalBase}</span>
                  </div>
                </td>
                <td>
                  <button 
                    className={`vendor-link-btn ${activity.vendorId ? 'nav-link' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activity.vendorId) navigateTo('vendor', activity.vendorId);
                    }}
                  >
                    <Building2 size={14} />
                    <span>{activity.vendorName || 'Interno'}</span>
                  </button>
                </td>
                <td>
                  <div className="status-toggle-wrapper" onClick={() => toggleStatus(activity.id)}>
                    <Badge variant={activity.status === 'Ativo' ? 'emerald' : activity.status === 'Em Revisão' ? 'amber' : 'crimson'}>
                      {activity.status}
                    </Badge>
                  </div>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="view-details" title="Ver Detalhes Técnicos">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .dept-ribbon {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.02);
          padding: 6px;
          border-radius: 12px;
          border: 1px solid var(--border);
          width: fit-content;
        }

        .dept-tab {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dept-tab:hover { color: #FFF; }
        .dept-tab.active { background: var(--accent); color: #000; box-shadow: 0 2px 10px rgba(0, 255, 135, 0.2); }

        .health-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 80px;
        }

        .health-gauge {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .health-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease-out;
        }

        .health-fill.success { background: var(--accent); }
        .health-fill.warning { background: var(--warning); }
        .health-fill.critical { background: var(--error); }

        .health-value {
          font-size: 0.6875rem;
          font-weight: 800;
          color: var(--secondary);
          font-family: 'JetBrains Mono', monospace;
        }

        .status-toggle-wrapper {
          cursor: pointer;
          transition: transform 0.1s;
        }

        .status-toggle-wrapper:active { transform: scale(0.95); }

        .module-container {
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .module-header, .view-header {
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

        .switcher-group {
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          display: flex;
          gap: 4px;
          border: 1px solid var(--border);
        }

        .switch-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .switch-btn.active {
          background: var(--surface);
          color: var(--accent);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .search-box {
          flex: 1;
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0 16px;
          display: flex;
          align-items: center;
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

        .search-icon { color: var(--secondary); }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
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

        .btn.primary {
          background: var(--accent);
          color: #000;
          border: none;
        }

        .btn.secondary {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--foreground);
        }

        .btn:hover { transform: translateY(-2px); }

        .table-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .ropa-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .ropa-table th {
          padding: 16px 24px;
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--secondary);
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
        }

        .ropa-table td {
          padding: 24px;
          border-bottom: 1px solid var(--border);
          vertical-align: top;
        }

        .activity-cell {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .name-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .activity-name {
          font-weight: 700;
          color: var(--foreground);
        }

        .activity-purpose {
          font-size: 0.75rem;
          color: var(--secondary);
          line-height: 1.4;
        }

        .sensitive-indicator {
          color: #FF4757;
          background: rgba(255, 71, 87, 0.1);
          padding: 4px;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .category-tag {
          font-size: 0.6875rem;
          background: rgba(255, 255, 255, 0.05);
          color: #AAA;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .subject-cell, .legal-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--foreground);
        }

        .vendor-link-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--secondary);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8125rem;
          transition: all 0.2s;
        }

        .vendor-link-btn.nav-link {
          color: var(--accent);
          cursor: pointer;
        }

        .vendor-link-btn.nav-link:hover {
          background: rgba(0, 255, 135, 0.1);
          color: #FFF;
        }

        .view-details {
          background: transparent;
          border: none;
          color: var(--secondary);
          cursor: pointer;
          transition: color 0.2s;
        }

        .view-details:hover { color: var(--accent); }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-secondary { color: var(--secondary); }
        .text-accent { color: var(--accent); }

        @media (max-width: 1024px) {
          .module-container { padding: 16px; gap: 16px; }
          .module-header { flex-direction: column; gap: 12px; }
          .header-title { font-size: 1.5rem; }
          .header-subtitle { font-size: 0.8125rem; }
          .action-bar { flex-direction: column; align-items: stretch; gap: 16px; }
          .search-box { width: 100%; }
          .action-buttons { flex-wrap: wrap; }
          .btn { flex: 1; justify-content: center; font-size: 0.75rem; padding: 10px; }
          
          .table-wrapper { 
            overflow-x: auto; 
            -webkit-overflow-scrolling: touch; 
          }
          .ropa-table { min-width: 1000px; }
        }
      `}</style>
    </div>
  );
};
