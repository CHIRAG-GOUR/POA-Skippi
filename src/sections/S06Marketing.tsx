import { useEffect } from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { MARKETING } from '../content/poa';
import { useAnswer, useDone, useGame, useScene } from '../game/store';
import { Btn, H3, Kicker, VideoEmbed, ExtLink, TextResponse, DoneStamp, Insight, cx } from '../ui/kit';
import type { CampaignDraft } from '../scenes/CampaignScene';
import { sfx } from '../audio/sfx';

export default function S06Marketing({ activityId, next }: { activityId: string; next: () => void }) {
  return activityId === 's6-study' ? <Study next={next} /> : <Builder />;
}

function Study({ next }: { next: () => void }) {
  const [played, setPlayed] = useAnswer<boolean>('s6.played', false);
  const noted = useGame((s) => !!s.grade && String(s.answers[`${s.grade}:s6.note`] ?? '').trim().length >= 15);
  const complete = useGame((s) => s.complete);
  const done = useDone('s6-study');
  useEffect(() => { if (played && noted) complete('s6-study'); }, [played, noted, complete]);
  return (
    <div className="space-y-4">
      <Kicker color="#e2336c">{MARKETING.heading}</Kicker>
      <p className="font-display text-[19px] font-bold leading-snug">{MARKETING.intro}</p>
      <H3>{MARKETING.studyHeading}</H3>
      <div>
        <p className="font-display text-[17px] font-extrabold">{MARKETING.campaign.title}</p>
        <p className="mb-2 text-[13px] font-semibold text-ink-soft">{MARKETING.campaign.meta}</p>
        <VideoEmbed provider="youtube" id={MARKETING.campaign.youtubeId} url={MARKETING.campaign.link.url} title={MARKETING.campaign.link.label} onPlay={() => setPlayed(true)} accent="#e2336c" />
        {played && <p className="mt-2 text-[13px] font-bold text-lime-600">Video opened.</p>}
      </div>
      <TextResponse storeKey="s6.note" min={15} prompt="One idea from this campaign you could use:" />
      <div>
        <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-ink-soft">{MARKETING.mentorRefsHeading}</p>
        <div className="flex flex-col gap-2">{MARKETING.mentorRefs.map((l) => <ExtLink key={l.url} href={l.url}>{l.label}</ExtLink>)}</div>
      </div>
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Campaign studied" />
        {done && <Btn iconRight={ArrowRight} onClick={next}>Create your campaign</Btn>}
      </div>
    </div>
  );
}

const EMPTY: CampaignDraft = { name: '', tagline: '', target: '', platform: '', promo: '', repeat: '' };
function Builder() {
  const [d, setD] = useAnswer<CampaignDraft>('s6.campaign', EMPTY);
  const [launched, setLaunched] = useAnswer<number>('s6.launched', 0);
  const put = useScene((s) => s.put);
  const complete = useGame((s) => s.complete);
  const done = useDone('s6-campaign');
  useEffect(() => { put('draft', d); put('launched', launched); }, [d, launched, put]);
  const upd = (k: keyof CampaignDraft, v: string) => setD({ ...d, [k]: v });
  const ok = d.name.trim().length >= 3 && d.tagline.trim().length >= 5 && d.target.trim().length >= 5 && !!d.platform && d.promo.trim().length >= 10 && d.repeat.trim().length >= 10;
  const launch = () => { if (!ok) return; sfx.fanfare(); setLaunched(Date.now()); complete('s6-campaign'); };
  const field = (k: keyof CampaignDraft, label: string, ph: string, rows = 1) => (
    <label className="block">
      <span className="mb-1 block text-[15px] font-bold">{label}</span>
      {rows === 1 ? (
        <input value={d[k]} onChange={(e) => upd(k, e.target.value)} placeholder={ph} maxLength={60} className="w-full rounded-2xl bg-white px-3.5 py-2.5 text-[15px] outline-none ring-2 ring-skippi-100 focus:ring-rasp-400" />
      ) : (
        <textarea value={d[k]} onChange={(e) => upd(k, e.target.value)} placeholder={ph} rows={rows} className="w-full resize-y rounded-2xl bg-white px-3.5 py-2.5 text-[15px] outline-none ring-2 ring-skippi-100 focus:ring-rasp-400" />
      )}
    </label>
  );
  return (
    <div className="space-y-4">
      <H3>{MARKETING.challengeHeading}</H3>
      <p className="text-[15px]">{MARKETING.challengeIntro} {MARKETING.challengeDecideIntro}</p>
      <ul className="list-disc space-y-0.5 pl-5 text-[14px] text-ink-soft">{MARKETING.challenge.map((c) => <li key={c}>{c}</li>)}</ul>
      <p className="rounded-xl bg-rasp-100 px-3 py-2 text-[13px] font-bold text-rasp-600">Your name and tagline appear live on the 3D billboard.</p>
      {field('name', 'Campaign name', 'e.g. Chill Champions')}
      {field('tagline', 'Tagline', 'A catchy line customers will remember')}
      {field('target', 'Target customer', 'Who is this campaign for?')}
      <div>
        <span className="mb-1 block text-[15px] font-bold">Platform</span>
        <div className="grid grid-cols-2 gap-2">
          {MARKETING.platforms.map((p) => (
            <button key={p} onClick={() => { sfx.pop(); upd('platform', p); }} className={cx('rounded-2xl px-3 py-2.5 font-display text-[15px] font-bold ring-2 transition', d.platform === p ? 'bg-rasp-500 text-white ring-rasp-500' : 'bg-white ring-skippi-100 hover:ring-rasp-300')}>{p}</button>
          ))}
        </div>
      </div>
      {field('promo', 'One promotional activity', 'What will you do to promote Skippi?', 2)}
      {field('repeat', 'How will it make customers buy again?', 'Your repeat-purchase idea', 2)}
      {!ok && <Insight color="#ffa514">Fill all six parts to unlock the launch button.</Insight>}
      <div className="flex items-center justify-between">
        <DoneStamp show={done} label="Campaign launched" />
        <Btn variant="rasp" size="lg" icon={Rocket} disabled={!ok} onClick={launch}>{launched ? 'Relaunch' : 'Launch campaign'}</Btn>
      </div>
    </div>
  );
}
