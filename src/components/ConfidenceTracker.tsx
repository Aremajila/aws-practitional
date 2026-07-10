import React, { useState } from 'react';
import { WeeklyModule } from '../types';
import { AlertTriangle, Sparkles, CheckCircle2, ChevronRight, HelpCircle, RefreshCcw } from 'lucide-react';

interface ConfidenceTrackerProps {
  modules: WeeklyModule[];
  onNavigateToTab: (tab: string, context?: any) => void;
}

export default function ConfidenceTracker({
  modules,
  onNavigateToTab,
}: ConfidenceTrackerProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // 1. Filter completed modules with ratings
  const ratedModules = modules.filter((m) => m.completed);
  const unratedModulesCount = modules.length - ratedModules.length;

  // Calculate Average Confidence
  const averageConfidence = ratedModules.length > 0
    ? ratedModules.reduce((sum, m) => sum + m.confidence, 0) / ratedModules.length
    : 0;

  // Flag topics with confidence <= 3 as "Needs Review"
  const needsReviewModules = ratedModules.filter((m) => m.confidence <= 3);

  // Confidence category color-coding
  const getRatingColor = (rating: number) => {
    if (rating === 0) return { bar: 'bg-slate-800', text: 'text-slate-500', bg: 'bg-slate-900/50' };
    if (rating <= 2) return { bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-950/20 border-rose-800/40' };
    if (rating === 3) return { bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-800/40' };
    return { bar: 'bg-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-800/40' };
  };

  return (
    <div className="space-y-6" id="confidence-tracker-container">
      
      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Confidence Index</span>
          <p className="text-4xl font-extrabold text-white mt-1.5">
            {averageConfidence > 0 ? `${averageConfidence.toFixed(1)}/5.0` : '—'}
          </p>
          <div className="flex items-center justify-center mt-2.5 space-x-1">
            <span className={`text-xs font-semibold ${
              averageConfidence === 0 ? 'text-slate-500' :
              averageConfidence <= 2.5 ? 'text-rose-400' :
              averageConfidence <= 3.8 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {averageConfidence === 0 ? 'Unrated' :
               averageConfidence <= 2.5 ? 'Critical Review Needed' :
               averageConfidence <= 3.8 ? 'On Track' : 'Strong Preparedness'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Completed & Rated</span>
          <p className="text-4xl font-extrabold text-white mt-1.5">{ratedModules.length}</p>
          <span className="text-xs text-slate-400 block mt-2.5">
            {unratedModulesCount} modules left to review
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Critical Focus Areas</span>
          <p className="text-4xl font-extrabold text-white mt-1.5 text-rose-400">{needsReviewModules.length}</p>
          <span className="text-xs text-slate-400 block mt-2.5">
            Modules rated &le; 3 stars
          </span>
        </div>

      </div>

      {/* SVG Custom Interactive Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="confidence-chart-card">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles size={18} className="text-amber-400" />
            <span>Confidence Curve (12-Week Timeline)</span>
          </h3>
          <div className="flex items-center space-x-4 text-[10px] font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" />
              <span className="text-slate-400">Low (&le; 2)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span className="text-slate-400">Medium (3)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
              <span className="text-slate-400">High (&ge; 4)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-800" />
              <span className="text-slate-400">Unrated</span>
            </div>
          </div>
        </div>

        {/* Bar chart container */}
        <div className="relative pt-6">
          {/* Chart Core */}
          <div className="relative h-64 w-full flex items-end justify-between px-2 sm:px-6 select-none" id="svg-chart-grid">
            
            {/* Horizontal Grid lines */}
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="absolute left-0 right-0 border-b border-slate-800/80 pointer-events-none flex items-center"
                style={{ bottom: `${(level / 5) * 100}%` }}
              >
                <span className="text-[9px] font-bold text-slate-600 -mt-2 pl-1 bg-slate-900 pr-1.5">
                  {level} {level === 5 ? '★' : ''}
                </span>
              </div>
            ))}

            {/* Render Bars */}
            {modules.map((m) => {
              const colors = getRatingColor(m.confidence);
              const barHeightPercent = m.completed ? (m.confidence / 5) * 100 : 8; // default minimal height if not completed
              const isHovered = hoveredBar === m.id;

              return (
                <div
                  key={m.id}
                  className="flex-1 flex flex-col items-center group relative mx-1 sm:mx-2.5"
                  onMouseEnter={() => setHoveredBar(m.id)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-2xl z-20 w-44 pointer-events-none text-left animate-fadeIn">
                      <span className="text-[9px] uppercase font-bold text-cyan-400">Week {m.week}</span>
                      <h4 className="text-[11px] font-bold text-white line-clamp-1 mt-0.5">{m.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Status: <span className={m.completed ? 'text-emerald-400 font-semibold' : 'text-slate-500 font-medium'}>
                          {m.completed ? 'Completed' : 'Locked'}
                        </span>
                      </p>
                      {m.completed && (
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          Confidence: <span className={`${colors.text} font-bold`}>{m.confidence}/5 stars</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* SVG/HTML Bar */}
                  <div className="w-full relative rounded-t-md overflow-hidden transition-all duration-350 cursor-pointer" style={{ height: `${barHeightPercent}%` }}>
                    <div className={`w-full h-full transition-colors duration-300 ${
                      m.completed ? colors.bar : 'bg-slate-800/40'
                    } ${isHovered ? 'brightness-125 saturate-110' : ''}`} />
                  </div>

                  {/* Week Label */}
                  <span className={`text-[10px] font-bold mt-2.5 transition-colors duration-150 ${isHovered ? 'text-cyan-400' : 'text-slate-500'}`}>
                    W{m.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focus Station: Needs Review list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="focus-station-section">
        <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
          <AlertTriangle size={18} className="text-rose-400" />
          <span>Needs Review Module Station</span>
        </h3>

        {needsReviewModules.length === 0 ? (
          <div className="bg-slate-950 rounded-2xl p-8 border border-slate-850 text-center flex flex-col items-center justify-center">
            <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
            <p className="text-slate-300 font-semibold">Focus Queue Clear!</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Any completed roadmap weeks where you rate your confidence at 3 stars or below will show up here as priority revision targets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needsReviewModules.map((m) => {
              const colors = getRatingColor(m.confidence);
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:border-slate-700 bg-slate-950/40 border-slate-850`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold text-rose-400 tracking-wider bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-900/30">
                        Confidence: {m.confidence}/5
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">Week {m.week}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100">{m.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{m.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-4 gap-2">
                    {/* Action buttons */}
                    <button
                      onClick={() => onNavigateToTab('roadmap')}
                      className="text-[10px] text-slate-400 hover:text-white font-medium flex items-center space-x-1"
                    >
                      <RefreshCcw size={12} />
                      <span>Study Module Details</span>
                    </button>

                    <button
                      onClick={() => onNavigateToTab('assistant', m.title)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-0.5 group"
                    >
                      <span>Ask AI Tutor</span>
                      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
