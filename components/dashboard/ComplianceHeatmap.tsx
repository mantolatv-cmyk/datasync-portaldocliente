'use client';
import React, { useState } from 'react';
// @ts-ignore
import { ComposableMap, Geographies, Geography, ZoomableGroup } from '@vnedyalk0v/react19-simple-maps';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Globe } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const complianceData: Record<string, { score: number, laws: string[], status: 'cyan' | 'amber' | 'crimson' }> = {
  "BRA": { score: 92, laws: ["LGPD"], status: "cyan" },
  "USA": { score: 78, laws: ["CCPA", "HIPAA"], status: "amber" },
  "DEU": { score: 95, laws: ["GDPR", "BDSG"], status: "cyan" },
  "GBR": { score: 88, laws: ["UK GDPR"], status: "cyan" },
  "CHN": { score: 45, laws: ["PIPL"], status: "crimson" },
  "IND": { score: 62, laws: ["DPDP"], status: "amber" },
};

export const ComplianceHeatmap: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountryColor = (countryId: string) => {
    const data = complianceData[countryId];
    if (!data) return "#1A1A1A"; // Neutral black
    if (data.status === 'cyan') return "#00FF87"; // Vibrant Green
    if (data.status === 'amber') return "#FB2E01"; // Warning
    return "#FF0055"; // Error
  };

  return (
    <Card 
      title="Heatmap Regulatório Global" 
      subtitle="Status de Conformidade por Região"
      action={<div className="map-legend">
        <span className="legend-item"><span className="dot green"></span> OK</span>
        <span className="legend-item"><span className="dot amber"></span> Atenção</span>
        <span className="legend-item"><span className="dot red"></span> Risco</span>
      </div>}
    >
      <div className="heatmap-container">
        <div className="map-wrapper">
          <ComposableMap projectionConfig={{ scale: 140 }}>
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryId = geo.id || geo.properties.ISO_A3;
                    const isHovered = hoveredCountry === countryId;
                    const data = complianceData[countryId];

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredCountry(countryId)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        style={{
                          default: {
                            fill: getCountryColor(countryId),
                            stroke: "#000",
                            strokeWidth: 0.5,
                            outline: "none",
                            opacity: 0.8,
                            transition: "all 0.3s"
                          },
                          hover: {
                            fill: getCountryColor(countryId),
                            stroke: "#FFF",
                            strokeWidth: 1,
                            outline: "none",
                            opacity: 1,
                            cursor: "pointer"
                          },
                          pressed: {
                            outline: "none"
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {hoveredCountry && complianceData[hoveredCountry] && (
          <div className="country-details anim-fade-in">
            <div className="details-header">
              <Globe size={16} className="text-accent" />
              <span className="country-name">{hoveredCountry}</span>
              <Badge variant={complianceData[hoveredCountry].status}>
                {complianceData[hoveredCountry].score}%
              </Badge>
            </div>
            <div className="details-body">
              <p className="laws-label">Frameworks:</p>
              <div className="laws-list">
                {complianceData[hoveredCountry].laws.map(law => (
                  <span key={law} className="law-badge">{law}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .heatmap-container {
          position: relative;
          height: 380px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .map-wrapper {
          width: 100%;
          height: 100%;
        }

        .map-legend {
          display: flex;
          gap: 12px;
          font-size: 0.625rem;
          color: var(--secondary);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot.green { background: #00FF87; box-shadow: 0 0 5px #00FF87; }
        .dot.amber { background: #FB2E01; box-shadow: 0 0 5px #FB2E01; }
        .dot.red { background: #FF0055; box-shadow: 0 0 5px #FF0055; }

        .country-details {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(18, 18, 18, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid var(--accent);
          padding: 16px;
          border-radius: 12px;
          width: 220px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }

        .details-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .country-name {
          font-weight: 700;
          font-size: 0.875rem;
          flex: 1;
        }

        .laws-label {
          font-size: 0.625rem;
          color: var(--secondary);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .laws-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .law-badge {
          font-size: 0.6875rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          color: var(--foreground);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </Card>
  );
};
