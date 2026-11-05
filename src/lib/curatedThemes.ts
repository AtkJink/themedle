import { WordTheme } from './types';

export const CURATED_THEMES: WordTheme[] = [
  {
    id: 'space-astronomy',
    theme: 'Space & Astronomy',
    words: ['ORBIT', 'GALAXY', 'NEBULA', 'MARS', 'COMET'],
    clue: 'Beyond the Earth’s atmosphere into the cosmos.',
    acceptableKeywords: [
      'space', 'astronomy', 'cosmos', 'universe', 'celestial', 'outer space',
      'galaxy', 'solar system', 'planets', 'stars'
    ],
    category: 'Science'
  },
  {
    id: 'coffee-cafe',
    theme: 'Coffee & Cafe',
    words: ['BREW', 'ROAST', 'ESPRESSO', 'MOCHA', 'LATTE'],
    clue: 'Roasted beans, mornings, and cozy warm mugs.',
    acceptableKeywords: [
      'coffee', 'cafe', 'barista', 'espresso', 'caffeine', 'hot drinks',
      'coffee shop', 'brewing'
    ],
    category: 'Food & Drink'
  },
  {
    id: 'ocean-marine',
    theme: 'Ocean & Marine Life',
    words: ['CORAL', 'TRENCH', 'SHARK', 'TIDE', 'DOLPHIN'],
    clue: 'Depths of the sea, salt water, and marine wonders.',
    acceptableKeywords: [
      'ocean', 'marine life', 'sea', 'underwater', 'aquatic', 'marine',
      'sea creatures', 'deep sea', 'nautical'
    ],
    category: 'Nature'
  },
  {
    id: 'medieval-castle',
    theme: 'Medieval Castle & Knights',
    words: ['MOAT', 'KNIGHT', 'SHIELD', 'SWORD', 'FORTRESS'],
    clue: 'Feudal armor, sieges, and stone bastions.',
    acceptableKeywords: [
      'castle', 'medieval', 'knights', 'middle ages', 'fortress',
      'royalty', 'chivalry', 'armor'
    ],
    category: 'History'
  },
  {
    id: 'music-instruments',
    theme: 'Musical Instruments & Sound',
    words: ['DRUM', 'CELLO', 'TRUMPET', 'FLUTE', 'PIANO'],
    clue: 'Orchestras, melodies, and acoustic rhythms.',
    acceptableKeywords: [
      'musical instruments', 'instruments', 'music', 'orchestra', 'band',
      'sound', 'musician'
    ],
    category: 'Arts'
  },
  {
    id: 'weather-storms',
    theme: 'Weather & Storms',
    words: ['HAIL', 'BREEZE', 'THUNDER', 'CLOUDS', 'LIGHTNING'],
    clue: 'Meteorology, atmospheric fronts, and tempestuous skies.',
    acceptableKeywords: [
      'weather', 'storms', 'meteorology', 'storm', 'climate', 'atmosphere',
      'rain', 'tempest'
    ],
    category: 'Nature'
  },
  {
    id: 'gemstones-minerals',
    theme: 'Gemstones & Crystals',
    words: ['RUBY', 'OPAL', 'QUARTZ', 'AMBER', 'EMERALD'],
    clue: 'Precious minerals mined and polished for jewelry.',
    acceptableKeywords: [
      'gemstones', 'gems', 'crystals', 'minerals', 'jewels', 'stones',
      'precious stones', 'jewelry'
    ],
    category: 'Geology'
  },
  {
    id: 'detective-mystery',
    theme: 'Detective & Crime Mystery',
    words: ['CLUE', 'SUSPECT', 'ALIBI', 'MOTIVE', 'SLEUTH'],
    clue: 'Magnifying glasses, crime scenes, and deduction.',
    acceptableKeywords: [
      'detective', 'mystery', 'crime', 'investigation', 'sleuth',
      'solving crimes', 'forensics', 'police'
    ],
    category: 'Mystery'
  },
  {
    id: 'desserts-baking',
    theme: 'Baking & Desserts',
    words: ['CAKE', 'FUDGE', 'PASTRY', 'VANILLA', 'BROWNIE'],
    clue: 'Ovens, sweet confections, and dessert bakeries.',
    acceptableKeywords: [
      'baking', 'desserts', 'sweets', 'pastry', 'baked goods', 'sugar',
      'bakery', 'confections', 'sweet treats'
    ],
    category: 'Food & Drink'
  },
  {
    id: 'forest-woodland',
    theme: 'Forest & Woodland',
    words: ['MOSS', 'TIMBER', 'CANOPY', 'FERN', 'REDWOOD'],
    clue: 'Dense groves of green trees, foliage, and damp earth.',
    acceptableKeywords: [
      'forest', 'woodland', 'woods', 'trees', 'nature', 'jungle',
      'rainforest', 'flora', 'forestry'
    ],
    category: 'Nature'
  },
  {
    id: 'cinema-film',
    theme: 'Movies & Cinema',
    words: ['FILM', 'ACTOR', 'SCENE', 'CINEMA', 'DIRECTOR'],
    clue: 'Silver screen, scripts, and Hollywood premieres.',
    acceptableKeywords: [
      'movies', 'cinema', 'film', 'filmmaking', 'hollywood', 'motion pictures',
      'the theater', 'acting', 'films'
    ],
    category: 'Entertainment'
  },
  {
    id: 'winter-arctic',
    theme: 'Winter & Arctic Cold',
    words: ['SNOW', 'SLEET', 'GLACIER', 'FROST', 'BLIZZARD'],
    clue: 'Sub-zero temperatures, frozen tundras, and ice.',
    acceptableKeywords: [
      'winter', 'arctic', 'cold', 'ice', 'snow', 'polar', 'freezing',
      'subzero', 'frost'
    ],
    category: 'Seasons'
  },
  {
    id: 'aviation-flight',
    theme: 'Aviation & Flight',
    words: ['WING', 'PILOT', 'HANGAR', 'RUNWAY', 'AIRPLANE'],
    clue: 'Airports, aerodynamics, and soaring through clouds.',
    acceptableKeywords: [
      'aviation', 'flight', 'airplanes', 'flying', 'aircraft', 'airports',
      'aeronautics', 'planes'
    ],
    category: 'Travel'
  },
  {
    id: 'pirates-sailing',
    theme: 'Pirates & High Seas',
    words: ['LOOT', 'ANCHOR', 'PIRATE', 'GALLEON', 'TREASURE'],
    clue: 'Skull flags, wooden decks, and buried riches.',
    acceptableKeywords: [
      'pirates', 'high seas', 'sailing', 'pirate', 'buccaneers', 'swashbucklers',
      'treasure hunt', 'seafaring'
    ],
    category: 'Adventure'
  },
  {
    id: 'gardening-botany',
    theme: 'Gardening & Plants',
    words: ['SOIL', 'BLOOM', 'PRUNER', 'SPROUT', 'PETALS'],
    clue: 'Seeds, watering cans, backyard patches, and botany.',
    acceptableKeywords: [
      'gardening', 'garden', 'plants', 'botany', 'horticulture', 'flowers',
      'planting', 'growing'
    ],
    category: 'Nature'
  },
  {
    id: 'art-painting',
    theme: 'Painting & Fine Art',
    words: ['EASEL', 'CANVAS', 'PIGMENT', 'SKETCH', 'PALETTE'],
    clue: 'Studios, brush strokes, oils, and galleries.',
    acceptableKeywords: [
      'art', 'painting', 'drawing', 'artist', 'fine art', 'visual arts',
      'canvas', 'studio'
    ],
    category: 'Arts'
  },
  {
    id: 'circus-carnival',
    theme: 'Circus & Carnival',
    words: ['TENT', 'CLOWN', 'JUGGLER', 'ACROBAT', 'CARNIVAL'],
    clue: 'Big tops, trapeze acts, popcorn, and ringmasters.',
    acceptableKeywords: [
      'circus', 'carnival', 'fair', 'big top', 'amusement', 'festival'
    ],
    category: 'Entertainment'
  },
  {
    id: 'desert-arid',
    theme: 'Desert & Arid Landscapes',
    words: ['DUNE', 'OASIS', 'MIRAGE', 'CACTUS', 'SAHARA'],
    clue: 'Endless sand, scorching heat, and sparse prickly plants.',
    acceptableKeywords: [
      'desert', 'arid', 'sand dunes', 'sahara', 'dry climates', 'wasteland'
    ],
    category: 'Geology'
  },
  {
    id: 'computer-tech',
    theme: 'Computer Hardware & Tech',
    words: ['BYTE', 'CHIP', 'MODEM', 'CIRCUIT', 'SERVER'],
    clue: 'Silicon chips, processing power, and digital infrastructure.',
    acceptableKeywords: [
      'computers', 'computer hardware', 'tech', 'technology', 'computing',
      'hardware', 'electronics', 'digital'
    ],
    category: 'Technology'
  },
  {
    id: 'mythology-gods',
    theme: 'Ancient Greek Mythology',
    words: ['ZEUS', 'TITAN', 'ORACLE', 'HERMES', 'OLYMPUS'],
    clue: 'Mount Olympus, thunderbolts, and ancient pantheons.',
    acceptableKeywords: [
      'greek mythology', 'mythology', 'gods', 'ancient greece', 'pantheon',
      'olympus', 'myths'
    ],
    category: 'Mythology'
  }
];

export function getRandomCuratedTheme(wordCount: number = 4): WordTheme {
  const randomIndex = Math.floor(Math.random() * CURATED_THEMES.length);
  const base = CURATED_THEMES[randomIndex];
  
  // Pick the requested word count from the available words, ensuring variety of lengths
  let words = [...base.words];
  if (wordCount < words.length) {
    // Sort slightly to keep varying lengths
    words = words.slice(0, wordCount);
  }
  return {
    ...base,
    words
  };
}
