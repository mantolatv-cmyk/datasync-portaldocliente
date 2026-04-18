'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Terminal } from 'lucide-react';

interface Message {
  id: number;
  role: 'bot' | 'user';
  content: string;
  time: string;
}

export const DPOCopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'bot', 
      content: 'Olá! Sou seu assistente DPO Copilot. Como posso ajudar com sua conformidade LGPD hoje?',
      time: 'Justo agora'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: 'bot',
        content: getMockResponse(inputValue),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getMockResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('lgpd')) return 'A LGPD (Lei Geral de Proteção de Dados) exige que dados pessoais sejam tratados com finalidade específica e base legal. Sua empresa está com 92% de conformidade.';
    if (q.includes('ripd')) return 'O Relatório de Impacto à Proteção de Dados (RIPD) do sistema financeiro foi assinado eletronicamente há 12 minutos. Deseja visualizar o arquivo?';
    if (q.includes('vulnerabilidade')) return 'Identifiquei 3 vulnerabilidades críticas pendentes. Recomendo iniciar a mitigação imediata no servidor de produção.';
    return 'Entendido. Estou analisando sua solicitação nos meus protocolos de privacidade para fornecer a melhor recomendação.';
  };

  return (
    <div className="copilot-root">
      {/* Floating Button */}
      <button 
        className={`copilot-fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <div className="fab-icon-container">
          <Bot size={24} />
          <div className="fab-pulse"></div>
        </div>}
      </button>

      {/* Chat Window */}
      <div className={`copilot-window ${isOpen ? 'open' : ''}`}>
        <div className="copilot-header">
          <div className="header-info">
            <div className="bot-avatar">
              <Terminal size={16} />
            </div>
            <div>
              <p className="header-title">DPO Copilot <Sparkles size={12} className="text-accent" /></p>
              <p className="header-status">Online - Protocolo de Criptografia Ativo</p>
            </div>
          </div>
          <button className="header-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              <div className="message-bubble">
                <p className="message-content">{msg.content}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-row bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Digite sua dúvida de privacidade..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-button" onClick={handleSend} disabled={!inputValue.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .copilot-root {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
        }

        .copilot-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent);
          color: #000;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.4);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .copilot-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(0, 255, 135, 0.6);
        }

        .copilot-fab.active {
          background: var(--surface);
          color: var(--accent);
          border: 1px solid var(--accent);
          transform: rotate(90deg);
        }

        .fab-icon-container {
          position: relative;
        }

        .fab-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--accent);
          border-radius: 50%;
          z-index: -1;
          animation: pulse 2s infinite ease-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .copilot-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .copilot-window.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .copilot-header {
          padding: 20px;
          background: rgba(18, 18, 18, 0.8);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px 20px 0 0;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .header-title {
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-status {
          font-size: 0.6875rem;
          color: var(--success);
        }

        .header-close {
          background: transparent;
          border: none;
          color: var(--secondary);
          cursor: pointer;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .message-row.user { justify-content: flex-end; }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
        }

        .bot .message-bubble {
          background: var(--surface-hover);
          color: var(--foreground);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--border);
        }

        .user .message-bubble {
          background: var(--accent);
          color: #000;
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }

        .message-content {
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .message-time {
          font-size: 0.625rem;
          opacity: 0.6;
          margin-top: 4px;
          display: block;
        }

        .chat-input-area {
          padding: 16px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
          background: rgba(18, 18, 18, 0.5);
          border-radius: 0 0 20px 20px;
        }

        .chat-input-area input {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          color: var(--foreground);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input-area input:focus {
          border-color: var(--accent);
        }

        .send-button {
          width: 42px;
          height: 42px;
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 10px;
          background: var(--surface-hover);
          border-radius: 12px;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @media (max-width: 480px) {
          .copilot-window {
            width: calc(100vw - 64px);
            right: 0;
          }
        }
      `}</style>
    </div>
  );
};
