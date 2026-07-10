import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizAttempt } from '../types';
import { Play, Timer, Trophy, ShieldAlert, CheckCircle, XCircle, ChevronRight, HelpCircle, BarChart, RotateCcw } from 'lucide-react';

interface QuizEngineProps {
  questionBank: QuizQuestion[];
  attempts: QuizAttempt[];
  onSaveAttempt: (attempt: QuizAttempt) => void;
}

export default function QuizEngine({
  questionBank,
  attempts,
  onSaveAttempt,
}: QuizEngineProps) {
  // Navigation states
  const [activeQuizMode, setActiveQuizMode] = useState<'selection' | 'active' | 'results'>('selection');
  
  // Selection States
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'quick' | 'full'>('quick');

  // Active Quiz States
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // { questionIndex: optionIndex }
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [startTime, setStartTime] = useState<number>(0);
  const [isExamCompletedGracefully, setIsExamCompletedGracefully] = useState(false);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Latest finished attempt
  const [latestAttemptResult, setLatestAttemptResult] = useState<QuizAttempt | null>(null);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown handler
  useEffect(() => {
    if (activeQuizMode === 'active' && selectedMode === 'full' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Time Out - Force Submit
            handleQuizSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeQuizMode, selectedMode, timeRemaining]);

  // Start the Quiz
  const handleStartQuiz = () => {
    // 1. Compile questions
    let pool = [...questionBank];
    if (selectedDomain !== 'all') {
      pool = pool.filter((q) => q.domain === selectedDomain);
    }

    // Determine target size
    const targetSize = selectedMode === 'quick' ? 10 : 65;
    let questionsForQuiz: QuizQuestion[] = [];

    if (pool.length === 0) {
      alert('No questions found in this category! Resetting filter.');
      return;
    }

    if (selectedMode === 'quick') {
      // Shuffle pool and take 10
      const shuffled = pool.sort(() => 0.5 - Math.random());
      questionsForQuiz = shuffled.slice(0, Math.min(shuffled.length, 10));
    } else {
      // Full practice exam (65 questions)
      // Since our pre-seeded bank is around 25, we pad by sampling with replacement to make a full 65-question set
      // We randomize options mapping so repeat questions look fresh and force true conceptual study
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 65; i++) {
        const baseQuestion = shuffled[i % shuffled.length];
        
        // Let's create a customized variation to avoid exact copies in a row
        questionsForQuiz.push({
          ...baseQuestion,
          id: `exam-${i}-${baseQuestion.id}`,
        });
      }
    }

    // 2. Initialize active state
    setQuizQuestions(questionsForQuiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setStartTime(Date.now());
    setIsExamCompletedGracefully(false);

    if (selectedMode === 'full') {
      setTimeRemaining(90 * 60); // 90 minutes
    } else {
      setTimeRemaining(0);
    }

    setActiveQuizMode('active');
  };

  // Select Option
  const handleSelectOption = (optionIdx: number) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined && selectedMode === 'quick') {
      // In quick mode, if already answered, don't allow changing to keep real evaluation
      return;
    }
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIdx,
    });
    
    if (selectedMode === 'quick') {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handlePrevQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit and Calculate Scores
  const handleQuizSubmit = (isTimeOut = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);

    // Calculate domain scores
    const domainScores = {
      'Cloud Concepts': { correct: 0, total: 0 },
      'Security & Compliance': { correct: 0, total: 0 },
      'Technology': { correct: 0, total: 0 },
      'Billing & Pricing': { correct: 0, total: 0 },
    };

    let overallCorrectCount = 0;

    quizQuestions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns === q.correctAnswerIndex;

      if (domainScores[q.domain]) {
        domainScores[q.domain].total += 1;
        if (isCorrect) {
          domainScores[q.domain].correct += 1;
          overallCorrectCount += 1;
        }
      }
    });

    const finalScorePercent = Math.round((overallCorrectCount / quizQuestions.length) * 100);

    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      score: finalScorePercent,
      totalQuestions: quizQuestions.length,
      mode: selectedMode,
      timeTakenSeconds,
      domainScores,
    };

    onSaveAttempt(newAttempt);
    setLatestAttemptResult(newAttempt);
    setActiveQuizMode('results');
  };

  // Format countdown clock
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Score History custom SVG Plot
  const renderScoreHistoryChart = () => {
    if (attempts.length === 0) {
      return (
        <div className="bg-slate-950/60 rounded-2xl p-8 border border-slate-850/80 text-center h-48 flex flex-col items-center justify-center">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Historical Progress Chart</p>
          <p className="text-xs text-slate-400 mt-1">No exam attempts logged yet. Complete a quiz to plot score curves.</p>
        </div>
      );
    }

    // Sort chronologically
    const sortedAttempts = [...attempts]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-10); // Show last 10 attempts for space readability

    const width = 500;
    const height = 150;
    const padding = 25;

    // Draw lines
    const points = sortedAttempts.map((attempt, index) => {
      const x = padding + (index * (width - 2 * padding)) / Math.max(1, sortedAttempts.length - 1);
      const y = height - padding - (attempt.score * (height - 2 * padding)) / 100;
      return { x, y, score: attempt.score, mode: attempt.mode };
    });

    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    }

    // Passing threshold line y coordinate
    const passingY = height - padding - (70 * (height - 2 * padding)) / 100;

    return (
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850" id="quiz-trend-card">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Score Trend Line (Last {sortedAttempts.length} Attempts)</span>
          <span className="text-[10px] text-emerald-500 font-bold">Pass Line: 70%</span>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Line (70% pass standard) */}
            <line
              x1={padding}
              y1={passingY}
              x2={width - padding}
              y2={passingY}
              stroke="#10b981"
              strokeDasharray="4,4"
              strokeWidth="1.5"
              opacity="0.6"
            />
            
            {/* Area Shader under curve */}
            {points.length > 1 && (
              <path
                d={areaPath}
                fill="url(#scoreGrad)"
                opacity="0.15"
              />
            )}

            {/* Main Trend Line */}
            {points.length > 1 && (
              <path
                d={linePath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Plot Nodes (Circles) */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className={p.score >= 70 ? 'fill-emerald-400 stroke-slate-950' : 'fill-rose-400 stroke-slate-950'}
                  strokeWidth="1.5"
                />
                {/* Score hover indicator text */}
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="fill-slate-300 font-bold font-sans"
                  style={{ fontSize: '8px' }}
                >
                  {p.score}%
                </text>
              </g>
            ))}

            {/* Definitions */}
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="quiz-engine-root">
      
      {/* 1. SELECTION SCREEN */}
      {activeQuizMode === 'selection' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn" id="quiz-selection-screen">
          
          {/* Settings panel */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="quiz-creator-pane">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Trophy size={18} className="text-yellow-400" />
                <span>AWS Practice Exam Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your testing suite. Organize by specific target domains or simulate the complete testing environment.
              </p>
            </div>

            {/* Choose Exam Mode */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">1. Choose Exam Mode</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Quick Quiz */}
                <div
                  onClick={() => setSelectedMode('quick')}
                  className={`p-4 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                    selectedMode === 'quick'
                      ? 'bg-cyan-950/15 border-cyan-500/40 shadow-lg shadow-cyan-950/10'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedMode === 'quick'}
                    onChange={() => setSelectedMode('quick')}
                    className="mt-1 accent-cyan-500"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">Quick Quiz Mode</span>
                    <p className="text-[10px] text-slate-400">10 random questions, untimed. Displays immediate question-by-question explanations.</p>
                  </div>
                </div>

                {/* Full Exam */}
                <div
                  onClick={() => setSelectedMode('full')}
                  className={`p-4 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                    selectedMode === 'full'
                      ? 'bg-cyan-950/15 border-cyan-500/40 shadow-lg shadow-cyan-950/10'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedMode === 'full'}
                    onChange={() => setSelectedMode('full')}
                    className="mt-1 accent-cyan-500"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">Full CLF-C02 Exam</span>
                    <p className="text-[10px] text-slate-400">65 questions, timed to 90 minutes. Mimics exact testing center ratios. Rationale shown at completion.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Choose Domain filter */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">
                2. Target Study Domain (Untimed mode only)
              </span>
              <select
                disabled={selectedMode === 'full'}
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className={`w-full bg-slate-950 text-xs text-slate-300 px-3 py-2.5 rounded-xl border transition-all ${
                  selectedMode === 'full' ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40' : 'border-slate-800'
                }`}
              >
                <option value="all">Simulate All Domains combined</option>
                <option value="Cloud Concepts">Domain 1: Cloud Concepts (24%)</option>
                <option value="Security & Compliance">Domain 2: Security & Compliance (30%)</option>
                <option value="Technology">Domain 3: Technology (34%)</option>
                <option value="Billing & Pricing">Domain 4: Billing & Pricing (12%)</option>
              </select>
              {selectedMode === 'full' && (
                <span className="text-[9px] text-cyan-400 font-bold block">* The 65-question Exam automatically locks to a full proportional blend of all domains.</span>
              )}
            </div>

            {/* Launch Action */}
            <button
              onClick={handleStartQuiz}
              className="w-full py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer"
            >
              <Play size={14} fill="white" />
              <span>Launch Practice Module</span>
            </button>
          </div>

          {/* Right Column: History Score list & Custom SVG plot (5 columns) */}
          <div className="lg:col-span-5 space-y-6" id="quiz-history-pane">
            {renderScoreHistoryChart()}

            {/* Historical list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="history-attempts-card">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Past Attempt Audits</h3>
              {attempts.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic text-center py-6">Your score ledger is clean. Take your first quiz!</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {[...attempts].reverse().map((att) => {
                    const pass = att.score >= 70;
                    return (
                      <div key={att.id} className="flex justify-between items-center p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-slate-500">
                            {att.mode === 'full' ? '65-Q Mock Exam' : '10-Q Quick Quiz'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {new Date(att.timestamp).toLocaleDateString()} at {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold block ${pass ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {att.score}%
                          </span>
                          <span className={`text-[9px] font-bold uppercase ${pass ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {pass ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 2. ACTIVE QUIZ PLAYBACK SCREEN */}
      {activeQuizMode === 'active' && quizQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 animate-fadeIn" id="quiz-active-screen">
          
          {/* Quiz Header Bar */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                {selectedMode === 'full' ? '65-Question Full Practice Exam' : '10-Question Target Practice'}
              </span>
              <h3 className="text-sm font-bold text-white">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </h3>
            </div>

            {/* Timer and Exit */}
            <div className="flex items-center space-x-4">
              {selectedMode === 'full' && (
                <div className="flex items-center space-x-1.5 bg-cyan-950/30 border border-cyan-800/40 text-cyan-400 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
                  <Timer size={14} className="animate-pulse" />
                  <span>{formatTimer(timeRemaining)}</span>
                </div>
              )}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to abandon this exam? Progress will not be saved.')) {
                    setActiveQuizMode('selection');
                  }
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-bold hover:underline"
              >
                Quit Quiz
              </button>
            </div>
          </div>

          {/* Question Display Card */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-0.5 rounded-full">
                {quizQuestions[currentQuestionIndex].domain}
              </span>
            </div>
            
            <h4 className="text-base font-semibold text-slate-100 leading-relaxed font-sans">
              {quizQuestions[currentQuestionIndex].question}
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {quizQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
              const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
              const isThisSelected = selectedAnswers[currentQuestionIndex] === oIdx;
              const isCorrectOpt = oIdx === quizQuestions[currentQuestionIndex].correctAnswerIndex;

              let btnStyle = 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200';

              if (isThisSelected) {
                if (selectedMode === 'quick') {
                  // In quick mode, highlight results immediately
                  btnStyle = isCorrectOpt
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/20'
                    : 'bg-rose-950/20 border-rose-500/50 text-rose-300 ring-1 ring-rose-500/20';
                } else {
                  // In full timed exam mode, just show selected status (don't reveal answers until completion)
                  btnStyle = 'bg-cyan-950/25 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/25';
                }
              } else if (isAnswered && selectedMode === 'quick' && isCorrectOpt) {
                // If answered but user was wrong, highlight correct option
                btnStyle = 'bg-emerald-950/10 border-emerald-500/30 text-emerald-400';
              }

              return (
                <button
                  key={oIdx}
                  disabled={isAnswered && selectedMode === 'quick'}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left text-xs font-medium p-4 rounded-xl border flex items-center justify-between transition-all duration-150 ${btnStyle}`}
                >
                  <span className="leading-relaxed flex-1 pr-4">{opt}</span>
                  {isAnswered && selectedMode === 'quick' && (
                    <span className="shrink-0">
                      {isCorrectOpt ? <CheckCircle size={16} className="text-emerald-400" /> : isThisSelected ? <XCircle size={16} className="text-rose-400" /> : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Quiz Rationale Block */}
          {showExplanation && selectedMode === 'quick' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 space-y-1.5 animate-fadeIn" id="quiz-rationale-box">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Study Rationale</span>
              <p className="text-xs text-slate-300 leading-normal font-medium">{quizQuestions[currentQuestionIndex].explanation}</p>
            </div>
          )}

          {/* Stepper Footer Action */}
          <div className="flex justify-between items-center border-t border-slate-800/80 pt-4" id="active-quiz-stepper">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`text-xs text-slate-400 py-2 px-4 rounded-xl border border-slate-800 transition-colors ${
                currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-950 hover:text-white'
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className={`text-xs py-2 px-6 rounded-xl font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                selectedAnswers[currentQuestionIndex] === undefined
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white active:scale-95'
              }`}
            >
              <span>
                {currentQuestionIndex === quizQuestions.length - 1
                  ? 'Submit Exam'
                  : 'Next Question'}
              </span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* 3. RESULTS SHEET SCREEN */}
      {activeQuizMode === 'results' && latestAttemptResult && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 animate-fadeIn" id="quiz-results-screen">
          
          {/* Header Summary Score */}
          <div className="text-center space-y-2 border-b border-slate-800 pb-5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Attempt Completed</span>
            
            <div className="flex flex-col items-center justify-center">
              <span className={`text-6xl font-extrabold font-sans ${
                latestAttemptResult.score >= 70 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {latestAttemptResult.score}%
              </span>
              <span className={`text-xs uppercase font-extrabold tracking-wider mt-1 px-3 py-1 rounded-full ${
                latestAttemptResult.score >= 70
                  ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/30'
                  : 'bg-rose-950/30 text-rose-400 border border-rose-900/30'
              }`}>
                {latestAttemptResult.score >= 70 ? 'PASS (Accurate standard)' : 'FAIL (Needs study)'}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto pt-1">
              AWS requires roughly 700 out of 1000 points to certify as a Cloud Practitioner (CLF-C02). Review the domain performance breakdown below to focus your efforts.
            </p>
          </div>

          {/* Domain Specific breakdowns with Progress indicators */}
          <div className="space-y-4" id="domain-results-audit">
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Domain Audit Breakdown</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(latestAttemptResult.domainScores).map((dKey) => {
                const item = latestAttemptResult.domainScores[dKey as keyof typeof latestAttemptResult.domainScores];
                const pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                
                return (
                  <div key={dKey} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-200">{dKey}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.correct}/{item.total} Correct</span>
                    </div>

                    <div className="flex items-center space-x-3 pt-1">
                      <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pct < 70 ? 'bg-rose-500' : pct < 85 ? 'bg-cyan-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold whitespace-nowrap min-w-[28px] text-right ${
                        pct < 70 ? 'text-rose-400' : 'text-slate-300'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full audit review (all questions listed out with correct keys and explanations) */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider border-b border-slate-800 pb-2">
              Full Question-by-Question Audit Review
            </h4>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2" id="results-questions-scroller">
              {quizQuestions.map((q, idx) => {
                const userAnsIdx = selectedAnswers[idx];
                const isCorrect = userAnsIdx === q.correctAnswerIndex;

                return (
                  <div key={idx} className={`p-4 rounded-xl border space-y-3 ${
                    isCorrect ? 'bg-slate-950/30 border-slate-850' : 'bg-rose-950/5 border-rose-950/20'
                  }`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold text-slate-500">Q{idx + 1} • {q.domain}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-semibold leading-relaxed">{q.question}</p>

                    <div className="space-y-1.5 pl-2 border-l border-slate-800">
                      <p className="text-[11px] text-slate-400">
                        Your Answer: <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {userAnsIdx !== undefined ? q.options[userAnsIdx] : 'Unanswered'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-[11px] text-emerald-400">
                          Correct Answer: <span className="font-bold">{q.options[q.correctAnswerIndex]}</span>
                        </p>
                      )}
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded-lg text-[10px] text-slate-400 leading-normal">
                      <strong>Study Rationale:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-center border-t border-slate-800 pt-5 gap-4">
            <button
              onClick={() => setActiveQuizMode('selection')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Back to Quiz Suite</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
