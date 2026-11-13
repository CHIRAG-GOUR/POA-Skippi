import { IcePop, Customer } from '../types/game';

export const SKIPPI_PRODUCTS: IcePop[] = [
  {
    id: 'raspberry',
    name: 'Skippi Raspberry Ripple',
    flavor: 'Raspberry',
    colorHex: '#e11d48',
    glowHex: '#fb7185',
    tagline: 'Bold, tangy summer berry splash',
    benefits: ['100% RO Purified Water', 'Natural Beetroot Colour', 'No Artificial Preservatives'],
    price: 15,
    emoji: '🍓'
  },
  {
    id: 'mango',
    name: 'Skippi Mango Mania',
    flavor: 'Alphonso Mango',
    colorHex: '#eab308',
    glowHex: '#fde047',
    tagline: 'Sweet tropical Alphonso magic',
    benefits: ['Real Alphonso Mango Pulp', 'Rich in Beta-Carotene', 'Naturally Sweetened'],
    price: 15,
    emoji: '🥭'
  },
  {
    id: 'orange',
    name: 'Skippi Orange Burst',
    flavor: 'Zesty Orange',
    colorHex: '#ea580c',
    glowHex: '#fb923c',
    tagline: 'Citrus punch that beats the heat',
    benefits: ['Natural Orange Extract', 'Vitamin C Infused', '100% RO Purified Water'],
    price: 15,
    emoji: '🍊'
  },
  {
    id: 'bubblegum',
    name: 'Skippi Bubblegum Blast',
    flavor: 'Bubblegum Nostalgia',
    colorHex: '#0284c7',
    glowHex: '#38bdf8',
    tagline: 'Electric fun carnival taste',
    benefits: ['Natural Spirulina Blue Colour', 'Zero Synthetic Food Dyes', 'Kid-Safe Sealed Pouch'],
    price: 15,
    emoji: '🫐'
  },
  {
    id: 'lemon',
    name: 'Skippi Lemon Limone',
    flavor: 'Tangy Lemon Mint',
    colorHex: '#65a30d',
    glowHex: '#a3e635',
    tagline: 'Crisp Indian shikanji twist',
    benefits: ['Natural Lemon Juice Concentrate', 'Electrolyte Infused', 'Ultimate Thirst Quencher'],
    price: 15,
    emoji: '🍋'
  },
  {
    id: 'cola',
    name: 'Skippi Classic Cola',
    flavor: 'Sparkling Cola Treat',
    colorHex: '#451a03',
    glowHex: '#b45309',
    tagline: 'Childhood chuski stall favourite',
    benefits: ['Natural Caramel Colour', 'No Harsh Acid Additives', 'Hygienically Packed'],
    price: 15,
    emoji: '🥤'
  },
  {
    id: 'party_pack',
    name: 'Skippi Ready-to-Freeze Box (Pack of 12)',
    flavor: '6 Assorted Summer Flavours',
    colorHex: '#7c3aed',
    glowHex: '#a78bfa',
    tagline: 'Liquid ready-to-freeze — freeze at home!',
    benefits: ['Ambient Storage (No Meltdown in Transit)', 'Saves Cold-Chain Freight Costs', 'FSSAI Certified'],
    price: 150,
    emoji: '📦',
    isPack: true
  }
];

export const CUSTOMER_QUEUE: Customer[] = [
  {
    id: 'cust_1_aarav',
    name: 'Aarav (Grade 4)',
    roleDescription: 'Energetic kid playing football in the garden',
    gradeLevel: 'Grades 4-5',
    characterType: 'boy_aarav',
    appearance: {
      height: 1.15,
      shirtColor: '#2563eb', // royal blue
      pantsColor: '#475569', // slate
      hairColor: '#1e293b',
      hairStyle: 'spiky',
      skinTone: '#f5d0b5',
      accessory: 'cap'
    },
    preferredFlavorId: 'raspberry',
    budget: 30,
    orderQuery: "Phew, it's so sunny! I've been running around the fountain and I'm super thirsty. I want something icy, sweet, and bright red like the chuskis we used to eat on summer holidays!",
    curriculumTopic: 'Opportunity Recognition: Turning Childhood Nostalgia into a Branded Treat',
    dialogueChoices: [
      {
        id: 'c1_a',
        text: "Hey Aarav! Try our Skippi Raspberry Ripple — it gives you that exact nostalgic chuski burst, but made with 100% RO water and natural beetroot colour!",
        isCorrect: true,
        feedback: "Spot on! You connected childhood nostalgia with guaranteed hygiene.",
        satisfactionDelta: 20,
        learningPoint: "Nostalgia builds an instant emotional connection, but modern hygiene earns parent trust."
      },
      {
        id: 'c1_b',
        text: "Just grab a warm cola drink from the supermarket over there.",
        isCorrect: false,
        feedback: "The customer wanted an icy summer treat, not a warm soda!",
        satisfactionDelta: -10,
        learningPoint: "Always match the customer's immediate emotional craving."
      }
    ],
    successReaction: "YUM! This tastes just like old times, but it feels so clean and delicious! Thank you!",
    failureReaction: "Oh... that wasn't what I was hoping for on a hot afternoon.",
    rewardXp: 50,
    badgeUnlock: 'Nostalgia Navigator 🍧'
  },
  {
    id: 'cust_2_priya_mom',
    name: 'Mrs. Priya & Daughter Anvi (Grade 6)',
    roleDescription: 'Health-conscious mother on an afternoon walk',
    gradeLevel: 'Grades 6-7',
    characterType: 'mom_priya',
    appearance: {
      height: 1.55,
      shirtColor: '#d97706', // warm amber kurta
      pantsColor: '#f1f5f9', // white leggings
      hairColor: '#0f172a',
      hairStyle: 'bun',
      skinTone: '#e2b391',
      accessory: 'glasses'
    },
    preferredFlavorId: 'mango',
    budget: 50,
    orderQuery: "My daughter wants a frozen pop, but I'm worried. Roadside ice golas use unboiled tap water and artificial chemical colors that cause throat infections. How is Skippi any different?",
    curriculumTopic: 'Competitive Advantage: Hygiene, RO Purity & FSSAI Standards',
    dialogueChoices: [
      {
        id: 'c2_a',
        text: "Every Skippi pop is sealed in a certified food-grade pouch, made using multi-stage RO water, real fruit pulp, and 100% natural plant extracts with ZERO artificial preservatives!",
        isCorrect: true,
        feedback: "Excellent! You addressed the parent's health concern directly with tangible quality facts.",
        satisfactionDelta: 25,
        learningPoint: "Parents are the decision-makers/buyers, while kids are the consumers. Win the parent with hygiene."
      },
      {
        id: 'c2_b',
        text: "Don't worry, ice kills all bacteria anyway so all frozen pops are clean.",
        isCorrect: false,
        feedback: "Freezing does NOT kill bacteria in unhygienic water. Parents know this!",
        satisfactionDelta: -15,
        learningPoint: "Never make misleading health claims; highlight factual certifications."
      }
    ],
    successReaction: "That's wonderful to hear! I can comfortably let Anvi enjoy this Mango treat. Keep up the high standards!",
    failureReaction: "Hmm, that doesn't sound very reassuring at all. We will skip it today.",
    rewardXp: 75,
    badgeUnlock: 'Hygiene Guardian 🛡️'
  },
  {
    id: 'cust_3_kabir',
    name: 'Kabir (Grade 7)',
    roleDescription: 'Planning an evening birthday picnic across town',
    gradeLevel: 'Grades 6-7',
    characterType: 'kid_kabir',
    appearance: {
      height: 1.25,
      shirtColor: '#059669', // emerald green
      pantsColor: '#1e293b',
      hairColor: '#334155',
      hairStyle: 'curly',
      skinTone: '#f8d7c4',
      accessory: 'backpack'
    },
    preferredFlavorId: 'party_pack',
    budget: 200,
    orderQuery: "I want to buy ice pops for 10 friends at my birthday party across town. But I have a 45-minute bus ride home in the heat! Won't ordinary ice creams melt into warm coloured puddle in my bag?",
    curriculumTopic: 'Business Model Innovation: Ready-to-Freeze vs Cold Chain Logistics',
    dialogueChoices: [
      {
        id: 'c3_a',
        text: "That's Skippi's superpower! Our 12-Pack is liquid 'Ready-to-Freeze'. It travels safely at normal room temperature without melting. Just put them in your home freezer for a few hours before the party!",
        isCorrect: true,
        feedback: "Brilliant explanation of Skippi's game-changing logistics advantage!",
        satisfactionDelta: 30,
        learningPoint: "Skippi eliminates expensive refrigerated cold-chain trucks by shipping liquid pouches that customers freeze at home."
      },
      {
        id: 'c3_b',
        text: "Just buy frozen singles and run as fast as you can before they turn into water!",
        isCorrect: false,
        feedback: "Popsicles melt within 10 minutes in the sun. Kabir's party would be ruined!",
        satisfactionDelta: -15,
        learningPoint: "Educating customers on how the product works solves real friction."
      }
    ],
    successReaction: "WHAT?! That is sheer genius! I don't need a heavy cooler box! I'll take the 12-pouch party box right now!",
    failureReaction: "They'd be completely melted before I reached my stop... I can't risk it.",
    rewardXp: 100,
    badgeUnlock: 'Supply Chain Innovator 📦'
  },
  {
    id: 'cust_4_simran',
    name: 'Simran (Grade 8)',
    roleDescription: 'Sharp student comparing street prices with branded products',
    gradeLevel: 'Grades 8-9',
    characterType: 'gola_fan_simran',
    appearance: {
      height: 1.35,
      shirtColor: '#7c3aed', // purple hoodie
      pantsColor: '#0f172a',
      hairColor: '#1e1b4b',
      hairStyle: 'pigtails',
      skinTone: '#e0ab88',
      accessory: 'shopping_bag'
    },
    preferredFlavorId: 'bubblegum',
    budget: 40,
    orderQuery: "A street vendor down the road sells shaved ice gola for ₹5 less. Why should I pay ₹15 for a branded Skippi Ice Pop?",
    curriculumTopic: 'Value Proposition & K-Matrix: Branded Differentiation',
    dialogueChoices: [
      {
        id: 'c4_a',
        text: "For just a few rupees more, you get tamper-proof hygienic packaging, natural spirulina & fruit flavours, zero artificial dyes, and consistent taste every single time!",
        isCorrect: true,
        feedback: "Superb value proposition defence! You justified the small premium with tangible benefits.",
        satisfactionDelta: 25,
        learningPoint: "Customers are willing to pay a fair price when brand trust, hygiene, and taste consistency are guaranteed."
      },
      {
        id: 'c4_b',
        text: "Because we have a prettier stall with colorful umbrellas.",
        isCorrect: false,
        feedback: "Decorative looks alone do not convince a price-conscious customer.",
        satisfactionDelta: -10,
        learningPoint: "Focus on product quality and safety over superficial appearance."
      }
    ],
    successReaction: "That actually makes total sense. Getting sick from bad ice is way more expensive than ₹5! Give me Bubblegum Blast!",
    failureReaction: "I don't think it's worth the extra money then.",
    rewardXp: 100,
    badgeUnlock: 'Brand Value Master 💎'
  },
  {
    id: 'cust_5_shark',
    name: 'Aman / Shark Tank Investor (Grade 9 Evaluator)',
    roleDescription: 'Senior business strategist & investor visiting the garden',
    gradeLevel: 'Grades 8-9',
    characterType: 'shark_investor',
    appearance: {
      height: 1.70,
      shirtColor: '#0f172a', // midnight blazer
      pantsColor: '#334155',
      hairColor: '#020617',
      hairStyle: 'short',
      skinTone: '#d4a373',
      accessory: 'glasses'
    },
    preferredFlavorId: 'lemon',
    budget: 500,
    orderQuery: "Congratulations on your All-Sharks Deal on Shark Tank India (₹1 Cr for 15%)! But as an investor, I see a major threat: ice pops are seasonal. How will Skippi survive the winter months and grow towards a 100-Crore business?",
    curriculumTopic: 'Financial Sustainability & Seasonal Demand Management',
    dialogueChoices: [
      {
        id: 'c5_a',
        text: "We diversify into quick-commerce/supermarket distribution, launch mobile freezer-bikes for events, expand into sunny Southern & international markets, and introduce winter-friendly treat lines!",
        isCorrect: true,
        feedback: "Incredible strategic vision! That is the exact playbook Skippi used to raise ₹10 Cr Pre-Series A.",
        satisfactionDelta: 35,
        learningPoint: "Sustainable business scale requires geographic diversification, multi-channel distribution, and off-season product planning."
      },
      {
        id: 'c5_b',
        text: "We will just double our prices during the summer to cover winter losses.",
        isCorrect: false,
        feedback: "Price gouging alienates customers and invites competitors to steal market share.",
        satisfactionDelta: -20,
        learningPoint: "Pricing must remain customer-friendly while operations scale."
      }
    ],
    successReaction: "Now THAT is a billion-rupee founder mindset! You understand cash flow, seasonality, and scale. Deal confirmed!",
    failureReaction: "That answer would worry any investor on Shark Tank.",
    rewardXp: 150,
    badgeUnlock: 'Billion-Rupee Strategist 🦈'
  }
];

export const GARDEN_FACTS = [
  "Did you know? Skippi was the FIRST brand in Shark Tank India history to receive an investment offer from ALL 5 SHARKS!",
  "Skippi's secret weapon: 'Ready-to-Freeze' liquid distribution cuts freight costs by over 40% because no freezer trucks are needed!",
  "Hygiene first: Traditional ice golas often use industrial ice blocks meant for fish storage, while Skippi uses 100% RO drinking water.",
  "Natural colors: The vibrant electric blue in Skippi's Bubblegum flavour comes from natural spirulina algae, not petroleum dyes!",
  "Revenue milestone: Skippi's sales jumped from ₹2.5 Cr in FY22 to ₹20 Cr in FY24 after its nationwide television appearance!"
];

