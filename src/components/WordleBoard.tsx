'use client';

import React from 'react';
import { TileState } from '@/lib/types';
import { evaluateWordleGuess } from '@/lib/gameEngine';

interface WordleBoardProps {
  targetWord: string;
  guesses: string[];
  currentInput: string;
  maxGuesses?: number;
  isShaking?: boolean;
}

export const WordleBoard: React.FC<WordleBoardProps> = ({
  targetWord,
  guesses,
  currentInput,
  maxGuesses = 6,
  isShaking = false
}) => {
  const wordLength = targetWord.length;
  const rows = [];

  // Tile size dynamic classes based on word length
  const getTileSizeClass = (len: number) => {
    if (len <= 4) return 'w-13 h-13 sm:w-15 sm:h-15 text-2xl';
    if (len === 5) return 'w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl';
    if (len === 6) return 'w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl';
    if (len === 7) return 'w-9 h-9 sm:w-11 sm:h-11 text-base sm:text-lg';
    return 'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base';
  };

  const tileSize = getTileSizeClass(wordLength);

  for (let r = 0; r < maxGuesses; r++) {
    const isSubmitted = r < guesses.length;
    const isCurrent = r === guesses.length;

    let rowLetters: string[] = [];
    let rowStates: TileState[] = [];

    if (isSubmitted) {
      const guess = guesses[r];
      rowLetters = guess.split('');
      rowStates = evaluateWordleGuess(guess, targetWord);
    } else if (isCurrent) {
      rowLetters = currentInput.split('');
    }

    const tiles = [];
    for (let c = 0; c < wordLength; c++) {
      const letter = rowLetters[c] || '';
      const state: TileState = isSubmitted ? rowStates[c] : letter ? 'tbd' : 'empty';

      let stateClasses = 'bg-[#121720] border-[#222b38] text-white';

      if (state === 'correct') {
        stateClasses = 'bg-[#3b7352] border-[#4b8e66] text-[#ffffff] shadow-sm';
      } else if (state === 'present') {
        stateClasses = 'bg-[#9e7935] border-[#ba8f41] text-[#ffffff] shadow-sm';
      } else if (state === 'absent') {
        stateClasses = 'bg-[#1f2633] border-[#293344] text-[#717d91]';
      } else if (state === 'tbd') {
        stateClasses = 'bg-[#18202c] border-[#4a586d] text-white animate-pop';
      }

      tiles.push(
        <div
          key={c}
          className={`flex items-center justify-center font-bold font-mono uppercase rounded-lg border transition-all duration-200 select-none ${tileSize} ${stateClasses} ${
            isSubmitted ? 'tile-flip' : ''
          }`}
          style={{
            animationDelay: isSubmitted ? `${c * 80}ms` : undefined
          }}
        >
          {letter}
        </div>
      );
    }

    rows.push(
      <div
        key={r}
        className={`flex justify-center gap-1.5 sm:gap-2 ${
          isCurrent && isShaking ? 'animate-shake' : ''
        }`}
      >
        {tiles}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-2 sm:py-4">
      <div className="flex flex-col gap-1.5 sm:gap-2">{rows}</div>
    </div>
  );
};
