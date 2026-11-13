import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GraduationCap, Play, Check, X, Images, type LucideIcon } from 'lucide-react';
import { SECTION_POA_ICONS, IcePopIcon, TrophyPopIcon } from './PoaIcons';
import { useAnswer, useGame } from '../game/store';
import { sfx } from '../audio/sfx';

export const SECTION_ICONS: Record<string, (p: { className?: string; style?: React.CSSProperties; strokeWidth?: number }) => React.ReactElement> = SECTION_POA_ICONS;

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ Button */
type BtnVariant = 'primary' | 'sun' | 'rasp' | 'lime' | 'ghost' | 'white';
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-skippi-500 text-white hover:bg-skippi-600 shadow-[0_4px_0_0_#13317a]',
  sun: 'bg-mango-400 text-skippi-900 hover:bg-mango-300 shadow-[0_4px_0_0_#c47400]',
  rasp: 'bg-rasp-500 text-white hover:bg-rasp-400 shadow-[0_4px_0_0_#8f1340]',
  lime: 'bg-lime-500 text-white hover:bg-lime-400 shadow-[0_4px_0_0_#467510]',
  ghost: 'bg-transparent text-skippi-700 hover:bg-skippi-50 shadow-none',
  white: 'bg-white text-skippi-800 hover:bg-skippi-50 shadow-[0_4px_0_0_#b4d0ff] ring-1 ring-skippi-100',
};

export function Btn({
  variant = 'primary', size = 'md', className, children, icon: Icon, iconRight: IconR, onClick, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant; size?: 'sm' | 'md' | 'lg'; icon?: LucideIcon; iconRight?: LucideIcon;
}) {
  const sz = size === 'sm' ? 'px-3 py-1.5 text-sm rounded-xl gap-1.5' : size === 'lg' ? 'px-7 py-3.5 text-lg rounded-2xl gap-2.5' : 'px-4.5 py-2.5 text-[15px] rounded-2xl gap-2';
  return (
    <button
      {...rest}
      onClick={(e) => { sfx.click(); onClick?.(e); }}
      className={cx(
        'inline-flex items-center justify-center font-display font-bold leading-none transition-all duration-150 select-none',
        'active:translate-y-[3px] active:shadow-none disabled:opacity-45 disabled:active:translate-y-0',
        BTN[variant], sz, className,
      )}
    >
      {Icon && <Icon className={size === 'lg' ? 'size-5.5' : 'size-4.5'} strokeWidth={2.5} />}
      {children}
      {IconR && <IconR className={size === 'lg' ? 'size-5.5' : 'size-4.5'} strokeWidth={2.5} />}
    </button>
  );
}

/* ------------------------------------------------------------------ Headings */
export function Kicker({ children, color = '#2163e0' }: { children: ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-display text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color }}>
      <IcePopIcon className="size-4" strokeWidth={2.4} />
      {children}
    </span>
  );
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cx('font-display text-[19px] font-extrabold leading-tight text-ink', className)}>{children}</h3>;
}

/* ------------------------------------------------------------------ Notes, links */
export function MentorNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border-2 border-dashed border-skippi-200 bg-skippi-50/70 p-3.5 text-[14px] leading-relaxed text-ink-soft">
      <GraduationCap className="mt-0.5 size-5 shrink-0 text-skippi-500" />
      <p>{children}</p>
    </div>
  );
}

export function Insight({ children, color = '#ffa514' }: { children: ReactNode; color?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-3.5 pl-4 text-[14.5px] font-semibold leading-relaxed text-ink" style={{ background: color + '22', borderLeft: `6px solid ${color}` }}>
      {children}
    </div>
  );
}

export function ExtLink({ href, children, compact }: { href: string; children: ReactNode; compact?: boolean }) {
  let host = '';
  try { host = new URL(href).hostname.replace(/^www\./, ''); } catch { /* keep blank */ }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        'group inline-flex max-w-full items-center gap-2 rounded-xl bg-white text-left ring-1 ring-skippi-100 transition hover:-translate-y-0.5 hover:ring-skippi-300',
        compact ? 'px-2.5 py-1.5 text-[13px]' : 'px-3 py-2.5 text-[14px]',
      )}
    >
      <ExternalLink className="size-4 shrink-0 text-skippi-500" />
      <span className="min-w-0">
        <span className="block font-bold text-skippi-800 group-hover:underline">{children}</span>
        {!compact && <span className="block truncate text-[12px] text-ink-soft">{host}</span>}
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ POA Image */
export function PoaImage({ src, alt, caption, refUrl, refLabel }: { src: string; alt: string; caption?: string; refUrl?: string; refLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="m-0">
      <button onClick={() => setOpen(true)} className="group relative block w-full overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100" aria-label={`Enlarge image: ${alt}`}>
        <img src={src} alt={alt} className="block h-auto w-full transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-skippi-700">
          <Images className="size-3.5" /> Original POA image
        </span>
      </button>
      {(caption || refUrl) && (
        <figcaption className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-ink-soft">
          {caption && <span>{caption}</span>}
          {refUrl && <ExtLink href={refUrl} compact>{refLabel ? `${refLabel} ${refUrl}` : refUrl}</ExtLink>}
        </figcaption>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-skippi-900/70 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.img src={src} alt={alt} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-h-[88vh] max-w-[94vw] rounded-2xl bg-white shadow-2xl" />
            <button className="absolute right-5 top-5 rounded-full bg-white p-2" aria-label="Close image"><X className="size-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}

/* ------------------------------------------------------------------ Video (click-to-load facade) */
export function VideoEmbed({
  provider, id, url, title, meta, onPlay, accent = '#e2336c',
}: { provider: 'youtube' | 'vimeo'; id: string; url: string; title: string; meta?: string; onPlay?: () => void; accent?: string }) {
  const [playing, setPlaying] = useState(false);
  const src =
    provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${id}?autoplay=1`;
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-skippi-100">
      <div className="relative aspect-video w-full">
        {playing ? (
          <iframe
            src={src}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => { sfx.pop(); setPlaying(true); onPlay?.(); }}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden text-white"
            style={{ background: `radial-gradient(120% 90% at 30% 20%, ${accent}, #13317a)` }}
            aria-label={`Play video: ${title}`}
          >
            <span className="stripe-candy absolute inset-0 opacity-60" />
            <span className="relative flex size-18 items-center justify-center rounded-full bg-white text-skippi-700 shadow-xl transition group-hover:scale-110">
              <Play className="ml-1 size-8" fill="currentColor" />
            </span>
            <span className="relative max-w-[85%] text-center font-display text-[17px] font-bold leading-snug drop-shadow">{title}</span>
            <span className="relative rounded-full bg-black/25 px-3 py-1 text-[12px] font-bold">
              {provider === 'youtube' ? 'YouTube' : 'Vimeo'} · tap to load
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 p-3">
        {meta && <span className="text-[13px] font-semibold text-ink-soft">{meta}</span>}
        <ExtLink href={url} compact>Open original link</ExtLink>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Text response bound to the store */
export function TextResponse({
  storeKey, prompt, min = 12, rows = 3, placeholder, onValid, label,
}: { storeKey: string; prompt?: ReactNode; min?: number; rows?: number; placeholder?: string; onValid?: (ok: boolean) => void; label?: string }) {
  const [val, setVal] = useAnswer<string>(storeKey, '');
  const ok = val.trim().length >= min;
  const prev = useRef(ok);
  useEffect(() => {
    if (prev.current !== ok) { prev.current = ok; onValid?.(ok); }
  }, [ok, onValid]);
  return (
    <label className="block">
      {prompt && <span className="mb-1.5 block text-[15px] font-bold leading-snug text-ink">{prompt}</span>}
      <div className={cx('relative rounded-2xl bg-white ring-2 transition', ok ? 'ring-lime-400' : 'ring-skippi-100 focus-within:ring-skippi-400')}>
        <textarea
          value={val}
          rows={rows}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder ?? 'Type your thinking here…'}
          aria-label={label ?? (typeof prompt === 'string' ? prompt : 'Response')}
          className="block w-full resize-y rounded-2xl bg-transparent px-3.5 py-3 pr-10 text-[15px] leading-relaxed outline-none placeholder:text-ink-soft/50"
        />
        <span className={cx('absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full transition', ok ? 'bg-lime-500 text-white' : 'bg-skippi-50 text-skippi-300')}>
          <Check className="size-4" strokeWidth={3} />
        </span>
      </div>
      {!ok && <span className="mt-1 block text-[12px] text-ink-soft">{Math.max(0, min - val.trim().length)} more characters to save this answer</span>}
    </label>
  );
}

/** Returns true when every listed text answer is at least `min` chars long. */
export function useTextsComplete(keys: string[], min = 12) {
  return useGame((s) => !!s.grade && keys.every((k) => String(s.answers[`${s.grade}:${k}`] ?? '').trim().length >= min));
}

/* ------------------------------------------------------------------ Choice option (MCQ-style) */
export function ChoiceOption({
  letter, text, state, onClick, disabled,
}: { letter: string; text: string; state: 'idle' | 'correct' | 'wrong' | 'dim' | 'selected'; onClick?: () => void; disabled?: boolean }) {
  const styles = {
    idle: 'bg-white ring-skippi-100 hover:ring-skippi-400 hover:-translate-y-0.5',
    selected: 'bg-skippi-50 ring-skippi-500',
    correct: 'bg-lime-100 ring-lime-500',
    wrong: 'bg-rasp-100 ring-rasp-500 animate-[wobble_0.4s_ease-in-out]',
    dim: 'bg-white/70 ring-skippi-50 opacity-60',
  }[state];
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cx('flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-2 transition', styles)}
    >
      <span
        className={cx(
          'flex size-9 shrink-0 items-center justify-center rounded-xl font-display text-[17px] font-extrabold',
          state === 'correct' ? 'bg-lime-500 text-white' : state === 'wrong' ? 'bg-rasp-500 text-white' : 'bg-skippi-100 text-skippi-700',
        )}
      >
        {state === 'correct' ? <Check className="size-5" strokeWidth={3} /> : state === 'wrong' ? <X className="size-5" strokeWidth={3} /> : letter}
      </span>
      <span className="text-[15px] font-semibold leading-snug text-ink">{text}</span>
    </button>
  );
}
export const LETTERS = ['A', 'B', 'C', 'D'];

/* ------------------------------------------------------------------ Progress ring */
export function ProgressRing({ value, size = 64, stroke = 8, color = '#2163e0', track = '#d9e8ff', children }: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(1, value))) }}
          transition={{ type: 'spring', stiffness: 60, damping: 16 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Badge medal */
export function Medal({ name, earned, color = '#ffa514' }: { name: string; earned: boolean; color?: string }) {
  return (
    <div className={cx('flex flex-col items-center gap-1.5 text-center', !earned && 'opacity-40 grayscale')}>
      <div className="relative flex size-14 items-center justify-center rounded-full shadow-[var(--shadow-pop-sm)]" style={{ background: `conic-gradient(from 200deg, ${color}, #fff6, ${color})` }}>
        <div className="flex size-11 items-center justify-center rounded-full bg-white">
          <TrophyPopIcon className="size-6" style={{ color }} strokeWidth={2.2} />
        </div>
      </div>
      <span className="font-display text-[12px] font-bold leading-tight text-ink">{name}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ Done stamp */
export function DoneStamp({ show, label = 'Completed' }: { show: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 1.6, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: -4 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-2 rounded-2xl bg-lime-500 px-4 py-2 font-display text-[15px] font-extrabold text-white shadow-[0_4px_0_0_#467510]"
        >
          <Check className="size-5" strokeWidth={3.2} /> {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ Grade switcher pill (mentor view) */
export function GradeTag({ label }: { label: string }) {
  return <span className="inline-flex items-center rounded-full bg-mango-100 px-2.5 py-1 font-display text-[12px] font-extrabold text-mango-600">{label}</span>;
}
