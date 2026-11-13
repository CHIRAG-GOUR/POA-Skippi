# Skippi POA — Phase 1 Audit (before redevelopment)

## What existed
- **Stack:** Vite 6 + React 19 + TypeScript + Tailwind 4 + React Three Fiber 9 + Drei 10 + Framer Motion + Lucide. Typechecked cleanly. Kept as the base stack.
- **Experience:** one 3D "garden stall" scene. Five scripted customers walk up, the player picks one of two dialogue answers, picks a product, and gets XP. A "Business Hub" modal had four tabs (deal, revenue, K-Matrix, campaign). A final modal showed the evaluation rubric.
- **Source of truth:** `Case study POA's Seniors.docx` (13 sections + mentor links, 3 images, 7 distinct external links).

## POA coverage of the old build
| POA section | Old build |
|---|---|
| 1 Introduction (overview, vision, mission, objective, grade problems) | Missing. Founders mentioned in one tab only |
| 2 Shark Tank, observation questions, 9 MCQs | Missing. No MCQs at all |
| 3 Business Model Canvas, SWOT, brainstorming | Missing |
| 4 Milestone timeline + mentor note | Missing |
| 5 Numbers (deal table, FY22–FY25 revenue, funding) | Partial. Revenue bars only; deal shown as text |
| 6 Marketing, YouTube campaign, student challenge | Partial. 3 dropdowns; no video, no campaign name or repeat-purchase field |
| 7 K-Matrix + discussion | Partial. Comparison only |
| 8 What actually happened, five Sharks, references | Missing |
| 9 Case challenge (15 scenarios) | Missing |
| 10 Learning outcomes + reflection | Missing |
| 11 Rebuttal round, 5 roles, 9 challenges | Missing |
| 12 Pitch statements + 60 role questions | Missing |
| 13 Evaluation (6 × 5 = 30), 9 deliverables, closure | Partial. Rubric showed **fixed 5/5 for every row** (fake score) |
| Mentor reference links | Missing |

## Problems found
1. **Invented facts in `skippiData.ts`**, none of which are in the POA: "cuts freight costs by over 40%", spirulina / beetroot colours, "Real Alphonso Mango Pulp", "FSSAI Certified", "Vitamin C infused", a ₹15 price point, "industrial ice blocks meant for fish storage", "the exact playbook Skippi used to raise ₹10 Cr". **Removed from the new build.**
2. **Fake progress and scoring:** the final modal always displayed 30/30. The campaign "launch" gave XP with no input required.
3. **None of the POA images** (founders photo, revenue chart, ice-pop pack) were used. **None of the POA video links** were embedded or linked.
4. **Visual quality:** capsule-and-box characters, flat box ice pops, camera clipping into characters, emoji used as icons throughout the UI.
5. No grade selection, no section navigation, no persistence, no back-to-top button, and no loading screen.
6. 3D text depended on canvas textures, which was fine. The new build keeps this approach so it works offline.

## Assets available
- `public/poa/founders-ravi-anuja-kabra.png` (POA image 2, ref. https://skippi.in/)
- `public/poa/annual-revenue-chart.png` (POA image 1)
- `public/poa/skippi-ice-pops-pack.png` (POA image 3, ref. http://skippi.com)
- Video and reference URLs are preserved verbatim in `src/content/poa.ts`.
- No GLTF assets existed. All 3D models in the new build are original procedural models.

## Archive
The previous source is archived unchanged in `legacy/garden-sim-src/`.
