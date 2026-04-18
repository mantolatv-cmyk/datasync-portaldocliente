'use client';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { VendorRiskWidget } from '@/components/dashboard/VendorRiskWidget';
import { VulnerabilitySummary } from '@/components/dashboard/VulnerabilitySummary';
import { DataMappingInsight } from '@/components/dashboard/DataMappingInsight';
import { ActivityTrail } from '@/components/dashboard/ActivityTrail';
import { ComplianceHeatmap } from '@/components/dashboard/ComplianceHeatmap';
import { DataLineage } from '@/components/dashboard/DataLineage';
import { GovernanceScorecard } from '@/components/dashboard/GovernanceScorecard';
import { EDiscoveryTool } from '@/components/dashboard/EDiscoveryTool';
import { AIRIPDGenerator } from '@/components/dashboard/AIRIPDGenerator';
import { FormEngine } from '@/components/dashboard/FormEngine';
import { RIPDModule } from '@/components/dashboard/RIPDModule';
import { MappingModule } from '@/components/dashboard/MappingModule';
import { VendorModule } from '@/components/dashboard/VendorModule';
import { VulnerabilityModule } from '@/components/dashboard/VulnerabilityModule';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const navigateTo = (tab: string, filter: string | null = null) => {
    setActiveTab(tab);
    setSelectedFilter(filter);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="portal-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-viewport">
        <Header />
        
        <div className="content-scroll">
          {activeTab === 'overview' && (
            <>
              <div className="content-header">
                <div className="greeting-section">
                  <h1 className="greeting-title">Olá, Fernando Melo</h1>
                  <p className="greeting-subtitle">Sua organização está <span className="highlight">92% em conformidade</span> com a LGPD. 3 ações pendentes.</p>
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
                      <ComplianceHeatmap />
                    </div>
                  </div>

                  <div className="bento-row">
                    <div className="bento-col-12">
                      <GovernanceScorecard />
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
          {activeTab === 'ripd' && <RIPDModule />}
          {activeTab === 'mapping' && <MappingModule navigateTo={navigateTo} selectedId={selectedFilter} />}
          {activeTab === 'vendor' && <VendorModule navigateTo={navigateTo} selectedId={selectedFilter} />}
          {activeTab === 'vulnerability' && <VulnerabilityModule />}

          {/* Fallback for tabs not yet implemented */}
          {activeTab !== 'overview' && activeTab !== 'forms' && activeTab !== 'ripd' && activeTab !== 'mapping' && activeTab !== 'vendor' && activeTab !== 'vulnerability' && (
            <div className="placeholder-view">
              <h2 className="greeting-title">Módulo em Desenvolvimento</h2>
              <p className="greeting-subtitle">O recurso de {activeTab} está sendo integrado à infraestrutura DataSync.</p>
            </div>
          )}
        </div>
      </main>

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
          font-size: 2rem;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #F8FAFC 0%, #94A3B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .greeting-subtitle {
          color: var(--secondary);
          font-size: 1.125rem;
        }

        .highlight {
          color: var(--accent);
          font-weight: 600;
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
          .bento-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
