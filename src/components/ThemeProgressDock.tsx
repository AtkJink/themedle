'use client';

import React from 'react';
import { Check, Lock, Sparkles, HelpCircle } from 'lucide-react';

interface ThemeProgressDockProps {
  words: string[];
  solvedWords: (string | null)[];
  currentWordIndex: number;
  isDeductionPhase: boolean;
  onJumpToDeduction?: () => void;
  onRevealCurrentWord?: () => void;
  activeWordCompleted?: boolean;
}

export const ThemeProgressDock: React.FC<ThemeProgressDockProps> = ({
  words,
  solvedWords,
  currentWordIndex,
  isDeductionPhase,
  onRevealCurrentWord,
  activeWordCompleted
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-3 pb-2">
      <div className="bg-[#141b25] border border-[#232c38] rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Theme Clues Sequence
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1e2838] text-[#a5b4fc] border border-[#2e3e56] font-mono">
              {isDeductionPhase ? 'Final Phase' : `Word ${currentWordIndex + 1} of ${words.length}`}
            </span>
          </div>

          {!isDeductionPhase && onRevealCurrentWord && !activeWordCompleted && (
            <button
              onClick={onRevealCurrentWord}
              className="text-[11px] text-[#64748b] hover:text-[#94a3b8] transition-colors underline decoration-dotted"
              title="Reveal this word and continue to the next"
            >
              Skip word
            </button>
          )}
        </div>

        {/* Badges for each word */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {words.map((targetWord, idx) => {
            const isSolved = Boolean(solvedWords[idx]);
            const isCurrent = idx === currentWordIndex && !isDeductionPhase;
            const isFuture = idx > currentWordIndex && !isDeductionPhase;

            return (
              <div
                key={idx}
                className={`relative px-2.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                  isSolved
                    ? 'bg-[#1b2f25] border-[#2d5740] text-[#7ee787]'
                    : isCurrent
                    ? 'bg-[#202938] border-[#3b82f6]/40 text-[#f1f5f9] ring-1 ring-[#3b82f6]/30'
                    : 'bg-[#12161f] border-[#1e2634] text-[#64748b]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8595a8] font-mono">
                    #{idx + 1} ({targetWord.length}L)
                  </span>
                  {isSolved ? (
                    <Check className="w-3.5 h-3.5 text-[#5bb688]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                  ) : (
                    <Lock className="w-3 h-3 text-[#475569]" />
                  )}
                </div>

                <div className="mt-1 font-mono tracking-wider font-semibold truncate text-[13px]">
                  {isSolved ? solvedWords[idx] : isCurrent ? '· '.repeat(targetWord.length) : '· · · ·'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
