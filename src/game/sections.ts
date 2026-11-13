/**
 * Section + activity registry. Presentation metadata only — the educational
 * text lives in content/poa.ts. Every activity here is completed by a real
 * interaction inside its section (see each section's `complete(...)` calls).
 */
export type SectionId =
  | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' | 's10' | 's11' | 's12' | 's13';

export interface ActivityDef {
  id: string;
  title: string;
  objective: string;
}

export interface SectionDef {
  id: SectionId;
  n: number;
  title: string;
  subtitle: string;
  world: string; // name of the 3D place
  color: string; // accent
  colorSoft: string;
  icon: string; // lucide icon name (resolved in ui/icons)
  activities: ActivityDef[];
  badge: { id: string; name: string };
}

export const SECTIONS: SectionDef[] = [
  {
    id: 's1', n: 1, title: 'The Story Behind Skippi', subtitle: 'Introduction', world: 'Summer Park',
    color: '#ffa514', colorSoft: '#fff1d1', icon: 'Sun',
    badge: { id: 'b-s1', name: 'Story Seeker' },
    activities: [
      { id: 's1-story', title: 'The Origin Story', objective: 'Walk through all four story chapters.' },
      { id: 's1-overview', title: 'Company Overview', objective: 'Find all 8 fact pops hidden around the park.' },
      { id: 's1-vmo', title: 'Vision, Mission, Objective', objective: 'Open all three signposts.' },
      { id: 's1-challenge', title: 'Your Grade Challenge', objective: 'Read your challenge and write your first idea.' },
    ],
  },
  {
    id: 's2', n: 2, title: '360° of the Case', subtitle: 'Shark Tank India', world: 'Shark Tank Studio',
    color: '#2163e0', colorSoft: '#d9e8ff', icon: 'Clapperboard',
    badge: { id: 'b-s2', name: 'Pitch Watcher' },
    activities: [
      { id: 's2-observe', title: 'Observe the Pitch', objective: 'Note your observations for all 4 questions.' },
      { id: 's2-quiz', title: 'Quick Knowledge Check', objective: 'Answer all 3 MCQs for your grade.' },
    ],
  },
  {
    id: 's3', n: 3, title: 'Business Model & SWOT', subtitle: 'Strategy Lab', world: 'Strategy Lab',
    color: '#7cc22b', colorSoft: '#ecf9d6', icon: 'LayoutGrid',
    badge: { id: 'b-s3', name: 'Strategy Architect' },
    activities: [
      { id: 's3-bmc', title: 'Build the Canvas', objective: 'Place all 9 business blocks on the right canvas slots.' },
      { id: 's3-swot', title: 'SWOT Sort', objective: 'Send all 16 points to the right SWOT island.' },
      { id: 's3-brainstorm', title: 'Brainstorm', objective: 'Answer both brainstorming questions.' },
    ],
  },
  {
    id: 's4', n: 4, title: 'Milestone Timeline', subtitle: "Skippi's Journey", world: 'Timeline Trail',
    color: '#f056a8', colorSoft: '#ffe6f4', icon: 'Milestone',
    badge: { id: 'b-s4', name: 'Time Traveller' },
    activities: [
      { id: 's4-explore', title: 'Ride the Trail', objective: 'Visit all 10 milestones on the trail.' },
      { id: 's4-order', title: 'Rebuild the Journey', objective: 'Put the shuffled milestones back in order.' },
    ],
  },
  {
    id: 's5', n: 5, title: 'The Numbers Behind the Brand', subtitle: 'Infographic', world: 'Numbers Plaza',
    color: '#f56d14', colorSoft: '#ffe9d9', icon: 'ChartColumnBig',
    badge: { id: 'b-s5', name: 'Number Cruncher' },
    activities: [
      { id: 's5-deal', title: 'The Deal Scale', objective: 'Work out both valuations on the deal scale.' },
      { id: 's5-revenue', title: 'Growth Story', objective: 'Predict each year, then reveal all four revenue towers.' },
      { id: 's5-profit', title: 'Revenue ≠ Profit Lab', objective: 'Solve all three stall-day puzzles.' },
      { id: 's5-funding', title: 'Funding Journey', objective: 'Unlock both funding steps and answer the big question.' },
    ],
  },
  {
    id: 's6', n: 6, title: 'Marketing & Engagement', subtitle: 'Campaign Studio', world: 'Campaign Studio',
    color: '#e2336c', colorSoft: '#ffe0ea', icon: 'Megaphone',
    badge: { id: 'b-s6', name: 'Brand Builder' },
    activities: [
      { id: 's6-study', title: 'Study the Campaign', objective: 'Play the original "Dive into Delight" video and note one idea.' },
      { id: 's6-campaign', title: 'Create Your Campaign', objective: 'Decide all 6 campaign parts and launch it on the billboard.' },
    ],
  },
  {
    id: 's7', n: 7, title: 'Competitive Analysis', subtitle: 'K-Matrix', world: 'K-Matrix Arena',
    color: '#4a8bf5', colorSoft: '#eef5ff', icon: 'Swords',
    badge: { id: 'b-s7', name: 'Market Analyst' },
    activities: [
      { id: 's7-matrix', title: 'Fill the K-Matrix', objective: 'Predict all 21 cells, then check until they all match.' },
      { id: 's7-discuss', title: 'Discussion', objective: 'Answer all 4 discussion questions.' },
    ],
  },
  {
    id: 's8', n: 8, title: 'What Actually Happened?', subtitle: 'The Real Story', world: 'Shark Tank Studio',
    color: '#1a4fc0', colorSoft: '#d9e8ff', icon: 'Newspaper',
    badge: { id: 'b-s8', name: 'Story Detective' },
    activities: [
      { id: 's8-story', title: 'Replay the Story', objective: 'Step through all 6 story scenes.' },
      { id: 's8-investigate', title: 'Investigate', objective: 'Pick your top 3 areas to investigate and explain why.' },
    ],
  },
  {
    id: 's9', n: 9, title: 'What Would You Do?', subtitle: 'Case Challenge', world: 'Market Street',
    color: '#ff8a3d', colorSoft: '#fff1d1', icon: 'Signpost',
    badge: { id: 'b-s9', name: 'Decision Maker' },
    activities: [
      { id: 's9-decisions', title: 'Five Business Situations', objective: 'Make a decision in all 5 situations.' },
    ],
  },
  {
    id: 's10', n: 10, title: 'Reflection & Outcomes', subtitle: 'Learning Garden', world: 'Sunset Garden',
    color: '#9ad94a', colorSoft: '#ecf9d6', icon: 'Lightbulb',
    badge: { id: 'b-s10', name: 'Deep Thinker' },
    activities: [
      { id: 's10-outcomes', title: 'Light the Lanterns', objective: 'Match all 4 learning outcomes to light the lanterns.' },
      { id: 's10-reflect', title: 'Reflection Questions', objective: 'Answer all 4 reflection questions.' },
    ],
  },
  {
    id: 's11', n: 11, title: 'Rebuttal Round', subtitle: 'Build Your Own Skippi', world: 'Team Workshop',
    color: '#7a3522', colorSoft: '#f7e7df', icon: 'UsersRound',
    badge: { id: 'b-s11', name: 'Team Player' },
    activities: [
      { id: 's11-team', title: 'Form Your Team', objective: 'Assign a teammate to all 5 roles.' },
      { id: 's11-challenges', title: 'Role Challenges', objective: 'Write your plan for all 3 rebuttal problems.' },
      { id: 's11-rebuttal', title: 'Defend It', objective: 'Record a question from another team and your defence for each plan.' },
    ],
  },
  {
    id: 's12', n: 12, title: 'Pitch Presentation', subtitle: 'The Shark Tank Challenge', world: 'Pitch Prep Room',
    color: '#2163e0', colorSoft: '#d9e8ff', icon: 'Presentation',
    badge: { id: 'b-s12', name: 'Pitch Ready' },
    activities: [
      { id: 's12-builder', title: 'Pitch Builder', objective: 'Complete all 11 parts of your pitch.' },
      { id: 's12-roles', title: 'Role Questions', objective: 'Answer the 4 questions for all 5 roles.' },
    ],
  },
  {
    id: 's13', n: 13, title: 'Final Shark Tank Evaluation', subtitle: 'Main Stage', world: 'Main Stage',
    color: '#ffa514', colorSoft: '#fff1d1', icon: 'Trophy',
    badge: { id: 'b-s13', name: 'Shark Tank Star' },
    activities: [
      { id: 's13-deliverables', title: 'Deliverables Check', objective: 'Confirm all 9 pitch deliverables.' },
      { id: 's13-pitch', title: 'Present Your Pitch', objective: 'Present for at least 3 minutes on the stage timer.' },
      { id: 's13-score', title: 'Shark Scores', objective: 'Sharks enter marks for all 6 criteria.' },
      { id: 's13-final', title: 'Final Question', objective: 'Choose your focus and defend your decision.' },
    ],
  },
];

export const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<SectionId, SectionDef>;
export const ALL_ACTIVITIES = SECTIONS.flatMap((s) => s.activities.map((a) => ({ ...a, section: s.id })));
export const sectionOfActivity = (id: string) => ALL_ACTIVITIES.find((a) => a.id === id)?.section;

export const SPECIAL_BADGES = [
  { id: 'b-first', name: 'First Pop', desc: 'Completed your first activity' },
  { id: 'b-quiz-ace', name: 'Quiz Ace', desc: 'All three MCQs right on the first try' },
  { id: 'b-sharp', name: 'Sharp Decider', desc: 'All five case decisions right on the first try' },
  { id: 'b-explorer', name: 'Island Explorer', desc: 'Visited every place on Skippi Island' },
  { id: 'b-champion', name: 'Skippi Champion', desc: 'Completed the whole journey' },
];
