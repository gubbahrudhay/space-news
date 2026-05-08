import React from 'react';
import ISSMap from '../Map/ISSMap';
import ISSSpeedChart from '../Charts/ISSSpeedChart';
import { Activity, MapPin, Users, Navigation } from 'lucide-react';

export default function ISSTracking({ issData, loading, autoRefresh, manualRefresh, toggleAutoRefresh }) {
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      {/* Map Section */}
      <div className="xl:col-span-2 glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="text-blue-500" /> ISS Live Tracking
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={manualRefresh}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Now'}
            </button>
            <button 
              onClick={toggleAutoRefresh}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Latitude / Longitude</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {issData.current ? `${issData.current.lat.toFixed(3)}, ${issData.current.lng.toFixed(3)}` : '--'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Speed</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              {issData.speed > 0 ? `${issData.speed.toFixed(2)} km/h` : '--'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Nearest Place</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title={issData.locationName}>
              {issData.locationName}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Tracked Positions</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-500" />
              {issData.history.length}
            </p>
          </div>
        </div>

        <ISSMap 
          currentPosition={issData.current} 
          history={issData.history} 
          locationName={issData.locationName} 
        />
      </div>

      {/* Speed Chart & Astronauts */}
      <div className="flex flex-col gap-6">
        <div className="glass-card p-6 flex-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">ISS Speed Trend</h2>
          <ISSSpeedChart data={issData.speedHistory} />
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Users className="text-purple-500" /> People In Space
          </h2>
          {issData.astronauts ? (
            <div>
              <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">
                {issData.astronauts.number}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {issData.astronauts.names.map((name, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-semibold">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm animate-pulse">Fetching crew data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
