import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target,
  CheckCircle,
  AlertTriangle,
  Shield,
  Download,
  Sparkles
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const BEFORE_SEGMENTS = [
  { name: "Functional Homemakers", size: 4200, churnRisk: 38, healthScore: 28, avgClv: 680, clvTrend: -18, isCore: true, retentionRate: 62 },
  { name: "Home Enhancers", size: 890, churnRisk: 22, healthScore: 42, avgClv: 1850, clvTrend: -5, isCore: false, retentionRate: 78 },
  { name: "Occasional Browsers", size: 2100, churnRisk: 55, healthScore: 18, avgClv: 180, clvTrend: -22, isCore: false, retentionRate: 45 },
];

const AFTER_SEGMENTS = [
  { name: "Functional Homemakers", size: 4850, churnRisk: 15, healthScore: 72, avgClv: 820, clvTrend: 12, isCore: true, retentionRate: 85 },
  { name: "Home Enhancers", size: 720, churnRisk: 18, healthScore: 55, avgClv: 1920, clvTrend: 4, isCore: false, retentionRate: 82 },
  { name: "Occasional Browsers", size: 1650, churnRisk: 42, healthScore: 28, avgClv: 210, clvTrend: 5, isCore: false, retentionRate: 58 },
];

const BEFORE_COMPETITORS = [
  { name: "HomeStyle Direct", marketShare: 28, threat: "high" },
  { name: "ModernNest", marketShare: 18, threat: "high" },
  { name: "ValueHome", marketShare: 22, threat: "medium" },
];

const AFTER_COMPETITORS = [
  { name: "HomeStyle Direct", marketShare: 26, threat: "medium" },
  { name: "ModernNest", marketShare: 17, threat: "medium" },
  { name: "ValueHome", marketShare: 20, threat: "low" },
];

const MONTHLY_PROGRESS = [
  { month: "Month 0", churnRate: 38, clv: 680, retention: 62, marketShare: 32 },
  { month: "Month 1", churnRate: 34, clv: 695, retention: 66, marketShare: 33 },
  { month: "Month 2", churnRate: 28, clv: 720, retention: 72, marketShare: 34 },
  { month: "Month 3", churnRate: 22, clv: 755, retention: 78, marketShare: 35 },
  { month: "Month 4", churnRate: 18, clv: 785, retention: 82, marketShare: 36 },
  { month: "Month 5", churnRate: 16, clv: 805, retention: 84, marketShare: 36 },
  { month: "Month 6", churnRate: 15, clv: 820, retention: 85, marketShare: 37 },
];

const BLUE_OCEAN_FACTORS = [
  { factor: "Premium Showroom Experience", before: 8, after: 4, industry: 6, action: "Reduce" },
  { factor: "Influencer Marketing", before: 7, after: 3, industry: 7, action: "Eliminate" },
  { factor: "Core Customer Loyalty", before: 3, after: 9, industry: 5, action: "Raise" },
  { factor: "Value Bundles", before: 2, after: 8, industry: 4, action: "Create" },
  { factor: "Personalized Retention", before: 2, after: 7, industry: 3, action: "Create" },
  { factor: "Premium Product Range", before: 9, after: 6, industry: 7, action: "Reduce" },
  { factor: "Price Competitiveness", before: 4, after: 7, industry: 8, action: "Raise" },
  { factor: "Customer Service Response", before: 5, after: 8, industry: 5, action: "Raise" },
];

const INITIATIVE_RESULTS = [
  { name: "Loyalty Program Revamp", status: "completed", impact: "Retention +23%", cost: "$45,000" },
  { name: "Churn Prediction Model", status: "completed", impact: "Early detection 78%", cost: "$15,000" },
  { name: "Value Bundle Promotions", status: "completed", impact: "Basket size +18%", cost: "$12,000" },
  { name: "Premium Influencer Campaign", status: "paused", impact: "Saved $200K+", cost: "$0" },
  { name: "AI Style Consultant", status: "deferred", impact: "Reallocated budget", cost: "$0" },
  { name: "Showroom Expansion", status: "cancelled", impact: "Saved $850K", cost: "$0" },
];

export default function StrategyResults() {
  const { toast } = useToast();

  const beforeTotalCustomers = BEFORE_SEGMENTS.reduce((acc, s) => acc + s.size, 0);
  const afterTotalCustomers = AFTER_SEGMENTS.reduce((acc, s) => acc + s.size, 0);
  const customerChange = ((afterTotalCustomers - beforeTotalCustomers) / beforeTotalCustomers * 100).toFixed(1);

  const beforeAvgChurn = BEFORE_SEGMENTS.reduce((acc, s) => acc + s.churnRisk * s.size, 0) / beforeTotalCustomers;
  const afterAvgChurn = AFTER_SEGMENTS.reduce((acc, s) => acc + s.churnRisk * s.size, 0) / afterTotalCustomers;
  const churnReduction = (beforeAvgChurn - afterAvgChurn).toFixed(0);

  const beforeTotalCLV = BEFORE_SEGMENTS.reduce((acc, s) => acc + s.avgClv * s.size, 0);
  const afterTotalCLV = AFTER_SEGMENTS.reduce((acc, s) => acc + s.avgClv * s.size, 0);
  const clvGrowth = ((afterTotalCLV - beforeTotalCLV) / beforeTotalCLV * 100).toFixed(1);

  const beforeMarketShare = 100 - BEFORE_COMPETITORS.reduce((acc, c) => acc + c.marketShare, 0);
  const afterMarketShare = 100 - AFTER_COMPETITORS.reduce((acc, c) => acc + c.marketShare, 0);
  const marketShareGain = afterMarketShare - beforeMarketShare;

  const segmentComparisonData = BEFORE_SEGMENTS.map((before, i) => ({
    name: before.name,
    beforeChurn: before.churnRisk,
    afterChurn: AFTER_SEGMENTS[i].churnRisk,
    beforeHealth: before.healthScore,
    afterHealth: AFTER_SEGMENTS[i].healthScore,
    beforeRetention: before.retentionRate,
    afterRetention: AFTER_SEGMENTS[i].retentionRate,
  }));

  const handleExportData = () => {
    const exportData = {
      summary: {
        customerGrowth: `${customerChange}%`,
        churnReduction: `${churnReduction}%`,
        clvGrowth: `${clvGrowth}%`,
        marketShareGain: `${marketShareGain}%`,
      },
      beforeSegments: BEFORE_SEGMENTS,
      afterSegments: AFTER_SEGMENTS,
      monthlyProgress: MONTHLY_PROGRESS,
      blueOceanFactors: BLUE_OCEAN_FACTORS,
      initiativeResults: INITIATIVE_RESULTS,
    };

    const csv = Papa.unparse([
      { section: "Summary", metric: "Customer Growth", value: exportData.summary.customerGrowth },
      { section: "Summary", metric: "Churn Reduction", value: exportData.summary.churnReduction },
      { section: "Summary", metric: "CLV Growth", value: exportData.summary.clvGrowth },
      { section: "Summary", metric: "Market Share Gain", value: exportData.summary.marketShareGain },
      ...BEFORE_SEGMENTS.map((s, i) => ({
        section: "Segment Before",
        name: s.name,
        size: s.size,
        churnRisk: s.churnRisk,
        healthScore: s.healthScore,
        avgClv: s.avgClv,
      })),
      ...AFTER_SEGMENTS.map((s, i) => ({
        section: "Segment After",
        name: s.name,
        size: s.size,
        churnRisk: s.churnRisk,
        healthScore: s.healthScore,
        avgClv: s.avgClv,
      })),
    ]);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `casavida_strategy_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Strategy results data exported to CSV.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Results After 6 Months
              <Sparkles className="w-6 h-6 text-primary" />
            </h2>
            <p className="text-muted-foreground">
              Strategy implementation outcomes - Before vs After comparison
            </p>
          </div>
          <Button variant="outline" onClick={handleExportData} className="gap-2" data-testid="button-export-results">
            <Download className="w-4 h-4" />
            Export Results
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Core Churn Reduction</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">-{churnReduction}%</div>
              <p className="text-xs text-muted-foreground">
                From {Math.round(beforeAvgChurn)}% to {Math.round(afterAvgChurn)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CLV Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+{clvGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                From ${(beforeTotalCLV / 1000000).toFixed(2)}M to ${(afterTotalCLV / 1000000).toFixed(2)}M
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Base</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+{customerChange}%</div>
              <p className="text-xs text-muted-foreground">
                From {beforeTotalCustomers.toLocaleString()} to {afterTotalCustomers.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Share</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+{marketShareGain}%</div>
              <p className="text-xs text-muted-foreground">
                From {beforeMarketShare}% to {afterMarketShare}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>6-Month Progress Trajectory</CardTitle>
            <CardDescription>Monthly improvement in core metrics after strategy implementation</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_PROGRESS} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                <Legend />
                <Area type="monotone" dataKey="retention" name="Retention %" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorRetention)" />
                <Line type="monotone" dataKey="churnRate" name="Churn %" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="marketShare" name="Market Share %" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Health: Before vs After</CardTitle>
              <CardDescription>Churn risk and retention improvements by segment</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentComparisonData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-20} textAnchor="end" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                  <Legend />
                  <Bar dataKey="beforeChurn" name="Churn Before" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="afterChurn" name="Churn After" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blue Ocean Strategy Canvas</CardTitle>
              <CardDescription>Value curve transformation vs industry standard</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={BLUE_OCEAN_FACTORS} margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="factor" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} angle={-35} textAnchor="end" height={80} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="before" name="Before Strategy" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="after" name="After Strategy" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="industry" name="Industry Avg" stroke="#6b7280" strokeWidth={1} strokeDasharray="5 5" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Initiative Execution Summary</CardTitle>
            <CardDescription>Status of strategic initiatives after 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INITIATIVE_RESULTS.map((init, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border ${
                    init.status === 'completed' ? 'border-green-500/50 bg-green-500/5' :
                    init.status === 'paused' ? 'border-amber-500/50 bg-amber-500/5' :
                    'border-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      init.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      init.status === 'paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {init.status}
                    </span>
                    {init.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : init.status === 'paused' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="font-semibold text-sm mb-1">{init.name}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{init.impact}</p>
                  <p className="text-xs text-muted-foreground">Cost: {init.cost}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              After 6 months of implementing the core-focused strategy, CasaVida has successfully reversed its declining trajectory. 
              By prioritizing the <strong>Functional Homemakers</strong> segment and pausing premium expansion initiatives, the company achieved:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <strong>{churnReduction}% reduction</strong> in core segment churn (from {Math.round(beforeAvgChurn)}% to {Math.round(afterAvgChurn)}%)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <strong>${((afterTotalCLV - beforeTotalCLV) / 1000000).toFixed(2)}M increase</strong> in total customer lifetime value
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <strong>{marketShareGain}% market share gain</strong> despite reducing marketing spend
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <strong>$1.05M saved</strong> by pausing/cancelling low-ROI premium initiatives
              </li>
            </ul>
            <p className="text-sm text-muted-foreground pt-2 border-t">
              The Blue Ocean strategy shifted resources from competitive premium positioning to uncontested value-focused retention, 
              creating a sustainable growth path aligned with core customer needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
