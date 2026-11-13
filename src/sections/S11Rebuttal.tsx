import { useEffect } from 'react';
import { ArrowRight, MessageCircle, Shield } from 'lucide-react';
import { REBUTTAL, ROLES, gradeLabel } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import type { GameState } from '../game/store';
import { useShallow } from 'zustand/react/shallow';
import { Btn, H3, Kicker, TextResponse, DoneStamp, GradeTag, cx } from '../ui/kit';
import { GradeBlock } from '../ui/SectionShell';

export default function S11Rebuttal({ activityId, next }: { activityId: string; next: () => void }) {
  if (activityId === 's11-team') return <Team next={next} />;
  if (activityId === 's11-challenges') return <Challenges next={next} />;
  return <Defend />;
}

const RCOL = ['#e2336c', '#ffa514', '#7cc22b', '#2163e0', '#f056a8'];

function Team({ next }: { next: () => void }) {
  const [names, setNames] = useAnswer<string[]>('s11.names', ROLES.map(() => ''));
  const put = useScene((s) => s.put);
  const focus = useScene((s) => s.focus);
  const complete = useGame((s) => s.complete);
  const done = useDone('s11-team');
  useEffect(() => { if (names.every((n) => n.trim().length >= 2)) complete('s11-team'); }, [names, complete]);
  useEffect(() => { if (focus?.startsWith('role:')) document.getElementById(`role-${focus.split(':')[1]}`)?.focus(); }, [focus]);
  useEffect(() => () => put('role', -1), [put]);
  return (
    <div className="space-y-4">
      <Kicker color="#7a3522">{REBUTTAL.heading}</Kicker>
      <p className="font-display text-[17px] font-bold leading-snug">{REBUTTAL.activity}</p>
      <H3>{REBUTTAL.rolesHeading}</H3>
      {ROLES.map((r, i) => (
        <div key={r.id} className="rounded-2xl bg-white p-3 ring-2" style={{ ['--tw-ring-color' as string]: RCOL[i] + '55' }}>
          <p className="font-display text-[17px] font-extrabold" style={{ color: RCOL[i] }}>{r.role}</p>
          <p className="text-[14px] text-ink-soft">{r.responsibility}</p>
          <input id={`role-${i}`} value={names[i]} onFocus={() => put('role', i)} onChange={(e) => { const n = [...names]; n[i] = e.target.value; setNames(n); }} placeholder="Teammate's name" maxLength={40}
            className="mt-2 w-full rounded-xl bg-skippi-50 px-3 py-2 text-[15px] font-bold outline-none ring-2 ring-transparent focus:ring-skippi-300" />
        </div>
      ))}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Team formed" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Role challenges</Btn>}
      </div>
    </div>
  );
}

function Challenges({ next }: { next: () => void }) {
  const grade = useGame((s) => s.grade)!;
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s11-challenges');
  const ok = useGame((s) => REBUTTAL.problems[grade].every((_, i) => String(s.answers[`${grade}:s11.plan.${i}`] ?? '').trim().length >= 20));
  useEffect(() => { if (ok) complete('s11-challenges'); }, [ok, complete]);
  return (
    <div className="space-y-4">
      <H3>{REBUTTAL.problemsHeading}</H3>
      <GradeBlock readOnly={(g) => <ul className="space-y-2">{REBUTTAL.problems[g].map((p) => <li key={p.title}><b>{p.title}:</b> {p.text}</li>)}</ul>}>
        {(g) => (
          <div className="space-y-4">
            <GradeTag label={gradeLabel(g)} />
            {REBUTTAL.problems[g].map((p, i) => {
              const ri = ROLES.findIndex((r) => r.id === p.role);
              return (
                <div key={p.title} className="rounded-3xl bg-white p-4 ring-1 ring-skippi-100" onFocus={() => put('role', ri)}>
                  <p className="font-display text-[17px] font-extrabold" style={{ color: RCOL[ri] }}>{p.title}</p>
                  <p className="mb-2 text-[15px] font-semibold">{p.text}</p>
                  <TextResponse storeKey={`s11.plan.${i}`} min={20} rows={4} label={p.title} placeholder="Your team's plan…" />
                </div>
              );
            })}
          </div>
        )}
      </GradeBlock>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Plans ready" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Defend it</Btn>}
      </div>
    </div>
  );
}

function Defend() {
  const grade = useGame((s) => s.grade)!;
  const complete = useGame((s) => s.complete);
  const done = useDone('s11-rebuttal');
  const probs = REBUTTAL.problems[grade];
  const ok = useGame((s) => probs.every((_, i) => String(s.answers[`${grade}:s11.q.${i}`] ?? '').trim().length >= 8 && String(s.answers[`${grade}:s11.d.${i}`] ?? '').trim().length >= 15));
  useEffect(() => { if (ok) complete('s11-rebuttal'); }, [ok, complete]);
  const plans = useGame(useShallow((s: GameState) => probs.map((_, i) => String(s.answers[`${grade}:s11.plan.${i}`] ?? ''))));
  return (
    <div className="space-y-4">
      <H3>Rebuttal round</H3>
      <p className="text-[15px] text-ink-soft">Another team questions each plan. Record their question and your team's defence.</p>
      {probs.map((p, i) => (
        <div key={p.title} className="space-y-3 rounded-3xl bg-white p-4 ring-1 ring-skippi-100">
          <p className="font-display text-[16px] font-extrabold">{p.title}</p>
          {plans[i] ? <p className="rounded-xl bg-skippi-50 p-2.5 text-[14px] italic">“{plans[i]}”</p> : <p className="text-[13px] font-bold text-rasp-600">Write this plan in “Role Challenges” first.</p>}
          <div className="flex gap-2"><MessageCircle className="mt-1 size-5 shrink-0 text-rasp-500" /><div className="flex-1"><TextResponse storeKey={`s11.q.${i}`} min={8} rows={2} prompt="Question from another team" /></div></div>
          <div className="flex gap-2"><Shield className="mt-1 size-5 shrink-0 text-lime-600" /><div className="flex-1"><TextResponse storeKey={`s11.d.${i}`} min={15} rows={3} prompt="Our defence" /></div></div>
        </div>
      ))}
      <div className={cx('flex items-center')}><DoneStamp show={done} label="Rebuttals defended" /></div>
    </div>
  );
}
