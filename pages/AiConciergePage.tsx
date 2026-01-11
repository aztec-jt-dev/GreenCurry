
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AiMessage } from '../types';

const QUICK_PROMPTS = [
  "🍜 Best Khao Soi nearby?",
  "🚕 How to get to the Airport?",
  "🐘 Ethical Elephant Sanctuaries?",
  "🏯 Must-see temples in Old City",
  "🔑 What are the check-in hours?"
];

const AiConciergePage: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([
    { role: 'model', text: "Sawadee-kap! I'm your Green Curry Concierge. I've got the inside scoop on Chiang Mai's best-kept secrets. How can I spice up your stay today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input.trim();
    if (!userMsg || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    setGroundingLinks([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: "You are the Green Curry Concierge, a witty and expert local guide for Green Curry Hostel in Chiang Mai. Your tone is boutique, friendly, and 'spicy'. Recommend local street food, hidden bars, and temples. Use your search tool to provide up-to-date info on festivals or transport prices. Keep responses under 100 words.",
          tools: [{ googleSearch: {} }]
        }
      });

      const aiText = response.text || "I'm experiencing a bit of a spicy brain freeze. Can you ask that again?";
      
      // Extract search grounding links if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter(c => c.web)
          .map(c => ({ title: c.web!.title || 'Source', uri: c.web!.uri }));
        setGroundingLinks(links);
      }

      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, the Chiang Mai markets are too noisy right now. Try again in a moment!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col h-[75vh] animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-3">
          <span className="text-gc-green">AI</span> CONCIERGE
        </h1>
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em] italic">Your Boutique Local Wisdom Engine</p>
      </div>

      <div className="flex-grow bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl relative">
        {/* Messages area */}
        <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-xl border ${
                m.role === 'user' 
                ? 'bg-gc-green text-gc-dark rounded-tr-none border-gc-green/20' 
                : 'bg-white/10 text-white rounded-tl-none border-white/5'
              }`}>
                {m.text}
                
                {m.role === 'model' && i === messages.length - 1 && groundingLinks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                    <p className="w-full text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">Local Sources:</p>
                    {groundingLinks.map((link, idx) => (
                      <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-gc-green transition-colors">
                        <i className="fa-solid fa-link mr-1"></i> {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 p-5 rounded-[2rem] rounded-tl-none border border-white/5">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gc-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gc-orange rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gc-red rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input area */}
        <div className="p-6 border-t border-white/10 bg-black/30 backdrop-blur-md">
          {/* Quick Prompts */}
          <div className="flex overflow-x-auto gap-3 pb-6 mb-6 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gc-green hover:border-gc-green hover:bg-gc-green/5 transition-all active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <input 
              type="text" 
              className="flex-grow bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm outline-none focus:ring-2 ring-gc-green transition-all shadow-inner"
              placeholder="Where is the best Khao Soi nearby?..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-gc-green text-gc-dark w-16 h-16 rounded-[1.5rem] flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-[0_10px_30px_rgba(142,198,63,0.3)] disabled:opacity-20 disabled:scale-100"
            >
              <i className="fa-solid fa-paper-plane text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiConciergePage;
