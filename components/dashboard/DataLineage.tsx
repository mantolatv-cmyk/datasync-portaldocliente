// Deployment Signature: 2026-04-18-07-06
'use client';
import React, { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  ConnectionLineType, 
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '../ui/Card';
import { SideSheet } from '../ui/SideSheet';
import { TechNode } from './TechNode';

const nodeTypes = {
  techNode: TechNode,
};

interface LineageNodeData {
  label: string;
  type: string;
  icon: string;
  metadata: {
    retention: string;
    encryption: string;
    legalBase: string;
  };
}

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'techNode', 
    position: { x: 50, y: 150 }, 
    data: { label: 'Website Form', type: 'COLETA', icon: 'globe', metadata: { retention: '2 anos', encryption: 'TLS 1.3', legalBase: 'Consentimento' } } 
  },
  { 
    id: '2', 
    type: 'techNode', 
    position: { x: 300, y: 150 }, 
    data: { label: 'Consent Manager', type: 'PROCESSAMENTO', icon: 'shield', metadata: { retention: 'Indeterminada', encryption: 'AES-256', legalBase: 'Obrigação Legal' } } 
  },
  { 
    id: '3', 
    type: 'techNode', 
    position: { x: 550, y: 150 }, 
    data: { label: 'AWS Postgres', type: 'ARMAZENAMENTO', icon: 'database', metadata: { retention: '5 anos', encryption: 'AES-256', legalBase: 'Contrato' } } 
  },
  // Branching
  { 
    id: '4', 
    type: 'techNode', 
    position: { x: 800, y: 50 }, 
    data: { label: 'Marketing API', type: 'USO', icon: 'cpu', metadata: { retention: '90 dias', encryption: 'SSL', legalBase: 'Legítimo Interesse' } } 
  },
  { 
    id: '5', 
    type: 'techNode', 
    position: { x: 800, y: 250 }, 
    data: { label: 'Fraud Detection', type: 'ANÁLISE', icon: 'shield', metadata: { retention: '1 ano', encryption: 'None', legalBase: 'Segurança' } } 
  },
  { 
    id: '6', 
    type: 'techNode', 
    position: { x: 1050, y: 150 }, 
    data: { label: 'Purge Service', type: 'DESCARTE', icon: 'trash', metadata: { retention: 'Imediato', encryption: 'Hashing', legalBase: 'Cumprimento de Direito' } } 
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00FF87' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00FF87' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#00FF87' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00FF87' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#00FF87', strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00FF87' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#00FF87', strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00FF87' } },
  { id: 'e4-6', source: '4', target: '6', animated: true, style: { stroke: '#888' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#888' } },
  { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#888' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#888' } },
];

export const DataLineage: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <Card 
      title="Linhagem de Dados (Data Lineage)" 
      subtitle="Ciclo de Vida da Informação e Fluxo de Governança"
    >
      <div className="lineage-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          colorMode="dark"
          style={{ background: 'transparent' }}
        >
          <Background color="#333" gap={20} />
          <Controls />
        </ReactFlow>

        <SideSheet 
          isOpen={!!selectedNode} 
          onClose={() => setSelectedNode(null)} 
          title={`Metadados: ${(selectedNode?.data as any)?.label || ''}`}
        >
          {selectedNode && (
            <div className="metadata-sheet">
              <div className="metadata-item">
                <span className="meta-label">ID do Nó:</span>
                <span className="meta-value">#{selectedNode.id}</span>
              </div>
              <div className="metadata-item">
                <span className="meta-label">Tipo de Ativo:</span>
                <span className="meta-value">{(selectedNode.data as any).type}</span>
              </div>
              <div className="divider"></div>
              <div className="metadata-item">
                <span className="meta-label">Tempo de Retenção:</span>
                <span className="meta-value text-accent">{(selectedNode.data as any).metadata.retention}</span>
              </div>
              <div className="metadata-item">
                <span className="meta-label">Criptografia:</span>
                <span className="meta-value">{(selectedNode.data as any).metadata.encryption}</span>
              </div>
              <div className="metadata-item">
                <span className="meta-label">Base Legal (LGPD):</span>
                <span className="meta-value">{(selectedNode.data as any).metadata.legalBase}</span>
              </div>
              <div className="divider"></div>
              <p className="description">
                Este nó representa um ponto crítico de controle de privacidade. Qualquer alteração no fluxo de processamento requer revisão do RIPD associado.
              </p>
            </div>
          )}
        </SideSheet>
      </div>

      <style jsx>{`
        .lineage-container {
          height: 600px;
          border-radius: 12px;
          background: #050505;
          border: 1px solid var(--border);
          overflow: hidden;
          position: relative;
        }

        .metadata-sheet {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .metadata-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--secondary);
          text-transform: uppercase;
          font-weight: 600;
        }

        .meta-value {
          font-size: 0.875rem;
          color: var(--foreground);
          font-weight: 500;
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }

        .description {
          font-size: 0.8125rem;
          color: var(--secondary);
          line-height: 1.5;
          font-style: italic;
        }

        .text-accent {
          color: var(--accent);
        }
      `}</style>
    </Card>
  );
};
