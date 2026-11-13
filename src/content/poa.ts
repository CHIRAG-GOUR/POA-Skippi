/**
 * SKIPPI ICE POPS — POA CONTENT (single source of truth)
 *
 * Every string in this file is copied verbatim from
 * "Case study POA's Seniors.docx". Do not paraphrase, shorten or add facts here.
 * Presentation components read from this module only.
 */

export type GradeBand = 'g45' | 'g67' | 'g89';

export const GRADE_BANDS: { id: GradeBand; label: string; short: string }[] = [
  { id: 'g45', label: 'Grades 4–5', short: '4–5' },
  { id: 'g67', label: 'Grades 6–7', short: '6–7' },
  { id: 'g89', label: 'Grades 8–9', short: '8–9' },
];

export const gradeLabel = (g: GradeBand) => GRADE_BANDS.find((b) => b.id === g)!.label;

export type PerGrade<T> = Record<GradeBand, T>;

export interface Link {
  label: string;
  url: string;
}

export interface MCQ {
  q: string;
  options: string[]; // in original A–D order
  answer: number; // index into options
  answerText: string; // verbatim "Answer: ..." line
}

// ---------------------------------------------------------------------------
// TITLE BLOCK
// ---------------------------------------------------------------------------
export const META = {
  title: 'SKIPPI ICE POPS',
  question: 'Can You Turn Childhood Nostalgia into a Billion-Rupee Business?',
  caseVideo: { label: 'Case video', url: 'https://vimeo.com/1119675619?fl=pl&fe=cm', vimeoId: '1119675619' },
  grades: 'Grades: 4–9',
  format: 'Format: Shark Tank Case Study | Think–Analyse–Create–Pitch',
  duration: 'Suggested Duration: 2–3 sessions (40–45 minutes each)',
};

// ---------------------------------------------------------------------------
// 1. INTRODUCTION: THE STORY BEHIND SKIPPI
// ---------------------------------------------------------------------------
export const INTRO = {
  heading: '1. INTRODUCTION: THE STORY BEHIND SKIPPI',
  image: {
    src: '/poa/founders-ravi-anuja-kabra.png',
    alt: 'Skippi founders Ravi and Anuja Kabra in front of the Skippi Ice Pops logo',
    referenceLabel: 'Reference link for the picture :',
    referenceUrl: 'https://skippi.in/',
  },
  story: [
    'What if something you loved as a child could become the next big business idea?',
    'Think about the colourful ice pops, chuskis and frozen treats you enjoyed during summer holidays. They were affordable, refreshing and easily available at neighbourhood shops. But were they always made and stored hygienically?',
    'Ravi and Anuja Kabra identified an opportunity in this familiar childhood treat. They wanted to bring back the joy of ice pops in a more hygienic, branded and modern form.',
    'They founded Skippi Ice Pops in Hyderabad in 2021. The brand introduced ready-to-freeze ice pops made using RO water, natural colours and flavours, without artificial preservatives. Its products could be stored at room temperature before freezing, helping reduce dependence on conventional frozen-product transportation.',
  ],
  overviewHeading: 'Company Overview',
  overview: [
    { k: 'Company', v: 'Skippi Ice Pops' },
    { k: 'Founders', v: 'Ravi Kabra and Anuja Kabra' },
    { k: 'Founded', v: '2021' },
    { k: 'Headquarters', v: 'Hyderabad, Telangana' },
    { k: 'Industry', v: 'Food & Beverage / FMCG' },
    { k: 'Product', v: 'Ready-to-freeze ice pops' },
    { k: 'Main customers', v: 'Children, families and young consumers' },
    { k: 'Key selling point', v: 'Nostalgia combined with hygiene and convenience' },
  ],
  vision: 'To build a trusted ice-pop brand that brings a familiar childhood treat to modern consumers.',
  mission: 'To offer refreshing, enjoyable and hygienically prepared ice pops while building a strong and accessible brand.',
  objective:
    'To understand how Skippi transformed an ordinary, familiar product into a branded business and how it can build a sustainable, profitable and scalable business.',
  problemStatementsHeading: 'Problem Statements by Grade',
  problemStatements: {
    g45: {
      title: 'Grades 4–5 – The Fun Treat Challenge',
      text: 'How can you turn a simple frozen treat into a fun, colourful and hygienic product that children would love to buy?',
    },
    g67: {
      title: 'Grades 6–7 – The Brand-Building Challenge',
      text: 'How can you make Skippi stand out from local ice gola sellers and other frozen treats while attracting both children and parents?',
    },
    g89: {
      title: 'Grades 8–9 – The Billion-Rupee Business Challenge',
      text: 'How can Skippi strengthen its distribution, customer loyalty and profitability while competing with established food brands and managing seasonal demand?',
    },
  } as PerGrade<{ title: string; text: string }>,
};

// ---------------------------------------------------------------------------
// 2. 360° OF THE CASE
// ---------------------------------------------------------------------------
export const CASE360 = {
  heading: '2. 360° OF THE CASE',
  watchTitle: 'Watch the Shark Tank India Pitch',
  reference: {
    label: 'Skippi Ice Pops – Shark Tank India Season 1, Episode 6',
    url: 'https://sharktankindia.com/pitches/skippiicepops',
  },
  observeIntro: 'Ask students to observe:',
  observe: [
    'How did the founders introduce an ordinary product as a business opportunity?',
    'What made the Sharks interested?',
    "How did the founders explain their product's uniqueness?",
    'What questions did the Sharks ask before investing?',
  ],
  mcqHeading: 'Quick Knowledge Check – MCQs',
  mcqs: {
    g45: [
      { q: 'What does Skippi primarily sell?', options: ['Chocolates', 'Ice Pops', 'Biscuits', 'Ice Cream'], answer: 1, answerText: 'Answer: B. Ice Pops' },
      { q: 'What familiar Indian treat inspired the product?', options: ['Chuski', 'Jalebi', 'Ladoo', 'Kulfi'], answer: 0, answerText: 'Answer: A. Chuski' },
      { q: 'What do customers do before enjoying Skippi Ice Pops?', options: ['Bake them', 'Fry them', 'Freeze them', 'Boil them'], answer: 2, answerText: 'Answer: C. Freeze them' },
    ],
    g67: [
      { q: 'Who founded Skippi Ice Pops?', options: ['Ravi and Anuja Kabra', 'Aman and Namita', 'Vineeta and Anupam', 'Two college students'], answer: 0, answerText: 'Answer: A. Ravi and Anuja Kabra' },
      { q: 'Where is Skippi based?', options: ['Jaipur', 'Mumbai', 'Hyderabad', 'Bengaluru'], answer: 2, answerText: 'Answer: C. Hyderabad' },
      {
        q: 'What was one major difference between Skippi and traditional unbranded ice pops?',
        options: ['It was sold only in restaurants', 'It focused on hygiene and a branded product', 'It was a hot beverage', 'It was available only during winter'],
        answer: 1,
        answerText: 'Answer: B. It focused on hygiene and a branded product',
      },
    ],
    g89: [
      { q: "What was Skippi's original ask on Shark Tank India?", options: ['₹25 lakh for 10%', '₹45 lakh for 5%', '₹1 crore for 10%', '₹50 lakh for 15%'], answer: 1, answerText: 'Answer: B. ₹45 lakh for 5%' },
      { q: 'What deal did the founders accept?', options: ['₹50 lakh for 10%', '₹75 lakh for 5%', '₹1 crore for 15%', '₹2 crore for 20%'], answer: 2, answerText: 'Answer: C. ₹1 crore for 15%' },
      {
        q: "What was a major advantage of Skippi's product and supply approach?",
        options: ['It needed no manufacturing', 'It could be transported before freezing', 'It was available only in one city', 'It required refrigerated transportation at every stage'],
        answer: 1,
        answerText: 'Answer: B. It could be transported before freezing',
      },
    ],
  } as PerGrade<MCQ[]>,
};

// ---------------------------------------------------------------------------
// 3. BUSINESS MODEL CANVAS + SWOT + BRAINSTORMING
// ---------------------------------------------------------------------------
export const BMC = {
  heading: '3. BUSINESS MODEL CANVAS',
  columns: ['Element', "Skippi's Business Model"],
  elements: [
    { id: 'cs', element: 'Customer Segments', text: 'Children, parents, families, retail customers and distributors' },
    { id: 'vp', element: 'Value Proposition', text: 'A familiar frozen treat presented as a hygienic, branded and convenient product' },
    { id: 'ch', element: 'Channels', text: 'Kirana stores, supermarkets, distributors, website, e-commerce and quick-commerce platforms' },
    { id: 'cr', element: 'Customer Relationships', text: 'Brand engagement, online presence, product experience and repeat purchases' },
    { id: 'rs', element: 'Revenue Streams', text: 'Ice-pop sales, product packs, retail distribution and other product categories' },
    { id: 'kr', element: 'Key Resources', text: 'Brand, manufacturing facilities, product technology, recipes and distribution network' },
    { id: 'ka', element: 'Key Activities', text: 'Product development, manufacturing, quality control, marketing and distribution' },
    { id: 'kp', element: 'Key Partners', text: 'Retailers, distributors, super stockists, online platforms and suppliers' },
    { id: 'cost', element: 'Cost Structure', text: 'Ingredients, packaging, manufacturing, salaries, marketing, logistics and distribution' },
  ],
};

export type SwotKey = 'S' | 'W' | 'O' | 'T';
export const SWOT = {
  heading: 'SWOT ANALYSIS',
  quadrants: [
    {
      key: 'S' as SwotKey,
      title: 'Strengths',
      points: [
        'Strong childhood nostalgia and emotional connection.',
        'Distinctive focus on hygiene and product quality.',
        'Simple, recognisable and easy-to-understand product.',
        'Strong visibility after Shark Tank India.',
      ],
    },
    {
      key: 'W' as SwotKey,
      title: 'Weaknesses',
      points: [
        'Demand can be seasonal and weather-dependent.',
        'The product needs customers to freeze it before consumption.',
        'Brand awareness may vary across cities and markets.',
        'Maintaining quality and consistent distribution while expanding can be challenging.',
      ],
    },
    {
      key: 'O' as SwotKey,
      title: 'Opportunities',
      points: [
        'Expand into more Indian cities and international markets.',
        'Introduce new flavours, pack sizes and product variations.',
        'Build partnerships with schools, events, cafés and retailers.',
        'Use quick-commerce and digital marketing to reach more customers.',
      ],
    },
    {
      key: 'T' as SwotKey,
      title: 'Threats',
      points: [
        'Competition from local ice gola sellers and established frozen dessert brands.',
        'Rising ingredient, packaging and distribution costs.',
        'Changing customer preferences and health concerns around sugary treats.',
        'Seasonal demand and operational challenges during expansion.',
      ],
    },
  ],
  brainstormHeading: 'Brainstorming Questions',
  brainstorm: {
    g45: ['If you could invent a new Skippi flavour, what would it be?', 'How would you make the packaging attractive to children?'],
    g67: ['How can Skippi compete with local ice gola sellers?', 'What would make parents trust your product more than an ordinary ice pop?'],
    g89: ['How can Skippi reduce its dependence on seasonal sales?', 'What strategies can improve profitability without increasing the selling price too much?'],
  } as PerGrade<string[]>,
};

// ---------------------------------------------------------------------------
// 4. MILESTONE TIMELINE
// ---------------------------------------------------------------------------
export const TIMELINE = {
  heading: "4. MILESTONE TIMELINE – SKIPPI'S JOURNEY",
  columns: ['Year', 'Milestone'],
  milestones: [
    { year: '2019', text: 'The founders returned to India after gaining professional experience overseas.' },
    { year: '2020', text: 'Early production efforts faced setbacks, including losses and disruption.' },
    { year: '2021', text: 'Skippi was launched as a branded ice-pop business in Hyderabad.' },
    { year: 'December 2021', text: 'The founders appeared on Shark Tank India Season 1.' },
    { year: '2021–22', text: 'Skippi received an investment offer from all five Sharks: ₹1 crore for 15% equity.' },
    { year: '2022', text: 'The company reported a major increase in sales following its television appearance and expanded its distribution network.' },
    { year: '2022', text: 'Skippi introduced freezer bikes as another way to sell its products.' },
    { year: '2024', text: 'The company raised ₹10 crore in a Pre-Series A funding round led by Hyderabad Angel Network and Venture Catalysts.' },
    { year: '2025', text: 'Media reports highlighted a fall in FY25 operating revenue, bringing attention to the challenges of sustainable growth.' },
    { year: '2025 onwards', text: 'The company communicated plans to strengthen its business, distribution and international presence.' },
  ],
  mentorNote:
    'Mentor Note: The timeline combines company-reported milestones and published media reports. Explain that business figures and plans can change over time.',
};

// ---------------------------------------------------------------------------
// 5. INFOGRAPHIC – THE NUMBERS BEHIND THE BRAND
// ---------------------------------------------------------------------------
export const NUMBERS = {
  heading: '5. INFOGRAPHIC – THE NUMBERS BEHIND THE BRAND',
  intro: "Use the following data to create a visual story of Skippi's journey.",
  deal: {
    heading: 'A. The Shark Tank Deal',
    columns: ['Particular', 'Amount'],
    rows: [
      { k: 'Original investment ask', v: '₹45 lakh' },
      { k: 'Equity offered initially', v: '5%' },
      { k: 'Final investment', v: '₹1 crore' },
      { k: 'Final equity given', v: '15%' },
      { k: 'Implied post-money valuation', v: 'Approximately ₹6.67 crore' },
    ],
    insight: "Key Insight: Skippi's founders initially asked for ₹45 lakh, but the final deal brought all five Sharks together.",
  },
  growth: {
    heading: 'B. The Growth Story',
    image: { src: '/poa/annual-revenue-chart.png', alt: 'Annual revenue — reported operating revenue, rounded figures in ₹ crore (FY22–FY25)' },
    columns: ['Financial Year', 'Reported Revenue'],
    rows: [
      { fy: 'FY22', label: 'Approximately ₹2.5 crore', crore: 2.5 },
      { fy: 'FY23', label: 'Approximately ₹15.4 crore', crore: 15.4 },
      { fy: 'FY24', label: 'Approximately ₹20 crore', crore: 20 },
      { fy: 'FY25', label: 'Approximately ₹8.2 crore', crore: 8.2 },
    ],
    insight: 'Key Insight: The business experienced a sharp rise after Shark Tank, but later reported a significant revenue decline.',
  },
  funding: {
    heading: 'C. Funding Journey',
    subtitle: "From ₹45 lakh to a national brand – Skippi's journey",
    image: { src: '/poa/skippi-ice-pops-pack.png', alt: 'Skippi Ice Pops pack — 12 pops x 70 ml, 6 flavours (Lemon, Raspberry, Bubble Gum, Orange, Cola and more)' },
    reference: { label: 'Skippi.com', url: 'http://skippi.com' },
    steps: ['Shark Tank India: ₹1 crore for 15% equity.', '2024: ₹10 crore Pre-Series A funding reported by ETRetail.'],
  },
  infographicNote: 'An infographic is to be created from the above data.',
  suggestedHeading: 'Suggested visual elements:',
  suggested: [
    'A Shark Tank deal comparison.',
    'A revenue growth and decline bar chart.',
    'A funding journey timeline.',
    'A question bubble: "Can a business grow fast and still struggle to become profitable?"',
  ],
  questionBubble: 'Can a business grow fast and still struggle to become profitable?',
  mentorNote:
    'Mentor Note: Revenue figures are rounded and based on published reports. The figures are not a measure of profit. Explain the difference between revenue, expenses and profit before discussing the chart.',
};

// ---------------------------------------------------------------------------
// 6. MARKETING & CUSTOMER ENGAGEMENT
// ---------------------------------------------------------------------------
export const MARKETING = {
  heading: '6. MARKETING & CUSTOMER ENGAGEMENT',
  intro: "Skippi's marketing strength comes from combining a familiar childhood memory with a modern brand identity.",
  studyHeading: 'Campaign and Marketing Ideas to Study',
  campaign: {
    title: '1. Skippi – Dive into Delight',
    meta: 'Published 22 May 2022 · By myskippi',
    link: { label: 'Watch the original video on YouTube', url: 'https://www.youtube.com/watch?v=Vhn2OWtfMbE&utm_source=chatgpt.com' },
    youtubeId: 'Vhn2OWtfMbE',
  },
  mentorRefsHeading: 'Useful References for mentors',
  mentorRefs: [
    { label: 'Skippi Official Website', url: 'https://skippi.in/' },
    { label: 'Skippi About Us – Brand Journey', url: 'https://skippi.in/pages/about-us' },
    { label: 'Skippi Distribution Network', url: 'https://skippi.in/pages/distribution' },
  ] as Link[],
  challengeHeading: 'Student Challenge',
  challengeIntro: 'Ask students to create one marketing campaign for Skippi.',
  challengeDecideIntro: 'They must decide:',
  challenge: [
    'Campaign name and tagline.',
    'Target customer.',
    'Platform: Instagram, school event, shop display or outdoor advertising.',
    'One promotional activity.',
    'How the campaign will encourage customers to buy again.',
  ],
  platforms: ['Instagram', 'school event', 'shop display', 'outdoor advertising'],
};

// ---------------------------------------------------------------------------
// 7. COMPETITIVE ANALYSIS – K-MATRIX
// ---------------------------------------------------------------------------
export type KCell = '✔' | '✘' | 'Varies' | 'Local' | '';
export const KMATRIX = {
  heading: '7. COMPETITIVE ANALYSIS – K-MATRIX',
  question: 'Question: Is Skippi competing only with other ice pops, or with every product that satisfies the same craving?',
  competitors: ['Skippi', 'Local Ice Gola / Chuski', 'Branded Ice Cream'],
  rows: [
    { feature: 'Strong childhood nostalgia', cells: ['✔', '✔', '✔'] as KCell[] },
    { feature: 'Branded packaging', cells: ['✔', '', '✔'] as KCell[] },
    { feature: 'Standardised product positioning', cells: ['✔', 'Varies', '✔'] as KCell[] },
    { feature: 'Ready-to-freeze format', cells: ['✔', '✘', '✘'] as KCell[] },
    { feature: 'Wide flavour choices', cells: ['✔', 'Varies', '✔'] as KCell[] },
    { feature: 'Established retail distribution', cells: ['✔', 'Local', '✔'] as KCell[] },
    { feature: 'Requires freezing before consumption', cells: ['✔', 'Varies', '✘'] as KCell[] },
  ],
  mentorNote:
    "Mentor Note: This is a simplified classroom comparison, not a technical product audit. Actual features vary by seller and product. Students should understand that Skippi's competitors include both direct competitors and substitutes.",
  discussionHeading: 'Discussion Questions',
  discussion: [
    'Why would a customer choose Skippi instead of a local ice gola?',
    'Can a local seller compete with a national brand?',
    'What can Skippi offer that a large ice cream brand may not?',
    'How can Skippi create a reason for customers to purchase it repeatedly?',
  ],
};

// ---------------------------------------------------------------------------
// 8. WHAT ACTUALLY HAPPENED?
// ---------------------------------------------------------------------------
export const HAPPENED = {
  heading: '8. WHAT ACTUALLY HAPPENED?',
  momentHeading: 'The Shark Tank Moment',
  appeared: 'Skippi appeared on Shark Tank India Season 1, Episode 6.',
  episode: {
    label: "'Skippi Ice Pops' को कैसे मिली Show की पहली 'All-Sharks Deal'? | Shark Tank India | Full Episode",
    url: 'https://youtu.be/NQWqn2ACIR4?si=NNGj_bn8t0oKTASt',
    youtubeId: 'NQWqn2ACIR4',
  },
  ask: 'The founders asked for ₹45 lakh in exchange for 5% equity, valuing the business at ₹9 crore before investment.',
  sharksIntro: 'The pitch attracted all five Sharks:',
  sharks: ['Ashneer Grover', 'Aman Gupta', 'Anupam Mittal', 'Namita Thapar', 'Vineeta Singh'],
  accepted: 'The founders eventually accepted a combined offer of ₹1 crore for 15% equity.',
  known: 'Skippi became widely known for receiving an investment commitment from all five Sharks.',
  afterHeading: 'What Happened After the Show?',
  after: [
    'The brand received considerable attention and reported a sharp rise in revenue after the show. It expanded its retail presence, explored new sales channels and introduced freezer bikes.',
    'In 2024, the company raised ₹10 crore in a Pre-Series A funding round.',
    "However, its story also highlights the difficulty of sustaining rapid growth. Inc42 reported that Skippi's operating revenue fell from approximately ₹20 crore in FY24 to ₹8.2 crore in FY25.",
  ],
  bigQuestion: 'This raises an important question: If a business has a great product and strong publicity, why can it still struggle?',
  investigateIntro: 'Possible areas to investigate:',
  investigate: [
    'Demand forecasting.',
    'Seasonal sales.',
    'Distribution and inventory management.',
    'Marketing expenses.',
    'Profitability and cash flow.',
    'Expansion without sufficient operational planning.',
  ],
  refsHeading: 'Reference Links',
  refs: [
    { label: "Skippi's Shark Tank Pitch Record", url: 'https://sharktankindia.com/pitches/skippiicepops' },
    { label: "Inc42: Skippi's Business Challenges", url: 'https://inc42.com/features/ice-popsicle-brand-skippi-hits-rough-patch-after-shark-tank-boom/' },
    {
      label: 'ETRetail: Skippi Raises ₹10 Crore',
      url: 'https://retail.economictimes.indiatimes.com/news/food-entertainment/personal-care-pet-supplies-liquor/skippi-raises-rs-10-cr-pre-series-a-aims-to-cross-rs-70-cr-revenue-in-fy25/110493336',
    },
  ] as Link[],
  mentorNote:
    'Mentor Note: Present the revenue decline as a learning opportunity, not as a judgement about the founders. Students should distinguish between reported financial performance, company plans and their own recommendations.',
};

// ---------------------------------------------------------------------------
// 9. INTERACTIVE CASE CHALLENGE – WHAT WOULD YOU DO?
// ---------------------------------------------------------------------------
export interface Scenario {
  q: string;
  options: string[];
  answer: number;
  answerText: string;
  /** presentation-only: which 3D situation to stage */
  stage: 'customer' | 'packaging' | 'winter' | 'parent' | 'shopkeeper' | 'competitor' | 'online' | 'repeat' | 'school' | 'city' | 'inventory' | 'losses' | 'global' | 'distributor' | 'billion';
}

export const CASE_CHALLENGE = {
  heading: '9. INTERACTIVE CASE CHALLENGE – WHAT WOULD YOU DO?',
  scenarios: {
    g45: [
      { stage: 'customer', q: '1. Your customers love mango flavour, but you want to introduce something new. What will you do?', options: ['Stop selling mango immediately', 'Ask customers which flavours they want', 'Copy another brand', 'Stop making ice pops'], answer: 1, answerText: 'Answer: B' },
      { stage: 'packaging', q: '2. Children say the packaging is boring. What is the best solution?', options: ['Use more attractive colours and designs', 'Increase the price', 'Remove the packaging', 'Reduce the quantity'], answer: 0, answerText: 'Answer: A' },
      { stage: 'winter', q: '3. Your ice pops are selling slowly in winter. What can you do?', options: ['Close the business', 'Ignore customers', 'Introduce winter-friendly promotions or other products', 'Stop advertising'], answer: 2, answerText: 'Answer: C' },
      { stage: 'parent', q: '4. Parents are worried about hygiene. What should your brand do?', options: ['Avoid answering questions', 'Explain ingredients and quality checks clearly', 'Change the brand name', 'Sell only to children'], answer: 1, answerText: 'Answer: B' },
      { stage: 'shopkeeper', q: '5. A shopkeeper does not want to stock your product. What would you do?', options: ["Understand the shopkeeper's concern and offer a suitable trial", 'Argue with them', 'Stop selling everywhere', 'Increase the price'], answer: 0, answerText: 'Answer: A' },
    ],
    g67: [
      { stage: 'competitor', q: '1. A competitor launches the same flavour at a lower price. What should Skippi do?', options: ['Immediately reduce all prices', 'Understand customer preferences and strengthen its value', 'Stop selling that flavour', "Copy the competitor's packaging"], answer: 1, answerText: 'Answer: B' },
      { stage: 'online', q: '2. Your product is popular online but unavailable in many local shops. What is the priority?', options: ['Expand distribution and improve product availability', 'Spend only on celebrity advertising', 'Stop online sales', 'Increase the number of flavours'], answer: 0, answerText: 'Answer: A' },
      { stage: 'repeat', q: '3. Customers purchase once but do not return. What should you investigate?', options: ['Only the logo', 'Product experience, taste, price and customer feedback', "The founder's clothes", 'The office location'], answer: 1, answerText: 'Answer: B' },
      { stage: 'school', q: '4. A school wants to partner with Skippi for a summer event. What should the company do first?', options: ['Accept without checking anything', "Understand the school's requirements and product-safety expectations", 'Double the price', 'Change the product completely'], answer: 1, answerText: 'Answer: B' },
      { stage: 'city', q: '5. Your company is expanding to another city. What is most important?', options: ['Open as many outlets as possible immediately', 'Understand local demand, distribution and storage requirements', 'Spend all money on advertisements', 'Introduce ten new products'], answer: 1, answerText: 'Answer: B' },
    ],
    g89: [
      { stage: 'inventory', q: '1. Sales increase rapidly after a marketing campaign, but unsold inventory also increases. What should management do?', options: ['Increase production further', 'Improve demand forecasting and inventory planning', 'Ignore inventory', 'Stop marketing permanently'], answer: 1, answerText: 'Answer: B' },
      { stage: 'losses', q: '2. Revenue is growing, but the company is still making losses. What should the founders examine first?', options: ['Only social media followers', 'Costs, margins, pricing and cash flow', 'The colour of the packaging', 'The number of office celebrations'], answer: 1, answerText: 'Answer: B' },
      { stage: 'global', q: '3. Skippi wants to expand internationally. What should it do first?', options: ['Send products everywhere', 'Research local regulations, consumer preferences and distribution partners', 'Use the same marketing strategy in every country without changes', 'Stop selling in India'], answer: 1, answerText: 'Answer: B' },
      { stage: 'distributor', q: '4. A distributor is unable to sell the quantity supplied. What is the best response?', options: ['Supply even more products', 'Review demand, territory planning and distributor support', 'Remove the distributor immediately', 'Ignore the problem'], answer: 1, answerText: 'Answer: B' },
      { stage: 'billion', q: '5. Skippi wants to become a billion-rupee business. Which strategy is most sustainable?', options: ['Focus only on publicity', 'Balance product innovation, profitability, distribution and customer loyalty', 'Expand without financial planning', 'Increase prices every month'], answer: 1, answerText: 'Answer: B' },
    ],
  } as PerGrade<Scenario[]>,
};

// ---------------------------------------------------------------------------
// 10. FINAL REFLECTION & LEARNING OUTCOMES
// ---------------------------------------------------------------------------
export const REFLECTION = {
  heading: '10. FINAL REFLECTION & LEARNING OUTCOMES',
  intro: 'By the end of the case study, students should understand:',
  outcomes: [
    { title: 'Opportunity Recognition', text: 'A simple everyday product can become a business when a market gap is identified.' },
    { title: 'Branding & Customer Psychology', text: 'Nostalgia, packaging and trust can influence buying decisions.' },
    { title: 'Business Scalability', text: 'Growing a business requires strong distribution, inventory planning and operational management.' },
    { title: 'Financial Sustainability', text: 'High sales and investment do not automatically mean a company is profitable.' },
  ],
  questionsHeading: 'Reflection Questions',
  questions: [
    'Can nostalgia alone build a successful business?',
    'What matters more: getting customers once or making them return?',
    'Why is distribution important for a product like Skippi?',
    'What would you do differently if you were the founder?',
  ],
};

// ---------------------------------------------------------------------------
// 11. REBUTTAL ROUND – BUILD YOUR OWN SKIPPI
// ---------------------------------------------------------------------------
export type RoleId = 'pd' | 'mm' | 'om' | 'se' | 'is';
export const ROLES: { id: RoleId; role: string; responsibility: string }[] = [
  { id: 'pd', role: 'Product Designer', responsibility: 'Develops new flavours, packaging and product improvements.' },
  { id: 'mm', role: 'Marketing Manager', responsibility: 'Creates brand identity, campaigns and customer engagement.' },
  { id: 'om', role: 'Operations Manager', responsibility: 'Manages manufacturing, quality, inventory and distribution.' },
  { id: 'se', role: 'Sales Executive', responsibility: 'Builds retail partnerships and increases product sales.' },
  { id: 'is', role: 'Innovation Strategist', responsibility: 'Finds new opportunities and long-term growth strategies.' },
];

export const REBUTTAL = {
  heading: '11. REBUTTAL ROUND – BUILD YOUR OWN SKIPPI',
  activity: 'Activity: Students work in teams and defend their business decisions against questions from other teams.',
  rolesHeading: 'Team Roles',
  rolesColumns: ['Role', 'Responsibility'],
  problemsHeading: 'Rebuttal Problem Statements',
  /** POA lists problem statements for three roles per grade band. */
  problems: {
    g45: [
      { role: 'pd' as RoleId, title: 'Product Designer – Create a New Favourite', text: 'Design a new ice-pop flavour that children would love.' },
      { role: 'mm' as RoleId, title: 'Marketing Manager – Make It Exciting', text: 'Create a catchy campaign that makes Skippi the most talked-about summer treat.' },
      { role: 'om' as RoleId, title: 'Operations Manager – Keep It Safe', text: 'How will you make sure every ice pop is prepared and packed hygienically?' },
    ],
    g67: [
      { role: 'pd' as RoleId, title: 'Product Designer – Stand Out', text: 'Develop a new product variation that makes Skippi different from local ice pops.' },
      { role: 'mm' as RoleId, title: 'Marketing Manager – Win Customer Trust', text: 'Design a campaign that convinces parents to choose Skippi.' },
      { role: 'om' as RoleId, title: 'Operations Manager – Expand Smartly', text: 'How will you make Skippi available in more cities without compromising product quality?' },
    ],
    g89: [
      { role: 'pd' as RoleId, title: 'Product Designer – Innovate for Growth', text: 'Develop a product strategy that attracts new customers and encourages repeat purchases.' },
      { role: 'mm' as RoleId, title: 'Marketing Manager – Build Brand Loyalty', text: 'Create a long-term marketing strategy that reduces dependence on one-time purchases and seasonal demand.' },
      { role: 'om' as RoleId, title: 'Operations Manager – Improve Profitability', text: 'Propose a plan to reduce waste, improve inventory management and strengthen distribution.' },
    ],
  } as PerGrade<{ role: RoleId; title: string; text: string }[]>,
};

// ---------------------------------------------------------------------------
// 12. PITCH PRESENTATION – THE SHARK TANK CHALLENGE
// ---------------------------------------------------------------------------
export const PITCH = {
  heading: '12. PITCH PRESENTATION – THE SHARK TANK CHALLENGE',
  statementsHeading: 'Final Pitch Problem Statements',
  statements: {
    g45: {
      title: 'Grades 4–5 – The Next Favourite Ice Pop',
      text: 'You are the founders of a new ice-pop brand. Create a fun, colourful and hygienic product that children would love. Convince the Sharks why your product deserves to be on the market.',
    },
    g67: {
      title: 'Grades 6–7 – The Next Big Ice-Pop Brand',
      text: 'You have been hired to grow Skippi. Your challenge is to compete with local ice gola sellers and other frozen treats. Create a strategy that improves customer trust, brand visibility and sales.',
    },
    g89: {
      title: 'Grades 8–9 – Building a Billion-Rupee Business',
      text: "You are Skippi's new leadership team. Your task is to build a sustainable business that can grow across India and international markets. Present a strategy covering innovation, marketing, distribution, financial planning and profitability.",
    },
  } as PerGrade<{ title: string; text: string }>,
  questionsHeading: 'Role-Specific Pitch Questions',
  questionsIntro: 'Each student must answer questions related to their assigned role.',
  questions: {
    pd: {
      heading: 'A. PRODUCT DESIGNER',
      g45: ['What new flavour would you introduce and why?', 'What would make your ice pop look different from others?', 'How would you make the packaging attractive and easy to use?', 'How would you collect feedback from children?'],
      g67: ['What new product variation can help Skippi stand out?', 'How will you balance taste, quality and affordability?', 'How would you design a product for customers who prefer less sugar?', 'How will you test whether customers actually like your new product?'],
      g89: ['How can product innovation help Skippi increase repeat purchases?', 'How would you create products for different age groups and customer segments?', 'What product features could help Skippi enter international markets?', 'How will you ensure innovation does not increase production costs excessively?'],
    },
    mm: {
      heading: 'B. MARKETING MANAGER',
      g45: ['What would be your brand name and tagline?', 'Which colours would you use in your advertisements?', 'How would you convince your friends to try your product?', 'What promotional activity would you organise during summer?'],
      g67: ['How would you convince parents that your product is a better choice?', 'Which social media platform would you use to promote Skippi and why?', 'How would you compete with local ice gola sellers?', 'What campaign could encourage customers to buy again?'],
      g89: ['How would you build long-term brand loyalty?', 'How would you market Skippi differently in Tier 1 and Tier 2 cities?', 'How can digital marketing and quick-commerce platforms improve customer acquisition?', 'How would you measure whether a marketing campaign is profitable?'],
    },
    om: {
      heading: 'C. OPERATIONS MANAGER',
      g45: ['How will you make sure your ice pops are clean and safe?', 'What will you do if a flavour runs out?', 'How will you pack the product so it does not leak?', 'How will you make sure shops receive products on time?'],
      g67: ['How would you manage stock during peak summer demand?', 'What steps would you take to maintain consistent quality?', 'How would you ensure products reach smaller cities?', 'What would you do if a distributor cannot sell the stock supplied?'],
      g89: ['How can Skippi improve inventory planning and reduce wastage?', 'How would you manage seasonal demand fluctuations?', 'What operational changes could improve profitability?', 'How would you maintain product quality while expanding into new markets?'],
    },
    se: {
      heading: 'D. SALES EXECUTIVE',
      g45: ['How would you convince a shopkeeper to sell your ice pops?', 'What offer would you give a first-time customer?', 'How would you explain your product in 30 seconds?', 'How would you encourage customers to buy another pack?'],
      g67: ['How would you convince a retailer to give Skippi shelf space?', 'What sales offer could help attract new customers?', 'How would you build relationships with distributors?', 'How would you increase sales during the winter season?'],
      g89: ['Which retail channels should Skippi prioritise for expansion?', 'How would you create a distributor incentive programme?', 'How would you improve sales in markets where brand awareness is low?', 'What sales metrics would you track to measure business performance?'],
    },
    is: {
      heading: 'E. INNOVATION STRATEGIST',
      g45: ['What new idea can make Skippi more exciting?', 'How can Skippi make summer more fun for children?', 'What can the company do when it is not summer?', 'How can you make the product more environmentally responsible?'],
      g67: ['What new market can Skippi explore?', 'How can the company make customers remember its brand?', 'What partnership could help Skippi grow?', 'How can Skippi improve its business without increasing prices?'],
      g89: ['How can Skippi reduce its dependence on seasonal demand?', 'Which new business model could create additional revenue?', 'How would you balance expansion, investment and profitability?', 'What long-term strategy could help Skippi become a billion-rupee brand?'],
    },
  } as Record<RoleId, { heading: string } & PerGrade<string[]>>,
};

// ---------------------------------------------------------------------------
// 13. FINAL SHARK TANK EVALUATION
// ---------------------------------------------------------------------------
export const EVALUATION = {
  heading: '13. FINAL SHARK TANK EVALUATION',
  intro: 'Each team will present a 3–5 minute pitch followed by a Shark Q&A.',
  columns: ['Evaluation Criteria', 'Marks'],
  criteria: [
    { id: 'problem', title: 'Problem Understanding', marks: 5 },
    { id: 'innovation', title: 'Product Innovation', marks: 5 },
    { id: 'business', title: 'Business Model & Financial Understanding', marks: 5 },
    { id: 'marketing', title: 'Marketing & Customer Understanding', marks: 5 },
    { id: 'teamwork', title: 'Teamwork & Collaboration', marks: 5 },
    { id: 'confidence', title: 'Confidence, Communication & Q&A', marks: 5 },
  ],
  total: 30,
  deliverablesHeading: 'Expected Pitch Deliverables',
  deliverablesIntro: 'Each team must present:',
  deliverables: [
    'Brand name, logo and tagline.',
    'Product concept with flavours or variations.',
    'Target customer and customer problem.',
    'Business model and pricing.',
    'Marketing and sales strategy.',
    'Distribution and operations plan.',
    'Basic cost, revenue and profit estimate.',
    'Future growth plan.',
    'A clear investment ask from the Sharks.',
  ],
  closureHeading: 'Strong Closure',
  closure:
    '"A great business does not begin with a complicated idea. Sometimes, it begins with something as simple as a childhood memory. But turning that memory into a successful business requires much more than a great product — it takes innovation, customer understanding, smart decisions and the ability to grow sustainably."',
  finalQuestionHeading: 'Final Question for Students:',
  finalQuestion:
    'If you were given ₹1 crore to build your own ice-pop brand, would you focus on making the tastiest product, creating the strongest brand or building the biggest distribution network? Defend your decision.',
  finalChoices: ['making the tastiest product', 'creating the strongest brand', 'building the biggest distribution network'],
};

// ---------------------------------------------------------------------------
// MENTOR REFERENCE LINKS
// ---------------------------------------------------------------------------
export const MENTOR_LINKS: Link[] = [
  { label: 'Skippi – Official Website', url: 'https://skippi.in/' },
  { label: 'Skippi – About Us and Company Journey', url: 'https://skippi.in/pages/about-us' },
  { label: 'Skippi – Shark Tank India Pitch Record', url: 'https://sharktankindia.com/pitches/skippiicepops' },
  { label: "Inc42 – Skippi's Growth and Business Challenges", url: 'https://inc42.com/features/ice-popsicle-brand-skippi-hits-rough-patch-after-shark-tank-boom/' },
  {
    label: "ETRetail – Skippi's ₹10 Crore Pre-Series A Funding",
    url: 'https://retail.economictimes.indiatimes.com/news/food-entertainment/personal-care-pet-supplies-liquor/skippi-raises-rs-10-cr-pre-series-a-aims-to-cross-rs-70-cr-revenue-in-fy25/110493336',
  },
  { label: 'Skippi – Distribution Network', url: 'https://skippi.in/pages/distribution' },
];
