export type TileState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export type GameMode = 'theme' | 'classic';

export interface EvaluatedLetter {
  letter: string;
  state: TileState;
}

export interface WordTheme {
  id: string;
  theme: string;
  words: string[];
  clue: string;
  acceptableKeywords: string[];
  category?: string;
}

export interface ThemeEvaluationResult {
  isCorrect: boolean;
  confidence: 'exact' | 'close' | 'incorrect';
  message: string;
  actualTheme?: string;
}

export interface UserStats {
  classic: {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
    distribution: Record<number, number>; // 1-6 attempts
    lastPlayedDate?: string;
  };
  theme: {
    played: number;
    allWordsSolved: number;
    themeCorrect: number;
    currentStreak: number;
    maxStreak: number;
  };
}

export interface GameSettings {
  themeWordCount: number; // 3, 4, 5, or 6
  hardMode: boolean;
  highContrast: boolean;
  customApiKey?: string;
}
