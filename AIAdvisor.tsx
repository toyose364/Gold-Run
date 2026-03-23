import React, { useState, useRef, useEffect } from 'react';
import { UserData, InvestmentPlan, ChatMessage } from '../types';
import { generateInvestmentAdvice } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2, ArrowLeft } from 'lucide-react';

interface AIAdvisorProps {
  userData: UserData;
  plans: InvestmentPlan[];
  onBack?: () => void;
  showBack?: boolean;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ userData, plans, onBack, showBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Lumina AI financial analyst. I can help you analyze market trends, explain investment concepts, or review your current portfolio. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call Gemini Service
      const responseText = await generateInvestmentAdvice(
        userMsg.text, 
        userData, 
        plans
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col animate-fade-in pb-4">
      {showBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white font-black hover:text-brand-primary transition-colors mb-2 group w-fit"
        >
          <ArrowLeft className="w-5 h-5 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      )}

      <header className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="text-brand-primary w-6 h-6" />
          AI Investment Advisor
        </h1>
        <p className="text-slate-400">Powered by Google Gemini models.</p>
      </header>

      {/* Chat Container */}
      <div className="flex-1 bg-dark-surface rounded-2xl border border-dark-border flex flex-col overflow-hidden shadow-2xl">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'model' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-slate-800 text-slate-300'}
              `}>
                {msg.role === 'model' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={`
                max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'model' 
                  ? 'bg-dark-bg border border-dark-border text-slate-300 rounded-tl-none' 
                  : 'bg-brand-primary text-white rounded-tr-none shadow-lg'
                }
              `}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
                <span className="block mt-2 text-xs opacity-50">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-dark-bg border border-dark-border rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                <span className="text-sm text-slate-400">Analyzing market data...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-dark-border bg-dark-surface">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for investment advice, market trends, or portfolio analysis..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl pl-4 pr-12 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-brand-primary transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-xs text-slate-600 mt-2">
            AI can make mistakes. Please verify important financial information.
          </p>
        </div>
      </div>
    </div>
  );
};