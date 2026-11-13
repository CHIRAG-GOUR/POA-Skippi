export type CharacterType = 
  | 'boy_aarav' 
  | 'girl_meera' 
  | 'mom_priya' 
  | 'kid_kabir' 
  | 'gola_fan_simran' 
  | 'shark_investor';

export interface IcePop {
  id: string;
  name: string;
  flavor: string;
  colorHex: string;
  glowHex: string;
  tagline: string;
  benefits: string[];
  price: number;
  emoji: string;
  isPack?: boolean;
}

export interface DialogueChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  satisfactionDelta: number;
  learningPoint: string;
}

export interface Customer {
  id: string;
  name: string;
  roleDescription: string;
  gradeLevel: 'Grades 4-5' | 'Grades 6-7' | 'Grades 8-9';
  characterType: CharacterType;
  appearance: {
    height: number;
    shirtColor: string;
    pantsColor: string;
    hairColor: string;
    hairStyle: 'short' | 'pigtails' | 'spiky' | 'curly' | 'bun';
    skinTone: string;
    accessory?: 'cap' | 'glasses' | 'backpack' | 'shopping_bag';
  };
  preferredFlavorId: string;
  budget: number;
  orderQuery: string;
  curriculumTopic: string;
  dialogueChoices: DialogueChoice[];
  successReaction: string;
  failureReaction: string;
  rewardXp: number;
  badgeUnlock?: string;
}

export type CustomerLifecycle = 
  | 'waiting_at_gate'
  | 'walking_to_stall'
  | 'greeting'
  | 'dialogue'
  | 'selecting_product'
  | 'handover'
  | 'celebrating'
  | 'walking_away'
  | 'departed';

export type CameraViewMode = 
  | 'isometric'
  | 'stall_counter'
  | 'third_person'
  | 'fountain_view';

export interface GameStats {
  revenue: number;
  customersServed: number;
  productsSold: number;
  satisfactionScore: number; // 0 - 100
  xp: number;
  unlockedBadges: string[];
  mistakesCount: number;
}

