import { useData, Vendor, Vulnerability, ProcessingActivity, DSARRequest, RIPD, Incident, ScoreSnapshot, LegalDocument } from '../context/DataContext';
import { calculateGovernanceScores, getMaturityInsights, ScoringInputData } from '../utils/scoring-engine';

export const useDataSync = () => {
  const { state, dispatch } = useData();

  const updateVendor = (vendor: Vendor) => dispatch({ type: 'UPDATE_VENDOR', payload: vendor });
  const updateVulnerability = (vuln: Vulnerability) => dispatch({ type: 'UPDATE_VULNERABILITY', payload: vuln });
  const updateActivity = (activity: ProcessingActivity) => dispatch({ type: 'UPDATE_ACTIVITY', payload: activity });
  const updateDSAR = (dsar: DSARRequest) => dispatch({ type: 'UPDATE_DSAR', payload: dsar });
  const updateRIPD = (ripd: RIPD) => dispatch({ type: 'UPDATE_RIPD', payload: ripd });
  const updateIncident = (incident: Incident) => dispatch({ type: 'UPDATE_INCIDENT', payload: incident });

  const toggleVendorStatus = (id: string) => {
    const vendor = state.vendors.find(v => v.id === id);
    if (!vendor) return;
    const statuses: Vendor['status'][] = ['Compliant', 'At Risk', 'Audit Required'];
    const nextIdx = (statuses.indexOf(vendor.status) + 1) % statuses.length;
    updateVendor({ ...vendor, status: statuses[nextIdx] });
    addLog(`Status do fornecedor ${vendor.name} alterado para ${statuses[nextIdx]}`, 'Vendor', 'medium');
  };

  const toggleVulnStatus = (id: string) => {
    const vuln = state.vulnerabilities.find(v => v.id === id);
    if (!vuln) return;
    const statuses: Vulnerability['status'][] = ['Aberto', 'Em Correção', 'Mitigado'];
    const nextIdx = (statuses.indexOf(vuln.status) + 1) % statuses.length;
    updateVulnerability({ ...vuln, status: statuses[nextIdx] });
    addLog(`Vulnerabilidade ${vuln.id} em ${vuln.asset} movida para ${statuses[nextIdx]}`, 'Security', 'high');
  };

  const toggleDSARStatus = (id: string) => {
    const dsar = state.dsars.find(d => d.id === id);
    if (!dsar) return;
    const statuses: DSARRequest['status'][] = ['Triagem', 'Processando', 'Aguardando Titular', 'Concluído'];
    const nextIdx = (statuses.indexOf(dsar.status) + 1) % statuses.length;
    updateDSAR({ ...dsar, status: statuses[nextIdx] });
    addLog(`Requisição ${dsar.id} de ${dsar.name} movida para ${statuses[nextIdx]}`, 'Privacy', 'medium');
  };

  const toggleRIPDStatus = (id: string) => {
    const ripd = state.ripds.find(r => r.id === id);
    if (!ripd) return;
    const statuses: RIPD['status'][] = ['Rascunho', 'Em Revisão', 'Aprovado'];
    const nextIdx = (statuses.indexOf(ripd.status) + 1) % statuses.length;
    updateRIPD({ ...ripd, status: statuses[nextIdx] });
    addLog(`RIPD ${ripd.id} atualizado para ${statuses[nextIdx]}`, 'Compliance', 'medium');
  };

  const toggleActivityStatus = (id: string) => {
    const activity = state.activities.find(a => a.id === id);
    if (!activity) return;
    const statuses: ProcessingActivity['status'][] = ['Ativo', 'Em Revisão', 'Arquivado'];
    const nextIdx = (statuses.indexOf(activity.status) + 1) % statuses.length;
    updateActivity({ ...activity, status: statuses[nextIdx] });
    addLog(`Atividade ${activity.name} movida para ${statuses[nextIdx]}`, 'Mapping', 'medium');
  };

  const updateLegalDoc = (doc: LegalDocument) => dispatch({ type: 'UPDATE_LEGAL_DOC', payload: doc });

  const toggleLegalStatus = (id: string) => {
    const doc = state.legalDocuments.find(d => d.id === id);
    if (!doc) return;
    const statuses: LegalDocument['status'][] = ['Vigente', 'A Vencer', 'Em Revisão', 'Expirado'];
    const nextIdx = (statuses.indexOf(doc.status) + 1) % statuses.length;
    updateLegalDoc({ ...doc, status: statuses[nextIdx] });
    addLog(`Documento ${doc.name} atualizado para ${statuses[nextIdx]}`, 'Legal', 'low');
  };

  const toggleIncidentStatus = (id: string) => {
    const inc = state.incidents.find(i => i.id === id);
    if (!inc) return;
    const statuses: Incident['status'][] = ['Aberto', 'Investigando', 'Contenção', 'Notificado', 'Encerrado'];
    const nextIdx = (statuses.indexOf(inc.status) + 1) % statuses.length;
    updateIncident({ ...inc, status: statuses[nextIdx] });
    addLog(`Incidente ${inc.id} atualizado para ${statuses[nextIdx]}`, 'Security', 'high');
  };

  const addLog = (action: string, module: string, severity: 'low' | 'medium' | 'high') => {
    dispatch({ 
      type: 'ADD_LOG', 
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        user: 'Admin DPO',
        action,
        module,
        time: 'Agora',
        severity
      }
    });
  };

  const takeSnapshot = () => {
    const scoringInput: ScoringInputData = {
      vendors: { 
        total: state.vendors.length, 
        hasDPA: state.vendors.filter(v => v.hasDPA).length, 
        hasSecurity: state.vendors.filter(v => v.hasISO || v.hasSOC2).length 
      },
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
      dsars: { 
        total: state.dsars.length, 
        onTime: state.dsars.filter(d => d.daysRemaining > 0 || d.status === 'Concluído').length 
      },
      processes: { 
        total: state.activities.length, 
        complete: state.activities.filter(a => a.status === 'Ativo').length 
      },
      weights: state.settings.criticalityWeights
    };

    const scores = calculateGovernanceScores(scoringInput);
    const avg = Math.round(scores.reduce((acc, curr) => acc + curr.A, 0) / scores.length);
    
    const breakdown: { [key: string]: number } = {};
    scores.forEach(s => breakdown[s.subject] = s.A);

    dispatch({
      type: 'TAKE_SNAPSHOT',
      payload: {
        date: new Date().toISOString().split('T')[0],
        score: avg,
        breakdown
      }
    });

    addLog('Snapshot de Governança gerado manualmente', 'Engine', 'low');
  };

  const getTrend = () => {
    if (state.history.length === 0) return 0;
    const scoringInput: ScoringInputData = {
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
    const currentScores = calculateGovernanceScores(scoringInput);
    const currentAvg = currentScores.reduce((acc, curr) => acc + curr.A, 0) / currentScores.length;
    const lastAvg = state.history[0].score;
    return Math.round(currentAvg - lastAvg);
  };

  const getRecommendations = () => {
    // We could re-calculate scores here to get fresh insights
    const scoringInput: ScoringInputData = {
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
    return getMaturityInsights(scores);
  };

  return {
    ...state,
    updateVendor,
    toggleVendorStatus,
    updateVulnerability,
    toggleVulnStatus,
    updateActivity,
    toggleActivityStatus,
    updateLegalDoc,
    toggleLegalStatus,
    updateDSAR,
    toggleDSARStatus,
    updateRIPD,
    toggleRIPDStatus,
    updateIncident,
    toggleIncidentStatus,
    addLog,
    takeSnapshot,
    getTrend,
    getRecommendations
  };
};
