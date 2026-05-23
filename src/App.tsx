import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Sprout, 
  Gift, 
  Database, 
  Coins,
  User, 
  Users,
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Info, 
  Plus,
  ArrowUpRight,
  History,
  Headphones,
  Crown,
  TrendingUp,
  Trophy,
  Clock,
  X,
  Globe,
  LogOut,
  ShieldCheck,
  ArrowDownLeft,
  LayoutGrid,
  MessageCircle,
  Wallet,
  Shield,
  Check,
  Star,
  Sun,
  Moon,
  Copy,
  ExternalLink,
  Share2,
  UserPlus,
  ArrowRight,
  ListChecks,
  CircleCheck,
  Bell,
  RefreshCcw,
  CheckCircle2,
  LayoutList,
  Handshake,
  Sparkles,
  Target,
  Rocket,
  Download,
  Terminal,
  BadgeCheck,
  Triangle,
  Send,
  CalendarDays,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { FarmingDeposit, UserProfile, Screen, Transaction, CaseReward } from './types';
import { 
  calculateDsptPoints,
  calculateTonRewardPercent,
  BOOST_OPTIONS, 
  POOL_DATA, 
  DSPT_TOTAL_SUPPLY 
} from './constants';

const ACCOUNT_LEVELS = [
  { level: 1, requirement: 100 },
  { level: 2, requirement: 300 },
  { level: 3, requirement: 1000 },
  { level: 4, requirement: 3000 },
  { level: 5, requirement: 10000 },
];

const SMOOTH_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const CASE_SPRING = { type: "spring" as const, stiffness: 260, damping: 20 };

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 12, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`fixed top-0 left-1/2 z-[100] px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 min-w-[200px] border ${
        type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
      } backdrop-blur-xl`}
    >
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        {type === 'success' ? <ShieldCheck size={14} /> : <X size={14} />}
      </div>
      <span className="text-xs font-black tracking-tight">{message}</span>
    </motion.div>
  );
};

const OnboardingSlider = ({ t, onAction }: { t: any, onAction: (id: number) => void }) => {
  const [index, setIndex] = useState(0);
  const directionRef = useRef(1);

  const slides: { id: number, title: string, desc: string, value?: string, bg: string, accent: string, symbol: React.ReactNode }[] = [
    {
      id: 1,
      title: t.onboardingSlide1Title,
      value: t.onboardingSlide1Value,
      desc: t.onboardingSlide1Desc,
      bg: "bg-[#091522]",
      accent: "text-accent-blue",
      symbol: (
        <div className="relative w-full h-full flex items-center justify-end pr-6">
          <motion.div 
            animate={{ 
              y: [-8, 8, -8],
              rotate: [0, 5, -5, 0],
            }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-32 h-32"
          >
            <div className="absolute inset-0 bg-accent-blue/20 rounded-full scale-110 pointer-events-none" />
            <img 
              src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=035"
              alt="TON"
              className="w-full h-full object-contain relative z-10"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {/* Sub-coins as simple small static-ish elements to avoid stack complexity */}
          <div className="absolute top-2 right-32 w-10 h-10 opacity-30">
            <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=035" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute bottom-4 right-4 w-12 h-12 opacity-20">
            <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=035" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: t.onboardingSlide2Title,
      desc: t.onboardingSlide2Desc,
      bg: "bg-[#1A0B1A]",
      accent: "text-[#F06292]",
      symbol: (
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-pink-500/10 rounded-full scale-125" />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [-3, 3, -3]
            }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 text-[#F06292]"
          >
            <Handshake size={90} strokeWidth={1} />
          </motion.div>
          <div className="absolute top-0 right-0 opacity-20"><Users size={40} /></div>
          <div className="absolute bottom-0 left-0 opacity-10"><Gift size={30} /></div>
        </div>
      )
    },
    {
      id: 3,
      title: t.onboardingSlide3Title,
      desc: t.onboardingSlide3Desc,
      bg: "bg-[#1A1208]",
      accent: "text-[#FFD54F]",
      symbol: (
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full scale-125" />
          <motion.div 
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 2, -2, 0]
            }} 
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 text-[#FFD54F]"
          >
            <Target size={90} strokeWidth={1} />
          </motion.div>
          <div className="absolute top-2 right-4 opacity-30"><Rocket size={36} /></div>
          <div className="absolute bottom-0 left-2 opacity-20"><Star size={30} /></div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      directionRef.current = 1;
      setIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    (window as any).sliderTouchStart = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = ((window as any).sliderTouchStart || 0) - touchEnd;
    
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        directionRef.current = 1;
        setIndex(prev => (prev + 1) % slides.length);
      } else {
        directionRef.current = -1;
        setIndex(prev => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  return (
    <div 
      className="relative w-full h-[140px] overflow-hidden rounded-2xl border border-white/5 shadow-xl bg-[#05070A]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={directionRef.current}>
        <motion.div
          key={index}
          custom={directionRef.current}
          variants={{
            enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "tween", ease: "easeInOut", duration: 0.4 }, opacity: { duration: 0.3 } }}
          className={`absolute inset-0 ${slides[index].bg} overflow-hidden`}
          onClick={() => onAction(slides[index].id)}
          style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
        >
          {/* Static Background Accents (no blur) */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full translate-x-1/2 translate-y-1/2" />

          {/* Symbol Container */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none">
            {slides[index].symbol}
          </div>

          {/* Text Content */}
          <div className="relative z-10 h-full flex items-center justify-start px-6">
            <div className="flex flex-col max-w-[65%] space-y-1">
              <h4 className="text-white font-black text-lg tracking-tight uppercase leading-none">
                {slides[index].title}
              </h4>
              <div className="flex flex-col">
                {slides[index].value && (
                  <span className={`text-xl font-black ${slides[index].accent} tracking-tighter leading-tight`}>
                    {slides[index].value}
                  </span>
                )}
                <p className="text-[10px] font-bold text-white/40 leading-tight pr-2">
                  {slides[index].desc}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-6 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

const BottomNav = ({ currentScreen, setScreen, t }: { currentScreen: Screen, setScreen: (s: Screen) => void, t: any }) => {
  const navItems: { id: Screen, icon: any, label: string }[] = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'tasks', icon: LayoutList, label: t.tasks },
    { id: 'farming', icon: Sprout, label: t.farming },
    { id: 'referrals', icon: Users, label: t.referrals },
    { id: 'profile', icon: User, label: t.profile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0C10]/95 backdrop-blur-2xl border-t border-white/5 px-4 py-2 pb-6 flex justify-between items-center z-50 shadow-[0_-15px_30px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 relative ${
            currentScreen === item.id ? 'text-accent-blue scale-105' : 'text-text-secondary hover:text-white/60'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${currentScreen === item.id ? 'bg-accent-blue/10' : ''}`}>
            <item.icon size={20} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
          </div>
          <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity ${currentScreen === item.id ? 'opacity-100' : 'opacity-40'}`}>
            {item.label}
          </span>
          
          {currentScreen === item.id && (
            <motion.div 
              layoutId="nav-active-dot"
              className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent-blue"
            />
          )}
        </button>
      ))}
    </div>
  );
};

const Header = ({ title, showBack, onBack, tonBalance, onWallet, t }: { title: string, showBack?: boolean, onBack?: () => void, tonBalance?: number, onWallet?: () => void, t: any }) => (
  <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-white/5">
    <div className="flex items-center gap-3">
      {showBack ? (
        <button onClick={onBack} className="p-1 -ml-1 text-text-secondary">
          <ChevronRight className="rotate-180" size={24} />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-accent-blue/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <TrendingUp size={18} className="text-white relative z-10" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-black tracking-tighter text-xl leading-none">DSPT</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue">Ecosystem</span>
          </div>
        </div>
      )}
    </div>
    
    {!showBack && tonBalance !== undefined && (
      <button 
        onClick={onWallet}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 transition-all group"
      >
        <div className="flex flex-col items-end">
          <span className="text-xs font-black leading-none">{tonBalance.toFixed(2)} <span className="text-[10px] opacity-40">TON</span></span>
        </div>
        <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue/20 transition-colors">
          <Wallet size={16} />
        </div>
      </button>
    )}
  </div>
);

// --- Main App Component ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [farmingTab, setFarmingTab] = useState<'active' | 'stats'>('active');
  const [lang, setLang] = useState<'en' | 'ru'>('en');

  // Initialize Telegram Web App
  useEffect(() => {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Disable the pull-down-to-close gesture
      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
      }
      
      // Auto-set language based on Telegram settings
      if (tg.initDataUnsafe?.user?.language_code === 'ru') {
        setLang('ru');
      }

      // Set user info from Telegram
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser(prev => ({ 
          ...prev, 
          id: tgUser.id.toString(),
          telegramId: tgUser.id,
          name: tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ''),
          username: tgUser.username,
          avatar: tgUser.photo_url
        }));
      }
      
      // Set header color to match app theme
      tg.setHeaderColor('#0A0A0B');
    }
  }, []);

  // Handle Telegram Back Button
  useEffect(() => {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    if (tg && tg.BackButton) {
      if (screen !== 'home') {
        tg.BackButton.show();
        const handleBack = () => setScreen('home');
        tg.BackButton.onClick(handleBack);
        return () => {
          tg.BackButton.offClick(handleBack);
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [screen]);

  const [showUnifiedWalletModal, setShowUnifiedWalletModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showRewardPoolModal, setShowRewardPoolModal] = useState(false);
  const [walletTab, setWalletTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWalletActionModal, setShowWalletActionModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showFarmingInfo, setShowFarmingInfo] = useState(false);
  const [openingCase, setOpeningCase] = useState(false);
  const [caseReward, setCaseReward] = useState<CaseReward | null>(null);
  const [fastFarmingMode, setFastFarmingMode] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('10');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const translations = {
    en: {
      totalDspt: "Total DSPT Points",
      farmingRate: "Base Rate",
      ptsPerHour: "PTS/hr",
      activeSessionsCount: "Active Sessions",
      activeFarming: "Active Farming",
      multiplier: "Multiplier",
      startFarming: "Activate Farming",
      boost: "Boost",
      farmingSessions: "Farming Sessions",
      completeAll: "Complete & Claim All",
      addFarming: "Add Farming",
      readyToClaim: "Ready to Claim",
      claim: "Claim",
      noActiveFarming: "No active farming",
      startYourFirst: "Activate DSPT point farming for a chosen number of days using TON.",
      deposited: "Activated",
      duration: "Duration",
      progress: "Progress",
      earnedDspt: "Earned DSPT",
      bonusTon: "Bonus TON",
      days: "Days",
      profile: "Profile",
      settings: "Settings",
      language: "Language",
      premiumStatus: "Premium Status",
      upgradeToPremium: "Upgrade to Premium",
      premiumActive: "Premium Active",
      tonBalance: "TON Balance",
      dsptBalance: "DSPT Balance",
      deposit: "Top up",
      withdraw: "Withdraw",
      rules: "Rules",
      rulesTitle: "DSPT Platform Rules",
      wallet: "Wallet",
      bindWallet: "Bind Wallet",
      walletAddress: "Wallet Address",
      enterWallet: "Enter your TON wallet address",
      save: "Save",
      noWallet: "No wallet bound",
      transactionHistory: "Transaction History",
      noTransactions: "No transactions yet",
      amount: "Amount",
      status: "Status",
      date: "Date",
      type: "Type",
      depositDetailed: "Deposit TON to your balance",
      withdrawDetailed: "Withdraw TON to your wallet",
      selectAmount: "Select Amount",
      completeAllFarming: "Complete All Farming",
      history: "History",
      support: "Support",
      logout: "Logout",
      premiumInfo: "Premium Info",
      expiresIn: "Expires in",
      switchToMonthly: "Switch to Monthly",
      daysLeft: "days left",
      hoursLeft: "hours left",
      minutesLeft: "minutes left",
      enterAmount: "Enter Amount",
      confirm: "Confirm",
      cancel: "Cancel",
      insufficientBalance: "Insufficient balance",
      completedStatus: "Success",
      pendingStatus: "Processing",
      failedStatus: "Failed",
      depositSuccess: "Farming successfully activated",
      withdrawSuccess: "Withdrawal successful",
      depositNotification: "Deposit of {amount} TON successfully credited",
      withdrawNotification: "Withdrawal of {amount} TON successfully completed",
      home: "Home",
      farming: "Farming",
      airdrop: "Airdrop",
      tasks: "Tasks",
      referrals: "Referrals",
      referralCount: "Referrals",
      referralIncome: "Total Reward",
      withdrawToBalance: "Withdraw to Balance",
      referralList: "Referral List",
      referralInfo: "Referral Program Info",
      referralInfoDesc: "Invite your friends and earn 30% of their farming reward in both TON and DSPT points! Rewards are credited instantly to your referral balance.",
      airdropPhase: "Phase 1 Live",
      yourAllocation: "Your Allocation",
      totalSupply: "Total Supply",
      participants: "Participants",
      airdropRoadmap: "Airdrop Roadmap",
      ecosystemPool: "Ecosystem Pool",
      transparencyData: "Real-time transparency data",
      totalTonInPool: "Total TON in Pool",
      proofOfReserves: "Proof of Reserves",
      reservesDesc: "All activated TON is held in a secure multi-signature ecosystem wallet. Funds are used to provide liquidity and support DSPT token value post-launch.",
      viewOnExplorer: "View on Explorer",
      tokenomicsTitle: "Tokenomics & Utility",
      communityAirdrop: "Community Airdrop",
      ecosystemGrowth: "Ecosystem Growth",
      teamAdvisors: "Team & Advisors",
      liquidityPool: "Liquidity Pool",
      tokenomicsDesc: "DSPT tokens will be used for governance, premium features, and ecosystem rewards. Points are converted 1:1 at TGE.",
      close: "Close",
      roadmapStep1: "Launch",
      roadmapStep2: "Mining",
      roadmapStep3: "Listing",
      roadmapStep4: "Expansion",
      roadmapStep5: "DAO",
      activeSessions: "Active Sessions",
      totalReward: "Total Reward",
      rewardLabel: "Reward",
      referralLink: "Referral Link",
      rewardPool: "Reward Pool",
      rewardPoolDesc: "This pool is formed from in-game purchases by players, including boosters and premium subscriptions. These funds are used for ecosystem rewards and platform incentives.",
      activeBonusProgram: "Active Bonus Program",
      activeBonusProgramDesc: "Additional TON rewards are distributed as part of current platform incentives. Participate in the ecosystem to qualify.",
      bestValue: "Best Value",
      buy: "Buy",
      weekly: "Weekly",
      monthly: "Monthly",
      copy: "Copy",
      copied: "Copied!",
      inviteFriends: "Invite Friends",
      shareLink: "Share your unique link and earn 30% from your friends' income!",
      accountLevel: "Account Level",
      levelRequirements: "Level Requirements",
      levelDesc: "Increase your total farming volume to unlock new levels.",
      farmingInfo: "Farming Info",
      farmingInfo1: "Earn DSPT points based on your TON amount",
      farmingInfo2: "Get bonus TON rewards at the end of session",
      farmingInfo3: "Boost your farming speed with multipliers",
      base: "Base",
      walletActions: "Wallet Operations",
      chooseAction: "Choose Action",
      fastFarming: "Fast Farming (30s)",
      fastFarmingDesc: "Farming lasts 30 seconds but gives full rewards",
      dailyBonus: "Daily Bonus",
      claimBonus: "Claim Bonus",
      bonusClaimed: "Bonus Claimed!",
      nextBonus: "Next bonus in {time}",
      streak: "Day {day}",
      dailyBonusInfo: "Progressive Daily Rewards",
      dayScale: "Day 1-10: 5-50 DSPT",
      cases: "Cases",
      openCase: "Open Case",
      noCases: "No cases available",
      youGot: "You received",
      caseReward: "Case Reward",
      casesDesc: "Cases are awarded for reaching new levels. Open them to get valuable rewards!",
      levelUpReward: "Level Up Reward",
      levelUpRewardDesc: "At each new level you get a free case. The higher the level, the more valuable and larger the rewards inside!",
      active: "Active",
      stats: "Completed",
      completed: "Completed",
      bonus: "Bonus",
      totalBonus: "Total Bonus",
      farmingStats: "Farming Statistics",
      totalFarmed: "Total Farmed",
      sessionsCompleted: "Sessions Completed",
      distribution: "Distribution",
      community: "Community",
      liquidity: "Liquidity",
      team: "Team",
      marketing: "Marketing",
      referralRewards: "Referral Rewards",
      claimRewards: "Claim Rewards",
      phase1ActiveMining: "Phase 1: Active Mining",
      dsptPoints: "DSPT Points",
      purchase: "Activated",
      farmingBonus: "Farming Bonus",
      miningProgress: "Mining Progress",
      dsptTokens: "DSPT Tokens",
      activeMiners: "Active Miners",
      tokenDistributionStrategy: "Token Distribution Strategy",
      dsptTokenCore: "DSPT tokens are the core of our ecosystem, powering decentralization and rewarding early adopters.",
      networkTier: "Network Tier",
      tier3: "Tier 3",
      commission30: "30% Commission",
      total: "Total",
      premium: "Premium",
      incentiveProgramDesc: "Rewards are part of platform incentive programs and may vary based on ecosystem participation.",
      boostDsptRewards: "Boost DSPT Rewards",
      increasePointAccumulation: "Increase your point accumulation by a percentage",
      pointsBonus: "Points Bonus",
      activeStatus: "Active",
      activateAction: "Activate",
      boostDisclaimer: "Boost affects DSPT farming only. TON bonus rewards remain at base rates. Only one boost can be active at a time.",
      dsptEcosystem: "DSPT Ecosystem",
      tonReward: "TON Reward",
      dsptReward: "DSPT Reward",
      liveStats: "Live Stats",
      openingCase: "Opening Case...",
      waitForIt: "Wait for it...",
      claimedSuccessfully: "Claimed Successfully",
      level: "Level",
      levelProgress: "Level Progress",
      assetsRewards: "Assets & Rewards",
      available: "Available",
      actionsSupport: "Actions & Support",
      max: "MAX",
      upgradePremiumActiveFarming: "Upgrade to Premium to have up to 3 active farming sessions!",
      maxFarmingSessions: "Maximum 3 active farming sessions reached.",
      gotIt: "Got it",
      premiumBenefits: "Premium Benefits",
      premiumBenefit1: "Up to 3 active farming sessions",
      premiumBenefit2: "Exclusive cases for level ups",
      premiumBenefit3: "Priority support & early access",
      premiumBenefit4: "Premium badge in profile",
      buyWeek: "Buy 1 Week (10 TON)",
      buyMonth: "Buy 1 Month (25 TON)",
      premiumSuccess: "Premium successfully activated!",
      tonRewardsPool: "Total Reward Pool is:",
      week: "Week",
      month: "Month",
      ton: "TON",
      rewardPoolPoint1: "Pool is formed from in-app purchases",
      rewardPoolPoint2: "Includes premium subscriptions and boosters",
      rewardPoolPoint3: "Used for ecosystem rewards and platform incentives",
      rewardPoolPoint4: "Distributed among active community members",
      onboardingSlide1Title: "Global Reward Pool:",
      onboardingSlide1Value: "100.000 TON",
      onboardingSlide1Desc: "Active bonus program",
      onboardingSlide2Title: "Invite Friends",
      onboardingSlide2Desc: "Get up to 30% of their farming",
      onboardingSlide3Title: "Complete Tasks",
      onboardingSlide3Desc: "Get DSPT points",
      farmingCaseNotice: "By activating farming for more than 7 days, you receive a free case with valuable rewards!",
      taskCompletionProgress: "Task Completion Progress",
      completeTasksBonus: "Complete all tasks to receive a free bonus case!",
    },
    ru: {
      totalDspt: "Всего DSPT",
      farmingRate: "Базовая скорость",
      ptsPerHour: "PTS/час",
      activeSessionsCount: "Активные сессии",
      activeFarming: "Активный фарминг",
      multiplier: "Множитель",
      startFarming: "Начать фарминг",
      boost: "Буст",
      farmingSessions: "Сессии фарминга",
      completeAll: "Собрать всё",
      addFarming: "Добавить фарминг",
      readyToClaim: "Готово к сбору",
      claim: "Собрать",
      noActiveFarming: "Нет активного фарминга",
      startYourFirst: "Активируйте фарминг DSPT на выбранный срок за TON.",
      deposited: "Активировано",
      duration: "Срок",
      progress: "Прогресс",
      earnedDspt: "Добыто DSPT",
      bonusTon: "Бонус TON",
      days: "дн.",
      profile: "Профиль",
      settings: "Настройки",
      language: "Язык",
      premiumStatus: "Премиум статус",
      upgradeToPremium: "Купить Премиум",
      premiumActive: "Премиум активен",
      tonBalance: "Баланс TON",
      dsptBalance: "Баланс DSPT",
      deposit: "Пополнить",
      withdraw: "Вывести",
      rules: "Правила",
      rulesTitle: "Правила платформы DSPT",
      wallet: "Кошелек",
      bindWallet: "Привязать кошелек",
      walletAddress: "Адрес кошелька",
      enterWallet: "Введите адрес TON кошелька",
      save: "Сохранить",
      noWallet: "Не привязан",
      transactionHistory: "История транзакций",
      noTransactions: "История пуста",
      amount: "Сумма",
      status: "Статус",
      date: "Дата",
      type: "Тип",
      depositDetailed: "Пополнение баланса TON",
      withdrawDetailed: "Вывод TON на кошелек",
      selectAmount: "Выберите сумму",
      completeAllFarming: "Завершить всё",
      history: "История",
      support: "Поддержка",
      logout: "Выйти",
      premiumInfo: "Информация о Премиуме",
      expiresIn: "Истекает через",
      switchToMonthly: "Перейти на месячный тариф",
      daysLeft: "дней осталось",
      hoursLeft: "часов осталось",
      minutesLeft: "минут осталось",
      enterAmount: "Введите сумму",
      confirm: "Подтвердить",
      cancel: "Отмена",
      insufficientBalance: "Недостаточно TON",
      depositSuccess: "Фарминг активирован",
      withdrawSuccess: "Вывод выполнен",
      depositNotification: "Зачислено {amount} TON",
      withdrawNotification: "Выведено {amount} TON",
      premiumSuccess: "Премиум успешно активирован!",
      home: "Главная",
      tasks: "Задания",
      farming: "Фарминг",
      airdrop: "Аирдроп",
      referrals: "Друзья",
      referralCount: "Друзья",
      referralIncome: "Награда",
      withdrawToBalance: "Собрать на баланс",
      referralList: "Список друзей",
      referralInfo: "Реферальная система",
      referralInfoDesc: "Приглашайте друзей и получайте 30% от их дохода в TON и DSPT! Награды начисляются мгновенно.",
      airdropPhase: "Фаза 1: Активна",
      yourAllocation: "Ваша доля",
      totalSupply: "Эмиссия",
      participants: "Участники",
      airdropRoadmap: "Дорожная карта",
      ecosystemPool: "Пул экосистемы",
      transparencyData: "Данные прозрачности",
      totalTonInPool: "Всего TON в пуле",
      proofOfReserves: "Доказательство резервов",
      reservesDesc: "Все TON хранятся на защищенном кошельке экосистемы. Средства обеспечивают ликвидность и поддержку DSPT.",
      viewOnExplorer: "Открыть в Explorer",
      tokenomicsTitle: "Токеномика",
      communityAirdrop: "Аирдроп сообщества",
      ecosystemGrowth: "Развитие экосистемы",
      teamAdvisors: "Команда",
      liquidityPool: "Пул ликвидности",
      tokenomicsDesc: "Токены DSPT используются для управления и наград. Поинты будут обменяны 1:1 при запуске.",
      close: "Закрыть",
      activeSessions: "Сессии",
      totalReward: "Общая награда",
      rewardLabel: "Награда",
      referralLink: "Реферальная ссылка",
      rewardPool: "Пул наград",
      tonRewardsPool: "Общий Пул наград составляет:",
      rewardPoolDesc: "Этот пул формируется из внутренних покупок игроков, включая бустеры и премиум-подписки. Эти средства используются для вознаграждений экосистемы и поощрений платформы.",
      activeBonusProgram: "Активная бонусная программа",
      activeBonusProgramDesc: "Дополнительные вознаграждения TON распределяются в рамках текущих стимулов платформы. Участвуйте в экосистеме, чтобы соответствовать требованиям.",
      bestValue: "Выгодно",
      buy: "Купить",
      weekly: "Неделя",
      monthly: "Месяц",
      copy: "Копировать",
      copied: "Скопировано!",
      inviteFriends: "Пригласить друзей",
      shareLink: "Поделитесь вашей ссылкой и получайте 30% от дохода друзей!",
      accountLevel: "Уровень",
      levelRequirements: "Условия уровня",
      levelDesc: "Увеличивайте объем фарминга для повышения уровня.",
      farmingInfo: "О фарминге",
      farmingInfo1: "Зарабатывайте DSPT поинты от суммы ваших TON",
      farmingInfo2: "Получайте бонусные TON в конце сессии",
      farmingInfo3: "Увеличивайте скорость с помощью множителей",
      base: "Базовый",
      walletActions: "Операции с кошельком",
      chooseAction: "Выберите действие",
      fastFarming: "Быстрый фарминг (30с)",
      fastFarmingDesc: "Фарминг длится 30 секунд, но дает полную награду",
      dailyBonus: "Ежедневный бонус",
      claimBonus: "Забрать бонус",
      bonusClaimed: "Бонус получен!",
      nextBonus: "Следующий через {time}",
      streak: "День {day}",
      dailyBonusInfo: "Прогрессивные награды",
      dayScale: "1-10 день: 5-50 DSPT",
      cases: "Кейсы",
      openCase: "Открыть кейс",
      noCases: "Нет доступных кейсов",
      youGot: "Вы получили",
      caseReward: "Награда из кейса",
      casesDesc: "Кейсы выдаются за достижение новых уровней. Открывайте их, чтобы получить ценные награды!",
      levelUpReward: "Награда за уровень",
      levelUpRewardDesc: "За каждый новый уровень вы получаете бесплатный кейс. Чем выше уровень, тем ценнее и крупнее награды внутри кейса!",
      active: "Активные",
      stats: "Завершенные",
      completed: "Завершенные",
      bonus: "Бонус",
      totalBonus: "Общий бонус",
      farmingStats: "Статистика фарминга",
      totalFarmed: "Всего добыто",
      sessionsCompleted: "Завершено сессий",
      roadmapStep1: "Создание сообщества",
      roadmapStep2: "Запуск проекта для фарминга поинтов",
      roadmapStep3: "Распределение токенов",
      roadmapStep4: "Рекламная биржа DISPUT в Telegram",
      roadmapStep5: "Расширение экосистемы и новые сервисы",
      tokenomics: "Токеномика",
      distribution: "Распределение",
      community: "Сообщество",
      liquidity: "Ликвидность",
      team: "Команда",
      marketing: "Маркетинг",
      referralRewards: "Награды за друзей",
      claimRewards: "Забрать награды",
      completedStatus: "Успешно",
      pendingStatus: "В обработке",
      failedStatus: "Ошибка",
      phase1ActiveMining: "Фаза 1: Активный майнинг",
      dsptPoints: "DSPT Поинты",
      purchase: "Активировано",
      farmingBonus: "Фарминг бонус",
      miningProgress: "Прогресс майнинга",
      dsptTokens: "DSPT Токены",
      activeMiners: "Активные майнеры",
      tokenDistributionStrategy: "Стратегия распределения токенов",
      dsptTokenCore: "Токены DSPT — это ядро нашей экосистемы, обеспечивающее децентрализацию и вознаграждение ранних пользователей.",
      networkTier: "Уровень сети",
      tier3: "Уровень 3",
      commission30: "30% Комиссия",
      total: "Всего",
      premium: "Премиум",
      incentiveProgramDesc: "Награды являются частью программ стимулирования платформы и могут варьироваться в зависимости от участия в экосистеме.",
      boostDsptRewards: "Буст наград DSPT",
      increasePointAccumulation: "Увеличьте накопление поинтов на определенный процент",
      pointsBonus: "Бонус к поинтам",
      activeStatus: "Активно",
      activateAction: "Активировать",
      boostDisclaimer: "Буст влияет только на фарминг DSPT. Бонусные награды TON остаются на базовом уровне. Одновременно может быть активен только один буст.",
      dsptEcosystem: "Экосистема DSPT",
      tonReward: "Награда TON",
      dsptReward: "Награда DSPT",
      liveStats: "Статистика",
      openingCase: "Открытие кейса...",
      waitForIt: "Подождите...",
      claimedSuccessfully: "Успешно получено",
      level: "Уровень",
      levelProgress: "Прогресс уровня",
      assetsRewards: "Активы и награды",
      available: "Доступно",
      actionsSupport: "Действия и поддержка",
      max: "МАКС",
      upgradePremiumActiveFarming: "Обновитесь до Premium, чтобы иметь до 3 активных сессий фарминга!",
      maxFarmingSessions: "Достигнуто максимальное количество активных сессий фарминга (3).",
      gotIt: "Понятно",
      premiumBenefits: "Преимущества Premium",
      premiumBenefit1: "До 3 активных сессий фарминга",
      premiumBenefit2: "Эксклюзивные кейсы за уровни",
      premiumBenefit3: "Приоритетная поддержка",
      premiumBenefit4: "Премиум значок в профиле",
      buyWeek: "Купить на неделю (10 TON)",
      buyMonth: "Купить на месяц (25 TON)",
      week: "Неделя",
      month: "Месяц",
      ton: "TON",
      rewardPoolPoint1: "Пул формируется из внутренних покупок",
      rewardPoolPoint2: "Включает премиум-подписки и бустеры",
      rewardPoolPoint3: "Используется для наград экосистемы и поощрений",
      rewardPoolPoint4: "Распределяется среди активных участников",
      onboardingSlide1Title: "Общий пул наград:",
      onboardingSlide1Value: "100.000 TON",
      onboardingSlide1Desc: "Активная бонусная программа",
      onboardingSlide2Title: "Приглашай друзей",
      onboardingSlide2Desc: "Получай до 30% от их фарминга",
      onboardingSlide3Title: "Выполняй задания",
      onboardingSlide3Desc: "Получай поинты DSPT",
      farmingCaseNotice: "При активации фарминга на срок более 7 дней, вы получаете бесплатный кейс с ценными наградами!",
      taskCompletionProgress: "Прогресс выполнения заданий",
      completeTasksBonus: "Выполните все задания, чтобы получить бесплатный бонусный кейс!",
    }
  };

  const t = translations[lang];

  const handleDeposit = (amountOverride?: number) => {
    const amount = amountOverride || parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'deposit',
      amount,
      timestamp: Date.now(),
      status: 'completed',
      address: user.walletAddress
    };
    
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({ ...prev, tonBalance: prev.tonBalance + amount }));
    setShowUnifiedWalletModal(false);
    setNotification({ 
      message: t.depositNotification.replace('{amount}', amount.toFixed(1)), 
      type: 'success' 
    });
  };

  const handleWithdraw = (amountOverride?: number) => {
    const amount = amountOverride || parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0 || amount > user.tonBalance || !user.walletAddress) return;
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'withdraw',
      amount,
      timestamp: Date.now(),
      status: 'completed',
      address: user.walletAddress
    };
    
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({ ...prev, tonBalance: prev.tonBalance - amount }));
    setShowUnifiedWalletModal(false);
    setNotification({ 
      message: t.withdrawNotification.replace('{amount}', amount.toFixed(1)), 
      type: 'success' 
    });
  };

  const [user, setUser] = useState<UserProfile>({
    id: "7330771997",
    telegramId: 7330771997,
    name: "DSPT User",
    username: "dspt_user",
    avatar: "",
    tonBalance: 125.5,
    dsptPoints: 450.25,
    isPremium: false,
    activeBoost: 0,
    referralCount: 12,
    referralRewardsTon: 15.4,
    referralRewardsDspt: 1540,
    referrals: [
      { id: '1', name: "CryptoKing", date: "2024-03-20", earnedTon: 5.2, earnedDspt: 520, rank: "Gold", isPremium: true },
      { id: '2', name: "TonMaster", date: "2024-03-22", earnedTon: 3.1, earnedDspt: 310, rank: "Silver", isPremium: false },
      { id: '3', name: "DsptFarmer", date: "2024-03-25", earnedTon: 7.1, earnedDspt: 710, rank: "Platinum", isPremium: true },
      { id: '4', name: "Web3Explorer", date: "2024-03-26", earnedTon: 1.2, earnedDspt: 120, rank: "Bronze", isPremium: false },
      { id: '5', name: "GemsHunter", date: "2024-03-28", earnedTon: 0.8, earnedDspt: 80, rank: "Newbie", isPremium: false },
    ],
    totalFarmedAmount: 450,
    dailyStreak: 0,
    lastClaimDate: 0,
    casesCount: 2,
    lastLevelReached: 2,
  });

  const [tasks, setTasks] = useState<{ id: string, title: string, url: string, reward: number, status: 'start' | 'check' | 'claim' | 'completed' }[]>([
    { id: 'tg_chan_1', title: 'Subscribe to DSPT Channel', url: 'https://t.me/FarmDspt', reward: 100, status: 'start' },
    { id: 'tg_chan_2', title: 'Subscribe to Partner Channel', url: 'https://t.me/telegram', reward: 100, status: 'start' },
    { id: 'tg_chan_3', title: 'Join Announcement Channel', url: 'https://t.me/durov', reward: 100, status: 'start' },
    { id: 'tg_chan_4', title: 'Join Community Group', url: 'https://t.me/trending', reward: 100, status: 'start' },
    { id: 'tg_chan_5', title: 'Join TON News', url: 'https://t.me/toncoin', reward: 100, status: 'start' },
    { id: 'tg_chan_6', title: 'Subscribe to Crypto News', url: 'https://t.me/news', reward: 100, status: 'start' },
    { id: 'daily_1', title: 'Daily Check-in', url: '#', reward: 50, status: 'start' },
    { id: 'daily_2', title: 'Visit Web3 Blog', url: 'https://ton.org', reward: 75, status: 'start' },
    { id: 'daily_3', title: 'Watch Ecosystem Trailer', url: 'https://youtube.com', reward: 150, status: 'start' },
  ]);
  // Check for level up and award cases
  useEffect(() => {
    const currentLevelData = [...ACCOUNT_LEVELS].reverse().find(lvl => user.totalFarmedAmount >= lvl.requirement) || { level: 0, requirement: 0 };
    const currentLevel = currentLevelData.level;
    
    if (currentLevel > user.lastLevelReached) {
      const levelsGained = currentLevel - user.lastLevelReached;
      setUser(prev => ({
        ...prev,
        lastLevelReached: currentLevel,
        casesCount: prev.casesCount + levelsGained
      }));
      setNotification({ message: `Level Up! +${levelsGained} Case(s)`, type: 'success' });
    }
  }, [user.totalFarmedAmount, user.lastLevelReached]);

  const openCase = () => {
    if (user.casesCount <= 0 || openingCase) return;
    
    setOpeningCase(true);
    setShowCaseModal(true);
    
    // Simulate opening animation
    setTimeout(() => {
      const currentLevelData = [...ACCOUNT_LEVELS].reverse().find(lvl => user.totalFarmedAmount >= lvl.requirement) || { level: 1, requirement: 0 };
      const currentLevel = currentLevelData.level;
      
      // Tiered rewards based on level
      const multiplier = 1 + (currentLevel * 0.5); // Level 1: x1.5, Level 5: x3.5
      
      const rewards: CaseReward[] = [
        { type: 'dspt', amount: Math.floor(100 * multiplier), label: `${Math.floor(100 * multiplier)} DSPT` },
        { type: 'dspt', amount: Math.floor(250 * multiplier), label: `${Math.floor(250 * multiplier)} DSPT` },
        { type: 'dspt', amount: Math.floor(500 * multiplier), label: `${Math.floor(500 * multiplier)} DSPT` },
        { type: 'ton', amount: parseFloat((0.2 * multiplier).toFixed(2)), label: `${(0.2 * multiplier).toFixed(1)} TON` },
        { type: 'ton', amount: parseFloat((0.5 * multiplier).toFixed(2)), label: `${(0.5 * multiplier).toFixed(1)} TON` },
        { type: 'boost', amount: 5, label: '+5% Boost' },
        { type: 'boost', amount: 10, label: '+10% Boost' },
        { type: 'premium_week', amount: 0, label: '7D Premium' },
        { type: 'premium_month', amount: 0, label: '30D Premium' },
      ];
      
      // Weighted random (better lower level, but high level can actually get premium)
      const weights = rewards.map((r, i) => {
        if (r.type === 'premium_month') return 0.05 * (currentLevel / 5);
        if (r.type === 'premium_week') return 0.1 * (currentLevel / 5);
        if (r.type === 'ton') return 0.3 * (currentLevel / 5);
        return 1.0;
      });
      
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      let rewardIndex = 0;
      for (let i = 0; i < weights.length; i++) {
        if (random < weights[i]) {
          rewardIndex = i;
          break;
        }
        random -= weights[i];
      }

      const reward = rewards[rewardIndex];
      setCaseReward(reward);
      setOpeningCase(false);
      
      setUser(prev => {
        const newUser = { ...prev, casesCount: prev.casesCount - 1 };
        if (reward.type === 'dspt') newUser.dsptPoints += reward.amount;
        if (reward.type === 'ton') newUser.tonBalance += reward.amount;
        if (reward.type === 'boost') newUser.activeBoost += reward.amount;
        if (reward.type === 'premium_week') {
          newUser.isPremium = true;
          newUser.premiumExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
        }
        if (reward.type === 'premium_month') {
          newUser.isPremium = true;
          newUser.premiumExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
        }
        return newUser;
      });
    }, 4500); // Longer for the new CSGO animation
  };
  const [deposits, setDeposits] = useState<FarmingDeposit[]>([]);
  const [showAirdropInfo, setShowAirdropInfo] = useState(false);

  useEffect(() => {
    const anyModalOpen = showUnifiedWalletModal || showWalletModal || showRulesModal || showAirdropInfo || showCaseModal || showFarmingInfo;
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showUnifiedWalletModal, showWalletModal, showRulesModal, showAirdropInfo, showCaseModal, showFarmingInfo]);
  const [showReferralInfo, setShowReferralInfo] = useState(false);

  // Calculate total base farming rate
  const totalFarmingRate = deposits
    .filter(d => d.status === 'active')
    .reduce((acc, d) => {
      const totalDspt = calculateDsptPoints(d.amount, d.durationDays);
      const ratePerHour = totalDspt / (d.durationDays * 24);
      return acc + ratePerHour;
    }, 0);

  const activeSessionsCount = deposits.filter(d => d.status === 'active').length;

  const withdrawReferralRewards = () => {
    if (user.referralRewardsTon <= 0 && user.referralRewardsDspt <= 0) return;
    
    setUser(prev => ({
      ...prev,
      tonBalance: prev.tonBalance + prev.referralRewardsTon,
      dsptPoints: prev.dsptPoints + prev.referralRewardsDspt,
      referralRewardsTon: 0,
      referralRewardsDspt: 0
    }));
  };

  // Simulate farming accumulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDeposits(prev => prev.map(d => {
        if (d.status === 'completed') return d;
        
        const now = Date.now();
        const elapsedDays = (now - d.startTime) / (1000 * 60 * 60 * 24);
        const totalDuration = (d.endTime - d.startTime) / (1000 * 60 * 60 * 24);
        
        if (now >= d.endTime) {
          return { 
            ...d, 
            status: 'completed',
            earnedDspt: d.targetDspt || d.earnedDspt,
            bonusTon: d.targetTon || d.bonusTon
          };
        }

        const progress = Math.min(1, elapsedDays / totalDuration);
        
        // Use target values if available, otherwise fallback to current calculation
        const targetDspt = d.targetDspt || (calculateDsptPoints(d.amount, d.durationDays) * (1 + (user.activeBoost / 100)));
        const targetTon = d.targetTon || (d.amount * (calculateTonRewardPercent(d.durationDays) / 100));

        return {
          ...d,
          earnedDspt: targetDspt * progress,
          bonusTon: targetTon * progress
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [user.activeBoost]);

  const startFarming = (amount: number, days: number) => {
    if (amount > user.tonBalance) return;
    if (!user.isPremium && deposits.filter(d => d.status === 'active').length >= 1) {
      setNotification({ message: t.upgradePremiumActiveFarming, type: 'error' });
      return;
    }
    if (user.isPremium && deposits.filter(d => d.status === 'active').length >= 3) {
      setNotification({ message: t.maxFarmingSessions, type: 'error' });
      return;
    }

    const boostMultiplier = 1 + (user.activeBoost / 100);
    const targetDspt = calculateDsptPoints(amount, days) * boostMultiplier;
    const targetTon = amount * (calculateTonRewardPercent(days) / 100);

    const now = Date.now();
    const durationMs = fastFarmingMode ? 30000 : (days * 24 * 60 * 60 * 1000);
    
    const newDeposit: FarmingDeposit = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      durationDays: days,
      startTime: now,
      endTime: now + durationMs,
      earnedDspt: 0,
      bonusTon: 0,
      targetDspt,
      targetTon,
      boostAtStart: user.activeBoost,
      status: 'active'
    };

    setDeposits([...deposits, newDeposit]);
    setUser(prev => ({ 
      ...prev, 
      tonBalance: prev.tonBalance - amount,
      totalFarmedAmount: prev.totalFarmedAmount + amount 
    }));
    setScreen('home');
  };

  const activateBoost = (boostValue: number) => {
    setUser({ ...user, activeBoost: boostValue });
    setScreen('home');
  };

  const upgradePremium = () => {
    setShowPremiumModal(true);
  };

  const handleBuyPremium = (duration: 'week' | 'month', price: number) => {
    if (user.tonBalance < price) {
      setNotification({ message: t.insufficientBalance, type: 'error' });
      return;
    }

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'withdraw',
      amount: price,
      timestamp: Date.now(),
      status: 'completed',
      address: 'DSPT Premium'
    };

    const expiryDays = duration === 'week' ? 7 : 30;
    const expiryTime = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);

    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({ 
      ...prev, 
      tonBalance: prev.tonBalance - price,
      isPremium: true,
      premiumExpiry: expiryTime
    }));
    setShowPremiumModal(false);
    setNotification({ message: t.premiumSuccess, type: 'success' });
  };

  const claimDailyBonus = () => {
    const now = Date.now();
    const lastClaim = user.lastClaimDate || 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const lastClaimDay = new Date(lastClaim).setHours(0, 0, 0, 0);
    
    if (today === lastClaimDay) {
      setNotification({ message: t.bonusClaimed, type: 'error' });
      return;
    }

    let newStreak = (user.dailyStreak || 0) + 1;
    if (now - lastClaim > oneDayMs * 2) {
      newStreak = 1;
    }
    if (newStreak > 10) newStreak = 10;

    const reward = newStreak * 5;
    
    setUser(prev => ({
      ...prev,
      dsptPoints: prev.dsptPoints + reward,
      dailyStreak: newStreak,
      lastClaimDate: now
    }));

    setNotification({ message: `+${reward} DSPT!`, type: 'success' });
  };

  const completeAllFarmings = () => {
    let totalDsptToAdd = 0;
    let totalTonToAdd = 0;
    let totalPrincipalToReturn = 0;

    const updatedDeposits: FarmingDeposit[] = deposits.map(d => {
      if (d.status === 'active' && Date.now() >= d.endTime) {
        const fullDspt = d.targetDspt || (calculateDsptPoints(d.amount, d.durationDays) * (1 + (user.activeBoost / 100)));
        const fullTonReward = d.targetTon || (d.amount * (calculateTonRewardPercent(d.durationDays) / 100));
        
        totalDsptToAdd += fullDspt;
        totalTonToAdd += fullTonReward;
        totalPrincipalToReturn += d.amount;

        return { 
          ...d, 
          status: 'completed', 
          isClaimed: true,
          earnedDspt: fullDspt, 
          bonusTon: fullTonReward 
        };
      }
      return d;
    });

    if (totalPrincipalToReturn > 0) {
      setUser(prev => ({
        ...prev,
        tonBalance: prev.tonBalance + totalPrincipalToReturn + totalTonToAdd,
        dsptPoints: prev.dsptPoints + totalDsptToAdd
      }));
      setDeposits(updatedDeposits);
    }
  };

  const claimReward = (id: string) => {
    const deposit = deposits.find(d => d.id === id);
    if (!deposit || deposit.isClaimed || deposit.status !== 'completed') return;

    setUser(prev => ({
      ...prev,
      tonBalance: prev.tonBalance + deposit.amount + deposit.bonusTon,
      dsptPoints: prev.dsptPoints + deposit.earnedDspt
    }));

    setDeposits(prev => prev.map(d => d.id === id ? { ...d, isClaimed: true } : d));
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-24 w-full max-w-full overflow-hidden"
          >
            <Header 
              title={t.dsptEcosystem} 
              tonBalance={user.tonBalance}
              onWallet={() => { setWalletTab('deposit'); setShowUnifiedWalletModal(true); }}
              t={t}
            />
            <div className="px-6 space-y-6 mt-6">
              {/* Onboarding Motivation Slider replaces the old Reward Pool static block */}
              <OnboardingSlider 
                t={t} 
                onAction={(id) => {
                  if (id === 1) setShowRewardPoolModal(true);
                  if (id === 2) setScreen('referrals');
                  if (id === 3) setScreen('airdrop'); // Redirect to airdrop as tasks screen placeholder
                }}
              />

            {/* Compact DSPT Balance Section */}
            <motion.div 
              onClick={() => setScreen('airdrop')}
              className="relative cursor-pointer group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                    <Coins size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mb-0.5">{t.totalDspt}</div>
                    <div className="text-xl font-black text-white tracking-tight">
                      {Math.floor(user.dsptPoints).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-all">
                  <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>

              {/* Stats Grid: Rate & Multiplier */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-wider">{t.farmingRate}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <div className="text-2xl font-black text-white">{totalFarmingRate.toFixed(0)}</div>
                    <div className="text-[9px] font-bold text-text-secondary">{t.ptsPerHour}</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-wider">{t.boost}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <div className="text-2xl font-black text-white">+{user.activeBoost}%</div>
                    <div className="text-[9px] font-bold text-text-secondary">{user.activeBoost > 0 ? t.active : t.base}</div>
                  </div>
                </div>
              </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setScreen('farming')}
                className="gradient-accent py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/20"
              >
                <Plus size={18} />
                {t.startFarming}
              </button>
              <button 
                onClick={() => setScreen('boost')}
                className="bg-white/5 border border-white/10 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
              >
                <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                {t.boost}
              </button>
            </div>

            {/* Farming Sessions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-black tracking-tight">{t.farmingSessions}</h2>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setFarmingTab('active')}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${farmingTab === 'active' ? 'bg-accent-blue text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                    {t.active}
                  </button>
                  <button 
                    onClick={() => setFarmingTab('stats')}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${farmingTab === 'stats' ? 'bg-accent-blue text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                    {t.stats}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {farmingTab === 'active' ? (
                  <>
                    {/* Active Sessions */}
                    {deposits.filter(d => d.status === 'active').length > 0 && (
                      <div className="space-y-3">
                        {deposits.filter(d => d.status === 'active').map(d => {
                          const progress = Math.min(100, ((Date.now() - d.startTime) / (d.endTime - d.startTime)) * 100);
                          const totalReturn = d.amount + d.bonusTon;
                          return (
                            <div key={d.id} className="glass-card p-4 space-y-4 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 blur-2xl -mr-12 -mt-12 rounded-full" />
                              
                              <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                                    <Sprout size={20} className="animate-spin-slow" />
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest leading-none mb-1">{t.deposited}</div>
                                    <div className="text-lg font-black leading-none">{d.amount} <span className="text-xs opacity-40">TON</span></div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest leading-none mb-1">{t.duration}</div>
                                  <div className="text-sm font-black leading-none">{d.durationDays}{t.days}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2 relative z-10">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-text-secondary">{t.progress}</span>
                                  <span className="text-accent-blue">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full gradient-accent shadow-[0_0_10px_rgba(0,210,255,0.5)]"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                  <div className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-0.5">{t.earnedDspt}</div>
                                  <div className="flex flex-col">
                                    <div className="text-sm font-black text-accent-blue">+{d.earnedDspt.toFixed(0)}</div>
                                    {d.boostAtStart > 0 && (
                                      <div className="text-[8px] font-bold text-accent-cyan">
                                        +{ (d.earnedDspt * (d.boostAtStart / (100 + d.boostAtStart))).toFixed(0) } {t.bonus}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                  <div className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-0.5">{t.tonReward}</div>
                                  <div className="text-sm font-black text-green-400">+{(d.amount + d.bonusTon).toFixed(2)} <span className="text-[8px] opacity-60">TON</span></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Completed but Unclaimed Sessions */}
                    {deposits.filter(d => d.status === 'completed' && !d.isClaimed).length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-green-400 px-1">{t.completed}</h3>
                        {deposits.filter(d => d.status === 'completed' && !d.isClaimed).map(d => {
                          const totalReturn = d.amount + d.bonusTon;
                          return (
                            <div key={d.id} className="glass-card p-4 space-y-4 border-green-500/20 bg-green-500/5 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-2xl -mr-12 -mt-12 rounded-full" />
                              
                              <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                    <Sprout size={20} />
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-green-400 font-black uppercase tracking-widest leading-none mb-1">{t.readyToClaim}</div>
                                    <div className="text-sm font-black text-white">{t.completed}</div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => claimReward(d.id)}
                                  className="bg-green-500 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
                                >
                                  {t.claim}
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                  <div className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1">{t.purchase}</div>
                                  <div className="text-lg font-black text-white">{d.amount}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/10 text-center">
                                  <div className="text-[8px] text-white font-black uppercase tracking-widest mb-1">{t.tonReward}</div>
                                  <div className="text-lg font-black text-green-400">+{(d.amount + d.bonusTon).toFixed(2)}</div>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-white/[0.03] flex justify-between items-center relative z-10">
                                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Accumulated Points</span>
                                <div className="flex items-center gap-1.5 text-accent-blue font-black text-xs">
                                  <Zap size={10} className="fill-accent-blue" />
                                  +{d.earnedDspt.toFixed(0)} DSPT
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {deposits.filter(d => d.status === 'active' || (d.status === 'completed' && !d.isClaimed)).length === 0 && (
                      <div className="glass-card p-8 text-center space-y-4 border-dashed border-white/10">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                          <Sprout className="text-text-secondary opacity-30" size={24} />
                        </div>
                        <p className="text-text-secondary text-[11px] font-bold uppercase tracking-widest leading-relaxed px-4">{t.startYourFirst}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    {/* Completed (Claimed) Sessions List */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <div className="w-1 h-3 bg-accent-cyan rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t.completed}</h3>
                      </div>
                      
                      {deposits.filter(d => d.isClaimed).length > 0 ? (
                        <div className="space-y-3">
                          {deposits.filter(d => d.isClaimed).map(d => (
                            <div key={d.id} className="glass-card p-4 space-y-4 bg-white/[0.01] border border-white/5 relative overflow-hidden group">
                              <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary group-hover:text-accent-blue transition-colors">
                                    <Sprout size={20} />
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest leading-none mb-1">{new Date(d.endTime).toLocaleDateString()}</div>
                                    <div className="text-sm font-black text-white">{t.completed}</div>
                                  </div>
                                </div>
                                <div className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/10 text-[9px] font-black text-green-400 uppercase tracking-widest">
                                  Claimed
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="space-y-1">
                                  <div className="text-[8px] text-text-secondary font-black uppercase tracking-widest">{t.purchase}</div>
                                  <div className="text-sm font-black text-white">{d.amount} <span className="text-[9px] opacity-40">TON</span></div>
                                </div>
                                <div className="space-y-1 text-right">
                                  <div className="text-[8px] text-white font-black uppercase tracking-widest">{t.tonReward}</div>
                                  <div className="text-sm font-black text-green-400">+{(d.amount + d.bonusTon).toFixed(2)} <span className="text-[9px] opacity-60">TON</span></div>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-white/[0.03] space-y-3 relative z-10">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                  <span className="text-text-secondary">Accumulated Points</span>
                                  <div className="flex items-center gap-1.5 text-accent-blue font-black text-[10px]">
                                    <Zap size={10} className="fill-accent-blue" />
                                    +{d.earnedDspt.toFixed(0)} DSPT
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="glass-card p-8 text-center space-y-4 border-dashed border-white/10">
                          <p className="text-text-secondary text-[11px] font-bold uppercase tracking-widest">{t.noTransactions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </motion.div>
        );

      case 'farming':
        return (
          <FarmingScreen 
            onStart={startFarming} 
            tonBalance={user.tonBalance} 
            activeBoost={user.activeBoost} 
            onBack={() => setScreen('home')} 
            onShowInfo={() => setShowFarmingInfo(true)}
            t={t} 
          />
        );
      
      case 'boost':
        return <BoostScreen onActivate={activateBoost} currentBoost={user.activeBoost} onBack={() => setScreen('home')} t={t} />;

      case 'tasks':
        return (
          <TasksScreen 
            tasks={tasks} 
            onTaskAction={(taskId, action) => {
              if (action === 'start') {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                  window.open(task.url, '_blank');
                  setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'check' } : t));
                }
              } else if (action === 'check') {
                // Mocking verification
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'claim' } : t));
              } else if (action === 'claim') {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                  setUser(prev => ({ ...prev, dsptPoints: prev.dsptPoints + task.reward }));
                  setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
                  setNotification({ message: `+${task.reward} DSPT Claimed!`, type: 'success' });
                }
              }
            }}
            t={t}
          />
        );

      case 'airdrop':
        return <AirdropScreen dsptPoints={user.dsptPoints} t={t} lang={lang} />;

      case 'referrals':
        return (
          <ReferralsScreen 
            user={user} 
            onShowInfo={() => setShowReferralInfo(true)} 
            onWithdraw={withdrawReferralRewards}
            t={t} 
          />
        );

      case 'profile':
        return (
          <ProfileScreen 
            user={user} 
            deposits={deposits} 
            transactions={transactions}
            onUpgrade={upgradePremium} 
            t={t} 
            lang={lang} 
            setLang={setLang}
            onDeposit={() => { setWalletTab('deposit'); setShowUnifiedWalletModal(true); }}
            onWithdraw={() => { setWalletTab('withdraw'); setShowUnifiedWalletModal(true); }}
            onCompleteAll={completeAllFarmings}
            onShowRules={() => setShowRulesModal(true)}
            onShowWallet={() => setShowWalletModal(true)}
            onShowUnifiedWallet={() => setShowUnifiedWalletModal(true)}
            onOpenCase={openCase}
            fastFarmingMode={fastFarmingMode}
            setFastFarmingMode={setFastFarmingMode}
          />
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden flex flex-col bg-background select-none touch-none"
      onContextMenu={(e) => e.preventDefault()}
      style={{ isolation: 'isolate', width: '100vw', height: '100vh' }}
    >
      <div className="flex-1 overflow-y-auto pb-24 scroll-container w-full" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
        <div className="max-w-md mx-auto relative px-0 w-full overflow-hidden">
          <AnimatePresence>
            {notification && (
              <Toast 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification(null)} 
              />
            )}
          </AnimatePresence>

          <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {renderScreen()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <BottomNav currentScreen={screen === 'boost' ? 'home' : screen} setScreen={setScreen} t={t} />
        </div>
      </div>

      {/* Modals */}
      <UnifiedWalletModal 
        isOpen={showUnifiedWalletModal}
        onClose={() => setShowUnifiedWalletModal(false)}
        user={user}
        transactions={transactions}
        onDeposit={() => handleDeposit(parseFloat(transactionAmount))}
        onWithdraw={() => handleWithdraw(parseFloat(transactionAmount))}
        transactionAmount={transactionAmount}
        setTransactionAmount={setTransactionAmount}
        t={t}
        initialTab={walletTab}
      />

      <AnimatePresence>
        {showFarmingInfo && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setShowFarmingInfo(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={SMOOTH_SPRING}
              className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    <Info size={20} />
                  </div>
                  <h3 className="text-xl font-black">{t.farmingInfo}</h3>
                </div>
                <button onClick={() => setShowFarmingInfo(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.startYourFirst}
                </p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    <span className="text-xs font-bold text-text-secondary">{t.farmingInfo1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs font-bold text-text-secondary">{t.farmingInfo2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                    <span className="text-xs font-bold text-text-secondary">{t.farmingInfo3}</span>
                  </div>
                </div>

                <div className="bg-accent-blue/5 border border-accent-blue/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue flex-shrink-0">
                    <Gift size={20} className="animate-pulse" />
                  </div>
                  <p className="text-[11px] font-bold text-white/90 leading-tight tracking-tight">
                    {t.farmingCaseNotice}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[11px] text-text-secondary italic leading-relaxed opacity-60">
                    {t.incentiveProgramDesc}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowFarmingInfo(false)}
                className="w-full py-4 gradient-accent rounded-2xl font-black text-lg shadow-xl shadow-accent-blue/20"
              >
                {t.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RulesModal 
        isOpen={showRulesModal} 
        onClose={() => setShowRulesModal(false)} 
        t={t} 
        lang={lang} 
      />

      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSave={(address) => setUser(prev => ({ ...prev, walletAddress: address }))}
        currentAddress={user.walletAddress}
        t={t}
      />

      <PremiumModal 
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onBuy={handleBuyPremium}
        t={t}
      />

      <AnimatePresence>
        {showRewardPoolModal && (
          <RewardPoolModal 
            onClose={() => setShowRewardPoolModal(false)}
            t={t}
          />
        )}
      </AnimatePresence>

      <CaseModal 
        isOpen={showCaseModal}
        onClose={() => {
          if (!openingCase) {
            setShowCaseModal(false);
            setCaseReward(null);
          }
        }}
        opening={openingCase}
        reward={caseReward}
        t={t}
      />

      <AnimatePresence>
        {showAirdropInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAirdropInfo(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-sm relative z-10"
            >
              <h3 className="text-xl font-bold mb-4">{t.tokenomicsTitle}</h3>
              <div className="space-y-4 text-sm text-text-secondary">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>{t.communityAirdrop}</span>
                  <span className="text-white font-bold">60%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>{t.ecosystemGrowth}</span>
                  <span className="text-white font-bold">20%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>{t.teamAdvisors}</span>
                  <span className="text-white font-bold">10%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>{t.liquidityPool}</span>
                  <span className="text-white font-bold">10%</span>
                </div>
                <p className="pt-2 italic">
                  {t.tokenomicsDesc}
                </p>
              </div>
              <button 
                onClick={() => setShowAirdropInfo(false)}
                className="w-full mt-6 py-3 bg-white/5 rounded-xl font-bold"
              >
                {t.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Referral Info Modal */}
      <AnimatePresence>
        {showReferralInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReferralInfo(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-sm relative z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black">{t.referralInfo}</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.referralInfoDesc}
                </p>
                
                <div className="bg-white/5 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-secondary">{t.tonReward}</span>
                    <span className="text-sm font-black text-accent-blue">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-secondary">{t.dsptReward}</span>
                    <span className="text-sm font-black text-accent-cyan">30%</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowReferralInfo(false)}
                className="w-full mt-6 py-4 gradient-accent rounded-xl font-black text-lg shadow-xl shadow-accent-blue/20"
              >
                {t.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Screens ---

const FarmingScreen = ({ onStart, tonBalance, activeBoost, onBack, onShowInfo, t }: { onStart: (a: number, d: number) => void, tonBalance: number, activeBoost: number, onBack: () => void, onShowInfo: () => void, t: any }) => {
  const [amount, setAmount] = useState<string>('10');
  const [days, setDays] = useState(7);

  const estimatedDspt = calculateDsptPoints(parseFloat(amount) || 0, days);
  const boostMultiplier = 1 + (activeBoost / 100);
  const totalEstimatedDspt = estimatedDspt * boostMultiplier;
  const rewardPercent = calculateTonRewardPercent(days);
  const bonusTon = (parseFloat(amount) || 0) * (rewardPercent / 100);
  const totalReward = (parseFloat(amount) || 0) + bonusTon;

  const smoothTransition = SMOOTH_SPRING;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={smoothTransition}
      className="px-6 pt-5 pb-24 space-y-6 w-full max-w-full overflow-hidden"
    >
      <div className="glass-card p-5 space-y-6 relative overflow-hidden mt-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        {/* Info button moved inside */}
        <button 
          onClick={onShowInfo}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent-blue shadow-lg hover:bg-white/10 transition-all z-20"
        >
          <Info size={16} />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-blue/80">
              {t.enterAmount}
            </label>
            <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
              <Database size={10} className="text-accent-blue" />
              <span className="text-[10px] font-black text-text-secondary">
                {tonBalance.toFixed(2)} <span className="opacity-40 font-bold">TON</span>
              </span>
            </div>
          </div>
          <div className="relative group">
            <input 
              type="number" 
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-xl font-black focus:outline-none focus:border-accent-blue focus:bg-white/[0.07] transition-all"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-text-secondary tracking-tighter text-sm">TON</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-cyan/80">
              {t.duration}
            </label>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Clock size={10} className="text-accent-cyan" />
              <span className="text-[10px] font-black text-text-secondary">
                {days} <span className="opacity-40 font-bold">{t.days}</span>
              </span>
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="4" 
            step="1"
            value={[1, 3, 7, 14, 30].indexOf(days)}
            onChange={(e) => setDays([1, 3, 7, 14, 30][parseInt(e.target.value)])}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
          />
          <div className="grid grid-cols-5 gap-2">
            {[1, 3, 7, 14, 30].map(d => (
              <button 
                key={d}
                onClick={() => setDays(d)}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                  days === d ? 'bg-accent-blue text-white shadow-lg' : 'bg-white/5 text-text-secondary'
                }`}
              >
                {d >= 7 && <Gift size={10} className={days === d ? 'text-white' : 'text-accent-blue'} />}
                {d}D
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(0,210,255,0.5)]" />
              <span className="text-[10px] font-bold text-text-secondary">{t.earnedDspt}</span>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-accent-blue">+{totalEstimatedDspt.toFixed(0)} <span className="text-[9px] opacity-50">DSPT</span></div>
              {activeBoost > 0 && (
                <div className="text-[9px] font-bold text-accent-cyan">
                  +{estimatedDspt.toFixed(0)} {t.base} + {(totalEstimatedDspt - estimatedDspt).toFixed(0)} {t.bonus}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
              <span className="text-[10px] font-bold text-text-secondary">{t.tonReward}</span>
            </div>
            <span className="text-base font-black text-green-400">+{totalReward.toFixed(2)} <span className="text-[9px] opacity-50">TON</span></span>
          </div>
        </div>

        <button 
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > tonBalance}
          onClick={() => onStart(parseFloat(amount), days)}
          className="w-full gradient-accent py-3.5 rounded-xl font-black text-sm shadow-lg shadow-accent-blue/20 disabled:opacity-50 disabled:grayscale transition-all active:scale-[0.98]"
        >
          {t.startFarming}
        </button>
      </div>
    </motion.div>
  );
};

const BoostScreen = ({ onActivate, currentBoost, onBack, t }: { onActivate: (v: number) => void, currentBoost: number, onBack: () => void, t: any }) => {
  const smoothTransition = SMOOTH_SPRING;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={smoothTransition}
      className="px-6 pt-5 space-y-6 w-full max-w-full overflow-hidden"
    >
    <div className="space-y-1">
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-6 bg-accent-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{t.boostDsptRewards}</h2>
      </div>
      <p className="text-text-secondary text-sm pl-3.5">{t.increasePointAccumulation}</p>
    </div>

    <div className="space-y-4">
      {BOOST_OPTIONS.map(opt => (
        <div key={opt.id} className={`glass-card p-5 flex justify-between items-center ${currentBoost === opt.value ? 'border-accent-blue bg-accent-blue/5' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
              <Zap size={24} fill={currentBoost === opt.value ? "currentColor" : "none"} />
            </div>
            <div>
              <div className="text-xl font-black">{opt.label}</div>
              <div className="text-xs text-text-secondary">{t.pointsBonus}</div>
            </div>
          </div>
          <button 
            onClick={() => onActivate(opt.value)}
            disabled={currentBoost === opt.value}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
              currentBoost === opt.value 
                ? 'bg-accent-blue/20 text-accent-blue' 
                : 'gradient-accent shadow-lg shadow-accent-blue/20'
            }`}
          >
            {currentBoost === opt.value ? t.activeStatus : t.activateAction}
          </button>
        </div>
      ))}
    </div>

    <div className="bg-white/5 p-4 rounded-xl flex gap-3 items-start">
      <Info size={16} className="text-text-secondary mt-0.5" />
      <p className="text-xs text-text-secondary leading-relaxed">
        {t.boostDisclaimer}
      </p>
    </div>
  </motion.div>
);
};

const TasksScreen = ({ tasks, onTaskAction, t }: { tasks: any[], onTaskAction: (id: string, action: 'start' | 'check' | 'claim') => void, t: any }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'social' | 'daily'>('all');
  
  const DsptCoin = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <div 
      style={{ width: size, height: size }}
      className={`relative rounded-full bg-gradient-to-tr from-[#0088CC] via-accent-blue to-[#66CCFF] flex items-center justify-center font-black text-white shadow-[0_2px_10px_rgba(0,184,255,0.4)] border border-[#00A3FF]/50 overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <span style={{ fontSize: size * 0.55 }} className="relative z-10 drop-shadow-md">D</span>
      <div className="absolute inset-0 bg-white/5 animate-pulse opacity-30" />
    </div>
  );

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'social') return task.id.startsWith('tg_') || task.type === 'social';
    if (activeTab === 'daily') return task.id.startsWith('daily_') || task.type === 'daily';
    return true;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32 pt-2 px-6 space-y-7 w-full max-w-full overflow-hidden"
    >
      {/* Modern Progress Visualization */}
      <div className="glass-card p-5 space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-blue/5 to-transparent pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/90">{t.taskCompletionProgress}</div>
              <div className="text-[8px] font-bold text-text-secondary uppercase tracking-widest">Total Performance</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-accent-blue tracking-tighter leading-none">{progress.toFixed(0)}%</div>
            <div className="text-[8px] font-bold text-accent-blue/50 uppercase tracking-widest">Complete</div>
          </div>
        </div>
        
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full gradient-accent relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>

        <div className="pt-1 flex items-center gap-2">
          <Gift size={12} className="text-accent-blue animate-pulse" />
          <p className="text-[9px] font-bold text-text-secondary leading-tight">
            {t.completeTasksBonus}
          </p>
        </div>
      </div>

      {/* Advanced Tabs Selector */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 relative">
        {[
          { id: 'all', label: 'All', icon: LayoutGrid },
          { id: 'social', label: 'Social', icon: Send },
          { id: 'daily', label: 'Daily', icon: Timer }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-accent-blue rounded-xl shadow-lg shadow-accent-blue/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon size={14} className="relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Highly Polished Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isTG = task.id.startsWith('tg_') || task.type === 'social';
            const isCompleted = task.status === 'completed';
            const isClaimable = task.status === 'claim';
            const isChecking = task.status === 'check';

            return (
              <div 
                key={task.id}
                className={`group relative overflow-hidden rounded-[2rem] p-[1px] transition-all duration-300 ${
                  isCompleted ? 'opacity-40 grayscale-[0.5]' : 'active:scale-[0.98]'
                }`}
              >
                <div className={`absolute inset-0 rounded-[2rem] transition-opacity duration-500 opacity-20 ${
                  isClaimable ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' :
                  isChecking ? 'bg-gradient-to-tr from-[#FF9500] to-[#FFCC00]' :
                  'bg-gradient-to-tr from-accent-blue to-accent-cyan'
                }`} />
                
                <div className="relative bg-[#1A1A1A] rounded-[1.95rem] p-5 flex items-center gap-4">
                  {/* Status Glow for Claimable Tasks */}
                  {isClaimable && (
                    <div className="absolute top-0 right-10 w-20 h-1 bg-yellow-400 blur-md rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
                  )}

                  {/* Task Icon Capsule */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all shadow-inner ${
                    isCompleted ? 'bg-white/5 text-white/20' : 
                    isClaimable ? 'bg-yellow-400/10 text-yellow-500' :
                    isTG ? 'bg-[#0088CC]/10 text-[#0088CC]' : 'bg-accent-blue/10 text-accent-blue'
                  }`}>
                    <div className="absolute inset-0 bg-white/5 opacity-50" />
                    {isCompleted ? <Check size={28} /> : 
                     isTG ? <Send size={28} /> : 
                     isClaimable ? <Gift size={28} /> : <Target size={28} />}
                  </div>

                  {/* Task Content Holder */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                        isCompleted ? 'bg-white/5 text-white/20' :
                        isTG ? 'bg-[#0088CC]/10 text-[#0088CC]' : 'bg-accent-blue/10 text-accent-blue'
                      }`}>
                        {isTG ? 'Social' : 'Quest'}
                      </span>
                      {task.isNew && !isCompleted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                      )}
                    </div>
                    <h3 className={`text-sm font-black truncate ${isCompleted ? 'text-text-secondary line-through' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                       <DsptCoin size={15} />
                       <span className={`text-xs font-black tracking-tight ${isCompleted ? 'text-text-secondary' : 'text-accent-blue'}`}>
                         +{task.reward.toLocaleString()} <span className="text-[10px] opacity-60">DSPT</span>
                       </span>
                    </div>
                  </div>

                  {/* Elevated Action Button */}
                  <button
                    disabled={isCompleted}
                    onClick={() => onTaskAction(task.id, task.status as any)}
                    className={`relative flex-shrink-0 min-w-[80px] h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all group/btn active:scale-95 ${
                      isCompleted ? 'bg-white/5 text-white/20' :
                      isClaimable ? 'bg-yellow-500 text-black shadow-[0_5px_15px_rgba(234,179,8,0.3)]' :
                      isChecking ? 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/20' :
                      'bg-accent-blue text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]'
                    }`}
                  >
                    {activeTab === 'all' && isClaimable && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card" />
                    )}
                    
                    <div className="relative z-10 flex items-center justify-center gap-1.5">
                      {isCompleted ? (
                        <CheckCircle2 size={14} />
                      ) : isClaimable ? (
                        <div className="flex items-center gap-1">
                          <span>Claim</span>
                        </div>
                      ) : isChecking ? (
                        <div className="flex items-center gap-1">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                            <Timer size={12} />
                          </motion.div>
                          <span>Checking</span>
                        </div>
                      ) : (
                        <span>Open</span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative">
              <div className="absolute inset-0 bg-accent-blue/5 blur-xl rounded-full" />
              <LayoutList size={32} className="text-text-secondary opacity-20 relative z-10" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">{t.noTasks || "No Tasks Found"}</p>
              <p className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
                Check back later for new mission updates and rewards
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Aesthetic Footer Note */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-[#111] border border-white/5 p-5 rounded-[2rem] flex gap-4 items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue" />
        <div className="w-10 h-10 rounded-xl bg-accent-blue/5 flex items-center justify-center text-accent-blue flex-shrink-0">
          <Zap size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Stay Active</p>
          <p className="text-[9px] font-bold text-text-secondary leading-tight uppercase tracking-wider">
            {t.newTasksAdded || "New performance tasks are added every 24 hours"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AirdropScreen = ({ dsptPoints, t, lang }: { dsptPoints: number, t: any, lang: string }) => {
  const [showTokenomics, setShowTokenomics] = useState(false);

  // Mock data for daily statistics
  const dailyStats = [
    { day: '09.04', amount: 120 },
    { day: '10.04', amount: 150 },
    { day: '11.04', amount: 180 },
    { day: '12.04', amount: 140 },
    { day: '13.04', amount: 210 },
    { day: '14.04', amount: 280 },
    { day: '15.04', amount: 320 },
  ];

  const roadmap = [
    { name: t.roadmapStep1, status: 'completed' },
    { name: t.roadmapStep2, status: 'active' },
    { name: t.roadmapStep3, status: 'pending' },
    { name: t.roadmapStep4, status: 'pending' },
    { name: t.roadmapStep5, status: 'pending' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SMOOTH_SPRING}
      className="px-6 pt-5 pb-24 space-y-5 w-full max-w-full overflow-hidden"
    >
      {/* Top Bar: Title & Tokenomics */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-accent-blue rounded-full" />
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">{t.airdrop}</h2>
        </div>
        <button 
          onClick={() => setShowTokenomics(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-text-secondary uppercase tracking-widest hover:text-white transition-colors"
        >
          <Database size={12} />
          {t.tokenomics}
        </button>
      </div>

      {/* Main Stats Hub */}
      <div className="space-y-3">
        {/* Total Farmed Large Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-[#0A0A0B] to-[#121214] border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-3xl rounded-full" />
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em]">{t.yourAllocation}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white italic tracking-tighter">{dsptPoints.toFixed(0)}</span>
                <span className="text-xs font-black text-white/40 uppercase">DSPT</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
              <Gift size={24} />
            </div>
          </div>

          <div className="h-24 w-full relative z-10 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorDspt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121214', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontFamily: 'inherit',
                    fontWeight: 900,
                    color: '#fff',
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#3B82F6' }}
                  cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorDspt)" 
                  strokeWidth={2}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
            <span>Last 7 Days</span>
            <span>Mining Trend</span>
          </div>
        </div>

        {/* Participants & Supply Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.04)" }}
            className="glass-card p-4 border-white/5 bg-[#0D0D0E]/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                <Users size={10} />
              </div>
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{t.participants}</span>
            </div>
            <div className="text-xl font-black text-white italic">253.4K</div>
            <div className="text-[8px] font-bold text-accent-cyan uppercase tracking-widest mt-1 opacity-70">Active Miners</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.04)" }}
            className="glass-card p-4 border-white/5 bg-[#0D0D0E]/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Coins size={10} />
              </div>
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{t.totalSupply}</span>
            </div>
            <div className="text-xl font-black text-white italic">100M</div>
            <div className="text-[8px] font-bold text-yellow-500 uppercase tracking-widest mt-1 opacity-70">Total Limit</div>
          </motion.div>
        </div>
      </div>

      {/* Roadmap - Compact Stepper */}
      <div className="glass-card p-5 border-white/5 bg-[#0D0D0E]/30 space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-accent-blue" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.airdropRoadmap}</h3>
        </div>
        
        <div className="flex justify-between items-center relative py-2">
          <div className="absolute left-0 right-0 h-0.5 bg-white/5 z-0" />
          {roadmap.map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-3 h-3 rounded-full border-2 border-background transition-all duration-500 ${
                item.status === 'completed' ? 'bg-green-500' : 
                item.status === 'active' ? 'bg-accent-blue ring-4 ring-accent-blue/20 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.4)]' : 
                'bg-white/20'
              }`} />
              <span className={`text-[7px] font-black uppercase tracking-tighter ${
                item.status === 'pending' ? 'text-white/20' : 'text-white/60'
              } max-w-[50px] text-center truncate`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 group transition-all"
          >
            <TrendingUp size={14} className="text-accent-blue group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Strategy</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 group transition-all"
          >
            <ExternalLink size={14} className="text-accent-cyan group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Community</span>
          </motion.button>
        </div>

        {/* Claim Button - Disabled */}
        <div className="relative group cursor-not-allowed pt-2">
          <button 
            disabled
            className="w-full py-5 rounded-[2rem] bg-white/5 border border-white/5 font-black text-xs uppercase tracking-[0.3em] text-white/10 flex items-center justify-center gap-3 overflow-hidden shadow-inner shadow-black/40 transition-all"
          >
            <Shield size={16} />
            Claim Allocation
          </button>
          
          {/* Tooltip Overlay */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-accent-blue text-white text-[9px] font-black uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 group-hover:-top-10 transition-all shadow-xl shadow-accent-blue/20 z-50 whitespace-nowrap">
            Coming in Q4 2026
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-accent-blue" />
          </div>
        </div>
      </div>

      {/* Tokenomics Overlay */}
      <AnimatePresence>
        {showTokenomics && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050505]/98 backdrop-blur-3xl overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm glass-card p-8 space-y-8 relative border-white/10 shadow-2xl shadow-accent-blue/10"
            >
              <button 
                onClick={() => setShowTokenomics(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-text-secondary hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase italic leading-none">{t.tokenomics}</h3>
                <div className="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em] opacity-80">DSPT Token Matrix</div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Community', val: '60%', color: 'bg-accent-blue', desc: 'Active mining & referrals' },
                  { label: 'Liquidity', val: '20%', color: 'bg-accent-cyan', desc: 'Exchange pools & stability' },
                  { label: 'Team', val: '10%', color: 'bg-white/40', desc: 'Development & ecosystem' },
                  { label: 'Marketing', val: '10%', color: 'bg-white/10', desc: 'Growth & partnerships' }
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-1 rounded-full ${d.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-black text-white uppercase tracking-tight">{d.label}</span>
                        <span className="text-sm font-black text-white italic">{d.val}</span>
                      </div>
                      <div className="text-[8px] font-bold text-text-secondary uppercase tracking-widest">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{t.totalSupply}</div>
                <div className="text-3xl font-black text-white tracking-tighter leading-none">100,000,000 <span className="text-xs text-white/40">DSPT</span></div>
              </div>

              <p className="text-[10px] text-center text-text-secondary italic leading-relaxed px-4 opacity-60">
                "{t.dsptTokenCore}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ReferralsScreen = ({ user, onShowInfo, onWithdraw, t }: { user: UserProfile, onShowInfo: () => void, onWithdraw: () => void, t: any }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://t.me/farmDSPT?start=ref_${user.username || 'user'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    const text = `🚀 Join the DSPT ecosystem! Start farming TON and DSPT points today. Use my link to get a bonus! 💎\n\n${referralLink}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const DsptCoin = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <div 
      style={{ width: size, height: size }}
      className={`relative rounded-full bg-gradient-to-tr from-[#0088CC] via-accent-blue to-[#66CCFF] flex items-center justify-center font-black text-white shadow-[0_2px_8px_rgba(0,184,255,0.4)] border border-[#00A3FF]/50 overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <span style={{ fontSize: size * 0.55 }} className="relative z-10 drop-shadow-md">D</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 pt-5 pb-32 space-y-6 w-full max-w-full overflow-hidden"
    >
      {/* High-End Rewards Concept: The Dual Vault */}
      <div className="relative">
        <div className="absolute inset-0 bg-accent-blue/5 blur-[60px] rounded-full pointer-events-none" />
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {/* TON Reward Capsule */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-5 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center space-y-3 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0088CC] blur-sm opacity-50" />
            <div className="w-12 h-12 rounded-2xl bg-[#0088CC]/10 flex items-center justify-center text-[#0088CC] mb-1 shadow-inner shadow-[#0088CC]/20 border border-[#0088CC]/10">
              <img 
                src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=035" 
                alt="TON" 
                className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{t.referralRewardTon || "TON Reward"}</span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl font-black text-white italic tracking-tighter">
                  {user.referralRewardsTon.toFixed(2)}
                </span>
                <span className="text-[9px] font-black text-[#0088CC] uppercase mt-1">TON</span>
              </div>
            </div>
            <p className="text-[8px] font-bold text-text-secondary/40 uppercase tracking-widest italic leading-none pt-2 border-t border-white/5 w-full">Claimable Assets</p>
          </motion.div>

          {/* DSPT Points Capsule */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-5 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center space-y-3 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue blur-sm opacity-50" />
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center mb-1 shadow-inner shadow-accent-blue/20 border border-accent-blue/10">
              <DsptCoin size={28} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{t.dsptReward || "DSPT Points"}</span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl font-black text-white italic tracking-tighter">
                  {user.referralRewardsDspt.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-[8px] font-bold text-text-secondary/40 uppercase tracking-widest italic leading-none pt-2 border-t border-white/5 w-full">Pending Yield</p>
          </motion.div>
        </div>

        {/* Unified Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onWithdraw}
            disabled={user.referralRewardsTon <= 0 && user.referralRewardsDspt <= 0}
            className="w-full py-4 rounded-2xl gradient-accent shadow-xl shadow-accent-blue/20 text-white font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-30 disabled:grayscale transition-all"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative z-10 flex items-center gap-3">
              <ShieldCheck size={18} />
              <span>{t.claimRewards || "Claim Total Reward"}</span>
              <ChevronRight size={16} />
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Referral Link Capsule Section */}
      <div className="space-y-3">
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-2">{t.referralLink || "Your Link"}</span>
        <div className="glass-card p-2 rounded-2xl flex items-center gap-2 border-white/5 bg-white/[0.02]">
          <div className="flex-1 px-4 py-3 bg-black/20 rounded-xl border border-white/5 overflow-hidden">
            <p className="text-[10px] font-bold text-text-secondary truncate select-all">{referralLink}</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                copied 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleInvite}
              className="w-11 h-11 rounded-xl bg-accent-blue flex items-center justify-center text-white shadow-lg shadow-accent-blue/20 hover:brightness-110 transition-all"
            >
              <UserPlus size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Friends List Container */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-accent-blue rounded-full" />
            <h3 className="text-sm font-black uppercase text-white italic tracking-tighter">{t.referralList}</h3>
          </div>
          <div className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 min-w-[90px]">
            <span className="text-[9px] font-black text-accent-blue uppercase tracking-[0.15em] text-center leading-none flex items-center">
              Total: {user.referrals.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {user.referrals.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/5">
                <Users size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.3em]">{t.noFriends || "Circle is empty"}</p>
                <p className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest max-w-[200px] leading-relaxed">
                  Join forces with friends to accelerate your platform growth
                </p>
              </div>
            </div>
          ) : (
            user.referrals.map((ref) => (
              <div 
                key={ref.id}
                className="group relative overflow-hidden bg-[#1A1A1A] border border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between hover:bg-[#222] transition-colors duration-200"
              >
                <div className="relative z-10 flex items-center gap-4">
                  {/* Circular Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-accent-blue/10 border border-white/10 flex items-center justify-center overflow-hidden">
                      {ref.avatar ? (
                        <img src={ref.avatar} alt={ref.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-lg font-black text-accent-blue italic">{ref.name[0]}</span>
                      )}
                    </div>
                    {ref.isPremium && (
                      <div className="absolute -top-1 -right-1">
                        <BadgeCheck size={14} className="text-[#0088CC] fill-[#0088CC] text-white" />
                      </div>
                    )}
                  </div>

                   <div className="min-w-0">
                    <h4 className="text-[13px] font-black text-white mb-0.5 truncate max-w-[140px] uppercase tracking-tighter italic">{ref.name}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-text-secondary/40 uppercase tracking-widest">{ref.date}</span>
                       <span className="px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan text-[7px] font-black uppercase tracking-tighter">{ref.rank}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 text-right space-y-1">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-black text-white italic">+{ref.earnedTon.toFixed(2)}</span>
                    <span className="text-[8px] font-bold text-accent-blue uppercase tracking-tighter">TON</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[9px] font-black text-text-secondary">+{ref.earnedDspt.toLocaleString()}</span>
                    <DsptCoin size={10} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RulesModal = ({ isOpen, onClose, t, lang }: { isOpen: boolean, onClose: () => void, t: any, lang: string }) => {
  if (!isOpen) return null;

  const rulesContent = lang === 'ru' ? `
1. Общая концепция

1.1. Платформа DSPT — это внутренняя цифровая экосистема, где пользователи могут фармить DSPT поинты.

1.2. DSPT поинты — это внутренняя единица платформы, которая в будущем может быть обменяна на токены DSPT в рамках дропа.

1.3. Платформа предоставляет временные бонусные начисления в TON как поощрение за участие, стимулирующее фарминг DSPT.

1.4. Участие является полностью добровольным, внесённые средства TON не являются инвестициями и не гарантируют дохода или возврата.

⸻

2. Фарминг DSPT

2.1. Пользователь может начать фарминг, внося TON для участия.

2.2. Количество DSPT поинтов зависит от:
	•	суммы внесённых TON
	•	выбранного периода фарминга
	•	активированных бустеров (+5%, +10%, +15%)

2.3. DSPT поинты фиксируются на аккаунте пользователя и могут быть обменяны на токены DSPT только при дропе по правилам платформы.

2.4. DSPT поинты не имеют стоимости за пределами платформы и действуют исключительно внутри экосистемы.

⸻

3. Бонусные начисления в TON

3.1. Бонусы TON начисляются как поощрение за участие и зависят от текущих условий платформы.

3.2. Начисления могут быть изменены, приостановлены или прекращены администрацией в любое время без предварительного уведомления.

3.3. Бонусы TON начисляются только на активные фарминговые депозиты и не являются обязательными выплатами.

⸻

4. Бустеры и премиум-подписка

4.1. Бустеры DSPT:
	•	Временное увеличение фарминга DSPT поинтов на 5%, 10% или 15%
	•	Не влияют на начисления бонусов TON

4.2. Премиум-подписка:
	•	Позволяет вести до 3 активных фармингов одновременно
	•	Не увеличивает фарм DSPT и не влияет на бонусы TON

⸻

5. Общий пул платформы

5.1. Все внесённые TON формируют общий пул платформы, используемый для:
	•	начислений DSPT поинтов
	•	бонусов TON
	•	проведения акций и развития экосистемы

5.2. Администрация оставляет за собой право перераспределять средства пула исключительно для поддержания и развития платформы, без возврата участникам.

⸻

6. Дроп токенов DSPT

6.1. DSPT токены — ограниченный цифровой актив платформы (100 000 000 единиц).

6.2. Для команды платформы выделено 20 000 000 DSPT для развития, управления экосистемой и проведения акций, включая возможность сжигания части токенов.

6.3. Обмен DSPT поинтов на токены DSPT осуществляется только по правилам дропа, установленным администрацией.

6.4. DSPT токены используются для:
	•	премиум-функций платформы
	•	участия в бонусных программах
	•	получения цифровых товаров и сервисов внутри экосистемы

⸻

7. Юридические и добровольные условия

7.1. Участие полностью добровольное.

7.2. Внесённые TON не рассматриваются как инвестиции и не гарантируют возврата.

7.3. Начисления DSPT поинтов и бонусов TON являются поощрительными и не являются доходом.

7.4. Администрация может:
	•	изменять условия начислений
	•	приостанавливать или прекращать акции
	•	корректировать механику фарминга DSPT

7.5. Все изменения направлены на поддержание устойчивости и функциональности экосистемы.
  ` : `
1. General Concept

1.1. The DSPT platform is an internal digital ecosystem where users can farm DSPT points.

1.2. DSPT points are an internal unit of the platform that can be exchanged for DSPT tokens in the future as part of a drop.

1.3. The platform provides temporary bonus TON accruals as an incentive for participation, stimulating DSPT farming.

1.4. Participation is completely voluntary, TON funds deposited are not investments and do not guarantee income or return.

⸻

2. DSPT Farming

2.1. A user can start farming by depositing TON for participation.

2.2. The number of DSPT points depends on:
	• the amount of TON deposited
	• the selected farming period
	• activated boosters (+5%, +10%, +15%)

2.3. DSPT points are fixed on the user's account and can be exchanged for DSPT tokens only during the drop according to the platform rules.

2.4. DSPT points have no value outside the platform and operate exclusively within the ecosystem.

⸻

3. Bonus Accruals in TON

3.1. TON bonuses are accrued as an incentive for participation and depend on the current conditions of the platform.

3.2. Accruals can be changed, suspended or terminated by the administration at any time without prior notice.

3.3. TON bonuses are accrued only on active farming deposits and are not mandatory payments.

⸻

4. Boosters and Premium Subscription

4.1. DSPT Boosters:
	• Temporary increase in DSPT points farming by 5%, 10% or 15%
	• Do not affect TON bonus accruals

4.2. Premium Subscription:
	• Allows up to 3 active farmings simultaneously
	• Does not increase DSPT farming and does not affect TON bonuses

⸻

5. General Platform Pool

5.1. All TON deposited form the general platform pool used for:
	• DSPT points accruals
	• TON bonuses
	• conducting promotions and ecosystem development

5.2. The administration reserves the right to redistribute pool funds exclusively to maintain and develop the platform, without return to participants.

⸻

6. DSPT Token Drop

6.1. DSPT tokens are a limited digital asset of the platform (100,000,000 units).

6.2. 20,000,000 DSPT are allocated for the platform team for development, ecosystem management and promotions, including the possibility of burning part of the tokens.

6.3. Exchange of DSPT points for DSPT tokens is carried out only according to the drop rules established by the administration.

6.4. DSPT tokens are used for:
	• premium platform features
	• participation in bonus programs
	• receiving digital goods and services within the ecosystem

⸻

7. Legal and Voluntary Conditions

7.1. Participation is completely voluntary.

7.2. TON deposited are not considered as investments and do not guarantee return.

7.3. DSPT points and TON bonus accruals are incentive-based and do not constitute income.

7.4. The administration can:
	• change accrual conditions
	• suspend or terminate promotions
	• adjust DSPT farming mechanics

7.5. All changes are aimed at maintaining the stability and functionality of the ecosystem.
  `;

  const smoothTransition = SMOOTH_SPRING;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={smoothTransition}
        className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-lg font-black tracking-tight">{t.rulesTitle}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
          {rulesContent.trim()}
        </div>
        <div className="p-6 bg-white/5 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full py-4 gradient-accent rounded-2xl font-black text-lg shadow-xl shadow-accent-blue/20"
          >
            {t.gotIt}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const UnifiedWalletModal = ({ 
  isOpen, 
  onClose, 
  user, 
  transactions, 
  onDeposit, 
  onWithdraw, 
  transactionAmount, 
  setTransactionAmount, 
  t,
  initialTab = 'deposit'
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  user: UserProfile, 
  transactions: Transaction[], 
  onDeposit: () => void, 
  onWithdraw: () => void, 
  transactionAmount: string, 
  setTransactionAmount: (a: string) => void, 
  t: any,
  initialTab?: 'deposit' | 'withdraw'
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(initialTab);

  if (!isOpen) return null;

  const filteredTransactions = transactions.filter(tx => tx.type === activeTab);
  const predefinedAmounts = [5, 10, 20, 50, 100];
  const smoothTransition = SMOOTH_SPRING;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={smoothTransition}
        className="relative w-full max-w-md bg-card border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header with Tabs */}
        <div className="p-6 border-b border-white/5 space-y-6 bg-white/[0.02]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight">{t.walletActions}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          <div className="flex bg-background/50 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'deposit' ? 'bg-accent-blue text-white shadow-lg' : 'text-text-secondary hover:text-white'
              }`}
            >
              {t.deposit}
            </button>
            <button 
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'withdraw' ? 'bg-accent-cyan text-white shadow-lg' : 'text-text-secondary hover:text-white'
              }`}
            >
              {t.withdraw}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                {t.enterAmount}
              </label>
              {activeTab === 'withdraw' && (
                <span className="text-[10px] font-bold text-text-secondary">{t.tonBalance}: {user.tonBalance.toFixed(2)} TON</span>
              )}
            </div>
            
            <div className="relative">
              <input 
                type="number" 
                inputMode="decimal"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black text-2xl focus:outline-none transition-colors ${
                  activeTab === 'deposit' ? 'focus:border-accent-blue' : 'focus:border-accent-cyan'
                }`}
                placeholder="0.00"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-text-secondary">TON</div>
            </div>

            {/* Predefined Amounts */}
            <div className="grid grid-cols-5 gap-2">
              {predefinedAmounts.map(amt => (
                <button 
                  key={amt}
                  onClick={() => setTransactionAmount(amt.toString())}
                  className={`py-2 rounded-xl font-black text-[10px] transition-all border ${
                    transactionAmount === amt.toString() 
                      ? (activeTab === 'deposit' ? 'bg-accent-blue border-accent-blue text-white' : 'bg-accent-cyan border-accent-cyan text-white')
                      : 'bg-white/5 border-white/5 text-text-secondary'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Info for Withdrawal */}
          {activeTab === 'withdraw' && (
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">{t.walletAddress}</span>
                {!user.walletAddress && (
                  <span className="text-[9px] font-black text-red-400 uppercase">{t.noWallet}</span>
                )}
              </div>
              <div className="text-xs font-mono break-all text-white/80">
                {user.walletAddress || '—'}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={activeTab === 'deposit' ? onDeposit : onWithdraw}
            disabled={
              activeTab === 'withdraw' && 
              (parseFloat(transactionAmount) > user.tonBalance || !user.walletAddress || parseFloat(transactionAmount) <= 0)
            }
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${
              activeTab === 'deposit' 
                ? 'gradient-accent text-white shadow-accent-blue/20' 
                : 'bg-white text-black shadow-white/10'
            }`}
          >
            {t.confirm}
          </button>

          {/* Transaction History */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 px-1">
              <div className={`w-1 h-3 rounded-full ${activeTab === 'deposit' ? 'bg-accent-blue' : 'bg-accent-cyan'}`} />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t.transactionHistory}</h4>
            </div>

            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{t.noTransactions}</p>
                </div>
              ) : (
                filteredTransactions.map(tx => (
                  <div key={tx.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-white">
                        {new Date(tx.timestamp).toLocaleDateString()} <span className="opacity-40 ml-1">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-[9px] font-mono text-text-secondary truncate max-w-[120px]">
                        {tx.address || user.walletAddress || 'Internal'}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className={`text-sm font-black ${activeTab === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                        {activeTab === 'deposit' ? '+' : '-'}{tx.amount} <span className="text-[10px] opacity-60">TON</span>
                      </div>
                      {activeTab === 'withdraw' && (
                        <div className={`text-[8px] font-black uppercase tracking-widest ${
                          tx.status === 'completed' ? 'text-green-400' : 
                          tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {tx.status === 'completed' ? t.completedStatus : tx.status === 'pending' ? t.pendingStatus : t.failedStatus}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const WalletActionModal = ({ isOpen, onClose, onDeposit, onWithdraw, t }: { isOpen: boolean, onClose: () => void, onDeposit: () => void, onWithdraw: () => void, t: any }) => {
  if (!isOpen) return null;

  const smoothTransition = SMOOTH_SPRING;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={smoothTransition}
        className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black">{t.walletActions}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              onDeposit();
              onClose();
            }}
            className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
              <ArrowDownLeft size={24} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{t.deposit}</span>
          </button>

          <button 
            onClick={() => {
              onWithdraw();
              onClose();
            }}
            className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
              <ArrowUpRight size={24} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{t.withdraw}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const WalletModal = ({ isOpen, onClose, onSave, currentAddress, t }: { isOpen: boolean, onClose: () => void, onSave: (a: string) => void, currentAddress?: string, t: any }) => {
  const [address, setAddress] = useState(currentAddress || '');

  if (!isOpen) return null;

  const smoothTransition = SMOOTH_SPRING;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={smoothTransition}
        className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black">{t.bindWallet}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t.walletAddress}</label>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="UQ..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-base focus:outline-none focus:border-accent-blue transition-colors"
          />
          <p className="text-[10px] text-text-secondary leading-relaxed">{t.enterWallet}</p>
        </div>

        <button 
          onClick={() => {
            onSave(address);
            onClose();
          }}
          className="w-full py-4 gradient-accent rounded-2xl font-black text-lg shadow-xl shadow-accent-blue/20"
        >
          {t.save}
        </button>
      </motion.div>
    </div>
  );
};

const PremiumModal = ({ isOpen, onClose, onBuy, t }: { isOpen: boolean, onClose: () => void, onBuy: (d: 'week' | 'month', p: number) => void, t: any }) => {
  const [selectedPlan, setSelectedPlan] = useState<'week' | 'month'>('month');
  
  if (!isOpen) return null;

  const benefits = [
    { icon: <Zap size={14} />, text: t.premiumBenefit1 },
    { icon: <Shield size={14} />, text: t.premiumBenefit2 },
    { icon: <Users size={14} />, text: t.premiumBenefit3 },
    { icon: <Star size={14} />, text: t.premiumBenefit4 },
  ];

  const plans = [
    { id: 'week', duration: t.week, price: 10, label: t.buyWeek },
    { id: 'month', duration: t.month, price: 25, label: t.buyMonth, best: true }
  ];

  const smoothTransition = SMOOTH_SPRING;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={smoothTransition}
        className="relative w-full max-w-[300px] bg-card border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-10"
      >
        {/* Compact Header */}
        <div className="relative p-5 text-center space-y-2 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-accent-blue/20 blur-[50px] -z-10" />
          
          <motion.div 
            animate={{ 
              rotate: [0, -5, 5, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan shadow-xl shadow-accent-blue/20 mb-1"
          >
            <Crown size={24} className="text-white" fill="currentColor" />
          </motion.div>
          
          <div className="space-y-0.5">
            <h3 className="text-lg font-black tracking-tight uppercase italic leading-none">{t.premiumStatus}</h3>
            <p className="text-[8px] font-black text-text-secondary uppercase tracking-widest">{t.premiumBenefits}</p>
          </div>

          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <X size={16} className="text-text-secondary" />
          </button>
        </div>

        {/* Compact Benefits */}
        <div className="px-5 space-y-1.5">
          <div className="grid grid-cols-1 gap-1">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ...smoothTransition }}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="text-accent-blue opacity-80 shrink-0">
                  {b.icon}
                </div>
                <span className="text-[10px] font-bold tracking-tight leading-tight">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Plan Selection */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {plans.map((plan) => (
              <button 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as 'week' | 'month')}
                className={`relative flex flex-col items-center gap-0.5 p-3 rounded-xl border transition-all duration-300 active:scale-95 ${
                  selectedPlan === plan.id 
                    ? 'bg-accent-blue/10 border-accent-blue/50 shadow-lg shadow-accent-blue/10' 
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                {plan.best && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent-blue text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                    {t.bestValue}
                  </div>
                )}
                <span className={`text-[8px] font-black uppercase tracking-widest ${selectedPlan === plan.id ? 'text-accent-blue' : 'text-text-secondary'}`}>
                  {plan.duration}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-black tracking-tighter">{plan.price}</span>
                  <span className="text-[7px] font-black opacity-60">{t.ton}</span>
                </div>
                
                {/* Selection Indicator */}
                <div className={`absolute bottom-1.5 w-1 h-1 rounded-full transition-all duration-300 ${selectedPlan === plan.id ? 'bg-accent-blue scale-100' : 'bg-transparent scale-0'}`} />
              </button>
            ))}
          </div>

          <button 
            onClick={() => onBuy(selectedPlan, selectedPlan === 'week' ? 10 : 25)}
            className="w-full py-3.5 gradient-accent rounded-xl font-black text-[10px] shadow-xl shadow-accent-blue/20 transition-all active:scale-[0.98] uppercase tracking-widest"
          >
            {t.upgradeToPremium}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const RewardPoolModal = ({ onClose, t }: { onClose: () => void, t: any }) => {
  const smoothTransition = SMOOTH_SPRING;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={smoothTransition}
        className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-10 p-5 space-y-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
              <Database size={20} />
            </div>
            <h3 className="text-xl font-black tracking-tight uppercase italic">{t.rewardPool}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="text-center py-2">
            <div className="text-4xl font-black text-white tracking-tighter mb-1">
              {POOL_DATA.totalTon.toLocaleString()} <span className="text-sm opacity-40 uppercase tracking-widest">Ton</span>
            </div>
            <div className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em]">{t.activeBonusProgram}</div>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            <p className="text-sm text-text-secondary font-bold leading-relaxed text-center">
              {t.rewardPoolDesc}
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-lg transition-all active:scale-[0.98]"
        >
          {t.close}
        </button>
      </motion.div>
    </div>
  );
};

const CaseModal = ({ isOpen, onClose, opening, reward, t }: { isOpen: boolean, onClose: () => void, opening: boolean, reward: CaseReward | null, t: any }) => {
  if (!isOpen) return null;

  const [reelOffset, setReelOffset] = useState(0);
  const [showFinalReward, setShowFinalReward] = useState(false);
  const reelItems = useRef<any[]>([]);

  // Generate random items for the reel
  useEffect(() => {
    if (opening && !showFinalReward) {
      const items = [];
      const types: ('dspt' | 'ton' | 'boost' | 'premium_week' | 'premium_month')[] = ['dspt', 'ton', 'boost', 'premium_week', 'premium_month'];
      
      // Fill reel with 40-50 items for long scroll
      for (let i = 0; i < 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const rarity = type.includes('premium') ? 'extrac' : type === 'ton' ? 'rare' : 'common';
        items.push({ id: i, type, rarity });
      }
       reelItems.current = items;
      
      // Trigger scroll
      setTimeout(() => setReelOffset(-4400), 100); // 110px per item * ~40 items
      
      // Show result
      setTimeout(() => setShowFinalReward(true), 4200);
    } else if (!opening) {
      setReelOffset(0);
      setShowFinalReward(false);
    }
  }, [opening]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!opening ? onClose : undefined}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm glass-card p-6 flex flex-col items-center text-center space-y-6 z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 to-transparent pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">
            {opening ? t.openingCase : (reward ? t.caseReward : t.cases)}
          </h3>
          <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">
            {opening ? t.waitForIt : (reward ? t.youGot : t.casesDesc)}
          </p>
        </div>

        {/* CSGO REEL ANIMATION */}
        {opening && !showFinalReward && (
          <div className="relative w-full h-32 bg-background/50 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
            {/* Center Pointer */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-accent-blue z-20 -translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            
            <motion.div 
              className="absolute left-1/2 flex items-center h-full px-[55px]" // items center offset
              animate={{ x: reelOffset }}
              transition={{ duration: 4, ease: [0.15, 0, 0.1, 1] }}
            >
              {reelItems.current.map((item) => (
                <div key={item.id} className="w-[110px] h-full flex-shrink-0 p-2 flex flex-col items-center justify-center border-r border-white/5">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                    item.rarity === 'extrac' ? 'bg-purple-500/20 text-purple-400' : 
                    item.rarity === 'rare' ? 'bg-accent-blue/20 text-accent-blue' : 
                    'bg-white/10 text-white/50'
                  }`}>
                    {item.type === 'dspt' && <Coins size={28} />}
                    {item.type === 'ton' && <Wallet size={28} />}
                    {(item.type === 'premium_week' || item.type === 'premium_month') && <Crown size={28} />}
                    {item.type === 'boost' && <Zap size={28} />}
                  </div>
                  <div className="mt-1 text-[8px] font-black uppercase tracking-widest opacity-40">{item.type.split('_')[0]}</div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* REWARD DISPLAY */}
        {(reward && (showFinalReward || !opening)) && (
          <motion.div 
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            className="w-full py-8 space-y-4 flex flex-col items-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-accent-blue/20 blur-3xl rounded-full scale-150"
              />
              <div className="w-32 h-32 rounded-[2.5rem] gradient-accent flex items-center justify-center shadow-2xl shadow-accent-blue/40 relative z-10 border border-white/20">
                {reward.type === 'dspt' && <Coins size={64} className="text-white" />}
                {reward.type === 'ton' && <Wallet size={64} className="text-white" />}
                {reward.type.includes('premium') && <Crown size={64} className="text-white" />}
                {reward.type === 'boost' && <Zap size={64} className="text-white" />}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-4xl font-black text-white italic tracking-tighter">{reward.label}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue">{t.claimedSuccessfully}</div>
            </div>
          </motion.div>
        )}

        {(!opening || showFinalReward) && (
          <button 
            onClick={onClose}
            className="w-full py-4 gradient-accent rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-accent-blue/20 relative z-10"
          >
            {t.close}
          </button>
        )}
      </motion.div>
    </div>
  );
};

const TransactionHistory = ({ transactions, t }: { transactions: Transaction[], t: any }) => (
  <div className="space-y-3">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-1">{t.transactionHistory}</h3>
    
    {transactions.length === 0 ? (
      <div className="bg-white/5 border border-dashed border-white/10 p-6 rounded-2xl text-center space-y-2">
        <History size={24} className="text-text-secondary mx-auto opacity-20" />
        <p className="text-[11px] text-text-secondary">{t.noTransactions}</p>
      </div>
    ) : (
      <div className="bg-white/5 border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-3.5 flex justify-between items-center hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {tx.type === 'deposit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
              </div>
              <div>
                <div className="text-xs font-black capitalize leading-none mb-1">{tx.type === 'deposit' ? t.deposit : t.withdraw}</div>
                <div className="text-[9px] text-text-secondary font-bold">{new Date(tx.timestamp).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-black ${tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(1)} <span className="text-[9px] opacity-60">TON</span>
              </div>
              <div className="text-[8px] text-text-secondary uppercase font-black tracking-tighter opacity-60">
                {tx.status === 'completed' ? t.completedStatus : tx.status === 'pending' ? t.pendingStatus : t.failedStatus}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProfileScreen = ({ 
  user, 
  deposits, 
  transactions,
  onUpgrade, 
  t, 
  lang, 
  setLang, 
  onDeposit, 
  onWithdraw,
  onCompleteAll,
  onShowRules,
  onShowWallet,
  onShowUnifiedWallet,
  onOpenCase,
  fastFarmingMode,
  setFastFarmingMode
}: { 
  user: UserProfile, 
  deposits: FarmingDeposit[], 
  transactions: Transaction[],
  onUpgrade: () => void,
  t: any,
  lang: string,
  setLang: (l: 'en' | 'ru') => void,
  onDeposit: () => void,
  onWithdraw: () => void,
  onCompleteAll: () => void,
  onShowRules: () => void,
  onShowWallet: () => void,
  onShowUnifiedWallet: () => void,
  onOpenCase: () => void,
  fastFarmingMode: boolean,
  setFastFarmingMode: (v: boolean) => void
}) => {
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [showPremiumDetails, setShowPremiumDetails] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const smoothTransition = SMOOTH_SPRING;

  const currentLevelData = [...ACCOUNT_LEVELS].reverse().find(lvl => user.totalFarmedAmount >= lvl.requirement) || { level: 0, requirement: 0 };
  const currentLevel = currentLevelData.level;
  const nextLevelData = ACCOUNT_LEVELS.find(lvl => lvl.level === currentLevel + 1);
  
  const progress = nextLevelData 
    ? ((user.totalFarmedAmount - currentLevelData.requirement) / (nextLevelData.requirement - currentLevelData.requirement)) * 100
    : 100;

  const formatTimeLeft = (expiry?: number) => {
    if (!expiry) return "30 " + t.daysLeft;
    const diff = expiry - Date.now();
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${t.daysLeft} ${hours} ${t.hoursLeft}`;
    return `${hours} ${t.hoursLeft}`;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={smoothTransition}
      className="px-6 pt-5 pb-24 space-y-6 w-full max-w-full overflow-hidden"
    >
      <div className="space-y-4">
        {/* Top Profile Card - Thinner with Horizontal Layout */}
        <div className="glass-card bg-gradient-to-br from-[#0D0D0E] to-[#080809] border-white/10 p-4 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4">
            {/* Top Row: Avatar Left, Info Right */}
            <div className="flex items-center gap-4">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                {/* Avatar Container - Circular */}
                <div className="w-16 h-16 rounded-full gradient-accent p-0.5 shadow-xl relative">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden text-accent-blue/30">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                </div>

                {/* Premium Verification Badge (Telegram Style) */}
                {user.isPremium && (
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                    <BadgeCheck size={20} className="text-[#0088CC] fill-[#0088CC] text-white" />
                  </div>
                )}
              </div>

              {/* Name & ID Stack - Right Side */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase truncate">
                    {user.name}
                  </h2>
                  {/* Telegram-style Rounded Triangle Level Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowLevelInfo(true)}
                    className="flex-shrink-0 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <div className="relative flex items-center justify-center">
                      <Triangle 
                        size={22} 
                        className="text-accent-blue fill-accent-blue rotate-180 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth={3}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white tracking-tighter pb-0.5">
                        {currentLevel}
                      </span>
                    </div>
                  </motion.div>
                </div>
                <button 
                  onClick={handleCopyId}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group active:scale-95 w-fit"
                >
                  <span className="text-[9px] font-bold text-text-secondary tracking-widest uppercase">ID: {user.id}</span>
                  {copiedId ? (
                    <Check size={10} className="text-green-500" />
                  ) : (
                    <Copy size={10} className="text-text-secondary group-hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Middle Row: Balances */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                <div className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1">{t.tonBalance}</div>
                <div className="text-sm font-black text-white">{user.tonBalance.toFixed(2)} <span className="text-[8px] opacity-40">TON</span></div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                <div className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1">{t.dsptBalance}</div>
                <div className="text-sm font-black text-white">{user.dsptPoints.toFixed(0)} <span className="text-[8px] opacity-40">DSPT</span></div>
              </div>
            </div>

            {/* Middle Row 2: Cases */}
            <button 
              onClick={onOpenCase}
              className="w-full bg-accent-blue/5 border border-accent-blue/10 rounded-xl p-3 flex items-center justify-between group hover:bg-accent-blue/10 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <Gift size={16} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black text-white">{t.cases}</div>
                  <div className="text-[8px] font-bold text-accent-blue uppercase tracking-widest">{user.casesCount} {t.available}</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-accent-blue text-white font-black text-[8px] uppercase tracking-widest shadow-lg shadow-accent-blue/20 group-hover:scale-105 transition-transform">
                {t.openCase}
              </div>
            </button>

            {/* Bottom Row: Premium Button */}
            {!user.isPremium && (
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={onUpgrade}
                className="w-full py-3 gradient-accent rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-accent-blue/20 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                <Crown size={12} />
                {t.premium || "Buy Premium"}
              </motion.button>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent-blue/5 blur-[40px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent-cyan/5 blur-[40px] rounded-full pointer-events-none" />
        </div>
      </div>

        {/* Premium Details Modal */}
        <AnimatePresence>
          {showPremiumDetails && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPremiumDetails(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-500" />
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Crown size={24} />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">{t.premiumInfo}</h3>
                    </div>
                    <button onClick={() => setShowPremiumDetails(false)} className="text-text-secondary hover:text-white">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{t.expiresIn}</div>
                      <div className="text-lg font-black text-white">{formatTimeLeft(user.premiumExpiry)}</div>
                    </div>

                    <button 
                      onClick={() => {
                        setShowPremiumDetails(false);
                        onUpgrade();
                      }}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                    >
                      <Clock size={16} />
                      {t.switchToMonthly}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      {/* 2. Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-3 bg-accent-cyan rounded-full" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t.settings}</h3>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden divide-y divide-white/5">
          {/* Wallet */}
          <button onClick={onShowWallet} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                <Wallet size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black">{t.walletAddress}</div>
                <div className="text-[9px] text-text-secondary font-mono truncate max-w-[140px]">
                  {user.walletAddress || t.noWallet}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Language */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                <Globe size={18} />
              </div>
              <div className="text-xs font-black">{t.language}</div>
            </div>
            <div className="flex bg-background/50 p-1 rounded-xl border border-white/5">
              {['en', 'ru'].map((l) => (
                <button 
                  key={l}
                  onClick={() => setLang(l as 'en' | 'ru')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${lang === l ? 'bg-accent-blue text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Fast Farming */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Zap size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black">{t.fastFarming}</div>
                <div className="text-[8px] text-text-secondary font-bold uppercase tracking-widest">{t.fastFarmingDesc}</div>
              </div>
            </div>
            <button 
              onClick={() => setFastFarmingMode(!fastFarmingMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${fastFarmingMode ? 'bg-accent-blue' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: fastFarmingMode ? 26 : 4 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          {/* Support */}
          <button className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary">
                <MessageCircle size={18} />
              </div>
              <div className="text-xs font-black">{t.support}</div>
            </div>
            <ChevronRight size={18} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Logout */}
          <button className="w-full flex items-center justify-between p-5 hover:bg-red-500/5 transition-colors group text-red-400">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <div className="text-xs font-black">{t.logout}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Level Info Modal */}
      <AnimatePresence>
        {showLevelInfo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLevelInfo(false)}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={smoothTransition}
              className="relative w-full max-w-sm bg-[#0A0C10] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 space-y-6 z-[210]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{t.levelRequirements}</h3>
                </div>
                <button onClick={() => setShowLevelInfo(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors font-black text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-accent-blue/5 border border-accent-blue/20 space-y-2">
                  <div className="flex items-center gap-2 text-accent-blue">
                    <Gift size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.levelUpReward}</span>
                  </div>
                  <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                    {t.levelUpRewardDesc}
                  </p>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                  {ACCOUNT_LEVELS.map((lvl) => (
                    <div 
                      key={lvl.level} 
                      className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                        currentLevel >= lvl.level 
                          ? 'bg-accent-blue/10 border-accent-blue/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'bg-white/5 border-white/5 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          currentLevel >= lvl.level ? 'bg-accent-blue text-white shadow-lg' : 'bg-white/10 text-text-secondary'
                        }`}>
                          {lvl.level}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[11px] font-black uppercase tracking-tighter ${currentLevel >= lvl.level ? 'text-white' : 'text-text-secondary'}`}>
                            {t.level} {lvl.level}
                          </span>
                          <span className="text-[9px] font-bold text-accent-blue/70">
                            {lvl.level === 1 ? 'Common' : lvl.level === 2 ? 'Uncommon' : lvl.level === 3 ? 'Rare' : lvl.level === 4 ? 'Epic' : 'Legendary'} Box
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-black ${currentLevel >= lvl.level ? 'text-accent-blue' : 'text-text-secondary'}`}>
                          {lvl.requirement} <span className="text-[8px] opacity-60 italic">TON</span>
                        </div>
                        <div className="text-[7px] uppercase font-black tracking-widest opacity-40">Require</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setShowLevelInfo(false)}
                  className="w-full py-4 gradient-accent rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-accent-blue/20"
                >
                  {t.gotIt}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
