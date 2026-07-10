import React, { useState } from 'react';
import { Flashcard } from '../types';
import { Plus, RotateCw, AlertCircle, HelpCircle, CheckCircle2, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';

interface FlashcardSystemProps {
  flashcards: Flashcard[];
  onAddCustomCard: (front: string, back: string, domain: string) => void;
  onGradeCard: (id: string, grade: 'easy' | 'medium' | 'hard') => void;
}

export default function FlashcardSystem({
  flashcards,
  onAddCustomCard,
  onGradeCard,
}: FlashcardSystemProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Custom Card State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newDomain, setNewDomain] = useState('Technology');
  const [formError, setFormError] = useState('');

  // Sorter / Filter
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  // Handle filtered queue
  const filteredCards = flashcards.filter(
    (card) => selectedDomainFilter === 'all' || card.domain === selectedDomainFilter
  );

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleGrade = (id: string, grade: 'easy' | 'medium' | 'hard') => {
    onGradeCard(id, grade);
    
    // Smooth transition to the next card after grading
    setIsFlipped(false);
    setTimeout(() => {
      if (filteredCards.length > 1) {
        // If it's graded hard, it'll reappear shortly (we keep index the same but card content changes as queue shifts, or we step forward)
        setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      }
    }, 150);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) {
      setFormError('Both the front and back of the card must contain text.');
      return;
    }
    onAddCustomCard(newFront.trim(), newBack.trim(), newDomain);
    
    // Clear Form
    setNewFront('');
    setNewBack('');
    setFormError('');
    setShowAddForm(false);
  };

  const uniqueDomains = Array.from(new Set(flashcards.map((c) => c.domain)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn" id="flashcards-layout-grid">
      
      {/* Left Column: Deck & Controls (8 columns) */}
      <div className="lg:col-span-8 space-y-6" id="flashcards-main-column">
        
        {/* Filters and Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center" id="flashcard-filters">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 w-full sm:w-auto">
            <button
              onClick={() => { setSelectedDomainFilter('all'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedDomainFilter === 'all'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              All Domains ({flashcards.length})
            </button>
            {uniqueDomains.map((d) => {
              const count = flashcards.filter((c) => c.domain === d).length;
              return (
                <button
                  key={d}
                  onClick={() => { setSelectedDomainFilter(d); setCurrentIndex(0); setIsFlipped(false); }}
                  className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedDomainFilter === d
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {d} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Plus size={14} />
            <span>Create Card</span>
          </button>
        </div>

        {/* 3D Flip Flashcard */}
        {filteredCards.length > 0 ? (
          <div className="space-y-6" id="deck-wrapper">
            
            <div
              onClick={handleFlip}
              className="group cursor-pointer perspective h-80 relative select-none"
              id="active-flashcard"
            >
              <div
                className={`w-full h-full duration-500 transform-style relative transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* CARD FRONT */}
                <div className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between backface-hidden shadow-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full">
                      {currentCard.domain}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {currentIndex + 1} of {filteredCards.length}
                    </span>
                  </div>

                  <div className="text-center py-6">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                      {currentCard.front}
                    </h2>
                    <p className="text-xs text-slate-500 mt-4 animate-pulse flex items-center justify-center space-x-1.5">
                      <RotateCw size={12} />
                      <span>Click card to reveal explanation</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/60 pt-4">
                    <span>Reviewed: {currentCard.reviewCount} times</span>
                    {currentCard.difficulty && (
                      <span className={`uppercase font-bold ${
                        currentCard.difficulty === 'easy' ? 'text-emerald-400' :
                        currentCard.difficulty === 'medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        Pace: {currentCard.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {/* CARD BACK */}
                <div className="absolute inset-0 w-full h-full bg-slate-900 border border-cyan-950 rounded-3xl p-8 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl shadow-cyan-950/10">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-900/20">
                      Answer & Concept
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Back</span>
                  </div>

                  <div className="py-2 overflow-y-auto max-h-40">
                    <h3 className="text-sm font-bold text-cyan-400 mb-2">{currentCard.front}</h3>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {currentCard.back}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4" onClick={(e) => e.stopPropagation()}>
                    <p className="text-[10px] text-slate-500 text-center mb-2 font-semibold">
                      Rate difficulty (Spaced Repetition):
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleGrade(currentCard.id, 'easy')}
                        className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 text-xs py-1.5 rounded-xl font-bold transition-all duration-150 cursor-pointer active:scale-95"
                      >
                        Easy (later)
                      </button>
                      <button
                        onClick={() => handleGrade(currentCard.id, 'medium')}
                        className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/20 hover:border-amber-500 text-xs py-1.5 rounded-xl font-bold transition-all duration-150 cursor-pointer active:scale-95"
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => handleGrade(currentCard.id, 'hard')}
                        className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 text-xs py-1.5 rounded-xl font-bold transition-all duration-150 cursor-pointer active:scale-95"
                      >
                        Hard (soon)
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Stepper controls */}
            <div className="flex justify-between items-center px-4" id="stepper-controls">
              <button
                onClick={handlePrev}
                className="text-xs text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 py-2 px-4 rounded-xl transition-colors active:scale-95"
              >
                &larr; Previous Card
              </button>
              <button
                onClick={handleFlip}
                className="text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 py-2 px-6 rounded-xl hover:bg-cyan-950/60 transition-colors"
              >
                Flip
              </button>
              <button
                onClick={handleNext}
                className="text-xs text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 py-2 px-4 rounded-xl transition-colors active:scale-95"
              >
                Next Card &rarr;
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
            <AlertCircle size={36} className="text-slate-600 mb-3" />
            <p className="text-slate-300 font-medium">No cards available for this domain filter.</p>
            <button
              onClick={() => setSelectedDomainFilter('all')}
              className="mt-2 text-xs text-cyan-400 hover:underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Custom Creation Card & Tips (4 columns) */}
      <div className="lg:col-span-4 space-y-6" id="flashcards-sidebar">
        
        {/* Quick Add Custom Card Form */}
        {showAddForm && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl animate-fadeIn" id="add-card-form">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-4">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">
                Create Custom Card
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                  AWS Term / Concept (Front)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS CloudTrail"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                  Explanation / Definition (Back)
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Records all API audits..."
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                  Exam Domain Category
                </label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-300 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cloud Concepts">Cloud Concepts</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                  <option value="Technology">Technology</option>
                  <option value="Billing & Pricing">Billing & Pricing</option>
                </select>
              </div>

              {formError && (
                <p className="text-[10px] text-rose-400 font-semibold">{formError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Save to Flashcards
              </button>
            </form>
          </div>
        )}

        {/* Spaced Repetition Science Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="srs-info-box">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <BookmarkCheck size={14} className="text-cyan-400" />
            <span>Spaced Repetition System</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Spaced repetition is a powerful study technique. Our deck tracks your difficulty ratings:
          </p>
          <ul className="space-y-2 mt-3">
            <li className="text-[10px] text-slate-300 flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
              <span><strong>Hard</strong> cards are placed closer to the front of the rotation so they reappear sooner.</span>
            </li>
            <li className="text-[10px] text-slate-300 flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
              <span><strong>Medium</strong> cards are pushed midway into the deck.</span>
            </li>
            <li className="text-[10px] text-slate-300 flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <span><strong>Easy</strong> cards are pushed to the absolute end of the review cycle.</span>
            </li>
          </ul>
        </div>

        {/* CLF-C02 Cheat Codes / Quick Exam Tips */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="clf-tips-box">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
            CLF-C02 Rapid-Fire Flags
          </h3>
          <div className="space-y-3">
            {[
              { flag: 'Stateful Firewall', desc: 'Security Groups check return traffic automatically' },
              { flag: 'Stateless Firewall', desc: 'NACLs require explicit inbound and outbound rules' },
              { flag: 'Active Auditing', desc: 'CloudTrail logs who accessed which resources' },
              { flag: 'Health Alerts', desc: 'CloudWatch manages thresholds, triggers alarms & actions' },
              { flag: 'Least Privilege', desc: 'IAM roles instead of shared administrative access' }
            ].map((tip, idx) => (
              <div key={idx} className="bg-slate-950 p-2 rounded-xl border border-slate-850/60">
                <span className="text-[10px] font-bold text-cyan-400 block">{tip.flag}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
