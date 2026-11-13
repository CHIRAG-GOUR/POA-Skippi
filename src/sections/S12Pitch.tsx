import { useEffect, useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { PITCH, ROLES, gradeLabel, type RoleId } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import type { GameState } from '../game/store';
import { useShallow } from 'zustand/react/shallow';
import { Btn, H3, Kicker, TextResponse, DoneStamp, GradeTag, Insight, cx } from '../ui/kit';
import { GradeBlock } from '../ui/SectionShell';

export default function S12Pitch({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's12-builder' ? <Builder next={next} /> : <RoleQs />;
}

export const PITCH_AREAS: { key: string; label: string; hint: string }[] = [
  { key: 'concept', label: 'Product concept', hint: 'Brand name, flavours or variations, what makes it special' },
  { key: 'customer', label: 'Target customer', hint: 'Who buys it, and what problem it solves for them' },
  { key: 'model', label: 'Business model', hint: 'How the business makes money' },
  { key: 'pricing', label: 'Pricing', hint: 'Your price and why' },
  { key: 'marketing', label: 'Marketing strategy', hint: 'How customers will hear about you' },
  { key: 'sales', label: 'Sales strategy', hint: 'How you will sell to shops and customers' },
  { key: 'distribution', label: 'Distribution', hint: 'How products reach customers' },
  { key: 'operations', label: 'Operations', hint: 'Making, packing and quality checks' },
  { key: 'financials', label: 'Financial estimates', hint: 'Basic cost, revenue and profit (use the calculator)' },
  { key: 'growth', label: 'Growth plans', hint: 'Where you go next' },
  { key: 'ask', label: 'Investment ask', hint: 'How much you want, for what share (use the calculator)' },
];

export interface PitchNums { cost: string; revenue: string; askAmt: string; askEq: string }

function Builder({ next }: { next: () => void }) {
  const grade = useGame((s) => s.grade)!;
  const [brand, setBrand] = useAnswer<string>('s12.brand', '');
  const [tagline, setTagline] = useAnswer<string>('s12.tagline', '');
  const [nums, setNums] = useAnswer<PitchNums>('s12.nums', { cost: '', revenue: '', askAmt: '', askEq: '' });
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s12-builder');
  const filled = useGame((s) => PITCH_AREAS.filter((a) => String(s.answers[`${grade}:s12.${a.key}`] ?? '').trim().length >= 10).length);
  const n = (v: string) => Number(v.replace(/[₹,\s]/g, ''));
  const profit = nums.cost && nums.revenue ? n(nums.revenue) - n(nums.cost) : null;
  const val = nums.askAmt && nums.askEq && n(nums.askEq) > 0 ? n(nums.askAmt) / (n(nums.askEq) / 100) : null;
  useEffect(() => { put('screen', { title: brand || 'YOUR BRAND', body: tagline || 'Your tagline', color: '#2163e0' }); }, [brand, tagline, put]);
  useEffect(() => { if (filled === PITCH_AREAS.length && brand.trim().length >= 2) complete('s12-builder'); }, [filled, brand, complete]);
  const numInput = (k: keyof PitchNums, label: string) => (
    <label className="block text-[13px] font-bold">{label}
      <input value={nums[k]} onChange={(e) => setNums({ ...nums, [k]: e.target.value })} inputMode="decimal" className="mt-1 w-full rounded-xl bg-skippi-50 px-3 py-2 text-[15px] font-bold outline-none ring-2 ring-transparent focus:ring-skippi-300" placeholder="0" />
    </label>
  );
  return (
    <div className="space-y-4">
      <Kicker>{PITCH.heading}</Kicker>
      <H3>{PITCH.statementsHeading}</H3>
      <GradeBlock readOnly={(g) => <p><b>{PITCH.statements[g].title}</b><br />{PITCH.statements[g].text}</p>}>
        {(g) => (
          <div className="rounded-3xl bg-skippi-500 p-4 text-white">
            <GradeTag label={gradeLabel(g)} />
            <p className="mt-2 font-display text-[20px] font-extrabold leading-tight">{PITCH.statements[g].title.split('– ')[1]}</p>
            <p className="mt-1 text-[15.5px] font-semibold leading-relaxed">{PITCH.statements[g].text}</p>
          </div>
        )}
      </GradeBlock>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-[15px] font-bold">Brand name</span>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={30} className="w-full rounded-2xl bg-white px-3.5 py-2.5 outline-none ring-2 ring-skippi-100 focus:ring-skippi-400" placeholder="Shown on the studio screen" /></label>
        <label className="block"><span className="mb-1 block text-[15px] font-bold">Tagline</span>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={60} className="w-full rounded-2xl bg-white px-3.5 py-2.5 outline-none ring-2 ring-skippi-100 focus:ring-skippi-400" /></label>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-skippi-100"><div className="h-full rounded-full bg-skippi-500 transition-all" style={{ width: `${(filled / PITCH_AREAS.length) * 100}%` }} /></div>
        <span className="font-display text-[14px] font-extrabold text-skippi-700">{filled}/11</span>
      </div>
      {PITCH_AREAS.map((a, i) => (
        <div key={a.key} className="rounded-3xl bg-white p-4 ring-1 ring-skippi-100">
          <TextResponse storeKey={`s12.${a.key}`} min={10} rows={2} prompt={`${i + 1}. ${a.label}`} placeholder={a.hint} />
          {a.key === 'financials' && (
            <div className="mt-3 rounded-2xl bg-skippi-50/60 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-skippi-700"><Calculator className="size-4" /> Profit calculator (₹)</p>
              <div className="grid grid-cols-2 gap-2">{numInput('cost', 'Total costs')}{numInput('revenue', 'Total revenue')}</div>
              {profit !== null && !Number.isNaN(profit) && <p className={cx('mt-2 font-display text-[16px] font-extrabold', profit >= 0 ? 'text-lime-600' : 'text-rasp-600')}>Profit = ₹{profit.toLocaleString('en-IN')} {profit < 0 && '(a loss)'}</p>}
            </div>
          )}
          {a.key === 'ask' && (
            <div className="mt-3 rounded-2xl bg-mango-100/60 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-mango-600"><Calculator className="size-4" /> Valuation calculator</p>
              <div className="grid grid-cols-2 gap-2">{numInput('askAmt', 'Amount asked (₹)')}{numInput('askEq', 'Equity offered (%)')}</div>
              {val !== null && !Number.isNaN(val) && <p className="mt-2 font-display text-[16px] font-extrabold text-mango-600">Implied valuation ≈ ₹{Math.round(val).toLocaleString('en-IN')}</p>}
            </div>
          )}
        </div>
      ))}
      {!done && <Insight color="#ffa514">Give your brand a name and fill all 11 parts (at least a sentence each) to finish the builder.</Insight>}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Pitch built" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Role questions</Btn>}
      </div>
    </div>
  );
}

const RCOL: Record<RoleId, string> = { pd: '#e2336c', mm: '#ffa514', om: '#7cc22b', se: '#2163e0', is: '#f056a8' };
function RoleQs() {
  const grade = useGame((s) => s.grade)!;
  const [role, setRole] = useState<RoleId>('pd');
  const complete = useGame((s) => s.complete);
  const done = useDone('s12-roles');
  const counts = useGame(useShallow((s: GameState) => Object.fromEntries(ROLES.map((r) => [r.id, PITCH.questions[r.id][grade].filter((_, i) => String(s.answers[`${grade}:s12.rq.${r.id}.${i}`] ?? '').trim().length >= 10).length])) as Record<RoleId, number>));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  useEffect(() => { if (total === 20) complete('s12-roles'); }, [total, complete]);
  return (
    <div className="space-y-4">
      <H3>{PITCH.questionsHeading}</H3>
      <p className="text-[15px] text-ink-soft">{PITCH.questionsIntro}</p>
      <div className="flex flex-wrap gap-1.5">
        {ROLES.map((r) => (
          <button key={r.id} onClick={() => setRole(r.id)} className={cx('rounded-xl px-3 py-2 font-display text-[13.5px] font-bold ring-2 transition', role === r.id ? 'text-white' : 'bg-white ring-skippi-100')}
            style={role === r.id ? { background: RCOL[r.id], ['--tw-ring-color' as string]: RCOL[r.id] } : undefined}>
            {r.role} <span className="opacity-80">{counts[r.id]}/4</span>
          </button>
        ))}
      </div>
      <p className="font-display text-[17px] font-extrabold" style={{ color: RCOL[role] }}>{PITCH.questions[role].heading}</p>
      <GradeBlock readOnly={(g) => <ol className="list-decimal space-y-1 pl-5">{PITCH.questions[role][g].map((q) => <li key={q}>{q}</li>)}</ol>}>
        {(g) => (
          <div className="space-y-3">
            <GradeTag label={gradeLabel(g)} />
            {PITCH.questions[role][g].map((q, i) => <TextResponse key={role + q} storeKey={`s12.rq.${role}.${i}`} min={10} rows={2} prompt={`${i + 1}. ${q}`} />)}
          </div>
        )}
      </GradeBlock>
      <p className="font-display text-[14px] font-extrabold text-skippi-700">{total}/20 answered across all roles</p>
      <DoneStamp show={done} label="All role questions answered" />
    </div>
  );
}
