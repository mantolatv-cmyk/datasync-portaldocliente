'use client';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SideSheet: React.FC<SideSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div className={`sidesheet-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div 
        className={`sidesheet-content ${isOpen ? 'slide-in' : 'slide-out'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={onAnimationEnd}
      >
        <div className="sidesheet-header">
          <h2 className="sidesheet-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="sidesheet-body">
          {children}
        </div>
      </div>

      <style jsx>{`
        .sidesheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .sidesheet-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .sidesheet-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 420px;
          height: 100%;
          background: rgba(18, 18, 18, 0.95);
          backdrop-filter: blur(12px);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8);
        }

        .sidesheet-header {
          padding: 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidesheet-title {
          font-size: 1.25rem;
          color: var(--foreground);
        }

        .close-button {
          background: transparent;
          border: none;
          color: var(--secondary);
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: var(--foreground);
        }

        .sidesheet-body {
          padding: 24px;
          flex: 1;
          overflow-y: auto;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }

        .slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .slide-out {
          animation: slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 640px) {
          .sidesheet-content {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
