'use client';

import React, { useState } from 'react';
import { WordTheme, ThemeEvaluationResult } from '@/lib/types';
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ThemeDeductionPhaseProps {
  themeData: WordTheme;
  solvedWords: string[];
  onPlayNext: () => void;
  customApiKey?: string;
  onThemeSolved: () => void;
}

export const ThemeDeductionPhase: React.FC<ThemeDeductionPhaseProps> = ({
  themeData,
  solvedWords,
  onPlayNext,
  customApiKey,
  onThemeSolved
}) => {
  const [guess, setGuess] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<ThemeEvaluationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || isEvaluating || result?.isCorrect) return;

    setIsEvaluating(true);
    setResult(null);

    try {
      const res = await fetch('/api/theme/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guess: guess.trim(),
          theme: themeData.theme,
          clue: themeData.clue,
          acceptableKeywords: themeData.acceptableKeywords,
          words: themeData.words,
          customApiKey
        })
      });

      const data: ThemeEvaluationResult = await res.json();
      setResult(data);
      setAttemptsCount((prev) => prev + 1);

      if (data.isCorrect) {
        onThemeSolved();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4ade80', '#38bdf8', '#fbbf24', '#c084fc']
        });
      }
    } catch {
      setResult({
        isCorrect: false,
        confidence: 'incorrect',
        message: 'Could not reach the evaluation service. Please try again.'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRevealAnswer = () => {
    setHasRevealedAnswer(true);
    setResult({
      isCorrect: false,
      confidence: 'incorrect',
      message: `The connecting theme was "${themeData.theme}".`,
      actualTheme: themeData.theme
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 animate-pop">
      <div className="bg-[#141b25] border border-[#232c38] rounded-2xl p-5 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2736] text-[#93c5fd] text-xs font-medium border border-[#2b3a50] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#60a5fa]" />
            Final Stage: Theme Deduction
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
            What connects these words?
          </h2>
          <p className="text-xs sm:text-sm text-[#8595a8] mt-1">
            Examine your solved clues below and deduce the overarching theme.
          </p>
        </div>

        {/* Revealed Words Grid */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {solvedWords.map((word, idx) => (
            <div
              key={idx}
              className="px-3.5 py-2 rounded-xl bg-[#1b2636] border border-[#2d3f57] font-mono font-bold tracking-widest text-[#f8fafc] text-sm sm:text-base shadow-sm"
            >
              {word}
            </div>
          ))}
        </div>

        {/* Clue/Hint Box */}
        {showHint ? (
          <div className="mb-5 p-3 rounded-xl bg-[#182333] border border-[#2b3d56] text-xs text-[#cbd5e1] flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#93c5fd] block mb-0.5">Subtle Hint:</span>
              {themeData.clue}
            </div>
          </div>
        ) : (
          <div className="text-center mb-5">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs text-[#718298] hover:text-[#93c5fd] transition-colors underline decoration-dotted"
            >
              Need a clue? Reveal subtle hint
            </button>
          </div>
        )}

        {/* Guess Input Form */}
        {!result?.isCorrect && !hasRevealedAnswer && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="e.g. Space Exploration, Types of Coffee..."
                disabled={isEvaluating}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#1a2332] border border-[#2b394f] text-[#f1f5f9] placeholder-[#64748b] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isEvaluating || !guess.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-[#3b7352] hover:bg-[#458560] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                {isEvaluating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI is grading your deduction...
                  </>
                ) : (
                  <>
                    <span>Submit Theme Guess</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {attemptsCount >= 2 && (
                <button
                  type="button"
                  onClick={handleRevealAnswer}
                  className="px-3 py-3 rounded-xl bg-[#1e2736] hover:bg-[#283447] text-[#94a3b8] hover:text-[#f1f5f9] text-xs font-medium border border-[#2e3b50] transition-colors"
                >
                  Give Up
                </button>
              )}
            </div>
          </form>
        )}

        {/* Result Feedback Banner */}
        {result && (
          <div
            className={`mt-4 p-4 rounded-xl border text-sm flex items-start gap-3 transition-all ${
              result.isCorrect
                ? 'bg-[#183124] border-[#295e42] text-[#dcfce7]'
                : 'bg-[#2b1f1a] border-[#563428] text-[#fed7aa]'
            }`}
          >
            {result.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-[#fb923c] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-sm">
                {result.isCorrect ? 'Outstanding Deduction!' : 'Not Quite There'}
              </div>
              <div className="text-xs mt-0.5 opacity-90">{result.message}</div>
              {result.actualTheme && (
                <div className="mt-2 text-xs font-medium text-[#93c5fd]">
                  Theme: <span className="font-bold">{result.actualTheme}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action: Next Puzzle Button */}
        {(result?.isCorrect || hasRevealedAnswer) && (
          <div className="mt-5 text-center">
            <button
              onClick={onPlayNext}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Theme Puzzle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
