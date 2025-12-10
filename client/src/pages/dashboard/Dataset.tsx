import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { Upload, Download, FileSpreadsheet, TrendingDown, TrendingUp, Users, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const SYNTHETIC_BEFORE_DATA = [
  { id: 1, customerId: "FH-1001", segment: "Functional Homemakers", predictedChurnRisk: 0.38, actualChurn: 0.35, clv: 680, healthScore: 28, purchaseFreq: 2.1, avgOrderValue: 320, daysInactive: 45, totalOrders: 8, tenure: 24, lastPurchase: "2024-01-15", region: "Dubai" },
  { id: 2, customerId: "FH-1002", segment: "Functional Homemakers", predictedChurnRisk: 0.42, actualChurn: 0.40, clv: 620, healthScore: 24, purchaseFreq: 1.8, avgOrderValue: 280, daysInactive: 60, totalOrders: 6, tenure: 18, lastPurchase: "2023-12-20", region: "Dubai" },
  { id: 3, customerId: "FH-1003", segment: "Functional Homemakers", predictedChurnRisk: 0.35, actualChurn: 0.32, clv: 720, healthScore: 32, purchaseFreq: 2.4, avgOrderValue: 350, daysInactive: 30, totalOrders: 12, tenure: 36, lastPurchase: "2024-02-01", region: "Mumbai" },
  { id: 4, customerId: "FH-1004", segment: "Functional Homemakers", predictedChurnRisk: 0.45, actualChurn: 0.42, clv: 580, healthScore: 22, purchaseFreq: 1.6, avgOrderValue: 260, daysInactive: 75, totalOrders: 5, tenure: 15, lastPurchase: "2023-11-10", region: "Delhi" },
  { id: 5, customerId: "FH-1005", segment: "Functional Homemakers", predictedChurnRisk: 0.32, actualChurn: 0.30, clv: 750, healthScore: 35, purchaseFreq: 2.6, avgOrderValue: 380, daysInactive: 25, totalOrders: 14, tenure: 42, lastPurchase: "2024-02-10", region: "Dubai" },
  { id: 6, customerId: "FH-1006", segment: "Functional Homemakers", predictedChurnRisk: 0.48, actualChurn: 0.45, clv: 520, healthScore: 18, purchaseFreq: 1.4, avgOrderValue: 240, daysInactive: 85, totalOrders: 4, tenure: 12, lastPurchase: "2023-10-25", region: "Mumbai" },
  { id: 7, customerId: "FH-1007", segment: "Functional Homemakers", predictedChurnRisk: 0.28, actualChurn: 0.25, clv: 820, healthScore: 42, purchaseFreq: 2.8, avgOrderValue: 400, daysInactive: 18, totalOrders: 16, tenure: 48, lastPurchase: "2024-02-15", region: "Dubai" },
  { id: 8, customerId: "FH-1008", segment: "Functional Homemakers", predictedChurnRisk: 0.52, actualChurn: 0.48, clv: 480, healthScore: 15, purchaseFreq: 1.2, avgOrderValue: 220, daysInactive: 95, totalOrders: 3, tenure: 10, lastPurchase: "2023-09-30", region: "Delhi" },
  { id: 9, customerId: "FH-1009", segment: "Functional Homemakers", predictedChurnRisk: 0.36, actualChurn: 0.33, clv: 695, healthScore: 30, purchaseFreq: 2.2, avgOrderValue: 335, daysInactive: 40, totalOrders: 9, tenure: 28, lastPurchase: "2024-01-20", region: "Mumbai" },
  { id: 10, customerId: "FH-1010", segment: "Functional Homemakers", predictedChurnRisk: 0.40, actualChurn: 0.38, clv: 640, healthScore: 26, purchaseFreq: 1.9, avgOrderValue: 295, daysInactive: 55, totalOrders: 7, tenure: 20, lastPurchase: "2024-01-05", region: "Dubai" },
  { id: 11, customerId: "HE-2001", segment: "Home Enhancers", predictedChurnRisk: 0.22, actualChurn: 0.20, clv: 1850, healthScore: 42, purchaseFreq: 4.2, avgOrderValue: 580, daysInactive: 15, totalOrders: 22, tenure: 36, lastPurchase: "2024-02-08", region: "Dubai" },
  { id: 12, customerId: "HE-2002", segment: "Home Enhancers", predictedChurnRisk: 0.25, actualChurn: 0.24, clv: 1720, healthScore: 38, purchaseFreq: 3.8, avgOrderValue: 520, daysInactive: 22, totalOrders: 18, tenure: 30, lastPurchase: "2024-01-28", region: "Dubai" },
  { id: 13, customerId: "HE-2003", segment: "Home Enhancers", predictedChurnRisk: 0.18, actualChurn: 0.16, clv: 2100, healthScore: 52, purchaseFreq: 5.1, avgOrderValue: 680, daysInactive: 8, totalOrders: 28, tenure: 48, lastPurchase: "2024-02-12", region: "Dubai" },
  { id: 14, customerId: "HE-2004", segment: "Home Enhancers", predictedChurnRisk: 0.28, actualChurn: 0.26, clv: 1580, healthScore: 35, purchaseFreq: 3.5, avgOrderValue: 480, daysInactive: 28, totalOrders: 15, tenure: 24, lastPurchase: "2024-01-22", region: "Mumbai" },
  { id: 15, customerId: "HE-2005", segment: "Home Enhancers", predictedChurnRisk: 0.15, actualChurn: 0.14, clv: 2350, healthScore: 58, purchaseFreq: 5.8, avgOrderValue: 720, daysInactive: 5, totalOrders: 32, tenure: 60, lastPurchase: "2024-02-18", region: "Dubai" },
  { id: 16, customerId: "OB-3001", segment: "Occasional Browsers", predictedChurnRisk: 0.55, actualChurn: 0.52, clv: 180, healthScore: 18, purchaseFreq: 0.8, avgOrderValue: 120, daysInactive: 90, totalOrders: 2, tenure: 8, lastPurchase: "2023-11-20", region: "Delhi" },
  { id: 17, customerId: "OB-3002", segment: "Occasional Browsers", predictedChurnRisk: 0.62, actualChurn: 0.58, clv: 140, healthScore: 12, purchaseFreq: 0.5, avgOrderValue: 95, daysInactive: 120, totalOrders: 1, tenure: 6, lastPurchase: "2023-10-05", region: "Mumbai" },
  { id: 18, customerId: "OB-3003", segment: "Occasional Browsers", predictedChurnRisk: 0.48, actualChurn: 0.45, clv: 220, healthScore: 22, purchaseFreq: 1.2, avgOrderValue: 150, daysInactive: 65, totalOrders: 3, tenure: 12, lastPurchase: "2023-12-15", region: "Dubai" },
  { id: 19, customerId: "OB-3004", segment: "Occasional Browsers", predictedChurnRisk: 0.58, actualChurn: 0.55, clv: 160, healthScore: 15, purchaseFreq: 0.6, avgOrderValue: 110, daysInactive: 100, totalOrders: 2, tenure: 10, lastPurchase: "2023-11-01", region: "Delhi" },
  { id: 20, customerId: "OB-3005", segment: "Occasional Browsers", predictedChurnRisk: 0.45, actualChurn: 0.42, clv: 240, healthScore: 25, purchaseFreq: 1.4, avgOrderValue: 165, daysInactive: 55, totalOrders: 4, tenure: 14, lastPurchase: "2023-12-28", region: "Mumbai" },
  { id: 21, customerId: "FH-1011", segment: "Functional Homemakers", predictedChurnRisk: 0.39, actualChurn: 0.36, clv: 665, healthScore: 27, purchaseFreq: 2.0, avgOrderValue: 310, daysInactive: 48, totalOrders: 7, tenure: 22, lastPurchase: "2024-01-12", region: "Delhi" },
  { id: 22, customerId: "FH-1012", segment: "Functional Homemakers", predictedChurnRisk: 0.44, actualChurn: 0.41, clv: 595, healthScore: 23, purchaseFreq: 1.7, avgOrderValue: 270, daysInactive: 68, totalOrders: 5, tenure: 16, lastPurchase: "2023-12-08", region: "Mumbai" },
  { id: 23, customerId: "HE-2006", segment: "Home Enhancers", predictedChurnRisk: 0.20, actualChurn: 0.18, clv: 1950, healthScore: 48, purchaseFreq: 4.6, avgOrderValue: 620, daysInactive: 12, totalOrders: 24, tenure: 40, lastPurchase: "2024-02-05", region: "Dubai" },
  { id: 24, customerId: "OB-3006", segment: "Occasional Browsers", predictedChurnRisk: 0.52, actualChurn: 0.49, clv: 195, healthScore: 20, purchaseFreq: 0.9, avgOrderValue: 135, daysInactive: 80, totalOrders: 2, tenure: 9, lastPurchase: "2023-11-25", region: "Dubai" },
  { id: 25, customerId: "FH-1013", segment: "Functional Homemakers", predictedChurnRisk: 0.33, actualChurn: 0.31, clv: 735, healthScore: 34, purchaseFreq: 2.5, avgOrderValue: 365, daysInactive: 28, totalOrders: 11, tenure: 34, lastPurchase: "2024-02-03", region: "Dubai" },
];

const SYNTHETIC_AFTER_DATA = [
  { id: 1, customerId: "FH-1001", segment: "Functional Homemakers", predictedChurnRisk: 0.15, actualChurn: 0.12, clv: 820, healthScore: 72, purchaseFreq: 3.4, avgOrderValue: 380, daysInactive: 12, totalOrders: 14, tenure: 30, lastPurchase: "2024-08-15", region: "Dubai" },
  { id: 2, customerId: "FH-1002", segment: "Functional Homemakers", predictedChurnRisk: 0.18, actualChurn: 0.15, clv: 780, healthScore: 68, purchaseFreq: 3.1, avgOrderValue: 360, daysInactive: 18, totalOrders: 11, tenure: 24, lastPurchase: "2024-08-05", region: "Dubai" },
  { id: 3, customerId: "FH-1003", segment: "Functional Homemakers", predictedChurnRisk: 0.12, actualChurn: 0.10, clv: 880, healthScore: 78, purchaseFreq: 3.8, avgOrderValue: 420, daysInactive: 8, totalOrders: 18, tenure: 42, lastPurchase: "2024-08-18", region: "Mumbai" },
  { id: 4, customerId: "FH-1004", segment: "Functional Homemakers", predictedChurnRisk: 0.20, actualChurn: 0.18, clv: 720, healthScore: 65, purchaseFreq: 2.8, avgOrderValue: 340, daysInactive: 22, totalOrders: 9, tenure: 21, lastPurchase: "2024-07-28", region: "Delhi" },
  { id: 5, customerId: "FH-1005", segment: "Functional Homemakers", predictedChurnRisk: 0.10, actualChurn: 0.08, clv: 920, healthScore: 82, purchaseFreq: 4.2, avgOrderValue: 450, daysInactive: 5, totalOrders: 22, tenure: 48, lastPurchase: "2024-08-20", region: "Dubai" },
  { id: 6, customerId: "FH-1006", segment: "Functional Homemakers", predictedChurnRisk: 0.22, actualChurn: 0.20, clv: 680, healthScore: 62, purchaseFreq: 2.6, avgOrderValue: 320, daysInactive: 25, totalOrders: 8, tenure: 18, lastPurchase: "2024-07-22", region: "Mumbai" },
  { id: 7, customerId: "FH-1007", segment: "Functional Homemakers", predictedChurnRisk: 0.08, actualChurn: 0.06, clv: 980, healthScore: 88, purchaseFreq: 4.6, avgOrderValue: 480, daysInactive: 3, totalOrders: 26, tenure: 54, lastPurchase: "2024-08-22", region: "Dubai" },
  { id: 8, customerId: "FH-1008", segment: "Functional Homemakers", predictedChurnRisk: 0.25, actualChurn: 0.22, clv: 640, healthScore: 58, purchaseFreq: 2.4, avgOrderValue: 300, daysInactive: 30, totalOrders: 7, tenure: 16, lastPurchase: "2024-07-15", region: "Delhi" },
  { id: 9, customerId: "FH-1009", segment: "Functional Homemakers", predictedChurnRisk: 0.14, actualChurn: 0.12, clv: 850, healthScore: 74, purchaseFreq: 3.5, avgOrderValue: 395, daysInactive: 10, totalOrders: 15, tenure: 34, lastPurchase: "2024-08-12", region: "Mumbai" },
  { id: 10, customerId: "FH-1010", segment: "Functional Homemakers", predictedChurnRisk: 0.16, actualChurn: 0.14, clv: 800, healthScore: 70, purchaseFreq: 3.2, avgOrderValue: 370, daysInactive: 14, totalOrders: 12, tenure: 26, lastPurchase: "2024-08-08", region: "Dubai" },
  { id: 11, customerId: "HE-2001", segment: "Home Enhancers", predictedChurnRisk: 0.18, actualChurn: 0.16, clv: 1920, healthScore: 55, purchaseFreq: 4.5, avgOrderValue: 620, daysInactive: 12, totalOrders: 26, tenure: 42, lastPurchase: "2024-08-10", region: "Dubai" },
  { id: 12, customerId: "HE-2002", segment: "Home Enhancers", predictedChurnRisk: 0.20, actualChurn: 0.18, clv: 1850, healthScore: 52, purchaseFreq: 4.2, avgOrderValue: 580, daysInactive: 16, totalOrders: 22, tenure: 36, lastPurchase: "2024-08-02", region: "Dubai" },
  { id: 13, customerId: "HE-2003", segment: "Home Enhancers", predictedChurnRisk: 0.15, actualChurn: 0.12, clv: 2150, healthScore: 58, purchaseFreq: 5.2, avgOrderValue: 720, daysInactive: 6, totalOrders: 32, tenure: 54, lastPurchase: "2024-08-18", region: "Dubai" },
  { id: 14, customerId: "HE-2004", segment: "Home Enhancers", predictedChurnRisk: 0.22, actualChurn: 0.20, clv: 1680, healthScore: 48, purchaseFreq: 3.8, avgOrderValue: 520, daysInactive: 20, totalOrders: 18, tenure: 30, lastPurchase: "2024-07-28", region: "Mumbai" },
  { id: 15, customerId: "HE-2005", segment: "Home Enhancers", predictedChurnRisk: 0.12, actualChurn: 0.10, clv: 2400, healthScore: 62, purchaseFreq: 6.0, avgOrderValue: 780, daysInactive: 4, totalOrders: 38, tenure: 66, lastPurchase: "2024-08-20", region: "Dubai" },
  { id: 16, customerId: "OB-3001", segment: "Occasional Browsers", predictedChurnRisk: 0.42, actualChurn: 0.38, clv: 210, healthScore: 28, purchaseFreq: 1.4, avgOrderValue: 165, daysInactive: 55, totalOrders: 4, tenure: 14, lastPurchase: "2024-06-28", region: "Delhi" },
  { id: 17, customerId: "OB-3002", segment: "Occasional Browsers", predictedChurnRisk: 0.48, actualChurn: 0.44, clv: 175, healthScore: 22, purchaseFreq: 1.0, avgOrderValue: 130, daysInactive: 72, totalOrders: 2, tenure: 12, lastPurchase: "2024-06-05", region: "Mumbai" },
  { id: 18, customerId: "OB-3003", segment: "Occasional Browsers", predictedChurnRisk: 0.38, actualChurn: 0.35, clv: 245, healthScore: 32, purchaseFreq: 1.6, avgOrderValue: 180, daysInactive: 42, totalOrders: 5, tenure: 18, lastPurchase: "2024-07-08", region: "Dubai" },
  { id: 19, customerId: "OB-3004", segment: "Occasional Browsers", predictedChurnRisk: 0.45, actualChurn: 0.42, clv: 190, healthScore: 25, purchaseFreq: 1.2, avgOrderValue: 145, daysInactive: 62, totalOrders: 3, tenure: 16, lastPurchase: "2024-06-18", region: "Delhi" },
  { id: 20, customerId: "OB-3005", segment: "Occasional Browsers", predictedChurnRisk: 0.35, actualChurn: 0.32, clv: 280, healthScore: 35, purchaseFreq: 1.8, avgOrderValue: 195, daysInactive: 35, totalOrders: 6, tenure: 20, lastPurchase: "2024-07-18", region: "Mumbai" },
  { id: 21, customerId: "FH-1011", segment: "Functional Homemakers", predictedChurnRisk: 0.17, actualChurn: 0.15, clv: 790, healthScore: 69, purchaseFreq: 3.3, avgOrderValue: 365, daysInactive: 16, totalOrders: 12, tenure: 28, lastPurchase: "2024-08-06", region: "Delhi" },
  { id: 22, customerId: "FH-1012", segment: "Functional Homemakers", predictedChurnRisk: 0.19, actualChurn: 0.17, clv: 760, healthScore: 66, purchaseFreq: 3.0, avgOrderValue: 350, daysInactive: 20, totalOrders: 10, tenure: 22, lastPurchase: "2024-08-01", region: "Mumbai" },
  { id: 23, customerId: "HE-2006", segment: "Home Enhancers", predictedChurnRisk: 0.16, actualChurn: 0.14, clv: 2050, healthScore: 56, purchaseFreq: 4.8, avgOrderValue: 660, daysInactive: 10, totalOrders: 28, tenure: 46, lastPurchase: "2024-08-14", region: "Dubai" },
  { id: 24, customerId: "OB-3006", segment: "Occasional Browsers", predictedChurnRisk: 0.40, actualChurn: 0.36, clv: 225, healthScore: 30, purchaseFreq: 1.5, avgOrderValue: 170, daysInactive: 48, totalOrders: 4, tenure: 15, lastPurchase: "2024-07-02", region: "Dubai" },
  { id: 25, customerId: "FH-1013", segment: "Functional Homemakers", predictedChurnRisk: 0.11, actualChurn: 0.09, clv: 895, healthScore: 80, purchaseFreq: 4.0, avgOrderValue: 435, daysInactive: 6, totalOrders: 17, tenure: 40, lastPurchase: "2024-08-17", region: "Dubai" },
];

const MODEL_ACCURACY_DATA = [
  { month: "Before", accuracy: 0, mape: 0 },
  { month: "Month 1", accuracy: 72, mape: 18 },
  { month: "Month 2", accuracy: 78, mape: 14 },
  { month: "Month 3", accuracy: 82, mape: 11 },
  { month: "Month 4", accuracy: 85, mape: 9 },
  { month: "Month 5", accuracy: 87, mape: 8 },
  { month: "Month 6", accuracy: 89, mape: 7 },
];

const SEGMENT_COMPARISON = [
  { segment: "Functional Homemakers", beforeChurn: 38, afterChurn: 15, beforeCLV: 680, afterCLV: 820, beforeHealth: 28, afterHealth: 72 },
  { segment: "Home Enhancers", beforeChurn: 22, afterChurn: 18, beforeCLV: 1850, afterCLV: 1920, beforeHealth: 42, afterHealth: 55 },
  { segment: "Occasional Browsers", beforeChurn: 55, afterChurn: 42, beforeCLV: 180, afterCLV: 210, beforeHealth: 18, afterHealth: 28 },
];

export default function Dataset() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [activeDataset, setActiveDataset] = useState<'before' | 'after' | 'uploaded'>('before');

  const currentData = activeDataset === 'before' ? SYNTHETIC_BEFORE_DATA : 
                      activeDataset === 'after' ? SYNTHETIC_AFTER_DATA : 
                      uploadedData;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setUploadedData(results.data.filter((row: any) => row && Object.keys(row).length > 1));
          setActiveDataset('uploaded');
          toast({
            title: "Dataset Uploaded",
            description: `Loaded ${results.data.length} rows from ${file.name}`,
          });
        }
      },
      error: (error) => {
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDownloadTemplate = () => {
    const template = [
      { id: 1, segment: "Segment Name", predictedChurnRisk: 0.25, actualChurn: 0.22, clv: 500, healthScore: 50, purchaseFreq: 2.0, avgOrderValue: 200, daysInactive: 30 },
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dataset_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Template Downloaded", description: "Use this template to format your data." });
  };

  const handleExportData = (dataset: 'before' | 'after') => {
    const data = dataset === 'before' ? SYNTHETIC_BEFORE_DATA : SYNTHETIC_AFTER_DATA;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `synthetic_${dataset}_strategy_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Complete", description: `${dataset === 'before' ? 'Before' : 'After'} strategy data exported.` });
  };

  const scatterData = currentData.map((d: any) => ({
    x: d.predictedChurnRisk * 100,
    y: d.actualChurn ? d.actualChurn * 100 : d.predictedChurnRisk * 100,
    segment: d.segment,
    clv: d.clv,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-7 h-7 text-primary" />
              Dataset Explorer
            </h2>
            <p className="text-muted-foreground">
              Upload, view, and analyze synthetic customer data with predicted churn risk
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2" data-testid="button-download-template">
              <Download className="w-4 h-4" />
              Template
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2" data-testid="button-upload-dataset">
              <Upload className="w-4 h-4" />
              Upload CSV
            </Button>
          </div>
        </div>

        <Alert className="border-blue-500/50 bg-blue-500/5">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Dataset Explorer</strong> shows the raw customer data powering our analysis. Each row is a customer with their segment, predicted churn risk (our AI's estimate), actual churn (what really happened), CLV (total value), and engagement metrics. Compare "Before" and "After" datasets to see individual customer improvement, or upload your own CSV data for analysis.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-500/50 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Before Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">38% Churn</div>
              <p className="text-xs text-muted-foreground">Core segment at risk</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                After Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15% Churn</div>
              <p className="text-xs text-muted-foreground">Risk reduced by 23%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">Prediction accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.length}</div>
              <p className="text-xs text-muted-foreground">In current dataset</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visualization" className="space-y-6">
          <TabsList>
            <TabsTrigger value="visualization">Visualizations</TabsTrigger>
            <TabsTrigger value="comparison">Before vs After</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
            <TabsTrigger value="model">Model Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="space-y-6">
            <div className="flex gap-2 mb-4">
              <Button 
                variant={activeDataset === 'before' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveDataset('before')}
              >
                Before Strategy
              </Button>
              <Button 
                variant={activeDataset === 'after' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveDataset('after')}
              >
                After Strategy
              </Button>
              {uploadedData.length > 0 && (
                <Button 
                  variant={activeDataset === 'uploaded' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveDataset('uploaded')}
                >
                  Uploaded Data
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predicted vs Actual Churn</CardTitle>
                  <CardDescription>Model prediction accuracy scatter plot</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" dataKey="x" name="Predicted" unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis type="number" dataKey="y" name="Actual" unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`]}
                      />
                      <Legend />
                      <Scatter name="Customers" data={scatterData} fill="hsl(var(--primary))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CLV Distribution by Segment</CardTitle>
                  <CardDescription>Customer lifetime value across segments</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="segment" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} angle={-20} textAnchor="end" />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} formatter={(value: number) => [`$${value}`, 'CLV']} />
                      <Bar dataKey="clv" name="CLV" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Score vs Churn Risk</CardTitle>
                  <CardDescription>Correlation between customer health and churn probability</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" dataKey="healthScore" name="Health Score" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                      <YAxis type="number" dataKey="predictedChurnRisk" name="Churn Risk" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 1]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                        formatter={(value: number, name: string) => [name === 'predictedChurnRisk' ? `${(value * 100).toFixed(1)}%` : value, name === 'predictedChurnRisk' ? 'Churn Risk' : 'Health Score']}
                      />
                      <Scatter name="Customers" data={currentData} fill="#ef4444" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Days Inactive Distribution</CardTitle>
                  <CardDescription>Customer activity patterns</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="id" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                      <Bar dataKey="daysInactive" name="Days Inactive" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segment Performance: Before vs After</CardTitle>
                <CardDescription>Comprehensive comparison of all key metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={SEGMENT_COMPARISON} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="segment" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="beforeChurn" name="Churn Before %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="afterChurn" name="Churn After %" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="beforeHealth" name="Health Before" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="afterHealth" name="Health After" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CLV Improvement</CardTitle>
                  <CardDescription>Customer lifetime value before and after</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SEGMENT_COMPARISON} layout="vertical" margin={{ left: 100, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
                      <YAxis dataKey="segment" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={95} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} formatter={(value: number) => [`$${value}`, '']} />
                      <Legend />
                      <Bar dataKey="beforeCLV" name="Before" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={15} />
                      <Bar dataKey="afterCLV" name="After" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Score Improvement</CardTitle>
                  <CardDescription>Customer health metrics before and after</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SEGMENT_COMPARISON} layout="vertical" margin={{ left: 100, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                      <YAxis dataKey="segment" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={95} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                      <Legend />
                      <Bar dataKey="beforeHealth" name="Before" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={15} />
                      <Bar dataKey="afterHealth" name="After" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => handleExportData('before')} className="gap-2">
                <Download className="w-4 h-4" />
                Export Before Data
              </Button>
              <Button variant="outline" onClick={() => handleExportData('after')} className="gap-2">
                <Download className="w-4 h-4" />
                Export After Data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Raw Dataset</CardTitle>
                    <CardDescription>
                      {activeDataset === 'before' ? 'Before strategy implementation' : 
                       activeDataset === 'after' ? 'After 6 months of strategy' : 
                       'Uploaded dataset'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={activeDataset === 'before' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveDataset('before')}
                    >
                      Before
                    </Button>
                    <Button 
                      variant={activeDataset === 'after' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveDataset('after')}
                    >
                      After
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Segment</TableHead>
                        <TableHead>Predicted Churn</TableHead>
                        <TableHead>Actual Churn</TableHead>
                        <TableHead>CLV</TableHead>
                        <TableHead>Health Score</TableHead>
                        <TableHead>Purchase Freq</TableHead>
                        <TableHead>Avg Order</TableHead>
                        <TableHead>Days Inactive</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.slice(0, 20).map((row: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{row.segment}</TableCell>
                          <TableCell className={row.predictedChurnRisk > 0.3 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {(row.predictedChurnRisk * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell className={row.actualChurn > 0.3 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {row.actualChurn ? (row.actualChurn * 100).toFixed(1) : '-'}%
                          </TableCell>
                          <TableCell>${row.clv}</TableCell>
                          <TableCell>{row.healthScore}</TableCell>
                          <TableCell>{row.purchaseFreq?.toFixed(1)}</TableCell>
                          <TableCell>${row.avgOrderValue}</TableCell>
                          <TableCell>{row.daysInactive}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {currentData.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4">Showing 20 of {currentData.length} records</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Prediction Model Performance</CardTitle>
                <CardDescription>Model accuracy improvement over 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MODEL_ACCURACY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} formatter={(value: number) => [`${value}%`, '']} />
                    <Legend />
                    <Area type="monotone" dataKey="accuracy" name="Accuracy" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} />
                    <Line type="monotone" dataKey="mape" name="Error Rate (MAPE)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Final Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">89%</div>
                  <p className="text-xs text-muted-foreground">Prediction accuracy after 6 months</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Error Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">-11%</div>
                  <p className="text-xs text-muted-foreground">MAPE reduced from 18% to 7%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Early Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">78%</div>
                  <p className="text-xs text-muted-foreground">Churners identified 30+ days early</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
