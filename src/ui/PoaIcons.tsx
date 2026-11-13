import type { CSSProperties } from 'react';

/* Custom icon set drawn for the Skippi POA (ice pops, shark fins, canvases…).
   Two-tone: `currentColor` outline + soft fill, rounded caps to match the art. */
type P = { className?: string; style?: CSSProperties; strokeWidth?: number; fill?: string };
const base = (p: P) => ({
  className: p.className,
  style: p.style,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: p.strokeWidth ?? 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});
const soft = 'currentColor';

export const IcePopIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="8" y="2.5" width="8" height="14" rx="3.5" fill={soft} fillOpacity={0.2} />
    <path d="M10 5.5v7" opacity={0.7} />
    <path d="M12 16.5v5" />
    <path d="M8.2 4.2l1-.9 1 .9 1-.9 1 .9 1-.9 1 .9 1-.9" opacity={0.6} />
  </svg>
);

export const SunPopIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4.2" fill={soft} fillOpacity={0.25} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <path key={a} d="M12 3.2v2.3" transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);

export const SharkFinIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 17c3-1 4-8 11-12-1 4-1 8 2 12" fill={soft} fillOpacity={0.2} />
    <path d="M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
  </svg>
);

export const CanvasGridIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="3" fill={soft} fillOpacity={0.12} />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    <rect x="15.5" y="15.5" width="5" height="5" rx="1" fill={soft} fillOpacity={0.45} stroke="none" />
  </svg>
);

export const TrailFlagIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 20c4-2 6 1 9-1s5-4 9-3" />
    <path d="M7 18V5" />
    <path d="M7 5h8l-2 2.5L15 10H7" fill={soft} fillOpacity={0.25} />
    <circle cx="17" cy="16" r="1.4" fill={soft} />
  </svg>
);

export const RevenueTowerIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 21h18" />
    <rect x="4" y="15" width="3.2" height="6" rx="1" fill={soft} fillOpacity={0.25} />
    <rect x="8.8" y="8" width="3.2" height="13" rx="1" fill={soft} fillOpacity={0.25} />
    <rect x="13.6" y="5" width="3.2" height="16" rx="1" fill={soft} fillOpacity={0.25} />
    <rect x="18.4" y="12" width="2.6" height="9" rx="1" fill={soft} fillOpacity={0.5} />
  </svg>
);

export const MegaphonePopIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 10v4l3 .5L16 19V5L6 9.5z" fill={soft} fillOpacity={0.2} />
    <path d="M6 14.5l1.2 4.5h2.3l-.8-4" />
    <path d="M19 9.5c1 .8 1 4.2 0 5" />
  </svg>
);

export const VersusIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="5" height="12" rx="2.2" fill={soft} fillOpacity={0.25} />
    <circle cx="18" cy="9" r="3" fill={soft} fillOpacity={0.25} />
    <path d="M16 12l2 8 2-8" />
    <path d="M10.5 9.5l3 5M13.5 9.5l-3 5" />
  </svg>
);

export const NewsScreenIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="13" rx="2.5" fill={soft} fillOpacity={0.15} />
    <path d="M7 9l3 3 3-2 4 3" />
    <path d="M9 21h6M12 17v4" />
  </svg>
);

export const ForkSignIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 22V3" />
    <path d="M12 5h7l2 2-2 2h-7" fill={soft} fillOpacity={0.25} />
    <path d="M12 11H5l-2 2 2 2h7" fill={soft} fillOpacity={0.25} />
  </svg>
);

export const LanternIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2v2" />
    <path d="M9 4h6l1 2H8z" />
    <rect x="7.5" y="6" width="9" height="11" rx="4.5" fill={soft} fillOpacity={0.3} />
    <path d="M9 19h6l-1 2h-4z" />
    <path d="M12 9v5" opacity={0.6} />
  </svg>
);

export const TeamTableIcon = (p: P) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="14" rx="7" ry="3" fill={soft} fillOpacity={0.2} />
    <circle cx="12" cy="5" r="2" />
    <circle cx="4" cy="9" r="2" />
    <circle cx="20" cy="9" r="2" />
    <path d="M12 17v4M8 21h8" />
  </svg>
);

export const PitchBoardIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="12" rx="2" fill={soft} fillOpacity={0.15} />
    <path d="M7 11l3-3 2 2 4-4" />
    <path d="M12 15v3M8 21l4-3 4 3" />
  </svg>
);

export const TrophyPopIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" fill={soft} fillOpacity={0.25} />
    <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
    <path d="M12 14v3M8 21h8M9 17h6v4H9z" />
  </svg>
);

export const RooIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 3c-1 2-1 4 0 5M12 3c1 2 0 4-1 5" />
    <circle cx="10.5" cy="10" r="3.2" fill={soft} fillOpacity={0.2} />
    <path d="M9 13c-2 2-2 6 1 8h5c1-2 0-4-2-5" fill={soft} fillOpacity={0.2} />
    <path d="M15 19c3 0 5-1 6-3" />
  </svg>
);

export const MusicOnIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6.5" cy="18" r="2.6" fill={soft} fillOpacity={0.3} />
    <circle cx="17.5" cy="16" r="2.6" fill={soft} fillOpacity={0.3} />
  </svg>
);

export const MusicOffIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18V5l11-2v13" opacity={0.45} />
    <circle cx="6.5" cy="18" r="2.6" opacity={0.45} />
    <circle cx="17.5" cy="16" r="2.6" opacity={0.45} />
    <path d="M3 3l18 18" />
  </svg>
);

export const SECTION_POA_ICONS = {
  Sun: SunPopIcon,
  Clapperboard: SharkFinIcon,
  LayoutGrid: CanvasGridIcon,
  Milestone: TrailFlagIcon,
  ChartColumnBig: RevenueTowerIcon,
  Megaphone: MegaphonePopIcon,
  Swords: VersusIcon,
  Newspaper: NewsScreenIcon,
  Signpost: ForkSignIcon,
  Lightbulb: LanternIcon,
  UsersRound: TeamTableIcon,
  Presentation: PitchBoardIcon,
  Trophy: TrophyPopIcon,
};
