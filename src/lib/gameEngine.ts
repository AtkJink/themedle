import { TileState, UserStats } from './types';

/**
 * Standard Wordle guess evaluation algorithm with accurate handling of duplicate letters.
 */
export function evaluateWordleGuess(guess: string, solution: string): TileState[] {
  const g = guess.toUpperCase();
  const s = solution.toUpperCase();
  const len = s.length;
  const result: TileState[] = new Array(len).fill('absent');

  // Count available letters in solution
  const availableLetters: Record<string, number> = {};
  for (let i = 0; i < len; i++) {
    const char = s[i];
    availableLetters[char] = (availableLetters[char] || 0) + 1;
  }

  // First pass: Find exact matches (Green / Correct)
  for (let i = 0; i < len; i++) {
    if (g[i] === s[i]) {
      result[i] = 'correct';
      availableLetters[g[i]] -= 1;
    }
  }

  // Second pass: Find misplaced letters (Yellow / Present)
  for (let i = 0; i < len; i++) {
    if (result[i] !== 'correct') {
      const char = g[i];
      if (availableLetters[char] && availableLetters[char] > 0) {
        result[i] = 'present';
        availableLetters[char] -= 1;
      } else {
        result[i] = 'absent';
      }
    }
  }

  return result;
}

/**
 * Aggregates all submitted guesses to determine the current state of each key on the keyboard.
 */
export function getKeyStatuses(guesses: string[], solution: string): Record<string, TileState> {
  const keyMap: Record<string, TileState> = {};

  for (const guess of guesses) {
    const states = evaluateWordleGuess(guess, solution);
    for (let i = 0; i < guess.length; i++) {
      const char = guess[i].toUpperCase();
      const state = states[i];
      const existing = keyMap[char];

      if (state === 'correct') {
        keyMap[char] = 'correct';
      } else if (state === 'present' && existing !== 'correct') {
        keyMap[char] = 'present';
      } else if (state === 'absent' && !existing) {
        keyMap[char] = 'absent';
      }
    }
  }

  return keyMap;
}

const STATS_STORAGE_KEY = 'theme_wordle_player_stats_v1';

export function getDefaultStats(): UserStats {
  return {
    classic: {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    },
    theme: {
      played: 0,
      allWordsSolved: 0,
      themeCorrect: 0,
      currentStreak: 0,
      maxStreak: 0
    }
  };
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return getDefaultStats();
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return getDefaultStats();
    const parsed = JSON.parse(raw);
    return {
      classic: {
        ...getDefaultStats().classic,
        ...(parsed.classic || {})
      },
      theme: {
        ...getDefaultStats().theme,
        ...(parsed.theme || {})
      }
    };
  } catch {
    return getDefaultStats();
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Could not save user stats to localStorage', err);
  }
}
