export interface ScoringInputData {
  vendors: {
    total: number;
    hasDPA: number;
    hasSecurity: number;
  };
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
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
}

export interface ScoreResult {
  subject: string;
  A: number; // Current Score
  B: number; // Benchmark Score
  fullMark: number;
}

export const calculateGovernanceScores = (data: ScoringInputData): ScoreResult[] => {
  // 1. Terceiros (TPRM axis)
  // Weight: 60% DPA, 40% Security Certificates
  const vendorScore = data.vendors.total === 0 ? 100 : 
    ((data.vendors.hasDPA / data.vendors.total) * 60) + 
    ((data.vendors.hasSecurity / data.vendors.total) * 40);

  // 2. Segurança Técnica (Vulnerability axis)
  // Base 100, penalized by Critical (-15 each) and High (-8 each)
  const securityPenalty = (data.vulnerabilities.critical * 15) + (data.vulnerabilities.high * 8);
  const securityScore = Math.max(0, 100 - securityPenalty + (data.vulnerabilities.mitigated * 5));

  // 3. Gestão de Direitos (DSAR axis)
  // Percentage of requests completed on time
  const rightsScore = data.dsars.total === 0 ? 100 : (data.dsars.onTime / data.dsars.total) * 100;

  // 4. Transparência (RoPA axis)
  // Completion rate of Data Mapping processes
  const transparencyScore = data.processes.total === 0 ? 100 : (data.processes.complete / data.processes.total) * 100;

  // 5. Minimização (Privacy by Design axis)
  // Simulated metric based on overall security/transparency balance
  const minimizationScore = (transparencyScore * 0.7) + (securityScore * 0.3);

  return [
    { subject: 'Transparência', A: Math.round(transparencyScore), B: 65, fullMark: 100 },
    { subject: 'Gestão de Direitos', A: Math.round(rightsScore), B: 40, fullMark: 100 },
    { subject: 'Segurança Técnica', A: Math.round(securityScore), B: 75, fullMark: 100 },
    { subject: 'Minimização', A: Math.round(minimizationScore), B: 55, fullMark: 100 },
    { subject: 'Terceiros', A: Math.round(vendorScore), B: 50, fullMark: 100 },
  ];
};

export const getMaturityInsights = (scores: ScoreResult[]) => {
  const insights = [];
  
  const vendorScore = scores.find(s => s.subject === 'Terceiros')?.A || 0;
  if (vendorScore < 60) {
    insights.push({ text: 'Risco crítico em Terceiros: Faltam contratos DPA assinados.', type: 'critical' });
  } else if (vendorScore > 85) {
    insights.push({ text: 'Líder em Gestão de Terceiros: Conformidade documental em 90%+', type: 'success' });
  }

  const securityScore = scores.find(s => s.subject === 'Segurança Técnica')?.A || 0;
  if (securityScore < 70) {
    insights.push({ text: 'Vulnerabilidades críticas impactando a Segurança Técnica.', type: 'warning' });
  }

  return insights;
};
