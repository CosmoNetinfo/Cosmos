import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cosmos-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-cosmos-900 to-cosmos-900 relative overflow-hidden text-slate-200">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cosmos-900/80 border-b border-white/5 h-16 flex items-center px-4 md:px-8 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-tr from-indigo-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
              <span className="font-display font-bold text-white text-xl">C</span>
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wide text-white">COSMOS</h1>
            <p className="text-[10px] text-indigo-300 font-medium tracking-wider uppercase">Cosmonet AI Agent</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
            <a href="https://www.cosmonet.info/" target="_blank" rel="noopener" className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors">
                Visita Cosmonet.info
            </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};
