import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  Legend,
  ComposedChart
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ArrowRight, Info, Target, Sparkles } from "lucide-react";
import { 
  BEFORE_CLV_DATA, 
  AFTER_CLV_DATA, 
  CLV_MONTHLY_PROGRESSION,
  CALCULATED_METRICS 
} from "@/lib/dashboardData";

const CLV_DISTRIBUTION_BEFORE = [
  { range: "$0-200", count: 2100, percentage: 29 },
  { range: "$200-500", count: 1260, percentage: 18 },
  { range: "$500-800", count: 2520, percentage: 35 },
  { range: "$800-1500", count: 420, percentage: 6 },
  { range: "$1500-2000", count: 534, percentage: 7 },
  { range: "$2000+", count: 356, percentage: 5 },
];

const CLV_DISTRIBUTION_AFTER = [
  { range: "$0-200", count: 990, percentage: 14 },
  { range: "$200-500", count: 1440, percentage: 20 },
  { range: "$500-800", count: 2160, percentage: 30 },
  { range: "$800-1500", count: 1440, percentage: 20 },
  { range: "$1500-2000", count: 720, percentage: 10 },
  { range: "$2000+", count: 470, percentage: 6 },
];

const COMPARISON_DATA = BEFORE_CLV_DATA.map((before, i) => ({
  segment: before.segment.split(' ').map(w => w[0]).join(''),
  fullName: before.segment,
  beforeClv: before.avgClv,
  afterClv: AFTER_CLV_DATA[i].avgClv,
  increase: AFTER_CLV_DATA[i].avgClv - before.avgClv,
  percentChange: Math.round(((AFTER_CLV_DATA[i].avgClv - before.avgClv) / before.avgClv) * 100),
}));

export default function CLV() {
  const totalBeforeClv = BEFORE_CLV_DATA.reduce((acc, s) => acc + s.totalClv, 0);
  const totalAfterClv = AFTER_CLV_DATA.reduce((acc, s) => acc + s.totalClv, 0);
  const totalClvGain = totalAfterClv - totalBeforeClv;
  const avgBeforeClv = Math.round(BEFORE_CLV_DATA.reduce((acc, s) => acc + s.avgClv, 0) / BEFORE_CLV_DATA.length);
  const avgAfterClv = Math.round(AFTER_CLV_DATA.reduce((acc, s) => acc + s.avgClv, 0) / AFTER_CLV_DATA.length);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Customer Lifetime Value Analysis</h2>
        <p className="text-muted-foreground">Before vs After strategy implementation - CLV metrics and trends</p>
      </div>

      <Alert className="mb-6 border-blue-500/50 bg-blue-500/5">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>What is CLV?</strong> Customer Lifetime Value (CLV) measures the total revenue a business can expect from a single customer account throughout their relationship. Higher CLV means customers are more valuable and loyal. This page shows how our 6-month recovery strategy improved CLV across all customer segments.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total CLV Gain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+${(totalClvGain / 1000).toFixed(0)}K</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>${(totalBeforeClv / 1000000).toFixed(1)}M</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-green-600">${(totalAfterClv / 1000000).toFixed(1)}M</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg CLV Increase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+${avgAfterClv - avgBeforeClv}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>${avgBeforeClv}</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-green-600">${avgAfterClv}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Before: Declining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 flex items-center gap-1">
              <TrendingDown className="w-6 h-6" />
              -12%
            </div>
            <p className="text-xs text-muted-foreground">Core segment CLV trend</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">After: Growing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 flex items-center gap-1">
              <TrendingUp className="w-6 h-6" />
              +21%
            </div>
            <p className="text-xs text-muted-foreground">Core segment CLV trend</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList>
          <TabsTrigger value="comparison">Before vs After</TabsTrigger>
          <TabsTrigger value="progression">6-Month Progression</TabsTrigger>
          <TabsTrigger value="distribution">CLV Distribution</TabsTrigger>
          <TabsTrigger value="segments">Segment Details</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Average CLV by Segment: Before vs After</CardTitle>
              <CardDescription>Direct comparison showing CLV improvement per segment after strategy implementation</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COMPARISON_DATA} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tickFormatter={v => `$${v}`} />
                  <YAxis type="category" dataKey="fullName" width={150} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value}`, '']}
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} 
                  />
                  <Legend />
                  <Bar dataKey="beforeClv" name="Before Strategy" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="afterClv" name="After Strategy" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPARISON_DATA.map((item) => (
              <Card key={item.fullName} className="border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.fullName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Before CLV</span>
                      <span className="font-semibold text-red-600">${item.beforeClv}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">After CLV</span>
                      <span className="font-semibold text-green-600">${item.afterClv}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-sm font-medium">Improvement</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">+${item.increase}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                          +{item.percentChange}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progression" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLV Progression Over 6 Months</CardTitle>
              <CardDescription>How average CLV improved month-over-month for each segment</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CLV_MONTHLY_PROGRESSION}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={v => `$${v}`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value}`, '']}
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="functionalHomemakers" name="Functional Homemakers" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="homeEnhancers" name="Home Enhancers" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="occasional" name="Occasional Browsers" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Portfolio CLV Growth</CardTitle>
              <CardDescription>Combined CLV across all segments over the recovery period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CLV_MONTHLY_PROGRESSION}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Total CLV']}
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} 
                  />
                  <Area type="monotone" dataKey="total" stroke="#22c55e" fill="url(#colorTotal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Before: CLV Distribution
                </CardTitle>
                <CardDescription>Customer distribution by CLV range (crisis period)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CLV_DISTRIBUTION_BEFORE}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Bar dataKey="count" name="Customers" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  After: CLV Distribution
                </CardTitle>
                <CardDescription>Customer distribution by CLV range (post-recovery)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CLV_DISTRIBUTION_AFTER}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Bar dataKey="count" name="Customers" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Distribution Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">-53%</div>
                  <p className="text-sm text-muted-foreground">Reduction in low-value customers ($0-200)</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+233%</div>
                  <p className="text-sm text-muted-foreground">Increase in mid-high value customers ($800-1500)</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+32%</div>
                  <p className="text-sm text-muted-foreground">Increase in premium customers ($2000+)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {BEFORE_CLV_DATA.map((before, i) => {
              const after = AFTER_CLV_DATA[i];
              return (
                <Card key={before.segment}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{before.segment}</span>
                      <span className="text-sm font-normal bg-green-100 text-green-700 px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                        +{Math.round(((after.avgClv - before.avgClv) / before.avgClv) * 100)}% CLV Growth
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">Avg CLV Before</p>
                        <p className="text-xl font-bold text-red-600">${before.avgClv}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">Avg CLV After</p>
                        <p className="text-xl font-bold text-green-600">${after.avgClv}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">Total CLV Before</p>
                        <p className="text-xl font-bold">${(before.totalClv / 1000000).toFixed(2)}M</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">Total CLV After</p>
                        <p className="text-xl font-bold text-green-600">${(after.totalClv / 1000000).toFixed(2)}M</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Customers: {before.customers.toLocaleString()} → {after.customers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Trend: {before.trend}% → <span className="text-green-600">+{after.trend}%</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
