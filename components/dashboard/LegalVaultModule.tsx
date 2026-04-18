'use client';
import React, { useState } from 'react';
import { 
  Library, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  AlertCircle,
  FileBadge,
  Sparkles,
  ExternalLink,
  History
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SideSheet } from '../ui/SideSheet';

interface LegalDocument {
  id: string;
  name: string;
  category: 'DPA' | 'Política' | 'Parecer' | 'Contrato';
  status: 'Vigente' | 'A Vencer' | 'Expirado' | 'Em Revisão';
  expiryDate: string;
  lastUpdated: string;
  size: string;
  aiSummary: string;
}

export const LegalVaultModule: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const documents: LegalDocument[] = [
    { 
      id: 'DOC-001', 
      name: 'Acordo de Processamento de Dados (DPA) - AWS', 
      category: 'DPA', 
      status: 'Vigente', 
      expiryDate: '12/12/2025', 
      lastUpdated: '10/01/2024', 
      size: '1.2 MB',
      aiSummary: 'Este documento estabelece as obrigações da AWS como operadora de dados, garantindo conformidade com a LGPD e GDPR. Cláusulas críticas incluem a responsabilidade por sub-operadores e protocolos de notificação de incidentes.'
    },
    { 
      id: 'DOC-002', 
      name: 'Política de Privacidade Externa v2.4', 
      category: 'Política', 
      status: 'A Vencer', 
      expiryDate: '01/06/2024', 
      lastUpdated: '01/06/2023', 
      size: '450 KB',
      aiSummary: 'Relatório detalhado sobre como os dados dos clientes são coletados via portal. Pontos de atenção: uso de cookies analíticos e compartilhamento com parceiros de marketing mencionados no Anexo B.'
    },
    { 
      id: 'DOC-003', 
      name: 'Parecer Jurídico: Legítimo Interesse (LIA) - Marketing', 
      category: 'Parecer', 
      status: 'Em Revisão', 
      expiryDate: 'N/A', 
      lastUpdated: '15/04/2024', 
      size: '890 KB',
      aiSummary: 'Avaliação da base legal para campanhas de e-mail marketing. Conclui que o legítimo interesse é aplicável desde que o opt-out seja proeminente e granular.'
    },
    { 
      id: 'DOC-004', 
      name: 'Contrato de Auditoria de Privacidade - Deloitte', 
      category: 'Contrato', 
      status: 'Expirado', 
      expiryDate: '01/03/2024', 
      lastUpdated: '01/03/2023', 
      size: '2.4 MB',
      aiSummary: 'Acordo de prestação de serviços para auditoria externa anual. Define escopo, confidencialidade e prazos de entrega dos relatórios de conformidade.'
    },
  ];

  const categories = ['Todos', 'DPA', 'Política', 'Parecer', 'Contrato'];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'Todos' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Vigente': return 'emerald';
      case 'A Vencer': return 'amber';
      case 'Expirado': return 'crimson';
      case 'Em Revisão': return 'cyan';
      default: return undefined;
    }
  };

  return (
    <div className="module-container anim-fade-in">
      <div className="module-header">
        <div className="header-info">
          <h2 className="header-title">Vault de Documentação Jurídica</h2>
          <p className="header-subtitle">Repositório seguro e inteligente de ativos legais e regulatórios da organização</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn"><Plus size={18} /> Novo Documento</button>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stat-card">
          <span className="label text-secondary">ATUais</span>
          <span className="value">148</span>
        </div>
        <div className="stat-card warning">
          <span className="label">PRECISAM REVISÃO</span>
          <span className="value">05</span>
        </div>
        <div className="stat-card expired">
          <span className="label">CONTRATOS EXPIRADOS</span>
          <span className="value">02</span>
        </div>
      </div>

      <div className="action-bar tabs-bar">
        <div className="category-tabs">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="doc-grid">
        {filteredDocs.map(doc => (
          <div 
            key={doc.id} 
            className={`doc-card glass ${doc.status === 'A Vencer' ? 'border-amber' : ''} ${doc.status === 'Expirado' ? 'border-red' : ''}`}
            onClick={() => setSelectedDoc(doc)}
          >
            <div className="doc-icon">
              <FileText size={32} />
            </div>
            <div className="doc-info">
              <div className="doc-top">
                <span className="doc-id">{doc.id}</span>
                <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
              </div>
              <h4 className="doc-name">{doc.name}</h4>
              <div className="doc-meta">
                <div className="meta-item">
                  <Clock size={12} />
                  <span>Expira em {doc.expiryDate}</span>
                </div>
                <div className="meta-item">
                  <Download size={12} />
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>
            <div className="doc-hover-action">
              <Eye size={18} />
            </div>
          </div>
        ))}
      </div>

      <SideSheet 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)}
        title={`Visualização de Documento: ${selectedDoc?.id}`}
      >
        {selectedDoc && (
          <div className="doc-details-view">
            <div className="doc-preview-header">
              <div className="doc-badge-large">
                <FileBadge size={40} className="text-accent" />
              </div>
              <div className="doc-title-section">
                <h3>{selectedDoc.name}</h3>
                <div className="doc-meta-pills">
                  <span className="category-pill">{selectedDoc.category}</span>
                  <span className="update-pill">Atualizado em {selectedDoc.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="ai-insight-box">
              <div className="insight-header">
                <Sparkles size={16} className="text-accent" />
                <span>RESUMO INTELIGENTE - DATA SYNC AI</span>
              </div>
              <p className="insight-text">{selectedDoc.aiSummary}</p>
              <div className="insight-tags">
                <span className="tag">LGPD Compliance</span>
                <span className="tag">Data Privacy</span>
                <span className="tag">DPA Clause</span>
              </div>
            </div>

            <div className="detail-section">
              <h5 className="section-title">DETALHES DO ARQUIVO</h5>
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="label">Proprietário:</span>
                  <span className="value">Jurídico / DPO</span>
                </div>
                <div className="detail-row">
                  <span className="label">Nível de Acesso:</span>
                  <span className="value text-warning">Restrito (Nível 3)</span>
                </div>
                <div className="detail-row">
                  <span className="label">Vencimento:</span>
                  <span className="value font-mono">{selectedDoc.expiryDate}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Tamanho:</span>
                  <span className="value">{selectedDoc.size}</span>
                </div>
              </div>
            </div>

            <div className="renewal-tracker">
              <h5 className="section-title">CONTROLE DE RENOVAÇÃO</h5>
              <div className="timeline-container">
                <div className="timeline-line"></div>
                <div className="time-node active">
                  <div className="node-dot"></div>
                  <span className="node-label">Última Revisão</span>
                  <span className="node-date">{selectedDoc.lastUpdated}</span>
                </div>
                <div className="time-node pulse">
                  <div className="node-dot warning-dot"></div>
                  <span className="node-label">Próxima Renovação</span>
                  <span className="node-date">{selectedDoc.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="side-actions">
              <button className="doc-primary-btn">
                <Download size={18} />
                Baixar Documento Original
              </button>
              <div className="doc-secondary-actions">
                <button className="icon-btn"><History size={18} /></button>
                <button className="icon-btn"><ShieldCheck size={18} /></button>
                <button className="icon-btn"><ExternalLink size={18} /></button>
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
          gap: 32px;
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
          transition: transform 0.2s;
        }

        .primary-btn:hover { transform: translateY(-2px); }

        .stats-strip {
          display: flex;
          gap: 16px;
        }

        .stat-card {
          flex: 1;
          padding: 16px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-card .label { font-size: 0.625rem; font-weight: 800; }
        .stat-card .value { font-size: 1.5rem; font-weight: 800; }

        .stat-card.warning { border-color: rgba(255, 165, 2, 0.3); }
        .stat-card.warning .value { color: #FFA502; }
        .stat-card.expired { border-color: rgba(255, 71, 87, 0.3); }
        .stat-card.expired .value { color: #FF4757; }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          background: rgba(0, 0, 0, 0.2);
          padding: 12px 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .category-tabs {
          display: flex;
          gap: 4px;
        }

        .cat-tab {
          padding: 8px 16px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--secondary);
          font-size: 0.8125rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .cat-tab:hover { color: #FFF; background: rgba(255, 255, 255, 0.05); }
        .cat-tab.active { background: var(--accent); color: #000; }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          width: 300px;
        }

        .search-box input {
          width: 100%;
          padding: 10px 0;
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 0.8125rem;
          outline: none;
        }

        .doc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .doc-card {
          padding: 24px;
          border-radius: 20px;
          display: flex;
          gap: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .doc-card:hover { 
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent) !important;
        }

        .doc-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          transition: all 0.2s;
        }

        .doc-card:hover .doc-icon { background: var(--accent); color: #000; }

        .doc-info { flex: 1; }
        .doc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .doc-id { font-size: 0.625rem; font-weight: 700; color: var(--secondary); font-family: 'JetBrains Mono', monospace; }

        .doc-name { font-size: 0.9375rem; font-weight: 700; color: #FFF; margin-bottom: 12px; line-height: 1.4; }

        .doc-meta { display: flex; gap: 16px; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.6875rem; color: var(--secondary); }

        .doc-hover-action {
          position: absolute;
          right: 20px;
          bottom: 20px;
          color: var(--accent);
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.2s;
        }

        .doc-card:hover .doc-hover-action { opacity: 1; transform: translateX(0); }

        .border-amber { border-color: rgba(255, 165, 2, 0.4) !important; }
        .border-red { border-color: rgba(255, 71, 87, 0.4) !important; }

        /* SideSheet Detail Styles */
        .doc-details-view { display: flex; flex-direction: column; gap: 40px; }

        .doc-preview-header { display: flex; align-items: center; gap: 24px; }
        .doc-badge-large { width: 80px; height: 80px; background: rgba(0, 255, 135, 0.05); border-radius: 20px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(0, 255, 135, 0.1); }
        .doc-title-section h3 { font-size: 1.25rem; font-weight: 800; color: #FFF; margin-bottom: 8px; line-height: 1.4; }
        .doc-meta-pills { display: flex; gap: 12px; }
        .category-pill { padding: 4px 10px; background: rgba(56, 189, 248, 0.1); color: #38BDF8; border-radius: 6px; font-size: 0.6875rem; font-weight: 700; }
        .update-pill { font-size: 0.6875rem; color: var(--secondary); }

        .ai-insight-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .ai-insight-box::before {
          content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent);
        }

        .insight-header { display: flex; align-items: center; gap: 10px; font-size: 0.625rem; font-weight: 800; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 12px; }
        .insight-text { font-size: 0.875rem; color: #EEE; line-height: 1.6; margin-bottom: 16px; }
        .insight-tags { display: flex; gap: 8px; }
        .tag { font-size: 0.625rem; padding: 2px 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; color: var(--secondary); }

        .section-title { font-size: 0.625rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.1em; margin-bottom: 20px; }

        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .detail-row { display: flex; flex-direction: column; gap: 4px; }
        .detail-row .label { font-size: 0.6875rem; color: var(--secondary); }
        .detail-row .value { font-size: 0.8125rem; font-weight: 600; color: #FFF; }

        .renewal-tracker { position: relative; }
        .timeline-container { display: flex; justify-content: space-between; position: relative; padding: 20px 0; }
        .timeline-line { position: absolute; top: 28px; left: 0; right: 0; height: 2px; background: var(--border); }
        .time-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 1; }
        .node-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--border); border: 2px solid var(--background); }
        .time-node.active .node-dot { background: var(--accent); box-shadow: 0 0 10px var(--accent); }
        .warning-dot { background: #FFA502 !important; box-shadow: 0 0 10px #FFA502 !important; }
        .node-label { font-size: 0.6875rem; color: var(--secondary); }
        .node-date { font-size: 0.75rem; font-weight: 700; color: #FFF; font-family: 'JetBrains Mono', monospace; }

        .side-actions { display: flex; flex-direction: column; gap: 12px; }
        .doc-primary-btn { width: 100%; padding: 16px; background: var(--accent); color: #000; border: none; border-radius: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px; }
        .doc-secondary-actions { display: flex; gap: 8px; }
        .icon-btn { flex: 1; height: 48px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; color: var(--foreground); display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { border-color: var(--accent); color: var(--accent); }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-accent { color: var(--accent); }
        .text-secondary { color: var(--secondary); }
        .text-warning { color: #FFA502; }

        @media (max-width: 1024px) {
          .module-container { padding: 16px; gap: 16px; }
          .module-header { flex-direction: column; gap: 12px; }
          .header-title { font-size: 1.5rem; }
          .header-subtitle { font-size: 0.8125rem; }
          .stats-strip { flex-direction: column; gap: 8px; }
          .stat-card { padding: 12px 16px; }
          .action-bar { flex-direction: column; align-items: stretch; gap: 16px; padding: 16px; }
          .category-tabs { overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }
          .cat-tab { white-space: nowrap; flex-shrink: 0; }
          .search-box { width: 100%; }
          .doc-grid { grid-template-columns: 1fr; gap: 12px; }
          
          .doc-preview-header { flex-direction: column; text-align: center; gap: 16px; }
          .doc-badge-large { margin: 0 auto; }
          .detail-grid { grid-template-columns: 1fr; gap: 12px; }
          .timeline-container { flex-direction: column; gap: 24px; align-items: flex-start; padding-left: 20px; }
          .timeline-line { left: 5px; top: 0; bottom: 0; width: 2px; height: 100%; }
          .time-node { flex-direction: row; align-items: center; gap: 16px; text-align: left; }
        }

        .anim-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .pulse { animation: pulseAnim 2s infinite; }
        @keyframes pulseAnim { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};
