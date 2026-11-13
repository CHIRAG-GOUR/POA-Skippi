import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Lock, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { NUMBERS, HAPPENED } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, MentorNote, Insight, DoneStamp, PoaImage, ExtLink, TextResponse, ChoiceOption, LETTERS, cx } from '../ui/kit';
import { sfx } from '../audio/sfx';

export default function S05Numbers({ activityId, next }: { activityId: string; next: () => void }) {
  if (activityId === 's5-deal') return <Deal next={next} />;
  if (activityId === 's5-revenue') return <Revenue next={next} />;
  if (activityId === 's5-profit') return <Profit next={next} />;
  return <Funding />;
}

/* ---------------------------------------------------------------- A. deal */
const DEAL_QS = [
  { q: 'Skippi asked for ₹45 lakh for 5% of the company. What does that value the whole business at?', options: ['₹2.25 crore', '₹9 crore', '₹45 crore', '₹4.5 crore'], answer: 1, why: HAPPENED.ask },
  { q: 'The final deal was ₹1 crore for 15%. What is the implied post-money valuation?', options: ['₹15 crore', '₹1.5 crore', 'Approximately ₹6.67 crore', '₹10 crore'], answer: 2, why: 'Implied post-money valuation: Approximately ₹6.67 crore' },
];
function Deal({ next }: { next: () => void }) {
  const [picks, setPicks] = useAnswer<(number | null)[]>('s5.deal', [null, null]);
  const [amt, setAmt] = useState(45);
  const [eq, setEq] = useState(5);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s5-deal');
  useEffect(() => { put('scaleTilt', picks[1] === 2 ? 1 : picks[0] === 1 ? -0.4 : 0); }, [picks, put]);
  const pick = (qi: number, i: number) => {
    if (picks[qi] === DEAL_QS[qi].answer) return;
    const np = [...picks]; np[qi] = i; setPicks(np);
    if (i === DEAL_QS[qi].answer) sfx.coin(); else sfx.wrong();
    if (np.every((p, k) => p === DEAL_QS[k].answer)) complete('s5-deal');
  };
  const val = amt / (eq / 100); // in lakh
  return (
    <div className="space-y-4">
      <Kicker color="#f56d14">{NUMBERS.deal.heading}</Kicker>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100">
        <div className="grid grid-cols-2 bg-orangepop-500 px-3 py-2 font-display text-[13px] font-extrabold uppercase text-white"><span>{NUMBERS.deal.columns[0]}</span><span>{NUMBERS.deal.columns[1]}</span></div>
        {NUMBERS.deal.rows.map((r) => <div key={r.k} className="grid grid-cols-2 border-t border-orange-100 px-3 py-2 text-[14.5px]"><span className="font-bold">{r.k}</span><span>{r.v}</span></div>)}
      </div>
      <Insight color="#f56d14">{NUMBERS.deal.insight}</Insight>
      <div className="rounded-3xl bg-white p-4 ring-1 ring-skippi-100">
        <p className="flex items-center gap-2 font-display text-[16px] font-extrabold"><Calculator className="size-5 text-orangepop-500" /> Valuation explorer</p>
        <p className="mt-1 text-[13.5px] text-ink-soft">Company value = Investment ÷ Equity share. Move the sliders to test it.</p>
        <label className="mt-3 block text-[14px] font-bold">Investment: ₹{amt >= 100 ? `${(amt / 100).toFixed(2)} crore` : `${amt} lakh`}
          <input type="range" min={10} max={200} step={5} value={amt} onChange={(e) => setAmt(+e.target.value)} className="mt-1 w-full accent-orangepop-500" /></label>
        <label className="mt-2 block text-[14px] font-bold">Equity: {eq}%
          <input type="range" min={1} max={30} step={1} value={eq} onChange={(e) => setEq(+e.target.value)} className="mt-1 w-full accent-orangepop-500" /></label>
        <p className="mt-2 rounded-xl bg-mango-100 px-3 py-2 font-display text-[18px] font-extrabold text-mango-600">Value ≈ ₹{(val / 100).toFixed(2)} crore</p>
      </div>
      {DEAL_QS.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <p className="font-display text-[17px] font-extrabold leading-snug">{q.q}</p>
          {q.options.map((o, i) => {
            const p = picks[qi];
            const state = p === i ? (i === q.answer ? 'correct' : 'wrong') : p === q.answer ? 'dim' : 'idle';
            return <ChoiceOption key={o} letter={LETTERS[i]} text={o} state={state} disabled={p === q.answer} onClick={() => pick(qi, i)} />;
          })}
          {picks[qi] === q.answer && <Insight color="#7cc22b">From the case: “{q.why}”</Insight>}
        </div>
      ))}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Deal decoded" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Growth story</Btn>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- B. revenue */
function Revenue({ next }: { next: () => void }) {
  const rows = NUMBERS.growth.rows;
  const [revealed, setRevealed] = useAnswer<number>('s5.revealed', 1);
  const [preds, setPreds] = useAnswer<('up' | 'down')[]>('s5.preds', []);
  const [last, setLast] = useState<{ ok: boolean; text: string } | null>(null);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s5-revenue');
  useEffect(() => { put('revealed', revealed); }, [revealed, put]);
  const predict = (d: 'up' | 'down') => {
    const i = revealed;
    const actual = rows[i].crore > rows[i - 1].crore ? 'up' : 'down';
    setPreds([...preds, d]);
    setRevealed(i + 1);
    const ok = d === actual;
    ok ? sfx.correct() : sfx.wrong();
    setLast({ ok, text: `${rows[i].fy}: ${rows[i].label}. Revenue went ${actual === 'up' ? 'UP' : 'DOWN'}${ok ? ' — good prediction!' : '.'}` });
    if (i + 1 === rows.length) complete('s5-revenue');
  };
  const data = rows.slice(0, revealed).map((r) => ({ fy: r.fy, v: r.crore }));
  return (
    <div className="space-y-4">
      <Kicker color="#f56d14">{NUMBERS.growth.heading}</Kicker>
      <p className="text-[14.5px] text-ink-soft">Predict each year before you reveal it. Watch the crate towers grow in the plaza.</p>
      <div className="h-56 rounded-2xl bg-white p-2 ring-1 ring-skippi-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffe0c2" />
            <XAxis dataKey="fy" tick={{ fontWeight: 800, fill: '#1b2340' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 24]} ticks={[0, 6, 12, 18, 24]} tickFormatter={(v) => `₹${v} Cr`} tick={{ fontSize: 11, fill: '#4a5378' }} axisLine={false} tickLine={false} />
            <Bar dataKey="v" radius={[10, 10, 0, 0]} isAnimationActive>
              {data.map((d, i) => <Cell key={d.fy} fill={i === 3 ? '#e2336c' : '#f56d14'} />)}
              <LabelList dataKey="v" position="top" formatter={(v: unknown) => `≈ ₹${v} Cr`} style={{ fontWeight: 800, fontSize: 12, fill: '#1b2340' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {revealed < rows.length ? (
        <div className="rounded-3xl bg-white p-4 text-center ring-2 ring-orange-200">
          <p className="font-display text-[18px] font-extrabold">Will {rows[revealed].fy} revenue go up or down compared with {rows[revealed - 1].fy}?</p>
          <div className="mt-3 flex justify-center gap-2">
            <Btn variant="lime" icon={TrendingUp} onClick={() => predict('up')}>Up</Btn>
            <Btn variant="rasp" icon={TrendingDown} onClick={() => predict('down')}>Down</Btn>
          </div>
        </div>
      ) : null}
      {last && <Insight color={last.ok ? '#7cc22b' : '#e2336c'}>{last.text}</Insight>}
      {done && (
        <>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100">
            <div className="grid grid-cols-2 bg-orangepop-500 px-3 py-2 font-display text-[13px] font-extrabold uppercase text-white"><span>{NUMBERS.growth.columns[0]}</span><span>{NUMBERS.growth.columns[1]}</span></div>
            {rows.map((r) => <div key={r.fy} className="grid grid-cols-2 border-t border-orange-100 px-3 py-2 text-[14.5px]"><span className="font-bold">{r.fy}</span><span>{r.label}</span></div>)}
          </div>
          <Insight color="#f56d14">{NUMBERS.growth.insight}</Insight>
          <PoaImage src={NUMBERS.growth.image.src} alt={NUMBERS.growth.image.alt} caption="Original chart from the POA" />
        </>
      )}
      <MentorNote>{NUMBERS.mentorNote}</MentorNote>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Growth story revealed" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Revenue ≠ Profit</Btn>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- C. revenue vs profit (practice numbers) */
const DAYS = [
  { title: 'Sunny Monday', revenue: 800, expenses: 500 },
  { title: 'Big Sale Saturday', revenue: 1200, expenses: 1400 },
  { title: 'Busy Fair Day', revenue: 2000, expenses: 2000 },
];
function Profit({ next }: { next: () => void }) {
  const [solved, setSolved] = useAnswer<boolean[]>('s5.profit', [false, false, false]);
  const [vals, setVals] = useState<string[]>(['', '', '']);
  const [msg, setMsg] = useState<string[]>(['', '', '']);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s5-profit');
  const check = (i: number) => {
    const d = DAYS[i];
    const want = d.revenue - d.expenses;
    const got = Number(vals[i].replace(/[₹,\s]/g, ''));
    const nm = [...msg];
    if (vals[i].trim() !== '' && got === want) {
      sfx.coin();
      const ns = [...solved]; ns[i] = true; setSolved(ns);
      nm[i] = want > 0 ? `Correct! A profit of ₹${want}.` : want < 0 ? `Correct! ₹${want}: a LOSS — more revenue than Monday, but the day still lost money.` : 'Correct! ₹0: lots of sales, but nothing left over.';
      put('profit', { kind: want > 0 ? 'profit' : want < 0 ? 'loss' : 'even', n: Date.now() });
      if (ns.every(Boolean)) complete('s5-profit');
    } else {
      sfx.wrong();
      nm[i] = 'Not quite. Profit = Revenue − Expenses. It can be negative!';
    }
    setMsg(nm);
  };
  return (
    <div className="space-y-4">
      <H3>Revenue ≠ Profit Lab</H3>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[['Revenue', 'Money that comes in from sales', '#2163e0'], ['Expenses', 'Money spent to run the business', '#e2336c'], ['Profit', 'Revenue − Expenses', '#7cc22b']].map(([t, d, c]) => (
          <div key={t} className="rounded-2xl bg-white p-2.5 ring-2" style={{ ['--tw-ring-color' as string]: c }}>
            <p className="font-display text-[16px] font-extrabold" style={{ color: c }}>{t}</p>
            <p className="text-[12px] font-semibold leading-snug text-ink-soft">{d}</p>
          </div>
        ))}
      </div>
      <p className="rounded-xl bg-skippi-50 px-3 py-2 text-[13px] font-bold text-skippi-700">Practice numbers for an imaginary stall — these are not Skippi's figures.</p>
      {DAYS.map((d, i) => (
        <div key={d.title} className={cx('rounded-3xl bg-white p-4 ring-2', solved[i] ? 'ring-lime-400' : 'ring-skippi-100')}>
          <p className="font-display text-[17px] font-extrabold">{d.title}</p>
          <p className="mt-1 text-[15px]">Revenue <b>₹{d.revenue}</b> · Expenses <b>₹{d.expenses}</b></p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold">Profit = ₹</span>
            <input value={vals[i]} disabled={solved[i]} onChange={(e) => { const nv = [...vals]; nv[i] = e.target.value; setVals(nv); }} onKeyDown={(e) => e.key === 'Enter' && check(i)} inputMode="numeric" aria-label={`Profit for ${d.title}`}
              className="w-28 rounded-xl bg-skippi-50 px-3 py-2 font-display text-[17px] font-bold outline-none ring-2 ring-skippi-100 focus:ring-skippi-400" placeholder={solved[i] ? String(d.revenue - d.expenses) : '?'} />
            {!solved[i] && <Btn size="sm" onClick={() => check(i)}>Check</Btn>}
          </div>
          {msg[i] && <p className={cx('mt-2 text-[14px] font-bold', solved[i] ? 'text-lime-600' : 'text-rasp-600')}>{msg[i]}</p>}
        </div>
      ))}
      <MentorNote>{NUMBERS.mentorNote}</MentorNote>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Profit pro" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Funding journey</Btn>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- D. funding */
function Funding() {
  const [step, setStep] = useAnswer<number>('s5.funding', 0);
  const focus = useScene((s) => s.focus);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const answered = useGame((s) => !!s.grade && String(s.answers[`${s.grade}:s5.bubble`] ?? '').trim().length >= 20);
  const done = useDone('s5-funding');
  useEffect(() => { put('funding', step); }, [step, put]);
  const unlock = () => { if (step < 2) { sfx.coin(); setStep(step + 1); } };
  useEffect(() => { if (focus?.startsWith('fund:')) unlock(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [focus]);
  useEffect(() => { if (step >= 2 && answered) complete('s5-funding'); }, [step, answered, complete]);
  return (
    <div className="space-y-4">
      <Kicker color="#f56d14">{NUMBERS.funding.heading}</Kicker>
      <H3>{NUMBERS.funding.subtitle}</H3>
      <PoaImage src={NUMBERS.funding.image.src} alt={NUMBERS.funding.image.alt} refUrl={NUMBERS.funding.reference.url} refLabel="Reference link:" />
      <ol className="space-y-2">
        {NUMBERS.funding.steps.map((s, i) => (
          <motion.li key={s} layout className={cx('flex items-center gap-3 rounded-2xl p-3 ring-2', i < step ? 'bg-lime-100 ring-lime-400' : 'bg-white ring-skippi-100')}>
            <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-xl font-display font-black', i < step ? 'bg-lime-500 text-white' : 'bg-skippi-50 text-skippi-400')}>{i < step ? i + 1 : <Lock className="size-4" />}</span>
            <span className="text-[15px] font-semibold">{i < step ? s : 'Locked funding step'}</span>
            {i === step && <Btn size="sm" variant="lime" className="ml-auto" onClick={unlock}>Unlock</Btn>}
          </motion.li>
        ))}
      </ol>
      <div className="rounded-3xl bg-mango-100 p-4">
        <p className="font-display text-[19px] font-extrabold leading-snug">“{NUMBERS.questionBubble}”</p>
        <div className="mt-3"><TextResponse storeKey="s5.bubble" min={20} rows={3} label={NUMBERS.questionBubble} placeholder="Explain your answer using revenue, expenses and profit…" /></div>
      </div>
      <details className="rounded-2xl bg-white p-3 text-[14px] ring-1 ring-skippi-100">
        <summary className="cursor-pointer font-display font-bold">Infographic notes from the POA</summary>
        <p className="mt-2">{NUMBERS.intro}</p>
        <p className="mt-1">{NUMBERS.infographicNote}</p>
        <p className="mt-2 font-bold">{NUMBERS.suggestedHeading}</p>
        <ul className="list-disc pl-5">{NUMBERS.suggested.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="mt-2"><ExtLink href={NUMBERS.funding.reference.url}>{NUMBERS.funding.reference.label}</ExtLink></div>
      </details>
      <DoneStamp show={done} label="Funding journey complete" />
    </div>
  );
}
