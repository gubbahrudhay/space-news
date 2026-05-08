import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';
import ThemeToggle from './components/ThemeToggle';
import ISSTracking from './components/Dashboard/ISSTracking';
import NewsDashboard from './components/Dashboard/NewsDashboard';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  const { issData, loading: issLoading, autoRefresh, manualRefresh, toggleAutoRefresh } = useISS();
  const newsState = useNews();

  // Context for chatbot
  const chatbotContext = {
    iss: issData.current ? { 
      latitude: issData.current.lat, 
      longitude: issData.current.lng,
      speed: issData.speed
    } : null,
    astronauts: issData.astronauts,
    news: newsState.articles
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 dark:bg-slate-900/95 supports-backdrop-blur:bg-white/60">
        <div className="max-w-8xl mx-auto">
          <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-white font-bold text-xl tracking-tighter">AI</span>
                </div>
                <div>
                  <h1 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">Mission Control Dashboard</h1>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Real-Time ISS and News Intelligence</h2>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:inline-block">Switch to Dark</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <ISSTracking 
            issData={issData} 
            loading={issLoading} 
            autoRefresh={autoRefresh}
            manualRefresh={manualRefresh}
            toggleAutoRefresh={toggleAutoRefresh}
          />
          
          <NewsDashboard newsState={newsState} />
        </div>
      </main>

      <Chatbot contextData={chatbotContext} />
    </div>
  );
}

export default App;
