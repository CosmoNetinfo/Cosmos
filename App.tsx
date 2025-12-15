import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatMessage } from './components/ChatMessage';
import { sendMessageToCosmos, initializeChat } from './services/groqService';
import { Message } from './types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session on mount
    initializeChat().catch(console.error);

    // Initial greeting
    setMessages([
      {
        id: generateId(),
        role: 'model',
        text: 'Ciao! Sono **Cosmos**. Ho letto tutti gli articoli di Cosmonet.info e sono pronto ad aiutarti.\n\nChiedimi pure qualsiasi cosa su Tecnologia, Open Source, AI o Gaming trattata nel blog!',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageToCosmos(text);

      const botMsg: Message = {
        id: generateId(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        groundingSources: response.sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Cosmos Error:", err);
      // Show more specific error if available
      const errorMessage = err.message || JSON.stringify(err) || "Si è verificato un errore generico.";
      setError(`Errore: ${errorMessage}. Controlla la console per i dettagli.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full relative">

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pt-24 pb-4 px-4 md:px-6 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex w-full justify-start mb-6 animate-fade-in-up">
              <div className="flex items-center space-x-2 p-4 bg-cosmos-800/80 border border-cosmos-700/50 rounded-2xl rounded-tl-none shadow-lg backdrop-blur-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-xs text-indigo-300 ml-2 font-medium tracking-wide">Cosmos sta pensando...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-900/40 border border-red-500/30 text-red-200 text-sm mb-4 flex items-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Suggested Questions (Only show when few messages or user might need help) */}
          {messages.length < 3 && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 opacity-80 transition-opacity duration-500 hover:opacity-100">
              <button onClick={() => handleSend("Quali sono gli ultimi articoli pubblicati?")} className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group">
                <span className="block text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">News</span>
                <span className="text-slate-300 text-sm">Quali sono gli ultimi articoli?</span>
              </button>
              <button onClick={() => handleSend("Parlami della sezione Linux")} className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group">
                <span className="block text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">Linux</span>
                <span className="text-slate-300 text-sm">Cosa trovo nella sezione Linux?</span>
              </button>
              <button onClick={() => handleSend("Ci sono guide sull'Intelligenza Artificiale?")} className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group">
                <span className="block text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">AI & Tech</span>
                <span className="text-slate-300 text-sm">Guide sull'Intelligenza Artificiale?</span>
              </button>
              <button onClick={() => handleSend("News sul Gaming?")} className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group">
                <span className="block text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">Gaming</span>
                <span className="text-slate-300 text-sm">Ultime novità sul Gaming?</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-cosmos-900 via-cosmos-900/95 to-transparent z-20">
          <div className="relative flex items-center max-w-4xl mx-auto shadow-2xl shadow-indigo-900/20 rounded-2xl bg-cosmos-800/50 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all backdrop-blur-xl">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Chiedi a Cosmos..."
              rows={1}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 rounded-2xl pl-5 pr-14 py-4 focus:outline-none resize-none overflow-hidden min-h-[56px] max-h-32"
              style={{ height: 'auto' }}
            // Auto-resize logic could be added here or via a ref, but strict rows=1 + overflow-hidden keeps it simple for now or let it scroll. 
            // Better: standard textarea behavior
            />
            <button
              onClick={() => handleSend(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700/50 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-95 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-3 font-medium tracking-wide">
            Cosmos è potenziato da Groq AI (Llama 3) • Cerca su <span className="text-indigo-400">Cosmonet.info</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default App;