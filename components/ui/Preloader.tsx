'use client';
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

export const Preloader: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Initializing PrivacyOps Core...');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const textSequence = [
      'Synchronizing Data Mapping...',
      'Loading Compliance Heatmaps...',
      'Securing Document Vault...',
      'Applying Glassmorphism Styles...',
      'System Ready.'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < textSequence.length) {
        setLoadingText(textSequence[current]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="preloader-overlay">
      <div className="scanline-global"></div>
      
      <div className="loader-content">
        <div className="logo-pulse">
          <Logo />
        </div>
        
        <div className="terminal-log">
          <span className="cursor">&gt;</span>
          <span className="text">{loadingText}{dots}</span>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill"></div>
        </div>
      </div>

      <style jsx>{`
        .preloader-overlay {
          color: var(--accent);
          font-family: var(--font-jetbrains), monospace;
          background: #000; /* Fallback */
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          animation: terminalFade 0.6s ease-out forwards;
        }

        .logo-pulse {
          animation: pulse 2s infinite ease-in-out;
          transform-origin: center;
          scale: 1.5;
          margin-bottom: 20px;
        }

        .terminal-log {
          display: flex;
          gap: 12px;
          font-size: 0.8125rem;
          height: 20px;
          min-width: 300px;
          justify-content: center;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .cursor {
          font-weight: 800;
        }

        .progress-bar-container {
          width: 240px;
          height: 2px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--accent);
          width: 0%;
          animation: fillProgress 1.8s cubic-bezier(0.1, 0, 0.4, 1) forwards;
          box-shadow: 0 0 10px var(--accent);
        }

        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1) drop-shadow(0 0 5px rgba(0, 255, 135, 0.3)); }
          50% { opacity: 0.7; transform: scale(1.05); filter: brightness(1.2) drop-shadow(0 0 15px rgba(0, 255, 135, 0.6)); }
        }
      `}</style>
    </div>
  );
};
