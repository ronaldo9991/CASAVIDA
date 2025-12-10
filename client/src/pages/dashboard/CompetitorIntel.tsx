import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertTriangle, Shield, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Competitor } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BEFORE_COMPETITORS = [
  { name: "HomeStyle Direct", marketShare: 28, threat: "high", priceIndex: 92, sentiment: 82 },
  { name: "ModernNest", marketShare: 18, threat: "high", priceIndex: 115, sentiment: 78 },
  { name: "ValueHome", marketShare: 22, threat: "medium", priceIndex: 78, sentiment: 68 },
];

const AFTER_COMPETITORS = [
  { name: "HomeStyle Direct", marketShare: 26, threat: "medium", priceIndex: 92, sentiment: 80 },
  { name: "ModernNest", marketShare: 17, threat: "medium", priceIndex: 115, sentiment: 76 },
  { name: "ValueHome", marketShare: 20, threat: "low", priceIndex: 78, sentiment: 65 },
];

const MARKET_SHARE_PROGRESSION = [
  { month: "Before", casaVida: 32, homeStyle: 28, modernNest: 18, valueHome: 22 },
  { month: "Month 2", casaVida: 33, homeStyle: 28, modernNest: 18, valueHome: 21 },
  { month: "Month 4", casaVida: 35, homeStyle: 27, modernNest: 17, valueHome: 21 },
  { month: "After", casaVida: 37, homeStyle: 26, modernNest: 17, valueHome: 20 },
];

export default function CompetitorIntel() {
  const { toast } = useToast();

  const { data: competitors = [], isLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const competitorTableData = useMemo(() => 
    competitors.map(c => ({
      name: c.name,
      marketShare: c.marketShare,
      priceIndex: c.priceIndex,
      sentiment: Math.round(c.sentiment * 100),
      adSpend: c.adSpend,
      threat: c.threat,
    })), [competitors]);

  const shareOfVoice = useMemo(() => {
    if (competitors.length === 0) return [];
    
    const totalCompetitorShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
    const casaVidaShare = Math.max(0, 100 - totalCompetitorShare);
    
    return [
      { name: "CasaVida", share: casaVidaShare, isUs: true },
      ...competitors.map(c => ({ name: c.name, share: c.marketShare, isUs: false, threat: c.threat })),
    ];
  }, [competitors]);

  const handleExportCompetitors = () => {
    if (competitors.length === 0) {
      toast({
        title: "No Data",
        description: "No competitor data to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = competitors.map(c => ({
      name: c.name,
      market_share: c.marketShare,
      price_index: c.priceIndex,
      sentiment: c.sentiment,
      ad_spend: c.adSpend,
      threat: c.threat,
      strengths: c.strengths?.join("; "),
      weaknesses: c.weaknesses?.join("; "),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `casavida_competitors_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `Exported ${competitors.length} competitors to CSV.`,
    });
  };

  const highThreatCount = competitors.filter(c => c.threat === "high").length;

  const beforeMarketShare = 100 - BEFORE_COMPETITORS.reduce((acc, c) => acc + c.marketShare, 0);
  const afterMarketShare = 100 - AFTER_COMPETITORS.reduce((acc, c) => acc + c.marketShare, 0);
  const marketShareGain = afterMarketShare - beforeMarketShare;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Competitive Intelligence</h2>
          <p className="text-muted-foreground">Before vs After strategy: Market positioning and threat analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCompetitors} className="gap-2" data-testid="button-export">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Share Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{marketShareGain}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{beforeMarketShare}%</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-green-600">{afterMarketShare}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Threat Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2 → 0</div>
            <p className="text-xs text-muted-foreground">High-threat competitors neutralized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Competitive Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Strengthened</div>
            <p className="text-xs text-muted-foreground">Via value-focused strategy</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Market Share Progression</CardTitle>
          <CardDescription>CasaVida vs competitors over 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MARKET_SHARE_PROGRESSION} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 50]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} formatter={(value) => [`${value}%`, '']} />
              <Legend />
              <Line type="monotone" dataKey="casaVida" name="CasaVida" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="homeStyle" name="HomeStyle Direct" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="modernNest" name="ModernNest" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="valueHome" name="ValueHome" stroke="#6b7280" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {competitors.length === 0 && !isLoading && (
        <Card className="mb-8 border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <div>
              <h3 className="font-semibold">No Competitor Data</h3>
              <p className="text-sm text-muted-foreground">
                Use the "Load Crisis Data" button on the dashboard to populate competitor intelligence.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {highThreatCount > 0 && (
        <Card className="mb-8 border-red-500/50 bg-red-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">
                {highThreatCount} High-Threat Competitor{highThreatCount > 1 ? 's' : ''} Detected
              </h3>
              <p className="text-sm text-muted-foreground">
                Competitors are gaining market share through aggressive pricing and superior loyalty programs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {competitors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {competitors.map((competitor) => (
            <Card 
              key={competitor.id} 
              className={`${competitor.threat === 'high' ? 'border-red-500/50' : competitor.threat === 'medium' ? 'border-amber-500/50' : ''}`}
              data-testid={`card-competitor-${competitor.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    competitor.threat === 'high' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : competitor.threat === 'medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {competitor.threat} threat
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Market Share</p>
                    <p className="font-semibold text-lg">{competitor.marketShare}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price Index</p>
                    <p className="font-semibold text-lg">{competitor.priceIndex}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sentiment</span>
                    <span className="font-bold">{Math.round(competitor.sentiment * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${competitor.sentiment * 100}%` }}
                    />
                  </div>
                </div>

                {competitor.strengths && competitor.strengths.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Key Strengths:</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.strengths.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Metrics</CardTitle>
            <CardDescription>
              {competitors.length > 0 
                ? `${competitors.length} competitors tracked`
                : "No competitor data loaded"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : competitorTableData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorTableData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    formatter={(value: number, name: string) => {
                      if (name === 'priceIndex') return [value, 'Price Index'];
                      if (name === 'sentiment') return [`${value}%`, 'Sentiment'];
                      if (name === 'marketShare') return [`${Math.round(value)}%`, 'Market Share'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="priceIndex" fill="hsl(var(--primary))" name="priceIndex" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sentiment" fill="hsl(var(--chart-1))" name="sentiment" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marketShare" fill="hsl(var(--chart-2))" name="marketShare" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No competitor data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Share Distribution</CardTitle>
            <CardDescription>
              {shareOfVoice.length > 0 
                ? `CasaVida vs ${competitors.length} tracked competitors`
                : "Load data to see market share"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shareOfVoice.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {item.name}
                      {(item as any).isUs && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">YOU</span>
                      )}
                    </span>
                    <span className="font-bold">{Math.round(item.share)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${(item as any).isUs ? 'bg-primary' : (item as any).threat === 'high' ? 'bg-red-500' : 'bg-stone-400'}`}
                      style={{ width: `${Math.min(item.share, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
