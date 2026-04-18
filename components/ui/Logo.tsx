'use client';
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <div className="logo-pulse"></div>
        <div className="logo-core"></div>
      </div>
      <span className="logo-text">
        DATA<span className="logo-highlight">SYNC</span>
      </span>
      
      <style jsx>{`
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          user-select: none;
        }

        .logo-icon {
          position: relative;
          width: 32px;
          height: 32px;
        }

        .logo-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--accent);
          border-radius: 8px;
          opacity: 0.2;
          animation: pulse 2s infinite ease-in-out;
          box-shadow: 0 0 20px var(--accent);
        }

        .logo-core {
          position: absolute;
          top: 25%;
          left: 25%;
          width: 50%;
          height: 50%;
          background: var(--accent);
          border-radius: 4px;
          box-shadow: 0 0 30px var(--accent);
        }

        .logo-text {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--foreground);
          letter-spacing: 0.05em;
        }

        .logo-highlight {
          color: var(--accent);
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};
