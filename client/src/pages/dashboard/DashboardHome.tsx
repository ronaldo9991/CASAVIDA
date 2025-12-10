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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  Target,
  Loader2,
  RefreshCw,
  Pause,
  Play,
  Brain,
  Download,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DashboardSummary {
  segments: {
    total: number;
    totalCustomers: number;
    core: {
      name: string;
      size: number;
      healthScore: number;
      churnRisk: number;
      clvTrend: number;
    } | null;
    new: {
      name: string;
      size: number;
      healthScore: number;
      acquisitionCost: number;
      growthRate: number;
    } | null;
  };
  kpis: {
    avgChurnRisk: number;
    totalClv: number;
    marketShare: number;
    competitorThreat: number;
  };
  initiatives: {
    total: number;
    focus: number;
    pause: number;
    focusList: { name: string; impact: number; effort: number }[];
    pauseList: { name: string; recommendation: string }[];
  };
  alerts: { type: string; message: string; action: string }[];
}

interface Recommendations {
  executiveSummary: string;
  topRisks: { risk: string; severity: string; action: string }[];
  strategicMoves: { move: string; priority: string; impact: string }[];
  segmentStrategy: { segment: string; recommendation: string }[];
}

const SEGMENT_COLORS = ["#ef4444", "#f59e0b", "#6b7280", "#8b5cf6", "#10b981"];

export default function DashboardHome() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useQuery<DashboardSummary>({
    queryKey: ["/api/dashboard/summary"],
  });

  const { data: recommendations, isLoading: recsLoading } = useQuery<Recommendations>({
    queryKey: ["/api/dashboard/recommendations"],
    enabled: !!summary && summary.segments.total > 0,
  });

  const { data: segments = [] } = useQuery<any[]>({
    queryKey: ["/api/segments"],
  });

  const { data: initiatives = [] } = useQuery<any[]>({
    queryKey: ["/api/initiatives"],
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/seed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/recommendations"] });
      toast({
        title: "Crisis Data Loaded",
        description: "CasaVida failing company scenario has been loaded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to seed data.",
        variant: "destructive",
      });
    },
  });

  const segmentChartData = segments.map((s, i) => ({
    name: s.name,
    value: s.size,
    color: s.color || SEGMENT_COLORS[i % SEGMENT_COLORS.length],
  }));

  const hasData = summary && summary.segments.total > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Crisis Command Center</h2>
            <p className="text-muted-foreground">
              LivingMarket AI • CasaVida Growth Strategy Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="gap-2"
              data-testid="button-seed-data"
            >
              {seedMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Load Crisis Data
            </Button>
          </div>
        </div>

        <Alert className="border-blue-500/50 bg-blue-500/5">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Crisis Command Center</strong> is your central hub for monitoring CasaVida's business health. It shows real-time KPIs like churn risk, customer lifetime value, and market position. The AI provides strategic recommendations based on current data. Click "Load Crisis Data" to simulate the failing company scenario.
          </AlertDescription>
        </Alert>

        {!hasData && !summaryLoading && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data Loaded</h3>
              <p className="text-muted-foreground text-center mb-4">
                Click "Load Crisis Data" to simulate the CasaVida failing company scenario.
              </p>
              <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
                {seedMutation.isPending ? "Loading..." : "Load Crisis Data"}
              </Button>
            </CardContent>
          </Card>
        )}

        {hasData && (
          <>
            {summary.alerts && summary.alerts.length > 0 && (
              <div className="space-y-2">
                {summary.alerts.map((alert, i) => (
                  <Card 
                    key={i} 
                    className={`border-l-4 ${
                      alert.type === 'critical' ? 'border-l-red-500 bg-red-500/5' : 'border-l-amber-500 bg-amber-500/5'
                    }`}
                  >
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${alert.type === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                        <div>
                          <p className="font-semibold text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.action}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                        alert.type === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {alert.type}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:border-red-500/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Churn Risk</CardTitle>
                  <Activity className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-red-600">{summary.kpis.avgChurnRisk}%</div>
                  <p className="text-xs text-muted-foreground">Critical threshold: 25%</p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total CLV</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">${(summary.kpis.totalClv / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">Across all segments</p>
                </CardContent>
              </Card>

              <Card className="hover:border-amber-500/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Market Share</CardTitle>
                  <Target className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{summary.kpis.marketShare}%</div>
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <TrendingDown className="w-3 h-3" /> Declining vs. competitors
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{summary.segments.totalCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{summary.segments.total} segments tracked</p>
                </CardContent>
              </Card>
            </div>

            {recommendations && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <CardTitle>AI Executive Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{recommendations.executiveSummary}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {recommendations.topRisks.slice(0, 3).map((risk, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${
                        risk.severity === 'critical' ? 'border-red-500/50 bg-red-500/10' : 'border-amber-500/50 bg-amber-500/10'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold uppercase">{risk.severity}</span>
                          <AlertTriangle className={`w-3 h-3 ${risk.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                        </div>
                        <p className="text-sm font-medium">{risk.risk}</p>
                        <p className="text-xs text-muted-foreground mt-1">{risk.action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="col-span-1 lg:col-span-5">
                <CardHeader>
                  <CardTitle>Segment Health</CardTitle>
                  <CardDescription>Customer distribution by segment</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {segmentChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segmentChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {segmentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                          formatter={(value: number) => [`${value.toLocaleString()}`, 'Customers']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No segment data
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1 lg:col-span-7">
                <CardHeader>
                  <CardTitle>Initiative Prioritization Board</CardTitle>
                  <CardDescription>
                    {summary.initiatives.focus} to FOCUS, {summary.initiatives.pause} to PAUSE
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-sm">FOCUS</span>
                      </div>
                      <div className="space-y-2">
                        {initiatives.filter((i: any) => i.priority === 'focus').map((init: any) => (
                          <div key={init.id} className="p-2 rounded border border-green-500/30 bg-green-500/5">
                            <p className="text-sm font-medium">{init.name}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                Impact: {init.impact}/10
                              </span>
                              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                Effort: {init.effort}/10
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Pause className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-sm">PAUSE</span>
                      </div>
                      <div className="space-y-2">
                        {initiatives.filter((i: any) => i.priority === 'pause').map((init: any) => (
                          <div key={init.id} className="p-2 rounded border border-amber-500/30 bg-amber-500/5">
                            <p className="text-sm font-medium">{init.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{init.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {recommendations && recommendations.strategicMoves && (
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Action Plan</CardTitle>
                  <CardDescription>AI-recommended moves to reverse decline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendations.strategicMoves.map((move, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${
                        move.priority === 'immediate' ? 'border-red-500/50 bg-red-500/5' : 
                        move.priority === 'short-term' ? 'border-amber-500/50 bg-amber-500/5' : 
                        'border-muted'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            move.priority === 'immediate' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            move.priority === 'short-term' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {move.priority}
                          </span>
                        </div>
                        <p className="font-semibold text-sm mb-1">{move.move}</p>
                        <p className="text-xs text-muted-foreground">{move.impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations && recommendations.segmentStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle>Segment-Level Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.segmentStrategy.map((strat, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-lg border">
                        <div className="font-semibold text-sm min-w-[180px]">{strat.segment}</div>
                        <div className="text-sm text-muted-foreground">{strat.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
