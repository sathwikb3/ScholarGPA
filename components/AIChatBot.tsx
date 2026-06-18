
import React, { useState, useRef, useEffect } from 'react';
import { Course, GPASettings, CalculationResult } from '../types';
import { 
  MessageSquare, X, Send, Sparkles, BrainCircuit, 
  TrendingDown, TrendingUp, Target, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GrantIcon from './GrantIcon';

interface AIChatBotProps {
  courses: Course[];
  result: CalculationResult;
  settings: GPASettings;
  activeView?: 'calculator' | 'grade' | 'admissions' | 'guide' | 'timer';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ courses, result, settings, activeView = 'calculator' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Grant, your graduation-ready Scholar Advisor. How can I help you optimize your grades today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getThemeVars = () => {
    switch(activeView) {
      case 'grade': return { bg: 'bg-[#196e1f]', shadow: 'shadow-emerald-300', lightBg: 'bg-emerald-50', lightText: 'text-[#196e1f]', ring: 'focus:ring-[#196e1f]', dot: 'bg-[#196e1f]' };
      case 'admissions': return { bg: 'bg-amber-500', shadow: 'shadow-amber-300', lightBg: 'bg-amber-50', lightText: 'text-amber-950', ring: 'focus:ring-amber-500', dot: 'bg-amber-500' };
      case 'guide': return { bg: 'bg-rose-900', shadow: 'shadow-rose-300', lightBg: 'bg-rose-50', lightText: 'text-rose-950', ring: 'focus:ring-rose-900', dot: 'bg-rose-700' };
      case 'calculator':
      default: return { bg: 'bg-blue-900', shadow: 'shadow-blue-300', lightBg: 'bg-blue-50', lightText: 'text-blue-950', ring: 'focus:ring-blue-800', dot: 'bg-blue-700' };
    }
  };
  const theme = getThemeVars();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isTyping) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const context = `
      Student Data:
      - Grade Level: ${settings.gradeLevel}th Grade
      - Intended Major: ${settings.intendedMajor || 'Undecided'}
      - Dream Schools: ${settings.dreamSchools?.join(', ') || 'Not specified'}
      - SAT/ACT: ${settings.satScore || 'N/A'} / ${settings.actScore || 'N/A'}
      - Term Weighted GPA: ${result.weightedGPA.toFixed(3)}
      - Cumulative Weighted GPA: ${result.cumulativeWeightedGPA.toFixed(3)}
      - Target GPA: ${settings.targetGPA.toFixed(3)}
      - Course List: ${courses.map(c => `${c.name} (${c.gradePercent}%, Type: ${c.type})`).join(', ')}
    `;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages, // Send history without the new message
          context,
          message: textToSend
        })
      });
      
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.text || "I couldn't process that. Please try again." }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className={`p-4 text-white flex items-center justify-between shadow-lg ${theme.bg}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl animate-bounce">
                <GrantIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Grant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-blue-100 font-medium">Grant is Thinking...</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? `${theme.bg} text-white rounded-tr-none` 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className={`w-1 h-1 rounded-full animate-bounce ${theme.dot}`}></div>
                    <div className={`w-1 h-1 rounded-full animate-bounce delay-75 ${theme.dot}`}></div>
                    <div className={`w-1 h-1 rounded-full animate-bounce delay-150 ${theme.dot}`}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-slate-100 bg-white">
            <button 
              onClick={() => sendMessage("What are my Reach, Match, and Safety schools based on my GPA and major?")}
              className={`text-[10px] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-bold ${theme.lightBg} ${theme.lightText}`}
            >
              <Sparkles size={12} /> College Strategy
            </button>
            <button 
              onClick={() => sendMessage("Am I eligible for any merit scholarships with my current GPA?")}
              className={`text-[10px] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-bold ${theme.lightBg} ${theme.lightText}`}
            >
              <Target size={12} /> Scholarships
            </button>
            <button 
              onClick={() => sendMessage("How does my GPA trend look? Is it an upward trend?")}
              className={`text-[10px] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-bold ${theme.lightBg} ${theme.lightText}`}
            >
              <TrendingUp size={12} /> Upward Trend?
            </button>
            <button 
              onClick={() => sendMessage("What classes are lowering my GPA?")}
              className={`text-[10px] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-bold ${theme.lightBg} ${theme.lightText}`}
            >
              <TrendingDown size={12} /> Lowering GPA?
            </button>
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="p-4 bg-white border-t border-slate-100 flex gap-2"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your grades..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-800 outline-none font-medium"
            />
            <button 
              type="submit"
              disabled={isTyping || !input.trim()}
              className={`p-2 text-white rounded-xl disabled:opacity-50 transition-all shadow-md ${theme.bg} ${theme.shadow} hover:opacity-90`}
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group relative ${
          isOpen ? 'bg-slate-800 text-white scale-90' : `${theme.bg} text-white hover:scale-110 ${theme.shadow}`
        }`}
      >

        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <GrantIcon size={28} className="group-hover:rotate-12 transition-transform" />
          </div>
        )}
        {!isOpen && (
          <div className="absolute right-16 bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all whitespace-nowrap pointer-events-none">
            Need advice? Ask me anything!
          </div>
        )}
      </button>
    </div>
  );
};

export default AIChatBot;
