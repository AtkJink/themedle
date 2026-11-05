'use client';

import React, { useState } from 'react';
import { UserStats, GameMode } from '@/lib/types';
import { X, Trophy, Share2, Check } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  currentMode: GameMode;
  classicShareData?: {
    guesses: string[];
    solution: string;
    puzzleNumber: number;
    won: boolean;
  };
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  classicShareData
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const classicWinPct =
    stats.classic.played > 0
      ? Math.round((stats.classic.won / stats.classic.played) * 100)
      : 0;

  const maxDistribution = Math.max(
    1,
    ...Object.values(stats.classic.distribution)
  );

  const handleShare = () => {
    if (!classicShareData) return;
    const { guesses, solution, puzzleNumber, won } = classicShareData;
    const count = won ? guesses.length : 'X';
    let text = `Themedle Daily #${puzzleNumber} ${count}/6\n\n`;

    guesses.forEach((g) => {
      let row = '';
      for (let i = 0; i < g.length; i++) {
        if (g[i] === solution[i]) {
          row += '🟩';
        } else if (solution.includes(g[i])) {
          row += '🟨';
        } else {
          row += '⬛';
        }
      }
      text += row + '\n';
    });

    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-md bg-[#131924] border border-[#232f42] rounded-2xl p-6 shadow-2xl text-[#f1f5f9]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8595a8] hover:text-[#f1f5f9] hover:bg-[#1f2838] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-[#f59e0b]" />
          <h3 className="text-lg font-bold">Statistics</h3>
        </div>

        {/* Section: Classic Wordle Stats */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold mb-2">
            Daily Classic
          </div>
          <div className="grid grid-cols-4 gap-2 text-center bg-[#18202d] p-3 rounded-xl border border-[#232e40]">
            <div>
              <div className="text-xl font-bold font-mono">{stats.classic.played}</div>
              <div className="text-[10px] text-[#8595a8]">Played</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono">{classicWinPct}%</div>
              <div className="text-[10px] text-[#8595a8]">Win %</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono">{stats.classic.currentStreak}</div>
              <div className="text-[10px] text-[#8595a8]">Current Streak</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono">{stats.classic.maxStreak}</div>
              <div className="text-[10px] text-[#8595a8]">Max Streak</div>
            </div>
          </div>

          {/* Guess Distribution */}
          <div className="mt-4">
            <div className="text-xs text-[#94a3b8] font-medium mb-2">Guess Distribution</div>
            <div className="space-y-1.5">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const count = stats.classic.distribution[num] || 0;
                const pct = Math.max(8, Math.round((count / maxDistribution) * 100));
                return (
                  <div key={num} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-3 text-right text-[#8595a8]">{num}</span>
                    <div className="flex-1 bg-[#171f2c] rounded overflow-hidden">
                      <div
                        className="bg-[#386c4e] text-white text-[11px] font-bold px-2 py-0.5 rounded transition-all text-right"
                        style={{ width: `${pct}%` }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Theme Detective Stats */}
        <div className="pt-4 border-t border-[#232f42] mb-6">
          <div className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold mb-2">
            Theme Detective
          </div>
          <div className="grid grid-cols-3 gap-2 text-center bg-[#18202d] p-3 rounded-xl border border-[#232e40]">
            <div>
              <div className="text-xl font-bold font-mono">{stats.theme.played}</div>
              <div className="text-[10px] text-[#8595a8]">Games Played</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono">{stats.theme.allWordsSolved}</div>
              <div className="text-[10px] text-[#8595a8]">Words Solved</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono">{stats.theme.themeCorrect}</div>
              <div className="text-[10px] text-[#8595a8]">Themes Deduced</div>
            </div>
          </div>
        </div>

        {/* Share Button (if classic puzzle is done) */}
        {classicShareData && (
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-xl bg-[#3b7352] hover:bg-[#458560] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#86efac]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Daily Score</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
