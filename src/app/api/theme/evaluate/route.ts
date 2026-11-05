import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ThemeEvaluationResult } from '@/lib/types';

function cleanText(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guess, theme, clue, acceptableKeywords = [], words = [], customApiKey } = body;

    if (!guess || typeof guess !== 'string' || !guess.trim()) {
      return NextResponse.json<ThemeEvaluationResult>({
        isCorrect: false,
        confidence: 'incorrect',
        message: 'Please enter a guess for the theme.'
      });
    }

    const cleanGuess = cleanText(guess);
    const cleanTheme = cleanText(theme);

    // 1. Direct string / substring check with theme
    if (cleanGuess === cleanTheme || cleanTheme.includes(cleanGuess) || cleanGuess.includes(cleanTheme)) {
      return NextResponse.json<ThemeEvaluationResult>({
        isCorrect: true,
        confidence: 'exact',
        message: 'Brilliant! You figured out the exact theme.',
        actualTheme: theme
      });
    }

    // 2. Keyword match against acceptable synonyms
    const matchedKeyword = acceptableKeywords.some((kw: string) => {
      const cleanKw = cleanText(kw);
      return cleanGuess === cleanKw || cleanGuess.includes(cleanKw) || cleanKw.includes(cleanGuess);
    });

    if (matchedKeyword) {
      return NextResponse.json<ThemeEvaluationResult>({
        isCorrect: true,
        confidence: 'exact',
        message: `Spot on! You captured the essence of "${theme}".`,
        actualTheme: theme
      });
    }

    // 3. If API key exists, use Gemini semantic evaluation
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the judge of a word puzzle game.
The puzzle words were: ${words.join(', ')}.
The secret intended theme is: "${theme}".
Theme hint was: "${clue}".
The player guessed: "${guess}".

Determine whether the player's guess is semantically accurate, reasonably close, or incorrect.
Be generous to synonymous or slightly broader/narrower descriptions (e.g. if theme is "Types of Coffee" and they say "Morning drinks" or "Cafe items", or if theme is "Space" and they say "Cosmos" or "The Solar System", that is correct).

Respond in JSON ONLY:
{
  "isCorrect": boolean (true if reasonably matches the concept, false if wrong),
  "confidence": "exact" | "close" | "incorrect",
  "message": "A concise friendly 1-sentence response to the player (e.g., 'Spot on! You identified the theme.' or 'Close, but a bit too broad.')"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return NextResponse.json<ThemeEvaluationResult>({
          isCorrect: Boolean(parsed.isCorrect),
          confidence: parsed.confidence || (parsed.isCorrect ? 'exact' : 'incorrect'),
          message: parsed.message || (parsed.isCorrect ? 'Correct!' : 'Not quite right.'),
          actualTheme: theme
        });
      }
    }

    // 4. Offline heuristic fallback if no API key or AI call failed
    const guessWords = cleanGuess.split(/\s+/);
    const themeWords = cleanTheme.split(/\s+/);
    const hasOverlap = guessWords.some(gw => gw.length > 3 && themeWords.includes(gw));

    if (hasOverlap) {
      return NextResponse.json<ThemeEvaluationResult>({
        isCorrect: true,
        confidence: 'close',
        message: `Great deduction! The theme was "${theme}".`,
        actualTheme: theme
      });
    }

    return NextResponse.json<ThemeEvaluationResult>({
      isCorrect: false,
      confidence: 'incorrect',
      message: 'Not quite the theme. Give it another thought or reveal the hint!',
      actualTheme: theme
    });
  } catch (error) {
    console.warn('Theme evaluation failed:', error);
    return NextResponse.json<ThemeEvaluationResult>({
      isCorrect: false,
      confidence: 'incorrect',
      message: 'Could not evaluate guess at this moment. Try again.'
    });
  }
}
