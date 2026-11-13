# Skippi Island — 3D Shark Tank Case Study (Grades 4–9)

**Can You Turn Childhood Nostalgia into a Billion-Rupee Business?**

An interactive 3D version of the Skippi Ice Pops POA. Students hop Roo the kangaroo around Skippi Island to 13 places, one for each POA section, and learn by doing.

**Live:** https://poa-skippi.web.app

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in dist/
```

## Deploy (Firebase Hosting, site `poa-skippi` in project `skillizee-products`)
```bash
npm run build && firebase deploy --only hosting:poa-skippi
```

## Teacher deep links
`?g=g45|g67|g89&s=s1…s13` opens a grade group directly at a section. For example, `https://poa-skippi.web.app/?g=g67&s=s9`.
Turn on **Settings → Mentor view** to see every grade group's content and answer keys.

## Where things live
| Path | What |
|---|---|
| `src/content/poa.ts` | **All POA text, verbatim** (the single source of truth) |
| `src/game/sections.ts` | 13 sections and 33 missions (progress counts only real completions) |
| `src/game/store.ts` | Progress, answers and badges (saved in the browser per grade group) |
| `src/sections/S01…S13*.tsx` | Activity panels for each section |
| `src/scenes/*.tsx` | 3D environments (island, park, studio, lab, trail, plaza, etc.) |
| `src/three/Person.tsx` | 3D cartoon characters (toon shading, outlines, painted faces) |
| `public/poa/` | Original POA images |
| `docs/AUDIT.md` | Audit of the previous build |
| `legacy/` | Previous garden simulation, archived unchanged |
