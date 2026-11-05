'use client';

import React, { useState } from 'react';
import { X, Key, Sliders, Trash2 } from 'lucide-react';
import { GameSettings } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetAllStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAllStats
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(settings.customApiKey || '');
  const [keySaved, setKeySaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    onUpdateSettings({ customApiKey: apiKeyInput.trim() });
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
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
          <Sliders className="w-5 h-5 text-[#60a5fa]" />
          <h3 className="text-lg font-bold">Game Settings</h3>
        </div>

        {/* Word count setting */}
        <div className="mb-6 bg-[#17202d] p-3.5 rounded-xl border border-[#232e40]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] block mb-1">
            Words per Theme Puzzle
          </label>
          <p className="text-xs text-[#8595a8] mb-3">
            Choose how many clues must be solved before guessing the theme.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onUpdateSettings({ themeWordCount: count })}
                className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                  settings.themeWordCount === count
                    ? 'bg-[#3b82f6] border-[#60a5fa] text-white shadow-sm'
                    : 'bg-[#1b2533] border-[#29374c] text-[#8595a8] hover:text-[#f1f5f9]'
                }`}
              >
                {count} Words
              </button>
            ))}
          </div>
        </div>

        {/* Gemini API Key setting */}
        <div className="mb-6 bg-[#17202d] p-3.5 rounded-xl border border-[#232e40]">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
            <Key className="w-3.5 h-3.5 text-[#fbbf24]" />
            Gemini API Key (Optional)
          </div>
          <p className="text-xs text-[#8595a8] mb-2.5">
            The game works out of the box with curated puzzles. To enable unlimited on-the-fly AI generation, enter a free Gemini API key:
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-2 rounded-lg bg-[#111722] border border-[#2b394f] text-xs text-[#f1f5f9] placeholder-[#556377] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-3 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium transition-colors"
            >
              {keySaved ? 'Saved!' : 'Save'}
            </button>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#60a5fa] hover:underline mt-2 inline-block"
          >
            Get a free Gemini API key &rarr;
          </a>
        </div>

        {/* Clear stats */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all game stats?')) {
                onResetAllStats();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#26171a] hover:bg-[#3d1f23] text-[#f87171] border border-[#5e272d] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Player Statistics
          </button>
        </div>
      </div>
    </div>
  );
};
