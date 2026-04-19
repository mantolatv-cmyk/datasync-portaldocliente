'use client';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// --- TYPES ---
export interface ScoreSnapshot {
  date: string;
  score: number;
  breakdown: { [key: string]: number };
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  mappedActivities: number;
  sensitiveActivities: number;
  lastAudit: string;
  status: 'Compliant' | 'At Risk' | 'Audit Required';
  hasDPA: boolean;
  hasISO: boolean;
  hasSOC2: boolean;
  contactEmail: string;
}

export interface Vulnerability {
  id: string;
  name: string;
  asset: string;
  type: 'Web' | 'Network' | 'OS' | 'Database';
  severity: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  status: 'Aberto' | 'Em Correção' | 'Mitigado';
  discoveryDate: string;
  slaDays: number;
  impactedProcessId?: string;
}

export interface ProcessingActivity {
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

export interface DSARRequest {
  id: string;
  name: string;
  email: string;
  type: 'Acesso' | 'Exclusão' | 'Portabilidade' | 'Anonimização' | 'Correção';
  status: 'Triagem' | 'Processando' | 'Aguardando Titular' | 'Concluído' | 'Cancelado';
  receivedDate: string;
  daysRemaining: number;
  priority: 'Alta' | 'Média' | 'Baixa';
  idVerified: boolean;
}

export interface RIPD {
  id: string;
  project: string;
  department: string;
  riskScore: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  status: 'Aprovado' | 'Em Revisão' | 'Rascunho';
  date: string;
  progress: number;
  linkedProcessId: string;
}

export interface Incident {
  id: string;
  type: string;
  asset: string;
  severity: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  status: 'Aberto' | 'Contenção' | 'Investigando' | 'Notificado' | 'Encerrado';
  discoveryDate: string;
  detectedBy: string;
  impactScore: number;
}

export interface LegalDocument {
  id: string;
  name: string;
  category: 'DPA' | 'Política' | 'Parecer' | 'Contrato';
  status: 'Vigente' | 'A Vencer' | 'Expirado' | 'Em Revisão';
  expiryDate: string;
  lastUpdated: string;
  size: string;
  aiSummary: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  module: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

interface DataState {
  vendors: Vendor[];
  vulnerabilities: Vulnerability[];
  activities: ProcessingActivity[];
  dsars: DSARRequest[];
  ripds: RIPD[];
  incidents: Incident[];
  legalDocuments: LegalDocument[];
  logs: ActivityLog[];
  history: ScoreSnapshot[];
  settings: {
    criticalityWeights: { [key: string]: number };
  };
  isHydrated: boolean;
}

type DataAction = 
  | { type: 'HYDRATE'; payload: DataState }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'UPDATE_VULNERABILITY'; payload: Vulnerability }
  | { type: 'UPDATE_ACTIVITY'; payload: ProcessingActivity }
  | { type: 'UPDATE_DSAR'; payload: DSARRequest }
  | { type: 'UPDATE_RIPD'; payload: RIPD }
  | { type: 'UPDATE_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_LEGAL_DOC'; payload: LegalDocument }
  | { type: 'ADD_LOG'; payload: ActivityLog }
  | { type: 'TAKE_SNAPSHOT'; payload: ScoreSnapshot };

// --- INITIAL DATA ---

const initialState: DataState = {
  vendors: [
    { id: 'V-001', name: 'AWS Brazil', category: 'Cloud Infrastructure', mappedActivities: 8, sensitiveActivities: 3, lastAudit: '10/01/2024', status: 'Compliant', hasDPA: true, hasISO: true, hasSOC2: true, contactEmail: 'compliance@amazon.com' },
    { id: 'V-002', name: 'Salesforce (SaaS)', category: 'CRM', mappedActivities: 4, sensitiveActivities: 1, lastAudit: '15/12/2023', status: 'Compliant', hasDPA: true, hasISO: true, hasSOC2: false, contactEmail: 'privacy@salesforce.com' },
    { id: 'V-003', name: 'Zendesk Inc.', category: 'Customer Support', mappedActivities: 2, sensitiveActivities: 0, lastAudit: '05/02/2024', status: 'Compliant', hasDPA: true, hasISO: false, hasSOC2: false, contactEmail: 'dpo@zendesk.com' },
    { id: 'V-004', name: 'Loggi Tecnologia', category: 'Logistics / Delivery', mappedActivities: 3, sensitiveActivities: 2, lastAudit: '20/03/2024', status: 'At Risk', hasDPA: false, hasISO: false, hasSOC2: false, contactEmail: 'privacidade@loggi.com.br' },
    { id: 'V-005', name: 'Soluções Contábeis LTDA', category: 'Accounting / Payroll', mappedActivities: 1, sensitiveActivities: 1, lastAudit: '02/11/2023', status: 'Audit Required', hasDPA: true, hasISO: false, hasSOC2: false, contactEmail: 'contato@contabil.com.br' },
    { id: 'V-006', name: 'Stripe Payments', category: 'Payment Gateway', mappedActivities: 5, sensitiveActivities: 5, lastAudit: '01/04/2024', status: 'Compliant', hasDPA: true, hasISO: true, hasSOC2: true, contactEmail: 'support@stripe.com' },
    { id: 'V-007', name: 'Gupy Software', category: 'Recruitment', mappedActivities: 2, sensitiveActivities: 2, lastAudit: '12/03/2024', status: 'At Risk', hasDPA: true, hasISO: false, hasSOC2: false, contactEmail: 'privacidade@gupy.com' },
  ],
  vulnerabilities: [
    { id: 'CVE-2024-3452', name: 'Remote Code Execution in OpenSSL', asset: 'Main-Prod-Server-01', type: 'Network', severity: 'Crítico', status: 'Aberto', discoveryDate: '15/04/2024', slaDays: 2, impactedProcessId: 'PROC-003' },
    { id: 'CVE-2023-9912', name: 'SQL Injection on Login Endpoint', asset: 'Customer-Portal-API', type: 'Web', severity: 'Crítico', status: 'Em Correção', discoveryDate: '12/04/2024', slaDays: 0, impactedProcessId: 'PROC-001' },
    { id: 'CVE-2024-1102', name: 'Insecure Permissions on S3 Bucket', asset: 'Internal-Docs-Storage', type: 'Network', severity: 'Alto', status: 'Aberto', discoveryDate: '17/04/2024', slaDays: 14, impactedProcessId: 'PROC-005' },
    { id: 'CVE-2023-5564', name: 'Outdated Linux Kernel Version', asset: 'Analytics-Node-04', type: 'OS', severity: 'Médio', status: 'Aberto', discoveryDate: '10/04/2024', slaDays: 28 },
    { id: 'VULN-DS-01', name: 'Expired SSL Certificate (Wildcard)', asset: 'dev.datasync.portal', type: 'Network', severity: 'Alto', status: 'Aberto', discoveryDate: '18/04/2024', slaDays: 2 },
    { id: 'VULN-DS-02', name: 'Broken Access Control on Internal Dashboard', asset: 'Admin-Panel-UI', type: 'Web', severity: 'Crítico', status: 'Aberto', discoveryDate: '19/04/2024', slaDays: 1 },
    { id: 'VULN-DS-03', name: 'Unquoted Service Path', asset: 'HR-PC-Workstation-01', type: 'OS', severity: 'Baixo', status: 'Mitigado', discoveryDate: '01/04/2024', slaDays: 90 },
  ],
  activities: [
    { id: 'PROC-001', name: 'Gestão de Folha de Pagamento', purpose: 'Processamento de pagamentos e benefícios.', categories: ['Financeiro', 'Recursos Humanos'], subjects: 'Colaboradores', legalBase: 'Contrato', isSensitive: true, status: 'Ativo', department: 'RH', vendorId: 'V-005', vendorName: 'Soluções Contábeis' },
    { id: 'PROC-002', name: 'Campanhas de E-mail Marketing', purpose: 'Envio de promoções e newsletters.', categories: ['Marketing'], subjects: 'Leads e Clientes', legalBase: 'Consentimento', isSensitive: false, status: 'Ativo', department: 'Marketing', vendorId: 'V-002', vendorName: 'Salesforce' },
    { id: 'PROC-003', name: 'Autenticação de Usuários', purpose: 'Controle de acesso ao portal do cliente.', categories: ['TI', 'Segurança'], subjects: 'Clientes', legalBase: 'Execução de Contrato', isSensitive: true, status: 'Ativo', department: 'TI' },
    { id: 'PROC-004', name: 'Avaliação de Candidatos (Recrutamento)', purpose: 'Triagem de currículos e entrevistas.', categories: ['Recursos Humanos'], subjects: 'Candidatos', legalBase: 'Procedimentos Pré-contratuais', isSensitive: true, status: 'Em Revisão', department: 'RH', vendorId: 'V-007', vendorName: 'Gupy' },
    { id: 'PROC-005', name: 'Processamento de Pagamentos (Checkout)', purpose: 'Venda de assinaturas e serviços.', categories: ['Financeiro'], subjects: 'Clientes', legalBase: 'Contrato', isSensitive: true, status: 'Ativo', department: 'Financeiro', vendorId: 'V-006', vendorName: 'Stripe' },
    { id: 'PROC-006', name: 'Suporte Técnico (Tickets)', purpose: 'Resolução de problemas de clientes.', categories: ['Operacional'], subjects: 'Clientes', legalBase: 'Contrato', isSensitive: false, status: 'Ativo', department: 'TI', vendorId: 'V-003', vendorName: 'Zendesk' },
    { id: 'PROC-007', name: 'Monitoramento de Segurança (IDS/IPS)', purpose: 'Prevenção de intrusão e ataques.', categories: ['Segurança'], subjects: 'Geral', legalBase: 'Legítimo Interesse', isSensitive: false, status: 'Ativo', department: 'TI' },
  ],
  dsars: [
    { id: 'REQ-2024-001', name: 'Juliana Siqueira', email: 'juliana.si@gmail.com', type: 'Acesso', status: 'Concluído', receivedDate: '01/04/2024', daysRemaining: 0, priority: 'Alta', idVerified: true },
    { id: 'REQ-2024-082', name: 'Marcelo Ortega', email: 'marcelo.ortega@uol.com.br', type: 'Exclusão', status: 'Processando', receivedDate: '10/04/2024', daysRemaining: 7, priority: 'Alta', idVerified: true },
    { id: 'REQ-2024-085', name: 'Carla Dias', email: 'carla.dias@outlook.com', type: 'Portabilidade', status: 'Triagem', receivedDate: '18/04/2024', daysRemaining: 14, priority: 'Média', idVerified: false },
    { id: 'REQ-2024-088', name: 'Roberto Silva', email: 'roberto.silva@gmail.com', type: 'Correção', status: 'Aguardando Titular', receivedDate: '15/04/2024', daysRemaining: 5, priority: 'Baixa', idVerified: true },
  ],
  ripds: [
    { id: 'RIPD-2024-001', project: 'App Fidelidade Mobile', department: 'Marketing', riskScore: 'Alto', status: 'Aprovado', date: '12/04/2024', progress: 100, linkedProcessId: 'PROC-002' },
    { id: 'RIPD-2024-034', project: 'Novo Sistema de Biometria Facial', department: 'TI', riskScore: 'Crítico', status: 'Em Revisão', date: '18/04/2024', progress: 65, linkedProcessId: 'PROC-003' },
    { id: 'RIPD-2024-045', project: 'Migração de Dados Financeiros (Cloud)', department: 'Financeiro', riskScore: 'Médio', status: 'Rascunho', date: '19/04/2024', progress: 20, linkedProcessId: 'PROC-005' },
  ],
  incidents: [
    { id: 'INC-7722', type: 'Data Leak (PII Export)', asset: 'Oracle-DB-Cust', severity: 'Crítico', status: 'Investigando', discoveryDate: '17/04/2024', detectedBy: 'DataLossPrevention', impactScore: 88 },
    { id: 'INC-7724', type: 'Unauthorized Access Attempt', asset: 'VPN-Gateway-Secondary', severity: 'Alto', status: 'Contenção', discoveryDate: '19/04/2024', detectedBy: 'WAF Logs', impactScore: 45 },
    { id: 'INC-7725', type: 'Phishing Campaign Detected', asset: 'Corporate-Email-Domain', severity: 'Médio', status: 'Aberto', discoveryDate: '18/04/2024', detectedBy: 'User Report', impactScore: 12 },
  ],
  legalDocuments: [
    { id: 'DOC-001', name: 'Acordo de Processamento de Dados (DPA) - AWS', category: 'DPA', status: 'Vigente', expiryDate: '12/12/2025', lastUpdated: '10/01/2024', size: '1.2 MB', aiSummary: 'Este documento estabelece as obrigações da AWS como operadora de dados, garantindo conformidade com a LGPD e GDPR.' },
    { id: 'DOC-002', name: 'Política de Privacidade Externa v2.4', category: 'Política', status: 'A Vencer', expiryDate: '01/06/2024', lastUpdated: '01/06/2023', size: '450 KB', aiSummary: 'Relatório detalhado sobre como os dados dos clientes são coletados via portal.' },
    { id: 'DOC-003', name: 'Parecer Jurídico: Legítimo Interesse (LIA) - Marketing', category: 'Parecer', status: 'Em Revisão', expiryDate: 'N/A', lastUpdated: '15/04/2024', size: '890 KB', aiSummary: 'Avaliação da base legal para campanhas de e-mail marketing.' },
    { id: 'DOC-004', name: 'Contrato de Auditoria de Privacidade - Deloitte', category: 'Contrato', status: 'Expirado', expiryDate: '01/03/2024', lastUpdated: '01/03/2023', size: '2.4 MB', aiSummary: 'Acordo de prestação de serviços para auditoria externa anual.' },
    { id: 'DOC-005', name: 'Política de Home Office e Segurança (BYOD)', category: 'Política', status: 'Vigente', expiryDate: '30/12/2026', lastUpdated: '15/03/2024', size: '1.1 MB', aiSummary: 'Diretrizes para o uso de dispositivos pessoais para fins de trabalho.' },
  ],
  logs: [
    { id: '1', user: 'Fernando Melo', action: 'Login no sistema', module: 'Auth', time: '10 min atrás', severity: 'low' },
    { id: '2', user: 'Sistemas', action: 'Snapshot Automático Gerado', module: 'Engine', time: '1 hora atrás', severity: 'low' },
    { id: '3', user: 'Fernando Melo', action: 'Início de RIPD (Biometria)', module: 'Compliance', time: '2 horas atrás', severity: 'medium' },
    { id: '4', user: 'Admin TI', action: 'Nova Vulnerabilidade Detectada', module: 'Security', time: '3 horas atrás', severity: 'high' },
    { id: '5', user: 'Loggi Bot', action: 'API de Rastreio Atualizada', module: 'Vendors', time: '5 horas atrás', severity: 'low' },
    { id: '6', user: 'Fernando Melo', action: 'Download de Relatório Mensal', module: 'Reports', time: '1 dia atrás', severity: 'low' },
  ],
  history: [
    { date: '2024-04-10', score: 78, breakdown: { 'Transparência': 60, 'Gestão de Direitos': 40, 'Segurança': 70, 'Minimização': 50, 'Terceiros': 45 } },
    { date: '2024-04-15', score: 82, breakdown: { 'Transparência': 65, 'Gestão de Direitos': 40, 'Segurança': 75, 'Minimização': 55, 'Terceiros': 50 } },
  ],
  settings: {
    criticalityWeights: {
      'Crítico': 2.5,
      'Alto': 1.5,
      'Médio': 1.0,
      'Baixo': 0.5
    }
  },
  isHydrated: false,
};

// --- REDUCER ---

function dataReducer(state: DataState, action: DataAction): DataState {
  let newState = state;
  switch (action.type) {
    case 'HYDRATE':
      return { ...action.payload, isHydrated: true };
    case 'UPDATE_VENDOR':
      newState = { ...state, vendors: state.vendors.map(v => v.id === action.payload.id ? action.payload : v) };
      break;
    case 'UPDATE_VULNERABILITY':
      newState = { ...state, vulnerabilities: state.vulnerabilities.map(v => v.id === action.payload.id ? action.payload : v) };
      break;
    case 'UPDATE_ACTIVITY':
      newState = { ...state, activities: state.activities.map(a => a.id === action.payload.id ? action.payload : a) };
      break;
    case 'UPDATE_DSAR':
      newState = { ...state, dsars: state.dsars.map(d => d.id === action.payload.id ? action.payload : d) };
      break;
    case 'UPDATE_RIPD':
      newState = { ...state, ripds: state.ripds.map(r => r.id === action.payload.id ? action.payload : r) };
      break;
    case 'UPDATE_INCIDENT':
      newState = { ...state, incidents: state.incidents.map(i => i.id === action.payload.id ? action.payload : i) };
      break;
    case 'UPDATE_LEGAL_DOC':
      newState = { ...state, legalDocuments: state.legalDocuments.map(doc => doc.id === action.payload.id ? action.payload : doc) };
      break;
    case 'ADD_LOG':
      newState = { ...state, logs: [action.payload, ...state.logs].slice(0, 50) };
      break;
    case 'TAKE_SNAPSHOT':
      newState = { ...state, history: [action.payload, ...state.history].slice(0, 30) };
      break;
    default:
      return state;
  }
  
  if (typeof window !== 'undefined' && newState.isHydrated) {
    localStorage.setItem('datasync_state', JSON.stringify(newState));
  }
  return newState;
}

// --- CONTEXT ---

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
} | undefined>(undefined);

export const DataSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('datasync_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'HYDRATE', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataSyncProvider');
  return context;
};
