/* =========================================================================
   Gujarati Match & Learn — LEARNING DATA
   -------------------------------------------------------------------------
   Everything the child learns lives in this file.

   Every learning ITEM looks like this:
     {
       id:     "ka",        // unique id (used to remember progress)
       gu:     "ક",         // what the child sees (big, inside the kite)
       en:     "Ka",        // the matching answer
       say:    "kuh",       // (optional) how English speech should read it
       tip:    "...",       // (optional) small helper text in Learn mode
       pic:    "🕊️",        // (optional) picture for the word
       word:   "કબૂતર",     // (optional) Gujarati word that uses the letter
       wordEn: "Kabutar",   // (optional) how to read that word
       meaning:"Pigeon",    // (optional) English meaning of the word
       count:  3            // (optional) numbers only: repeat the picture N times
     }

   To add a NEW GAME (vowels, colours, animals ...):
     1. Make a list of items like CONSONANTS below.
     2. Add an entry to GAMES at the bottom of this file.
   The home screen shows every game in GAMES automatically.
   ========================================================================= */

/* ---------- Gujarati consonants (વ્યંજન) ---------- */
/* starter: true  => part of the smaller beginner set                  */
const CONSONANTS = [
  { id: "ka",   gu: "ક", en: "Ka",   starter: true, pic: "🕊️", word: "કબૂતર",   wordEn: "Kabutar",  meaning: "Pigeon" },
  { id: "kha",  gu: "ખ", en: "Kha",  starter: true, pic: "🐿️", word: "ખિસકોલી", wordEn: "Khiskoli", meaning: "Squirrel" },
  { id: "ga",   gu: "ગ", en: "Ga",   starter: true, pic: "🐄", word: "ગાય",     wordEn: "Gaay",     meaning: "Cow" },
  { id: "gha",  gu: "ઘ", en: "Gha",  starter: true, pic: "🏠", word: "ઘર",      wordEn: "Ghar",     meaning: "House" },

  { id: "cha",  gu: "ચ", en: "Cha",  starter: true, pic: "🐦", word: "ચકલી",    wordEn: "Chakli",   meaning: "Sparrow" },
  { id: "chha", gu: "છ", en: "Chha", starter: true, pic: "☂️", word: "છત્રી",   wordEn: "Chhatri",  meaning: "Umbrella" },
  { id: "ja",   gu: "જ", en: "Ja",   starter: true, pic: "🚢", word: "જહાજ",    wordEn: "Jahaj",    meaning: "Ship" },
  { id: "jha",  gu: "ઝ", en: "Jha",  starter: true, pic: "🌳", word: "ઝાડ",     wordEn: "Jhaad",    meaning: "Tree" },

  { id: "tta",  gu: "ટ", en: "Ta",   starter: true, pic: "🍅", word: "ટામેટું",  wordEn: "Tametu",   meaning: "Tomato",     tip: "Hard Ta — tongue curls back" },
  { id: "ttha", gu: "ઠ", en: "Tha",  starter: true, pic: "🥶", word: "ઠંડી",    wordEn: "Thandi",   meaning: "Cold",       tip: "Hard Tha — tongue curls back" },
  { id: "dda",  gu: "ડ", en: "Da",   starter: true, pic: "🧅", word: "ડુંગળી",  wordEn: "Dungli",   meaning: "Onion",      tip: "Hard Da — tongue curls back" },
  { id: "ddha", gu: "ઢ", en: "Dha",  starter: true, pic: "🪘", word: "ઢોલ",     wordEn: "Dhol",     meaning: "Drum",       tip: "Hard Dha — tongue curls back" },
  { id: "nna",  gu: "ણ", en: "Na",   starter: false, pic: "🏹", word: "બાણ",    wordEn: "Baan",     meaning: "Arrow",      tip: "Hard Na — found inside or at the end of words" },

  { id: "ta",   gu: "ત", en: "Ta",   starter: true, pic: "🍉", word: "તરબૂચ",   wordEn: "Tarbuch",  meaning: "Watermelon", tip: "Soft Ta — tongue touches teeth" },
  { id: "tha",  gu: "થ", en: "Tha",  starter: true, pic: "🍽️", word: "થાળી",    wordEn: "Thaali",   meaning: "Plate",      tip: "Soft Tha — tongue touches teeth" },
  { id: "da",   gu: "દ", en: "Da",   starter: true, pic: "⚽", word: "દડો",     wordEn: "Dado",     meaning: "Ball",       tip: "Soft Da — tongue touches teeth" },
  { id: "dha",  gu: "ધ", en: "Dha",  starter: true, pic: "🚩", word: "ધજા",     wordEn: "Dhaja",    meaning: "Flag",       tip: "Soft Dha — tongue touches teeth" },
  { id: "na",   gu: "ન", en: "Na",   starter: false, pic: "🚰", word: "નળ",     wordEn: "Nal",      meaning: "Water tap" },

  { id: "pa",   gu: "પ", en: "Pa",   starter: true, pic: "🪁", word: "પતંગ",    wordEn: "Patang",   meaning: "Kite" },
  { id: "pha",  gu: "ફ", en: "Pha",  starter: true, pic: "🌸", word: "ફૂલ",     wordEn: "Phool",    meaning: "Flower" },
  { id: "ba",   gu: "બ", en: "Ba",   starter: true, pic: "🦆", word: "બતક",     wordEn: "Batak",    meaning: "Duck" },
  { id: "bha",  gu: "ભ", en: "Bha",  starter: true, pic: "🐝", word: "ભમરો",    wordEn: "Bhamro",   meaning: "Bumblebee" },
  { id: "ma",   gu: "મ", en: "Ma",   starter: true, pic: "🦚", word: "મોર",     wordEn: "Mor",      meaning: "Peacock" },

  { id: "ya",   gu: "ય", en: "Ya",   starter: true, pic: "🧘", word: "યોગ",     wordEn: "Yog",      meaning: "Yoga" },
  { id: "ra",   gu: "ર", en: "Ra",   starter: true, pic: "🧸", word: "રમકડું",  wordEn: "Ramakdu",  meaning: "Toy" },
  { id: "la",   gu: "લ", en: "La",   starter: true, pic: "🍋", word: "લીંબુ",   wordEn: "Limbu",    meaning: "Lemon" },
  { id: "va",   gu: "વ", en: "Va",   starter: true, pic: "🐅", word: "વાઘ",     wordEn: "Vaagh",    meaning: "Tiger" },

  { id: "sha",  gu: "શ", en: "Sha",  starter: true, pic: "🐚", word: "શંખ",     wordEn: "Shankh",   meaning: "Conch shell" },
  { id: "ssha", gu: "ષ", en: "Sha",  starter: false, pic: "⬢", word: "ષટ્કોણ", wordEn: "Shatkon",  meaning: "Hexagon",    tip: "A rarer Sha — used in special words" },
  { id: "sa",   gu: "સ", en: "Sa",   starter: true, pic: "🍎", word: "સફરજન",   wordEn: "Safarjan", meaning: "Apple" },
  { id: "ha",   gu: "હ", en: "Ha",   starter: true, pic: "🐘", word: "હાથી",    wordEn: "Haathi",   meaning: "Elephant" },

  { id: "lla",  gu: "ળ", en: "La",   starter: false, pic: "🪷", word: "કમળ",    wordEn: "Kamal",    meaning: "Lotus",      tip: "Hard La — found inside or at the end of words" }
];

/* ---------- Gujarati numbers (ગુજરાતી અંક) ---------- */
const GUJARATI_DIGITS = "૦૧૨૩૪૫૬૭૮૯";

/* Turn 25 into "૨૫" */
function toGujaratiDigits(n) {
  return String(n).replace(/[0-9]/g, d => GUJARATI_DIGITS[d]);
}

/* Number names — add more here any time (index = the number) */
const NUMBER_WORDS = {
  1: ["એક", "Ek"],        2: ["બે", "Be"],          3: ["ત્રણ", "Tran"],     4: ["ચાર", "Chaar"],
  5: ["પાંચ", "Paanch"],  6: ["છ", "Chha"],         7: ["સાત", "Saat"],      8: ["આઠ", "Aath"],
  9: ["નવ", "Nav"],       10: ["દસ", "Das"],        11: ["અગિયાર", "Agiyaar"], 12: ["બાર", "Baar"],
  13: ["તેર", "Ter"],     14: ["ચૌદ", "Chaud"],     15: ["પંદર", "Pandar"],  16: ["સોળ", "Sol"],
  17: ["સત્તર", "Sattar"], 18: ["અઢાર", "Adhaar"],  19: ["ઓગણીસ", "Ognees"], 20: ["વીસ", "Vees"]
};

/* Counting pictures for 1–10 (shown 1 time, 2 times, 3 times ...) */
const COUNT_PICS = ["", "🐘", "🦆", "🍎", "🌸", "⭐", "🐟", "🎈", "🍋", "🐞", "🪁"];

function makeNumbers(from, to) {
  const list = [];
  for (let n = from; n <= to; n++) {
    const words = NUMBER_WORDS[n];
    list.push({
      id: "n" + n,
      gu: toGujaratiDigits(n),
      en: String(n),
      value: n,
      word: words ? words[0] : undefined,
      wordEn: words ? words[1] : undefined,
      pic: COUNT_PICS[n] || undefined,
      count: COUNT_PICS[n] ? n : undefined
    });
  }
  return list;
}

const NUMBERS = makeNumbers(1, 100);

/* ---------- small steps ---------- */
/* Pick items by their Gujarati character, in the order the child should learn them */
function pickChars(list, chars) {
  return chars.split(" ").map(ch => list.find(i => i.gu === ch)).filter(Boolean);
}

/* Each step is a small group the child learns and plays on its own.
   step: true => shown as "Step 1, Step 2 ..." and learned in this exact order */
const CONSONANT_STEPS = [
  "ક ખ ગ ઘ", "ચ છ જ ઝ", "ટ ઠ ડ ઢ", "ત થ દ ધ",
  "પ ફ બ ભ", "મ ય ર લ", "વ શ સ હ", "ણ ન ષ ળ"
];

/* ---------- Barakhadi (બારાખડી) ---------- */
/* The 12 forms of every consonant, always taught in THIS order.
   sign:  the matra added to the consonant
   sound: added to the consonant sound (k + "aa" = "kaa"); a list gives two readings
   hint:  short visual hint for the child                                */
const MATRAS = [
  { key: "a",   sign: "",  sound: "a",  hint: "No extra mark" },
  { key: "aa",  sign: "ા", sound: "aa", hint: "Long stick on the RIGHT" },
  { key: "i",   sign: "િ", sound: "i",  hint: "Small mark BEFORE the letter" },
  { key: "ee",  sign: "ી", sound: "ee", hint: "Long mark on the RIGHT" },
  { key: "u",   sign: "ુ", sound: "u",  hint: "Small curve UNDER" },
  { key: "oo",  sign: "ૂ", sound: "oo", hint: "Long curve UNDER" },
  { key: "e",   sign: "ે", sound: "e",  hint: "Mark ABOVE" },
  { key: "ai",  sign: "ૈ", sound: "ai", hint: "Special mark ABOVE" },
  { key: "o",   sign: "ો", sound: "o",  hint: "Top + RIGHT mark" },
  { key: "au",  sign: "ૌ", sound: "au", hint: "Top + RIGHT + extra mark" },
  { key: "am",  sign: "ં", sound: ["am", "an"], say: "um", hint: "Dot ABOVE" },
  { key: "ah",  sign: "ઃ", sound: "ah", say: "ah", hint: "Two dots on the RIGHT" }
];
/* Forms that children mix up. They are shown as answer choices together
   (ki / kee, ku / koo ...) so the child learns the difference.          */
const MATRA_PARTNERS = { a: "aa", aa: "a", i: "ee", ee: "i", u: "oo", oo: "u", e: "ai", ai: "e", o: "au", au: "o", am: "ah", ah: "am" };

function makeBarakhadi(consonant) {
  const root = consonant.en.toLowerCase().slice(0, -1);   // "Kha" -> "kh"
  return MATRAS.map(m => {
    const en = [].concat(m.sound).map(s => root + s).join(" / ");   // "kam / kan"
    return {
      id: "b-" + consonant.id + "-" + m.key,
      gu: consonant.gu + m.sign,
      en: en,
      say: m.say ? root + m.say : undefined,
      tip: "💡 " + m.hint + " = " + en.toUpperCase(),
      partner: "b-" + consonant.id + "-" + MATRA_PARTNERS[m.key]
    };
  });
}

/* ---------- Vocabulary (animals, birds ... later fruits, plants, objects) ---------- */
/* Every WORD looks like this:
     {
       gujarati:      "કૂતરો",              // shown big, inside the kite
       pronunciation: "Koo-ta-ro",          // the answer choice the child picks (keep the hyphens!)
       syllables:     ["Koo", "ta", "ro"],  // spoken and highlighted one by one after a correct answer
       english:       "Dog",                // revealed only AFTER the right pronunciation is picked
       category:      "domestic",           // must be a key of the category list (e.g. ANIMAL_CATEGORIES)
       pic:           "🐕"                  // (optional) picture shown with the English meaning
     }
   The syllables are written by hand on purpose. Joined with "-" they must
   spell the pronunciation exactly (a warning appears in the console if not).

   To add more words: add lines to the list below.
   To add a new category (insects, fruits ...): add it to the category list,
   then add words with that category. Steps and mixes are made automatically. */

const ANIMAL_CATEGORIES = {
  domestic: "Domestic animals",
  wild:     "Wild animals",
  birds:    "Birds"
};

const ANIMALS = [
  /* Domestic animals (પાલતુ પ્રાણીઓ) */
  { gujarati: "કૂતરો",  pronunciation: "Koo-ta-ro",  syllables: ["Koo", "ta", "ro"],  english: "Dog",        category: "domestic", pic: "🐕" },
  { gujarati: "બિલાડી", pronunciation: "Bi-laa-di",  syllables: ["Bi", "laa", "di"],  english: "Cat",        category: "domestic", pic: "🐈" },
  { gujarati: "ગાય",    pronunciation: "Gaay",       syllables: ["Gaay"],             english: "Cow",        category: "domestic", pic: "🐄" },
  { gujarati: "ભેંસ",   pronunciation: "Bhens",      syllables: ["Bhens"],            english: "Buffalo",    category: "domestic", pic: "🐃" },
  { gujarati: "ઘોડો",   pronunciation: "Gho-do",     syllables: ["Gho", "do"],        english: "Horse",      category: "domestic", pic: "🐎" },
  { gujarati: "બકરો",   pronunciation: "Ba-ka-ro",   syllables: ["Ba", "ka", "ro"],   english: "Goat",       category: "domestic", pic: "🐐" },
  { gujarati: "ઘેટું",   pronunciation: "Ghe-tu",     syllables: ["Ghe", "tu"],        english: "Sheep",      category: "domestic", pic: "🐑" },
  { gujarati: "ઊંટ",    pronunciation: "Oont",       syllables: ["Oont"],             english: "Camel",      category: "domestic", pic: "🐪" },
  { gujarati: "ગધેડો",  pronunciation: "Ga-dhe-do",  syllables: ["Ga", "dhe", "do"],  english: "Donkey",     category: "domestic" },
  { gujarati: "સસલું",  pronunciation: "Sa-sa-lu",   syllables: ["Sa", "sa", "lu"],   english: "Rabbit",     category: "domestic", pic: "🐇" },

  /* Wild animals (જંગલી પ્રાણીઓ) */
  { gujarati: "સિંહ",   pronunciation: "Sinh",       syllables: ["Sinh"],             english: "Lion",       category: "wild", pic: "🦁" },
  { gujarati: "વાઘ",    pronunciation: "Vaagh",      syllables: ["Vaagh"],            english: "Tiger",      category: "wild", pic: "🐅" },
  { gujarati: "હાથી",   pronunciation: "Haa-thi",    syllables: ["Haa", "thi"],       english: "Elephant",   category: "wild", pic: "🐘" },
  { gujarati: "વાંદરો", pronunciation: "Vaan-da-ro", syllables: ["Vaan", "da", "ro"], english: "Monkey",     category: "wild", pic: "🐒" },
  { gujarati: "રીંછ",   pronunciation: "Reenchh",    syllables: ["Reenchh"],          english: "Bear",       category: "wild", pic: "🐻" },
  { gujarati: "હરણ",    pronunciation: "Ha-ran",     syllables: ["Ha", "ran"],        english: "Deer",       category: "wild", pic: "🦌" },
  { gujarati: "ચિત્તો",  pronunciation: "Chit-to",    syllables: ["Chit", "to"],       english: "Leopard",    category: "wild", pic: "🐆" },
  { gujarati: "ગેંડો",   pronunciation: "Gen-do",     syllables: ["Gen", "do"],        english: "Rhinoceros", category: "wild", pic: "🦏" },
  { gujarati: "જિરાફ",  pronunciation: "Ji-raaf",    syllables: ["Ji", "raaf"],       english: "Giraffe",    category: "wild", pic: "🦒" },
  { gujarati: "ઝીબ્રા",  pronunciation: "Zee-bra",    syllables: ["Zee", "bra"],       english: "Zebra",      category: "wild", pic: "🦓" },

  /* Birds (પક્ષીઓ) */
  { gujarati: "મોર",    pronunciation: "Mor",        syllables: ["Mor"],              english: "Peacock",    category: "birds", pic: "🦚" }
];

/* Turn vocabulary words into game items (the same shape the letters use).
   prefix keeps progress separate per game: "animals-dog", "fruits-mango" ... */
function makeVocab(prefix, words) {
  return words.map(w => {
    if (w.syllables.join("-") !== w.pronunciation) {
      console.warn(`Syllables of "${w.gujarati}" do not spell "${w.pronunciation}"`);
    }
    return {
      id: prefix + "-" + w.english.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      gu: w.gujarati,
      en: w.pronunciation,
      syllables: w.syllables,
      meaning: w.english,
      category: w.category,
      pic: w.pic
    };
  });
}

/* Steps of about 5 words, category by category, then mixes.
   A leftover group smaller than 3 joins the step before it
   (so a lone word never becomes a step of its own).            */
function makeVocabSets(items, categories, size, mixName) {
  size = size || 5;
  const groups = [];
  Object.keys(categories).forEach(cat => {
    const inCat = items.filter(i => i.category === cat);
    for (let i = 0; i < inCat.length; i += size) {
      const chunk = inCat.slice(i, i + size);
      if (chunk.length < 3 && groups.length) groups[groups.length - 1].items.push(...chunk);
      else groups.push({ cat, n: i / size + 1, items: chunk });
    }
  });
  const steps = groups.map((g, i) => ({ id: g.cat + "-" + g.n, label: "Step " + (i + 1), step: true, items: g.items }));
  const mixes = Object.keys(categories)
    .map(cat => ({ id: "mix-" + cat, label: "Mix: " + categories[cat].toLowerCase(), items: items.filter(i => i.category === cat) }))
    .filter(m => m.items.length >= 4);
  return steps.concat(mixes, [{ id: "mix-all", label: "Mix: " + mixName, items }]);
}

const ANIMAL_ITEMS = makeVocab("animals", ANIMALS);

/* ---------- GAMES shown on the home screen ---------- */
/*  color:      tile colour on the home screen (pink, blue, marigold, green)
    distractor: "random" = wrong answers picked at random
                "near"   = wrong answers close in value (good for numbers)
    hindiSpeech: if no Gujarati voice exists, read the letter with a Hindi voice
    sets:       the groups a child can choose from before playing          */
const GAMES = {
  consonants: {
    id: "consonants",
    title: "Gujarati Consonants",
    icon: "🅰️",
    color: "pink",
    preview: "ક ખ ગ ઘ",
    heading: "Match the Gujarati Letter",
    question: "What is this?",
    learnTitle: "Learn Gujarati Letters",
    doneText: "You learned Gujarati letters!",
    distractor: "random",
    hindiSpeech: true,
    sets: CONSONANT_STEPS.map((chars, i) => (
      { id: "step" + (i + 1), label: "Step " + (i + 1), step: true, items: pickChars(CONSONANTS, chars) }
    )).concat([
      { id: "starter", label: "Mix: starter letters", items: CONSONANTS.filter(c => c.starter) },
      { id: "all",     label: "Mix: all letters",     items: CONSONANTS }
    ])
  },

  /* One consonant at a time: all 12 forms of ક, then ખ, then ગ ...
     learnCount: how many cards Learn mode shows (all 12)
     roundAll:   every round asks each of the 12 forms (missed ones come back at the end)
     nextAt:     0 = "Next" letter is offered after every finished round (no perfect score needed) */
  barakhadi: {
    id: "barakhadi",
    title: "Barakhadi",
    icon: "🔤",
    color: "marigold",
    preview: "ક કા કિ કી",
    heading: "Match the Barakhadi",
    question: "What is this?",
    learnTitle: "Learn the Barakhadi",
    doneText: "You learned the Barakhadi!",
    distractor: "partner",
    hindiSpeech: true,
    learnCount: 12,
    roundAll: true,
    nextAt: 0,
    compactSets: true,
    sets: CONSONANTS.map((c, i) => ({
      id: "b-" + c.id,
      label: "Step " + (i + 1),
      short: c.gu,
      name: c.gu + " Barakhadi",
      step: true,
      title: "Learning the Barakhadi of " + c.gu,
      doneTitle: "🎉 You completed " + c.gu + " Barakhadi!",
      items: makeBarakhadi(c)
    }))
  },

  numbers: {
    id: "numbers",
    title: "Gujarati Numbers",
    icon: "🔢",
    color: "blue",
    preview: "૧ ૨ ૩ ૪",
    heading: "Gujarati Numbers",
    question: "What number is this?",
    learnTitle: "Learn Gujarati Numbers",
    doneText: "You learned Gujarati numbers!",
    distractor: "near",
    hindiSpeech: false,
    sets: [
      { id: "1-5",    label: "Step 1",    step: true, items: NUMBERS.slice(0, 5) },
      { id: "6-10",   label: "Step 2",    step: true, items: NUMBERS.slice(5, 10) },
      { id: "1-10",   label: "1 to 10",   items: NUMBERS.slice(0, 10) },
      { id: "11-20",  label: "11 to 20",  items: NUMBERS.slice(10, 20) },
      { id: "1-50",   label: "1 to 50",   items: NUMBERS.slice(0, 50) },
      { id: "1-100",  label: "1 to 100",  items: NUMBERS }
    ]
  },

  /* Gujarati word -> child picks how to say it -> English meaning is revealed.
     distractor "similar": at Easy/Challenge the wrong answers sound alike (Gho-do / Gen-do)
     nextDelay: a little more time so the syllables and meaning can be heard */
  animals: {
    id: "animals",
    title: "Gujarati Animals",
    icon: "🐾",
    color: "green",
    preview: "કૂતરો ગાય",
    heading: "Match the Gujarati Animal",
    question: "How do you say this?",
    learnTitle: "Learn Gujarati Animals",
    doneText: "You learned Gujarati animals!",
    distractor: "similar",
    hindiSpeech: false,
    nextDelay: 4200,
    sets: makeVocabSets(ANIMAL_ITEMS, ANIMAL_CATEGORIES, 5, "all animals")
  }

  /* Example — add vowels later like this:
  , vowels: {
    id: "vowels", title: "Gujarati Vowels", icon: "🔤", color: "marigold",
    preview: "અ આ ઇ ઈ", heading: "Match the Gujarati Vowel", question: "What is this?",
    learnTitle: "Learn Gujarati Vowels", doneText: "You learned Gujarati vowels!",
    distractor: "random", hindiSpeech: true,
    sets: [{ id: "all", label: "All vowels", items: [
      { id: "a", gu: "અ", en: "A" }, { id: "aa", gu: "આ", en: "Aa" }, { id: "i", gu: "ઇ", en: "I" }
    ]}]
  }
  */
};
