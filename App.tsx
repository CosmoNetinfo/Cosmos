import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatMessage } from './components/ChatMessage';
import { sendMessageToCosmos, initializeChat } from './services/geminiService';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid'; // Simulating uuid if not available, usually requires package. We will use random string.

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
      setError("Si è verificato un errore durante la connessione a Cosmos. Riprova più tardi.");
      console.error(err);
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
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex w-full justify-start mb-6">
              <div className="flex items-center space-x-2 p-4 bg-cosmos-800/80 border border-cosmos-700 rounded-2xl rounded-tl-none">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                <span className="text-xs text-indigo-300 ml-2">Cosmos sta consultando gli articoli del blog...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 rounded-lg bg-red-900/50 border border-red-700/50 text-red-200 text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-cosmos-900/50 backdrop-blur-md">
          <div className="relative flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Chiedi qualcosa su un articolo..."
              rows={1}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none overflow-hidden"
              style={{ minHeight: '56px' }}
            />
            <button
              onClick={() => handleSend(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2">
            Cosmos cerca le informazioni direttamente su Cosmonet.info
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default App;