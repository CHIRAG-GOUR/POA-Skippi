import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Square, RotateCcw, Check, Timer, Trophy } from 'lucide-react';
import { EVALUATION } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import type { GameState } from '../game/store';
import { useShallow } from 'zustand/react/shallow';
import { Btn, H3, Kicker, TextResponse, DoneStamp, Insight, cx } from '../ui/kit';
import { PITCH_AREAS } from './S12Pitch';
import { sfx } from '../audio/sfx';

export default function S13Evaluation({ activityId, next }: { activityId: string; next: () => void }) {
  if (activityId === 's13-deliverables') return <Deliverables next={next} />;
  if (activityId === 's13-pitch') return <PitchTimer next={next} />;
  if (activityId === 's13-score') return <Score next={next} />;
  return <Final />;
}

/** Which pitch-builder parts relate to each deliverable (for helpful hints only). */
const LINKS: string[][] = [['brand'], ['concept'], ['customer'], ['model', 'pricing'], ['marketing', 'sales'], ['distribution', 'operations'], ['financials'], ['growth'], ['ask']];

function Deliverables({ next }: { next: () => void }) {
  const grade = useGame((s) => s.grade)!;
  const [ticks, setTicks] = useAnswer<boolean[]>('s13.ticks', EVALUATION.deliverables.map(() => false));
  const ready = useGame(useShallow((s: GameState) => LINKS.map((ks) => ks.every((k) => String(s.answers[`${grade}:s12.${k}`] ?? '').trim().length >= (k === 'brand' ? 2 : 10)))));
  const complete = useGame((s) => s.complete);
  const done = useDone('s13-deliverables');
  const put = useScene((s) => s.put);
  useEffect(() => { put('screen', { title: 'FINAL SHARK TANK EVALUATION', body: EVALUATION.intro, color: '#ffa514' }); }, [put]);
  const toggle = (i: number) => {
    const nt = ticks.map((t, k) => (k === i ? !t : t)); setTicks(nt); sfx.click();
    if (nt.every(Boolean)) complete('s13-deliverables');
  };
  return (
    <div className="space-y-4">
      <Kicker color="#e88a00">{EVALUATION.heading}</Kicker>
      <p className="font-display text-[18px] font-bold">{EVALUATION.intro}</p>
      <H3>{EVALUATION.deliverablesHeading}</H3>
      <p className="text-[14.5px] text-ink-soft">{EVALUATION.deliverablesIntro} Tick each one when your team is ready to present it.</p>
      {EVALUATION.deliverables.map((d, i) => (
        <button key={d} onClick={() => toggle(i)} className={cx('flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-2 transition', ticks[i] ? 'bg-lime-100 ring-lime-400' : 'bg-white ring-skippi-100 hover:ring-skippi-300')}>
          <span className={cx('flex size-8 shrink-0 items-center justify-center rounded-xl', ticks[i] ? 'bg-lime-500 text-white' : 'bg-skippi-50')}>{ticks[i] && <Check className="size-5" strokeWidth={3.2} />}</span>
          <span className="flex-1 text-[15px] font-semibold">{d}</span>
          {!ready[i] && <span className="shrink-0 rounded-full bg-mango-100 px-2 py-0.5 text-[11px] font-extrabold text-mango-600">Not in builder yet</span>}
        </button>
      ))}
      <p className="text-[12.5px] text-ink-soft">Hints compare with your answers in Section 12 ({PITCH_AREAS.length} pitch parts).</p>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Deliverables confirmed" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Present your pitch</Btn>}
      </div>
    </div>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function PitchTimer({ next }: { next: () => void }) {
  const [best, setBest] = useAnswer<number>('s13.pitchSecs', 0);
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const start = useRef(0);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s13-pitch');
  const brand = useGame((s) => String((s.grade && s.answers[`${s.grade}:s12.brand`]) ?? ''));
  useEffect(() => { put('presenting', running); put('screen', { title: running ? fmt(secs) : brand || 'YOUR PITCH', body: running ? 'Pitch in progress' : '3–5 minute pitch + Shark Q&A', color: secs > 300 ? '#e2336c' : '#2163e0' }); }, [running, secs, brand, put]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => { const s = (performance.now() - start.current) / 1000; setSecs(s); if (Math.floor(s) % 60 === 0 && s > 1 && s % 60 < 0.3) sfx.tick(); }, 250);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => () => { put('presenting', false); }, [put]);
  const stop = () => {
    setRunning(false);
    if (secs > best) setBest(Math.round(secs));
    if (secs >= 180) { put('reaction', { kind: 'cheer', n: Date.now() }); complete('s13-pitch'); }
  };
  const zone = secs < 180 ? 'Keep going — aim for at least 3:00' : secs <= 300 ? 'Great length (3–5 minutes)' : 'Over 5 minutes — wrap up!';
  return (
    <div className="space-y-4">
      <H3 className="flex items-center gap-2"><Timer className="size-5 text-skippi-500" /> Main-stage pitch timer</H3>
      <p className="text-[14.5px] text-ink-soft">{EVALUATION.intro} Start the timer as your team begins. The Sharks are watching on stage.</p>
      <div className={cx('rounded-3xl p-6 text-center ring-4', secs > 300 ? 'bg-rasp-100 ring-rasp-300' : secs >= 180 ? 'bg-lime-100 ring-lime-300' : 'bg-white ring-skippi-100')}>
        <p className="font-display text-[64px] font-black leading-none tabular-nums">{fmt(secs)}</p>
        <p className="mt-2 font-bold text-ink-soft">{running ? zone : best ? `Best run: ${fmt(best)}` : 'Ready when you are'}</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-skippi-50"><div className="h-full rounded-full bg-skippi-500 transition-all" style={{ width: `${Math.min(100, (secs / 300) * 100)}%` }} /></div>
        <div className="mt-1 flex justify-between text-[11px] font-bold text-ink-soft"><span>0:00</span><span>3:00</span><span>5:00</span></div>
      </div>
      <div className="flex justify-center gap-2">
        {!running ? <Btn variant="lime" size="lg" icon={Play} onClick={() => { start.current = performance.now(); setSecs(0); setRunning(true); sfx.pop(); }}>Start pitch</Btn>
          : <Btn variant="rasp" size="lg" icon={Square} onClick={stop}>Stop</Btn>}
        {!running && secs > 0 && <Btn variant="white" icon={RotateCcw} onClick={() => setSecs(0)}>Reset</Btn>}
      </div>
      {!running && secs > 0 && secs < 180 && <Insight color="#ffa514">That run was {fmt(secs)}. A full pitch needs at least 3 minutes, so try again.</Insight>}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Pitch presented" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Shark scores</Btn>}
      </div>
    </div>
  );
}

function Score({ next }: { next: () => void }) {
  const [marks, setMarks] = useAnswer<(number | null)[]>('s13.marks', EVALUATION.criteria.map(() => null));
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s13-score');
  const all = marks.every((m) => m !== null);
  const total = marks.reduce<number>((a, m) => a + (m ?? 0), 0);
  useEffect(() => { put('screen', { title: all ? `${total} / ${EVALUATION.total}` : 'SHARKS ARE SCORING…', body: 'Final Shark Tank Evaluation', color: '#ffa514' }); }, [all, total, put]);
  const set = (i: number, v: number) => {
    const nm = marks.map((m, k) => (k === i ? v : m)); setMarks(nm); sfx.click();
    if (nm.every((m) => m !== null)) { complete('s13-score'); put('reaction', { kind: 'cheer', n: Date.now() }); }
  };
  return (
    <div className="space-y-4">
      <H3>Shark scorecard</H3>
      <p className="text-[14.5px] text-ink-soft">For the Sharks (mentors or judges): give marks for each criterion after the pitch and Q&A.</p>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100">
        <div className="grid grid-cols-[1fr_auto] bg-mango-500 px-3 py-2 font-display text-[13px] font-extrabold uppercase text-white"><span>{EVALUATION.columns[0]}</span><span>{EVALUATION.columns[1]}</span></div>
        {EVALUATION.criteria.map((c, i) => (
          <div key={c.id} className="border-t border-mango-100 px-3 py-2.5">
            <div className="flex items-center justify-between"><span className="text-[14.5px] font-bold">{c.title}</span><span className="text-[13px] font-extrabold text-ink-soft">{marks[i] ?? '–'}/{c.marks}</span></div>
            <div className="mt-1.5 flex gap-1">{[0, 1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => set(i, v)} aria-label={`${c.title}: ${v}`} className={cx('h-9 flex-1 rounded-lg font-display text-[15px] font-extrabold ring-2 transition', marks[i] === v ? 'bg-mango-500 text-white ring-mango-500' : 'bg-white ring-mango-100 hover:ring-mango-300')}>{v}</button>
            ))}</div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t-2 border-mango-300 bg-mango-100 px-3 py-3 font-display text-[18px] font-extrabold">
          <span className="flex items-center gap-2"><Trophy className="size-5 text-mango-600" /> Total</span><span>{all ? total : '–'} / {EVALUATION.total}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Scores recorded" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Final question</Btn>}
      </div>
    </div>
  );
}

function Final() {
  const [choice, setChoice] = useAnswer<string>('s13.choice', '');
  const defended = useGame((s) => !!s.grade && String(s.answers[`${s.grade}:s13.defence`] ?? '').trim().length >= 30);
  const complete = useGame((s) => s.complete);
  const go = useGame((s) => s.go);
  const done = useDone('s13-final');
  useEffect(() => { if (choice && defended) complete('s13-final'); }, [choice, defended, complete]);
  return (
    <div className="space-y-4">
      <H3>{EVALUATION.closureHeading}</H3>
      <blockquote className="rounded-3xl bg-skippi-500 p-5 font-display text-[19px] font-bold leading-relaxed text-white">{EVALUATION.closure}</blockquote>
      <p className="font-display text-[15px] font-extrabold uppercase tracking-wide text-mango-600">{EVALUATION.finalQuestionHeading}</p>
      <p className="font-display text-[19px] font-extrabold leading-snug">{EVALUATION.finalQuestion}</p>
      <div className="grid gap-2">
        {EVALUATION.finalChoices.map((c) => (
          <button key={c} onClick={() => { sfx.pop(); setChoice(c); }} className={cx('rounded-2xl p-3.5 text-left font-display text-[16px] font-bold ring-2 transition', choice === c ? 'bg-mango-400 text-skippi-900 ring-mango-500' : 'bg-white ring-skippi-100 hover:ring-mango-300')}>{c}</button>
        ))}
      </div>
      <TextResponse storeKey="s13.defence" min={30} rows={4} prompt="Defend your decision" />
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Journey complete!" />
        {done && <Btn variant="sun" iconRight={ArrowRight} onClick={() => go({ name: 'summary' })}>See your journey</Btn>}
      </div>
    </div>
  );
}
