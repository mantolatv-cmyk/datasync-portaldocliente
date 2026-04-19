'use client';
import React from 'react';
import { ShieldCheck, AlertCircle, Bell, Search, Menu, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { NotificationCenter, Notification } from '../dashboard/NotificationCenter';

interface HeaderProps {
  onMenuClick?: () => void;
  onCopilotClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onCopilotClick }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([
    { id: '1', type: 'incident', title: 'Incidente Crítico', message: 'Vulnerabilidade extrema detectada no banco de dados principal.', time: 'há 10 min', isRead: false },
    { id: '2', type: 'dsar', title: 'Novo Pedido de Titular', message: 'Requisição REQ-082 de Exercício de Direito (Retificação).', time: 'há 1h', isRead: false },
    { id: '3', type: 'vendor', title: 'Risco de Fornecedor', message: 'AWS Brazil: DPA pendente de assinatura renovada.', time: 'há 5h', isRead: true },
    { id: '4', type: 'security', title: 'Monitoramento Ativo', message: 'Scan semanal concluído com 92% de conformidade.', time: 'há 1 dia', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
  };

  return (
    <header className="header glass">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="search-bar desktop-only">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Pesquisar ativos, fornecedores ou RIPDs..." />
        </div>
      </div>

      <div className="header-right">
        <div className="compliance-status desktop-only">
          <ShieldCheck size={20} className="status-icon" />
          <div className="status-info">
            <span className="status-label">Conformidade LGPD:</span>
            <span className="status-value">92%</span>
          </div>
          <Badge variant="cyan">Risco Baixo</Badge>
        </div>

        <div className="vertical-divider desktop-only"></div>

        <button className="icon-button spark-ai" onClick={onCopilotClick} title="Abrir Privacy Copilot">
          <Sparkles size={22} className="text-accent" />
          <span className="spark-glow"></span>
        </button>

        <div className="notification-wrapper">
          <button 
            className="icon-button notification" 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            title="Ver Notificações"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
          
          <NotificationCenter 
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkRead={markRead}
            onClearAll={clearAll}
          />
        </div>

        <button className="cta-button">
          <AlertCircle size={18} />
          <span className="desktop-only">Reportar Incidente</span>
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

        .notification-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-dot {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 14px;
          height: 14px;
          background: var(--error);
          border-radius: 7px;
          border: 1.5px solid var(--background);
          color: #FFF;
          font-size: 0.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
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

        .spark-ai {
          position: relative;
          color: var(--accent);
        }

        .spark-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--accent);
          filter: blur(15px);
          opacity: 0.15;
          border-radius: 50%;
          z-index: -1;
          animation: pulse 2s infinite;
        }

        .text-accent { color: var(--accent); }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.25; }
          100% { transform: scale(0.9); opacity: 0.1; }
        }

        @media (max-width: 1024px) {
          .header { padding: 0 16px; }
          .desktop-only { display: none !important; }
          .mobile-menu-btn {
            display: flex;
            background: transparent;
            border: none;
            color: var(--foreground);
            cursor: pointer;
          }
        }

        @media (min-width: 1025px) {
          .mobile-menu-btn { display: none; }
        }
      `}</style>
    </header>
  );
};
