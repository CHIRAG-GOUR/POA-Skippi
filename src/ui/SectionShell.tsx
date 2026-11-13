import { Suspense, lazy, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Map as MapIcon, Target } from 'lucide-react';
import { SECTION_BY_ID, SECTIONS, type SectionId } from '../game/sections';
import { useGame, useScene } from '../game/store';
import { GRADE_BANDS, gradeLabel, type GradeBand } from '../content/poa';
import { BackToTop } from './Hud';
import { SECTION_ICONS, cx, Btn } from './kit';

type SectionComp = ComponentType<{ activityId: string; next: () => void }>;
const modules: Record<SectionId, React.LazyExoticComponent<SectionComp>> = {
  s1: lazy(() => import('../sections/S01Intro')),
  s2: lazy(() => import('../sections/S02SharkTank')),
  s3: lazy(() => import('../sections/S03Strategy')),
  s4: lazy(() => import('../sections/S04Timeline')),
  s5: lazy(() => import('../sections/S05Numbers')),
  s6: lazy(() => import('../sections/S06Marketing')),
  s7: lazy(() => import('../sections/S07KMatrix')),
  s8: lazy(() => import('../sections/S08Happened')),
  s9: lazy(() => import('../sections/S09Decisions')),
  s10: lazy(() => import('../sections/S10Reflection')),
  s11: lazy(() => import('../sections/S11Rebuttal')),
  s12: lazy(() => import('../sections/S12Pitch')),
  s13: lazy(() => import('../sections/S13Evaluation')),
};

export function SectionShell({ id }: { id: SectionId }) {
  const def = SECTION_BY_ID[id];
  const grade = useGame((s) => s.grade);
  const done = useGame((s) => s.done);
  const go = useGame((s) => s.go);
  const [actIdx, setActIdx] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  const put = useScene((s) => s.put);
  const clear = useScene((s) => s.clear);
  const Icon = SECTION_ICONS[def.icon];
  const act = def.activities[actIdx];
  const Mod = modules[id];

  useEffect(() => { setActIdx(0); clear(); }, [id, clear]);
  useEffect(() => { put('activity', act.id); scroller.current?.scrollTo({ top: 0 }); }, [act.id, put]);
  useEffect(() => setScrollEl(scroller.current), []);

  const isDone = (aid: string) => !!(grade && done[`${grade}:${aid}`]);
  const idx = SECTIONS.findIndex((s) => s.id === id);
  const nextSection = SECTIONS[idx + 1];
  const next = () => {
    if (actIdx < def.activities.length - 1) setActIdx(actIdx + 1);
    else if (nextSection) go({ name: 'section', id: nextSection.id });
    else go({ name: 'summary' });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* header */}
      <div className="relative shrink-0 overflow-hidden px-4 pb-3 pt-4 sm:px-5" style={{ background: `linear-gradient(135deg, ${def.color}, ${def.color}cc)` }}>
        <div className="stripe-candy absolute inset-0 opacity-70" />
        <div className="relative flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-pop-sm)]" style={{ color: def.color }}>
            {Icon && <Icon className="size-6.5" strokeWidth={2.4} />}
          </div>
          <div className="min-w-0 text-white">
            <p className="font-display text-[12.5px] font-extrabold uppercase tracking-[0.14em] opacity-90">Section {def.n} · {def.subtitle}</p>
            <h1 className="truncate font-display text-[22px] font-extrabold leading-tight drop-shadow-sm sm:text-[25px]">{def.title}</h1>
          </div>
        </div>
        {/* mission tabs */}
        <div className="relative mt-3 flex gap-1.5 overflow-x-auto pb-0.5" role="tablist" aria-label="Missions">
          {def.activities.map((a, i) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={i === actIdx}
              onClick={() => setActIdx(i)}
              className={cx(
                'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 font-display text-[13.5px] font-bold transition',
                i === actIdx ? 'bg-white text-ink shadow-[var(--shadow-pop-sm)]' : 'bg-white/25 text-white hover:bg-white/40',
              )}
            >
              <span className={cx('flex size-5 items-center justify-center rounded-full text-[11px] font-black', isDone(a.id) ? 'bg-lime-500 text-white' : i === actIdx ? 'text-white' : 'bg-white/40 text-white')} style={!isDone(a.id) && i === actIdx ? { background: def.color } : undefined}>
                {isDone(a.id) ? <Check className="size-3.5" strokeWidth={3.5} /> : i + 1}
              </span>
              {a.title}
            </button>
          ))}
        </div>
      </div>
      {/* objective */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-skippi-100 bg-white/80 px-4 py-2.5 sm:px-5">
        <Target className="size-4.5 shrink-0" style={{ color: def.color }} strokeWidth={2.6} />
        <p className="text-[14px] font-bold leading-snug text-ink"><span className="text-ink-soft">Objective: </span>{act.objective}</p>
        {isDone(act.id) && <span className="ml-auto shrink-0 rounded-full bg-lime-100 px-2 py-0.5 text-[12px] font-extrabold text-lime-600">Done</span>}
      </div>
      {/* body */}
      <div ref={scroller} className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-4 sm:px-5">
        <Suspense fallback={<div className="py-10 text-center font-display text-ink-soft">Loading…</div>}>
          <AnimatePresence mode="wait">
            <motion.div key={act.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {grade && <Mod activityId={act.id} next={next} />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
        {/* footer nav */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-skippi-100 pt-4">
          <Btn variant="white" size="sm" icon={MapIcon} onClick={() => go({ name: 'island' })}>Island map</Btn>
          <Btn variant={isDone(act.id) ? 'primary' : 'white'} size="sm" iconRight={ArrowRight} onClick={next}>
            {actIdx < def.activities.length - 1 ? `Next: ${def.activities[actIdx + 1].title}` : nextSection ? `Section ${nextSection.n}` : 'Journey summary'}
          </Btn>
        </div>
      </div>
      <BackToTop scroller={scrollEl} />
    </div>
  );
}

/* ------------------------------------------------------------------ grade-aware content helper */
/**
 * Renders the learner's grade content interactively. In mentor view, adds tabs
 * to read (not answer) the other grade groups' original content.
 */
export function GradeBlock({ children, readOnly }: { children: (g: GradeBand, own: boolean) => ReactNode; readOnly?: (g: GradeBand) => ReactNode }) {
  const grade = useGame((s) => s.grade)!;
  const mentor = useGame((s) => s.mentorView);
  const [view, setView] = useState<GradeBand>(grade);
  useEffect(() => setView(grade), [grade]);
  if (!mentor) return <>{children(grade, true)}</>;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-2xl bg-skippi-50 p-1.5" role="tablist" aria-label="Grade group (mentor view)">
        {GRADE_BANDS.map((g) => (
          <button key={g.id} role="tab" aria-selected={view === g.id} onClick={() => setView(g.id)}
            className={cx('rounded-xl px-3 py-1.5 font-display text-[13px] font-extrabold transition', view === g.id ? 'bg-white text-skippi-700 shadow' : 'text-skippi-600 hover:bg-white/60')}>
            {g.label}{g.id === grade ? ' (learner)' : ''}
          </button>
        ))}
      </div>
      {view === grade ? children(grade, true) : (
        <div className="rounded-2xl border-2 border-dashed border-skippi-200 p-3">
          <p className="mb-2 text-[12.5px] font-bold uppercase tracking-wide text-skippi-500">Mentor reference · {gradeLabel(view)} · read only</p>
          {readOnly ? readOnly(view) : children(view, false)}
        </div>
      )}
    </div>
  );
}

export function BackToIsland() {
  const go = useGame((s) => s.go);
  return (
    <button onClick={() => go({ name: 'island' })} className="glass pointer-events-auto fixed left-3 top-3 z-50 flex items-center gap-2 rounded-2xl px-3 py-2.5 font-display text-[14px] font-bold text-skippi-700 shadow-[var(--shadow-pop-sm)] ring-1 ring-white transition hover:-translate-y-0.5 sm:left-4 sm:top-4">
      <ArrowLeft className="size-4.5" strokeWidth={2.8} /> Island
    </button>
  );
}
