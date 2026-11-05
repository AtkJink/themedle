'use client';

import React from 'react';
import { GameMode } from '@/lib/types';
import { HelpCircle, BarChart3, Settings, RotateCcw, Sparkles, Calendar } from 'lucide-react';

interface HeaderProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onResetThemeGame?: () => void;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  onOpenHelp,
  onOpenStats,
  onOpenSettings,
  onResetThemeGame,
  isGenerating
}) => {
  return (
    <header className="w-full border-b border-[#232c38] bg-[#111620]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Brand title & mode toggle */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-wider text-lg sm:text-xl text-[#f1f5f9]">
                THEME<span className="text-[#4da879]">DLE</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#1e2736] text-[#94a3b8] font-mono border border-[#2e3b50]">
                {mode === 'theme' ? 'AI Theme' : 'Daily'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher Pills */}
        <div className="flex items-center bg-[#171f2b] p-0.5 rounded-lg border border-[#263345]">
          <button
            onClick={() => onSelectMode('theme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'theme'
                ? 'bg-[#2b394f] text-[#f1f5f9] shadow-sm'
                : 'text-[#8595a8] hover:text-[#cbd5e1]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5bb688]" />
            <span className="hidden sm:inline">Theme</span> Detective
          </button>
          <button
            onClick={() => onSelectMode('classic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'classic'
                ? 'bg-[#2b394f] text-[#f1f5f9] shadow-sm'
                : 'text-[#8595a8] hover:text-[#cbd5e1]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#cfa54c]" />
            <span className="hidden sm:inline">Daily</span> Classic
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {mode === 'theme' && onResetThemeGame && (
            <button
              onClick={onResetThemeGame}
              disabled={isGenerating}
              title="Generate New Theme Puzzle"
              className="p-2 rounded-lg text-[#8595a8] hover:text-[#f1f5f9] hover:bg-[#1a2332] transition-colors disabled:opacity-40"
            >
              <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            onClick={onOpenStats}
            title="Player Stats"
            className="p-2 rounded-lg text-[#8595a8] hover:text-[#f1f5f9] hover:bg-[#1a2332] transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelp}
            title="How to Play"
            className="p-2 rounded-lg text-[#8595a8] hover:text-[#f1f5f9] hover:bg-[#1a2332] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-lg text-[#8595a8] hover:text-[#f1f5f9] hover:bg-[#1a2332] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
