import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileUp, RefreshCw, Download, Database } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const initialData = [
  { subject: 'Price', A: 120, B: 110, fullMark: 150 },
  { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
  { subject: 'Brand', A: 86, B: 130, fullMark: 150 },
  { subject: 'Service', A: 99, B: 100, fullMark: 150 },
  { subject: 'Innovation', A: 85, B: 90, fullMark: 150 },
  { subject: 'Range', A: 65, B: 85, fullMark: 150 },
];

export default function CompetitorIntel() {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadDemo = () => {
    // Generate demo data for competitor analysis
    const demoData = [
        { subject: 'Price', casavida_score: 120, competitor_score: 110 },
        { subject: 'Quality', casavida_score: 98, competitor_score: 130 },
        { subject: 'Brand', casavida_score: 86, competitor_score: 130 },
        { subject: 'Service', casavida_score: 99, competitor_score: 100 },
        { subject: 'Innovation', casavida_score: 85, competitor_score: 90 },
        { subject: 'Range', casavida_score: 65, competitor_score: 85 },
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
          title: "Competitor Data Imported",
          description: `Processed ${results.data.length} records. Intelligence map updated.`,
        });
        
        // Simulate updating data with new random values for visualization
        const newData = data.map(item => ({
            ...item,
            B: Math.floor(Math.random() * 50) + 80 // Randomize competitor score
        }));
        setData(newData);
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

  return (
    <DashboardLayout>
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Competitive Intelligence</h2>
            <p className="text-muted-foreground">Market positioning and threat analysis.</p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" onClick={handleDownloadDemo} className="gap-2">
                 <Download className="w-4 h-4" />
                 Download Demo CSV
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
              <CardHeader>
                  <CardTitle>Brand Positioning Map</CardTitle>
                  <CardDescription>CasaVida vs. Competitors</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                      <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="CasaVida" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <Radar name="Competitor X" dataKey="B" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>

          <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Share of Voice</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                  <span>CasaVida</span>
                                  <span className="font-bold">35%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary w-[35%]"></div>
                              </div>
                          </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                  <span>West Elm</span>
                                  <span className="font-bold">25%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-stone-400 w-[25%]"></div>
                              </div>
                          </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                  <span>Pottery Barn</span>
                                  <span className="font-bold">20%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-stone-300 w-[20%]"></div>
                              </div>
                          </div>
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
                              <h3 className="font-semibold text-sm">Real-time Intelligence</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                  Upload a CSV with columns: <code>subject</code>, <code>casavida_score</code>, <code>competitor_score</code> to update the radar map instantly.
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
