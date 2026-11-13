import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Hand, Lightbulb, MousePointerClick } from 'lucide-react';
import { BMC, SWOT, gradeLabel, type SwotKey } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, TextResponse, useTextsComplete, DoneStamp, cx, GradeTag, Insight } from '../ui/kit';
import { GradeBlock } from '../ui/SectionShell';
import { sfx } from '../audio/sfx';

export default function S03Strategy({ activityId, next }: { activityId: string; next: () => void }) {
  if (activityId === 's3-bmc') return <Canvas next={next} />;
  if (activityId === 's3-swot') return <Swot next={next} />;
  return <Brainstorm />;
}

function shuffled<T>(arr: T[], seed: number) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ================================================================== BMC */
function Canvas({ next }: { next: () => void }) {
  const [placed, setPlaced] = useAnswer<string[]>('s3.bmc', []);
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [tries, setTries] = useAnswer<number>('s3.bmcTries', 0);
  const focus = useScene((s) => s.focus);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s3-bmc');
  const cards = useMemo(() => shuffled(BMC.elements, 97), []);
  useEffect(() => { put('bmcPlaced', placed); }, [placed, put]);

  const drop = (slotId: string, cardId: string | null = sel) => {
    if (placed.includes(slotId)) return;
    if (!cardId) {
      setMsg({ ok: false, text: 'First pick a block description from the tray, then choose its slot.' });
      return;
    }
    setTries(tries + 1);
    const card = BMC.elements.find((e) => e.id === cardId)!;
    if (cardId === slotId) {
      sfx.correct();
      const np = [...placed, slotId];
      setPlaced(np);
      setSel(null);
      setMsg({ ok: true, text: `${card.element} placed!` });
      if (np.length === BMC.elements.length) complete('s3-bmc');
    } else {
      sfx.wrong();
      put('wrong', { id: slotId, n: Date.now() });
      setMsg({ ok: false, text: `That description doesn't describe “${BMC.elements.find((e) => e.id === slotId)!.element}”. Read it again and try another slot.` });
    }
  };
  // 3D slot clicks
  useEffect(() => {
    if (focus?.startsWith('slot:')) drop(focus.split(':')[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const left = cards.filter((c) => !placed.includes(c.id));
  return (
    <div className="space-y-4">
      <div>
        <Kicker color="#5d9a17">{BMC.heading}</Kicker>
        <p className="mt-1 text-[14.5px] text-ink-soft">
          <MousePointerClick className="inline size-4" /> Pick a block from the tray, then tap its slot on the 3D canvas or in the grid below. You can also drag a block onto a slot.
        </p>
      </div>
      {/* tray */}
      <div className="rounded-3xl bg-lime-100/70 p-3">
        <p className="mb-2 flex items-center justify-between font-display text-[14px] font-extrabold text-lime-600">
          <span>Block tray</span><span>{placed.length}/9 placed</span>
        </p>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {left.map((c) => (
              <motion.button
                layout key={c.id} exit={{ opacity: 0, scale: 0.8 }}
                draggable
                onDragStart={(e) => { (e as unknown as DragEvent).dataTransfer?.setData('text/plain', c.id); setSel(c.id); }}
                onClick={() => { sfx.click(); setSel(sel === c.id ? null : c.id); }}
                className={cx('flex items-start gap-2 rounded-2xl bg-white p-3 text-left text-[14.5px] font-semibold leading-snug ring-2 transition', sel === c.id ? 'ring-lime-500 shadow-[0_4px_0_0_#5d9a17] -translate-y-0.5' : 'ring-transparent hover:ring-lime-300')}
                aria-pressed={sel === c.id}
              >
                <Hand className="mt-0.5 size-4 shrink-0 text-lime-600" />
                {c.text}
              </motion.button>
            ))}
          </AnimatePresence>
          {left.length === 0 && <p className="py-2 text-center font-display font-bold text-lime-600">Canvas complete!</p>}
        </div>
      </div>
      {msg && <Insight color={msg.ok ? '#7cc22b' : '#e2336c'}>{msg.text}</Insight>}
      {/* slot grid mirror */}
      <div className="grid grid-cols-3 gap-2">
        {BMC.elements.map((e) => {
          const f = placed.includes(e.id);
          return (
            <button key={e.id} onClick={() => drop(e.id)}
              onDragOver={(ev) => ev.preventDefault()} onDrop={(ev) => { ev.preventDefault(); drop(e.id, ev.dataTransfer.getData('text/plain')); }}
              className={cx('min-h-[64px] rounded-2xl p-2 text-center font-display text-[13.5px] font-extrabold leading-tight ring-2 transition', f ? 'bg-lime-500 text-white ring-lime-500' : sel ? 'bg-white text-skippi-800 ring-dashed ring-lime-400 hover:bg-lime-100' : 'bg-white text-skippi-800 ring-skippi-100')}>
              {e.element}
            </button>
          );
        })}
      </div>
      {/* full canvas (POA table) once placed */}
      {placed.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100">
          <div className="grid grid-cols-[38%_62%] bg-lime-500 px-3 py-2 font-display text-[13px] font-extrabold uppercase text-white">
            <span>{BMC.columns[0]}</span><span>{BMC.columns[1]}</span>
          </div>
          {BMC.elements.filter((e) => placed.includes(e.id)).map((e) => (
            <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-[38%_62%] border-t border-lime-100 px-3 py-2 text-[14px]">
              <span className="font-bold">{e.element}</span><span>{e.text}</span>
            </motion.div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Canvas built" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>SWOT Sort</Btn>}
      </div>
    </div>
  );
}

/* ================================================================== SWOT */
const ALL_POINTS = SWOT.quadrants.flatMap((q) => q.points.map((p) => ({ key: q.key, text: p })));

function Swot({ next }: { next: () => void }) {
  const [sorted, setSorted] = useAnswer<string[]>('s3.swot', []); // texts
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const focus = useScene((s) => s.focus);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s3-swot');
  const deck = useMemo(() => shuffled(ALL_POINTS, 4242), []);
  const counts = useMemo(() => {
    const c: Record<SwotKey, number> = { S: 0, W: 0, O: 0, T: 0 };
    sorted.forEach((t) => { const p = ALL_POINTS.find((x) => x.text === t); if (p) c[p.key]++; });
    return c;
  }, [sorted]);
  useEffect(() => { put('swotPlaced', counts); }, [counts, put]);

  const send = (k: SwotKey) => {
    if (!sel) { setMsg({ ok: false, text: 'Pick a point card first, then send it to an island.' }); return; }
    const p = ALL_POINTS.find((x) => x.text === sel)!;
    const title = SWOT.quadrants.find((q) => q.key === k)!.title;
    if (p.key === k) {
      sfx.correct();
      const ns = [...sorted, sel];
      setSorted(ns);
      setSel(null);
      setMsg({ ok: true, text: `Planted on ${title} island.` });
      if (ns.length === ALL_POINTS.length) complete('s3-swot');
    } else {
      sfx.wrong();
      put('wrong', { id: k, n: Date.now() });
      setMsg({
        ok: false,
        text: `Not ${title}. Hint: Strengths and Weaknesses are about Skippi itself; Opportunities and Threats come from outside — markets, competitors, costs and customers.`,
      });
    }
  };
  useEffect(() => {
    if (focus?.startsWith('swot:')) send(focus.split(':')[1] as SwotKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const left = deck.filter((p) => !sorted.includes(p.text));
  const current = left[0];
  useEffect(() => { if (!sel && current) setSel(current.text); }, [sel, current]);

  return (
    <div className="space-y-4">
      <div>
        <Kicker color="#5d9a17">{SWOT.heading}</Kicker>
        <p className="mt-1 text-[14.5px] text-ink-soft">Read the point card, then send it to the right island: tap an island in 3D or a button below.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-lime-100">
          <motion.div className="h-full rounded-full bg-lime-500" animate={{ width: `${(sorted.length / 16) * 100}%` }} />
        </div>
        <span className="font-display text-[14px] font-extrabold text-lime-600">{sorted.length}/16</span>
      </div>
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div key={current.text} initial={{ rotate: -4, y: 20, opacity: 0 }} animate={{ rotate: 0, y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0, scale: 0.8 }}
            className="rounded-3xl bg-white p-5 text-center shadow-[var(--shadow-pop)] ring-2 ring-lime-300">
            <p className="font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-lime-600">Point card</p>
            <p className="mt-1 font-display text-[21px] font-bold leading-snug">{current.text}</p>
          </motion.div>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-lime-100 p-5 text-center font-display text-[18px] font-extrabold text-lime-600">All 16 points sorted!</motion.p>
        )}
      </AnimatePresence>
      {current && (
        <div className="grid grid-cols-2 gap-2">
          {SWOT.quadrants.map((q) => (
            <Btn key={q.key} variant={q.key === 'S' ? 'sun' : q.key === 'W' ? 'primary' : q.key === 'O' ? 'lime' : 'rasp'} onClick={() => send(q.key)} className="py-3">
              {q.title} ({counts[q.key]}/4)
            </Btn>
          ))}
        </div>
      )}
      {msg && <Insight color={msg.ok ? '#7cc22b' : '#e2336c'}>{msg.text}</Insight>}
      {/* sorted SWOT board */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SWOT.quadrants.map((q) => (
          <div key={q.key} className="rounded-2xl bg-white p-3 ring-1 ring-skippi-100">
            <p className="font-display text-[16px] font-extrabold" style={{ color: { S: '#e88a00', W: '#2163e0', O: '#5d9a17', T: '#7a3522' }[q.key] }}>{q.title}</p>
            <ul className="mt-1 space-y-1 text-[13.5px] leading-snug">
              {q.points.filter((p) => sorted.includes(p)).map((p) => <motion.li key={p} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>• {p}</motion.li>)}
              {q.points.filter((p) => !sorted.includes(p)).map((p) => <li key={p} className="h-3 w-3/4 rounded bg-skippi-50" aria-hidden />)}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="SWOT sorted" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Brainstorm</Btn>}
      </div>
    </div>
  );
}

/* ================================================================== Brainstorm */
function Brainstorm() {
  const complete = useGame((s) => s.complete);
  const grade = useGame((s) => s.grade)!;
  const done = useDone('s3-brainstorm');
  const keys = SWOT.brainstorm[grade].map((_, i) => `s3.brain.${i}`);
  const all = useTextsComplete(keys, 15);
  useEffect(() => { if (all) complete('s3-brainstorm'); }, [all, complete]);
  return (
    <div className="space-y-4">
      <H3 className="flex items-center gap-2"><Lightbulb className="size-5 text-mango-500" /> {SWOT.brainstormHeading}</H3>
      <GradeBlock readOnly={(g) => <ul className="list-disc space-y-1 pl-5">{SWOT.brainstorm[g].map((q) => <li key={q}>{q}</li>)}</ul>}>
        {(g) => (
          <div className="space-y-4">
            <GradeTag label={gradeLabel(g)} />
            {SWOT.brainstorm[g].map((q, i) => (
              <TextResponse key={q} storeKey={keys[i]} prompt={q} min={15} rows={3} />
            ))}
          </div>
        )}
      </GradeBlock>
      <DoneStamp show={done} label="Ideas saved" />
    </div>
  );
}
