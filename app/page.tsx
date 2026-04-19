'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Preloader } from '@/components/ui/Preloader';
import { VendorRiskWidget } from '@/components/dashboard/VendorRiskWidget';
import { VulnerabilitySummary } from '@/components/dashboard/VulnerabilitySummary';
import { DataMappingInsight } from '@/components/dashboard/DataMappingInsight';
import { ActivityTrail } from '@/components/dashboard/ActivityTrail';
import { DataLineage } from '@/components/dashboard/DataLineage';
import { GovernanceScorecard } from '@/components/dashboard/GovernanceScorecard';
import { EDiscoveryTool } from '@/components/dashboard/EDiscoveryTool';
import { AIRIPDGenerator } from '@/components/dashboard/AIRIPDGenerator';
import { FormEngine } from '@/components/dashboard/FormEngine';
import { RIPDModule } from '@/components/dashboard/RIPDModule';
import { MappingModule } from '@/components/dashboard/MappingModule';
import { VendorModule } from '@/components/dashboard/VendorModule';
import { VulnerabilityModule } from '@/components/dashboard/VulnerabilityModule';
import { IncidentModule } from '@/components/dashboard/IncidentModule';
import { LegalVaultModule } from '@/components/dashboard/LegalVaultModule';
import { DSARModule } from '@/components/dashboard/DSARModule';
import { PrivacyCopilot } from '@/components/dashboard/PrivacyCopilot';
import { calculateGovernanceScores, ScoringInputData, getMaturityTier } from '@/utils/scoring-engine';
import { DataSyncProvider, useData } from '@/context/DataContext';
import { useDataSync } from '@/hooks/use-datasync';
import { Award, ArrowUp, ArrowDown } from 'lucide-react';

function DashboardContent() {
  const { state } = useData();
  const { getTrend } = useDataSync();
  const { vendors, vulnerabilities, dsars, activities, settings } = state;
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Next-Gen Dynamic metrics for Algorithmic Scoring
  const scoringData: ScoringInputData = {
    vendors: { 
      total: vendors.length, 
      hasDPA: vendors.filter(v => v.hasDPA).length, 
      hasSecurity: vendors.filter(v => v.hasISO || v.hasSOC2).length 
    },
    vulnerabilities: { 
      total: vulnerabilities.length, 
      bySeverity: {
        'Crítico': vulnerabilities.filter(v => v.severity === 'Crítico' && v.status !== 'Mitigado').length,
        'Alto': vulnerabilities.filter(v => v.severity === 'Alto' && v.status !== 'Mitigado').length,
        'Médio': vulnerabilities.filter(v => v.severity === 'Médio' && v.status !== 'Mitigado').length,
        'Baixo': vulnerabilities.filter(v => v.severity === 'Baixo' && v.status !== 'Mitigado').length,
      },
      mitigated: vulnerabilities.filter(v => v.status === 'Mitigado').length 
    },
    dsars: { 
      total: dsars.length, 
      onTime: dsars.filter(d => d.daysRemaining > 0 || d.status === 'Concluído').length 
    },
    processes: { 
      total: activities.length, 
      complete: activities.filter(a => a.status === 'Ativo').length 
    },
    weights: settings.criticalityWeights
  };

  const calculatedScores = calculateGovernanceScores(scoringData);
  const globalScore = Math.round(calculatedScores.reduce((acc, curr) => acc + curr.A, 0) / calculatedScores.length);
  const trend = getTrend();
  const { tier, color } = getMaturityTier(globalScore);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (tab: string, filter: string | null = null) => {
    setActiveTab(tab);
    setSelectedFilter(filter);
    setIsSidebarOpen(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {isBooting && <Preloader />}
      <div className="portal-container">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      
      <main className="main-viewport">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onCopilotClick={() => setIsCopilotOpen(true)}
        />
        
        <div className="content-scroll">
          {activeTab === 'overview' && (
            <>
              <div className="content-header">
                <div className="greeting-section">
                  <h1 className="greeting-title">Olá, Fernando Melo</h1>
                  <div className="status-indicator">
                    <span className="maturity-badge" style={{ 
                      backgroundColor: `rgba(${color.includes('var') ? '0, 255, 135' : '251, 165, 2'}, 0.1)`, 
                      color: color,
                      borderColor: `rgba(${color.includes('var') ? '0, 255, 135' : '251, 165, 2'}, 0.3)`
                    }}>
                      <Award size={12} />
                      Nível: {tier}
                    </span>
                    <p className="greeting-subtitle">
                      Sua organização está <span className="highlight">{globalScore}% em conformidade</span>. 
                      {trend !== 0 && (
                        <span className={`trend-pill ${trend > 0 ? 'up' : 'down'}`}>
                          {trend > 0 ? '+' : ''}{trend}% vs snapshot
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="grid-main">
                  <div className="bento-row">
                    <div className="bento-col-12">
                      <EDiscoveryTool />
                    </div>
                  </div>

                  <div className="bento-row">
                    <div className="bento-col-12">
                      <AIRIPDGenerator />
                    </div>
                  </div>

                  <div className="bento-row">
                    <div className="bento-col-8">
                      <DataMappingInsight navigateTo={navigateTo} />
                    </div>
                    <div className="bento-col-4">
                      <VulnerabilitySummary navigateTo={navigateTo} />
                    </div>
                  </div>

                  <div className="bento-row">
                    <div className="bento-col-12">
                      <GovernanceScorecard data={calculatedScores} />
                    </div>
                  </div>

                  <div className="bento-row">
                    <div className="bento-col-12">
                      <DataLineage />
                    </div>
                  </div>
                  
                  <div className="bento-row">
                    <div className="bento-col-12">
                      <VendorRiskWidget navigateTo={navigateTo} />
                    </div>
                  </div>
                </div>

                <div className="grid-side">
                  <ActivityTrail />
                </div>
              </div>
            </>
          )}

          {activeTab === 'forms' && <FormEngine />}
          {activeTab === 'ripd' && (
            <RIPDModule 
              navigateTo={navigateTo} 
              onCopilotOpen={() => setIsCopilotOpen(true)} 
            />
          )}
          {activeTab === 'mapping' && <MappingModule navigateTo={navigateTo} selectedId={selectedFilter} />}
          {activeTab === 'vendor' && <VendorModule navigateTo={navigateTo} selectedId={selectedFilter} />}
          {activeTab === 'vulnerability' && (
            <VulnerabilityModule 
              navigateTo={navigateTo} 
              onCopilotOpen={() => setIsCopilotOpen(true)} 
            />
          )}
          {activeTab === 'incident' && (
            <IncidentModule 
              navigateTo={navigateTo} 
              onCopilotOpen={() => setIsCopilotOpen(true)} 
            />
          )}
          {activeTab === 'legal-vault' && <LegalVaultModule navigateTo={navigateTo} onCopilotOpen={() => setIsCopilotOpen(true)} />}
          {activeTab === 'dsar' && <DSARModule navigateTo={navigateTo} onCopilotOpen={() => setIsCopilotOpen(true)} />}

          {/* Fallback for tabs not yet implemented */}
          {activeTab !== 'overview' && activeTab !== 'forms' && activeTab !== 'ripd' && activeTab !== 'mapping' && activeTab !== 'vendor' && activeTab !== 'vulnerability' && activeTab !== 'incident' && activeTab !== 'legal-vault' && activeTab !== 'dsar' && (
            <div className="placeholder-view">
              <h2 className="greeting-title">Módulo em Desenvolvimento</h2>
              <p className="greeting-subtitle">O recurso de {activeTab} está sendo integrado à infraestrutura DataSync.</p>
            </div>
          )}
        </div>
      </main>

      <PrivacyCopilot 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)} 
      />
      </div>

      <style jsx>{`
        .portal-container {
          display: flex;
          width: 100vw;
          height: 100vh;
          background: var(--background);
          overflow: hidden;
        }

        .main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .content-scroll {
          flex: 1;
          overflow-y: auto;
          position: relative;
        }

        .content-header {
          padding: 40px 40px 0;
          margin-bottom: 24px;
        }

        .greeting-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 4px;
          background: linear-gradient(135deg, #FFF 0%, #94A3B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .maturity-badge { 
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.6875rem; 
          font-weight: 800; 
          padding: 6px 16px; 
          border-radius: 99px; 
          border: 1px solid transparent;
          backdrop-filter: blur(12px);
          text-transform: uppercase; 
          letter-spacing: 0.08em;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .trend-pill { 
          font-size: 0.75rem; 
          font-weight: 700; 
          padding: 4px 10px; 
          border-radius: 6px; 
        }

        .trend-pill.up { background: rgba(0, 255, 135, 0.1); color: var(--accent); border: 1px solid rgba(0, 255, 135, 0.15); }
        .trend-pill.down { background: rgba(255, 71, 87, 0.1); color: var(--error); border: 1px solid rgba(255, 71, 87, 0.15); }

        .greeting-subtitle {
          color: var(--secondary);
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.9;
        }

        .highlight {
          color: var(--accent);
          font-weight: 700;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
          padding: 0 40px 40px;
        }

        .grid-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .placeholder-view {
          padding: 80px;
          text-align: center;
        }

        .bento-row {
          display: flex;
          gap: 24px;
        }

        .bento-col-8 { flex: 2; }
        .bento-col-4 { flex: 1; }
        .bento-col-12 { width: 100%; }

        .grid-side {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1440px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .grid-side {
            order: 3;
          }
        }

        @media (max-width: 1024px) {
          .portal-container { padding-left: 0; }
          .main-viewport { padding-left: 0; }
          .content-scroll { padding: 16px; }
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .bento-row {
            flex-direction: column;
            gap: 16px;
          }
          .greeting-title { font-size: 1.5rem; }
          .greeting-subtitle { font-size: 0.8125rem; }
        }
      `}</style>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
