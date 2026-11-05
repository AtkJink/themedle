import { CURATED_THEMES } from './curatedThemes';

// Popular 5-letter words for Daily Classic Wordle
export const CLASSIC_WORD_LIST: string[] = [
  'CRANE', 'SLATE', 'STARE', 'ROAST', 'PLANT', 'LIGHT', 'TRACE', 'HEART',
  'SHARE', 'AUDIO', 'ALONE', 'RAISE', 'STONE', 'GUIDE', 'POINT', 'SHINE',
  'SPACE', 'WATER', 'EARTH', 'CLOUD', 'OCEAN', 'FLAME', 'BLOOM', 'STORM',
  'RIVER', 'BEACH', 'FROST', 'SPICE', 'BREAD', 'APPLE', 'PEACH', 'BERRY',
  'LEMON', 'MANGO', 'CHEST', 'SWORD', 'CROWN', 'TOWER', 'SHIELD', 'CHAIR',
  'TABLE', 'CLOCK', 'FRAME', 'GLASS', 'PAPER', 'BRUSH', 'PAINT', 'MUSIC',
  'PIANO', 'FLUTE', 'VOICE', 'SOUND', 'DANCE', 'STAGE', 'DREAM', 'NIGHT',
  'SLEEP', 'PEACE', 'SMILE', 'LAUGH', 'SPARK', 'FLASH', 'SHADOW', 'MAGIC',
  'QUEST', 'HERO', 'BRAVE', 'FAITH', 'HONOR', 'PRIDE', 'POWER', 'FORCE',
  'TRAIN', 'PLANE', 'TRUCK', 'WHEEL', 'MOTOR', 'TRACK', 'ROUTE', 'RIDGE',
  'FIELD', 'VALLEY', 'CREEK', 'CLIFF', 'ISLAND', 'COAST', 'SHORE', 'WORLD',
  'SOLAR', 'LUNAR', 'COMET', 'ORBIT', 'ASTRO', 'PILOT', 'SAILOR', 'RIDER',
  'SCOUT', 'CHAMP', 'LEADER', 'KNIGHT', 'BARON', 'PRINCE', 'QUEEN', 'KING',
  'JEWEL', 'PEARL', 'AMBER', 'TOPAZ', 'CORAL', 'SHELL', 'BEAST', 'TIGER',
  'EAGLE', 'FALCON', 'RAVEN', 'ROBIN', 'SHARK', 'WHALE', 'OTTER', 'PANDA',
  'ZEBRA', 'HORSE', 'CAMEL', 'LLAMA', 'VAPOR', 'STEAM', 'SMOKE', 'EMBER',
  'CHILL', 'BLAZE', 'CRISP', 'SWEET', 'SALTY', 'FRESH', 'SHARP', 'ROUND',
  'SOLID', 'CLEAR', 'VIVID', 'BRIGHT', 'LUCKY', 'HAPPY', 'NOBLE', 'GRAND',
  'SWIFT', 'QUICK', 'SMART', 'CLEVER', 'SHREW', 'BRIEF', 'SHORT', 'GIANT',
  'HEAVY', 'LIGHT', 'QUIET', 'STILL', 'CALM', 'WARM', 'COOL', 'COLD'
].map(w => w.toUpperCase());

// Load all theme words into allowed set automatically
const THEME_WORDS_SET = new Set<string>();
CURATED_THEMES.forEach(t => {
  t.words.forEach(w => THEME_WORDS_SET.add(w.toUpperCase()));
});

// A robust set of common 3 to 8 letter English words
import { COMMON_WORDS } from './wordBank';

export function isValidWord(word: string): boolean {
  const upper = word.toUpperCase();
  if (THEME_WORDS_SET.has(upper)) return true;
  if (CLASSIC_WORD_LIST.includes(upper)) return true;
  return COMMON_WORDS.has(upper);
}

// Daily Word Generator based on UTC date
export function getDailyClassicWord(date: Date = new Date()): { word: string; puzzleNumber: number } {
  // Epoch: Jan 1, 2026
  const epoch = new Date(Date.UTC(2026, 0, 1)).getTime();
  const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
  const daysSinceEpoch = Math.max(0, Math.floor((current - epoch) / (1000 * 60 * 60 * 24)));
  
  const index = daysSinceEpoch % CLASSIC_WORD_LIST.length;
  return {
    word: CLASSIC_WORD_LIST[index],
    puzzleNumber: daysSinceEpoch + 1
  };
}
