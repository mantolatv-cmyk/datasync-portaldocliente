'use client';
import React, { useState, useEffect } from 'react';
import { Search, Loader2, ShieldAlert, Database, Cloud, FileText, Trash2, UserX, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DiscoveryResult {
  id: string;
  source: string;
  type: 'CRM' | 'DATA_WAREHOUSE' | 'CLOUD' | 'LEGACY';
  matches: number;
  sensitivity: 'High' | 'Medium' | 'Low';
  lastSeen: string;
}

const mockSources = [
  { id: '1', source: 'Salesforce CRM', type: 'CRM', matches: 3, sensitivity: 'High', lastSeen: '2 dias atrás' },
  { id: '2', source: 'AWS S3 Buckets', type: 'CLOUD', matches: 12, sensitivity: 'Medium', lastSeen: 'Hoje' },
  { id: '3', source: 'PostgreSQL Production', type: 'DATA_WAREHOUSE', matches: 1, sensitivity: 'High', lastSeen: 'Hoje' },
  { id: '4', source: 'Zendesk Support', type: 'CRM', matches: 5, sensitivity: 'Medium', lastSeen: '1 semana atrás' },
];

export const EDiscoveryTool: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const executeDiscovery = () => {
    if (cpf.length < 14) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    setShowResults(false);
    
    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSearching(false);
          setResults(mockSources as any);
          setShowResults(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <Card 
      title="E-Discovery Automático" 
      subtitle="Localização Forense de Dados por CPF/ID em Real-time"
    >
      <div className="discovery-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="000.000.000-00" 
              value={cpf}
              onChange={handleCpfChange}
              disabled={isSearching}
              maxLength={14}
            />
          </div>
          <button 
            className="search-btn" 
            onClick={executeDiscovery}
            disabled={isSearching || cpf.length < 14}
          >
            {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Executar Discovery"}
          </button>
        </div>
      </div>

      {isSearching && (
        <div className="scanning-overlay anim-fade-in">
          <div className="scanner-line"></div>
          <div className="scanning-info">
            <p className="scanning-text">Escaneando Instâncias...</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${searchProgress}%` }}></div>
            </div>
            <div className="terminal-logs">
              <p className="log-line">{searchProgress > 10 ? "> Conectando Salesforce API..." : ""}</p>
              <p className="log-line">{searchProgress > 40 ? "> Varrendo AWS S3 Buckets (us-east-1)..." : ""}</p>
              <p className="log-line">{searchProgress > 70 ? "> Consultando Backup Legado (Offsite)..." : ""}</p>
              <p className="log-line">{searchProgress > 90 ? "> Analisando registros de auditoria..." : ""}</p>
            </div>
          </div>
        </div>
      )}

      {showResults && !isSearching && (
        <div className="results-container anim-fade-in">
          <div className="results-summary">
            <div className="summary-item">
              <span className="summary-val">{results.reduce((acc, r) => acc + r.matches, 0)}</span>
              <span className="summary-label">Ocorrências Totais</span>
            </div>
            <div className="summary-item">
              <span className="summary-val">{results.length}</span>
              <span className="summary-label">Sistemas Afetados</span>
            </div>
          </div>

          <div className="results-list">
            {results.map((res) => (
              <div key={res.id} className="result-item">
                <div className="res-icon">
                  {res.type === 'CRM' && <UserX size={20} />}
                  {res.type === 'CLOUD' && <Cloud size={20} />}
                  {res.type === 'DATA_WAREHOUSE' && <Database size={20} />}
                </div>
                <div className="res-details">
                  <div className="res-main">
                    <span className="res-name">{res.source}</span>
                    <Badge variant={res.sensitivity === 'High' ? 'crimson' : 'amber'}>
                      {res.sensitivity} Risk
                    </Badge>
                  </div>
                  <div className="res-meta">
                    <span>{res.matches} registros encontrados</span>
                    <span className="dot">•</span>
                    <span>Visto em {res.lastSeen}</span>
                  </div>
                </div>
                <div className="res-actions">
                  <button className="action-btn redact" title="Anonimizar Dados">
                    <ShieldAlert size={16} />
                  </button>
                  <button className="action-btn delete" title="Excluir Registros">
                    <Trash2 size={16} />
                  </button>
                  <button className="action-btn view">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="report-btn">
            <FileText size={16} /> Gerar Laudo Forense de Discovery
          </button>
        </div>
      )}

      <style jsx>{`
        .discovery-header {
          margin-bottom: 24px;
        }

        .search-container {
          display: flex;
          gap: 12px;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
          background: rgba(18, 18, 18, 0.5);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }

        .search-icon {
          color: var(--secondary);
          margin-right: 12px;
        }

        .search-input-wrapper input {
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 1.125rem;
          font-family: 'JetBrains Mono', monospace;
          width: 100%;
          outline: none;
          height: 48px;
        }

        .search-btn {
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 0 24px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .scanning-overlay {
          padding: 40px;
          background: rgba(0, 255, 135, 0.02);
          border: 1px dashed rgba(0, 255, 135, 0.2);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          box-shadow: 0 0 15px var(--accent);
          animation: scan 2s infinite ease-in-out;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .scanning-info {
          text-align: center;
        }

        .scanning-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          color: var(--accent);
          margin-bottom: 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .progress-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          margin: 0 auto 32px;
          width: 80%;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          transition: width 0.1s;
        }

        .terminal-logs {
          text-align: left;
          background: #000;
          padding: 16px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #888;
          min-height: 100px;
        }

        .log-line {
          margin-bottom: 4px;
        }

        .results-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--border);
        }

        .results-summary {
          display: flex;
          gap: 40px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }

        .summary-item {
          display: flex;
          flex-direction: column;
        }

        .summary-val {
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
        }

        .summary-label {
          font-size: 0.75rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .result-item:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
        }

        .res-icon {
          width: 48px;
          height: 48px;
          background: rgba(0, 255, 135, 0.05);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .res-details {
          flex: 1;
        }

        .res-main {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .res-name {
          font-weight: 700;
          font-size: 0.9375rem;
        }

        .res-meta {
          font-size: 0.75rem;
          color: var(--secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot { font-size: 1.25rem; line-height: 0; }

        .res-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--foreground);
          color: var(--foreground);
        }

        .action-btn.redact:hover {
          color: var(--warning);
          border-color: var(--warning);
          background: rgba(251, 46, 1, 0.1);
        }

        .action-btn.delete:hover {
          color: var(--error);
          border-color: var(--error);
          background: rgba(255, 0, 85, 0.1);
        }

        .report-btn {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 1px solid var(--accent);
          border-radius: 12px;
          color: var(--accent);
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .report-btn:hover {
          background: rgba(0, 255, 135, 0.1);
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.1);
        }

        .anim-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  );
};
