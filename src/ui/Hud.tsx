import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Minimize, Volume2, VolumeX, Settings, ArrowUp, Award, CircleCheck, X, Gauge, GraduationCap, RotateCcw, Users } from 'lucide-react';
import { useGame, useProgress } from '../game/store';
import { GRADE_BANDS, gradeLabel } from '../content/poa';
import { ProgressRing, cx, Btn } from './kit';

/* ------------------------------------------------------------------ fullscreen (always top-right) */
export function FullscreenButton() {
  const [fs, setFs] = useState(!!document.fullscreenElement);
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);
  const supported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;
  const toggle = () => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => {});
    else void document.exitFullscreen?.().catch(() => {});
  };
  if (!supported) return null;
  return (
    <HudIconBtn onClick={toggle} label={fs ? 'Exit fullscreen' : 'Enter fullscreen'}>
      {fs ? <Minimize className="size-5" strokeWidth={2.5} /> : <Maximize className="size-5" strokeWidth={2.5} />}
    </HudIconBtn>
  );
}

export function HudIconBtn({ children, onClick, label, active }: { children: React.ReactNode; onClick: () => void; label: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cx(
        'glass flex size-11 items-center justify-center rounded-2xl text-skippi-700 shadow-[var(--shadow-pop-sm)] ring-1 ring-white transition hover:-translate-y-0.5 active:translate-y-0.5',
        active && 'bg-skippi-500 text-white',
      )}
    >
      {children}
    </button>
  );
}

export function SoundButton() {
  const sound = useGame((s) => s.sound);
  const setSound = useGame((s) => s.setSound);
  return (
    <HudIconBtn onClick={() => setSound(!sound)} label={sound ? 'Mute sounds' : 'Turn sounds on'}>
      {sound ? <Volume2 className="size-5" strokeWidth={2.5} /> : <VolumeX className="size-5" strokeWidth={2.5} />}
    </HudIconBtn>
  );
}

export function TopRightControls({ onSettings }: { onSettings: () => void }) {
  return (
    <div className="pointer-events-auto fixed right-3 top-3 z-50 flex items-center gap-2 sm:right-4 sm:top-4">
      <SoundButton />
      <HudIconBtn onClick={onSettings} label="Settings"><Settings className="size-5" strokeWidth={2.5} /></HudIconBtn>
      <FullscreenButton />
    </div>
  );
}

/* ------------------------------------------------------------------ progress ring (bottom-right) */
export function ProgressBadge({ onClick }: { onClick: () => void }) {
  const { done, total, pct } = useProgress();
  return (
    <button
      onClick={onClick}
      aria-label={`Journey progress: ${done} of ${total} activities complete. Open journey summary.`}
      className="glass pointer-events-auto fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full p-1.5 pr-3.5 shadow-[var(--shadow-soft)] ring-1 ring-white transition hover:-translate-y-0.5 sm:bottom-4 sm:right-4"
    >
      <ProgressRing value={pct} size={52} stroke={7} color="#2163e0">
        <span className="font-display text-[13px] font-extrabold text-skippi-800">{Math.round(pct * 100)}%</span>
      </ProgressRing>
      <span className="hidden flex-col text-left leading-tight sm:flex">
        <span className="font-display text-[14px] font-extrabold text-ink">Journey</span>
        <span className="text-[12px] font-bold text-ink-soft">{done}/{total} missions</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ back to top (bottom-left) */
export function BackToTop({ scroller }: { scroller: HTMLElement | null }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!scroller) return;
    const h = () => setShow(scroller.scrollTop > 280);
    h();
    scroller.addEventListener('scroll', h, { passive: true });
    return () => scroller.removeEventListener('scroll', h);
  }, [scroller]);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          onClick={() => scroller?.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-3 left-3 z-50 flex size-12 items-center justify-center rounded-2xl bg-mango-400 text-skippi-900 shadow-[0_4px_0_0_#c47400] transition hover:bg-mango-300 sm:bottom-4 sm:left-4"
        >
          <ArrowUp className="size-6" strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ toasts */
export function Toasts() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed left-1/2 top-16 z-[90] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 sm:top-20" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className={cx(
              'pointer-events-auto flex items-center gap-3 rounded-2xl p-3 pr-2 shadow-[var(--shadow-soft)] ring-2',
              t.kind === 'achievement' ? 'bg-mango-100 ring-mango-400' : 'bg-white ring-lime-400',
            )}
          >
            <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-xl text-white', t.kind === 'achievement' ? 'bg-mango-500' : 'bg-lime-500')}>
              {t.kind === 'achievement' ? <Award className="size-6" /> : <CircleCheck className="size-6" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[15px] font-extrabold leading-tight text-ink">{t.title}</span>
              {t.body && <span className="block truncate text-[13px] font-semibold text-ink-soft">{t.body}</span>}
            </span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="rounded-lg p-1 text-ink-soft hover:bg-black/5"><X className="size-4" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ settings */
export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useGame();
  const [confirm, setConfirm] = useState(false);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-skippi-900/45 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-cream p-5 shadow-2xl ring-4 ring-white"
            role="dialog" aria-label="Settings"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold text-ink">Settings</h2>
              <button onClick={onClose} aria-label="Close settings" className="rounded-xl p-2 hover:bg-black/5"><X className="size-5" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-2 flex items-center gap-2 font-display text-[15px] font-bold"><GraduationCap className="size-4.5 text-skippi-500" /> Grade group</p>
                <div className="grid grid-cols-3 gap-2">
                  {GRADE_BANDS.map((g) => (
                    <button key={g.id} onClick={() => s.setGrade(g.id)}
                      className={cx('rounded-2xl px-2 py-3 font-display text-[15px] font-extrabold ring-2 transition', s.grade === g.id ? 'bg-skippi-500 text-white ring-skippi-500' : 'bg-white text-skippi-800 ring-skippi-100 hover:ring-skippi-300')}>
                      {g.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[12.5px] text-ink-soft">Each grade group keeps its own progress and answers.</p>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 font-display text-[15px] font-bold"><Users className="size-4.5 text-skippi-500" /> Team name</p>
                <input value={s.teamName} onChange={(e) => s.setTeamName(e.target.value)} maxLength={40} placeholder="e.g. The Frozen Founders"
                  className="w-full rounded-2xl bg-white px-3.5 py-2.5 ring-2 ring-skippi-100 outline-none focus:ring-skippi-400" />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-3 ring-2 ring-skippi-100">
                <input type="checkbox" checked={s.mentorView} onChange={(e) => s.setMentorView(e.target.checked)} className="mt-1 size-5 accent-skippi-500" />
                <span>
                  <span className="block font-display text-[15px] font-bold">Mentor view</span>
                  <span className="block text-[13px] text-ink-soft">Shows the content and answer keys of every grade group alongside the learner's own.</span>
                </span>
              </label>
              <div>
                <p className="mb-2 flex items-center gap-2 font-display text-[15px] font-bold"><Gauge className="size-4.5 text-skippi-500" /> Graphics</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['high', 'low'] as const).map((q) => (
                    <button key={q} onClick={() => s.setQuality(q)}
                      className={cx('rounded-2xl px-3 py-2.5 font-display font-bold ring-2', s.quality === q ? 'bg-skippi-500 text-white ring-skippi-500' : 'bg-white ring-skippi-100')}>
                      {q === 'high' ? 'High (shadows)' : 'Fast (school laptops)'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-rasp-100/60 p-3">
                {!confirm ? (
                  <Btn variant="white" size="sm" icon={RotateCcw} onClick={() => setConfirm(true)} disabled={!s.grade}>
                    Reset progress for {s.grade ? gradeLabel(s.grade) : 'this grade'}
                  </Btn>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[14px] font-bold text-rasp-600">This clears all answers, missions and badges for {s.grade && gradeLabel(s.grade)}. Continue?</p>
                    <div className="flex gap-2">
                      <Btn variant="rasp" size="sm" onClick={() => { s.resetGrade(); setConfirm(false); }}>Yes, reset</Btn>
                      <Btn variant="white" size="sm" onClick={() => setConfirm(false)}>Cancel</Btn>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
