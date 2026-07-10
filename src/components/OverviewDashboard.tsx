import React from 'react';
import { StudyState, WeeklyModule, QuizAttempt } from '../types';
import { Award, Flame, Calendar, BookOpen, AlertCircle, TrendingUp, CheckCircle, BrainCircuit } from 'lucide-react';

interface OverviewDashboardProps {
  state: StudyState;
  setStudyPace: (pace: 'fast' | 'regular' | 'relaxed') => void;
  onLogStreak: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function OverviewDashboard({
  state,
  setStudyPace,
  onLogStreak,
  onNavigateToTab,
}: OverviewDashboardProps) {
  const { modules, flashcards, labTasks, quizAttempts, streak, studyPace } = state;

  // 1. Calculations
  const completedModulesCount = modules.filter((m) => m.completed).length;
  const totalModulesCount = modules.length;
  const roadmapProgress = totalModulesCount > 0 ? (completedModulesCount / totalModulesCount) * 100 : 0;

  const completedLabsCount = labTasks.filter((l) => l.completed).length;
  const totalLabsCount = labTasks.length;
  const labsProgress = totalLabsCount > 0 ? (completedLabsCount / totalLabsCount) * 100 : 0;

  // Average quiz score
  const latestAttempts = [...quizAttempts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const avgQuizScore = quizAttempts.length > 0
    ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length
    : 0;

  // Average confidence score
  const ratedModules = modules.filter((m) => m.completed && m.confidence > 0);
  const avgConfidence = ratedModules.length > 0
    ? ratedModules.reduce((sum, m) => sum + m.confidence, 0) / ratedModules.length
    : 0;

  // 2. Exam Readiness Score (combines roadmap %, average quiz score, and confidence %)
  // Roadmap completed counts for 40%
  // Average Quiz Score counts for 40% (rescale from 0-100)
  // Average Confidence counts for 20% (rescale 1-5 to 0-100, i.e., (score/5) * 100)
  const confidencePercent = avgConfidence > 0 ? (avgConfidence / 5) * 100 : 0;
  const examReadinessScore = Math.round(
    (roadmapProgress * 0.4) +
    ((quizAttempts.length > 0 ? avgQuizScore : 0) * 0.4) +
    (confidencePercent * 0.2)
  );

  // 3. Estimated days remaining based on pace selection
  const remainingModules = totalModulesCount - completedModulesCount;
  const daysPerModule = studyPace === 'fast' ? 5 : studyPace === 'regular' ? 7 : 10;
  const estimatedDaysRemaining = remainingModules * daysPerModule;

  // Target Completion Date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + estimatedDaysRemaining);
  const formattedTargetDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Domain score breakdowns across all attempts to identify strengths/weaknesses
  const domainTotals = {
    'Cloud Concepts': { correct: 0, total: 0 },
    'Security & Compliance': { correct: 0, total: 0 },
    'Technology': { correct: 0, total: 0 },
    'Billing & Pricing': { correct: 0, total: 0 },
  };

  quizAttempts.forEach((attempt) => {
    Object.keys(domainTotals).forEach((d) => {
      const key = d as keyof typeof domainTotals;
      if (attempt.domainScores[key]) {
        domainTotals[key].correct += attempt.domainScores[key].correct;
        domainTotals[key].total += attempt.domainScores[key].total;
      }
    });
  });

  // Weak area count (confidence <= 3 and completed, or low quiz score < 70)
  const weakModules = modules.filter((m) => m.completed && m.confidence > 0 && m.confidence <= 3);

  // Streak Logging check
  const isStreakLoggedToday = () => {
    if (!streak.lastStudiedDate) return false;
    const todayStr = new Date().toDateString();
    return new Date(streak.lastStudiedDate).toDateString() === todayStr;
  };

  // Readiness Gauge color
  const getReadinessColor = (score: number) => {
    if (score < 50) return 'text-rose-500 border-rose-500 bg-rose-50/10 dark:bg-rose-950/20';
    if (score < 75) return 'text-amber-500 border-amber-500 bg-amber-50/10 dark:bg-amber-950/20';
    if (score < 85) return 'text-cyan-500 border-cyan-500 bg-cyan-50/10 dark:bg-cyan-950/20';
    return 'text-emerald-500 border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20';
  };

  return (
    <div className="space-y-6" id="overview-dashboard-container">
      {/* Header Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak & Motivation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="streak-card">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Flame size={120} className="text-orange-500" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Study Streak</h3>
            <Flame size={24} className="text-orange-500 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold font-sans text-white">{streak.current}</span>
            <span className="text-sm text-slate-400">days studied</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Keep the momentum! Check off tasks or log a session daily.
          </p>
          <button
            onClick={onLogStreak}
            disabled={isStreakLoggedToday()}
            className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center space-x-1.5 ${
              isStreakLoggedToday()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-950/30 active:scale-[0.98]'
            }`}
            id="streak-log-btn"
          >
            <Flame size={14} />
            <span>{isStreakLoggedToday() ? 'Streak Logged Today!' : 'Log Today\'s Study Session'}</span>
          </button>
        </div>

        {/* Dynamic Study Pace Estimator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="pace-card">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Calendar size={120} className="text-cyan-500" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pace & Timeline</h3>
            <Calendar size={24} className="text-cyan-400" />
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Study Intensity:</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
                {(['fast', 'regular', 'relaxed'] as const).map((pace) => (
                  <button
                    key={pace}
                    onClick={() => setStudyPace(pace)}
                    className={`flex-1 py-1 px-2 rounded-md text-[11px] font-medium capitalize transition-all duration-200 ${
                      studyPace === pace
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {pace === 'fast' ? 'Fast' : pace === 'regular' ? 'Standard' : 'Relaxed'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Days Remaining</span>
                <p className="text-2xl font-bold font-sans text-white">{estimatedDaysRemaining}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Target Date</span>
                <p className="text-sm font-bold font-sans text-white mt-1.5">{formattedTargetDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Readiness Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between" id="readiness-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Exam Readiness</h3>
            <Award size={24} className="text-yellow-500" />
          </div>
          
          <div className="flex items-center space-x-5 py-2">
            {/* Circular score gauge */}
            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - Math.min(100, Math.max(0, examReadinessScore)) / 100)}
                  className={`transition-all duration-1000 ${
                    examReadinessScore < 50
                      ? 'text-rose-500'
                      : examReadinessScore < 75
                      ? 'text-amber-500'
                      : examReadinessScore < 85
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white">{examReadinessScore}%</span>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-xs font-semibold text-slate-300">
                {examReadinessScore < 50
                  ? 'Foundations Stage'
                  : examReadinessScore < 75
                  ? 'Gaining Momentum'
                  : examReadinessScore < 85
                  ? 'Ready to Book Exam!'
                  : 'Highly Prepared!'}
              </span>
              <p className="text-[11px] text-slate-400">
                {examReadinessScore < 50
                  ? 'Complete more roadmap modules and quizzes to raise score.'
                  : examReadinessScore < 75
                  ? 'Aim for an average score above 75% on practice quizzes.'
                  : examReadinessScore < 85
                  ? 'You meet standard guidelines! Recommended score is 80%+.'
                  : 'Fantastic! Ready to ace the CLF-C02 exam day.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Progress & Domains Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="progress-and-domains-section">
        
        {/* Progress Dashboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-7 space-y-5" id="progress-breakdown">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen size={18} className="text-cyan-400" />
              <span>Overall Program Progress</span>
            </h2>
            <span className="text-xs text-slate-400">3-Month Program</span>
          </div>

          <div className="space-y-4">
            {/* Roadmap progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Roadmap Weekly Modules</span>
                <span className="text-slate-400 font-semibold">{completedModulesCount} of {totalModulesCount} completed ({Math.round(roadmapProgress)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${roadmapProgress}%` }}
                />
              </div>
            </div>

            {/* Labs progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">AWS Free-Tier Hands-on Labs</span>
                <span className="text-slate-400 font-semibold">{completedLabsCount} of {totalLabsCount} completed ({Math.round(labsProgress)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${labsProgress}%` }}
                />
              </div>
            </div>

            {/* Flashcard Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Flashcards</span>
                <p className="text-lg font-bold text-slate-200 mt-1">{flashcards.length}</p>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Quiz Quests Taken</span>
                <p className="text-lg font-bold text-slate-200 mt-1">
                  {quizAttempts.reduce((sum, a) => sum + a.totalQuestions, 0)}
                </p>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Avg. Quiz Score</span>
                <p className="text-lg font-bold text-slate-200 mt-1">
                  {quizAttempts.length > 0 ? `${Math.round(avgQuizScore)}%` : '—'}
                </p>
              </div>
            </div>

            {/* Navigation Quick Links */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-2">Resume Your Studies:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => onNavigateToTab('roadmap')}
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-slate-300 text-xs text-center border border-slate-800 transition-all duration-200"
                >
                  Roadmap
                </button>
                <button
                  onClick={() => onNavigateToTab('flashcards')}
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-slate-300 text-xs text-center border border-slate-800 transition-all duration-200"
                >
                  Flashcards
                </button>
                <button
                  onClick={() => onNavigateToTab('quizzes')}
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-slate-300 text-xs text-center border border-slate-800 transition-all duration-200"
                >
                  Practice Quizzes
                </button>
                <button
                  onClick={() => onNavigateToTab('labs')}
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-slate-300 text-xs text-center border border-slate-800 transition-all duration-200"
                >
                  Console Labs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Breakdowns */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-5 space-y-4" id="domain-breakdowns">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp size={18} className="text-cyan-400" />
              <span>Exam Domain Proficiency</span>
            </h2>
          </div>

          <div className="space-y-3.5">
            {[
              { name: 'Cloud Concepts', weighting: '24%', icon: BrainCircuit, desc: '6 advantages, cloud deployment, shared responsibility' },
              { name: 'Security & Compliance', weighting: '30%', icon: Award, desc: 'IAM roles, Shield, WAF, compliance standards, AWS Artifact' },
              { name: 'Technology', weighting: '34%', icon: BookOpen, desc: 'VPC, EC2, S3, RDS, Well-Architected pillars, global infra' },
              { name: 'Billing & Pricing', weighting: '12%', icon: AlertCircle, desc: 'Cost Explorer, Budgets, calculator, Support plans' }
            ].map((domain) => {
              const stats = domainTotals[domain.name as keyof typeof domainTotals];
              const scorePercent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

              return (
                <div key={domain.name} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex items-start space-x-3">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 mt-0.5 text-slate-300">
                    <domain.icon size={16} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-200">{domain.name}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Weight: {domain.weighting}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{domain.desc}</p>
                    
                    {/* Performance progress indicator */}
                    <div className="pt-1 flex items-center space-x-2">
                      <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            scorePercent === null
                              ? 'bg-slate-800'
                              : scorePercent < 70
                              ? 'bg-rose-500'
                              : scorePercent < 85
                              ? 'bg-cyan-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${scorePercent ?? 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap min-w-[28px] text-right">
                        {scorePercent !== null ? `${scorePercent}%` : 'No data'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Weak Areas Alerts & Motivating Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="alerts-and-quote-row">
        
        {/* Automated Weak Spots review card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="weak-spots-card">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
            <AlertCircle size={16} className="text-rose-400" />
            <span>Weak-Area Reviews ({weakModules.length})</span>
          </h3>
          {weakModules.length === 0 ? (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 text-center flex flex-col items-center justify-center h-[120px]">
              <CheckCircle size={28} className="text-emerald-500 mb-1.5" />
              <p className="text-xs text-slate-300 font-medium">All completed weeks have high confidence!</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Modules with confidence &le; 3 appear here.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
              {weakModules.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onNavigateToTab('confidence')}
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 cursor-pointer transition-all duration-150"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-rose-400">Week {m.week} • Confidence {m.confidence}/5</span>
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{m.title}</h4>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-medium hover:underline">Re-review</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Motivational Cloud Block */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between" id="motivation-card">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">AWS Certified Cloud Practitioner Goal</span>
            <p className="text-xs italic text-slate-300 leading-relaxed pt-1">
              "The best way to study is short, focused daily sessions. Consistency is the secret sauce. Launch a server today, read about billing tomorrow, and test yourself on security the day after."
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-slate-800/80 pt-3 mt-4 text-[10px] text-slate-500">
            <span>Exam Code: CLF-C02</span>
            <span>Target Score: 700 / 1000 (70%)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
