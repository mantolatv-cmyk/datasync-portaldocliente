'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  action 
}) => {
  return (
    <div className={`card glass card-shine ${className}`}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>

      <style jsx>{`
        .card {
          border-radius: 16px;
          border: 1px solid var(--border);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card:hover {
          border-color: rgba(56, 189, 248, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .card-header {
          padding: 24px 24px 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .card-title {
          font-size: 1rem;
          color: var(--foreground);
          margin-bottom: 4px;
        }

        .card-subtitle {
          font-size: 0.825rem;
          color: var(--secondary);
        }

        .card-content {
          padding: 12px 24px 24px;
          flex: 1;
        }
      `}</style>
    </div>
  );
};
