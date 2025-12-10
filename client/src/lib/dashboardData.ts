export const SEGMENT_DATA = {
  before: {
    functionalHomemakers: { name: "Functional Homemakers", size: 4200, avgClv: 680, churnRisk: 38, healthScore: 28, clvTrend: -18, retentionRate: 62, isCore: true },
    homeEnhancers: { name: "Home Enhancers", size: 890, avgClv: 1850, churnRisk: 22, healthScore: 42, clvTrend: -5, retentionRate: 78, isCore: false },
    occasionalBrowsers: { name: "Occasional Browsers", size: 2100, avgClv: 180, churnRisk: 55, healthScore: 18, clvTrend: -22, retentionRate: 45, isCore: false },
  },
  after: {
    functionalHomemakers: { name: "Functional Homemakers", size: 4850, avgClv: 820, churnRisk: 15, healthScore: 72, clvTrend: 12, retentionRate: 85, isCore: true },
    homeEnhancers: { name: "Home Enhancers", size: 720, avgClv: 1920, churnRisk: 18, healthScore: 55, clvTrend: 4, retentionRate: 82, isCore: false },
    occasionalBrowsers: { name: "Occasional Browsers", size: 1650, avgClv: 210, churnRisk: 42, healthScore: 28, clvTrend: 5, retentionRate: 58, isCore: false },
  },
};

export const BEFORE_SEGMENTS = [
  SEGMENT_DATA.before.functionalHomemakers,
  SEGMENT_DATA.before.homeEnhancers,
  SEGMENT_DATA.before.occasionalBrowsers,
];

export const AFTER_SEGMENTS = [
  SEGMENT_DATA.after.functionalHomemakers,
  SEGMENT_DATA.after.homeEnhancers,
  SEGMENT_DATA.after.occasionalBrowsers,
];

function calculateTotalClv(segments: typeof BEFORE_SEGMENTS) {
  return segments.reduce((acc, s) => acc + (s.size * s.avgClv), 0);
}

function calculateTotalCustomers(segments: typeof BEFORE_SEGMENTS) {
  return segments.reduce((acc, s) => acc + s.size, 0);
}

function calculateWeightedChurn(segments: typeof BEFORE_SEGMENTS) {
  const totalCustomers = calculateTotalCustomers(segments);
  return segments.reduce((acc, s) => acc + (s.churnRisk * s.size / totalCustomers), 0);
}

export const CALCULATED_METRICS = {
  before: {
    totalClv: calculateTotalClv(BEFORE_SEGMENTS),
    totalCustomers: calculateTotalCustomers(BEFORE_SEGMENTS),
    weightedChurnRate: Math.round(calculateWeightedChurn(BEFORE_SEGMENTS)),
    coreChurnRate: SEGMENT_DATA.before.functionalHomemakers.churnRisk,
    marketShare: 32,
    cac: 320,
    nps: 35,
  },
  after: {
    totalClv: calculateTotalClv(AFTER_SEGMENTS),
    totalCustomers: calculateTotalCustomers(AFTER_SEGMENTS),
    weightedChurnRate: Math.round(calculateWeightedChurn(AFTER_SEGMENTS)),
    coreChurnRate: SEGMENT_DATA.after.functionalHomemakers.churnRisk,
    marketShare: 37,
    cac: 185,
    nps: 65,
  },
};

export const SUMMARY_METRICS = {
  before: {
    totalClvMillions: (CALCULATED_METRICS.before.totalClv / 1000000).toFixed(2),
    churnRisk: CALCULATED_METRICS.before.coreChurnRate,
    weightedChurnRisk: CALCULATED_METRICS.before.weightedChurnRate,
    marketShare: CALCULATED_METRICS.before.marketShare,
    totalCustomers: CALCULATED_METRICS.before.totalCustomers,
    coreHealthScore: SEGMENT_DATA.before.functionalHomemakers.healthScore,
    cac: CALCULATED_METRICS.before.cac,
    nps: CALCULATED_METRICS.before.nps,
    retention: SEGMENT_DATA.before.functionalHomemakers.retentionRate,
  },
  after: {
    totalClvMillions: (CALCULATED_METRICS.after.totalClv / 1000000).toFixed(2),
    churnRisk: CALCULATED_METRICS.after.coreChurnRate,
    weightedChurnRisk: CALCULATED_METRICS.after.weightedChurnRate,
    marketShare: CALCULATED_METRICS.after.marketShare,
    totalCustomers: CALCULATED_METRICS.after.totalCustomers,
    coreHealthScore: SEGMENT_DATA.after.functionalHomemakers.healthScore,
    cac: CALCULATED_METRICS.after.cac,
    nps: CALCULATED_METRICS.after.nps,
    retention: SEGMENT_DATA.after.functionalHomemakers.retentionRate,
  },
};

export const CLV_GAIN = CALCULATED_METRICS.after.totalClv - CALCULATED_METRICS.before.totalClv;
export const CLV_GAIN_PERCENT = Math.round((CLV_GAIN / CALCULATED_METRICS.before.totalClv) * 100);

export const CHURN_REDUCTION = CALCULATED_METRICS.before.coreChurnRate - CALCULATED_METRICS.after.coreChurnRate;

export const BEFORE_CLV_DATA = BEFORE_SEGMENTS.map(s => ({
  segment: s.name,
  avgClv: s.avgClv,
  totalClv: s.size * s.avgClv,
  customers: s.size,
  trend: s.clvTrend,
}));

export const AFTER_CLV_DATA = AFTER_SEGMENTS.map(s => ({
  segment: s.name,
  avgClv: s.avgClv,
  totalClv: s.size * s.avgClv,
  customers: s.size,
  trend: s.clvTrend,
}));

export const BEFORE_CHURN = BEFORE_SEGMENTS.map(s => ({
  segment: s.name,
  churnRisk: s.churnRisk,
  atRisk: Math.round(s.size * s.churnRisk / 100),
  size: s.size,
}));

export const AFTER_CHURN = AFTER_SEGMENTS.map(s => ({
  segment: s.name,
  churnRisk: s.churnRisk,
  atRisk: Math.round(s.size * s.churnRisk / 100),
  size: s.size,
}));

export const KEY_RESULTS = [
  { 
    metric: "Core Segment Churn", 
    before: `${SUMMARY_METRICS.before.churnRisk}%`, 
    after: `${SUMMARY_METRICS.after.churnRisk}%`, 
    change: `-${CHURN_REDUCTION}%`, 
    positive: true 
  },
  { 
    metric: "Total CLV", 
    before: `$${SUMMARY_METRICS.before.totalClvMillions}M`, 
    after: `$${SUMMARY_METRICS.after.totalClvMillions}M`, 
    change: `+${CLV_GAIN_PERCENT}%`, 
    positive: true 
  },
  { 
    metric: "Market Share", 
    before: `${SUMMARY_METRICS.before.marketShare}%`, 
    after: `${SUMMARY_METRICS.after.marketShare}%`, 
    change: `+${SUMMARY_METRICS.after.marketShare - SUMMARY_METRICS.before.marketShare}%`, 
    positive: true 
  },
  { 
    metric: "Core Health Score", 
    before: `${SUMMARY_METRICS.before.coreHealthScore}`, 
    after: `${SUMMARY_METRICS.after.coreHealthScore}`, 
    change: `+${SUMMARY_METRICS.after.coreHealthScore - SUMMARY_METRICS.before.coreHealthScore}`, 
    positive: true 
  },
  { 
    metric: "Acquisition Cost", 
    before: `$${SUMMARY_METRICS.before.cac}`, 
    after: `$${SUMMARY_METRICS.after.cac}`, 
    change: `-${Math.round((1 - SUMMARY_METRICS.after.cac / SUMMARY_METRICS.before.cac) * 100)}%`, 
    positive: true 
  },
];

export const CLV_MONTHLY_PROGRESSION = [
  { month: "Before", functionalHomemakers: 680, homeEnhancers: 1850, occasional: 180, total: CALCULATED_METRICS.before.totalClv },
  { month: "Month 1", functionalHomemakers: 695, homeEnhancers: 1860, occasional: 185, total: 4950000 },
  { month: "Month 2", functionalHomemakers: 720, homeEnhancers: 1875, occasional: 190, total: 5120000 },
  { month: "Month 3", functionalHomemakers: 755, homeEnhancers: 1890, occasional: 195, total: 5350000 },
  { month: "Month 4", functionalHomemakers: 785, homeEnhancers: 1900, occasional: 200, total: 5520000 },
  { month: "Month 5", functionalHomemakers: 805, homeEnhancers: 1910, occasional: 205, total: 5650000 },
  { month: "After", functionalHomemakers: 820, homeEnhancers: 1920, occasional: 210, total: CALCULATED_METRICS.after.totalClv },
];

export const CHURN_PROGRESSION = [
  { month: "Before", functionalHomemakers: 38, homeEnhancers: 22, occasional: 55 },
  { month: "Month 1", functionalHomemakers: 34, homeEnhancers: 21, occasional: 52 },
  { month: "Month 2", functionalHomemakers: 28, homeEnhancers: 20, occasional: 48 },
  { month: "Month 3", functionalHomemakers: 22, homeEnhancers: 19, occasional: 45 },
  { month: "Month 4", functionalHomemakers: 18, homeEnhancers: 18, occasional: 44 },
  { month: "Month 5", functionalHomemakers: 16, homeEnhancers: 18, occasional: 43 },
  { month: "After", functionalHomemakers: 15, homeEnhancers: 18, occasional: 42 },
];

export const MONTHLY_PROGRESS = [
  { month: "Month 0", churnRate: 38, clv: 680, retention: 62, marketShare: 32 },
  { month: "Month 1", churnRate: 34, clv: 695, retention: 66, marketShare: 33 },
  { month: "Month 2", churnRate: 28, clv: 720, retention: 72, marketShare: 34 },
  { month: "Month 3", churnRate: 22, clv: 755, retention: 78, marketShare: 35 },
  { month: "Month 4", churnRate: 18, clv: 785, retention: 82, marketShare: 36 },
  { month: "Month 5", churnRate: 16, clv: 805, retention: 84, marketShare: 36 },
  { month: "Month 6", churnRate: 15, clv: 820, retention: 85, marketShare: 37 },
];

export const CRISIS_METRICS = {
  before: {
    churnRate: SUMMARY_METRICS.before.churnRisk,
    clv: SEGMENT_DATA.before.functionalHomemakers.avgClv,
    marketShare: SUMMARY_METRICS.before.marketShare,
    healthScore: SUMMARY_METRICS.before.coreHealthScore,
    nps: SUMMARY_METRICS.before.nps,
    retention: SUMMARY_METRICS.before.retention,
    cac: SUMMARY_METRICS.before.cac,
    revenue: 4.2,
  },
  after: {
    churnRate: SUMMARY_METRICS.after.churnRisk,
    clv: SEGMENT_DATA.after.functionalHomemakers.avgClv,
    marketShare: SUMMARY_METRICS.after.marketShare,
    healthScore: SUMMARY_METRICS.after.coreHealthScore,
    nps: SUMMARY_METRICS.after.nps,
    retention: SUMMARY_METRICS.after.retention,
    cac: SUMMARY_METRICS.after.cac,
    revenue: 5.8,
  },
};

export const STRATEGY_ACTIONS = [
  { action: "Loyalty Program Revamp", status: "Completed", impact: "Retention +23%", cost: "$45K" },
  { action: "Churn Prediction Model", status: "Completed", impact: "Early detection 78%", cost: "$15K" },
  { action: "Value Bundle Promotions", status: "Completed", impact: "Basket size +18%", cost: "$12K" },
  { action: "Premium Influencer Campaign", status: "Paused", impact: "Saved $200K+", cost: "$0" },
  { action: "Showroom Expansion", status: "Cancelled", impact: "Saved $850K", cost: "$0" },
];

export const INITIATIVE_RESULTS = [
  { name: "Loyalty Program Revamp", status: "completed", impact: "Retention +23%", cost: "$45,000" },
  { name: "Churn Prediction Model", status: "completed", impact: "Early detection 78%", cost: "$15,000" },
  { name: "Value Bundle Promotions", status: "completed", impact: "Basket size +18%", cost: "$12,000" },
  { name: "Premium Influencer Campaign", status: "paused", impact: "Saved $200K+", cost: "$0" },
  { name: "AI Style Consultant", status: "deferred", impact: "Reallocated budget", cost: "$0" },
  { name: "Showroom Expansion", status: "cancelled", impact: "Saved $850K", cost: "$0" },
];

export const SEGMENT_COLORS = ["#ef4444", "#f59e0b", "#6b7280", "#8b5cf6", "#10b981", "#3b82f6"];
