import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  // Helper to process text for basic formatting (bolding), newlines, and removing citation artifacts
  const renderText = (text: string) => {
    // Defensive coding: Remove any [cite: ...] or [source] artifacts that might slip through
    const cleanText = text.replace(/\[cite:[\d,\s]+\]/g, '').replace(/\[source:.*?\]/g, '');

    return cleanText.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split('**').map((part, j) => 
          j % 2 === 1 ? <strong key={j} className="text-cosmos-accent font-semibold">{part}</strong> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[60%] flex flex-col ${isModel ? 'items-start' : 'items-end'}`}>
        
        {/* Avatar / Name */}
        <div className="flex items-center mb-1 space-x-2">
          {isModel ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-xs font-bold text-white font-display">C</span>
              </div>
              <span className="text-sm font-display text-indigo-300">Cosmos</span>
            </>
          ) : (
            <span className="text-sm font-display text-slate-400">Tu</span>
          )}
        </div>

        {/* Bubble */}
        <div 
          className={`
            p-4 rounded-2xl shadow-md backdrop-blur-sm border
            ${isModel 
              ? 'bg-cosmos-800/80 border-cosmos-700 text-slate-200 rounded-tl-none' 
              : 'bg-cosmos-accent/10 border-cosmos-accent/20 text-sky-100 rounded-tr-none'
            }
          `}
        >
          <div className="text-sm md:text-base leading-relaxed">
            {renderText(message.text)}
          </div>
        </div>

        {/* Grounding Sources (Only for Model) */}
        {isModel && message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/5 w-full">
            <p className="text-xs text-slate-400 font-semibold mb-2 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Fonti Trovate (Cosmonet.info):
            </p>
            <div className="flex flex-wrap gap-2">
              {message.groundingSources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-cosmos-accent px-2 py-1 rounded transition-colors truncate max-w-[200px]"
                >
                  {source.title || 'Link Articolo'}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamp */}
        <span className="text-[10px] text-slate-500 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};