import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Eye, Target, Flag } from 'lucide-react';
import { INTRO, gradeLabel } from '../content/poa';
import { useAnswer, useDone, useGame, useScene, useSceneData } from '../game/store';
import { Btn, Kicker, H3, PoaImage, TextResponse, DoneStamp, cx, GradeTag } from '../ui/kit';
import { GradeBlock } from '../ui/SectionShell';
import { sfx } from '../audio/sfx';

const CHAPTERS = ['A childhood memory', 'A hidden problem', 'The founders', 'Skippi is born'];

export default function S01Intro({ activityId, next }: { activityId: string; next: () => void }) {
  switch (activityId) {
    case 's1-story': return <Story next={next} />;
    case 's1-overview': return <Overview next={next} />;
    case 's1-vmo': return <VMOPanel next={next} />;
    default: return <Challenge />;
  }
}

/* ---------------------------------------------------------------- story */
function Story({ next }: { next: () => void }) {
  const [seen, setSeen] = useAnswer<number[]>('s1.storySeen', [0]);
  const [ch, setCh] = useState(0);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s1-story');
  useEffect(() => { put('chapter', ch); }, [ch, put]);
  const goTo = (i: number) => {
    sfx.pop();
    setCh(i);
    if (!seen.includes(i)) {
      const ns = [...seen, i];
      setSeen(ns);
      if (ns.length === CHAPTERS.length) complete('s1-story');
    }
  };
  return (
    <div className="space-y-4">
      <Kicker color="#ffa514">Chapter {ch + 1} of 4</Kicker>
      <div className="flex gap-1.5">
        {CHAPTERS.map((c, i) => (
          <button key={c} onClick={() => goTo(i)} aria-label={`Chapter ${i + 1}: ${c}`}
            className={cx('h-2.5 flex-1 rounded-full transition', i === ch ? 'bg-mango-500' : seen.includes(i) ? 'bg-mango-300' : 'bg-mango-100')} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={ch} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
          <H3>{CHAPTERS[ch]}</H3>
          <p className={cx('leading-relaxed text-ink', ch === 0 ? 'font-display text-[22px] font-bold' : 'text-[17px]')}>{INTRO.story[ch]}</p>
          {ch === 2 && (
            <PoaImage src={INTRO.image.src} alt={INTRO.image.alt} caption="Ravi and Anuja Kabra" refUrl={INTRO.image.referenceUrl} refLabel={INTRO.image.referenceLabel} />
          )}
        </motion.div>
      </AnimatePresence>
      <p className="text-[13px] font-semibold text-ink-soft">Watch the park: the camera follows each chapter of the story.</p>
      <div className="flex items-center justify-between gap-2">
        <Btn variant="white" size="sm" icon={ArrowLeft} disabled={ch === 0} onClick={() => goTo(ch - 1)}>Back</Btn>
        {ch < 3 ? (
          <Btn variant="sun" iconRight={ArrowRight} onClick={() => goTo(ch + 1)}>Next chapter</Btn>
        ) : (
          <Btn variant="primary" iconRight={ArrowRight} onClick={next} disabled={!done}>Explore the park</Btn>
        )}
      </div>
      <DoneStamp show={done} label="Story complete" />
    </div>
  );
}

/* ---------------------------------------------------------------- overview (find 8 fact pops) */
function Overview({ next }: { next: () => void }) {
  const [found, setFound] = useAnswer<number[]>('s1.found', []);
  const focus = useScene((s) => s.focus);
  const setFocus = useScene((s) => s.setFocus);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s1-overview');
  useEffect(() => { put('found', found); }, [found, put]);
  useEffect(() => {
    if (!focus?.startsWith('fact:')) return;
    const i = +focus.slice(5);
    if (!found.includes(i)) {
      sfx.correct();
      const nf = [...found, i];
      setFound(nf);
      if (nf.length === INTRO.overview.length) complete('s1-overview');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);
  useEffect(() => () => setFocus(null), [setFocus]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H3>{INTRO.overviewHeading}</H3>
        <span className="rounded-full bg-mango-100 px-3 py-1 font-display text-[14px] font-extrabold text-mango-600">{found.length}/8 found</span>
      </div>
      <p className="text-[14.5px] text-ink-soft">Eight giant fact pops are hidden around the park. Tap a pop (or its marker) in the 3D park to unwrap the fact.</p>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100">
        <div className="grid grid-cols-[40%_60%] bg-skippi-500 px-3.5 py-2 font-display text-[13px] font-extrabold uppercase tracking-wide text-white">
          <span>Particular</span><span>Details</span>
        </div>
        {INTRO.overview.map((r, i) => {
          const f = found.includes(i);
          return (
            <motion.div key={r.k} layout className={cx('grid grid-cols-[40%_60%] items-center border-t border-skippi-50 px-3.5 py-2.5 text-[14.5px]', focus === `fact:${i}` && 'bg-mango-100/60')}>
              <span className="font-bold text-ink">{f ? r.k : `Fact pop ${i + 1}`}</span>
              {f ? (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="font-semibold text-ink">{r.v}</motion.span>
              ) : (
                <span className="flex items-center gap-1.5 text-ink-soft"><Lock className="size-4" /> Find it in the park</span>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="All facts found" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Next mission</Btn>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- vision / mission / objective */
const VMO_CARDS = [
  { t: 'Vision', icon: Eye, text: INTRO.vision, color: '#ffa514' },
  { t: 'Mission', icon: Flag, text: INTRO.mission, color: '#e2336c' },
  { t: 'Objective', icon: Target, text: INTRO.objective, color: '#7cc22b' },
];
function VMOPanel({ next }: { next: () => void }) {
  const [opened, setOpened] = useAnswer<number[]>('s1.vmo', []);
  const focus = useScene((s) => s.focus);
  const setFocus = useScene((s) => s.setFocus);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s1-vmo');
  useEffect(() => { put('opened', opened); }, [opened, put]);
  const open = (i: number) => {
    if (!opened.includes(i)) {
      sfx.pop();
      const n = [...opened, i];
      setOpened(n);
      if (n.length === 3) complete('s1-vmo');
    }
  };
  useEffect(() => { if (focus?.startsWith('vmo:')) open(+focus.slice(4)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [focus]);
  useEffect(() => () => setFocus(null), [setFocus]);
  return (
    <div className="space-y-4">
      <p className="text-[14.5px] text-ink-soft">Three signposts stand at the edge of the park. Tap a signpost in 3D, or a card below, to flip it open.</p>
      {VMO_CARDS.map((v, i) => {
        const o = opened.includes(i);
        const Icon = v.icon;
        return (
          <button key={v.t} onClick={() => open(i)} className="block w-full text-left" aria-expanded={o}>
            <motion.div layout className={cx('overflow-hidden rounded-3xl p-4 ring-2 transition', o ? 'bg-white' : 'hover:-translate-y-0.5')} style={{ background: o ? '#fff' : v.color, ['--tw-ring-color' as string]: v.color }}>
              <div className="flex items-center gap-3">
                <span className={cx('flex size-11 items-center justify-center rounded-2xl', o ? 'text-white' : 'bg-white/25 text-white')} style={o ? { background: v.color } : undefined}><Icon className="size-6" /></span>
                <span className={cx('font-display text-[22px] font-extrabold', o ? 'text-ink' : 'text-white')}>{v.t}</span>
                {!o && <span className="ml-auto text-[13px] font-bold text-white/90">Tap to open</span>}
              </div>
              <AnimatePresence>
                {o && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 text-[16.5px] font-semibold leading-relaxed text-ink">{v.text}</motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        );
      })}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="All three opened" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Next mission</Btn>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- grade challenge */
function Challenge() {
  const complete = useGame((s) => s.complete);
  const done = useDone('s1-challenge');
  return (
    <div className="space-y-4">
      <H3>{INTRO.problemStatementsHeading}</H3>
      <GradeBlock
        readOnly={(g) => (
          <div>
            <p className="font-display text-[17px] font-extrabold">{INTRO.problemStatements[g].title}</p>
            <p className="mt-1 text-[15.5px] leading-relaxed">{INTRO.problemStatements[g].text}</p>
          </div>
        )}
      >
        {(g) => (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-skippi-500 p-5 text-white">
              <div className="stripe-candy absolute inset-0 opacity-50" />
              <div className="relative">
                <GradeTag label={gradeLabel(g)} />
                <p className="mt-2 font-display text-[22px] font-extrabold leading-tight">{INTRO.problemStatements[g].title.split('– ')[1]}</p>
                <p className="mt-2 text-[17px] font-semibold leading-relaxed">{INTRO.problemStatements[g].text}</p>
              </div>
            </div>
            <TextResponse storeKey="s1.firstIdea" min={20} rows={4} prompt="Your first idea: how would you take on this challenge?" placeholder="Write your first idea. You can change it later as you learn more about Skippi." onValid={(ok) => ok && complete('s1-challenge')} />
          </div>
        )}
      </GradeBlock>
      <DoneStamp show={done} label="Challenge accepted" />
    </div>
  );
}
