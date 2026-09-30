import React from 'react';
import { ShieldCheck, Activity, Users, Database, Sparkles, TrendingUp, Cpu, BarChart3, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'executive' | 'clinical' | 'training' | 'bi' | 'mongodb' | 'pipeline' | 'ai-chat';
  setActiveTab: (tab: 'executive' | 'clinical' | 'training' | 'bi' | 'mongodb' | 'pipeline' | 'ai-chat') => void;
  metrics: any;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, metrics }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-sans font-bold text-xl tracking-tight text-white">CareGuard</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">
                  v2.5 Interview Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">Hospital Readmission & AI ML Analytics Suite</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab('executive')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'executive'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Executive</span>
            </button>

            <button
              onClick={() => setActiveTab('clinical')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'clinical'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clinical</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'training'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ML Training</span>
            </button>

            <button
              onClick={() => setActiveTab('bi')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'bi'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Power BI / Tableau</span>
            </button>

            <button
              onClick={() => setActiveTab('mongodb')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'mongodb'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB & SQL</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-chat')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ai-chat'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Privacy Badge */}
          <div className="hidden sm:flex items-center space-x-3 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-emerald-300 tracking-wide uppercase">HIPAA Compliant</p>
              <p className="text-[10px] text-emerald-400/80 font-mono">Identifiers Masked</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex xl:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'executive' ? 'bg-cyan-500 text-white' : 'text-slate-300 bg-slate-800'
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => setActiveTab('clinical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'clinical' ? 'bg-cyan-500 text-white' : 'text-slate-300 bg-slate-800'
            }`}
          >
            Clinical
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'training' ? 'bg-cyan-500 text-white' : 'text-slate-300 bg-slate-800'
            }`}
          >
            ML Training
          </button>
          <button
            onClick={() => setActiveTab('bi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'bi' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800'
            }`}
          >
            Power BI
          </button>
          <button
            onClick={() => setActiveTab('mongodb')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'mongodb' ? 'bg-emerald-600 text-white' : 'text-slate-300 bg-slate-800'
            }`}
          >
            MongoDB
          </button>
          <button
            onClick={() => setActiveTab('ai-chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'ai-chat' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-slate-800'
            }`}
          >
            AI Assistant
          </button>
        </div>
      </div>
    </header>
  );
};

