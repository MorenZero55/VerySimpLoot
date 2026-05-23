export interface FarmingDeposit {
  id: string;
  amount: number;
  durationDays: number;
  startTime: number;
  endTime: number;
  earnedDspt: number;
  bonusTon: number;
  targetDspt: number;
  targetTon: number;
  boostAtStart: number;
  status: 'active' | 'completed';
  isClaimed?: boolean;
}

export interface Referral {
  id: string;
  name: string;
  date: string;
  earnedTon: number;
  earnedDspt: number;
  rank: string;
  avatar?: string;
  isPremium: boolean;
}

export interface UserProfile {
  id: string;
  telegramId?: number;
  name: string;
  tonBalance: number;
  dsptPoints: number;
  isPremium: boolean;
  premiumExpiry?: number;
  activeBoost: number; // percentage, e.g., 5, 10, 15
  referralCount: number;
  referralRewardsTon: number;
  referralRewardsDspt: number;
  referrals: Referral[];
  walletAddress?: string;
  username?: string;
  avatar?: string;
  totalFarmedAmount: number;
  dailyStreak?: number;
  lastClaimDate?: number;
  casesCount: number;
  lastLevelReached: number;
}

export interface CaseReward {
  type: 'dspt' | 'ton' | 'boost' | 'premium_week' | 'premium_month';
  amount: number;
  label: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  address?: string;
}

export type Screen = 'home' | 'farming' | 'airdrop' | 'referrals' | 'profile' | 'boost' | 'tasks';
