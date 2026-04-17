"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus, Trash2, Pencil, ArrowLeft, Play, Flame,
  Check, X, RotateCcw, ChevronRight,
  ArrowRight, PartyPopper, Volume2, VolumeX,
  Sun, Moon, Timer, Download, Upload, Filter,
} from "lucide-react";
import {
  DEFAULT_QUESTIONS,
  CATEGORIES,
  CATEGORY_LABEL,
  type Question,
  type Category,
} from "@/lib/questions";
import { storage, KEYS } from "@/lib/storage";
import { sfx, vibrate, soundEnabled, setSoundEnabled } from "@/lib/sound";

type View = "home" | "setup" | "game" | "manage";
type Theme = "dark" | "light";
type TimerOpt = 0 | 30 | 60;

const ALL_CATEGORIES: Category[] = CATEGORIES.map((c) => c.key);

// -----------------------------------------------------------------------------
// Yardımcılar
// -----------------------------------------------------------------------------
// Eski string[] formatını yeni Question[] formatına taşı
function migrateQuestions(raw: unknown): Question[] {
  if (!Array.isArray(raw)) return DEFAULT_QUESTIONS;
  if (raw.length === 0) return DEFAULT_QUESTIONS;
  if (typeof raw[0] === "string") {
    return (raw as string[]).map((text) => {
      const match = DEFAULT_QUESTIONS.find((q) => q.text === text);
      return { text, category: match?.category ?? "eglenceli" };
    });
  }
  return raw as Question[];
}

// -----------------------------------------------------------------------------
// Ana uygulama
// -----------------------------------------------------------------------------
export default function KivilcimApp() {
  const [view, setView] = useState<View>("home");
  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [players, setPlayers] = useState<string[]>(["", "", "", ""]);
  const [theme, setTheme] = useState<Theme>("dark");
  const [sound, setSound] = useState(true);
  const [timerSec, setTimerSec] = useState<TimerOpt>(0);
  const [selectedCats, setSelectedCats] = useState<Category[]>(ALL_CATEGORIES);

  useEffect(() => {
    setQuestions(migrateQuestions(storage.get(KEYS.questions, DEFAULT_QUESTIONS)));
    const savedPlayers = storage.get<string[]>(KEYS.players, []);
    if (Array.isArray(savedPlayers) && savedPlayers.length >= 2) {
      setPlayers(savedPlayers);
    }
    setTheme(storage.get<Theme>(KEYS.theme, "dark"));
    setSound(soundEnabled());
    setTimerSec(storage.get<TimerOpt>(KEYS.timer, 0));
    setSelectedCats(storage.get<Category[]>(KEYS.categories, ALL_CATEGORIES));
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const saveQuestions = (next: Question[]) => {
    setQuestions(next);
    storage.set(KEYS.questions, next);
  };

  const savePlayers = (next: string[]) => {
    setPlayers(next);
    const valid = next.filter((n) => n.trim());
    if (valid.length >= 2) storage.set(KEYS.players, next);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    storage.set(KEYS.theme, next);
    sfx.tap();
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) sfx.tap();
  };

  const saveTimer = (v: TimerOpt) => {
    setTimerSec(v);
    storage.set(KEYS.timer, v);
  };

  const saveCategories = (v: Category[]) => {
    setSelectedCats(v);
    storage.set(KEYS.categories, v);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-ink text-cream flex items-center justify-center font-body">
        <Flame className="w-10 h-10 animate-pulse text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream font-body grain relative overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-5 pb-8 md:pb-12 safe-top safe-bottom">
        {view === "home" && (
          <Home
            setView={setView}
            theme={theme}
            sound={sound}
            toggleTheme={toggleTheme}
            toggleSound={toggleSound}
          />
        )}
        {view === "setup" && (
          <Setup
            players={players}
            savePlayers={savePlayers}
            setView={setView}
            timerSec={timerSec}
            saveTimer={saveTimer}
            selectedCats={selectedCats}
            saveCategories={saveCategories}
            questions={questions}
          />
        )}
        {view === "game" && (
          <Game
            players={players.filter((p) => p.trim())}
            questions={questions.filter((q) => selectedCats.includes(q.category))}
            timerSec={timerSec}
            setView={setView}
          />
        )}
        {view === "manage" && (
          <Manage
            questions={questions}
            saveQuestions={saveQuestions}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Home
// -----------------------------------------------------------------------------
function Home({
  setView,
  theme,
  sound,
  toggleTheme,
  toggleSound,
}: {
  setView: (v: View) => void;
  theme: Theme;
  sound: boolean;
  toggleTheme: () => void;
  toggleSound: () => void;
}) {
  return (
    <div className="min-h-[85vh] flex flex-col float-in">
      <div className="flex items-center justify-end gap-1.5">
        <IconToggle onClick={toggleSound} label={sound ? "Sesi kapat" : "Sesi aç"}>
          {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </IconToggle>
        <IconToggle onClick={toggleTheme} label={theme === "dark" ? "Açık tema" : "Koyu tema"}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </IconToggle>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 py-12">
        <button
          onClick={() => { sfx.tap(); vibrate(20); setView("setup"); }}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1.5px] glow"
        >
          <div className="flex items-center justify-between bg-surface rounded-[14px] px-6 py-5 group-active:scale-[0.99] transition">
            <span className="font-display font-bold text-xl">Oyuna Başla</span>
            <Play className="w-5 h-5" fill="currentColor" />
          </div>
        </button>

        <button
          onClick={() => { sfx.tap(); setView("manage"); }}
          className="w-full flex items-center justify-between rounded-2xl border border-soft bg-soft px-5 py-4 hover:bg-soft-2 transition"
        >
          <span className="font-semibold">Kartları Düzenle</span>
          <Pencil className="w-4 h-4 text-mute" />
        </button>
      </div>
    </div>
  );
}

function IconToggle({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-10 h-10 rounded-xl border border-soft bg-soft text-cream flex items-center justify-center hover:bg-soft-2 transition"
    >
      {children}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Setup (oyuncular + ayarlar)
// -----------------------------------------------------------------------------
function Setup({
  players,
  savePlayers,
  setView,
  timerSec,
  saveTimer,
  selectedCats,
  saveCategories,
  questions,
}: {
  players: string[];
  savePlayers: (p: string[]) => void;
  setView: (v: View) => void;
  timerSec: TimerOpt;
  saveTimer: (v: TimerOpt) => void;
  selectedCats: Category[];
  saveCategories: (v: Category[]) => void;
  questions: Question[];
}) {
  const [local, setLocal] = useState<string[]>(
    players.length < 2 ? ["", "", "", ""] : [...players]
  );

  const update = (i: number, v: string) => {
    const next = [...local];
    next[i] = v;
    setLocal(next);
  };
  const remove = (i: number) => {
    if (local.length <= 2) return;
    vibrate(15);
    setLocal(local.filter((_, idx) => idx !== i));
  };
  const add = () => {
    if (local.length < 8) {
      sfx.tap();
      vibrate(10);
      setLocal([...local, ""]);
    }
  };

  const validCount = local.filter((n) => n.trim()).length;
  const deckSize = questions.filter((q) => selectedCats.includes(q.category)).length;
  const canStart = validCount >= 2 && deckSize > 0;

  const start = () => {
    const clean = local.map((n) => n.trim()).filter(Boolean);
    savePlayers(clean);
    sfx.tap();
    vibrate(25);
    setView("game");
  };

  const toggleCat = (cat: Category) => {
    vibrate(10);
    if (selectedCats.includes(cat)) {
      if (selectedCats.length === 1) return;
      saveCategories(selectedCats.filter((c) => c !== cat));
    } else {
      saveCategories([...selectedCats, cat]);
    }
  };

  return (
    <div className="float-in">
      <TopBar onBack={() => setView("home")} />

      <h2 className="font-display font-bold text-4xl md:text-5xl mt-8 mb-2">
        Kimler var?
      </h2>
      <p className="text-mute mb-8">2 ila 8 oyuncu. İsimleri sırayla yaz.</p>

      <div className="space-y-2.5 mb-6">
        {local.map((name, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-soft border border-soft flex items-center justify-center text-sm text-mute font-semibold shrink-0">
              {i + 1}
            </div>
            <input
              value={name}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Oyuncu ${i + 1}`}
              className="flex-1 bg-soft border border-soft rounded-xl px-4 py-3.5 focus:border-soft-3 focus:bg-soft-2 transition placeholder:text-muted2"
            />
            {local.length > 2 && (
              <button
                onClick={() => remove(i)}
                aria-label="Oyuncuyu çıkar"
                className="w-11 h-11 rounded-xl border border-soft text-mute hover:text-red-400 hover:border-red-400/30 transition flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {local.length < 8 && (
        <button
          onClick={add}
          className="w-full border border-dashed border-soft-2 rounded-xl py-3.5 text-mute hover:text-cream hover:border-soft-3 transition flex items-center justify-center gap-2 mb-8"
        >
          <Plus className="w-4 h-4" /> Oyuncu ekle
        </button>
      )}

      {/* Kategori filtresi */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-mute text-sm">
          <Filter className="w-4 h-4 text-orange-400" />
          <span>Kategoriler</span>
          <span className="ml-auto text-xs text-muted2">{deckSize} soru aktif</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCats.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => toggleCat(cat.key)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                  active
                    ? "border-orange-400/40 bg-orange-400/10"
                    : "border-soft bg-soft text-mute"
                }`}
              >
                <span>{cat.emoji}</span>
                <span className="font-medium">{cat.label}</span>
                {active && <Check className="w-3.5 h-3.5 ml-auto text-orange-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zamanlayıcı */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-mute text-sm">
          <Timer className="w-4 h-4 text-orange-400" />
          <span>Cevap süresi (opsiyonel)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {([0, 30, 60] as TimerOpt[]).map((opt) => (
            <button
              key={opt}
              onClick={() => { sfx.tap(); vibrate(10); saveTimer(opt); }}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                timerSec === opt
                  ? "border-orange-400/40 bg-orange-400/10"
                  : "border-soft bg-soft text-mute"
              }`}
            >
              {opt === 0 ? "Kapalı" : `${opt}s`}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={start}
        disabled={!canStart}
        className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1.5px] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-between bg-surface rounded-[14px] px-6 py-5">
          <span className="font-display font-bold text-xl">Başla</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>
      {deckSize === 0 && (
        <div className="mt-3 text-xs text-red-400 text-center">
          Seçili kategoride soru yok. En az bir kategori seç.
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Game — "telefon elden ele" akışı
// -----------------------------------------------------------------------------
type GamePhase = "pass" | "reveal" | "finished";

type StoredStats = {
  gamesPlayed: number;
  totalQuestions: number;
  totalSeconds: number;
  lastGame?: {
    players: number;
    questions: number;
    seconds: number;
    date: number;
  };
};

function Game({
  players,
  questions,
  timerSec,
  setView,
}: {
  players: string[];
  questions: Question[];
  timerSec: TimerOpt;
  setView: (v: View) => void;
}) {
  const [playerIdx, setPlayerIdx] = useState(0);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<GamePhase>("pass");
  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [startedAt] = useState<number>(() => Date.now());
  const [secondsLeft, setSecondsLeft] = useState<number>(timerSec);
  const confettiFiredRef = useRef(false);

  const remaining = questions.length - asked.size;

  const reveal = useCallback(() => {
    const available = questions.filter((q) => !asked.has(q.text));
    if (available.length === 0) {
      setPhase("finished");
      return;
    }
    const picked = available[Math.floor(Math.random() * available.length)];
    setAsked(new Set([...asked, picked.text]));
    setCurrentCard(picked);
    setFlipped(false);
    setSecondsLeft(timerSec);
    setPhase("reveal");
    vibrate([30, 40, 30]);
    requestAnimationFrame(() =>
      setTimeout(() => {
        setFlipped(true);
        sfx.flip();
      }, 80)
    );
  }, [questions, asked, timerSec]);

  const nextPlayer = useCallback(() => {
    sfx.next();
    vibrate(15);
    setFlipped(false);
    setTimeout(() => {
      setCurrentCard(null);
      setPlayerIdx((playerIdx + 1) % players.length);
      setPhase("pass");
    }, 300);
  }, [playerIdx, players.length]);

  const restart = () => {
    sfx.tap();
    vibrate(20);
    setAsked(new Set());
    setPlayerIdx(0);
    setCurrentCard(null);
    confettiFiredRef.current = false;
    setPhase("pass");
  };

  // Klavye kısayolu: Space = kart çek / sıradakine geç
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== " ") return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      e.preventDefault();
      if (phase === "pass") reveal();
      else if (phase === "reveal") nextPlayer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, reveal, nextPlayer]);

  // Zamanlayıcı
  useEffect(() => {
    if (phase !== "reveal" || timerSec === 0) return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          sfx.finish();
          vibrate([80, 60, 80]);
          return 0;
        }
        if (s <= 4) sfx.tick();
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, timerSec, secondsLeft]);

  // Bitiş: konfeti + istatistik
  useEffect(() => {
    if (phase !== "finished" || confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    sfx.finish();
    vibrate([60, 40, 60, 40, 120]);

    const elapsedSec = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const prev = storage.get<StoredStats>(KEYS.stats, {
      gamesPlayed: 0,
      totalQuestions: 0,
      totalSeconds: 0,
    });
    storage.set<StoredStats>(KEYS.stats, {
      gamesPlayed: prev.gamesPlayed + 1,
      totalQuestions: prev.totalQuestions + asked.size,
      totalSeconds: prev.totalSeconds + elapsedSec,
      lastGame: {
        players: players.length,
        questions: asked.size,
        seconds: elapsedSec,
        date: Date.now(),
      },
    });

    import("canvas-confetti").then(({ default: confetti }) => {
      const fire = (particleRatio: number, opts: Parameters<typeof confetti>[0]) => {
        confetti({
          origin: { y: 0.7 },
          particleCount: Math.floor(200 * particleRatio),
          ...opts,
        });
      };
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    });
  }, [phase, startedAt, asked.size, players.length]);

  if (players.length < 2) {
    return (
      <div className="float-in">
        <TopBar onBack={() => setView("home")} />
        <div className="mt-20 text-center text-mute">
          Önce oyuncuları ekle.
          <button
            onClick={() => setView("setup")}
            className="block mx-auto mt-4 text-orange-400 underline"
          >
            Oyuncu ekranına git
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="float-in">
        <TopBar onBack={() => setView("home")} />
        <div className="mt-20 text-center text-mute">
          Seçili kategoride hiç soru yok.
          <button
            onClick={() => setView("setup")}
            className="block mx-auto mt-4 text-orange-400 underline"
          >
            Ayarlara dön
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = players[playerIdx];

  if (phase === "finished") {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    const mm = Math.floor(elapsed / 60);
    const ss = elapsed % 60;
    return (
      <div className="float-in">
        <TopBar onBack={() => setView("home")} />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <PartyPopper className="w-16 h-16 text-orange-400 mb-6" />
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Tüm sorular bitti!
          </h2>
          <p className="text-mute mb-6 max-w-sm">
            Ortam yeterince kızıştıysa bırakın, yoksa yeniden başlayın.
          </p>
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
            <StatBox label="Soru" value={String(asked.size)} />
            <StatBox label="Süre" value={`${mm}:${ss.toString().padStart(2, "0")}`} />
            <StatBox label="Oyuncu" value={String(players.length)} />
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={restart}
              className="rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1.5px]"
            >
              <div className="bg-surface rounded-[14px] px-6 py-4 font-display font-bold">
                Yeniden başla
              </div>
            </button>
            <button
              onClick={() => setView("home")}
              className="rounded-2xl border border-soft px-6 py-4 hover:bg-soft transition"
            >
              Ana menü
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="float-in">
      <TopBar onBack={() => setView("home")} />

      {/* Soru sayacı */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-mute">
        <Flame className="w-3 h-3 text-orange-400" />
        <span>{asked.size} / {questions.length}</span>
      </div>

      {phase === "pass" && (
        <PassScreen playerName={currentPlayer} onTap={reveal} remaining={remaining} />
      )}

      {phase === "reveal" && currentCard && (
        <RevealScreen
          playerName={currentPlayer}
          card={currentCard}
          flipped={flipped}
          onNext={nextPlayer}
          secondsLeft={timerSec > 0 ? secondsLeft : null}
          timerMax={timerSec}
        />
      )}

      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {players.map((p, i) => (
          <div
            key={i}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              i === playerIdx
                ? "bg-soft-3 border-soft-3 text-cream"
                : "border-soft text-muted2"
            }`}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-soft bg-soft py-3">
      <div className="font-display font-bold text-2xl">{value}</div>
      <div className="text-xs text-muted2 mt-0.5">{label}</div>
    </div>
  );
}

function PassScreen({
  playerName,
  onTap,
  remaining,
}: {
  playerName: string;
  onTap: () => void;
  remaining: number;
}) {
  return (
    <button
      onClick={onTap}
      className="w-full min-h-[65vh] flex flex-col items-center justify-center text-center group"
    >
      <div className="text-mute text-xs tracking-[0.25em] uppercase mb-4">
        Telefon sırada
      </div>
      <div className="font-display font-black text-[clamp(3rem,11vw,6rem)] leading-none mb-8">
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          {playerName}
        </span>
      </div>
      <div className="rounded-2xl border border-soft-2 bg-soft px-6 py-4 font-semibold group-hover:bg-soft-2 group-active:scale-95 transition pulse-ring">
        Hazırım — kartı çek
      </div>
      <div className="mt-6 text-xs text-muted2">
        {remaining} soru kaldı
      </div>
    </button>
  );
}

function RevealScreen({
  playerName,
  card,
  flipped,
  onNext,
  secondsLeft,
  timerMax,
}: {
  playerName: string;
  card: Question;
  flipped: boolean;
  onNext: () => void;
  secondsLeft: number | null;
  timerMax: TimerOpt;
}) {
  const categoryMeta = CATEGORIES.find((c) => c.key === card.category);
  const pct = secondsLeft !== null && timerMax > 0 ? (secondsLeft / timerMax) * 100 : 0;
  const isLow = secondsLeft !== null && secondsLeft <= 5 && secondsLeft > 0;
  const isZero = secondsLeft === 0;

  return (
    <div>
      <div className="mt-4 mb-6 text-center">
        <div className="text-mute text-xs tracking-[0.25em] uppercase mb-1">
          Sıra kimde
        </div>
        <div className="font-display font-bold text-2xl">
          <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            {playerName}
          </span>
        </div>
      </div>

      {secondsLeft !== null && (
        <div className="max-w-md mx-auto mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-mute flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" />
              Süre
            </span>
            <span className={`font-mono font-bold ${isLow ? "text-orange-400" : isZero ? "text-red-400" : "text-cream"}`}>
              {secondsLeft}s
            </span>
          </div>
          <div className="h-1.5 bg-soft rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                isZero
                  ? "bg-red-400"
                  : isLow
                  ? "bg-orange-400"
                  : "bg-gradient-to-r from-orange-400 to-pink-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="perspective max-w-md mx-auto">
        <div className={`relative aspect-[3/4] ${isZero ? "shake" : ""}`}>
          <div className={`card-3d absolute inset-0 ${flipped ? "flipped" : ""}`}>
            <div className="card-face card-back bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />
              <div className="relative h-full flex items-center justify-center text-white">
                <Flame className="w-16 h-16 opacity-80" />
              </div>
            </div>

            <div className="card-face card-front bg-surface border border-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 opacity-10" />
              <div className="relative h-full flex flex-col p-6 md:p-8">
                <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase opacity-70">
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Soru</span>
                  </div>
                  {categoryMeta && (
                    <span className="normal-case tracking-normal flex items-center gap-1">
                      <span>{categoryMeta.emoji}</span>
                      <span>{categoryMeta.label}</span>
                    </span>
                  )}
                </div>
                <div className="flex-1 flex items-center">
                  <p className="font-display font-bold text-xl md:text-2xl leading-snug">
                    {card.text}
                  </p>
                </div>
                <div className="text-right text-xs opacity-40">Cevapla</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-8 mx-auto block rounded-2xl bg-soft-2 hover:bg-soft-3 border border-soft px-8 py-4 font-semibold transition"
      >
        Cevapladım, sıradakine geç
        <ArrowRight className="inline w-4 h-4 ml-2" />
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Manage (kart düzenleme + export/import)
// -----------------------------------------------------------------------------
function Manage({
  questions,
  saveQuestions,
  setView,
}: {
  questions: Question[];
  saveQuestions: (q: Question[]) => void;
  setView: (v: View) => void;
}) {
  const [newText, setNewText] = useState("");
  const [newCat, setNewCat] = useState<Category>("eglenceli");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editCat, setEditCat] = useState<Category>("eglenceli");
  const [confirmReset, setConfirmReset] = useState(false);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addCard = () => {
    const t = newText.trim();
    if (!t) return;
    sfx.tap();
    vibrate(10);
    saveQuestions([{ text: t, category: newCat }, ...questions]);
    setNewText("");
  };

  const deleteCard = (i: number) => {
    vibrate(15);
    saveQuestions(questions.filter((_, idx) => idx !== i));
  };

  const startEdit = (i: number) => {
    setEditIdx(i);
    setEditText(questions[i].text);
    setEditCat(questions[i].category);
  };
  const saveEdit = () => {
    if (editIdx === null || !editText.trim()) return;
    const next = [...questions];
    next[editIdx] = { text: editText.trim(), category: editCat };
    saveQuestions(next);
    setEditIdx(null);
    setEditText("");
    sfx.tap();
  };

  const resetAll = () => {
    saveQuestions(DEFAULT_QUESTIONS);
    setConfirmReset(false);
    vibrate(30);
  };

  const exportJson = () => {
    sfx.tap();
    const blob = new Blob([JSON.stringify(questions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kivilcim-kartlar-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("Geçersiz format");
      const valid: Question[] = [];
      const validCats = new Set(CATEGORIES.map((c) => c.key));
      for (const item of parsed) {
        if (typeof item === "string") {
          valid.push({ text: item, category: "eglenceli" });
        } else if (
          item &&
          typeof item.text === "string" &&
          typeof item.category === "string" &&
          validCats.has(item.category)
        ) {
          valid.push({ text: item.text, category: item.category });
        }
      }
      if (valid.length === 0) throw new Error("Dosyada geçerli soru yok");
      saveQuestions(valid);
      setImportMsg(`${valid.length} soru içe aktarıldı.`);
      sfx.finish();
      vibrate(40);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Yüklenemedi";
      setImportMsg(`Hata: ${msg}`);
    }
    setTimeout(() => setImportMsg(null), 3500);
  };

  const filtered =
    filter === "all" ? questions : questions.filter((q) => q.category === filter);

  return (
    <div className="float-in">
      <TopBar onBack={() => setView("home")} />

      <div className="flex items-start justify-between mt-8 mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-2">
            Kartlar
          </h2>
          <p className="text-mute">
            {questions.length} soru. Kendi gruba özel olanları ekle.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportJson}
            className="text-xs text-mute hover:text-cream border border-soft hover:border-soft-3 rounded-lg px-3 py-2 flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Dışa aktar
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs text-mute hover:text-cream border border-soft hover:border-soft-3 rounded-lg px-3 py-2 flex items-center gap-2 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            İçe aktar
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJson(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => setConfirmReset(true)}
            className="text-xs text-mute hover:text-red-400 border border-soft hover:border-red-400/30 rounded-lg px-3 py-2 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
        </div>
      </div>

      {importMsg && (
        <div className="mb-4 rounded-xl border border-soft bg-soft-2 px-4 py-3 text-sm">
          {importMsg}
        </div>
      )}

      {confirmReset && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm">
            Emin misin? Tüm özel kartların silinecek, 100 varsayılan geri gelecek.
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg bg-soft-2 text-sm"
            >
              İptal
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold"
            >
              Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* Yeni kart */}
      <div className="mb-4 rounded-2xl border border-soft bg-soft p-3">
        <div className="flex gap-2 mb-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCard()}
            placeholder="Yeni bir soru yaz..."
            className="flex-1 bg-transparent px-3 py-2 placeholder:text-muted2"
          />
          <button
            onClick={addCard}
            disabled={!newText.trim()}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white disabled:opacity-30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Ekle
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setNewCat(c.key)}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                newCat === c.key
                  ? "border-orange-400/40 bg-orange-400/10 text-cream"
                  : "border-soft text-mute hover:text-cream"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs px-2.5 py-1 rounded-full border transition ${
            filter === "all"
              ? "border-orange-400/40 bg-orange-400/10 text-cream"
              : "border-soft text-mute"
          }`}
        >
          Tümü ({questions.length})
        </button>
        {CATEGORIES.map((c) => {
          const n = questions.filter((q) => q.category === c.key).length;
          return (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                filter === c.key
                  ? "border-orange-400/40 bg-orange-400/10 text-cream"
                  : "border-soft text-mute"
              }`}
            >
              {c.emoji} {c.label} ({n})
            </button>
          );
        })}
      </div>

      {/* Liste */}
      <div className="space-y-2 max-h-[55vh] overflow-y-auto scroll-smooth pr-2">
        {filtered.length === 0 && (
          <div className="text-center text-muted2 py-10">
            Bu kategoride soru yok.
          </div>
        )}
        {filtered.map((q) => {
          const i = questions.indexOf(q);
          const catMeta = CATEGORIES.find((c) => c.key === q.category);
          return (
            <div
              key={`${i}-${q.text}`}
              className="group rounded-xl border border-soft bg-soft p-4 flex items-start gap-3 hover:bg-soft-2 transition"
            >
              {editIdx === i ? (
                <div className="flex-1 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full bg-soft-2 border border-soft rounded-lg px-3 py-2 resize-none"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setEditCat(c.key)}
                        className={`text-xs px-2 py-0.5 rounded-full border transition ${
                          editCat === c.key
                            ? "border-orange-400/40 bg-orange-400/10"
                            : "border-soft text-mute"
                        }`}
                      >
                        {c.emoji} {c.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={saveEdit}
                      className="w-9 h-9 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30"
                      aria-label="Kaydet"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditIdx(null)}
                      className="w-9 h-9 rounded-lg bg-soft flex items-center justify-center hover:bg-soft-2"
                      aria-label="İptal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-muted2 w-7 shrink-0 pt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 leading-snug">
                    <div>{q.text}</div>
                    {catMeta && (
                      <div className="mt-1.5 text-xs text-muted2 flex items-center gap-1">
                        <span>{catMeta.emoji}</span>
                        <span>{catMeta.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition">
                    <button
                      onClick={() => startEdit(i)}
                      className="w-8 h-8 rounded-lg hover:bg-soft-2 flex items-center justify-center text-mute"
                      aria-label="Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCard(i)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-mute"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Ortak
// -----------------------------------------------------------------------------
function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={() => { sfx.tap(); vibrate(10); onBack(); }}
        aria-label="Ana menü"
        className="flex items-center gap-2 rounded-xl border border-soft bg-soft px-4 py-2.5 text-sm text-cream hover:bg-soft-2 active:scale-95 transition min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Ana menü</span>
      </button>
      <div className="flex items-center gap-1.5 text-mute text-xs tracking-[0.2em] uppercase">
        <Flame className="w-3.5 h-3.5 text-orange-400" /> Kıvılcım
      </div>
    </div>
  );
}

// Export tipleri (diğer modüller için)
export type { Question, Category };
