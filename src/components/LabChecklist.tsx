import React from 'react';
import { LabTask } from '../types';
import { CheckSquare, Square, Timer, HelpCircle, Terminal, Cloud, ShieldAlert } from 'lucide-react';

interface LabChecklistProps {
  labs: LabTask[];
  onToggleLab: (id: string) => void;
}

export default function LabChecklist({
  labs,
  onToggleLab,
}: LabChecklistProps) {
  
  // Total completed minutes spent
  const completedLabs = labs.filter((l) => l.completed);
  const totalMinutesSpent = completedLabs.reduce((sum, l) => sum + l.estimatedMinutes, 0);

  return (
    <div className="space-y-6 animate-fadeIn" id="labs-checklist-container">
      
      {/* Stats Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="labs-header-banner">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <Terminal size={180} className="text-emerald-500" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Cloud size={18} className="text-emerald-400 animate-pulse" />
              <span>AWS Console Hands-On Laboratories</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Studying theory isn't enough to pass the CLF-C02 or work in DevOps. AWS heavily tests practical scenario questions. Execute these free-tier exercises in your personal sandbox.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-850 flex items-center space-x-3.5 shrink-0">
            <Timer size={18} className="text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Estimated Hands-on Time</span>
              <span className="text-base font-bold text-slate-200">{totalMinutesSpent} minutes logged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Tasks List */}
      <div className="space-y-4" id="labs-list">
        {labs.map((lab) => {
          return (
            <div
              key={lab.id}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                lab.completed
                  ? 'bg-slate-900/60 border-slate-800/80'
                  : 'bg-slate-900 border-slate-800/50 hover:border-slate-800'
              }`}
              id={`lab-card-${lab.id}`}
            >
              <div className="p-5 flex items-start space-x-4">
                {/* Custom Checkbox */}
                <button
                  onClick={() => onToggleLab(lab.id)}
                  className="mt-1 transition-transform active:scale-95 shrink-0"
                  title={lab.completed ? 'Mark lab incomplete' : 'Mark lab complete'}
                >
                  {lab.completed ? (
                    <CheckSquare size={22} className="text-emerald-400" fill="rgba(16, 185, 129, 0.1)" />
                  ) : (
                    <Square size={22} className="text-slate-600 hover:text-emerald-400" />
                  )}
                </button>

                <div className="space-y-3.5 flex-1">
                  
                  {/* Top line with title and minutes badge */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-bold ${
                      lab.completed ? 'text-slate-400 line-through decoration-slate-700' : 'text-slate-100'
                    }`}>
                      {lab.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-850 whitespace-nowrap">
                      {lab.estimatedMinutes} mins
                    </span>
                  </div>

                  {/* Lab Steps Description */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Sandbox Execution Steps:</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{lab.description}</p>
                  </div>

                  {/* Why this matters block */}
                  <div className="flex items-start space-x-2 bg-emerald-950/5 p-3 rounded-xl border border-emerald-950/20">
                    <ShieldAlert size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider block">Why this matters for CLF-C02:</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{lab.whyItMatters}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
