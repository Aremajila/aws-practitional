import React, { useState, useEffect } from 'react';
import { StudyState, WeeklyModule, Flashcard, LabTask, QuizAttempt } from './types';
import { INITIAL_MODULES, INITIAL_FLASHCARDS, INITIAL_LABS, QUIZ_QUESTIONS } from './data/studyData';
import OverviewDashboard from './components/OverviewDashboard';
import RoadmapDashboard from './components/RoadmapDashboard';
import ConfidenceTracker from './components/ConfidenceTracker';
import FlashcardSystem from './components/FlashcardSystem';
import QuizEngine from './components/QuizEngine';
import LabChecklist from './components/LabChecklist';
import AIAssistant from './components/AIAssistant';

import {
  LayoutDashboard,
  BookOpen,
  Award,
  BookmarkCheck,
  Trophy,
  Terminal,
  BrainCircuit,
  Flame,
  CloudLightning,
  AlertCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'aws_foundation_tracker_state_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Context passing state (e.g., clicking Ask AI Tutor on low confidence cards triggers AI panel automatically with context)
  const [aiSubjectContext, setAiSubjectContext] = useState<string>('');

  // 1. Initialize State (Load from localStorage if exists, else seed defaults)
  const [state, setState] = useState<StudyState>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read localStorage study state:', e);
    }
    
    // Fallback Seed State
    return {
      modules: INITIAL_MODULES,
      flashcards: INITIAL_FLASHCARDS,
      labTasks: INITIAL_LABS,
      quizAttempts: [],
      streak: {
        current: 1, // Start with a friendly 1 day streak
        lastStudiedDate: new Date().toISOString(),
      },
      studyPace: 'regular',
    };
  });

  // 2. Persist State updates to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save study state to localStorage:', e);
    }
  }, [state]);

  // 3. State Modifier Functions
  
  // Toggle Module completed status
  const handleToggleModule = (id: string) => {
    setState((prev) => {
      const updatedModules = prev.modules.map((m) => {
        if (m.id === id) {
          const completed = !m.completed;
          return {
            ...m,
            completed,
            // Reset confidence to 0 if marking incomplete
            confidence: completed ? m.confidence : 0,
          };
        }
        return m;
      });

      // Advance/Refresh Streak daily on completions
      const updatedStreak = checkAndUpdateStreak(prev.streak);

      return {
        ...prev,
        modules: updatedModules,
        streak: updatedStreak,
      };
    });
  };

  // Set Module Confidence
  const handleSetConfidence = (id: string, confidence: number) => {
    setState((prev) => {
      const updatedModules = prev.modules.map((m) => {
        if (m.id === id) {
          return { ...m, confidence };
        }
        return m;
      });
      return { ...prev, modules: updatedModules };
    });
  };

  // Grade/Order Flashcards Spaced Repetition queue
  const handleGradeFlashcard = (id: string, grade: 'easy' | 'medium' | 'hard') => {
    setState((prev) => {
      // Re-order flashcards queue based on spaced repetition grading
      const cardToUpdateIdx = prev.flashcards.findIndex((c) => c.id === id);
      if (cardToUpdateIdx === -1) return prev;

      const updatedCards = [...prev.flashcards];
      const card = { ...updatedCards[cardToUpdateIdx] };
      
      card.difficulty = grade;
      card.reviewCount += 1;

      // Spaced Repetitive movement:
      // Remove card from its current index
      updatedCards.splice(cardToUpdateIdx, 1);

      if (grade === 'hard') {
        // Appears very soon: insert near front of current review (e.g., position 2-3)
        const insertPos = Math.min(updatedCards.length, 2);
        updatedCards.splice(insertPos, 0, card);
      } else if (grade === 'medium') {
        // Appears midway: insert in middle of deck
        const insertPos = Math.floor(updatedCards.length / 2);
        updatedCards.splice(insertPos, 0, card);
      } else {
        // Appears later: insert at the very end
        updatedCards.push(card);
      }

      const updatedStreak = checkAndUpdateStreak(prev.streak);

      return {
        ...prev,
        flashcards: updatedCards,
        streak: updatedStreak,
      };
    });
  };

  // Create new Custom Flashcard
  const handleAddCustomFlashcard = (front: string, back: string, domain: string) => {
    const newCard: Flashcard = {
      id: `custom-${Date.now()}`,
      front,
      back,
      domain,
      reviewCount: 0,
    };
    setState((prev) => ({
      ...prev,
      flashcards: [newCard, ...prev.flashcards],
    }));
  };

  // Toggle Hands-on Console Lab completed checklist status
  const handleToggleLab = (id: string) => {
    setState((prev) => {
      const updatedLabs = prev.labTasks.map((lab) => {
        if (lab.id === id) {
          return { ...lab, completed: !lab.completed };
        }
        return lab;
      });

      const updatedStreak = checkAndUpdateStreak(prev.streak);

      return {
        ...prev,
        labTasks: updatedLabs,
        streak: updatedStreak,
      };
    });
  };

  // Save Quiz results to ledger
  const handleSaveQuizAttempt = (attempt: QuizAttempt) => {
    setState((prev) => {
      const updatedAttempts = [...prev.quizAttempts, attempt];
      const updatedStreak = checkAndUpdateStreak(prev.streak);
      return {
        ...prev,
        quizAttempts: updatedAttempts,
        streak: updatedStreak,
      };
    });
  };

  // Change Study intensity pace selection
  const handleSetStudyPace = (studyPace: 'fast' | 'regular' | 'relaxed') => {
    setState((prev) => ({ ...prev, studyPace }));
  };

  // Manual study streak logger trigger
  const handleLogStreakManual = () => {
    setState((prev) => {
      const todayStr = new Date().toDateString();
      let currentStreak = prev.streak.current;

      if (!prev.streak.lastStudiedDate) {
        currentStreak = 1;
      } else {
        const lastDate = new Date(prev.streak.lastStudiedDate);
        const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(lastDate.toDateString()).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1; // Studied consecutively, increase
        } else if (diffDays > 1) {
          currentStreak = 1; // Reset streak
        }
      }

      return {
        ...prev,
        streak: {
          current: currentStreak,
          lastStudiedDate: new Date().toISOString(),
        },
      };
    });
  };

  // Internal helper to update streaks during user interactive checklists automatically
  const checkAndUpdateStreak = (currentStreakState: { current: number; lastStudiedDate: string | null }) => {
    const todayStr = new Date().toDateString();
    
    if (!currentStreakState.lastStudiedDate) {
      return {
        current: 1,
        lastStudiedDate: new Date().toISOString(),
      };
    }

    const lastDate = new Date(currentStreakState.lastStudiedDate);
    const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(lastDate.toDateString()).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return {
        current: currentStreakState.current + 1,
        lastStudiedDate: new Date().toISOString(),
      };
    } else if (diffDays > 1) {
      return {
        current: 1,
        lastStudiedDate: new Date().toISOString(),
      };
    }

    return currentStreakState; // same day, no change
  };

  // Complete data reset option (allows wiping progress to restart)
  const handleWipeState = () => {
    if (confirm('Are you sure you want to reset all your progress, custom flashcards, and quiz history? This is irreversible.')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setState({
        modules: INITIAL_MODULES,
        flashcards: INITIAL_FLASHCARDS,
        labTasks: INITIAL_LABS,
        quizAttempts: [],
        streak: {
          current: 1,
          lastStudiedDate: new Date().toISOString(),
        },
        studyPace: 'regular',
      });
      setActiveTab('dashboard');
    }
  };

  // Safe navigation function with potential topic contexts (for Needs Review links)
  const handleTabNavigationWithContext = (tab: string, context?: any) => {
    if (context) {
      setAiSubjectContext(context);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row antialiased">
      
      {/* 1. MASTER WORKSPACE NAVIGATION PANEL (Left Drawer) */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0" id="main-sidebar">
        
        <div className="space-y-6 py-5 px-4">
          {/* Logo Brand Frame */}
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-teal-500 rounded-xl shadow-lg shadow-cyan-950/40 text-slate-950">
              <CloudLightning size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight">AWS Foundation</h1>
              <span className="text-[10px] text-cyan-400 font-extrabold tracking-wider uppercase block">CLF-C02 Tracker</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" id="sidebar-navigation">
            {[
              { id: 'dashboard', label: 'Study Dashboard', icon: LayoutDashboard },
              { id: 'roadmap', label: '12-Week Roadmap', icon: BookOpen },
              { id: 'confidence', label: 'Confidence curve', icon: TrendingUp },
              { id: 'flashcards', label: 'Flashcard deck', icon: BookmarkCheck },
              { id: 'quizzes', label: 'Practice Exams', icon: Trophy },
              { id: 'labs', label: 'AWS Console Labs', icon: Terminal },
              { id: 'assistant', label: 'AI study Assistant', icon: BrainCircuit }
            ].map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabNavigationWithContext(link.id)}
                  className={`w-full flex items-center space-x-3.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-950/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                  }`}
                  id={`nav-tab-${link.id}`}
                >
                  <Icon size={16} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8] text-slate-450'} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workspace Controls & Credit */}
        <div className="p-4 border-t border-slate-800/85 space-y-3.5">
          {/* Study streak tracker */}
          <div className="bg-slate-950/65 py-2 px-3 rounded-xl border border-slate-850 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold flex items-center">
              <Flame size={13} className="text-orange-500 mr-1.5 animate-pulse" />
              <span>Consecutive days:</span>
            </span>
            <span className="text-xs font-black text-white">{state.streak.current} d</span>
          </div>

          <button
            onClick={handleWipeState}
            className="w-full py-2 bg-slate-950/40 hover:bg-rose-950/15 border border-slate-850 hover:border-rose-900/40 text-[10px] text-slate-500 hover:text-rose-400 rounded-lg transition-all duration-150 font-bold flex items-center justify-center space-x-1"
          >
            <RotateCcw size={12} />
            <span>Reset All Progress</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN APPLICATION CONTENT CANVAS */}
      <main className="flex-1 flex flex-col min-w-0" id="main-content-canvas">
        
        {/* Top Header info bar */}
        <header className="bg-slate-900/60 border-b border-slate-800/60 py-4 px-6 sm:px-8 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-300 capitalize">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'roadmap' && '12-Week Roadmap Scheduler'}
              {activeTab === 'confidence' && 'Topic Confidence Curve'}
              {activeTab === 'flashcards' && 'Spaced Repetition Flashcards'}
              {activeTab === 'quizzes' && 'Timed Exam & Quiz Engine'}
              {activeTab === 'labs' && 'AWS Free-Tier Console Labs'}
              {activeTab === 'assistant' && 'AI Study Assistant (Trained on CLF-C02)'}
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold">
              Self-paced preparation workspace • Complete local storage persistency
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-slate-400 font-bold bg-slate-950/50 border border-slate-850 py-1 px-3 rounded-full hidden sm:inline-block">
              Exam Target: AWS Certified Cloud Practitioner
            </span>
          </div>
        </header>

        {/* Render Tab Contents inside smooth scrolling wrapper */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              state={state}
              setStudyPace={handleSetStudyPace}
              onLogStreak={handleLogStreakManual}
              onNavigateToTab={handleTabNavigationWithContext}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapDashboard
              modules={state.modules}
              onToggleModule={handleToggleModule}
              onSetConfidence={handleSetConfidence}
            />
          )}

          {activeTab === 'confidence' && (
            <ConfidenceTracker
              modules={state.modules}
              onNavigateToTab={handleTabNavigationWithContext}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardSystem
              flashcards={state.flashcards}
              onAddCustomCard={handleAddCustomFlashcard}
              onGradeCard={handleGradeFlashcard}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizEngine
              questionBank={QUIZ_QUESTIONS}
              attempts={state.quizAttempts}
              onSaveAttempt={handleSaveQuizAttempt}
            />
          )}

          {activeTab === 'labs' && (
            <LabChecklist
              labs={state.labTasks}
              onToggleLab={handleToggleLab}
            />
          )}

          {activeTab === 'assistant' && (
            <AIAssistant
              initialSubject={aiSubjectContext}
              onClearSubjectContext={() => setAiSubjectContext('')}
            />
          )}

        </div>

      </main>

    </div>
  );
}
