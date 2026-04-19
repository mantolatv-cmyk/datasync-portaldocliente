export interface ScoringInputData {
  vendors: {
    total: number;
    hasDPA: number;
    hasSecurity: number;
  };
  vulnerabilities: {
    total: number;
    bySeverity: {
      'Crítico': number;
      'Alto': number;
      'Médio': number;
      'Baixo': number;
    };
    mitigated: number;
  };
  dsars: {
    total: number;
    onTime: number;
  };
  processes: {
    total: number;
    complete: number;
  };
  weights: { [key: string]: number };
}

export interface ScoreResult {
  subject: string;
  A: number; // Current Score
  B: number; // Benchmark Score
  fullMark: number;
}

export type MaturityTier = 'Iniciante' | 'Gerenciado' | 'Definido' | 'Quantitativo' | 'Otimizado';

export const getMaturityTier = (overallScore: number): { tier: MaturityTier, color: string } => {
  if (overallScore >= 95) return { tier: 'Otimizado', color: 'var(--accent)' };
  if (overallScore >= 80) return { tier: 'Quantitativo', color: 'var(--success)' };
  if (overallScore >= 60) return { tier: 'Definido', color: 'var(--warning)' };
  if (overallScore >= 40) return { tier: 'Gerenciado', color: 'var(--warning)' };
  return { tier: 'Iniciante', color: 'var(--error)' };
};

export const calculateGovernanceScores = (data: ScoringInputData): ScoreResult[] => {
  // 1. Terceiros (TPRM axis)
  const vendorScore = data.vendors.total === 0 ? 100 : 
    ((data.vendors.hasDPA / data.vendors.total) * 65) + 
    ((data.vendors.hasSecurity / data.vendors.total) * 35);

  // 2. Segurança Técnica (Weighted Axis)
  // Penalties are multiplied by criticality weights
  const penalties = 
    (data.vulnerabilities.bySeverity['Crítico'] * 15 * (data.weights['Crítico'] || 1)) +
    (data.vulnerabilities.bySeverity['Alto'] * 8 * (data.weights['Alto'] || 1)) +
    (data.vulnerabilities.bySeverity['Médio'] * 3 * (data.weights['Médio'] || 1));
  
  const securityScore = Math.max(0, 100 - penalties + (data.vulnerabilities.mitigated * 2));

  // 3. Gestão de Direitos
  const rightsScore = data.dsars.total === 0 ? 100 : (data.dsars.onTime / data.dsars.total) * 100;

  // 4. Transparência (RoPA)
  const transparencyScore = data.processes.total === 0 ? 100 : (data.processes.complete / data.processes.total) * 100;

  // 5. Governança Adaptativa (Combined)
  const adaptationScore = (transparencyScore * 0.5) + (securityScore * 0.3) + (vendorScore * 0.2);

  return [
    { subject: 'Transparência', A: Math.round(transparencyScore), B: 65, fullMark: 100 },
    { subject: 'Direitos', A: Math.round(rightsScore), B: 40, fullMark: 100 },
    { subject: 'Segurança', A: Math.round(securityScore), B: 75, fullMark: 100 },
    { subject: 'Governança', A: Math.round(adaptationScore), B: 55, fullMark: 100 },
    { subject: 'Terceiros', A: Math.round(vendorScore), B: 50, fullMark: 100 },
  ];
};

export const getMaturityInsights = (scores: ScoreResult[]) => {
  const insights = [];
  
  const avg = scores.reduce((acc, curr) => acc + curr.A, 0) / scores.length;
  
  if (avg < 50) {
    insights.push({ text: 'Risco de conformidade elevado. Foco imediato em mapeamento e TPRM.', type: 'critical' });
  }

  const securityScore = scores.find(s => s.subject === 'Segurança')?.A || 0;
  if (securityScore < 70) {
    insights.push({ text: 'Vulnerabilidades em ativos críticos requerem mitigação imediata.', type: 'warning' });
  }

  const vendorScore = scores.find(s => s.subject === 'Terceiros')?.A || 0;
  if (vendorScore < 60) {
     insights.push({ text: 'Gargalo em Terceiros: Aumentar taxa de DPAs assinados.', type: 'warning' });
  }

  if (avg > 80) {
    insights.push({ text: 'Organização em nível avançado de maturidade LGPD.', type: 'success' });
  }

  return insights;
};
