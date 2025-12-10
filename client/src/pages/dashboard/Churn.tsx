import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, TrendingUp, ArrowRight, CheckCircle, Users } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ComposedChart, Area } from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { Segment } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BEFORE_CHURN = [
  { segment: "Functional Homemakers", churnRisk: 38, atRisk: 1596, size: 4200 },
  { segment: "Home Enhancers", churnRisk: 22, atRisk: 196, size: 890 },
  { segment: "Occasional Browsers", churnRisk: 55, atRisk: 1155, size: 2100 },
];

const AFTER_CHURN = [
  { segment: "Functional Homemakers", churnRisk: 15, atRisk: 728, size: 4850 },
  { segment: "Home Enhancers", churnRisk: 18, atRisk: 130, size: 720 },
  { segment: "Occasional Browsers", churnRisk: 42, atRisk: 693, size: 1650 },
];

const CHURN_PROGRESSION = [
  { month: "Before", functionalHomemakers: 38, homeEnhancers: 22, occasional: 55 },
  { month: "Month 1", functionalHomemakers: 34, homeEnhancers: 21, occasional: 52 },
  { month: "Month 2", functionalHomemakers: 28, homeEnhancers: 20, occasional: 48 },
  { month: "Month 3", functionalHomemakers: 22, homeEnhancers: 19, occasional: 45 },
  { month: "Month 4", functionalHomemakers: 18, homeEnhancers: 18, occasional: 44 },
  { month: "Month 5", functionalHomemakers: 16, homeEnhancers: 18, occasional: 43 },
  { month: "After", functionalHomemakers: 15, homeEnhancers: 18, occasional: 42 },
];

const COMPARISON_DATA = BEFORE_CHURN.map((before, i) => ({
  segment: before.segment.split(' ').map(w => w[0]).join(''),
  fullName: before.segment,
  beforeChurn: before.churnRisk,
  afterChurn: AFTER_CHURN[i].churnRisk,
  reduction: before.churnRisk - AFTER_CHURN[i].churnRisk,
  customersSaved: before.atRisk - AFTER_CHURN[i].atRisk,
}));

export default function Churn() {
  const { data: segments = [] } = useQuery<Segment[]>({
    queryKey: ["/api/segments"],
  });

  const currentData = segments.length > 0 ? segments : BEFORE_CHURN.map((s, i) => ({
    name: s.segment,
    churnRisk: s.churnRisk / 100,
    size: s.size,
    isCore: s.segment === "Functional Homemakers",
  }));

  const totalBeforeAtRisk = BEFORE_CHURN.reduce((acc, s) => acc + s.atRisk, 0);
  const totalAfterAtRisk = AFTER_CHURN.reduce((acc, s) => acc + s.atRisk, 0);
  const totalSaved = totalBeforeAtRisk - totalAfterAtRisk;

  const coreBeforeChurn = BEFORE_CHURN.find(s => s.segment === "Functional Homemakers")?.churnRisk || 0;
  const coreAfterChurn = AFTER_CHURN.find(s => s.segment === "Functional Homemakers")?.churnRisk || 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Churn Risk Analysis</h2>
        <p className="text-muted-foreground">Before vs After strategy implementation - Customer retention metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Core Churn Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">-{coreBeforeChurn - coreAfterChurn}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{coreBeforeChurn}%</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-green-600">{coreAfterChurn}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customers Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From at-risk pool</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Before: High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totalBeforeAtRisk.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Customers at churn risk</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">After: High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAfterAtRisk.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Remaining at-risk</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList>
          <TabsTrigger value="comparison">Before vs After</TabsTrigger>
          <TabsTrigger value="progression">6-Month Progression</TabsTrigger>
          <TabsTrigger value="current">Current Status</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Churn Risk by Segment: Before vs After</CardTitle>
              <CardDescription>Impact of strategy on each customer segment</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COMPARISON_DATA} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="fullName" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Bar dataKey="beforeChurn" name="Before Strategy" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="afterChurn" name="After Strategy" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPARISON_DATA.map((seg, i) => (
              <Card key={i} className={seg.fullName === "Functional Homemakers" ? "border-primary/50 bg-primary/5" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{seg.fullName}</CardTitle>
                    {seg.fullName === "Functional Homemakers" && (
                      <span className="text-[10px] uppercase font-bold bg-primary/20 text-primary px-2 py-0.5 rounded">Core</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Churn Risk</span>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-medium">{seg.beforeChurn}%</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-green-500 font-bold">{seg.afterChurn}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reduction</span>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      -{seg.reduction}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Customers Saved</span>
                    <span className="font-bold text-green-600 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {seg.customersSaved.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progression">
          <Card>
            <CardHeader>
              <CardTitle>Churn Rate Progression Over 6 Months</CardTitle>
              <CardDescription>Monthly improvement in churn risk by segment</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHURN_PROGRESSION} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="functionalHomemakers" name="Functional Homemakers" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="homeEnhancers" name="Home Enhancers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="occasional" name="Occasional Browsers" stroke="#6b7280" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          <Alert className="border-green-500/50 bg-green-500/5">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700 dark:text-green-400">Strategy Working</AlertTitle>
            <AlertDescription>
              Core segment churn has stabilized at 15%, down from 38%. Retention initiatives are showing strong results.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AFTER_CHURN.map((seg, i) => (
              <Card key={i} className={`border-l-4 ${
                seg.churnRisk < 20 ? 'border-l-green-500' : 
                seg.churnRisk < 40 ? 'border-l-amber-500' : 
                'border-l-red-500'
              }`}>
                <CardHeader>
                  <CardTitle className={
                    seg.churnRisk < 20 ? 'text-green-600' : 
                    seg.churnRisk < 40 ? 'text-amber-600' : 
                    'text-red-600'
                  }>{seg.segment}</CardTitle>
                  <CardDescription>Current churn risk: {seg.churnRisk}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{seg.atRisk.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Customers at risk out of {seg.size.toLocaleString()} total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
