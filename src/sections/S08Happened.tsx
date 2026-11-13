import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { HAPPENED } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, Kicker, H3, VideoEmbed, ExtLink, MentorNote, TextResponse, DoneStamp, Insight, cx } from '../ui/kit';
import { sfx } from '../audio/sfx';

export default function S08Happened({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's8-story' ? <Story next={next} /> : <Investigate />;
}

const STEPS = ['The pitch', 'Five Sharks', 'The deal', 'After the show', '2024 funding', 'FY25'];
const SCREENS = [
  { title: '₹45 lakh for 5%', body: 'The original ask', color: '#2163e0' },
  { title: 'ALL FIVE SHARKS', body: HAPPENED.sharks.join(' · '), color: '#1a4fc0' },
  { title: '₹1 crore for 15%', body: 'The all-Sharks deal', color: '#ffa514' },
  { title: 'AFTER THE SHOW', body: 'Retail presence · new sales channels · freezer bikes', color: '#7cc22b' },
  { title: '₹10 crore', body: 'Pre-Series A funding round (2024)', color: '#2163e0' },
  { title: '≈ ₹20 cr → ≈ ₹8.2 cr', body: 'Operating revenue, FY24 → FY25 (Inc42)', color: '#e2336c' },
];

function Story({ next }: { next: () => void }) {
  const [seen, setSeen] = useAnswer<number[]>('s8.seen', [0]);
  const [step, setStep] = useAnswer<number>('s8.step', 0);
  const [shark, setShark] = useAnswer<number | null>('s8.shark', null);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s8-story');
  useEffect(() => { put('step', step); put('screen', SCREENS[step]); put('shark', step === 1 ? shark : null); }, [step, shark, put]);
  const go = (i: number) => {
    sfx.pop(); setStep(i);
    if (!seen.includes(i)) { const ns = [...seen, i]; setSeen(ns); if (ns.length === STEPS.length) complete('s8-story'); }
  };
  return (
    <div className="space-y-4">
      <Kicker color="#1a4fc0">{HAPPENED.heading}</Kicker>
      <div className="flex gap-1.5">{STEPS.map((s, i) => (
        <button key={s} onClick={() => go(i)} aria-label={s} className={cx('h-2.5 flex-1 rounded-full', i === step ? 'bg-skippi-600' : seen.includes(i) ? 'bg-skippi-300' : 'bg-skippi-100')} />
      ))}</div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
          <H3>{step < 3 ? HAPPENED.momentHeading : HAPPENED.afterHeading} · {STEPS[step]}</H3>
          {step === 0 && (
            <>
              <p className="text-[16px] leading-relaxed">{HAPPENED.appeared}</p>
              <VideoEmbed provider="youtube" id={HAPPENED.episode.youtubeId} url={HAPPENED.episode.url} title={HAPPENED.episode.label} accent="#1a4fc0" />
              <p className="text-[16px] font-semibold leading-relaxed">{HAPPENED.ask}</p>
            </>
          )}
          {step === 1 && (
            <>
              <p className="text-[16px] font-semibold">{HAPPENED.sharksIntro}</p>
              <div className="grid gap-2">{HAPPENED.sharks.map((n, i) => (
                <button key={n} onClick={() => { sfx.pop(); setShark(i); }} className={cx('flex items-center gap-3 rounded-2xl p-3 text-left font-display text-[16px] font-bold ring-2 transition', shark === i ? 'bg-mango-100 ring-mango-400' : 'bg-white ring-skippi-100 hover:ring-skippi-300')}>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-skippi-500 text-white">{i + 1}</span>{n}
                </button>
              ))}</div>
              <p className="text-[13px] text-ink-soft">Tap a name to light up that Shark's name plate on stage.</p>
            </>
          )}
          {step === 2 && <><p className="text-[17px] font-bold leading-relaxed">{HAPPENED.accepted}</p><Insight color="#ffa514">{HAPPENED.known}</Insight></>}
          {step === 3 && <p className="text-[16px] leading-relaxed">{HAPPENED.after[0]}</p>}
          {step === 4 && <p className="text-[17px] font-bold leading-relaxed">{HAPPENED.after[1]}</p>}
          {step === 5 && (
            <>
              <p className="text-[16px] leading-relaxed">{HAPPENED.after[2]}</p>
              <Insight color="#e2336c"><span className="font-display text-[17px] font-extrabold">{HAPPENED.bigQuestion}</span></Insight>
              <div className="flex flex-col gap-2"><p className="text-[13px] font-bold uppercase tracking-wide text-ink-soft">{HAPPENED.refsHeading}</p>{HAPPENED.refs.map((r) => <ExtLink key={r.url} href={r.url}>{r.label}</ExtLink>)}</div>
              <MentorNote>{HAPPENED.mentorNote}</MentorNote>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <Btn variant="white" size="sm" icon={ArrowLeft} disabled={step === 0} onClick={() => go(step - 1)}>Back</Btn>
        {step < STEPS.length - 1 ? <Btn iconRight={ArrowRight} onClick={() => go(step + 1)}>Next scene</Btn> : <Btn iconRight={ArrowRight} disabled={!done} onClick={next}>Investigate</Btn>}
      </div>
      <DoneStamp show={done} label="Story replayed" />
    </div>
  );
}

function Investigate() {
  const [picked, setPicked] = useAnswer<number[]>('s8.picked', []);
  const complete = useGame((s) => s.complete);
  const done = useDone('s8-investigate');
  const whys = useGame((s) => picked.map((i) => String((s.grade && s.answers[`${s.grade}:s8.why.${i}`]) ?? '')));
  useEffect(() => {
    if (picked.length === 3 && whys.every((w) => w.trim().length >= 12)) complete('s8-investigate');
  }, [picked, whys, complete]);
  const toggle = (i: number) => {
    sfx.click();
    if (picked.includes(i)) setPicked(picked.filter((x) => x !== i));
    else if (picked.length < 3) setPicked([...picked, i]);
  };
  return (
    <div className="space-y-4">
      <p className="font-display text-[19px] font-extrabold leading-snug">{HAPPENED.bigQuestion}</p>
      <p className="text-[15px] font-semibold">{HAPPENED.investigateIntro} <span className="text-ink-soft">Pick your top 3 ({picked.length}/3).</span></p>
      <div className="grid gap-2">{HAPPENED.investigate.map((a, i) => {
        const on = picked.includes(i);
        return (
          <button key={a} onClick={() => toggle(i)} className={cx('flex items-center gap-3 rounded-2xl p-3 text-left text-[15px] font-bold ring-2 transition', on ? 'bg-skippi-500 text-white ring-skippi-500' : 'bg-white ring-skippi-100 hover:ring-skippi-300', !on && picked.length >= 3 && 'opacity-50')}>
            <span className={cx('flex size-7 items-center justify-center rounded-lg', on ? 'bg-white text-skippi-600' : 'bg-skippi-50')}>{on ? picked.indexOf(i) + 1 : <Check className="size-4 text-skippi-200" />}</span>{a}
          </button>
        );
      })}</div>
      {picked.map((i) => <TextResponse key={i} storeKey={`s8.why.${i}`} min={12} prompt={`Why could “${HAPPENED.investigate[i].replace(/\.$/, '')}” matter?`} />)}
      <MentorNote>{HAPPENED.mentorNote}</MentorNote>
      <DoneStamp show={done} label="Investigation filed" />
    </div>
  );
}
