'use client';
import React from 'react';
import { useData } from '@/context/DataContext';
import { 
  Award, 
  Shield, 
  Activity, 
  FileText, 
  ChevronRight, 
  BarChart4, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Printer,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { calculateGovernanceScores, getMaturityTier } from '@/utils/scoring-engine';

export default function ReportPage() {
  const { state } = useData();

  // Calculate live scores for the report
  const scoringInput = {
    vendors: { total: state.vendors.length, hasDPA: state.vendors.filter(v => v.hasDPA).length, hasSecurity: state.vendors.filter(v => v.hasISO || v.hasSOC2).length },
    vulnerabilities: { 
      total: state.vulnerabilities.length, 
      bySeverity: {
        'Crítico': state.vulnerabilities.filter(v => v.severity === 'Crítico' && v.status !== 'Mitigado').length,
        'Alto': state.vulnerabilities.filter(v => v.severity === 'Alto' && v.status !== 'Mitigado').length,
        'Médio': state.vulnerabilities.filter(v => v.severity === 'Médio' && v.status !== 'Mitigado').length,
        'Baixo': state.vulnerabilities.filter(v => v.severity === 'Baixo' && v.status !== 'Mitigado').length,
      },
      mitigated: state.vulnerabilities.filter(v => v.status === 'Mitigado').length 
    },
    dsars: { total: state.dsars.length, onTime: state.dsars.filter(d => d.daysRemaining > 0 || d.status === 'Concluído').length },
    processes: { total: state.activities.length, complete: state.activities.filter(a => a.status === 'Ativo').length },
    weights: state.settings.criticalityWeights
  };

  const scores = calculateGovernanceScores(scoringInput);
  const globalScore = Math.round(scores.reduce((acc, curr) => acc + curr.A, 0) / scores.length) || 0;
  const { tier } = getMaturityTier(globalScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-container">
      {/* --- UI NAVIGATION (HIDDEN ON PRINT) --- */}
      <div className="no-print report-nav">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>
        <button onClick={handlePrint} className="print-btn">
          <Printer size={16} /> Salvar como PDF / Imprimir
        </button>
      </div>

      <div className="report-paper shadow-paper">
        {/* --- COVER PAGE --- */}
        <section className="section-page cover-page">
          <div className="report-header">
            <div className="logo-placeholder">DATASYNC</div>
            <div className="confidential-tag">PROPRIETARY & CONFIDENTIAL</div>
          </div>
          
          <div className="cover-content">
            <h4 className="category-label">WHITEPAPER TÉCNICO V3.0</h4>
            <h1 className="report-title">DataSync Engine: Orquestração e Scoring de Governança</h1>
            <p className="report-subtitle">
              Análise aprofundada da arquitetura de conformidade, algoritmos de risco ponderado 
              e métricas de maturidade para ecossistemas de dados modernos.
            </p>
          </div>

          <div className="cover-footer">
            <div className="footer-meta">
              <span className="label">PREPARADO POR</span>
              <span className="val">DataSync Engineering Team</span>
            </div>
            <div className="footer-meta">
              <span className="label">DATA DE EMISSÃO</span>
              <span className="val">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="footer-meta">
              <span className="label">MATURIDADE ATUAL</span>
              <span className="val">{tier} ({globalScore}%)</span>
            </div>
          </div>
        </section>

        {/* --- SUMARIO --- */}
        <section className="section-page">
          <h2 className="section-heading">Sumário Executivo</h2>
          <div className="divider-gold"></div>
          <p className="body-text intro">
            O DataSync Engine v3.0 representa uma mudança de paradigma na gestão de DPOaaS. 
            Ao contrário de ferramentas de GRC estáticas, nosso motor utiliza uma arquitetura de 
            **Estado Global Reativo** para unificar inventário, riscos, incidentes e documentação 
            em uma única fonte de verdade.
          </p>

          <div className="summary-grid">
            <div className="summary-card">
              <div className="card-icon"><Shield size={24} /></div>
              <h3>Risco Ponderado</h3>
              <p>Algoritmos que priorizam ativos críticos em vez de volumetrias simples.</p>
            </div>
            <div className="summary-card">
              <div className="card-icon"><Activity size={24} /></div>
              <h3>Maturidade Dinâmica</h3>
              <p>Mapeamento de níveis (CMMI-DPO) baseado em evidências de execução real.</p>
            </div>
            <div className="summary-card">
              <div className="card-icon"><Award size={24} /></div>
              <h3>IA Orchestrator</h3>
              <p>Privacy Copilot integrado para análise preditiva e automação de RIPDs.</p>
            </div>
          </div>
        </section>

        {/* --- ALGORITHM --- */}
        <section className="section-page">
          <h2 className="section-heading">01. Lógica de Scoring Ponderada</h2>
          <p className="body-text">
            O coração do Engine v3.0 é o nosso algoritmo de criticidade. Implementamos uma matriz 
            de pesos que diferencia "processamento de dados internos" de "dados sensíveis sob custódia".
          </p>
          
          <div className="formula-box">
            <code>Score_GOV = (Σ Assessment_i * Weight_α) / Total_Risk_Surface</code>
          </div>

          <div className="logical-breakdown">
            <div className="l-item">
              <strong>Pesos de Criticidade:</strong> Atuações em ativos "Críticos" (ex: Banco de Dados PII) 
              possuem peso 2.5x superior às áreas de baixo impacto no cálculo do dashboard.
            </div>
            <div className="l-item">
              <strong>Mecanismo de Snapshot:</strong> Captura o estado atômico da governança para 
              comparação de tendências mensais, permitindo visibilidade de ROI em privacidade.
            </div>
          </div>
        </section>

        {/* --- LIVE DATA --- */}
        <section className="section-page">
          <h2 className="section-heading">02. Snapshot do Ecossistema Atual</h2>
          <p className="body-text">
            Métricas de conformidade extraídas em {new Date().toLocaleString('pt-BR')}.
          </p>

          <div className="stats-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Módulo de Governança</th>
                  <th>Métrica Detalhada</th>
                  <th>Status de Saúde</th>
                  <th>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inventário de Dados (ROPA)</td>
                  <td>{state.activities.length} Atividades Mapeadas</td>
                  <td>{state.activities.filter(a => a.status === 'Ativo').length} Operacionais</td>
                  <td className="text-info">Gestão Ativa</td>
                </tr>
                <tr>
                  <td>Gestão de Fornecedores</td>
                  <td>{state.vendors.length} Terceiros Avaliados</td>
                  <td>{state.vendors.filter(v => v.status === 'Compliant').length} Conformados</td>
                  <td className="text-success">Monitorado</td>
                </tr>
                <tr>
                  <td>Vulnerabilidades Técnicas</td>
                  <td>{state.vulnerabilities.filter(v => v.status !== 'Mitigado').length} Abertas</td>
                  <td>{state.vulnerabilities.filter(v => v.severity === 'Crítico' && v.status !== 'Mitigado').length} Críticas</td>
                  <td className="text-danger">Alta</td>
                </tr>
                <tr>
                  <td>Subject Requests (DSAR)</td>
                  <td>{state.dsars.length} Requisições Totais</td>
                  <td>{state.dsars.filter(d => d.status !== 'Concluído').length} Pendentes</td>
                  <td className="text-warning">Em Fluxo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* --- AUDIT TRAIL --- */}
        <section className="section-page">
          <h2 className="section-heading">03. Histórico Recente de Auditoria</h2>
          <div className="audit-list">
            {state.logs.slice(0, 8).map(log => (
              <div key={log.id} className="audit-item">
                <span className="dot"></span>
                <span className="time">{log.time}</span>
                <span className="user">[{log.user}]</span>
                <span className="action">{log.action}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <section className="section-page signature-page">
          <div className="conclusion">
            <p>
              Este documento técnico é gerado dinamicamente pelo DataSync Engine v3.0. 
              As informações contidas aqui são atualizadas em tempo real com base nas evidências 
              coletadas pelos módulos automatizados de conformidade.
            </p>
          </div>
          <div className="signature-box">
            <div className="s-line"></div>
            <p>Selo de Integridade DataSync Engine</p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .report-container {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 20px;
          color: #0F172A;
          font-family: 'Inter', sans-serif;
        }

        .report-nav {
          max-width: 800px;
          margin: 0 auto 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748B;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .print-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0F172A;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .report-paper {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 100px 80px;
          min-height: 1120px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.05);
        }

        .cover-page {
          height: 1000px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-bottom: 2px solid #f1f5f9;
          margin-bottom: 100px;
        }

        .logo-placeholder { font-size: 1.5rem; font-weight: 900; letter-spacing: 0.3em; color: #0F172A; }
        .confidential-tag { font-size: 0.625rem; font-weight: 700; color: #94A3B8; border: 1px solid #E2E8F0; padding: 4px 10px; border-radius: 4px; }
        .report-header { display: flex; justify-content: space-between; align-items: center; }

        .category-label { color: #64748B; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em; margin-bottom: 16px; }
        .report-title { font-size: 3.5rem; font-weight: 900; line-height: 1; color: #0F172A; margin-bottom: 32px; }
        .report-subtitle { font-size: 1.25rem; line-height: 1.6; color: #475569; max-width: 500px; }

        .cover-footer { display: flex; gap: 60px; padding-bottom: 60px; }
        .footer-meta { display: flex; flex-direction: column; gap: 4px; }
        .footer-meta .label { font-size: 0.625rem; color: #94A3B8; font-weight: 700; text-transform: uppercase; }
        .footer-meta .val { font-size: 1rem; font-weight: 700; color: #0F172A; }

        .section-page { margin-bottom: 60px; page-break-inside: avoid; }
        .section-heading { font-size: 1.75rem; font-weight: 900; color: #0F172A; margin-bottom: 16px; }
        .divider-gold { height: 6px; width: 80px; background: #0F172A; margin-bottom: 32px; }
        .body-text { font-size: 1.0625rem; line-height: 1.8; color: #334155; margin-bottom: 24px; }
        .intro { font-size: 1.25rem; font-weight: 500; }

        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; }
        .summary-card { padding: 32px; background: #F8FAFC; border-radius: 16px; border: 1px solid #F1F5F9; }
        .summary-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 12px; color: #0F172A; }
        .summary-card p { font-size: 0.8125rem; color: #64748B; line-height: 1.6; }
        .card-icon { color: #0F172A; margin-bottom: 20px; }

        .formula-box { background: #0F172A; color: #00FF87; padding: 40px; border-radius: 16px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; margin: 40px 0; }
        .logical-breakdown { display: flex; flex-direction: column; gap: 20px; }
        .l-item { padding: 20px; border-left: 4px solid #F1F5F9; font-size: 0.9375rem; background: #fafafa; }

        .stats-table-container { margin: 40px 0; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; }
        .report-table { width: 100%; border-collapse: collapse; text-align: left; }
        .report-table th { background: #F8FAFC; padding: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; border-bottom: 1px solid #E2E8F0; }
        .report-table td { padding: 20px; font-size: 0.9375rem; border-bottom: 1px solid #F1F5F9; }

        .audit-list { display: flex; flex-direction: column; gap: 16px; margin-top: 32px; }
        .audit-item { display: flex; align-items: center; gap: 16px; font-size: 0.875rem; color: #64748B; padding: 12px; border-radius: 8px; }
        .audit-item:nth-child(odd) { background: #F8FAFC; }
        .audit-item .dot { width: 8px; height: 8px; border: 2px solid #0F172A; border-radius: 50%; }
        .audit-item .time { font-weight: 600; color: #94A3B8; min-width: 100px; }
        .audit-item .user { font-weight: 800; color: #0F172A; }

        .conclusion { margin-top: 100px; background: #0F172A; color: white; padding: 48px; border-radius: 20px; font-style: italic; line-height: 1.8; opacity: 0.95; }
        .signature-box { margin-top: 80px; }
        .s-line { height: 2px; width: 250px; background: #0F172A; margin-bottom: 12px; }
        .signature-box p { font-size: 0.75rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.25em; }

        .text-info { color: #3B82F6; font-weight: 800; }
        .text-success { color: #10B981; font-weight: 800; }
        .text-warning { color: #F59E0B; font-weight: 800; }
        .text-danger { color: #EF4444; font-weight: 800; }

        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .report-container { padding: 0 !important; background: white; }
          .report-paper { box-shadow: none !important; max-width: 100% !important; margin: 0 !important; padding: 80px !important; }
          .cover-page { height: 100vh !important; page-break-after: always; }
          .section-page { padding-top: 40px; }
          .formula-box { background: #000 !important; color: #0f0 !important; -webkit-print-color-adjust: exact; }
          .conclusion { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
