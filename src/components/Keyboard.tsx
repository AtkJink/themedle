'use client';

import React, { useEffect, useCallback } from 'react';
import { TileState } from '@/lib/types';
import { Delete } from 'lucide-react';

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  keyStatuses: Record<string, TileState>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export const Keyboard: React.FC<KeyboardProps> = ({
  onChar,
  onEnter,
  onDelete,
  keyStatuses,
  disabled = false
}) => {
  const handleKeyClick = (key: string) => {
    if (disabled) return;
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACKSPACE') {
      onDelete();
    } else {
      onChar(key);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;
      // Don't intercept if user is typing into an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onDelete();
      } else {
        const char = e.key.toUpperCase();
        if (/^[A-Z]$/.test(char)) {
          e.preventDefault();
          onChar(char);
        }
      }
    },
    [disabled, onChar, onDelete, onEnter]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getKeyClasses = (key: string) => {
    const status = keyStatuses[key];
    const isSpecial = key === 'ENTER' || key === 'BACKSPACE';

    let base =
      'flex items-center justify-center font-semibold rounded-md transition-all active:scale-95 select-none text-xs sm:text-sm h-12 sm:h-13 ';

    if (isSpecial) {
      base += 'px-2 sm:px-3 text-[11px] sm:text-xs font-bold ';
    } else {
      base += 'flex-1 max-w-[42px] ';
    }

    if (status === 'correct') {
      return base + 'bg-[#3b7352] text-white border border-[#4b8e66]';
    }
    if (status === 'present') {
      return base + 'bg-[#9e7935] text-white border border-[#ba8f41]';
    }
    if (status === 'absent') {
      return base + 'bg-[#181f2a] text-[#556377] border border-[#202938]';
    }

    return base + 'bg-[#232c3a] text-[#e2e8f0] hover:bg-[#2e3a4d] border border-[#2d384a] shadow-sm';
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 py-3">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const isBackspace = key === 'BACKSPACE';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyClick(key)}
                  disabled={disabled}
                  className={getKeyClasses(key)}
                >
                  {isBackspace ? <Delete className="w-4 h-4 sm:w-5 sm:h-5" /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
