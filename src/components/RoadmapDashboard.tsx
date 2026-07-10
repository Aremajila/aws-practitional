import React, { useState } from 'react';
import { WeeklyModule } from '../types';
import { Search, CheckCircle, Circle, Star, ChevronDown, ChevronUp, Calendar, AlertCircle } from 'lucide-react';

interface RoadmapDashboardProps {
  modules: WeeklyModule[];
  onToggleModule: (id: string) => void;
  onSetConfidence: (id: string, confidence: number) => void;
}

export default function RoadmapDashboard({
  modules,
  onToggleModule,
  onSetConfidence,
}: RoadmapDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('w1'); // Week 1 expanded by default

  // Filter modules
  const filteredModules = modules.filter((m) => {
    const matchesMonth = selectedMonth === 'all' || m.month === selectedMonth;
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMonth && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  // Render Star Rating
  const renderStars = (moduleId: string, currentRating: number, isCompleted: boolean) => {
    return (
      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => isCompleted && onSetConfidence(moduleId, star)}
            disabled={!isCompleted}
            className={`transition-colors duration-150 ${
              !isCompleted
                ? 'text-slate-700 cursor-not-allowed'
                : star <= currentRating
                ? 'text-amber-400 hover:text-amber-500'
                : 'text-slate-600 hover:text-amber-400'
            }`}
            title={isCompleted ? `Rate confidence ${star}/5` : 'Mark module complete first'}
          >
            <Star size={16} fill={star <= currentRating && isCompleted ? 'currentColor' : 'transparent'} />
          </button>
        ))}
        {isCompleted && currentRating === 0 && (
          <span className="text-[10px] text-slate-500 font-medium pl-1 animate-pulse">Rate confidence</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="roadmap-dashboard-container">
      {/* Controls & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center" id="roadmap-controls">
        {/* Month Selector Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 w-full sm:w-auto" id="month-tabs">
          {[
            { value: 'all', label: 'Full 12-Week Course' },
            { value: 1, label: 'Month 1: Foundations' },
            { value: 2, label: 'Month 2: Deeper Services' },
            { value: 3, label: 'Month 3: Consolidation' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedMonth(tab.value as any)}
              className={`flex-1 sm:flex-none py-1.5 px-4 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                (selectedMonth === tab.value)
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Modules List */}
      {filteredModules.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <AlertCircle size={36} className="text-slate-600 mb-3" />
          <p className="text-slate-300 font-medium">No roadmap modules match your filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedMonth('all'); }}
            className="mt-3 text-xs text-cyan-400 hover:underline font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4" id="roadmap-weeks-list">
          {filteredModules.map((m) => {
            const isExpanded = expandedModuleId === m.id;
            return (
              <div
                key={m.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  m.completed
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-800'
                    : 'bg-slate-900 border-slate-800/50 hover:border-slate-700/80'
                } ${isExpanded ? 'ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-950/10' : ''}`}
                id={`week-card-${m.week}`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(m.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleModule(m.id);
                      }}
                      className="mt-1 transition-transform active:scale-95"
                      title={m.completed ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      {m.completed ? (
                        <CheckCircle size={22} className="text-emerald-400" fill="rgba(16, 185, 129, 0.1)" />
                      ) : (
                        <Circle size={22} className="text-slate-600 hover:text-cyan-400" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 py-0.5 px-2 rounded-full">
                          Week {m.week}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center">
                          <Calendar size={12} className="mr-1" />
                          Month {m.month}
                        </span>
                      </div>
                      <h3 className={`text-sm sm:text-base font-bold ${m.completed ? 'text-slate-300 line-through decoration-slate-650' : 'text-slate-100'}`}>
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 sm:line-clamp-none max-w-2xl">{m.description}</p>
                    </div>
                  </div>

                  {/* Confidence and Toggle buttons */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-10 sm:pl-0 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Confidence</span>
                      {renderStars(m.id, m.confidence, m.completed)}
                    </div>
                    
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expandable Topic Checklist Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800 bg-slate-950/40 animate-fadeIn" id={`week-details-${m.week}`}>
                    <div className="pl-10 space-y-4">
                      <div>
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2.5">
                          Detailed Study Topics
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {m.topics.map((topic, index) => (
                            <li
                              key={index}
                              className="text-xs text-slate-300 flex items-start space-x-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-850 hover:border-slate-800/80"
                            >
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                              <span className="leading-normal">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
                        <p className="text-[11px] text-slate-400">
                          {m.completed
                            ? 'Great job completing this week! Set your confidence rating above to help track your weak spots.'
                            : 'Check off the week card above once you feel you have reviewed all study criteria thoroughly.'}
                        </p>
                        {!m.completed && (
                          <button
                            onClick={() => onToggleModule(m.id)}
                            className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg border border-cyan-500/30 transition-all duration-200 whitespace-nowrap"
                          >
                            Mark Week Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
