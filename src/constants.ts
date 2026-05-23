export const DSPT_TOTAL_SUPPLY = 100000000;

// DSPT Points calculation: 1 TON for 1 day = 10 DSPT, 2 days = 15 DSPT, etc.
// Formula: DSPT = TON * (10 + (days - 1) * 5)
export const calculateDsptPoints = (tonAmount: number, days: number) => {
  return tonAmount * (10 + (days - 1) * 5);
};

// TON Reward percentage calculation: 1d=1.5%, 2d=3.6%, 3d=5.9% ... 30d=100%
// Using a quadratic approximation for the curve
export const calculateTonRewardPercent = (days: number) => {
  if (days === 1) return 1.5;
  if (days === 2) return 3.6;
  if (days === 3) return 5.9;
  // Approximation to reach 100% at day 30
  // f(x) = 0.08x^2 + 1.2x + 0.22
  const val = 0.08 * Math.pow(days, 2) + 1.2 * days + 0.22;
  return Math.min(100, val);
};

export const BOOST_OPTIONS = [
  { id: 'boost-5', label: '+5%', value: 5, cost: 10 },
  { id: 'boost-10', label: '+10%', value: 10, cost: 25 },
  { id: 'boost-15', label: '+15%', value: 15, cost: 50 },
];

export const POOL_DATA = {
  totalTon: 127738,
  totalParticipants: 8420,
  totalDsptGenerated: 4500000,
};
