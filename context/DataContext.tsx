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
  ],
  vulnerabilities: [
    { id: 'CVE-2024-3452', name: 'Remote Code Execution in OpenSSL', asset: 'Main-Prod-Server-01', type: 'Network', severity: 'Crítico', status: 'Aberto', discoveryDate: '15/04/2024', slaDays: 2, impactedProcessId: 'PROC-003' },
    { id: 'CVE-2023-9912', name: 'SQL Injection on Login Endpoint', asset: 'Customer-Portal-API', type: 'Web', severity: 'Crítico', status: 'Em Correção', discoveryDate: '12/04/2024', slaDays: 0, impactedProcessId: 'PROC-001' },
    { id: 'CVE-2024-1102', name: 'Insecure Permissions on S3 Bucket', asset: 'Internal-Docs-Storage', type: 'Network', severity: 'Alto', status: 'Aberto', discoveryDate: '17/04/2024', slaDays: 14, impactedProcessId: 'PROC-005' },
    { id: 'CVE-2023-5564', name: 'Outdated Linux Kernel Version', asset: 'Analytics-Node-04', type: 'OS', severity: 'Médio', status: 'Aberto', discoveryDate: '10/04/2024', slaDays: 28 },
    { id: 'VULN-DS-01', name: 'Missing HSTS Header', asset: 'datasync-portal.com', type: 'Web', severity: 'Baixo', status: 'Mitigado', discoveryDate: '01/04/2024', slaDays: 90 },
  ],
  activities: [
    { id: 'PROC-001', name: 'Gestão de Folha de Pagamento', purpose: 'Pagamentos.', categories: ['Financeiro'], subjects: 'Colaboradores', legalBase: 'Contrato', isSensitive: true, status: 'Ativo', department: 'RH', vendorId: 'V-005', vendorName: 'Soluções Contábeis' },
  ],
  dsars: [
    { id: 'REQ-2024-082', name: 'Juliana Siqueira', email: 'juliana.si@gmail.com', type: 'Acesso', status: 'Processando', receivedDate: '10/04/2024', daysRemaining: 7, priority: 'Alta', idVerified: true },
  ],
  ripds: [
    { id: 'RIPD-2024-001', project: 'App Fidelidade Mobile', department: 'Marketing', riskScore: 'Alto', status: 'Aprovado', date: '12/04/2024', progress: 100, linkedProcessId: 'PROC-001' },
  ],
  incidents: [
    { id: 'INC-7722', type: 'Data Leak (PII)', asset: 'Oracle-DB-Cust', severity: 'Crítico', status: 'Investigando', discoveryDate: '19/04/2024', detectedBy: 'IDS/IPS', impactScore: 88 },
  ],
  logs: [
    { id: '1', user: 'Admin DPO', action: 'Login no sistema', module: 'Auth', time: 'Agora', severity: 'low' },
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
