'use client';
import React from 'react';
import { 
  Bell, 
  X, 
  ShieldAlert, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'incident' | 'dsar' | 'vendor' | 'security';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'incident': return <AlertTriangle size={16} className="text-error" />;
      case 'dsar': return <UserPlus size={16} className="text-cyan" />;
      case 'vendor': return <ShieldAlert size={16} className="text-warning" />;
      case 'security': return <CheckCircle2 size={16} className="text-accent" />;
    }
  };

  return (
    <div className="notification-dropdown glass anim-slide-down">
      <div className="dropdown-header">
        <div className="header-title">
          <Bell size={18} className="text-secondary" />
          <span>Alertas de Conformidade</span>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="unread-badge">{notifications.filter(n => !n.isRead).length}</span>
          )}
        </div>
        <div className="header-actions">
          <button className="text-btn" onClick={onClearAll}>Limpar tudo</button>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} className="empty-icon" />
            <p>Nenhuma notificação por aqui</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
              onClick={() => onMarkRead(n.id)}
            >
              <div className="item-icon-wrapper">
                {getIcon(n.type)}
                {!n.isRead && <span className="unread-dot"></span>}
              </div>
              <div className="item-content">
                <div className="item-header">
                  <span className="item-title">{n.title}</span>
                  <span className="item-time">{n.time}</span>
                </div>
                <p className="item-message">{n.message}</p>
                <div className="item-footer">
                  <button className="action-link">Ver detalhes <ExternalLink size={12} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dropdown-footer">
        <button className="full-width-btn">Ver Todos os Alertas</button>
      </div>

      <style jsx>{`
        .notification-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 380px;
          max-height: 500px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--border);
          border-radius: 16px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .dropdown-header {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          color: #FFF;
        }

        .unread-badge {
          background: var(--error);
          color: #FFF;
          font-size: 0.625rem;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .header-actions { display: flex; align-items: center; gap: 12px; }
        .text-btn { background: transparent; border: none; font-size: 0.75rem; color: var(--accent); cursor: pointer; font-weight: 600; }
        .icon-btn { background: transparent; border: none; color: var(--secondary); cursor: pointer; display: flex; }

        .notification-list {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .notification-list::-webkit-scrollbar { display: none; }

        .notification-item {
          padding: 16px 20px;
          display: flex;
          gap: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
        }

        .notification-item.unread { background: rgba(0, 255, 135, 0.02); }
        .notification-item:hover { background: rgba(255, 255, 255, 0.03); }

        .item-icon-wrapper {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .unread-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent);
        }

        .item-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .item-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .item-title { font-weight: 700; font-size: 0.8125rem; color: #FFF; }
        .item-time { font-size: 0.6875rem; color: var(--secondary); }
        .item-message { font-size: 0.75rem; color: var(--secondary); line-height: 1.4; }
        
        .item-footer { margin-top: 4px; }
        .action-link { background: transparent; border: none; color: var(--accent); font-size: 0.6875rem; font-weight: 700; display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 0; }

        .dropdown-footer { padding: 12px 20px; background: rgba(0, 0, 0, 0.2); }
        .full-width-btn { width: 100%; padding: 10px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--secondary); font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .full-width-btn:hover { background: rgba(255, 255, 255, 0.08); color: #FFF; }

        .empty-state { padding: 40px 20px; text-align: center; color: var(--secondary); }
        .empty-icon { opacity: 0.1; margin-bottom: 12px; }

        .text-error { color: #FF4757; }
        .text-cyan { color: #00D2FF; }
        .text-warning { color: #FFA502; }
        .text-accent { color: var(--accent); }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-slide-down { animation: slideDown 0.3s ease-out; }

        @media (max-width: 480px) {
          .notification-dropdown {
            position: fixed;
            top: var(--header-height);
            left: 0;
            width: 100vw;
            height: calc(100vh - var(--header-height));
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </div>
  );
};
