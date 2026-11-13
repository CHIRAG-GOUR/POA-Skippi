import { useEffect, useState } from 'react';
import { ArrowRight, Check, X, Minus } from 'lucide-react';
import { KMATRIX, type KCell } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, MentorNote, TextResponse, useTextsComplete, DoneStamp, Insight, cx } from '../ui/kit';
import { sfx } from '../audio/sfx';

export default function S07KMatrix({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's7-matrix' ? <Matrix next={next} /> : <Discuss />;
}

const CYCLE: (KCell | null)[] = [null, '✔', '✘', 'Varies', 'Local', ''];
function CellView({ v }: { v: KCell | null }) {
  if (v === null) return <span className="text-[12px] font-bold text-ink-soft/50">tap</span>;
  if (v === '✔') return <Check className="mx-auto size-5 text-lime-600" strokeWidth={3.5} />;
  if (v === '✘') return <X className="mx-auto size-5 text-rasp-500" strokeWidth={3.5} />;
  if (v === '') return <Minus className="mx-auto size-5 text-ink-soft" strokeWidth={3} />;
  return <span className="text-[12.5px] font-extrabold text-skippi-700">{v}</span>;
}

function Matrix({ next }: { next: () => void }) {
  const R = KMATRIX.rows.length;
  const [grid, setGrid] = useAnswer<(KCell | null)[][]>('s7.grid', KMATRIX.rows.map(() => [null, null, null]));
  const [checked, setChecked] = useState(false);
  const [row, setRow] = useState(0);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s7-matrix');
  useEffect(() => {
    put('row', row);
    put('rowCells', (done || checked) ? KMATRIX.rows[row].cells : grid[row].map((c) => (c === null ? '…' : c)));
    put('solved', done);
  }, [row, grid, checked, done, put]);
  const cycle = (r: number, c: number) => {
    if (done) return;
    const ng = grid.map((x) => [...x]);
    const i = CYCLE.indexOf(ng[r][c]);
    ng[r][c] = CYCLE[(i + 1) % CYCLE.length] ?? null;
    if (ng[r][c] === null) ng[r][c] = '✔';
    setGrid(ng); setRow(r); setChecked(false); sfx.click();
  };
  const filled = grid.every((r) => r.every((c) => c !== null));
  const wrong = grid.map((r, ri) => r.map((c, ci) => c !== KMATRIX.rows[ri].cells[ci]));
  const nWrong = wrong.flat().filter(Boolean).length;
  const check = () => {
    setChecked(true);
    if (nWrong === 0) { sfx.success(); complete('s7-matrix'); } else sfx.wrong();
  };
  return (
    <div className="space-y-4">
      <Kicker color="#2163e0">{KMATRIX.heading}</Kicker>
      <p className="font-display text-[18px] font-bold leading-snug">{KMATRIX.question}</p>
      <p className="text-[14px] text-ink-soft">Predict each cell: tap to cycle through <b>Yes / No / Varies / Local / blank</b>. Then check against the POA's K-Matrix.</p>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-skippi-100">
        <table className="w-full min-w-[420px] text-[13.5px]">
          <thead>
            <tr className="bg-skippi-500 text-white">
              <th className="p-2 text-left font-display font-extrabold">Features</th>
              {KMATRIX.competitors.map((c) => <th key={c} className="p-2 font-display font-extrabold leading-tight">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {KMATRIX.rows.map((r, ri) => (
              <tr key={r.feature} className={cx('border-t border-skippi-50', row === ri && 'bg-mango-100/50')}>
                <td className="p-2 font-bold leading-snug"><button onClick={() => setRow(ri)} className="text-left">{r.feature}</button></td>
                {r.cells.map((_, ci) => (
                  <td key={ci} className="p-1 text-center">
                    <button onClick={() => cycle(ri, ci)} aria-label={`${r.feature} – ${KMATRIX.competitors[ci]}`}
                      className={cx('h-10 w-full rounded-xl ring-2 transition', done ? 'bg-lime-100 ring-lime-300' : checked && wrong[ri][ci] ? 'bg-rasp-100 ring-rasp-400' : checked ? 'bg-lime-100 ring-lime-300' : 'bg-skippi-50 ring-transparent hover:ring-skippi-300')}>
                      <CellView v={done ? KMATRIX.rows[ri].cells[ci] : grid[ri][ci]} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12.5px] text-ink-soft">“—” means the POA leaves that cell blank.</p>
      {checked && !done && <Insight color="#e2336c">{R * 3 - nWrong}/{R * 3} cells match. Fix the red cells and check again.</Insight>}
      <MentorNote>{KMATRIX.mentorNote}</MentorNote>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="K-Matrix matched" />
        {!done ? <Btn disabled={!filled} onClick={check}>Check matrix</Btn> : <Btn iconRight={ArrowRight} onClick={next}>Discussion</Btn>}
      </div>
    </div>
  );
}

function Discuss() {
  const complete = useGame((s) => s.complete);
  const done = useDone('s7-discuss');
  const keys = KMATRIX.discussion.map((_, i) => `s7.d.${i}`);
  const all = useTextsComplete(keys, 12);
  useEffect(() => { if (all) complete('s7-discuss'); }, [all, complete]);
  return (
    <div className="space-y-4">
      <H3>{KMATRIX.discussionHeading}</H3>
      {KMATRIX.discussion.map((q, i) => <TextResponse key={q} storeKey={keys[i]} prompt={`${i + 1}. ${q}`} min={12} />)}
      <DoneStamp show={done} label="Discussion saved" />
    </div>
  );
}
