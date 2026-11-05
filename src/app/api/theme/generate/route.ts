import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getRandomCuratedTheme } from '@/lib/curatedThemes';
import { isValidWord } from '@/lib/dictionary';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const wordCount = Math.max(3, Math.min(6, Number(body.wordCount) || 4));
    const customApiKey = body.customApiKey;

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return high quality curated theme if no API key is present
      const curated = getRandomCuratedTheme(wordCount);
      return NextResponse.json({
        ...curated,
        source: 'curated'
      });
    }

    // Call Gemini API via @google/genai
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are designing a word puzzle game where players solve a sequence of words and then deduce the overarching theme that connects them.
Generate 1 creative, distinct theme and ${wordCount} common English words that fit this theme.

CRITICAL RULES:
1. Each word must be a real, common English word between 4 and 8 letters long.
2. The ${wordCount} words MUST have varying lengths (e.g. lengths like 4, 6, 5, 7). DO NOT make all words the same length. Avoid words shorter than 4 letters.
3. The theme should be a clear, cohesive category or concept (e.g. "Space Exploration", "Baking & Pastries", "Types of Coffee", "Castle & Medieval").
4. Provide a subtle 1-sentence hint/clue that does not give away the words.
5. Provide a list of 6-12 acceptable synonymous keywords or phrases that a player might guess when deducing the theme.

Output ONLY valid JSON with this exact schema:
{
  "theme": "string (theme title)",
  "words": ["WORD1", "WORD2", ...],
  "clue": "string (subtle hint)",
  "acceptableKeywords": ["synonym1", "synonym2", ...],
  "category": "string (e.g. Science, Arts, Nature, History)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI');
    }

    const data = JSON.parse(text);

    // Validate that words are uppercase and fit criteria
    const words = (data.words || [])
      .map((w: string) => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
      .filter((w: string) => w.length >= 3 && w.length <= 8);

    if (words.length < wordCount) {
      throw new Error('AI generated insufficient valid words');
    }

    return NextResponse.json({
      id: `ai-${Date.now()}`,
      theme: data.theme,
      words: words.slice(0, wordCount),
      clue: data.clue || 'Think about what ties these concepts together.',
      acceptableKeywords: (data.acceptableKeywords || []).map((k: string) => k.toLowerCase().trim()),
      category: data.category || 'General',
      source: 'ai'
    });
  } catch (error) {
    console.warn('AI Theme Generation failed, falling back to curated:', error);
    const curated = getRandomCuratedTheme(4);
    return NextResponse.json({
      ...curated,
      source: 'curated'
    });
  }
}
