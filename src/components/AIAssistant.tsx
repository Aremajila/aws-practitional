import React, { useState, useRef, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { Send, Sparkles, BrainCircuit, RotateCcw, ShieldQuestion, HelpCircle, Check, X, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  conceptName?: string; // used to link "Quiz me on this" to a topic
  customQuiz?: QuizQuestion[];
  userQuizAnswers?: Record<number, number>; // questionIndex -> selectedOptionIndex
}

interface AIAssistantProps {
  initialSubject?: string;
  onClearSubjectContext?: () => void;
}

export default function AIAssistant({
  initialSubject = '',
  onClearSubjectContext,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I am your personal AWS Academy Study Assistant. I'm trained to help you understand anything on the AWS Certified Cloud Practitioner (CLF-C02) exam syllabus.\n\nAsk me about any services, billing models, or security policies. I will provide a clear explanation, an everyday analogy, and a real-world AWS use-case. Whenever you want to test yourself on a topic, just click **'Quiz me on this'** next to my answer!",
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Loading state for dynamic quiz generation
  const [generatingQuizForId, setGeneratingQuizForId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, generatingQuizForId]);

  // Handle initial subject passed from other tabs (e.g., Needs Review links)
  useEffect(() => {
    if (initialSubject) {
      handleSendQuery(`Tell me about: ${initialSubject}`);
      if (onClearSubjectContext) onClearSubjectContext();
    }
  }, [initialSubject]);

  const handleSendQuery = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isSending) return;

    if (!textToSend) setInputMessage('');

    // Append User Message
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      // Map chat history to send to server
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Infer an AWS concept name from the query for the "Quiz me on this" context
      let inferredConcept = query.replace(/tell me about|explain|what is|how does/gi, '').trim();
      if (inferredConcept.length > 25) {
        inferredConcept = inferredConcept.substring(0, 25) + '...';
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text || 'Sorry, I failed to formulate a response.',
        conceptName: inferredConcept || 'this AWS concept',
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Error contacting assistant:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'model',
          text: `⚠️ **API Connection Error**: ${err.message || 'The server failed to respond. Make sure you have configured your GEMINI_API_KEY in secrets.'}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Trigger server-side dynamic quiz generation
  const handleQuizMeOnThis = async (messageId: string, concept: string) => {
    if (generatingQuizForId) return;

    setGeneratingQuizForId(messageId);

    try {
      const res = await fetch('/api/ai-assistant/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.questions && data.questions.length > 0) {
        // Find message and attach the custom quiz
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              return {
                ...msg,
                customQuiz: data.questions,
                userQuizAnswers: {},
              };
            }
            return msg;
          })
        );
      }
    } catch (err: any) {
      console.error('Quiz generation failed:', err);
      alert(`Could not generate quiz: ${err.message || 'Verify your API secrets.'}`);
    } finally {
      setGeneratingQuizForId(null);
    }
  };

  // Inline quiz option selection handler
  const handleSelectInlineQuizAnswer = (messageId: string, questionIdx: number, optionIdx: number) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            userQuizAnswers: {
              ...(msg.userQuizAnswers || {}),
              [questionIdx]: optionIdx,
            },
          };
        }
        return msg;
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  // Standard study assistant topic chips
  const QUICK_START_CHIPS = [
    'Explain S3 Storage classes',
    'Shared Responsibility Model boundary',
    'Security Groups vs Network ACLs',
    'AWS support plans comparison',
  ];

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden" id="ai-chat-component">
      
      {/* Header bar */}
      <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
            <BrainCircuit size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">AWS Certified Cloud Practitioner AI Tutor</h3>
            <span className="text-[10px] text-slate-500 font-semibold">Gemini 3.5 Flash Active • Server Secured</span>
          </div>
        </div>
        
        <button
          onClick={() => setMessages([messages[0]])}
          className="text-[10px] text-slate-500 hover:text-slate-300 font-bold hover:underline flex items-center space-x-1"
        >
          <RotateCcw size={11} />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Messages Thread list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="ai-messages-thread">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950 text-slate-300 border border-slate-850 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {/* Text render */}
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Quiz Trigger button (Show on Model responses except welcome/error) */}
                {!isUser && msg.id !== 'welcome' && !msg.id.startsWith('error') && !msg.customQuiz && (
                  <div className="border-t border-slate-900 mt-3 pt-3 flex justify-end">
                    <button
                      onClick={() => handleQuizMeOnThis(msg.id, msg.conceptName || 'this AWS service')}
                      disabled={generatingQuizForId !== null}
                      className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/20 hover:border-cyan-500 text-[10px] font-bold py-1.5 px-3.5 rounded-xl transition-all duration-200 flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <ShieldQuestion size={12} />
                      <span>
                        {generatingQuizForId === msg.id ? 'Generating Quiz...' : `Quiz me on "${msg.conceptName}"`}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Quiz Widget inside model message */}
              {!isUser && msg.customQuiz && (
                <div className="mt-3 bg-slate-950 border border-cyan-950 rounded-2xl p-4 w-full max-w-[85%] space-y-4 animate-fadeIn" id={`inline-quiz-box-${msg.id}`}>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider flex items-center space-x-1.5">
                      <Sparkles size={11} className="animate-spin text-amber-400" />
                      <span>Interactive concept Check</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">3 Practice Questions</span>
                  </div>

                  <div className="space-y-4">
                    {msg.customQuiz.map((q, qIdx) => {
                      const userAnsIdx = msg.userQuizAnswers?.[qIdx];
                      const isAnswered = userAnsIdx !== undefined;

                      return (
                        <div key={qIdx} className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-850/60">
                          <p className="text-xs text-slate-200 font-bold leading-normal">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="space-y-1.5">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = userAnsIdx === oIdx;
                              const isCorrect = oIdx === q.correctAnswerIndex;

                              let btnStyle = 'border-slate-800 bg-slate-950/40 text-slate-300';
                              if (isSelected) {
                                btnStyle = isCorrect
                                  ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                                  : 'bg-rose-950/25 border-rose-500/40 text-rose-300';
                              } else if (isAnswered && isCorrect) {
                                btnStyle = 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={isAnswered}
                                  onClick={() => handleSelectInlineQuizAnswer(msg.id, qIdx, oIdx)}
                                  className={`w-full text-left text-[11px] p-2 rounded-lg border flex items-center justify-between transition-colors ${btnStyle}`}
                                >
                                  <span className="flex-1 pr-3 leading-normal">{opt}</span>
                                  {isAnswered && (
                                    <span>
                                      {isCorrect ? <Check size={12} className="text-emerald-400" /> : isSelected ? <X size={12} className="text-rose-400" /> : null}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Inline Question Rationale explanation block */}
                          {isAnswered && (
                            <div className="bg-slate-950 p-2.5 rounded-lg text-[10px] text-slate-400 leading-normal border border-slate-900 animate-fadeIn">
                              <strong>Tutor Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking Loader indicator */}
        {isSending && (
          <div className="flex flex-col items-start max-w-full animate-pulse">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 rounded-tl-none text-slate-500 text-xs flex items-center space-x-2">
              <Sparkles size={14} className="text-cyan-400 animate-spin" />
              <span className="font-semibold tracking-wide">AI Tutor formulating explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer input controls */}
      <div className="bg-slate-950 p-4 border-t border-slate-850 space-y-3">
        {/* Chips recommendation lists */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-1.5">
            {QUICK_START_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(chip)}
                className="text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 py-1 px-3 rounded-full transition-all duration-200"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <div className="flex items-center space-x-3">
          <textarea
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about VPC CIDRs, Support tiers, IAM Roles..."
            disabled={isSending}
            className="flex-1 bg-slate-900 text-xs text-slate-200 py-3 px-4 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none max-h-24"
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={!inputMessage.trim() || isSending}
            className={`p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              !inputMessage.trim() || isSending
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-755'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-950/20 active:scale-95'
            }`}
            id="ai-send-btn"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
