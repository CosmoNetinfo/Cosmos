import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] bg-slate-50 relative overflow-hidden text-slate-900 flex flex-col">

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 pointer-events-none"
        style={{ backgroundImage: "url('/bg-tech.png')" }}
      />

      {/* Overlay to ensure text readability if needed (optional, keeping it subtle) */}
      <div className="absolute inset-0 z-0 bg-white/40 pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/60 h-16 flex items-center px-4 md:px-8 shadow-sm transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="relative bg-gradient-to-tr from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-md">
              <span className="font-display font-bold text-white text-xl">C</span>
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wide text-slate-800 leading-tight">COSMOS</h1>
            <p className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">Cosmonet AI Agent</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <a href="https://www.cosmonet.info/" target="_blank" rel="noopener" className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200">
            <span>Visita Cosmonet.info</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};
