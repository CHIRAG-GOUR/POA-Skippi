import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Map as MapIcon, Footprints, ArrowRight, X, Check, Keyboard, MousePointerClick, Printer, Trophy, BookOpen, Clapperboard } from 'lucide-react';
import { useGame, useProgress, useScene, useSectionProgress } from '../game/store';
import { SECTIONS, SECTION_BY_ID, SPECIAL_BADGES, type SectionId } from '../game/sections';
import { META, GRADE_BANDS, MENTOR_LINKS, INTRO, gradeLabel, type GradeBand } from '../content/poa';
import { Btn, ExtLink, Medal, ProgressRing, SECTION_ICONS, VideoEmbed, cx } from './kit';
import { sfx } from '../audio/sfx';

/* ------------------------------------------------------------------ wordmark (original, brand-inspired) */
export function Wordmark({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const big = size === 'lg';
  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <div className={cx('absolute rounded-full', big ? '-top-6 size-40' : '-top-2 size-14')} style={{ background: 'radial-gradient(circle, #ffd27a 0%, #ffa514 55%, transparent 72%)' }} />
      <span className={cx('text-outline relative font-display font-black leading-none tracking-tight text-white', big ? 'text-[64px] sm:text-[92px]' : 'text-[26px]')} style={{ WebkitTextStrokeWidth: big ? 6 : 3, textShadow: big ? '0 8px 0 #13317a' : '0 3px 0 #13317a' }}>
        SKIPPI
      </span>
      <span className={cx('relative -mt-1 rounded-full bg-skippi-500 font-display font-extrabold uppercase tracking-[0.3em] text-white', big ? 'px-5 py-1 text-[16px] sm:text-[20px]' : 'px-2 py-0.5 text-[9px]')}>
        Ice Pops
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ loading */
export function Loading({ progress }: { progress: number }) {
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 overflow-hidden" style={{ background: 'linear-gradient(160deg, #3ea6ff 0%, #a9dcff 55%, #fff1d6 100%)' }}>
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4 opacity-90">
        {['#c2185b', '#b5d63a', '#ff7a1a', '#ff5fa8', '#6b2a18', '#ffb000'].map((c, i) => (
          <motion.div key={c} className="w-7 rounded-t-xl" style={{ background: c, height: 120 + (i % 3) * 30 }} animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.12 }} />
        ))}
      </div>
      <Wordmark />
      <div className="w-64">
        <div className="h-4 overflow-hidden rounded-full bg-white/70 ring-2 ring-white">
          <motion.div className="shine-bar h-full rounded-full bg-mango-400" animate={{ width: `${Math.max(6, progress * 100)}%` }} />
        </div>
        <p className="mt-2 text-center font-display text-[15px] font-bold text-skippi-800">Freezing the fun… {Math.round(progress * 100)}%</p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ title */
export function TitleScreen({ onStart }: { onStart: () => void }) {
  const grade = useGame((s) => s.grade);
  const [video, setVideo] = useState(false);
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-between px-4 pb-24 pt-10 sm:pt-14">
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="flex flex-col items-center text-center">
        <Wordmark />
        <h1 className="mt-6 max-w-2xl font-display text-[24px] font-extrabold leading-tight text-skippi-900 drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] sm:text-[34px]">{META.question}</h1>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-[13px] font-bold text-skippi-800">
          {[META.grades, META.format, META.duration].map((t) => (
            <span key={t} className="glass rounded-full px-3 py-1 ring-1 ring-white">{t}</span>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.45 }} className="pointer-events-auto flex flex-col items-center gap-3">
        <Btn variant="sun" size="lg" icon={Play} onClick={onStart} className="min-w-[240px] text-[22px]">
          {grade ? 'Continue the Journey' : 'Start the Journey'}
        </Btn>
        <Btn variant="white" icon={Clapperboard} onClick={() => setVideo(true)}>Watch the case video</Btn>
      </motion.div>
      <AnimatePresence>
        {video && (
          <motion.div className="pointer-events-auto fixed inset-0 z-[80] flex items-center justify-center bg-skippi-900/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVideo(false)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex justify-end"><button onClick={() => setVideo(false)} className="rounded-full bg-white p-2" aria-label="Close video"><X className="size-5" /></button></div>
              <VideoEmbed provider="vimeo" id={META.caseVideo.vimeoId} url={META.caseVideo.url} title={META.question} meta="Case video (from the POA)" accent="#2163e0" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ grade select */
const GRADE_ART: Record<GradeBand, { color: string; tag: string }> = {
  g45: { color: '#ffa514', tag: INTRO.problemStatements.g45.title.split('– ')[1] },
  g67: { color: '#e2336c', tag: INTRO.problemStatements.g67.title.split('– ')[1] },
  g89: { color: '#2163e0', tag: INTRO.problemStatements.g89.title.split('– ')[1] },
};

export function GradeSelect({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const grade = useGame((s) => s.grade);
  const setGrade = useGame((s) => s.setGrade);
  const teamName = useGame((s) => s.teamName);
  const setTeamName = useGame((s) => s.setTeamName);
  const [pick, setPick] = useState<GradeBand | null>(grade);
  return (
    <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-skippi-900/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-cream p-5 shadow-2xl ring-4 ring-white sm:p-7" role="dialog" aria-label="Choose your grade">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-mango-600">Before you hop in</p>
            <h2 className="font-display text-[28px] font-extrabold leading-tight text-ink">Which grade group are you?</h2>
            <p className="mt-1 text-[15px] text-ink-soft">Your challenges, questions and missions change with your grade.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 hover:bg-black/5"><X className="size-5" /></button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {GRADE_BANDS.map((g) => {
            const a = GRADE_ART[g.id];
            const sel = pick === g.id;
            return (
              <button key={g.id} onClick={() => { sfx.pop(); setPick(g.id); }}
                className={cx('group relative overflow-hidden rounded-3xl p-4 text-left ring-4 transition hover:-translate-y-1', sel ? 'bg-white' : 'bg-white/70 ring-transparent')}
                style={sel ? { boxShadow: `0 6px 0 0 ${a.color}`, ['--tw-ring-color' as string]: a.color } : undefined}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[34px] font-black leading-none" style={{ color: a.color }}>{g.short}</span>
                  <span className={cx('flex size-7 items-center justify-center rounded-full', sel ? 'text-white' : 'bg-skippi-50 text-transparent')} style={sel ? { background: a.color } : undefined}><Check className="size-4.5" strokeWidth={3.5} /></span>
                </div>
                <p className="mt-1 font-display text-[15px] font-bold text-ink">{g.label}</p>
                <p className="mt-2 text-[13.5px] font-semibold leading-snug text-ink-soft">{a.tag}</p>
              </button>
            );
          })}
        </div>
        <label className="mt-5 block">
          <span className="mb-1.5 block font-display text-[15px] font-bold">Team name <span className="font-body text-[13px] font-semibold text-ink-soft">(optional)</span></span>
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} maxLength={40} placeholder="e.g. The Frozen Founders" className="w-full rounded-2xl bg-white px-4 py-3 text-[16px] ring-2 ring-skippi-100 outline-none focus:ring-skippi-400" />
        </label>
        <div className="mt-6 flex justify-end">
          <Btn variant="primary" size="lg" iconRight={ArrowRight} disabled={!pick} onClick={() => { if (pick) { setGrade(pick); onDone(); } }}>Hop onto Skippi Island</Btn>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ island HUD */
export function IslandHud() {
  const near = useScene((s) => s.data.near as SectionId | null | undefined);
  const put = useScene((s) => s.put);
  const go = useGame((s) => s.go);
  const grade = useGame((s) => s.grade);
  const team = useGame((s) => s.teamName);
  const [drawer, setDrawer] = useState(false);
  const [help, setHelp] = useState(true);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && near) go({ name: 'section', id: near });
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [near, go]);
  useEffect(() => { const t = setTimeout(() => setHelp(false), 9000); return () => clearTimeout(t); }, []);

  const def = near ? SECTION_BY_ID[near] : null;
  return (
    <>
      <div className="pointer-events-auto fixed left-3 top-3 z-40 flex items-center gap-2 sm:left-4 sm:top-4">
        <button onClick={() => go({ name: 'title' })} className="glass rounded-2xl px-3 py-1.5 ring-1 ring-white" aria-label="Back to title screen"><Wordmark size="sm" /></button>
        <div className="glass hidden flex-col rounded-2xl px-3 py-1.5 ring-1 ring-white sm:flex">
          <span className="font-display text-[14px] font-extrabold leading-tight text-ink">{team || 'Skippi Explorer'}</span>
          <span className="text-[12px] font-bold text-ink-soft">{grade && gradeLabel(grade)}</span>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-[72px] z-30 flex justify-center px-4 sm:top-5">
        <AnimatePresence>
          {help && (
            <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="glass pointer-events-auto flex max-w-[560px] items-center gap-3 rounded-2xl px-4 py-2.5 ring-1 ring-white shadow-[var(--shadow-soft)]">
              <Footprints className="size-5 shrink-0 text-mango-500" />
              <p className="text-[13.5px] font-bold text-ink">
                Hop Roo to a numbered landmark. <span className="text-ink-soft"><MousePointerClick className="inline size-4" /> Tap the ground, or use <Keyboard className="inline size-4" /> WASD / arrow keys. Drag to look around.</span>
              </p>
              <button onClick={() => setHelp(false)} aria-label="Hide tip" className="rounded-lg p-1 hover:bg-black/5"><X className="size-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button onClick={() => setDrawer(true)} className="pointer-events-auto fixed bottom-3 left-3 z-40 flex items-center gap-2 rounded-2xl bg-skippi-500 px-4 py-3 font-display text-[15px] font-bold text-white shadow-[0_4px_0_0_#13317a] transition hover:bg-skippi-600 sm:bottom-4 sm:left-4">
        <MapIcon className="size-5" /> All places
      </button>

      <AnimatePresence>
        {def && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="pointer-events-auto fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md sm:bottom-6">
            <NearCard id={def.id} onEnter={() => go({ name: 'section', id: def.id })} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[60] bg-skippi-900/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)}>
            <motion.aside initial={{ x: -420 }} animate={{ x: 0 }} exit={{ x: -420 }} transition={{ type: 'spring', damping: 26 }} onClick={(e) => e.stopPropagation()}
              className="scroll-soft absolute bottom-0 left-0 top-0 w-[min(92vw,400px)] overflow-y-auto bg-cream p-4 shadow-2xl" aria-label="All places">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-[24px] font-extrabold">Skippi Island</h2>
                <button onClick={() => setDrawer(false)} aria-label="Close" className="rounded-xl p-2 hover:bg-black/5"><X className="size-5" /></button>
              </div>
              <ul className="space-y-2">
                {SECTIONS.map((s) => (
                  <PlaceRow key={s.id} id={s.id} onGo={() => { setDrawer(false); go({ name: 'section', id: s.id }); }} onWalk={() => { setDrawer(false); put('walkTo', s.id); }} />
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NearCard({ id, onEnter }: { id: SectionId; onEnter: () => void }) {
  const def = SECTION_BY_ID[id];
  const p = useSectionProgress(id);
  const Icon = SECTION_ICONS[def.icon];
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-3 pr-3.5 shadow-[var(--shadow-soft)] ring-4" style={{ ['--tw-ring-color' as string]: def.color }}>
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: def.color }}>
        {Icon && <Icon className="size-7" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[12px] font-extrabold uppercase tracking-[0.12em]" style={{ color: def.color }}>{def.n}. {def.world}</p>
        <p className="truncate font-display text-[18px] font-extrabold leading-tight text-ink">{def.title}</p>
        <p className="text-[12.5px] font-bold text-ink-soft">{p.done}/{p.total} missions done</p>
      </div>
      <Btn variant="sun" onClick={onEnter} iconRight={ArrowRight}>Enter <kbd className="ml-1 hidden rounded bg-white/60 px-1.5 text-[11px] sm:inline">E</kbd></Btn>
    </div>
  );
}

function PlaceRow({ id, onGo, onWalk }: { id: SectionId; onGo: () => void; onWalk: () => void }) {
  const def = SECTION_BY_ID[id];
  const p = useSectionProgress(id);
  const Icon = SECTION_ICONS[def.icon];
  const complete = p.done === p.total;
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white p-2.5 ring-1 ring-skippi-100">
      <ProgressRing value={p.done / p.total} size={46} stroke={5} color={complete ? '#7cc22b' : def.color} track={def.colorSoft}>
        {complete ? <Check className="size-5 text-lime-600" strokeWidth={3} /> : Icon ? <Icon className="size-5" style={{ color: def.color }} /> : null}
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-extrabold leading-tight">{def.n}. {def.title}</p>
        <p className="text-[12px] font-bold text-ink-soft">{def.world} · {p.done}/{p.total}</p>
      </div>
      <button onClick={onWalk} className="rounded-xl px-2 py-1.5 text-[12px] font-bold text-skippi-600 hover:bg-skippi-50" aria-label={`Hop to ${def.title}`}><Footprints className="size-4.5" /></button>
      <Btn size="sm" variant="primary" onClick={onGo}>Go</Btn>
    </li>
  );
}

/* ------------------------------------------------------------------ summary */
export function Summary() {
  const go = useGame((s) => s.go);
  const grade = useGame((s) => s.grade);
  const team = useGame((s) => s.teamName);
  const badges = useGame((s) => s.badges);
  const { done, total, pct } = useProgress();
  const has = (id: string) => !!(grade && badges[`${grade}:${id}`]);
  return (
    <div className="scroll-soft fixed inset-0 z-30 overflow-y-auto" style={{ background: 'linear-gradient(170deg, #bfe6ff 0%, #fff8ec 60%)' }}>
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-20 sm:pt-16">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <ProgressRing value={pct} size={128} stroke={14} color="#2163e0">
            <div className="flex flex-col items-center">
              <Trophy className="size-7 text-mango-500" />
              <span className="font-display text-[22px] font-black">{Math.round(pct * 100)}%</span>
            </div>
          </ProgressRing>
          <div>
            <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-mango-600">Journey summary · {grade && gradeLabel(grade)}</p>
            <h1 className="font-display text-[32px] font-extrabold leading-tight">{team || 'Skippi Explorer'}</h1>
            <p className="text-[16px] font-semibold text-ink-soft">{done} of {total} missions completed across 13 sections.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start print:hidden">
              <Btn icon={MapIcon} onClick={() => go({ name: 'island' })}>Back to the island</Btn>
              <Btn variant="white" icon={Printer} onClick={() => window.print()}>Print summary</Btn>
            </div>
          </div>
        </div>

        <h2 className="mt-10 font-display text-[22px] font-extrabold">Badges</h2>
        <div className="mt-3 grid grid-cols-3 gap-4 rounded-3xl bg-white/80 p-5 ring-1 ring-white sm:grid-cols-6">
          {SECTIONS.map((s) => <Medal key={s.id} name={s.badge.name} earned={has(s.badge.id)} color={s.color} />)}
          {SPECIAL_BADGES.map((b) => <Medal key={b.id} name={b.name} earned={has(b.id)} color="#ffa514" />)}
        </div>

        <h2 className="mt-10 font-display text-[22px] font-extrabold">Sections</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SECTIONS.map((s) => <SummaryRow key={s.id} id={s.id} />)}
        </div>

        <h2 className="mt-10 flex items-center gap-2 font-display text-[22px] font-extrabold"><BookOpen className="size-6 text-skippi-500" /> Mentor reference links</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MENTOR_LINKS.map((l) => <ExtLink key={l.url + l.label} href={l.url}>{l.label}</ExtLink>)}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ id }: { id: SectionId }) {
  const def = SECTION_BY_ID[id];
  const p = useSectionProgress(id);
  const go = useGame((s) => s.go);
  return (
    <button onClick={() => go({ name: 'section', id })} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-left ring-1 ring-skippi-100 transition hover:-translate-y-0.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-[17px] font-black text-white" style={{ background: p.done === p.total ? '#7cc22b' : def.color }}>{def.n}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] font-bold">{def.title}</span>
        <span className="mt-1 block h-2 overflow-hidden rounded-full" style={{ background: def.colorSoft }}>
          <span className="block h-full rounded-full transition-all" style={{ width: `${(p.done / p.total) * 100}%`, background: p.done === p.total ? '#7cc22b' : def.color }} />
        </span>
      </span>
      <span className="text-[13px] font-extrabold text-ink-soft">{p.done}/{p.total}</span>
    </button>
  );
}
