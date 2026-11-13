import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Eye } from 'lucide-react';
import { CASE360, HAPPENED, gradeLabel, type MCQ, type GradeBand } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, ExtLink, VideoEmbed, TextResponse, useTextsComplete, ChoiceOption, LETTERS, DoneStamp, cx, GradeTag, Insight } from '../ui/kit';
import { GradeBlock } from '../ui/SectionShell';
import { sfx } from '../audio/sfx';

export default function S02SharkTank({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's2-observe' ? <Observe next={next} /> : <Quiz />;
}

function Observe({ next }: { next: () => void }) {
  const complete = useGame((s) => s.complete);
  const done = useDone('s2-observe');
  const keys = CASE360.observe.map((_, i) => `s2.obs.${i}`);
  const all = useTextsComplete(keys, 10);
  useEffect(() => { if (all) complete('s2-observe'); }, [all, complete]);
  return (
    <div className="space-y-5">
      <div>
        <Kicker>{CASE360.heading}</Kicker>
        <H3 className="mt-1">{CASE360.watchTitle}</H3>
      </div>
      <div className="space-y-2">
        <p className="text-[13px] font-bold uppercase tracking-wide text-ink-soft">Reference</p>
        <ExtLink href={CASE360.reference.url}>{CASE360.reference.label}</ExtLink>
      </div>
      <VideoEmbed provider="youtube" id={HAPPENED.episode.youtubeId} url={HAPPENED.episode.url} title={HAPPENED.episode.label} meta="Full episode video (listed in Section 8 of the POA)" accent="#2163e0" />
      <div className="rounded-3xl bg-white p-4 ring-1 ring-skippi-100">
        <p className="mb-3 flex items-center gap-2 font-display text-[17px] font-extrabold"><Eye className="size-5 text-skippi-500" /> {CASE360.observeIntro}</p>
        <div className="space-y-4">
          {CASE360.observe.map((q, i) => (
            <TextResponse key={q} storeKey={keys[i]} prompt={`${i + 1}. ${q}`} min={10} rows={2} placeholder="Write what you noticed…" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Observations saved" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Knowledge check</Btn>}
      </div>
    </div>
  );
}

/** Where in the POA each answer comes from (verbatim POA sentences). */
const WHY: Record<GradeBand, string[]> = {
  g45: [
    'They wanted to bring back the joy of ice pops in a more hygienic, branded and modern form.',
    'Think about the colourful ice pops, chuskis and frozen treats you enjoyed during summer holidays.',
    'The brand introduced ready-to-freeze ice pops made using RO water, natural colours and flavours, without artificial preservatives.',
  ],
  g67: [
    'Founders: Ravi Kabra and Anuja Kabra',
    'Headquarters: Hyderabad, Telangana',
    'They wanted to bring back the joy of ice pops in a more hygienic, branded and modern form.',
  ],
  g89: [
    'The founders asked for ₹45 lakh in exchange for 5% equity, valuing the business at ₹9 crore before investment.',
    'The founders eventually accepted a combined offer of ₹1 crore for 15% equity.',
    'Its products could be stored at room temperature before freezing, helping reduce dependence on conventional frozen-product transportation.',
  ],
};

function Quiz() {
  return (
    <div className="space-y-4">
      <H3>{CASE360.mcqHeading}</H3>
      <GradeBlock readOnly={(g) => <AnswerKey g={g} />}>{(g) => <QuizRun g={g} />}</GradeBlock>
    </div>
  );
}

function AnswerKey({ g }: { g: GradeBand }) {
  return (
    <ol className="space-y-3">
      {CASE360.mcqs[g].map((m) => (
        <li key={m.q} className="rounded-2xl bg-white p-3">
          <p className="font-bold">{m.q}</p>
          <ul className="mt-1.5 space-y-0.5 text-[14px]">
            {m.options.map((o, i) => <li key={o} className={cx(i === m.answer && 'font-extrabold text-lime-600')}>{LETTERS[i]}. {o}</li>)}
          </ul>
          <p className="mt-1.5 text-[13.5px] font-bold text-skippi-700">{m.answerText}</p>
        </li>
      ))}
    </ol>
  );
}

type Attempt = { picks: number[] }; // all picks in order; first is the scored attempt

function QuizRun({ g }: { g: GradeBand }) {
  const mcqs = CASE360.mcqs[g];
  const [attempts, setAttempts] = useAnswer<Attempt[]>('s2.quiz', mcqs.map(() => ({ picks: [] })));
  const [qi, setQi] = useState(() => Math.max(0, attempts.findIndex((a, i) => !a.picks.includes(mcqs[i].answer))));
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const award = useGame((s) => s.award);
  const done = useDone('s2-quiz');
  const solved = attempts.map((a, i) => a.picks.includes(mcqs[i].answer));
  const score = attempts.filter((a, i) => a.picks[0] === mcqs[i].answer).length;
  const allSolved = solved.every(Boolean);

  const pick = (i: number) => {
    const m = mcqs[qi];
    const a = attempts[qi];
    if (a.picks.includes(m.answer) || a.picks.includes(i)) return;
    const na = attempts.map((x, k) => (k === qi ? { picks: [...x.picks, i] } : x));
    setAttempts(na);
    const ok = i === m.answer;
    ok ? sfx.correct() : sfx.wrong();
    put('reaction', { kind: ok ? 'correct' : 'wrong', n: Date.now() });
    const nowSolved = na.map((x, k) => x.picks.includes(mcqs[k].answer));
    if (nowSolved.every(Boolean)) {
      complete('s2-quiz');
      if (na.every((x, k) => x.picks[0] === mcqs[k].answer)) award('b-quiz-ace');
    }
  };

  const m: MCQ = mcqs[qi];
  const a = attempts[qi];
  const isSolved = a.picks.includes(m.answer);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <GradeTag label={gradeLabel(g)} />
        <div className="flex items-center gap-1.5">
          {mcqs.map((_, i) => (
            <button key={i} onClick={() => setQi(i)} aria-label={`Question ${i + 1}`}
              className={cx('flex size-8 items-center justify-center rounded-xl font-display text-[14px] font-extrabold transition', i === qi ? 'bg-skippi-500 text-white' : solved[i] ? 'bg-lime-100 text-lime-600' : 'bg-white text-skippi-600 ring-1 ring-skippi-100')}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-3">
          <p className="font-display text-[20px] font-extrabold leading-snug">{m.q}</p>
          <div className="space-y-2">
            {m.options.map((o, i) => {
              const picked = a.picks.includes(i);
              const state = picked ? (i === m.answer ? 'correct' : 'wrong') : isSolved ? 'dim' : 'idle';
              return <ChoiceOption key={o} letter={LETTERS[i]} text={o} state={state} disabled={isSolved || picked} onClick={() => pick(i)} />;
            })}
          </div>
          {a.picks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {isSolved ? (
                <Insight color="#7cc22b">
                  <span className="block font-display text-[16px] font-extrabold">{a.picks[0] === m.answer ? 'Correct on the first try!' : 'You got there!'} {m.answerText}</span>
                  <span className="mt-1 block text-[14px] font-semibold text-ink-soft">From the case: “{WHY[g][qi]}”</span>
                </Insight>
              ) : (
                <Insight color="#e2336c">Not quite — the Sharks look puzzled. Think about the case and try another option.</Insight>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 font-display text-[15px] font-extrabold ring-1 ring-skippi-100">
          <Trophy className="size-5 text-mango-500" /> First-try score: {score}/{mcqs.length}
        </span>
        {isSolved && qi < mcqs.length - 1 && <Btn iconRight={ArrowRight} onClick={() => setQi(qi + 1)}>Next question</Btn>}
      </div>
      {allSolved && <DoneStamp show={done} label={`Quiz complete · ${score}/${mcqs.length} first try`} />}
    </div>
  );
}
