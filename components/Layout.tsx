import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] bg-cosmos-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-cosmos-900 to-cosmos-900 relative overflow-hidden text-slate-200 flex flex-col">

      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header - Fixed to create glass effect over scrolling content */}
      <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-md bg-cosmos-900/70 border-b border-white/5 h-16 flex items-center px-4 md:px-8 shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-indigo-500 blur opacity-50 rounded-full group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-tr from-indigo-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 border border-white/10">
              <span className="font-display font-bold text-white text-xl">C</span>
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wide text-white leading-tight">COSMOS</h1>
            <p className="text-[10px] text-indigo-300 font-medium tracking-wider uppercase">Cosmonet AI Agent</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <a href="https://www.cosmonet.info/" target="_blank" rel="noopener" className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
            <span>Visita Cosmonet.info</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </header>

      {/* Main Content - Full height, handling padding internally or via children */}
      <main className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};
