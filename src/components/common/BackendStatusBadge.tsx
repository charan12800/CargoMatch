import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  X,
  Server,
  Zap,
  HardDrive
} from 'lucide-react';
import { Button } from './Button';

export const BackendStatusBadge: React.FC = () => {
  const { backendStatus, backendMessage, refreshData, isLiveBackend } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopyEnv = () => {
    const envTemplate = `# CargoMatch Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusDisplay = () => {
    switch (backendStatus) {
      case 'connected':
        return {
          label: 'Supabase PostgreSQL',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          dotClass: 'bg-emerald-500 animate-pulse',
          icon: <Zap className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'connecting':
        return {
          label: 'Connecting...',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          dotClass: 'bg-blue-500 animate-ping',
          icon: <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />,
        };
      case 'error':
        return {
          label: 'DB Error',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
          dotClass: 'bg-rose-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'demo':
      default:
        return {
          label: 'Demo Mode (Local)',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
          dotClass: 'bg-amber-500',
          icon: <HardDrive className="w-3.5 h-3.5 text-amber-600" />,
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${status.badgeClass}`}
        title="Click to view database connection status & configuration"
      >
        <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
        <span className="hidden sm:inline-flex items-center gap-1">{status.icon}</span>
        <span>{status.label}</span>
      </button>

      {/* Backend Diagnostics & Setup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-500/30 text-blue-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Database & Backend Status</h3>
                  <p className="text-[11px] text-slate-400">PostgreSQL + Realtime State Management</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-slate-700">
              {/* Current Status Box */}
              <div className={`p-4 rounded-xl border ${
                isLiveBackend 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : backendStatus === 'error'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-start gap-3">
                  {isLiveBackend ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : backendStatus === 'error' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <Server className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold text-xs">
                      {isLiveBackend ? 'Connected to Live Supabase Backend' : 'Running in Local Prototyping Mode'}
                    </p>
                    <p className="text-xs leading-relaxed opacity-90">{backendMessage}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
                  className="flex-1 text-xs font-semibold"
                >
                  {isRefreshing ? 'Testing...' : 'Test / Refresh Connection'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEnv}
                  leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold"
                >
                  {copied ? 'Copied!' : 'Copy .env Keys'}
                </Button>
              </div>

              {/* Step-by-Step Connection Instructions */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Supabase Setup (3 Steps):
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">1. Create Supabase Project</span>
                      <a 
                        href="https://supabase.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                      >
                        supabase.com <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">Create a new free project in your Supabase dashboard.</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">2. Run SQL Schema & Seed</span>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        supabase/schema.sql
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Open Supabase <strong>SQL Editor</strong>, paste the content of <code>supabase/schema.sql</code> (and optionally <code>seed.sql</code>) and click Run.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-900">3. Create .env File</span>
                    <p className="text-[11px] text-slate-500">
                      Copy <code>.env.example</code> to <code>.env</code> in the project root and fill in your Project URL and anon public API key:
                    </p>
                    <pre className="p-2 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <Button variant="primary" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-semibold">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
