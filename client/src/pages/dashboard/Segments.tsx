import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertTriangle, TrendingDown, TrendingUp, Heart } from "lucide-react";
import { useMemo } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Segment } from "@shared/schema";

const SEGMENT_COLORS = ["#ef4444", "#f59e0b", "#6b7280", "#8b5cf6", "#10b981", "#3b82f6"];

export default function Segments() {
  const { toast } = useToast();

  const { data: segments = [], isLoading } = useQuery<Segment[]>({
    queryKey: ["/api/segments"],
  });

  const segmentsChartData = useMemo(() => 
    segments.map((s, i) => ({
      name: s.name,
      value: s.size,
      color: s.color || SEGMENT_COLORS[i % SEGMENT_COLORS.length],
    })), [segments]);

  const clvBarData = useMemo(() => 
    segments.map(s => ({
      name: s.name,
      avgClv: s.avgClv,
      size: s.size,
      churnRisk: Math.round(s.churnRisk * 100),
      healthScore: s.healthScore || 50,
    })), [segments]);

  const handleExportSegments = () => {
    if (segments.length === 0) {
      toast({
        title: "No Data",
        description: "No segments to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = segments.map(s => ({
      name: s.name,
      size: s.size,
      avg_clv: s.avgClv,
      churn_risk: s.churnRisk,
      growth_rate: s.growthRate,
      health_score: s.healthScore,
      clv_trend: s.clvTrend,
      is_core: s.isCore,
      retention_rate: s.retentionRate,
      acquisition_cost: s.acquisitionCost,
      description: s.description,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `casavida_segments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `Exported ${segments.length} segments to CSV.`,
    });
  };

  const coreSegment = segments.find(s => s.isCore);
  const totalCustomers = segments.reduce((acc, s) => acc + s.size, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Segments</h2>
          <p className="text-muted-foreground">Health metrics, CLV trends, and churn risk analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportSegments} className="gap-2" data-testid="button-export-segments">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {segments.length === 0 && !isLoading && (
        <Card className="mb-8 border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <div>
              <h3 className="font-semibold">No Segment Data</h3>
              <p className="text-sm text-muted-foreground">
                Use the "Load Crisis Data" button on the dashboard to populate CasaVida segment data.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {segments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {segments.map((segment, i) => (
            <Card 
              key={segment.id} 
              className={`relative overflow-hidden ${segment.isCore ? 'border-red-500/50 bg-red-500/5' : ''}`}
              data-testid={`card-segment-${segment.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  {segment.isCore && (
                    <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                      Core Segment
                    </span>
                  )}
                </div>
                <CardDescription>{segment.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-semibold">{segment.size.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg CLV</p>
                    <p className="font-semibold">${segment.avgClv.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> Health Score
                    </span>
                    <span className={`font-bold ${(segment.healthScore || 0) < 40 ? 'text-red-500' : (segment.healthScore || 0) < 60 ? 'text-amber-500' : 'text-green-500'}`}>
                      {segment.healthScore || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${(segment.healthScore || 0) < 40 ? 'bg-red-500' : (segment.healthScore || 0) < 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${segment.healthScore || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className={`w-3 h-3 ${segment.churnRisk > 0.3 ? 'text-red-500' : 'text-muted-foreground'}`} />
                    <span>Churn: {Math.round(segment.churnRisk * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(segment.clvTrend || 0) < 0 ? (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    )}
                    <span className={(segment.clvTrend || 0) < 0 ? 'text-red-500' : 'text-green-500'}>
                      CLV: {((segment.clvTrend || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Segment Distribution</CardTitle>
            <CardDescription>
              {totalCustomers.toLocaleString()} total customers across {segments.length} segments.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : segmentsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentsChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {segmentsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    formatter={(value: number) => [`${value.toLocaleString()} customers`, 'Size']}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No segment data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CLV & Churn Risk by Segment</CardTitle>
            <CardDescription>Deterministic values from database.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {clvBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clvBarData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} angle={-25} textAnchor="end" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    formatter={(value: number, name: string) => {
                      if (name === 'avgClv') return [`$${value.toLocaleString()}`, 'Avg CLV'];
                      if (name === 'churnRisk') return [`${value}%`, 'Churn Risk'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="avgClv" name="Avg CLV" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No data to display.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
