'use client';
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Type, 
  CheckCircle2, 
  Calendar, 
  Upload, 
  Eye, 
  Globe,
  Settings2,
  ChevronDown,
  Layout,
  Share2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface FormField {
  id: string;
  type: 'text' | 'choice' | 'date' | 'file';
  label: string;
  placeholder: string;
  required: boolean;
}

export const FormEngine: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([
    { id: '1', type: 'text', label: 'Nome Completo', placeholder: 'Ex: João Silva', required: true },
    { id: '2', type: 'text', label: 'CPF', placeholder: '000.000.000-00', required: true },
  ]);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: type === 'text' ? 'Nova Pergunta' : type === 'choice' ? 'Múltipla Escolha' : type === 'date' ? 'Selecione a Data' : 'Anexo de Documento',
      placeholder: 'Digite aqui...',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="form-engine-wrapper">
      <div className="engine-layout">
        {/* Left Toolbar */}
        <aside className="field-palette">
          <div className="palette-section">
            <h4 className="section-title">ELEMENTOS</h4>
            <div className="palette-grid">
              <button className="palette-btn" onClick={() => addField('text')}>
                <Type size={18} />
                <span>Texto</span>
              </button>
              <button className="palette-btn" onClick={() => addField('choice')}>
                <CheckCircle2 size={18} />
                <span>Opções</span>
              </button>
              <button className="palette-btn" onClick={() => addField('date')}>
                <Calendar size={18} />
                <span>Data</span>
              </button>
              <button className="palette-btn" onClick={() => addField('file')}>
                <Upload size={18} />
                <span>Anexo</span>
              </button>
            </div>
          </div>

          <div className="palette-section mt-8">
            <h4 className="section-title">CONFIGURAÇÕES</h4>
            <div className="settings-list">
              <div className="setting-item">
                <Layout size={16} />
                <span>Layout Glass</span>
              </div>
              <div className="setting-item">
                <Globe size={16} />
                <span>Idioma: PT-BR</span>
              </div>
            </div>
          </div>

          <button className="publish-btn">
            <Share2 size={18} />
            <span>Publicar Formulário</span>
          </button>
        </aside>

        {/* Center Canvas */}
        <main className="builder-canvas">
          <div className="canvas-header">
            <h2 className="canvas-title">Requisição de Direitos (DSAR)</h2>
            <Badge variant="cyan">Módulo de Privacidade</Badge>
          </div>

          <div className="fields-list">
            {fields.map((field, index) => (
              <div key={field.id} className="field-card anim-slide-up">
                <div className="field-handle">::</div>
                <div className="field-content">
                  <input 
                    type="text" 
                    className="field-label-input" 
                    defaultValue={field.label} 
                    placeholder="Etiqueta do campo"
                  />
                  <div className="field-meta">
                    <span className="type-tag">{field.type.toUpperCase()}</span>
                    <label className="toggle-required">
                      <input type="checkbox" defaultChecked={field.required} />
                      <span>Obrigatório</span>
                    </label>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => removeField(field.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button className="add-empty" onClick={() => addField('text')}>
              <Plus size={20} />
              <span>Adicionar novo campo</span>
            </button>
          </div>
        </main>

        {/* Right Preview */}
        <aside className="live-preview">
          <div className="preview-header">
            <Eye size={16} />
            <span>PREVIEW REAL-TIME</span>
          </div>
          
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="user-view">
                <div className="form-brand">
                  <div className="logo-pulse"></div>
                  <h3>DataSync</h3>
                </div>
                <p className="form-instructions">Preencha os campos abaixo para solicitar a exclusão de seus dados pessoais.</p>
                
                <div className="preview-fields">
                  {fields.map(field => (
                    <div key={field.id} className="preview-field">
                      <label>{field.label}{field.required && '*'}</label>
                      {field.type === 'text' && <div className="p-input">{field.placeholder}</div>}
                      {field.type === 'choice' && <div className="p-select">Selecione uma opção <ChevronDown size={14} /></div>}
                      {field.type === 'date' && <div className="p-input">dd/mm/aaaa</div>}
                      {field.type === 'file' && <div className="p-upload"><Upload size={14} /> Upload de Documento</div>}
                    </div>
                  ))}
                </div>
                <button className="p-submit">Enviar Requisição</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .form-engine-wrapper {
          width: 100%;
          height: calc(100vh - 120px);
          padding: 24px;
        }

        .engine-layout {
          display: grid;
          grid-template-columns: 280px 1fr 340px;
          gap: 24px;
          height: 100%;
        }

        /* Toolbar */
        .field-palette {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .section-title {
          font-size: 0.625rem;
          color: var(--secondary);
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .palette-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--foreground);
          transition: all 0.2s;
        }

        .palette-btn:hover {
          border-color: var(--accent);
          background: rgba(0, 255, 135, 0.05);
          color: var(--accent);
        }

        .palette-btn span {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8125rem;
          color: var(--secondary);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
        }

        .publish-btn {
          margin-top: auto;
          background: var(--accent);
          color: #000;
          border: none;
          padding: 14px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 700;
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.3);
          transition: all 0.2s;
        }

        /* Canvas */
        .builder-canvas {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          overflow-y: auto;
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .canvas-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .fields-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: border-color 0.2s;
        }

        .field-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .field-handle {
          color: var(--secondary);
          cursor: grab;
          font-family: monospace;
          font-size: 1.25rem;
        }

        .field-content {
          flex: 1;
        }

        .field-label-input {
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 0.9375rem;
          font-weight: 500;
          width: 100%;
          outline: none;
          margin-bottom: 8px;
        }

        .field-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .type-tag {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .toggle-required {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--secondary);
          cursor: pointer;
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: var(--secondary);
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        .add-empty {
          border: 2px dashed var(--border);
          background: transparent;
          padding: 20px;
          border-radius: 12px;
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .add-empty:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Preview Area */
        .live-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--secondary);
          letter-spacing: 0.1em;
        }

        .phone-mockup {
          width: 340px;
          height: 640px;
          background: #111;
          border: 12px solid #222;
          border-radius: 40px;
          position: relative;
          padding: 8px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
        }

        .phone-mockup::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 24px;
          background: #222;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
        }

        .user-view {
          padding: 40px 20px;
          height: 100%;
          overflow-y: auto;
        }

        .form-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .logo-pulse {
          width: 12px;
          height: 12px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        .form-brand h3 {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .form-instructions {
          font-size: 0.8125rem;
          color: var(--secondary);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .preview-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .preview-field label {
          display: block;
          font-size: 0.75rem;
          color: var(--foreground);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .p-input, .p-select, .p-upload {
          background: #111;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.8125rem;
          color: #555;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .p-upload {
          border-style: dashed;
          background: transparent;
        }

        .p-submit {
          width: 100%;
          margin-top: 32px;
          background: var(--accent);
          color: #000;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
        }

        /* Animations */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
