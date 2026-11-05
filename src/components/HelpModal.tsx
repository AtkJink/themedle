'use client';

import React from 'react';
import { X, Sparkles, Calendar } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-md bg-[#131924] border border-[#232f42] rounded-2xl p-6 shadow-2xl text-[#f1f5f9] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8595a8] hover:text-[#f1f5f9] hover:bg-[#1f2838] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-4">How to Play</h3>

        {/* Section 1: Theme Detective */}
        <div className="mb-5 bg-[#17202d] p-3.5 rounded-xl border border-[#253245]">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#60a5fa] mb-1.5">
            <Sparkles className="w-4 h-4 text-[#60a5fa]" />
            Theme Detective Mode
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            1. Solve a sequence of secret words (usually 3 to 6 words) of varying lengths.
          </p>
          <p className="text-xs text-[#cbd5e1] leading-relaxed mt-1">
            2. Each word you solve is a clue. All words share a hidden connecting theme (e.g. <em>Astronomy</em>, <em>Baking</em>, <em>Medieval Times</em>).
          </p>
          <p className="text-xs text-[#cbd5e1] leading-relaxed mt-1">
            3. Once all words are revealed, enter the <strong>Theme Deduction</strong> stage and guess what connects them. The AI evaluates your answer!
          </p>
        </div>

        {/* Section 2: Daily Classic */}
        <div className="mb-5 bg-[#17202d] p-3.5 rounded-xl border border-[#253245]">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#fbbf24] mb-1.5">
            <Calendar className="w-4 h-4 text-[#fbbf24]" />
            Daily Classic Wordle
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Guess the daily 5-letter word in 6 tries. A new word is generated every day at midnight UTC, identical for players worldwide.
          </p>
        </div>

        {/* Section 3: Tile Colors */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2.5">
            Tile Feedback
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#3b7352] border border-[#4b8e66] flex items-center justify-center font-bold font-mono text-white">
                W
              </div>
              <span className="text-[#cbd5e1]">
                <strong>Green:</strong> Letter is in the word and in the correct spot.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#9e7935] border border-[#ba8f41] flex items-center justify-center font-bold font-mono text-white">
                I
              </div>
              <span className="text-[#cbd5e1]">
                <strong>Amber:</strong> Letter is in the word, but in the wrong spot.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#1f2633] border border-[#293344] flex items-center justify-center font-bold font-mono text-[#717d91]">
                N
              </div>
              <span className="text-[#cbd5e1]">
                <strong>Gray:</strong> Letter is not in the word in any spot.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-xs transition-colors"
        >
          Got it, let's play!
        </button>
      </div>
    </div>
  );
};
