'use client';
import React, { useState } from 'react';
import { Sparkles, Brain, ShieldCheck, AlertTriangle, Scale, Plus, Send, Loader2, FileDown, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface RiskSuggestion {
  id: string;
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  legalBase: string;
  mitigation: string;
}

export const AIRIPDGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<RiskSuggestion[]>([]);

  const handleAnalyze = () => {
    if (description.length < 20) return;
    
    setIsAnalyzing(true);
    setShowResults(false);
    
    // Simulate AI thinking and analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setSuggestions([
        {
          id: '1',
          risk: 'Monitoramento Excessivo de Geolocalização',
          impact: 'High',
          legalBase: 'Art. 7º, IX (Legítimo Interesse) - Requer Teste de Proporcionalidade',
          mitigation: 'Implementar Anonimização k-anonimity após 24h e botão de opt-out visível.'
        },
        {
          id: '2',
          risk: 'Tratamento de Dados Biométricos sem Consentimento Explícito',
          impact: 'High',
          legalBase: 'Art. 11, I (Dados Sensíveis) - Consentimento Específico e Destacado',
          mitigation: 'Adicionar check-box de consentimento separado e criptografia state-of-the-art.'
        },
        {
          id: '3',
          risk: 'Retenção Indeterminada de Logs de Acesso',
          impact: 'Medium',
          legalBase: 'Art. 15 (Término do Tratamento) - Princípio da Necessidade',
          mitigation: 'Configurar política de auto-purga para registros com mais de 12 meses.'
        }
      ]);
    }, 2500);
  };

  return (
    <Card 
      title="Gerador de RIPD Assistido por IA" 
      subtitle="Analise processos de negócio e gere controles de privacidade automaticamente"
    >
      <div className="generator-container">
        <div className="input-section">
          <div className="textarea-wrapper">
            <div className="ai-badge">
              <Sparkles size={14} /> AI ANALYZER
            </div>
            <textarea 
              placeholder="Descreva o novo processo ou tecnologia (ex: 'Estamos lançando um novo app de fidelidade que coleta CPF e localização em tempo real para oferecer descontos georreferenciados...')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
          <button 
            className="analyze-btn" 
            onClick={handleAnalyze}
            disabled={isAnalyzing || description.length < 20}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Processando Neural Engine...
              </>
            ) : (
              <>
                <Brain size={18} /> Analisar Riscos e Medidas
              </>
            )}
          </button>
        </div>

        {isAnalyzing && (
          <div className="ai-thinking-state anim-pulse-border">
            <div className="thinking-grid">
              <div className="node active"></div>
              <div className="node active"></div>
              <div className="node"></div>
              <div className="node"></div>
            </div>
            <p className="thinking-text">Mapeando Framework LGPD v13.4...</p>
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="results-section anim-fade-in">
            <div className="results-header">
              <div className="score-summary">
                <span className="label">Índice de Risco IA:</span>
                <span className="value text-warning">Alto</span>
              </div>
              <button className="export-full-btn">
                <FileDown size={14} /> Baixar Rascunho RIPD
              </button>
            </div>

            <div className="suggestions-list">
              {suggestions.map((item) => (
                <div key={item.id} className="suggestion-card">
                  <div className="card-header">
                    <div className="risk-title">
                      <AlertTriangle size={16} className="text-warning" />
                      <h4>{item.risk}</h4>
                    </div>
                    <Badge variant={item.impact === 'High' ? 'crimson' : 'amber'}>
                      Impacto {item.impact}
                    </Badge>
                  </div>
                  
                  <div className="legal-context">
                    <Scale size={14} className="text-accent" />
                    <span><strong>Legal:</strong> {item.legalBase}</span>
                  </div>

                  <div className="mitigation-block">
                    <ShieldCheck size={14} className="text-success" />
                    <p><strong>Medida sugerida:</strong> {item.mitigation}</p>
                  </div>

                  <div className="card-actions">
                    <button className="apply-btn">
                      <Plus size={14} /> Aplicar ao Mapa de Riscos
                    </button>
                    <button className="refine-btn">Refinar com IA</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="results-footer">
              <CheckCircle size={14} className="text-success" />
              <p>Análise de IA concluída com 94% de confiança estatística legal.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .generator-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .textarea-wrapper {
          position: relative;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          transition: border-color 0.3s;
        }

        .textarea-wrapper:focus-within {
          border-color: var(--accent);
        }

        .ai-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: var(--accent);
          color: #000;
          font-size: 0.625rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 1px;
        }

        textarea {
          width: 100%;
          min-height: 120px;
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 1rem;
          line-height: 1.6;
          outline: none;
          resize: none;
        }

        .analyze-btn {
          width: 100%;
          padding: 16px;
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s;
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.2);
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0, 255, 135, 0.4);
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-thinking-state {
          padding: 32px;
          text-align: center;
          background: rgba(0, 255, 135, 0.02);
          border-radius: 16px;
          border: 1px dashed rgba(0, 255, 135, 0.2);
        }

        .thinking-grid {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .node {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }

        .node.active {
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          animation: pulseNode 1s infinite alternate;
        }

        @keyframes pulseNode {
          from { opacity: 0.4; }
          to { opacity: 1; transform: scale(1.2); }
        }

        .thinking-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .results-section {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid var(--border);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .score-summary {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .score-summary .label {
          font-size: 0.875rem;
          color: var(--secondary);
        }

        .score-summary .value {
          font-size: 1.125rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .export-full-btn {
          background: transparent;
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 8px;
          color: var(--foreground);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-full-btn:hover {
          border-color: var(--foreground);
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .suggestion-card {
          padding: 20px;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: border-color 0.2s;
        }

        .suggestion-card:hover {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .risk-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .risk-title h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .legal-context, .mitigation-block {
          display: flex;
          gap: 12px;
          font-size: 0.8125rem;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .legal-context { color: #888; }
        .mitigation-block p { color: #CCC; }

        .card-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .apply-btn, .refine-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-btn {
          background: rgba(0, 255, 135, 0.1);
          border: 1px solid rgba(0, 255, 135, 0.3);
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .apply-btn:hover {
          background: var(--accent);
          color: #000;
        }

        .refine-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--secondary);
        }

        .refine-btn:hover {
          color: var(--foreground);
          border-color: var(--foreground);
        }

        .results-footer {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--secondary);
          font-size: 0.75rem;
        }

        .text-warning { color: var(--warning); }
        .text-accent { color: var(--accent); }
        .text-success { color: var(--success); }

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
