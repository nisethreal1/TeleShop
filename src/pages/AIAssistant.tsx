import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Send, User, Bot, Loader2, ArrowRight } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIAssistant() {
  const { phones: storePhones } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: "Hi! I'm your TeleShop AI Assistant. I can help you find the perfect phone, compare specifications, or answer questions about our inventory. What are you looking for today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build a system instruction containing our current phone inventory context
      const inventoryContext = storePhones.map(p => 
        `- ${p.brand} ${p.model}: $${p.price}. Features: ${p.features.join(', ')}. ${p.badges?.includes('Flash Sale') ? '(Currently on Flash Sale)' : ''}`
      ).join('\n');

      const systemInstruction = `You are a helpful and knowledgeable sales assistant for TeleShop, an eCommerce store selling smartphones.
Your goal is to help customers find the best phone according to their needs (e.g. budget, camera quality, gaming performance).
Be concise, polite, and enthusiastically recommend phones.
Format your responses using clean markdown (bold, lists).
Always include prices when recommending a specific phone.
Only recommend phones from our current inventory.

CURRENT INVENTORY:
${inventoryContext}`;

      // Call Gemini API
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => m.role === 'user' ? m.content : `Assistant: ${m.content}`),
          userMessage
        ].join('\n\n'),
        config: {
          systemInstruction,
        }
      });

      const responseText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', content: responseText }]);

    } catch (error) {
      console.error("Error communicating with Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What's the best phone under $1000 for taking photos?",
    "Do you have any phones on sale right now?",
    "I need a phone with a large battery for gaming.",
    "Compare the Pixel 8 Pro and Galaxy S24 Ultra."
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="block pt-8 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white mb-4 shadow-xl shadow-accent/20">
          <Sparkles size={32} />
        </div>
        <h1 className="font-serif text-4xl mb-2">AI Phone Expert</h1>
        <p className="text-ink/60 font-sans">Ask anything to find your perfect match.</p>
      </div>

      <div className="flex-1 bg-white border border-ink/10 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-paper/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-ink text-white' : 'bg-accent/10 text-accent'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </div>
                
                <div className={`p-5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-ink text-white rounded-tr-none' 
                    : 'bg-white border border-ink/5 rounded-tl-none pr-8'
                }`}>
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                    {/* Basic markdown parsing to handle bolding and newlines */}
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
                      }
                      const boldParts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {boldParts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j}>{part.slice(2, -2)}</strong>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-4 flex-row">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 bg-accent/10 text-accent">
                  <Sparkles size={18} />
                </div>
                <div className="p-5 rounded-2xl bg-white border border-ink/5 rounded-tl-none flex items-center h-[60px]">
                  <Loader2 className="animate-spin text-accent" size={20} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-ink/10">
          {messages.length === 1 && (
            <div className="mb-4 flex gap-2 flex-wrap px-2">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      const button = document.getElementById('send-button');
                      button?.click();
                    }, 50);
                  }}
                  className="text-xs border border-ink/10 bg-paper hover:bg-ink/5 px-3 py-1.5 rounded-full transition-colors text-ink/70"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex items-center">
            <textarea
              id="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here (Press Enter to send)..."
              className="w-full bg-paper border border-ink/10 rounded-full py-4 pl-6 pr-14 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 resize-none h-14 font-sans text-sm"
              rows={1}
            />
            <button 
              id="send-button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-accent text-white rounded-full hover:bg-accent/90 disabled:opacity-50 disabled:hover:bg-accent transition-colors"
            >
              <Send size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
