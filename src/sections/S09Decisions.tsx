import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HeartPulse } from 'lucide-react';
import { CASE_CHALLENGE, gradeLabel, type GradeBand } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, ChoiceOption, LETTERS, DoneStamp, Insight, GradeTag, cx } from '../ui/kit';
import { GradeBlock } from '../ui/SectionShell';
import { sfx } from '../audio/sfx';

export default function S09Decisions(_: { activityId: string; next: () => void }) {
  return (
    <div className="space-y-4">
      <Kicker color="#ff8a3d">{CASE_CHALLENGE.heading}</Kicker>
      <GradeBlock readOnly={(g) => <Key g={g} />}>{(g) => <Game g={g} />}</GradeBlock>
    </div>
  );
}

function Key({ g }: { g: GradeBand }) {
  return (
    <ol className="space-y-3">{CASE_CHALLENGE.scenarios[g].map((s) => (
      <li key={s.q} className="rounded-2xl bg-white p-3">
        <p className="font-bold">{s.q}</p>
        <ul className="mt-1 text-[14px]">{s.options.map((o, i) => <li key={o} className={cx(i === s.answer && 'font-extrabold text-lime-600')}>{LETTERS[i]}. {o}</li>)}</ul>
        <p className="mt-1 text-[13.5px] font-bold text-skippi-700">{s.answerText}</p>
      </li>
    ))}</ol>
  );
}

function Game({ g }: { g: GradeBand }) {
  const list = CASE_CHALLENGE.scenarios[g];
  const [picks, setPicks] = useAnswer<number[][]>('s9.picks', list.map(() => []));
  const [qi, setQi] = useState(() => Math.max(0, picks.findIndex((p, i) => !p.includes(list[i].answer))));
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const award = useGame((s) => s.award);
  const done = useDone('s9-decisions');
  const s = list[qi];
  const p = picks[qi];
  const solved = p.includes(s.answer);
  const health = 50 + picks.reduce((n, pp, i) => n + (pp[0] === undefined ? 0 : pp[0] === list[i].answer ? 10 : -10), 0);

  useEffect(() => { put('stage', s.stage); put('outcome', null); }, [qi, s.stage, put]);
  const pick = (i: number) => {
    if (solved || p.includes(i)) return;
    const np = picks.map((x, k) => (k === qi ? [...x, i] : x));
    setPicks(np);
    const ok = i === s.answer;
    ok ? sfx.correct() : sfx.wrong();
    put('outcome', { ok, n: Date.now() });
    if (np.every((x, k) => x.includes(list[k].answer))) {
      complete('s9-decisions');
      if (np.every((x, k) => x[0] === list[k].answer)) award('b-sharp');
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <GradeTag label={gradeLabel(g)} />
        <div className="flex gap-1.5">{list.map((_, i) => (
          <button key={i} onClick={() => setQi(i)} aria-label={`Situation ${i + 1}`} className={cx('flex size-8 items-center justify-center rounded-xl font-display text-[14px] font-extrabold', i === qi ? 'bg-orangepop-500 text-white' : picks[i].includes(list[i].answer) ? 'bg-lime-100 text-lime-600' : 'bg-white ring-1 ring-skippi-100')}>{i + 1}</button>
        ))}</div>
      </div>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-skippi-100">
        <div className="flex items-center justify-between text-[13px] font-extrabold"><span className="flex items-center gap-1.5"><HeartPulse className="size-4 text-rasp-500" /> Business health</span><span>{health}%</span></div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-skippi-50"><motion.div className="h-full rounded-full" animate={{ width: `${Math.max(5, Math.min(100, health))}%`, background: health >= 50 ? '#7cc22b' : '#e2336c' }} /></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-2.5">
          <H3>{s.q}</H3>
          {s.options.map((o, i) => (
            <ChoiceOption key={o} letter={LETTERS[i]} text={o} disabled={solved || p.includes(i)} onClick={() => pick(i)}
              state={p.includes(i) ? (i === s.answer ? 'correct' : 'wrong') : solved ? 'dim' : 'idle'} />
          ))}
          {p.length > 0 && (solved
            ? <Insight color="#7cc22b"><b>{p[0] === s.answer ? 'Great decision!' : 'Good recovery.'}</b> {s.answerText}. Watch the street: customers and the team react to your choice.</Insight>
            : <Insight color="#e2336c">That choice would hurt the business — see the street's reaction. Think about what a careful founder would do, and try again.</Insight>)}
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="All decisions made" />
        {solved && qi < list.length - 1 && <Btn iconRight={ArrowRight} onClick={() => setQi(qi + 1)}>Next situation</Btn>}
      </div>
    </div>
  );
}
