
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AiMessage } from '../types';

const QUICK_PROMPTS = [
  "🍜 Best Khao Soi nearby?",
  "🚕 How to get to the Airport?",
  "🐘 Ethical Elephant Sanctuaries?",
  "🏯 Must-see temples in Old City",
  "🔑 What are the check-in hours?"
];

interface ChatMessage extends AiMessage {
  timestamp: string;
  links?: { title: string; uri: string }[];
}

const AiConciergePage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Sawadee-kap! I'm your Green Curry Concierge. I've got the inside scoop on Chiang Mai's best-kept secrets. How can I spice up your stay today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input.trim();
    if (!userMsg || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: currentTime }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Use the Chat API for better context management
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are the Green Curry Concierge, a witty and expert local guide for Green Curry Hostel in Chiang Mai. Your tone is boutique, friendly, and 'spicy'. Recommend local street food, hidden bars, and temples. Use your search tool to provide up-to-date info on festivals or transport prices. Keep responses under 100 words.",
          tools: [{ googleSearch: {} }]
        },
        // Reconstruct history for the session
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMsg });
      const response = result as GenerateContentResponse;
      
      const aiText = response.text || "I'm experiencing a bit of a spicy brain freeze. Can you ask that again?";
      
      // Extract search grounding links
      let links: { title: string; uri: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        links = chunks
          .filter(c => c.web)
          .map(c => ({ title: c.web!.title || 'Source', uri: c.web!.uri }));
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiText, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: links.length > 0 ? links : undefined
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Sorry, the Chiang Mai markets are too noisy right now. Try again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Start a fresh conversation?")) {
      setMessages([{ 
        role: 'model', 
        text: "Sawadee-kap! Ready for a fresh start. How else can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col px-4 py-6 animate-in fade-in duration-700">
      {/* Header Profile Section */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 border border-white/20 shadow-lg">
              <img src="green-curry-hostel-logo.png" alt="Avatar" className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gc-green rounded-full border-4 border-gc-dark animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-lg font-black italic tracking-tighter uppercase leading-none">Green Curry Concierge</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gc-green mt-1">Online & Spiced</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-gc-red transition-colors p-2"
          title="Clear Conversation"
        >
          <i className="fa-solid fa-trash-can text-lg"></i>
        </button>
      </div>

      {/* Chat Messages Body */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-6 pr-2 mb-4 scroll-smooth no-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`group relative max-w-[85%] px-6 py-4 rounded-[2rem] shadow-2xl border ${
              m.role === 'user' 
              ? 'bg-gc-green text-gc-dark rounded-tr-none border-gc-green/20' 
              : 'bg-white/5 text-white/90 rounded-tl-none border-white/10 backdrop-blur-md'
            }`}>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
              
              {/* Grounding Links UI */}
              {m.links && m.links.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Verified Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {m.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-white/5 hover:bg-gc-green/20 px-3 py-1.5 rounded-full border border-white/5 transition-all text-[10px] font-bold"
                      >
                        <i className="fa-solid fa-earth-asia text-gc-green"></i>
                        <span className="truncate max-w-[120px]">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] font-black opacity-20 uppercase tracking-tighter mt-2 mx-4">
              {m.timestamp}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[2rem] rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-1.5 h-1.5 bg-gc-green rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gc-orange rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-gc-red rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input & Interaction Footer */}
      <div className="mt-auto">
        {/* Chips / Quick Prompts */}
        <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gc-green hover:border-gc-green/30 hover:bg-gc-green/5 transition-all active:scale-95 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center gap-3">
          <input 
            type="text" 
            className="flex-grow bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-5 text-sm outline-none focus:ring-2 ring-gc-green/30 transition-all placeholder:text-white/20 shadow-inner"
            placeholder="Type your spicy request..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl disabled:opacity-20 ${
              input.trim() ? 'bg-gc-green text-gc-dark scale-100 hover:scale-105 active:scale-95' : 'bg-white/10 text-white/40 scale-95'
            }`}
          >
            <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : 'fa-paper-plane'} text-xl`}></i>
          </button>
        </div>
        <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] opacity-10 mt-4">
          Powered by Gemini Intelligence &bull; Green Curry Hostel Chiang Mai
        </p>
      </div>
    </div>
  );
};

export default AiConciergePage;
