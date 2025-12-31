
import React from 'react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'features' | 'pricing' | 'showcase') => void;
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeView }) => {
  return (
    <header className="border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">EasyTrip AI</h1>
        </button>

        <nav className="hidden md:flex gap-10 text-sm font-bold text-slate-400">
          <button 
            onClick={() => onNavigate('features')} 
            className={`hover:text-cyan-400 transition-colors ${activeView === 'features' ? 'text-cyan-400' : ''}`}
          >
            How it Works
          </button>
          <button 
            onClick={() => onNavigate('pricing')} 
            className={`hover:text-cyan-400 transition-colors ${activeView === 'pricing' ? 'text-cyan-400' : ''}`}
          >
            Pricing
          </button>
          <button 
            onClick={() => onNavigate('showcase')} 
            className={`hover:text-cyan-400 transition-colors ${activeView === 'showcase' ? 'text-cyan-400' : ''}`}
          >
            Sample Trips
          </button>
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('pricing')}
            className="bg-white hover:bg-slate-100 text-[#0b1120] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl active:scale-95"
          >
            Get Premium
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
