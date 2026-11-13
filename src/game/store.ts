import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { GradeBand } from '../content/poa';
import { SECTIONS, SECTION_BY_ID, SPECIAL_BADGES, sectionOfActivity, type SectionId } from './sections';
import { sfx } from '../audio/sfx';
import { music } from '../audio/music';

export type Route = { name: 'title' } | { name: 'island' } | { name: 'section'; id: SectionId } | { name: 'summary' };

export type Quality = 'high' | 'low';

interface Toast {
  id: number;
  kind: 'achievement' | 'complete' | 'info';
  title: string;
  body?: string;
}

export interface GameState {
  // persisted
  grade: GradeBand | null;
  teamName: string;
  mentorView: boolean;
  sound: boolean;
  music: boolean;
  quality: Quality;
  done: Record<string, number>; // `${grade}:${activityId}` -> timestamp
  answers: Record<string, unknown>; // `${grade}:${key}` -> value
  badges: Record<string, number>; // `${grade}:${badgeId}` -> timestamp
  visited: Record<string, true>; // sectionId
  lastSection: SectionId | null;

  // session
  route: Route;
  toasts: Toast[];

  setGrade: (g: GradeBand) => void;
  setTeamName: (n: string) => void;
  setMentorView: (v: boolean) => void;
  setSound: (v: boolean) => void;
  setMusic: (v: boolean) => void;
  setQuality: (q: Quality) => void;
  go: (r: Route) => void;
  complete: (activityId: string) => void;
  isDone: (activityId: string) => boolean;
  setAnswer: (key: string, value: unknown) => void;
  getAnswer: <T>(key: string, fallback: T) => T;
  award: (badgeId: string) => void;
  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
  resetGrade: () => void;
}

/** localStorage can throw (private mode, blocked storage) — never let that break the game. */
const safeStorage: StateStorage = {
  getItem: (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  setItem: (k, v) => {
    try { localStorage.setItem(k, v); } catch { /* ignore */ }
  },
  removeItem: (k) => {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  },
};

let toastSeq = 1;

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      grade: null,
      teamName: '',
      mentorView: false,
      sound: true,
      music: true,
      quality: 'high',
      done: {},
      answers: {},
      badges: {},
      visited: {},
      lastSection: null,
      route: { name: 'title' },
      toasts: [],

      setGrade: (g) => set({ grade: g }),
      setTeamName: (n) => set({ teamName: n }),
      setMentorView: (v) => set({ mentorView: v }),
      setSound: (v) => {
        sfx.setMuted(!v);
        set({ sound: v });
      },
      setQuality: (q) => set({ quality: q }),
      setMusic: (v) => {
        if (v) music.start(); else music.stop();
        set({ music: v });
      },

      go: (r) => {
        const s = get();
        if (r.name === 'section') {
          const visited = { ...s.visited, [r.id]: true as const };
          set({ route: r, visited, lastSection: r.id });
          if (SECTIONS.every((x) => visited[x.id])) get().award('b-explorer');
        } else {
          set({ route: r });
        }
        sfx.whoosh();
      },

      isDone: (activityId) => {
        const g = get().grade;
        return !!(g && get().done[`${g}:${activityId}`]);
      },

      complete: (activityId) => {
        const s = get();
        const g = s.grade;
        if (!g) return;
        const key = `${g}:${activityId}`;
        if (s.done[key]) return;
        const done = { ...s.done, [key]: Date.now() };
        set({ done });
        sfx.success();
        const sec = sectionOfActivity(activityId);
        const act = sec ? SECTION_BY_ID[sec].activities.find((a) => a.id === activityId) : undefined;
        get().pushToast({ kind: 'complete', title: 'Mission complete!', body: act?.title });
        if (Object.keys(done).filter((k) => k.startsWith(g + ':')).length === 1) get().award('b-first');
        if (sec) {
          const def = SECTION_BY_ID[sec];
          if (def.activities.every((a) => done[`${g}:${a.id}`])) get().award(def.badge.id);
        }
        const all = SECTIONS.every((sd) => sd.activities.every((a) => done[`${g}:${a.id}`]));
        if (all) get().award('b-champion');
      },

      setAnswer: (key, value) => {
        const g = get().grade;
        if (!g) return;
        set({ answers: { ...get().answers, [`${g}:${key}`]: value } });
      },
      getAnswer: <T,>(key: string, fallback: T) => {
        const g = get().grade;
        if (!g) return fallback;
        const v = get().answers[`${g}:${key}`];
        return (v === undefined ? fallback : v) as T;
      },

      award: (badgeId) => {
        const s = get();
        const g = s.grade;
        if (!g) return;
        const key = `${g}:${badgeId}`;
        if (s.badges[key]) return;
        set({ badges: { ...s.badges, [key]: Date.now() } });
        const name =
          SECTIONS.find((x) => x.badge.id === badgeId)?.badge.name ?? SPECIAL_BADGES.find((b) => b.id === badgeId)?.name ?? badgeId;
        sfx.fanfare();
        get().pushToast({ kind: 'achievement', title: 'Badge unlocked', body: name });
      },

      pushToast: (t) => {
        const id = toastSeq++;
        set({ toasts: [...get().toasts.slice(-3), { ...t, id }] });
        setTimeout(() => get().dismissToast(id), t.kind === 'achievement' ? 4200 : 3200);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      resetGrade: () => {
        const g = get().grade;
        if (!g) return;
        const strip = <T,>(o: Record<string, T>) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith(g + ':')));
        set({ done: strip(get().done), answers: strip(get().answers), badges: strip(get().badges), visited: {} });
      },
    }),
    {
      name: 'skippi-poa-v2',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({
        grade: s.grade,
        teamName: s.teamName,
        mentorView: s.mentorView,
        sound: s.sound,
        music: s.music,
        quality: s.quality,
        done: s.done,
        answers: s.answers,
        badges: s.badges,
        visited: s.visited,
        lastSection: s.lastSection,
      }),
      onRehydrateStorage: () => (s) => {
        if (s) sfx.setMuted(!s.sound);
      },
    },
  ),
);

/** Reactive helpers ------------------------------------------------------ */
export function useDone(activityId: string) {
  return useGame((s) => !!(s.grade && s.done[`${s.grade}:${activityId}`]));
}

export function useAnswer<T>(key: string, fallback: T): [T, (v: T) => void] {
  const v = useGame((s) => (s.grade ? (s.answers[`${s.grade}:${key}`] as T | undefined) : undefined));
  const setAnswer = useGame((s) => s.setAnswer);
  return [v === undefined ? fallback : v, (nv: T) => setAnswer(key, nv)];
}

export function useProgress() {
  return useGame(useShallow((s: GameState) => {
    const g = s.grade;
    const total = SECTIONS.reduce((n, sd) => n + sd.activities.length, 0);
    if (!g) return { done: 0, total, pct: 0 };
    const done = SECTIONS.reduce((n, sd) => n + sd.activities.filter((a) => s.done[`${g}:${a.id}`]).length, 0);
    return { done, total, pct: done / total };
  }));
}

export function useSectionProgress(id: SectionId) {
  return useGame(useShallow((s: GameState) => {
    const g = s.grade;
    const acts = SECTION_BY_ID[id].activities;
    const done = g ? acts.filter((a) => s.done[`${g}:${a.id}`]).length : 0;
    return { done, total: acts.length };
  }));
}

/* ---------------------------------------------------------------------------
   Scene bus: lets a section's DOM panel and its 3D scene talk to each other.
   --------------------------------------------------------------------------- */
interface SceneBus {
  focus: string | null;
  data: Record<string, unknown>;
  setFocus: (f: string | null) => void;
  put: (k: string, v: unknown) => void;
  clear: () => void;
}
export const useScene = create<SceneBus>()((set, get) => ({
  focus: null,
  data: {},
  setFocus: (f) => set({ focus: f }),
  put: (k, v) => set({ data: { ...get().data, [k]: v } }),
  clear: () => set({ focus: null, data: {} }),
}));
export function useSceneData<T>(k: string, fallback: T): T {
  return useScene((s) => (s.data[k] === undefined ? fallback : (s.data[k] as T)));
}
