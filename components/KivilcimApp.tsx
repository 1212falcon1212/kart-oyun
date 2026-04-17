"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Pencil, ArrowLeft, Play, Flame,
  Users, HelpCircle, Check, X, RotateCcw, ChevronRight,
  BookOpen, ArrowRight, PartyPopper
} from "lucide-react";
import { DEFAULT_QUESTIONS } from "@/lib/questions";
import { storage, KEYS } from "@/lib/storage";

type View = "home" | "setup" | "game" | "manage" | "help";

// -----------------------------------------------------------------------------
// Yardımcılar
// -----------------------------------------------------------------------------
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// -----------------------------------------------------------------------------
// Ana uygulama
// -----------------------------------------------------------------------------
export default function KivilcimApp() {
  const [view, setView] = useState<View>("home");
  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState<string[]>(DEFAULT_QUESTIONS);
  const [players, setPlayers] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    setQuestions(storage.get(KEYS.questions, DEFAULT_QUESTIONS));
    const savedPlayers = storage.get<string[]>(KEYS.players, []);
    if (Array.isArray(savedPlayers) && savedPlayers.length >= 2) {
      setPlayers(savedPlayers);
    }
    setReady(true);
  }, []);

  const saveQuestions = (next: string[]) => {
    setQuestions(next);
    storage.set(KEYS.questions, next);
  };

  const savePlayers = (next: string[]) => {
    setPlayers(next);
    const valid = next.filter((n) => n.trim());
    if (valid.length >= 2) storage.set(KEYS.players, next);
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
      <div className="relative max-w-2xl mx-auto px-5 py-8 md:py-12">
        {view === "home" && <Home setView={setView} />}
        {view === "setup" && (
          <Setup players={players} savePlayers={savePlayers} setView={setView} />
        )}
        {view === "game" && (
          <Game
            players={players.filter((p) => p.trim())}
            questions={questions}
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
        {view === "help" && <Help setView={setView} />}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Home
// -----------------------------------------------------------------------------
function Home({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between float-in">
      <div className="flex items-center gap-2 text-mute text-sm">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="tracking-[0.2em] uppercase">Arkadaş ortamı kart oyunu</span>
      </div>

      <div className="py-16 md:py-24">
        <h1 className="font-display font-black text-[clamp(3.5rem,14vw,9rem)] leading-[0.9]">
          <span className="block">KIVIL</span>
          <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            CIM
          </span>
        </h1>
        <p className="mt-6 text-mute text-lg max-w-md leading-relaxed">
          Telefon elden ele dolaşır. Sırası gelen kart çeker, soruyu dürüstçe cevaplar.
          100 soru, ortamı kızıştırmaya hazır.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setView("setup")}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1.5px] glow"
        >
          <div className="flex items-center justify-between bg-[#1a1420] rounded-[14px] px-6 py-5 group-hover:bg-[#211727] transition">
            <span className="font-display font-bold text-xl">Oyuna Başla</span>
            <Play className="w-5 h-5" fill="currentColor" />
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView("manage")}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.06] transition"
          >
            <span className="font-semibold">Kartları Düzenle</span>
            <Pencil className="w-4 h-4 text-mute" />
          </button>
          <button
            onClick={() => setView("help")}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.06] transition"
          >
            <span className="font-semibold">Nasıl Oynanır</span>
            <HelpCircle className="w-4 h-4 text-mute" />
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Setup (oyuncular)
// -----------------------------------------------------------------------------
function Setup({
  players,
  savePlayers,
  setView,
}: {
  players: string[];
  savePlayers: (p: string[]) => void;
  setView: (v: View) => void;
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
    setLocal(local.filter((_, idx) => idx !== i));
  };
  const add = () => {
    if (local.length < 8) setLocal([...local, ""]);
  };

  const validCount = local.filter((n) => n.trim()).length;
  const canStart = validCount >= 2;

  const start = () => {
    const clean = local.map((n) => n.trim()).filter(Boolean);
    savePlayers(clean);
    setView("game");
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
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm text-mute font-semibold shrink-0">
              {i + 1}
            </div>
            <input
              value={name}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Oyuncu ${i + 1}`}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 focus:border-orange-400/50 focus:bg-white/[0.07] transition placeholder:text-muted2"
            />
            {local.length > 2 && (
              <button
                onClick={() => remove(i)}
                className="w-11 h-11 rounded-xl border border-white/10 text-mute hover:text-red-400 hover:border-red-400/30 transition flex items-center justify-center shrink-0"
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
          className="w-full border border-dashed border-white/15 rounded-xl py-3.5 text-mute hover:text-cream hover:border-white/30 transition flex items-center justify-center gap-2 mb-8"
        >
          <Plus className="w-4 h-4" /> Oyuncu ekle
        </button>
      )}

      <button
        onClick={start}
        disabled={!canStart}
        className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1.5px] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-between bg-[#1a1420] rounded-[14px] px-6 py-5">
          <span className="font-display font-bold text-xl">Başla</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Game — "telefon elden ele" akışı
// -----------------------------------------------------------------------------
type GamePhase = "pass" | "reveal" | "finished";

function Game({
  players,
  questions,
  setView,
}: {
  players: string[];
  questions: string[];
  setView: (v: View) => void;
}) {
  const [playerIdx, setPlayerIdx] = useState(0);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<GamePhase>("pass");
  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

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

  const currentPlayer = players[playerIdx];
  const remaining = questions.length - asked.size;

  const reveal = () => {
    const available = questions.filter((q) => !asked.has(q));
    if (available.length === 0) {
      setPhase("finished");
      return;
    }
    const picked = available[Math.floor(Math.random() * available.length)];
    setAsked(new Set([...asked, picked]));
    setCurrentCard(picked);
    setFlipped(false);
    setPhase("reveal");
    requestAnimationFrame(() => setTimeout(() => setFlipped(true), 80));
  };

  const nextPlayer = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentCard(null);
      setPlayerIdx((playerIdx + 1) % players.length);
      setPhase("pass");
    }, 300);
  };

  const restart = () => {
    setAsked(new Set());
    setPlayerIdx(0);
    setCurrentCard(null);
    setPhase("pass");
  };

  // Bitiş ekranı
  if (phase === "finished") {
    return (
      <div className="float-in">
        <TopBar onBack={() => setView("home")} />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <PartyPopper className="w-16 h-16 text-orange-400 mb-6" />
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Tüm sorular bitti!
          </h2>
          <p className="text-mute mb-10 max-w-sm">
            {questions.length} soru bitti. Ortam yeterince kızıştıysa bırakın,
            yoksa yeniden başlayın.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={restart}
              className="rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1.5px]"
            >
              <div className="bg-[#1a1420] rounded-[14px] px-6 py-4 font-display font-bold">
                Yeniden başla
              </div>
            </button>
            <button
              onClick={() => setView("home")}
              className="rounded-2xl border border-white/10 px-6 py-4 hover:bg-white/5 transition"
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

      {/* Aşama: telefonu elden ele geçir */}
      {phase === "pass" && (
        <PassScreen playerName={currentPlayer} onTap={reveal} remaining={remaining} />
      )}

      {/* Aşama: kartı göster */}
      {phase === "reveal" && currentCard && (
        <RevealScreen
          playerName={currentPlayer}
          card={currentCard}
          flipped={flipped}
          onNext={nextPlayer}
        />
      )}

      {/* Oyuncu sırası alt indikatör */}
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {players.map((p, i) => (
          <div
            key={i}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              i === playerIdx
                ? "bg-white/10 border-white/30 text-cream"
                : "border-white/5 text-muted2"
            }`}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

// "Telefon sende" ekranı
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
      <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-semibold group-hover:bg-white/10 group-active:scale-95 transition">
        Hazırım — kartı çek
      </div>
      <div className="mt-6 text-xs text-muted2">
        {remaining} soru kaldı
      </div>
    </button>
  );
}

// Kart açılma ekranı
function RevealScreen({
  playerName,
  card,
  flipped,
  onNext,
}: {
  playerName: string;
  card: string;
  flipped: boolean;
  onNext: () => void;
}) {
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

      <div className="perspective max-w-md mx-auto">
        <div className="relative aspect-[3/4]">
          <div className={`card-3d absolute inset-0 ${flipped ? "flipped" : ""}`}>
            {/* Arka yüz */}
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

            {/* Ön yüz */}
            <div className="card-face card-front bg-[#1a1420] border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 opacity-10" />
              <div className="relative h-full flex flex-col p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase opacity-70">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Soru
                </div>
                <div className="flex-1 flex items-center">
                  <p className="font-display font-bold text-xl md:text-2xl leading-snug">
                    {card}
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
        className="mt-8 mx-auto block rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 px-8 py-4 font-semibold transition"
      >
        Cevapladım, sıradakine geç
        <ArrowRight className="inline w-4 h-4 ml-2" />
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Manage (kart düzenleme)
// -----------------------------------------------------------------------------
function Manage({
  questions,
  saveQuestions,
  setView,
}: {
  questions: string[];
  saveQuestions: (q: string[]) => void;
  setView: (v: View) => void;
}) {
  const [newText, setNewText] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const addCard = () => {
    const t = newText.trim();
    if (!t) return;
    saveQuestions([t, ...questions]);
    setNewText("");
  };

  const deleteCard = (i: number) => {
    saveQuestions(questions.filter((_, idx) => idx !== i));
  };

  const startEdit = (i: number) => {
    setEditIdx(i);
    setEditText(questions[i]);
  };
  const saveEdit = () => {
    if (editIdx === null || !editText.trim()) return;
    const next = [...questions];
    next[editIdx] = editText.trim();
    saveQuestions(next);
    setEditIdx(null);
    setEditText("");
  };

  const resetAll = () => {
    saveQuestions(DEFAULT_QUESTIONS);
    setConfirmReset(false);
  };

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
        <button
          onClick={() => setConfirmReset(true)}
          className="text-xs text-mute hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg px-3 py-2 flex items-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Varsayılanlara dön
        </button>
      </div>

      {confirmReset && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm">
            Emin misin? Tüm özel kartların silinecek, 100 varsayılan geri gelecek.
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-sm"
            >
              İptal
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-sm font-semibold"
            >
              Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* Yeni kart */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-3 flex gap-2">
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

      {/* Liste */}
      <div className="space-y-2 max-h-[55vh] overflow-y-auto scroll-smooth pr-2">
        {questions.length === 0 && (
          <div className="text-center text-muted2 py-10">
            Hiç soru yok. Ekle ya da varsayılanları geri getir.
          </div>
        )}
        {questions.map((text, i) => (
          <div
            key={i}
            className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-start gap-3 hover:border-white/10 transition"
          >
            {editIdx === i ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 resize-none"
                  autoFocus
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={saveEdit}
                    className="w-9 h-9 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditIdx(null)}
                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-muted2 w-7 shrink-0 pt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 leading-snug">{text}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => startEdit(i)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-mute"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCard(i)}
                    className="w-8 h-8 rounded-lg hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-mute"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Help
// -----------------------------------------------------------------------------
function Help({ setView }: { setView: (v: View) => void }) {
  const steps = [
    {
      icon: Users,
      title: "Oyuncuları gir",
      text: "2 ila 8 kişi. Herkes adını ekler, sıra ona göre döner.",
    },
    {
      icon: ArrowRight,
      title: "Telefonu elden ele gezdir",
      text: "Sırası gelen oyuncu telefonu alır, adını görür, hazır olduğunda kartı çeker.",
    },
    {
      icon: BookOpen,
      title: "Soruyu dürüstçe cevapla",
      text: "Açığa çıkarmak istemezsen pas geçme cezasını grup belirler (örn. bir yudum içki ya da ayağa kalkıp dans).",
    },
    {
      icon: Pencil,
      title: "Kartları özelleştir",
      text: "Kendi gruba özel soruları ekle: iç şakalar, ortak anılar. Hazır sorulardan çok daha çok güldürür.",
    },
  ];

  return (
    <div className="float-in">
      <TopBar onBack={() => setView("home")} />
      <h2 className="font-display font-bold text-4xl md:text-5xl mt-8 mb-8">
        Nasıl oynanır
      </h2>
      <div className="space-y-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-lg mb-1">{s.title}</div>
                <div className="text-mute leading-relaxed">{s.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-orange-400/20 bg-orange-400/5 p-5 text-sm leading-relaxed">
        <div className="font-display font-bold text-orange-300 mb-2">Kural</div>
        <p className="text-[#D5C7AE]">
          Bir soru bir oyun seansında sadece bir kez çıkar. 100 soru bitince oyun kendi
          kendine biter. İstersen yeniden başlat.
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Ortak
// -----------------------------------------------------------------------------
function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-mute hover:text-cream transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Ana menü
      </button>
      <div className="flex items-center gap-1.5 text-mute text-xs tracking-[0.2em] uppercase">
        <Flame className="w-3.5 h-3.5 text-orange-400" /> Kıvılcım
      </div>
    </div>
  );
}
