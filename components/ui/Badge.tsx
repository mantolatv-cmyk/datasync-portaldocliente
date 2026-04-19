'use client';
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'crimson' | 'emerald';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'cyan', className = '', onClick }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} onClick={onClick}>
      {children}
      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .badge-cyan {
          background: rgba(0, 255, 135, 0.1);
          color: var(--accent);
          border: 1px solid rgba(0, 255, 135, 0.2);
        }

        .badge-amber {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .badge-crimson {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .badge-emerald {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </span>
  );
};
