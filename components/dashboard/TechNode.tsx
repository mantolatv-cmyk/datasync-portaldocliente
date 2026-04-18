'use client';
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Globe, Database, Cpu, Trash2, ShieldCheck } from 'lucide-react';

const iconMap: Record<string, any> = {
  globe: Globe,
  database: Database,
  cpu: Cpu,
  trash: Trash2,
  shield: ShieldCheck
};

export const TechNode = memo(({ data }: any) => {
  const Icon = iconMap[data.icon] || Cpu;

  return (
    <div className="tech-node glass">
      <Handle type="target" position={Position.Left} className="handle" />
      
      <div className="node-icon-container">
        <Icon size={18} className="node-icon" />
      </div>
      
      <div className="node-info">
        <p className="node-label">{data.label}</p>
        <p className="node-type">{data.type}</p>
      </div>

      <Handle type="source" position={Position.Right} className="handle" />

      <style jsx>{`
        .tech-node {
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(18, 18, 18, 0.8);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 180px;
          transition: all 0.3s;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }

        .tech-node:hover {
          border-color: var(--accent);
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.2);
          transform: translateY(-2px);
        }

        .node-icon-container {
          width: 36px;
          height: 36px;
          background: rgba(0, 255, 135, 0.05);
          border: 1px solid rgba(0, 255, 135, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .node-info {
          display: flex;
          flex-direction: column;
        }

        .node-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .node-type {
          font-size: 0.625rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .handle {
          width: 8px !important;
          height: 8px !important;
          background: var(--accent) !important;
          border: 2px solid var(--background) !important;
        }
      `}</style>
    </div>
  );
});

TechNode.displayName = 'TechNode';
