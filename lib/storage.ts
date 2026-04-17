// Tarayıcıda localStorage wrapper'ı (SSR-safe)

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export const KEYS = {
  questions: "kivilcim:questions",
  players: "kivilcim:players",
  theme: "kivilcim:theme",
  sound: "kivilcim:sound",
  timer: "kivilcim:timer",
  categories: "kivilcim:categories",
  stats: "kivilcim:stats",
};
