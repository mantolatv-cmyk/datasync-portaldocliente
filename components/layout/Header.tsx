'use client';
import React from 'react';
import { ShieldCheck, AlertCircle, Bell, Search } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Header: React.FC = () => {
  return (
    <header className="header glass">
      <div className="header-left">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Pesquisar ativos, fornecedores ou RIPDs..." />
        </div>
      </div>

      <div className="header-right">
        <div className="compliance-status">
          <ShieldCheck size={20} className="status-icon" />
          <div className="status-info">
            <span className="status-label">Conformidade LGPD:</span>
            <span className="status-value">92%</span>
          </div>
          <Badge variant="cyan">Risco Baixo</Badge>
        </div>

        <div className="vertical-divider"></div>

        <button className="icon-button notification">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button className="cta-button">
          <AlertCircle size={18} />
          <span>Reportar Incidente</span>
        </button>
      </div>

      <style jsx>{`
        .header {
          height: var(--header-height);
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          flex: 1;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border);
          padding: 0 16px;
          border-radius: 12px;
          width: 400px;
          height: 44px;
          transition: border-color 0.2s;
        }

        .search-bar:focus-within {
          border-color: var(--accent);
        }

        .search-icon {
          color: var(--secondary);
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: var(--foreground);
          font-size: 0.875rem;
          width: 100%;
          outline: none;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .compliance-status {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 255, 135, 0.05);
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid rgba(0, 255, 135, 0.1);
        }

        .status-icon {
          color: var(--accent);
        }

        .status-info {
          display: flex;
          flex-direction: column;
        }

        .status-label {
          font-size: 0.625rem;
          color: var(--secondary);
          text-transform: uppercase;
          font-weight: 600;
        }

        .status-value {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .vertical-divider {
          width: 1px;
          height: 32px;
          background: var(--border);
        }

        .icon-button {
          background: transparent;
          border: none;
          color: var(--secondary);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .icon-button:hover {
          color: var(--foreground);
        }

        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: var(--error);
          border-radius: 50%;
          border: 2px solid var(--background);
        }

        .cta-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--error);
          color: var(--error);
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .cta-button:hover {
          background: var(--error);
          color: white;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 1024px) {
          .search-bar { width: 200px; }
        }
      `}</style>
    </header>
  );
};
