'use client';
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle, 
  FileText,
  ClipboardList,
  Library,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Logo } from '../ui/Logo';

const navItems = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'mapping', label: 'Data Mapping', icon: Map },
  { id: 'forms', label: 'Formulários', icon: ClipboardList },
  { id: 'vendor', label: 'Vendor Risk', icon: ShieldCheck },
  { id: 'vulnerability', label: 'Gestão de Vulnerabilidades', icon: BarChart3 },
  { id: 'incident', label: 'Incidentes e Respostas', icon: AlertTriangle },
  { id: 'legal-vault', label: 'Vault Jurídico', icon: Library },
  { id: 'ripd', label: 'Relatórios de Impacto', icon: FileText },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Logo />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <p className="nav-label">MENU PRINCIPAL</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-group secondary">
          <p className="nav-label">SISTEMA</p>
          <button className="nav-item">
            <Settings size={20} className="nav-icon" />
            <span>Configurações</span>
          </button>
          <button className="nav-item">
            <HelpCircle size={20} className="nav-icon" />
            <span>Suporte</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">FM</div>
          <div className="user-info">
            <p className="user-name">Fernando Melo</p>
            <p className="user-role">CTO / DPO</p>
          </div>
          <button className="logout-button">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--background);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          color: var(--foreground);
        }

        .sidebar-header {
          height: var(--header-height);
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
        }

        .sidebar-nav {
          flex: 1;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          overflow-y: auto;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-label {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--secondary);
          padding-left: 12px;
          margin-bottom: 8px;
          letter-spacing: 0.1em;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: var(--secondary);
          font-size: 0.875rem;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          color: var(--foreground);
          background: var(--surface);
        }

        .nav-item.active {
          color: var(--accent);
          background: rgba(56, 189, 248, 0.1);
        }

        .nav-icon {
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--border);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent) 0%, #065f46 100%);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          box-shadow: 0 0 10px rgba(0, 255, 135, 0.3);
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.6875rem;
          color: var(--secondary);
        }

        .logout-button {
          background: transparent;
          border: none;
          color: var(--secondary);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .logout-button:hover {
          color: var(--error);
        }
      `}</style>
    </aside>
  );
};
