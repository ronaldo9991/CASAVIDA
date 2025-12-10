import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, RefreshCw, Download, Database, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Competitor } from "@shared/schema";

export default function CompetitorIntel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: competitors = [], isLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const createCompetitorsMutation = useMutation({
    mutationFn: async (newCompetitors: any[]) => {
      const response = await apiRequest("POST", "/api/competitors/bulk", newCompetitors);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      toast({
        title: "Competitors Added",
        description: "Competitor data has been saved to the database.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create competitors.",
        variant: "destructive",
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/competitors");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      toast({
        title: "Competitors Cleared",
        description: "All competitor data has been removed.",
      });
    },
  });

  const competitorTableData = useMemo(() => 
    competitors.map(c => ({
      name: c.name,
      marketShare: c.marketShare,
      priceIndex: c.priceIndex,
      sentiment: Math.round(c.sentiment * 100),
      adSpend: c.adSpend,
    })), [competitors]);

  const shareOfVoice = useMemo(() => {
    if (competitors.length === 0) {
      return [
        { name: "CasaVida", share: 35 },
        { name: "West Elm", share: 25 },
        { name: "Pottery Barn", share: 20 },
        { name: "Other", share: 20 },
      ];
    }
    
    const totalCompetitorShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
    const casaVidaShare = Math.max(0, 100 - totalCompetitorShare);
    
    return [
      { name: "CasaVida", share: casaVidaShare },
      ...competitors.map(c => ({ name: c.name, share: c.marketShare })),
    ];
  }, [competitors]);

  const handleDownloadDemo = () => {
    const demoData = [
      { name: "West Elm", market_share: 25, price_index: 110, sentiment: 0.72, ad_spend: 500000 },
      { name: "Pottery Barn", market_share: 20, price_index: 120, sentiment: 0.68, ad_spend: 450000 },
      { name: "CB2", market_share: 15, price_index: 95, sentiment: 0.75, ad_spend: 300000 },
      { name: "Article", market_share: 10, price_index: 85, sentiment: 0.82, ad_spend: 200000 },
    ];

    const csv = Papa.unparse(demoData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'casavida_competitor_intel_demo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const parsedCompetitors = (results.data as any[])
            .filter(row => row.name && row.name.trim())
            .map(row => ({
              name: row.name.trim(),
              marketShare: parseFloat(row.market_share) || 0,
              priceIndex: parseFloat(row.price_index) || 100,
              sentiment: parseFloat(row.sentiment) || 0.5,
              adSpend: parseFloat(row.ad_spend) || 0,
            }));
          
          if (parsedCompetitors.length > 0) {
            await deleteAllMutation.mutateAsync();
            await createCompetitorsMutation.mutateAsync(parsedCompetitors);
            
            toast({
              title: "Competitor Data Imported",
              description: `Created ${parsedCompetitors.length} competitors from ${file.name}.`,
            });
          } else {
            toast({
              title: "No Valid Data",
              description: "CSV must have a 'name' column. Check the demo CSV for format.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Import error:", error);
        } finally {
          setIsUploading(false);
          event.target.value = '';
        }
      },
      error: (error) => {
        setIsUploading(false);
        toast({
          title: "Import Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const regenerateData = async () => {
    const syntheticCompetitors = [
      { name: "West Elm", marketShare: 25, priceIndex: 115, sentiment: 0.72, adSpend: 500000 },
      { name: "Pottery Barn", marketShare: 20, priceIndex: 125, sentiment: 0.68, adSpend: 450000 },
      { name: "CB2", marketShare: 15, priceIndex: 98, sentiment: 0.78, adSpend: 320000 },
    ];

    await deleteAllMutation.mutateAsync();
    await createCompetitorsMutation.mutateAsync(syntheticCompetitors);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Competitive Intelligence</h2>
          <p className="text-muted-foreground">Market positioning and threat analysis.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleDownloadDemo} className="gap-2" data-testid="button-download-demo">
            <Download className="w-4 h-4" />
            Demo CSV
          </Button>
          <Button variant="outline" onClick={handleExportCompetitors} className="gap-2" data-testid="button-export">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={regenerateData}
            disabled={createCompetitorsMutation.isPending || deleteAllMutation.isPending}
            className="gap-2"
            data-testid="button-regenerate"
          >
            {(createCompetitorsMutation.isPending || deleteAllMutation.isPending) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate Synthetic
          </Button>
          <div className="relative">
            <Input 
              type="file" 
              accept=".csv" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full" 
              onChange={handleFileUpload}
              disabled={isUploading}
              data-testid="input-csv-upload"
            />
            <Button className="gap-2 pointer-events-none">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
              {isUploading ? "Processing..." : "Upload CSV"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Metrics</CardTitle>
            <CardDescription>
              {competitors.length > 0 
                ? `Stored data for ${competitors.length} competitors (priceIndex, sentiment %, marketShare %)`
                : "No competitor data loaded - upload CSV or generate data"
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
                <p>No competitor data. Upload CSV or generate data first.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share of Voice</CardTitle>
              <CardDescription>
                {competitors.length > 0 
                  ? `Market share distribution (${competitors.length} competitors tracked)`
                  : "Sample data - upload CSV to see real data"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shareOfVoice.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-bold">{Math.round(item.share)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${index === 0 ? 'bg-primary' : 'bg-stone-400'}`}
                        style={{ width: `${Math.min(item.share, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Data Persistence</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {competitors.length > 0 
                      ? `${competitors.length} competitors stored in PostgreSQL. Charts reflect database values.`
                      : "Upload CSV or generate synthetic data to persist competitors."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
