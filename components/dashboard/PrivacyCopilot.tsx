'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Send, 
  Sparkles, 
  X, 
  Bot, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle,
  History,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface PrivacyCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyCopilot: React.FC<PrivacyCopilotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Eu sou o seu Privacy Copilot. Posso te ajudar com dúvidas sobre a LGPD, analisar riscos de fornecedores ou resumir seus ativos de dados. Como posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const suggestions = [
    "Qual meu maior risco de fornecedor?",
    "Resuma meus pedidos de titulares",
    "Quantos ativos têm dados sensíveis?"
  ];

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // AI Simulation logic
    setTimeout(() => {
      let reply = "Desculpe, ainda estou processando essa informação. Poderia ser mais específico?";
      const lowerText = text.toLowerCase();

      if (lowerText.includes('risco') || lowerText.includes('fornecedor')) {
        reply = "Analisando seu Vendor Risk... O fornecedor 'AWS Brazil' está em revisão devido à falta de certificação SOC2. Recomendo verificar o Vault Jurídico para o aditivo de DPA.";
      } else if (lowerText.includes('titular') || lowerText.includes('pedido') || lowerText.includes('sla')) {
        reply = "Você tem 12 pedidos de titulares ativos. 3 deles ('REQ-082', 'REQ-079') estão com SLA crítico (menos de 2 dias). Já verifiquei a identidade de 94% dos solicitantes.";
      } else if (lowerText.includes('sensível') || lowerText.includes('ativo')) {
        reply = "Atualmente você mapeou 5 atividades principais. 40% delas (Folha de Pagamento e Controle de Acesso) processam dados sensíveis como saúde e biometria.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <div className={`copilot-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`copilot-drawer ${isOpen ? 'open' : ''}`}>
        <div className="copilot-header">
          <div className="ai-brand">
            <div className="ai-icon">
              <Sparkles size={20} className="text-accent" />
            </div>
            <div className="ai-info">
              <span className="ai-name">Privacy Copilot</span>
              <span className="ai-status">Online e treinado</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              <div className="message-icon">
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="message-bubble glass">
                <p className="message-content">{msg.content}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="copilot-footer">
          <div className="suggestions-ribbon">
            {suggestions.map((s, idx) => (
              <button key={idx} className="suggestion-chip" onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="input-area glass">
            <input 
              type="text" 
              placeholder="Pergunte ao Copilot..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={() => handleSend()}>
              <Send size={18} />
            </button>
          </div>
          <p className="copilot-disclaimer">
            <Info size={12} /> A IA pode cometer erros. Revise informações críticas.
          </p>
        </div>

        <style jsx>{`
          .copilot-drawer {
            position: fixed;
            right: 0;
            top: 0;
            width: 420px;
            height: 100vh;
            background: var(--background);
            border-left: 1px solid var(--border);
            z-index: 1100;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
          }

          .copilot-drawer.open { transform: translateX(0); }

          .copilot-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1090;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }

          .copilot-overlay.active { opacity: 1; pointer-events: auto; }

          .copilot-header {
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.02);
          }

          .ai-brand { display: flex; align-items: center; gap: 12px; }
          .ai-icon {
            width: 40px;
            height: 40px;
            background: rgba(0, 255, 135, 0.1);
            border: 1px solid var(--accent);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(0, 255, 135, 0.1);
          }

          .ai-name { display: block; font-weight: 700; color: #FFF; font-size: 1rem; }
          .ai-status { display: block; font-size: 0.6875rem; color: var(--accent); font-weight: 600; }

          .close-btn { background: transparent; border: none; color: var(--secondary); cursor: pointer; transition: color 0.2s; }
          .close-btn:hover { color: #FFF; }

          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .message-wrapper { display: flex; gap: 12px; max-width: 90%; }
          .message-wrapper.user { flex-direction: row-reverse; align-self: flex-end; }

          .message-icon {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            background: var(--surface);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--secondary);
            flex-shrink: 0;
          }

          .message-wrapper.assistant .message-icon { background: rgba(0, 255, 135, 0.1); color: var(--accent); border: 1px solid rgba(0, 255, 135, 0.2); }

          .message-bubble {
            padding: 12px 16px;
            border-radius: 14px;
            position: relative;
          }

          .message-wrapper.assistant .message-bubble { border-top-left-radius: 4px; background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border); }
          .message-wrapper.user .message-bubble { border-top-right-radius: 4px; background: var(--accent); color: #000; border: none; }

          .message-content { font-size: 0.875rem; line-height: 1.5; margin-bottom: 4px; }
          .message-time { font-size: 0.625rem; opacity: 0.6; display: block; text-align: right; }

          .typing-indicator { display: flex; gap: 4px; padding: 12px 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; width: fit-content; }
          .typing-indicator span { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; opacity: 0.4; animation: typing 1.4s infinite; }
          .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
          .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-4px); opacity: 1; } }

          .copilot-footer { padding: 24px; border-top: 1px solid var(--border); background: rgba(0, 0, 0, 0.2); }

          .suggestions-ribbon { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 12px; scrollbar-width: none; }
          .suggestions-ribbon::-webkit-scrollbar { display: none; }

          .suggestion-chip {
            white-space: nowrap;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--secondary);
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .suggestion-chip:hover { background: rgba(255, 255, 255, 0.1); color: #FFF; border-color: var(--secondary); }

          .input-area {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 4px 4px 4px 16px;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid var(--border);
            border-radius: 12px;
          }

          .input-area:focus-within { border-color: var(--accent); }

          .input-area input {
            flex: 1;
            background: transparent;
            border: none;
            color: #FFF;
            font-size: 0.875rem;
            outline: none;
            padding: 10px 0;
          }

          .send-btn {
            width: 36px;
            height: 36px;
            background: var(--accent);
            border: none;
            border-radius: 8px;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .send-btn:hover { transform: scale(1.05); }

          .copilot-disclaimer {
            margin-top: 12px;
            font-size: 0.625rem;
            color: var(--secondary);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          }

          .text-accent { color: var(--accent); }

          @media (max-width: 480px) {
            .copilot-drawer { width: 100vw; }
          }
        `}</style>
      </aside>
    </>
  );
};
