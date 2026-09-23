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
