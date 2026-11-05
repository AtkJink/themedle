'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, WordTheme, UserStats, GameSettings } from '@/lib/types';
import { isValidWord, getDailyClassicWord } from '@/lib/dictionary';
import { getRandomCuratedTheme } from '@/lib/curatedThemes';
import { getKeyStatuses, loadUserStats, saveUserStats, getDefaultStats } from '@/lib/gameEngine';
import { Header } from '@/components/Header';
import { ThemeProgressDock } from '@/components/ThemeProgressDock';
import { WordleBoard } from '@/components/WordleBoard';
import { Keyboard } from '@/components/Keyboard';
import { ThemeDeductionPhase } from '@/components/ThemeDeductionPhase';
import { StatsModal } from '@/components/StatsModal';
import { HelpModal } from '@/components/HelpModal';
import { SettingsModal } from '@/components/SettingsModal';
import confetti from 'canvas-confetti';

const SETTINGS_KEY = 'themedle_user_settings_v1';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<GameMode>('theme');

  // Stats and Settings
  const [stats, setStats] = useState<UserStats>(getDefaultStats());
  const [settings, setSettings] = useState<GameSettings>({
    themeWordCount: 4,
    hardMode: false,
    highContrast: false,
    customApiKey: ''
  });

  // Modal dialog states
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string, duration = 2000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, duration);
  }, []);

  // --- THEME DETECTIVE MODE STATE ---
  const [themeData, setThemeData] = useState<WordTheme | null>(null);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [solvedWords, setSolvedWords] = useState<(string | null)[]>([]);
  const [themeGuesses, setThemeGuesses] = useState<string[][]>([]);
  const [themeInput, setThemeInput] = useState('');
  const [isDeductionPhase, setIsDeductionPhase] = useState(false);
  const [themeShaking, setThemeShaking] = useState(false);

  // --- DAILY CLASSIC MODE STATE ---
  const [dailyWordData, setDailyWordData] = useState({ word: 'CRANE', puzzleNumber: 1 });
  const [classicGuesses, setClassicGuesses] = useState<string[]>([]);
  const [classicInput, setClassicInput] = useState('');
  const [classicWon, setClassicWon] = useState(false);
  const [classicGameOver, setClassicGameOver] = useState(false);
  const [classicShaking, setClassicShaking] = useState(false);

  // Load stats and settings on mount
  useEffect(() => {
    setMounted(true);
    setStats(loadUserStats());
    setDailyWordData(getDailyClassicWord(new Date()));

    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch {}
  }, []);

  // Update localStorage when stats change
  const updateStats = (updater: (prev: UserStats) => UserStats) => {
    setStats((prev) => {
      const next = updater(prev);
      saveUserStats(next);
      return next;
    });
  };

  // Start / Generate a Theme Puzzle
  const startNewThemeGame = useCallback(
    async (wordCount = settings.themeWordCount) => {
      setIsGeneratingTheme(true);
      try {
        const res = await fetch('/api/theme/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wordCount,
            customApiKey: settings.customApiKey
          })
        });

        let data: WordTheme;
        if (res.ok) {
          data = await res.json();
        } else {
          data = getRandomCuratedTheme(wordCount);
        }

        setThemeData(data);
        setCurrentWordIndex(0);
        setSolvedWords(new Array(data.words.length).fill(null));
        setThemeGuesses(data.words.map(() => []));
        setThemeInput('');
        setIsDeductionPhase(false);
      } catch {
        const curated = getRandomCuratedTheme(wordCount);
        setThemeData(curated);
        setCurrentWordIndex(0);
        setSolvedWords(new Array(curated.words.length).fill(null));
        setThemeGuesses(curated.words.map(() => []));
        setThemeInput('');
        setIsDeductionPhase(false);
      } finally {
        setIsGeneratingTheme(false);
      }
    },
    [settings.themeWordCount, settings.customApiKey]
  );

  // Initialize first theme game
  useEffect(() => {
    if (mounted && !themeData) {
      startNewThemeGame();
    }
  }, [mounted, themeData, startNewThemeGame]);

  // Handle settings update
  const handleUpdateSettings = (partial: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      if (partial.themeWordCount && partial.themeWordCount !== prev.themeWordCount) {
        startNewThemeGame(partial.themeWordCount);
      }
      return next;
    });
  };

  const handleResetAllStats = () => {
    const clean = getDefaultStats();
    setStats(clean);
    saveUserStats(clean);
    showToast('Player stats have been reset.');
  };

  // -------------------------------------------------------------
  // THEME DETECTIVE GAMEPLAY LOGIC
  // -------------------------------------------------------------
  const activeThemeWord = themeData?.words[currentWordIndex] || '';
  const activeWordGuesses = themeGuesses[currentWordIndex] || [];
  const isCurrentThemeWordSolved = Boolean(solvedWords[currentWordIndex]);

  const handleThemeChar = (char: string) => {
    if (!themeData || isDeductionPhase || isCurrentThemeWordSolved) return;
    if (themeInput.length < activeThemeWord.length) {
      setThemeInput((prev) => prev + char);
    }
  };

  const handleThemeDelete = () => {
    if (!themeData || isDeductionPhase || isCurrentThemeWordSolved) return;
    setThemeInput((prev) => prev.slice(0, -1));
  };

  const triggerShake = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 500);
  };

  const handleThemeEnter = () => {
    if (!themeData || isDeductionPhase || isCurrentThemeWordSolved) return;

    if (themeInput.length !== activeThemeWord.length) {
      showToast('Not enough letters');
      triggerShake(setThemeShaking);
      return;
    }

    if (!isValidWord(themeInput)) {
      showToast('Not in word list');
      triggerShake(setThemeShaking);
      return;
    }

    const newGuesses = [...activeWordGuesses, themeInput];
    const isWin = themeInput === activeThemeWord;

    // Update guesses matrix
    setThemeGuesses((prev) => {
      const next = [...prev];
      next[currentWordIndex] = newGuesses;
      return next;
    });

    setThemeInput('');

    if (isWin) {
      // Mark solved
      const newSolved = [...solvedWords];
      newSolved[currentWordIndex] = activeThemeWord;
      setSolvedWords(newSolved);

      updateStats((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          allWordsSolved: prev.theme.allWordsSolved + 1
        }
      }));

      showToast(`Nice! Solved "${activeThemeWord}"!`);

      // Check if more words remain in the theme
      setTimeout(() => {
        if (currentWordIndex + 1 < themeData.words.length) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          setIsDeductionPhase(true);
          showToast('All clues uncovered! Now deduce the theme.', 3000);
        }
      }, 900);
    } else if (newGuesses.length >= 6) {
      // Exhausted 6 tries on this word -> reveal and advance
      showToast(`Word was "${activeThemeWord}". Continuing...`, 2500);
      const newSolved = [...solvedWords];
      newSolved[currentWordIndex] = activeThemeWord; // reveal so player can still play deduction
      setSolvedWords(newSolved);

      setTimeout(() => {
        if (currentWordIndex + 1 < themeData.words.length) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          setIsDeductionPhase(true);
        }
      }, 1200);
    }
  };

  const handleSkipOrRevealWord = () => {
    if (!themeData || isDeductionPhase) return;
    const newSolved = [...solvedWords];
    newSolved[currentWordIndex] = activeThemeWord;
    setSolvedWords(newSolved);
    setThemeInput('');
    showToast(`Revealed "${activeThemeWord}"`);

    setTimeout(() => {
      if (currentWordIndex + 1 < themeData.words.length) {
        setCurrentWordIndex((prev) => prev + 1);
      } else {
        setIsDeductionPhase(true);
      }
    }, 600);
  };

  const handleThemeSolvedSuccess = () => {
    updateStats((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        played: prev.theme.played + 1,
        themeCorrect: prev.theme.themeCorrect + 1,
        currentStreak: prev.theme.currentStreak + 1,
        maxStreak: Math.max(prev.theme.maxStreak, prev.theme.currentStreak + 1)
      }
    }));
  };

  // -------------------------------------------------------------
  // DAILY CLASSIC WORDLE LOGIC
  // -------------------------------------------------------------
  const handleClassicChar = (char: string) => {
    if (classicGameOver) return;
    if (classicInput.length < 5) {
      setClassicInput((prev) => prev + char);
    }
  };

  const handleClassicDelete = () => {
    if (classicGameOver) return;
    setClassicInput((prev) => prev.slice(0, -1));
  };

  const handleClassicEnter = () => {
    if (classicGameOver) return;

    if (classicInput.length !== 5) {
      showToast('Not enough letters');
      triggerShake(setClassicShaking);
      return;
    }

    if (!isValidWord(classicInput)) {
      showToast('Not in word list');
      triggerShake(setClassicShaking);
      return;
    }

    const newGuesses = [...classicGuesses, classicInput];
    setClassicGuesses(newGuesses);
    setClassicInput('');

    const won = classicInput === dailyWordData.word;
    const isOver = won || newGuesses.length >= 6;

    if (won) {
      setClassicWon(true);
      setClassicGameOver(true);
      showToast('Splendid! You solved today\'s Wordle!');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      updateStats((prev) => {
        const attempt = newGuesses.length;
        const newDist = { ...prev.classic.distribution };
        newDist[attempt] = (newDist[attempt] || 0) + 1;
        const newStreak = prev.classic.currentStreak + 1;
        return {
          ...prev,
          classic: {
            played: prev.classic.played + 1,
            won: prev.classic.won + 1,
            currentStreak: newStreak,
            maxStreak: Math.max(prev.classic.maxStreak, newStreak),
            distribution: newDist
          }
        };
      });

      setTimeout(() => setIsStatsOpen(true), 1500);
    } else if (isOver) {
      setClassicGameOver(true);
      showToast(`Word was: ${dailyWordData.word}`, 3500);

      updateStats((prev) => ({
        ...prev,
        classic: {
          ...prev.classic,
          played: prev.classic.played + 1,
          currentStreak: 0
        }
      }));

      setTimeout(() => setIsStatsOpen(true), 2000);
    }
  };

  // Keyboard status calculation
  const currentKeyStatuses =
    mode === 'theme'
      ? getKeyStatuses(activeWordGuesses, activeThemeWord)
      : getKeyStatuses(classicGuesses, dailyWordData.word);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#e6edf3] select-none">
      {/* Top Header */}
      <Header
        mode={mode}
        onSelectMode={setMode}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetThemeGame={() => startNewThemeGame()}
        isGenerating={isGeneratingTheme}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-[#1e293b] text-[#f8fafc] text-xs sm:text-sm font-medium border border-[#334155] shadow-xl animate-pop pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between max-w-2xl w-full mx-auto pb-4">
        {mode === 'theme' ? (
          <>
            {/* Theme Progress Dock */}
            {themeData && (
              <ThemeProgressDock
                words={themeData.words}
                solvedWords={solvedWords}
                currentWordIndex={currentWordIndex}
                isDeductionPhase={isDeductionPhase}
                onRevealCurrentWord={handleSkipOrRevealWord}
                activeWordCompleted={isCurrentThemeWordSolved}
              />
            )}

            {/* Wordle Board OR Grand Finale Theme Deduction */}
            {isDeductionPhase && themeData ? (
              <div className="flex-1 flex items-center justify-center">
                <ThemeDeductionPhase
                  themeData={themeData}
                  solvedWords={solvedWords.filter(Boolean) as string[]}
                  onPlayNext={() => startNewThemeGame()}
                  customApiKey={settings.customApiKey}
                  onThemeSolved={handleThemeSolvedSuccess}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-center justify-center">
                  {themeData ? (
                    <WordleBoard
                      targetWord={activeThemeWord}
                      guesses={activeWordGuesses}
                      currentInput={themeInput}
                      isShaking={themeShaking}
                    />
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      Generating puzzle...
                    </div>
                  )}
                </div>

                {/* Virtual Keyboard */}
                <Keyboard
                  onChar={handleThemeChar}
                  onEnter={handleThemeEnter}
                  onDelete={handleThemeDelete}
                  keyStatuses={currentKeyStatuses}
                  disabled={isCurrentThemeWordSolved}
                />
              </>
            )}
          </>
        ) : (
          /* Daily Classic Wordle Mode */
          <>
            <div className="text-center pt-3 pb-1">
              <span className="text-xs text-[#8595a8] font-mono">
                Daily Puzzle #{dailyWordData.puzzleNumber} · 5 Letters
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <WordleBoard
                targetWord={dailyWordData.word}
                guesses={classicGuesses}
                currentInput={classicInput}
                isShaking={classicShaking}
              />
            </div>

            <Keyboard
              onChar={handleClassicChar}
              onEnter={handleClassicEnter}
              onDelete={handleClassicDelete}
              keyStatuses={currentKeyStatuses}
              disabled={classicGameOver}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        currentMode={mode}
        classicShareData={
          classicGameOver
            ? {
                guesses: classicGuesses,
                solution: dailyWordData.word,
                puzzleNumber: dailyWordData.puzzleNumber,
                won: classicWon
              }
            : undefined
        }
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetAllStats={handleResetAllStats}
      />
    </div>
  );
}
