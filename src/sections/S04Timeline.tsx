import { useEffect, useMemo, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ArrowLeft, ArrowRight, GripVertical, ChevronUp, ChevronDown, Bike } from 'lucide-react';
import { TIMELINE } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, MentorNote, DoneStamp, Insight, cx } from '../ui/kit';
import { sfx } from '../audio/sfx';

export default function S04Timeline({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's4-explore' ? <Explore next={next} /> : <Order />;
}

function Explore({ next }: { next: () => void }) {
  const [visited, setVisited] = useAnswer<number[]>('s4.visited', []);
  const [stop, setStop] = useState(0);
  const put = useScene((s) => s.put);
  const focus = useScene((s) => s.focus);
  const complete = useGame((s) => s.complete);
  const done = useDone('s4-explore');
  const go = (i: number) => {
    setStop(i);
    sfx.hop();
    if (!visited.includes(i)) {
      const nv = [...visited, i];
      setVisited(nv);
      if (nv.length === TIMELINE.milestones.length) complete('s4-explore');
    }
  };
  useEffect(() => { put('stop', stop); put('visited', visited); }, [stop, visited, put]);
  useEffect(() => { if (visited.length === 0) go(0); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => { if (focus?.startsWith('stop:')) go(+focus.split(':')[1]); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [focus]);
  const m = TIMELINE.milestones[stop];
  return (
    <div className="space-y-4">
      <Kicker color="#f056a8">{TIMELINE.heading}</Kicker>
      <p className="text-[14.5px] text-ink-soft"><Bike className="inline size-4" /> Ride the freezer bike along the trail. Tap a flag in 3D or use the buttons.</p>
      <motion.div key={stop} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-5 shadow-[var(--shadow-pop-sm)] ring-2 ring-bubble-400">
        <p className="font-display text-[34px] font-black leading-none text-bubble-500">{m.year}</p>
        <p className="mt-2 text-[17px] font-semibold leading-relaxed">{m.text}</p>
        <p className="mt-3 text-[12.5px] font-bold text-ink-soft">Stop {stop + 1} of {TIMELINE.milestones.length}</p>
      </motion.div>
      <div className="flex justify-between">
        <Btn variant="white" size="sm" icon={ArrowLeft} disabled={stop === 0} onClick={() => go(stop - 1)}>Back</Btn>
        <Btn variant="rasp" iconRight={ArrowRight} disabled={stop === TIMELINE.milestones.length - 1} onClick={() => go(stop + 1)}>Ride on</Btn>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {TIMELINE.milestones.map((x, i) => (
          <button key={i} onClick={() => go(i)} className={cx('rounded-xl px-1 py-2 font-display text-[12px] font-extrabold leading-tight ring-2 transition', i === stop ? 'bg-bubble-500 text-white ring-bubble-500' : visited.includes(i) ? 'bg-bubble-100 text-bubble-500 ring-bubble-100' : 'bg-white text-ink-soft ring-skippi-100')}>
            {x.year}
          </button>
        ))}
      </div>
      <MentorNote>{TIMELINE.mentorNote}</MentorNote>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label={`All ${TIMELINE.milestones.length} milestones visited`} />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Rebuild the journey</Btn>}
      </div>
    </div>
  );
}

function Order() {
  const items = useMemo(() => TIMELINE.milestones.map((m, i) => ({ ...m, i })), []);
  const [order, setOrder] = useAnswer<number[]>('s4.order', [6, 2, 9, 0, 4, 7, 1, 8, 3, 5]);
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const complete = useGame((s) => s.complete);
  const done = useDone('s4-order');
  // Equal year labels (two "2022" rows) are interchangeable.
  const correctAt = (pos: number, idx: number) => items[idx].year === items[pos].year;
  const check = () => {
    const res = order.map((idx, pos) => correctAt(pos, idx));
    setChecked(res);
    if (res.every(Boolean)) { sfx.success(); complete('s4-order'); } else sfx.wrong();
  };
  const move = (pos: number, d: number) => {
    const np = [...order];
    const j = pos + d;
    if (j < 0 || j >= np.length) return;
    [np[pos], np[j]] = [np[j], np[pos]];
    setOrder(np); setChecked(null); sfx.click();
  };
  return (
    <div className="space-y-4">
      <H3>Rebuild Skippi's journey</H3>
      <p className="text-[14.5px] text-ink-soft">The milestones got shuffled! Drag the cards (or use the arrows) into the order they happened, oldest at the top, then check.</p>
      <Reorder.Group axis="y" values={order} onReorder={(v) => { setOrder(v); setChecked(null); }} className="space-y-2">
        {order.map((idx, pos) => (
          <Reorder.Item key={idx} value={idx} className={cx('flex cursor-grab items-center gap-2 rounded-2xl bg-white p-2.5 ring-2 active:cursor-grabbing', checked ? (checked[pos] ? 'ring-lime-400' : 'ring-rasp-400') : 'ring-skippi-100')}>
            <GripVertical className="size-5 shrink-0 text-ink-soft" />
            <span className="flex-1 text-[14px] font-semibold leading-snug">
              {(checked?.[pos] || done) && <span className="mr-1.5 font-display font-extrabold text-bubble-500">{items[idx].year}:</span>}
              {items[idx].text}
            </span>
            <span className="flex flex-col">
              <button onClick={() => move(pos, -1)} aria-label="Move up" className="rounded p-0.5 hover:bg-skippi-50"><ChevronUp className="size-4" /></button>
              <button onClick={() => move(pos, 1)} aria-label="Move down" className="rounded p-0.5 hover:bg-skippi-50"><ChevronDown className="size-4" /></button>
            </span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {checked && !checked.every(Boolean) && <Insight color="#e2336c">{checked.filter(Boolean).length}/10 in the right place. Red cards are out of order — try again!</Insight>}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Journey rebuilt" />
        {!done && <Btn variant="rasp" onClick={check}>Check my order</Btn>}
      </div>
    </div>
  );
}
