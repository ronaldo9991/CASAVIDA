import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, RefreshCw, Database, Download, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Segment } from "@shared/schema";

const SEGMENT_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#06b6d4"];

export default function Segments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: segments = [], isLoading } = useQuery<Segment[]>({
    queryKey: ["/api/segments"],
  });

  const createSegmentsMutation = useMutation({
    mutationFn: async (newSegments: any[]) => {
      const response = await apiRequest("POST", "/api/segments/bulk", newSegments);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
      toast({
        title: "Segments Created",
        description: "Customer segments have been saved to the database.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create segments.",
        variant: "destructive",
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/segments");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
      toast({
        title: "Segments Cleared",
        description: "All segments have been removed.",
      });
    },
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
    })), [segments]);

  const handleDownloadDemo = () => {
    const demoData = [
      { name: "Luxury Minimalists", size: 350, avg_clv: 2800, churn_risk: 0.12, growth_rate: 0.08, description: "High-value customers preferring minimal design" },
      { name: "Young Professionals", size: 280, avg_clv: 1400, churn_risk: 0.22, growth_rate: 0.15, description: "Urban professionals aged 25-35" },
      { name: "Decor Enthusiasts", size: 180, avg_clv: 950, churn_risk: 0.18, growth_rate: 0.12, description: "Passionate about home decoration trends" },
      { name: "Bargain Hunters", size: 120, avg_clv: 450, churn_risk: 0.35, growth_rate: 0.05, description: "Price-sensitive customers" },
    ];

    const csv = Papa.unparse(demoData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'casavida_segments_demo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSegments = () => {
    if (segments.length === 0) {
      toast({
        title: "No Data",
        description: "No segments to export. Generate or upload data first.",
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const parsedSegments = (results.data as any[])
            .filter(row => row.name && row.name.trim())
            .map((row, i) => ({
              name: row.name.trim(),
              size: parseInt(row.size) || parseInt(row.customer_count) || 100,
              avgClv: parseFloat(row.avg_clv) || parseFloat(row.monetary) || 500,
              churnRisk: parseFloat(row.churn_risk) || 0.2,
              growthRate: parseFloat(row.growth_rate) || 0.1,
              description: row.description || null,
              color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
            }));
          
          if (parsedSegments.length > 0) {
            await deleteAllMutation.mutateAsync();
            await createSegmentsMutation.mutateAsync(parsedSegments);
            
            toast({
              title: "Data Imported Successfully",
              description: `Created ${parsedSegments.length} segments from ${file.name}.`,
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
    const syntheticSegments = [
      { name: "Luxury Minimalists", size: 320, avgClv: 2750, churnRisk: 0.12, growthRate: 0.08, color: "#8b5cf6", description: "High-value customers with minimal design preference" },
      { name: "Young Professionals", size: 280, avgClv: 1400, churnRisk: 0.25, growthRate: 0.15, color: "#10b981", description: "Urban professionals seeking modern furniture" },
      { name: "Decor Enthusiasts", size: 190, avgClv: 920, churnRisk: 0.18, growthRate: 0.12, color: "#f59e0b", description: "Trend-conscious home decorators" },
      { name: "Bargain Hunters", size: 110, avgClv: 480, churnRisk: 0.38, growthRate: 0.05, color: "#3b82f6", description: "Price-sensitive occasional buyers" },
    ];

    await deleteAllMutation.mutateAsync();
    await createSegmentsMutation.mutateAsync(syntheticSegments);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Segmentation Engine</h2>
          <p className="text-muted-foreground">AI-driven customer clustering based on RFM and behavioral data.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleDownloadDemo} className="gap-2" data-testid="button-download-demo">
            <Download className="w-4 h-4" />
            Demo CSV
          </Button>
          <Button variant="outline" onClick={handleExportSegments} className="gap-2" data-testid="button-export-segments">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={regenerateData} 
            className="gap-2"
            disabled={createSegmentsMutation.isPending || deleteAllMutation.isPending}
            data-testid="button-regenerate"
          >
            {(createSegmentsMutation.isPending || deleteAllMutation.isPending) ? (
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

      <Card className="mb-8 border-dashed bg-muted/20">
        <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-primary/10 rounded-full">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Data Source</h3>
              <p className="text-sm text-muted-foreground">
                Currently using: <span className="font-medium text-foreground">
                  {segments.length > 0 ? "PostgreSQL Database" : "No Data"}
                </span>
                {segments.length > 0 && ` (${segments.length} segments, ${segments.reduce((acc, s) => acc + s.size, 0).toLocaleString()} customers)`}
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>CSV format: name, size, avg_clv, churn_risk, growth_rate</p>
            <p>Data is persisted to PostgreSQL</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Segment Distribution</CardTitle>
            <CardDescription>Active customer base breakdown by segment.</CardDescription>
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
                <p>No segment data. Upload CSV or generate synthetic data.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average CLV by Segment</CardTitle>
            <CardDescription>Customer Lifetime Value directly from stored database values.</CardDescription>
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
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="avgClv" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No data to display. Add segments first.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
