import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { REFLECTION } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, TextResponse, useTextsComplete, DoneStamp, Insight, cx } from '../ui/kit';
import { LanternIcon } from '../ui/PoaIcons';
import { sfx } from '../audio/sfx';

export default function S10Reflection({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's10-outcomes' ? <Outcomes next={next} /> : <Reflect />;
}

const LCOL = ['#ffa514', '#e2336c', '#2163e0', '#7cc22b'];
function Outcomes({ next }: { next: () => void }) {
  const [lit, setLit] = useAnswer<number[]>('s10.lit', []);
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const put = useScene((s) => s.put);
  const focus = useScene((s) => s.focus);
  const complete = useGame((s) => s.complete);
  const done = useDone('s10-outcomes');
  const order = useMemo(() => [2, 0, 3, 1], []);
  useEffect(() => { put('lit', lit); }, [lit, put]);
  useEffect(() => { if (focus?.startsWith('lantern:')) { const i = +focus.split(':')[1]; if (!lit.includes(i)) setSel(i); } }, [focus, lit]);
  const match = (statement: number) => {
    if (sel === null) { setMsg('First tap a lantern title (or a lantern in the garden).'); return; }
    if (statement === sel) {
      sfx.correct(); const nl = [...lit, sel]; setLit(nl); setSel(null); setMsg(null);
      if (nl.length === 4) complete('s10-outcomes');
    } else { sfx.wrong(); setMsg('That statement belongs to a different lantern. Try again!'); }
  };
  return (
    <div className="space-y-4">
      <Kicker color="#5d9a17">{REFLECTION.heading}</Kicker>
      <p className="text-[15px]">{REFLECTION.intro} <span className="text-ink-soft">Pick a lantern, then the statement that lights it.</span></p>
      <div className="grid grid-cols-2 gap-2">
        {REFLECTION.outcomes.map((o, i) => (
          <button key={o.title} disabled={lit.includes(i)} onClick={() => { sfx.pop(); setSel(i); }}
            className={cx('flex items-center gap-2 rounded-2xl p-3 text-left font-display text-[15px] font-extrabold leading-tight ring-2 transition', lit.includes(i) ? 'text-white' : sel === i ? 'bg-white ring-4' : 'bg-white ring-skippi-100 hover:ring-skippi-300')}
            style={lit.includes(i) ? { background: LCOL[i], ['--tw-ring-color' as string]: LCOL[i] } : sel === i ? { ['--tw-ring-color' as string]: LCOL[i] } : undefined}>
            <LanternIcon className="size-6 shrink-0" style={{ color: lit.includes(i) ? '#fff' : LCOL[i] }} />{o.title}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {order.map((i) => {
          const o = REFLECTION.outcomes[i];
          const on = lit.includes(i);
          return (
            <motion.button layout key={o.text} disabled={on} onClick={() => match(i)}
              className={cx('block w-full rounded-2xl p-3 text-left text-[15px] font-semibold leading-snug ring-2 transition', on ? 'bg-lime-100 ring-lime-300' : 'bg-white ring-skippi-100 hover:ring-skippi-300')}>
              {on && <span className="mr-1 font-display font-extrabold" style={{ color: LCOL[i] }}>{o.title}:</span>}{o.text}
            </motion.button>
          );
        })}
      </div>
      {msg && <Insight color="#e2336c">{msg}</Insight>}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="All lanterns lit" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Reflection questions</Btn>}
      </div>
    </div>
  );
}

function Reflect() {
  const complete = useGame((s) => s.complete);
  const done = useDone('s10-reflect');
  const keys = REFLECTION.questions.map((_, i) => `s10.q.${i}`);
  const all = useTextsComplete(keys, 15);
  useEffect(() => { if (all) complete('s10-reflect'); }, [all, complete]);
  return (
    <div className="space-y-4">
      <H3>{REFLECTION.questionsHeading}</H3>
      {REFLECTION.questions.map((q, i) => <TextResponse key={q} storeKey={keys[i]} prompt={`${i + 1}. ${q}`} min={15} rows={3} />)}
      <DoneStamp show={done} label="Reflections saved" />
    </div>
  );
}
