import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileUp, RefreshCw, Database } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
type SegmentData = { name: string; value: number; color: string };
type ClusterData = { x: number; y: number; z: number };

// --- Synthetic Data Generators ---
const generateSyntheticSegments = (): SegmentData[] => [
  { name: "Luxury Minimalists", value: Math.floor(Math.random() * 300) + 200, color: "#8b5cf6" },
  { name: "Young Professionals", value: Math.floor(Math.random() * 300) + 150, color: "#10b981" },
  { name: "Decor Enthusiasts", value: Math.floor(Math.random() * 200) + 100, color: "#f59e0b" },
  { name: "Bargain Hunters", value: Math.floor(Math.random() * 150) + 50, color: "#3b82f6" },
];

const generateSyntheticCluster = (): ClusterData[] => {
  return Array.from({ length: 50 }, () => ({
    x: Math.floor(Math.random() * 200), // Recency
    y: Math.floor(Math.random() * 5000), // Monetary
    z: Math.floor(Math.random() * 500), // Frequency (represented as z usually, or just size)
  }));
};

export default function Segments() {
  const { toast } = useToast();
  const [segmentsData, setSegmentsData] = useState<SegmentData[]>(generateSyntheticSegments());
  const [clusterData, setClusterData] = useState<ClusterData[]>(generateSyntheticCluster());
  const [isUploading, setIsUploading] = useState(false);

  // --- Handlers ---

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);
        setIsUploading(false);
        toast({
          title: "Data Imported Successfully",
          description: `Processed ${results.data.length} records from ${file.name}. Charts updated.`,
        });
        // In a real app, we would transform this data to match chart formats.
        // For mockup, we'll just regenerate random data to simulate "change"
        regenerateData();
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

  const regenerateData = () => {
    setSegmentsData(generateSyntheticSegments());
    setClusterData(generateSyntheticCluster());
    toast({
        title: "Synthetic Data Regenerated",
        description: "New random dataset created for simulation.",
    });
  };

  return (
    <DashboardLayout>
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Segmentation Engine</h2>
            <p className="text-muted-foreground">AI-driven customer clustering based on RFM and behavioral data.</p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" onClick={regenerateData} className="gap-2">
                 <RefreshCw className="w-4 h-4" />
                 Generate Synthetic
             </Button>
             <div className="relative">
                 <Input 
                    type="file" 
                    accept=".csv" 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                 />
                 <Button className="gap-2 pointer-events-none">
                     {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                     {isUploading ? "Processing..." : "Upload CSV"}
                 </Button>
             </div>
          </div>
      </div>

      {/* Upload/Data Info Card */}
      <Card className="mb-8 border-dashed bg-muted/20">
          <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="p-3 bg-primary/10 rounded-full">
                      <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="font-semibold">Data Source</h3>
                      <p className="text-sm text-muted-foreground">Currently using: <span className="font-medium text-foreground">Synthetic Simulation</span></p>
                  </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                  <p>Supported format: CSV (customer_id, recency, frequency, monetary)</p>
                  <p>Max file size: 50MB</p>
              </div>
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Segment Distribution</CardTitle>
                  <CardDescription>Active customer base breakdown.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segmentsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {segmentsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}/>
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>RFM Value Clusters</CardTitle>
                  <CardDescription>Recency vs. Monetary value scatter plot (High Value Outliers).</CardDescription>
              </CardHeader>
               <CardContent className="h-[350px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" dataKey="x" name="Recency" unit="d" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis type="number" dataKey="y" name="Monetary" unit="$" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                        <Scatter name="Customers" data={clusterData} fill="hsl(var(--primary))" opacity={0.6} />
                      </ScatterChart>
                    </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}
