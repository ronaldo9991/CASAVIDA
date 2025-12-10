import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts";
import {
  FileText,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Shield,
  Lightbulb,
  BarChart3,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";

const CRISIS_METRICS = {
  before: {
    churnRate: 38,
    clv: 680,
    marketShare: 32,
    healthScore: 28,
    nps: 35,
    retention: 62,
    cac: 320,
    revenue: 4.2,
  },
  after: {
    churnRate: 15,
    clv: 820,
    marketShare: 37,
    healthScore: 72,
    nps: 65,
    retention: 85,
    cac: 185,
    revenue: 5.8,
  },
};

const MONTHLY_CRISIS_DATA = [
  { month: "Jan", churn: 32, clv: 720, revenue: 4.5, status: "pre-crisis" },
  { month: "Feb", churn: 35, clv: 700, revenue: 4.3, status: "declining" },
  { month: "Mar", churn: 38, clv: 680, revenue: 4.2, status: "crisis" },
  { month: "Apr", churn: 34, clv: 695, revenue: 4.4, status: "intervention" },
  { month: "May", churn: 28, clv: 720, revenue: 4.8, status: "recovery" },
  { month: "Jun", churn: 22, clv: 755, revenue: 5.2, status: "recovery" },
  { month: "Jul", churn: 18, clv: 785, revenue: 5.5, status: "growth" },
  { month: "Aug", churn: 16, clv: 805, revenue: 5.7, status: "growth" },
  { month: "Sep", churn: 15, clv: 820, revenue: 5.8, status: "stable" },
];

const SEGMENT_CRISIS_DATA = [
  { 
    segment: "Functional Homemakers",
    beforeChurn: 38, afterChurn: 15,
    beforeCLV: 680, afterCLV: 820,
    beforeHealth: 28, afterHealth: 72,
    size: 4200, afterSize: 4850,
    isCore: true,
    problem: "Neglected core segment while chasing premium customers",
    solution: "Prioritized loyalty programs and personalized retention campaigns"
  },
  { 
    segment: "Home Enhancers",
    beforeChurn: 22, afterChurn: 18,
    beforeCLV: 1850, afterCLV: 1920,
    beforeHealth: 42, afterHealth: 55,
    size: 890, afterSize: 720,
    isCore: false,
    problem: "Over-invested in acquisition with diminishing returns",
    solution: "Reduced spending, focused on high-value retention"
  },
  { 
    segment: "Occasional Browsers",
    beforeChurn: 55, afterChurn: 42,
    beforeCLV: 180, afterCLV: 210,
    beforeHealth: 18, afterHealth: 28,
    size: 2100, afterSize: 1650,
    isCore: false,
    problem: "Low engagement, high acquisition cost",
    solution: "De-prioritized, allowed natural attrition"
  },
];

const PROBLEM_AREAS = [
  {
    area: "Core Customer Neglect",
    severity: "critical",
    description: "Functional Homemakers (58% of revenue) experiencing 38% churn while resources diverted to premium acquisition",
    impact: "Projected $2.1M revenue loss within 12 months",
    indicator: "Health score dropped from 52 to 28 in 6 months"
  },
  {
    area: "Premium Segment Obsession",
    severity: "high",
    description: "Home Enhancers acquisition cost 4x higher than retention cost, with declining ROI",
    impact: "$200K monthly spend with 15% conversion rate",
    indicator: "CAC increased from $180 to $320"
  },
  {
    area: "Misaligned Strategy",
    severity: "high",
    description: "Blue Ocean initiatives focused on unproven premium market rather than protecting core",
    impact: "Showroom expansion planned ($850K) with no demand validation",
    indicator: "Premium segment market share stagnant at 12%"
  },
  {
    area: "Reactive Churn Management",
    severity: "medium",
    description: "No predictive model for early churn detection, only reactive recovery attempts",
    impact: "78% of churned customers lost before any intervention",
    indicator: "Average detection time: 45 days after disengagement"
  },
];

const SOLUTION_ACTIONS = [
  {
    action: "Loyalty Program Revamp",
    status: "completed",
    timeline: "Month 1-2",
    investment: "$45,000",
    result: "Core retention +23%",
    description: "Redesigned rewards for Functional Homemakers with value bundles and exclusive early access"
  },
  {
    action: "Churn Prediction Model",
    status: "completed",
    timeline: "Month 1-3",
    investment: "$15,000",
    result: "78% early detection",
    description: "ML model identifying at-risk customers 30+ days before churn, enabling proactive intervention"
  },
  {
    action: "Value Bundle Strategy",
    status: "completed",
    timeline: "Month 2-4",
    investment: "$12,000",
    result: "Basket size +18%",
    description: "Curated product bundles for core segment, increasing AOV without discounting"
  },
  {
    action: "Premium Campaign Pause",
    status: "paused",
    timeline: "Month 1",
    investment: "$0 (saved $200K+)",
    result: "Budget reallocated",
    description: "Influencer partnerships and premium marketing suspended pending core stabilization"
  },
  {
    action: "Showroom Expansion Cancel",
    status: "cancelled",
    timeline: "Month 1",
    investment: "$0 (saved $850K)",
    result: "Capital preserved",
    description: "Dubai flagship expansion cancelled, funds redirected to digital retention infrastructure"
  },
];

const RADAR_COMPARISON = [
  { metric: "Retention", before: 62, after: 85 },
  { metric: "CLV Index", before: 40, after: 72 },
  { metric: "Health Score", before: 28, after: 72 },
  { metric: "Market Share", before: 32, after: 37 },
  { metric: "NPS", before: 35, after: 65 },
  { metric: "Efficiency", before: 42, after: 78 },
];

const KPI_COMPARISON = [
  { metric: "Core Churn Rate", before: "38%", after: "15%", change: "-23%", good: true },
  { metric: "Customer Lifetime Value", before: "$680", after: "$820", change: "+21%", good: true },
  { metric: "Market Share", before: "32%", after: "37%", change: "+5%", good: true },
  { metric: "Core Health Score", before: "28", after: "72", change: "+44", good: true },
  { metric: "Customer Acquisition Cost", before: "$320", after: "$185", change: "-42%", good: true },
  { metric: "Net Promoter Score", before: "35", after: "65", change: "+30", good: true },
  { metric: "Retention Rate", before: "62%", after: "85%", change: "+23%", good: true },
  { metric: "Monthly Revenue", before: "$4.2M", after: "$5.8M", change: "+38%", good: true },
];

export default function Reports() {
  const { toast } = useToast();

  const handleExportReport = () => {
    const reportData = {
      summary: KPI_COMPARISON,
      problems: PROBLEM_AREAS,
      solutions: SOLUTION_ACTIONS,
      segments: SEGMENT_CRISIS_DATA,
      monthlyData: MONTHLY_CRISIS_DATA,
    };

    const flatData = [
      ...KPI_COMPARISON.map(k => ({ section: "KPI", ...k })),
      ...PROBLEM_AREAS.map(p => ({ section: "Problem", area: p.area, severity: p.severity, description: p.description, impact: p.impact })),
      ...SOLUTION_ACTIONS.map(s => ({ section: "Solution", action: s.action, status: s.status, investment: s.investment, result: s.result })),
    ];

    const csv = Papa.unparse(flatData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `casavida_crisis_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Report Exported", description: "Crisis report data exported to CSV." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2" data-testid="reports-header">
              <BarChart3 className="w-7 h-7 text-primary" />
              Crisis & Recovery Report
            </h2>
            <p className="text-muted-foreground">
              Complete analysis: Problem identification, strategy implementation, and 6-month results
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={handleExportReport} className="gap-2" data-testid="button-export-report">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Alert className="border-blue-500/50 bg-blue-500/5">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Crisis Report</strong> is a comprehensive document detailing CasaVida's business crisis and recovery journey. The "Overview" tab shows key metrics, "Crisis Analysis" identifies root causes, "Solution" documents the strategy implemented, and "6-Month Results" shows measurable outcomes. Export the full report for stakeholder presentations.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crisis">Crisis Analysis</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
            <TabsTrigger value="results">6-Month Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-red-500/50 bg-red-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Before: Crisis State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{CRISIS_METRICS.before.churnRate}% Churn</div>
                  <p className="text-xs text-muted-foreground">Core segment at critical risk</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    After: Recovered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{CRISIS_METRICS.after.churnRate}% Churn</div>
                  <p className="text-xs text-muted-foreground">Stabilized and growing</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+${(CRISIS_METRICS.after.revenue - CRISIS_METRICS.before.revenue).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">Monthly revenue increase</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$1.05M</div>
                  <p className="text-xs text-muted-foreground">From paused/cancelled initiatives</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Crisis Timeline & Recovery</CardTitle>
                <CardDescription>9-month journey from crisis detection to stable growth</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MONTHLY_CRISIS_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Legend />
                    <Area yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($M)" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Line yAxisId="left" type="monotone" dataKey="churn" name="Churn %" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                    <Line yAxisId="left" type="monotone" dataKey="clv" name="CLV ($)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Before vs After Radar</CardTitle>
                  <CardDescription>Performance transformation across all metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_COMPARISON} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <PolarGrid stroke="hsl(var(--muted))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Radar name="Before Crisis" dataKey="before" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                      <Radar name="After 6 Months" dataKey="after" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} strokeWidth={2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>KPI Comparison Table</CardTitle>
                  <CardDescription>All key metrics before and after intervention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-center py-2">Before</th>
                          <th className="text-center py-2"></th>
                          <th className="text-center py-2">After</th>
                          <th className="text-right py-2">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {KPI_COMPARISON.map((row, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-2 font-medium">{row.metric}</td>
                            <td className="text-center py-2 text-muted-foreground">{row.before}</td>
                            <td className="text-center py-2"><ArrowRight className="w-3 h-3 mx-auto text-muted-foreground" /></td>
                            <td className="text-center py-2 font-medium">{row.after}</td>
                            <td className={`text-right py-2 font-bold ${row.good ? 'text-green-600' : 'text-red-600'}`}>
                              {row.change}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <Card className="border-red-500/50 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  Crisis Situation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  CasaVida was experiencing a <strong>silent revenue crisis</strong>. While pursuing premium market expansion 
                  with influencer campaigns and showroom investments, the company neglected its core customer base - 
                  the <strong>Functional Homemakers</strong> segment representing 58% of total revenue. Core segment churn 
                  reached <strong>38%</strong>, with health scores declining from 52 to 28 over 6 months.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Without intervention, the company was projected to lose <strong>$2.1M in annual revenue</strong> 
                  and $1.05M in misallocated capital investments.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Identified Problem Areas</h3>
              {PROBLEM_AREAS.map((problem, i) => (
                <Card key={i} className={`border-l-4 ${
                  problem.severity === 'critical' ? 'border-l-red-500' :
                  problem.severity === 'high' ? 'border-l-amber-500' :
                  'border-l-blue-500'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{problem.area}</CardTitle>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        problem.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        problem.severity === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {problem.severity}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span className="text-red-600 dark:text-red-400"><strong>Impact:</strong> {problem.impact}</span>
                      <span className="text-amber-600 dark:text-amber-400"><strong>Indicator:</strong> {problem.indicator}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Segment Crisis State</CardTitle>
                <CardDescription>Health metrics at crisis detection point</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SEGMENT_CRISIS_DATA} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="segment" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Legend />
                    <Bar dataKey="beforeChurn" name="Churn Risk %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="beforeHealth" name="Health Score" fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solution" className="space-y-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Strategic Solution Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  The recovery strategy was built on three pillars: <strong>Protect, Pause, and Pivot</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/30">
                    <h4 className="font-bold text-sm mb-2 text-green-700 dark:text-green-400">1. Protect Core</h4>
                    <p className="text-xs text-muted-foreground">Immediate intervention for Functional Homemakers with loyalty revamp and personalized retention</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/30">
                    <h4 className="font-bold text-sm mb-2 text-amber-700 dark:text-amber-400">2. Pause Premium</h4>
                    <p className="text-xs text-muted-foreground">Suspend premium acquisition campaigns and reallocate budget to retention</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/30">
                    <h4 className="font-bold text-sm mb-2 text-blue-700 dark:text-blue-400">3. Pivot Strategy</h4>
                    <p className="text-xs text-muted-foreground">Shift Blue Ocean focus from premium conquest to value-based differentiation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Implementation Actions</h3>
              {SOLUTION_ACTIONS.map((action, i) => (
                <Card key={i} className={`${
                  action.status === 'completed' ? 'border-green-500/50' :
                  action.status === 'paused' ? 'border-amber-500/50' :
                  'border-muted'
                }`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          action.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          action.status === 'paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {action.status}
                        </span>
                        <span className="font-bold">{action.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{action.timeline}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span><strong>Investment:</strong> {action.investment}</span>
                      <span className="text-green-600 dark:text-green-400"><strong>Result:</strong> {action.result}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Churn Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">-23%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    38% <ArrowRight className="w-3 h-3" /> 15%
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CLV Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">+21%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    $680 <ArrowRight className="w-3 h-3" /> $820
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">+38%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    $4.2M <ArrowRight className="w-3 h-3" /> $5.8M
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">22x</div>
                  <p className="text-xs text-muted-foreground">On $72K investment</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Segment Recovery Comparison</CardTitle>
                <CardDescription>Before crisis vs after 6 months of strategy implementation</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SEGMENT_CRISIS_DATA} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="segment" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Legend />
                    <Bar dataKey="beforeChurn" name="Churn Before" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="afterChurn" name="Churn After" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="beforeHealth" name="Health Before" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="afterHealth" name="Health After" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Key Takeaways
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm"><strong>Core First:</strong> Protecting the profit engine (58% revenue segment) was essential before any expansion</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm"><strong>Data-Driven:</strong> Churn prediction model enabled proactive intervention vs reactive recovery</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm"><strong>Blue Ocean Pivot:</strong> Shifted from premium conquest to value differentiation, creating uncontested space</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm"><strong>Capital Discipline:</strong> $1.05M saved by pausing initiatives that didn't serve core retention</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
