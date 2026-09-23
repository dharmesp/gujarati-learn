/* =========================================================================
   Gujarati Match & Learn — GAME LOGIC
   Learning data lives in data.js. Settings you may like to change:
   ========================================================================= */
const ROUND_LENGTH = 10;   // questions per round
const LEARN_COUNT = 8;     // cards shown in "Learn First"
const NEXT_DELAY = 1700;   // ms before the next question after a correct answer

const LEVELS = {
  beginner:  { choices: 2 },
  easy:      { choices: 3 },
  challenge: { choices: 4 }
};
const CARD_COLORS = ["blue", "yellow", "green", "red"];
const KITE_COLORS = [
  ["#FFB3C8", "#FFDD7A"], ["#A9D2FF", "#FFC99E"], ["#B8EDCB", "#FFB3C8"],
  ["#DCC8FF", "#A9EDE4"], ["#FFDD7A", "#A9D2FF"], ["#FFC99E", "#B8EDCB"]
];

(function () {
  "use strict";

  const $ = sel => document.querySelector(sel);
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- saved progress (this browser only) ---------------- */
  const STORE_KEY = "gujarati-match-v1";
  function loadSaved() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { data = {}; }
    return {
      stats: data.stats || {},        // stats[gameId][itemId] = { r: rightCount, w: wrongCount }
      best: data.best || {},          // best[gameId] = best score
      doneSets: data.doneSets || {},  // doneSets[gameId] = ids of finished steps
      viewed: data.viewed || {},      // viewed[gameId] = ids shown in Learn
      last: data.last || null,        // where the child stopped (to continue next time)
      totalStars: data.totalStars || 0,
      rounds: data.rounds || 0,
      sound: data.sound !== false,
      level: data.level || "beginner"
    };
  }
  let saved = loadSaved();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(saved)); } catch (e) { /* storage blocked: game still works */ }
  }

  /* ---------------- game state ---------------- */
  const state = {
    gameId: null,
    setId: null,
    level: LEVELS[saved.level] ? saved.level : "beginner",
    learnList: [],
    learnIndex: 0,
    recentLearn: new Set(),
    queue: [],
    retrySlots: new Set(),
    qIndex: 0,
    score: 0,
    current: null,
    triedWrong: false,
    locked: false,
    sessionMiss: {},        // itemId -> times missed this session
    missedThisRound: [],
    timer: null
  };

  const game = () => GAMES[state.gameId];
  const currentSet = () => {
    const g = game();
    return g.sets.find(s => s.id === state.setId) || g.sets[0];
  };
  const pool = () => currentSet().items;
  /* every item in a game, once each */
  const allItems = g => {
    const seen = new Set();
    return g.sets.flatMap(s => s.items).filter(i => !seen.has(i.id) && seen.add(i.id));
  };
  const learnCount = () => game().learnCount || LEARN_COUNT;

  /* ---------------- helpers ---------------- */
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function statFor(item, gameId) {
    const g = saved.stats[gameId || state.gameId] || {};
    return g[item.id] || { r: 0, w: 0 };
  }
  function weakness(item) {
    const s = statFor(item);
    return Math.max(0, s.w - s.r);
  }
  function record(item, correct) {
    const byGame = saved.stats[state.gameId] || (saved.stats[state.gameId] = {});
    const s = byGame[item.id] || (byGame[item.id] = { r: 0, w: 0 });
    if (correct) s.r++; else s.w++;
    save();
  }
  function recordHint(item) {
    const byGame = saved.stats[state.gameId] || (saved.stats[state.gameId] = {});
    const s = byGame[item.id] || (byGame[item.id] = { r: 0, w: 0 });
    s.h = (s.h || 0) + 1;
    save();
  }
  function markViewed(item) {
    const ids = saved.viewed[state.gameId] || (saved.viewed[state.gameId] = []);
    if (!ids.includes(item.id)) ids.push(item.id);
  }
  /* has the child met this item before (in Learn or in a game)? */
  function isSeen(item, gameId) {
    gameId = gameId || state.gameId;
    return state.recentLearn.has(item.id) ||
      (saved.viewed[gameId] || []).includes(item.id) ||
      masteryOf(item, gameId) !== "new";
  }
  /* "6 / 12 completed": forms seen in Learn or matched correctly */
  function setProgress(g, set) {
    const viewed = saved.viewed[g.id] || [];
    const done = set.items.filter(i => viewed.includes(i.id) || statFor(i, g.id).r > 0).length;
    return { done, total: set.items.length };
  }
  function setName(set) {
    if (set.name) return set.name;
    const preview = set.items.slice(0, 5).map(i => i.gu).join(" ") + (set.items.length > 5 ? " …" : "");
    return set.label + ": " + preview;
  }

  /* Save exactly where the child is, so closing the app never loses anything */
  function saveProgress(phase, advance) {
    if (!state.gameId) return;
    const last = { gameId: state.gameId, setId: state.setId, level: state.level, phase, at: Date.now() };
    if (phase === "learn") {
      last.learn = { ids: state.learnList.map(i => i.id), index: state.learnIndex, onlyNew: !!state.learnOnlyNew };
    }
    if (phase === "game") {
      last.round = {
        ids: state.queue.map(i => i.id),
        qIndex: state.qIndex + (advance || 0),
        score: state.score,
        retry: [...state.retrySlots],
        missed: state.missedThisRound.map(i => i.id),
        total: state.roundTotal
      };
    }
    saved.last = last;
    save();
  }
  function isSetDone(set, gameId) {
    const ids = saved.doneSets[gameId] || [];
    return ids.includes(set.id) || set.items.every(i => masteryOf(i, gameId) === "mastered");
  }
  function masteryOf(item, gameId) {
    const s = statFor(item, gameId);
    if (s.r >= 3 && s.r >= s.w * 2) return "mastered";
    if (s.r + s.w > 0) return "learning";
    return "new";
  }

  /* Items missed this session (or often missed before) get picked more often */
  function weight(item) {
    return 1
      + 3 * (state.sessionMiss[item.id] || 0)
      + Math.min(3, weakness(item))
      + (state.recentLearn.has(item.id) ? 2 : 0);
  }
  function weightedPick(list) {
    const total = list.reduce((sum, i) => sum + weight(i), 0);
    let r = Math.random() * total;
    for (const i of list) { r -= weight(i); if (r <= 0) return i; }
    return list[list.length - 1];
  }

  /* ---------------- kite ---------------- */
  function setKite(kiteEl, text, animate) {
    const glyph = kiteEl.querySelector(".kite-glyph");
    glyph.textContent = text;
    // count letters only; matras like ા િ don't make it wider
    const len = [...text.replace(/[ઁ-ઃ઼-્]/g, "")].length;
    glyph.className = "kite-glyph gu" + (len >= 3 ? " len-3" : len === 2 ? " len-2" : "");
    const pair = KITE_COLORS[Math.floor(Math.random() * KITE_COLORS.length)];
    kiteEl.style.setProperty("--ka", pair[0]);
    kiteEl.style.setProperty("--kb", pair[1]);
    if (animate) replayClass(kiteEl, "enter");
  }
  function replayClass(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // restart CSS animation
    el.classList.add(cls);
  }

  function picHTML(item) {
    if (!item.pic && !item.word) return "";
    let html = "";
    if (item.pic) {
      html += item.count
        ? `<span class="pic-count" aria-hidden="true">${item.pic.repeat(item.count)}</span>`
        : `<span class="pic" aria-hidden="true">${item.pic}</span>`;
    }
    if (item.word) {
      const sub = [item.wordEn, item.meaning].filter(Boolean).join(" · ");
      html += `<span class="pic-word"><span class="gu">${escapeHTML(item.word)}</span><small>${escapeHTML(sub)}</small></span>`;
    }
    return html;
  }

  /* ---------------- sound effects (Web Audio, no files needed) ---------------- */
  let audioCtx = null;
  function tones(notes, type, gainLevel) {
    if (!saved.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      let t = audioCtx.currentTime;
      notes.forEach(([freq, dur]) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(gainLevel, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
        t += dur * 0.8;
      });
    } catch (e) { /* no audio available */ }
  }
  const playCorrect = () => tones([[660, .14], [880, .14], [1320, .28]], "sine", 0.18);
  const playTryAgain = () => tones([[392, .16], [330, .24]], "triangle", 0.12);
  const playFanfare = () => tones([[523, .14], [659, .14], [784, .14], [1047, .4]], "sine", 0.18);

  /* ---------------- speech (browser text-to-speech) ---------------- */
  const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let voices = [];
  function refreshVoices() { if (canSpeak) voices = window.speechSynthesis.getVoices() || []; }
  if (canSpeak) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  function findVoice(prefix) {
    return voices.find(v => (v.lang || "").toLowerCase().replace("_", "-").startsWith(prefix));
  }
  /* Gujarati and Devanagari Unicode blocks line up, so ક (U+0A95) -> क (U+0915) */
  function toDevanagari(text) {
    return text.replace(/[઀-૿]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x180));
  }
  function utter(text, voice, lang) {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : lang;
    u.rate = 0.8;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }
  function speakItem(item) {
    if (!canSpeak) return;
    try {
      refreshVoices();
      window.speechSynthesis.cancel();
      const gu = findVoice("gu");
      if (gu) {
        utter(item.gu, gu);
      } else if (game().hindiSpeech) {
        const hi = findVoice("hi");
        if (hi) utter(toDevanagari(item.gu), hi);
      }
      utter(item.say || item.en, findVoice("en"), "en-US");
    } catch (e) { /* speech failed: game still works */ }
  }

  /* ---------------- confetti ---------------- */
  function confetti(amount) {
    if (reduceMotion) return;
    const canvas = $("#confetti");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#FF5E8A", "#FFB400", "#3D7BFF", "#1FA463", "#7B5CFF", "#FF8A3D"];
    const bits = Array.from({ length: amount }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.4,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      size: 7 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      diamond: Math.random() < 0.4 // little kites!
    }));
    const start = performance.now();
    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      bits.forEach(b => {
        b.x += b.vx; b.y += b.vy; b.vy += 0.04; b.rot += b.vr;
        if (b.y < H + 20) alive = true;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.color;
        if (b.diamond) {
          ctx.beginPath();
          ctx.moveTo(0, -b.size); ctx.lineTo(b.size * .8, 0); ctx.lineTo(0, b.size); ctx.lineTo(-b.size * .8, 0);
          ctx.closePath(); ctx.fill();
        } else {
          ctx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2);
        }
        ctx.restore();
      });
      if (alive && now - start < 5000) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- screens ---------------- */
  function show(name) {
    clearTimeout(state.timer);
    if (canSpeak) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== "screen-" + name; });
    $("#btn-home").hidden = name === "home";
    window.scrollTo(0, 0);
  }

  /* ---------------- HOME ---------------- */
  function renderHome() {
    const wrap = $("#game-tiles");
    wrap.innerHTML = "";
    Object.values(GAMES).forEach(g => {
      const b = document.createElement("button");
      b.type = "button";
      b.id = "tile-" + g.id;
      b.className = "tile tile-" + (g.color || "pink");
      b.innerHTML =
        `<span class="tile-icon" aria-hidden="true">${g.icon}</span>` +
        `<span class="tile-title">${escapeHTML(g.title)}</span>` +
        `<span class="tile-preview gu" aria-hidden="true">${escapeHTML(g.preview)}</span>` +
        `<span class="tile-go">Let's go ▶</span>`;
      b.addEventListener("click", () => openSetup(g.id));
      wrap.appendChild(b);
    });
    $("#home-stars").textContent = "⭐ " + saved.totalStars;
    renderWelcome();
  }

  /* The set to continue with: the last one, or the next step if it was finished */
  function resumeSet() {
    const last = saved.last;
    const g = last && GAMES[last.gameId];
    const set = g && g.sets.find(s => s.id === last.setId);
    if (!set) return null;
    if (last.phase === "done" && set.step && isSetDone(set, g.id)) {
      const next = g.sets[g.sets.indexOf(set) + 1];
      if (next && next.step) return { g, set: next, moved: true };
    }
    return { g, set, moved: false };
  }
  function useResumeSet() {
    const r = resumeSet();
    if (!r) return false;
    if (state.gameId !== r.g.id || state.setId !== r.set.id) state.recentLearn = new Set();
    state.gameId = r.g.id;
    state.setId = r.set.id;
    if (LEVELS[saved.last.level]) state.level = saved.last.level;
    return true;
  }

  function renderWelcome() {
    const r = resumeSet();
    $("#welcome").hidden = !r;
    $("#screen-home").classList.toggle("returning", !!r);
    $("#choose-label").textContent = r ? "Or choose a game" : "Choose a game";
    if (!r) return;
    const away = Date.now() - (saved.last.at || 0) > 20 * 60 * 1000;
    const p = setProgress(r.g, r.set);
    $("#welcome-hi").textContent = away ? "👋 Welcome back!" : "🌟 Keep going!";
    $("#welcome-game").textContent = (r.moved ? "Next up · " : "Continue learning · ") + r.g.title;
    $("#welcome-title").textContent = setName(r.set);
    $("#welcome-bar").style.width = (p.done / p.total * 100) + "%";
    $("#welcome-count").textContent = `${p.done} / ${p.total} completed`;
    $("#btn-continue").textContent = r.moved ? "Start ▶" : "Continue ▶";
  }

  /* Pick up exactly where the child stopped */
  function continueLearning() {
    const last = saved.last;
    if (!useResumeSet()) return;
    const g = game();
    const find = id => allItems(g).find(i => i.id === id);
    const sameSet = last.setId === state.setId;

    if (sameSet && last.phase === "learn" && last.learn) {
      const list = last.learn.ids.map(find).filter(Boolean);
      if (list.length) {
        state.learnList = list;
        state.learnIndex = Math.min(last.learn.index || 0, list.length - 1);
        state.learnOnlyNew = last.learn.onlyNew;
        list.forEach(i => state.recentLearn.add(i.id));
        openLearnScreen();
        return;
      }
    }
    if (sameSet && last.phase === "game" && last.round) {
      const q = last.round.ids.map(find).filter(Boolean);
      if (q.length && last.round.qIndex < q.length) {
        state.queue = q;
        state.qIndex = last.round.qIndex;
        state.score = last.round.score || 0;
        state.retrySlots = new Set(last.round.retry || []);
        state.missedThisRound = (last.round.missed || []).map(find).filter(Boolean);
        state.roundTotal = last.round.total || q.length;
        show("game");
        nextQuestion();
        return;
      }
    }
    playCurrent();
  }
  /* never quiz an item the child has not seen: show new ones first */
  function playCurrent() {
    if (unseenItems().length) startLearn(true); else startGame();
  }
  function goHome() { renderHome(); show("home"); }

  /* ---------------- SETUP ---------------- */
  function openSetup(gameId) {
    if (state.gameId !== gameId) state.recentLearn = new Set();
    state.gameId = gameId;
    const g = game();
    if (!g.sets.some(s => s.id === state.setId)) {
      // start at the first step the child hasn't finished yet
      const steps = g.sets.filter(s => s.step);
      const next = steps.find(s => !isSetDone(s, g.id));
      state.setId = (next || steps[steps.length - 1] || g.sets[0]).id;
    }
    $("#setup-icon").textContent = g.icon;
    $("#setup-title").textContent = g.title;
    renderLevels();
    renderSets();
    show("setup");
  }
  function renderLevels() {
    document.querySelectorAll(".level").forEach(b => {
      b.setAttribute("aria-pressed", String(b.dataset.level === state.level));
    });
  }
  function renderSets() {
    const wrap = $("#set-chips");
    wrap.innerHTML = "";
    game().sets.forEach(set => {
      const b = document.createElement("button");
      b.type = "button";
      b.id = "set-" + state.gameId + "-" + set.id;
      b.className = "set-btn";
      b.setAttribute("aria-pressed", String(set.id === state.setId));
      const preview = set.items.length <= 5
        ? set.items.map(i => i.gu).join(" ")
        : set.items.slice(0, 4).map(i => i.gu).join(" ") + " …";
      const done = isSetDone(set, state.gameId);
      b.classList.toggle("is-step", !!set.step);
      if (game().compactSets && set.short) {
        b.classList.add("is-letter");
        b.setAttribute("aria-label", set.title || set.label);
        b.innerHTML = `<span class="set-letter gu">${escapeHTML(set.short)}</span>` +
          `<span class="set-name">${done ? '<span class="set-done">✓</span>' : escapeHTML(set.label)}</span>`;
      } else {
        b.innerHTML =
          `<span class="set-name">${escapeHTML(set.label)}${done ? ' <span class="set-done">✓</span>' : ""}</span>` +
          `<span class="set-preview gu">${escapeHTML(preview)}</span>`;
      }
      b.addEventListener("click", () => {
        if (state.setId !== set.id) state.recentLearn = new Set();
        state.setId = set.id;
        renderSets();
      });
      wrap.appendChild(b);
    });
  }

  /* ---------------- LEARN ---------------- */
  /* Items the child has never seen (not learned, never answered) */
  function unseenItems() {
    return pool().filter(i => !isSeen(i));
  }

  function startLearn(onlyNew) {
    const items = pool();
    if (onlyNew) {
      // brand-new letters, in their natural order (ક ખ ગ ઘ)
      state.learnList = unseenItems().slice(0, learnCount());
    } else if (items.length <= learnCount()) {
      // a small step: learn every item in order
      state.learnList = items.slice();
    } else {
      // a big mix: letters the child finds hard come first, then a random mix
      const weak = shuffle(items.filter(i => weakness(i) > 0 || state.sessionMiss[i.id]))
        .sort((a, b) => (weakness(b) + (state.sessionMiss[b.id] || 0)) - (weakness(a) + (state.sessionMiss[a.id] || 0)));
      const rest = shuffle(items.filter(i => !weak.includes(i)));
      state.learnList = weak.concat(rest).slice(0, learnCount());
    }
    state.learnIndex = 0;
    state.learnOnlyNew = !!onlyNew;
    state.learnList.forEach(i => state.recentLearn.add(i.id));
    openLearnScreen();
  }
  function openLearnScreen() {
    $("#learn-title").textContent = currentSet().title || game().learnTitle;
    $("#learn-note").hidden = !state.learnOnlyNew;
    show("learn");
    renderLearn();
  }
  function renderLearn() {
    const item = state.learnList[state.learnIndex];
    const last = state.learnIndex === state.learnList.length - 1;
    setKite($("#learn-kite"), item.gu, true);
    $("#learn-en").textContent = item.en;
    $("#learn-tip").hidden = !item.tip;
    $("#learn-tip").textContent = item.tip || "";
    $("#learn-pic").innerHTML = picHTML(item);
    $("#learn-count").textContent = `${state.learnIndex + 1} / ${state.learnList.length}`;
    $("#btn-learn-back").disabled = state.learnIndex === 0;
    $("#btn-learn-next").textContent = last ? "Play! ▶" : "Next ▶";
    $("#learn-dots").innerHTML = state.learnList.map((_, i) =>
      `<span class="dot${i < state.learnIndex ? " done" : ""}${i === state.learnIndex ? " now" : ""}"></span>`).join("");
    markViewed(item);
    saveProgress("learn");
  }

  /* ---------------- GAME ---------------- */
  function buildQueue() {
    // only ask about letters the child has already seen
    const seenOnes = pool().filter(i => isSeen(i));
    const items = seenOnes.length >= 2 ? seenOnes : pool();
    if (game().roundAll) return shuffle(items);
    // letters that were hard go into the bag twice
    const extra = items.filter(i => (state.sessionMiss[i.id] || 0) > 0 || weakness(i) >= 2);
    let bag = [];
    const q = [];
    while (q.length < ROUND_LENGTH) {
      if (!bag.length) bag = items.concat(extra);
      const prev = q[q.length - 1];
      const options = bag.filter(i => i !== prev);
      const pick = weightedPick(options.length ? options : bag);
      q.push(pick);
      bag.splice(bag.indexOf(pick), 1);
    }
    return q;
  }

  function startGame() {
    state.queue = buildQueue();
    state.retrySlots = new Set();
    state.roundTotal = state.queue.length;
    state.qIndex = 0;
    state.score = 0;
    state.missedThisRound = [];
    show("game");
    nextQuestion();
  }

  function buildChoices(item, count) {
    const g = game();
    // wrong answers must never have the same label as the right one (e.g. ટ and ત are both "Ta")
    const seen = new Set([item.en]);
    let candidates = [];
    pool().forEach(i => { if (!seen.has(i.en)) { seen.add(i.en); candidates.push(i); } });

    if (g.distractor === "near" && typeof item.value === "number") {
      candidates.sort((a, b) => Math.abs(a.value - item.value) - Math.abs(b.value - item.value));
      candidates = candidates.slice(0, Math.max(count * 2, 4));
    }
    // look-alike form (ki / kee, ku / koo) is always one of the wrong answers
    if (g.distractor === "partner" && item.partner && count > 1) {
      const partner = candidates.find(i => i.id === item.partner);
      if (partner) {
        const others = shuffle(candidates.filter(i => i !== partner)).slice(0, count - 2);
        return shuffle([item, partner].concat(others));
      }
    }
    // small step without enough different answers? borrow from the whole game
    if (candidates.length < count - 1) {
      shuffle(allItems(g)).forEach(i => { if (!seen.has(i.en)) { seen.add(i.en); candidates.push(i); } });
    }
    const wrong = shuffle(candidates).slice(0, count - 1);
    return shuffle([item].concat(wrong));
  }

  function nextQuestion() {
    if (state.qIndex >= state.queue.length) { finishRound(); return; }
    const g = game();
    const item = state.queue[state.qIndex];
    state.current = item;
    state.triedWrong = false;
    state.locked = false;

    $("#q-count").textContent = `Question ${state.qIndex + 1} / ${state.queue.length}`;
    $("#score-pill").textContent = `⭐ Score: ${state.score}`;
    $("#progress-fill").style.width = (state.qIndex / state.queue.length * 100) + "%";
    $("#game-heading").textContent = currentSet().title || g.heading;

    const isRetry = state.retrySlots.has(state.qIndex);
    const q = $("#game-question");
    q.textContent = isRetry ? "🔁 Remember this one?" : g.question;
    q.classList.toggle("again", isRetry);

    setKite($("#game-kite"), item.gu, true);

    const choices = buildChoices(item, LEVELS[state.level].choices);
    const colors = shuffle(CARD_COLORS);
    const wrap = $("#answers");
    wrap.innerHTML = "";
    wrap.classList.remove("done");
    wrap.dataset.count = choices.length;
    choices.forEach((choice, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.id = "answer-" + idx;
      b.className = "answer c-" + colors[idx % colors.length];
      b.textContent = choice.en;
      if (choice.en.length > 5) b.classList.add("is-long");
      b.dataset.correct = String(choice === item);
      b.addEventListener("click", () => choose(b, choice));
      wrap.appendChild(b);
    });

    $("#feedback").innerHTML = "";
    saveProgress("game");
  }

  function pairHTML(item, sign) {
    return `<span class="fb-pair"><span class="gu">${escapeHTML(item.gu)}</span> ${sign} <span>${escapeHTML(item.en)}</span></span>`;
  }

  function choose(btn, choice) {
    if (state.locked || btn.disabled) return;
    const item = state.current;
    const fb = $("#feedback");

    if (choice === item) {
      state.locked = true;
      const bonusRepeat = game().roundAll && state.retrySlots.has(state.qIndex);
      if (!state.triedWrong && !bonusRepeat) {
        state.score++;
        record(item, true);
        replayClass($("#score-pill"), "bump");
      }
      $("#score-pill").textContent = `⭐ Score: ${state.score}`;
      btn.classList.add("is-correct");
      $("#answers").classList.add("done");
      replayClass($("#game-kite"), "fly");
      fb.innerHTML =
        `<div class="fb-title good fb-in">🎉 Correct!</div>${pairHTML(item, "=")}` +
        (item.pic || item.word ? `<div class="pic-row">${picHTML(item)}</div>` : "");
      playCorrect();
      if (saved.sound) setTimeout(() => speakItem(item), 350);
      saveProgress("game", 1);   // saved as answered, even if the app closes now
      state.timer = setTimeout(() => { state.qIndex++; nextQuestion(); }, state.triedWrong ? NEXT_DELAY + 900 : NEXT_DELAY);
    } else {
      btn.classList.add("is-wrong");
      btn.disabled = true;
      if (!state.triedWrong) {
        state.triedWrong = true;
        record(item, false);
        state.sessionMiss[item.id] = (state.sessionMiss[item.id] || 0) + 1;
        if (!state.missedThisRound.includes(item)) state.missedThisRound.push(item);
        requeue(item);
      }
      if (item.tip) recordHint(item);
      saveProgress("game");
      fb.innerHTML = `<div class="fb-title retry fb-in">😊 Try Again!</div>${pairHTML(item, "→")}` +
        (item.tip ? `<div class="fb-tip">${escapeHTML(item.tip)}</div>` : "");
      playTryAgain();
      // briefly show where the right answer is
      const right = $("#answers").querySelector('[data-correct="true"]');
      if (right) replayClass(right, "is-hint");
    }
  }

  /* A missed letter comes back again later in the same round */
  function requeue(item) {
    const q = state.queue;
    if (game().roundAll) {
      const at = Math.max(state.qIndex + 3, q.length - 2);
      const pos = Math.min(at, q.length);
      q.splice(pos, 0, item);
      // shift retry marks that sit after the insert point
      state.retrySlots = new Set([...state.retrySlots].map(p => (p >= pos ? p + 1 : p)));
      state.retrySlots.add(pos);
      return;
    }
    for (let p = state.qIndex + 2; p < q.length; p++) {
      if (q[p] !== item && q[p - 1] !== item && !state.retrySlots.has(p) && (p + 1 >= q.length || q[p + 1] !== item)) {
        q[p] = item;
        state.retrySlots.add(p);
        return;
      }
    }
  }

  /* ---------------- RESULTS ---------------- */
  function nextStep() {
    const sets = game().sets;
    const i = sets.findIndex(s => s.id === state.setId);
    const next = sets[i + 1];
    return sets[i] && sets[i].step && next && next.step ? next : null;
  }

  function finishRound() {
    const g = game();
    const total = state.roundTotal || state.queue.length;
    const set = currentSet();
    const ratio = state.score / total;
    const stars = Math.max(1, Math.round(ratio * 5));

    saved.totalStars += stars;
    saved.rounds++;
    saved.best[g.id] = Math.max(saved.best[g.id] || 0, state.score);

    const cheer = ratio >= 0.8 ? "🎉 Amazing!" : ratio >= 0.5 ? "🌟 Great Job!" : "💪 Good Try!";
    $("#res-title").textContent = set.doneTitle || cheer;
    $("#res-sub").textContent = set.doneTitle ? cheer.replace(/^\S+\s/, "") : g.doneText;
    $("#res-score").textContent = `${state.score} / ${total}`;
    $("#res-stars").innerHTML = Array.from({ length: 5 }, (_, i) =>
      `<span class="star${i < stars ? "" : " off"}" style="animation-delay:${i * 0.12}s">⭐</span>`).join("");
    $("#res-stars").setAttribute("aria-label", `${stars} out of 5 stars`);

    const list = $("#res-practice-list");
    list.innerHTML = "";
    state.missedThisRound.forEach(item => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "practice-chip";
      chip.innerHTML = `<span class="gu">${escapeHTML(item.gu)}</span> → ${escapeHTML(item.en)} <span aria-hidden="true">🔊</span>`;
      chip.addEventListener("click", () => speakItem(item));
      list.appendChild(chip);
    });
    $("#res-practice").hidden = state.missedThisRound.length === 0;

    // did well on a step? offer the next one
    const next = nextStep();
    const passed = ratio >= (g.nextAt != null ? g.nextAt : 0.8);
    if (passed && set.step) {
      const ids = saved.doneSets[g.id] || (saved.doneSets[g.id] = []);
      if (!ids.includes(set.id)) { ids.push(set.id); save(); }
    }
    saveProgress("done");
    const ready = next && passed;
    $("#btn-next-step").hidden = !ready;
    if (ready) {
      const preview = next.items.slice(0, 5).map(i => i.gu).join(" ");
      $("#btn-next-step").innerHTML = next.short
        ? `➡ Next: <span class="gu">${escapeHTML(next.short)}</span>`
        : `➡ ${escapeHTML(next.label)}: <span class="gu">${escapeHTML(preview)}</span>`;
    }

    show("results");
    playFanfare();
    confetti(160);
  }

  /* ---------------- MY SCORE ---------------- */
  function openScores() {
    let mastered = 0;
    const wrap = $("#mastery");
    wrap.innerHTML = "";
    Object.values(GAMES).forEach(g => {
      let cells;
      if (g.compactSets) {
        // one cell per consonant: how many of its forms are learned (e.g. 7 / 12)
        cells = g.sets.map(set => {
          const n = set.items.filter(i => masteryOf(i, g.id) === "mastered").length;
          mastered += n;
          const m = n === set.items.length ? "mastered" : set.items.some(i => masteryOf(i, g.id) !== "new") ? "learning" : "new";
          return `<div class="m-cell ${m}"><span class="gu">${escapeHTML(set.short)}</span><small>${n} / ${set.items.length}${m === "mastered" ? " ✓" : ""}</small></div>`;
        }).join("");
      } else {
        cells = allItems(g).map(item => {
          const m = masteryOf(item, g.id);
          if (m === "mastered") mastered++;
          return `<div class="m-cell ${m}"><span class="gu">${escapeHTML(item.gu)}</span><small>${escapeHTML(item.en)}${m === "mastered" ? " ✓" : ""}</small></div>`;
        }).join("");
      }
      const played = saved.best[g.id] != null;
      const section = document.createElement("section");
      section.className = "mastery-game";
      section.innerHTML =
        `<div class="mastery-head"><h3>${g.icon} ${escapeHTML(g.title)}</h3>` +
        `<span class="mastery-best">${played ? "" : "Not played yet"}</span></div>` +
        `<div class="mastery-grid">${cells}</div>`;
      wrap.appendChild(section);
    });
    $("#sum-stars").textContent = saved.totalStars;
    $("#sum-rounds").textContent = saved.rounds;
    $("#sum-mastered").textContent = mastered;
    show("scores");
  }

  /* ---------------- PARENTS ---------------- */
  let gateAnswer = 0;
  let pendingReset = null;
  function openParents() {
    const a = 3 + Math.floor(Math.random() * 7), b = 4 + Math.floor(Math.random() * 6);
    gateAnswer = a + b;
    $("#gate-q").textContent = `${a} + ${b}`;
    $("#gate-answer").value = "";
    $("#gate-msg").hidden = true;
    $("#parent-gate").hidden = false;
    $("#parent-panel").hidden = true;
    show("parents");
  }
  function openParentPanel() {
    $("#parent-gate").hidden = true;
    $("#parent-panel").hidden = false;
    $("#pp-msg").textContent = "";
    $("#pp-confirm").hidden = true;
    const gameSel = $("#pp-game");
    gameSel.innerHTML = Object.values(GAMES).map(g => `<option value="${g.id}">${escapeHTML(g.title)}</option>`).join("");
    const r = resumeSet();
    gameSel.value = r ? r.g.id : Object.keys(GAMES)[0];
    fillParentSets(r ? r.set.id : null);
    renderParentStats();
  }
  function fillParentSets(selectId) {
    const g = GAMES[$("#pp-game").value];
    $("#pp-set").innerHTML = g.sets.map(s => `<option value="${s.id}">${escapeHTML(setName(s))}</option>`).join("");
    if (selectId && g.sets.some(s => s.id === selectId)) $("#pp-set").value = selectId;
    $("#pp-reset-name").textContent = g.title;
  }
  function renderParentStats() {
    const last = saved.last;
    const g = last && GAMES[last.gameId];
    const set = g && g.sets.find(s => s.id === last.setId);
    let right = 0, wrong = 0, hints = 0;
    const hard = [];
    Object.keys(saved.stats).forEach(gid => {
      const gm = GAMES[gid];
      if (!gm) return;
      const items = allItems(gm);
      Object.entries(saved.stats[gid]).forEach(([id, st]) => {
        right += st.r || 0; wrong += st.w || 0; hints += st.h || 0;
        const item = items.find(i => i.id === id);
        if (item && st.w > 0) hard.push({ item, st });
      });
    });
    $("#pp-last").textContent = set
      ? `Last played ${new Date(last.at).toLocaleString()} · ${g.title} · ${setName(set)}. ` +
        `Correct answers: ${right}. Wrong answers: ${wrong}. Hints shown: ${hints}.`
      : "Not played yet.";
    hard.sort((a, b) => (b.st.w - b.st.r) - (a.st.w - a.st.r) || b.st.w - a.st.w);
    $("#pp-hard").innerHTML = hard.length
      ? hard.slice(0, 10).map(h => `<span class="practice-chip"><span class="gu">${escapeHTML(h.item.gu)}</span> ${escapeHTML(h.item.en)} <small>✗${h.st.w} ✓${h.st.r}</small></span>`).join("")
      : `<span class="note">Nothing yet.</span>`;
  }
  function askReset(text, action) {
    pendingReset = action;
    $("#pp-confirm-text").textContent = text;
    $("#pp-confirm").hidden = false;
    $("#btn-pp-no").focus();
  }

  /* ---------------- sound toggle ---------------- */
  function renderSound() {
    const b = $("#btn-sound");
    b.textContent = saved.sound ? "🔊 Sound on" : "🔇 Sound off";
    b.setAttribute("aria-pressed", String(saved.sound));
  }

  /* ---------------- wire up buttons ---------------- */
  $("#btn-home").addEventListener("click", goHome);
  $("#btn-res-home").addEventListener("click", goHome);
  $("#btn-sound").addEventListener("click", () => {
    saved.sound = !saved.sound;
    if (!saved.sound && canSpeak) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    save();
    renderSound();
  });
  $("#btn-scores").addEventListener("click", openScores);
  $("#btn-continue").addEventListener("click", continueLearning);
  $("#btn-quick-learn").addEventListener("click", () => { if (useResumeSet()) startLearn(false); });
  $("#btn-quick-practice").addEventListener("click", () => { if (useResumeSet()) playCurrent(); });
  $("#btn-quick-progress").addEventListener("click", openScores);
  $("#btn-parents").addEventListener("click", openParents);
  $("#btn-scores-parents").addEventListener("click", openParents);

  document.querySelectorAll(".level").forEach(b => b.addEventListener("click", () => {
    state.level = b.dataset.level;
    saved.level = state.level;
    save();
    renderLevels();
  }));
  $("#btn-learn").addEventListener("click", () => startLearn(false));
  // never quiz a letter the child has not seen: show new ones first
  $("#btn-play").addEventListener("click", playCurrent);

  $("#btn-learn-listen").addEventListener("click", () => speakItem(state.learnList[state.learnIndex]));
  $("#btn-learn-back").addEventListener("click", () => {
    if (state.learnIndex > 0) { state.learnIndex--; renderLearn(); }
  });
  $("#btn-learn-next").addEventListener("click", () => {
    if (state.learnIndex < state.learnList.length - 1) { state.learnIndex++; renderLearn(); }
    else startGame();
  });
  $("#btn-learn-skip").addEventListener("click", startGame);

  $("#btn-again").addEventListener("click", startGame);
  $("#btn-learn-more").addEventListener("click", () => startLearn(false));
  $("#btn-next-step").addEventListener("click", () => {
    const next = nextStep();
    if (!next) return;
    state.setId = next.id;
    playCurrent();
  });

  $("#parent-gate").addEventListener("submit", e => {
    e.preventDefault();
    if (Number($("#gate-answer").value) === gateAnswer) openParentPanel();
    else { $("#gate-msg").hidden = false; $("#gate-answer").value = ""; }
  });
  $("#pp-game").addEventListener("change", () => fillParentSets(null));
  $("#btn-pp-start").addEventListener("click", () => {
    const g = GAMES[$("#pp-game").value];
    const set = g.sets.find(s => s.id === $("#pp-set").value);
    if ($("#pp-mark").checked && set.step) {
      const ids = saved.doneSets[g.id] || (saved.doneSets[g.id] = []);
      for (const s of g.sets) {
        if (s === set) break;
        if (s.step && !ids.includes(s.id)) ids.push(s.id);
      }
    }
    saved.last = { gameId: g.id, setId: set.id, level: state.level, phase: "start", at: Date.now() };
    save();
    state.gameId = null; state.setId = null;
    $("#pp-msg").textContent = `Done. "Continue" on the home screen now starts at ${setName(set)}.`;
  });
  $("#btn-pp-reset-game").addEventListener("click", () => {
    const g = GAMES[$("#pp-game").value];
    askReset(`Clear all progress for ${g.title}? Stars stay.`, () => {
      delete saved.stats[g.id]; delete saved.best[g.id]; delete saved.doneSets[g.id]; delete saved.viewed[g.id];
      if (saved.last && saved.last.gameId === g.id) saved.last = null;
      return `${g.title} progress cleared.`;
    });
  });
  $("#btn-pp-clear").addEventListener("click", () => {
    askReset("Clear ALL saved data on this device: stars, progress and settings?", () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) {}
      saved = loadSaved();
      renderSound();
      return "All saved data cleared.";
    });
  });
  $("#btn-pp-no").addEventListener("click", () => { $("#pp-confirm").hidden = true; pendingReset = null; });
  $("#btn-pp-yes").addEventListener("click", () => {
    if (!pendingReset) return;
    const msg = pendingReset();
    pendingReset = null;
    state.sessionMiss = {};
    state.recentLearn = new Set();
    state.gameId = null; state.setId = null;
    save();
    $("#pp-confirm").hidden = true;
    openParentPanel();
    $("#pp-msg").textContent = msg;
  });

  /* save when the app is hidden or closed */
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") save(); });
  window.addEventListener("pagehide", save);

  /* keyboard: 1–4 picks an answer, arrows move through Learn cards */
  document.addEventListener("keydown", e => {
    if (!$("#screen-game").hidden && /^[1-4]$/.test(e.key)) {
      const b = $("#answers").children[Number(e.key) - 1];
      if (b) b.click();
    } else if (!$("#screen-learn").hidden) {
      if (e.key === "ArrowRight") $("#btn-learn-next").click();
      if (e.key === "ArrowLeft" && !$("#btn-learn-back").disabled) $("#btn-learn-back").click();
    }
  });

  if (!canSpeak) $("#btn-learn-listen").hidden = true;

  renderSound();
  renderHome();
  show("home");

  /* offline support: only works when served from a website (https) */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* offline mode unavailable here */ });
    });
  }
})();
