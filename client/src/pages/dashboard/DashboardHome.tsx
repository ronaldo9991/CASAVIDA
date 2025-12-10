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
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Scatter,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingBag, Zap, Download } from "lucide-react";
import { useState } from "react";

// Synthetically generated data for "Efficiency"
const generateTrendData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    revenue: Math.floor(Math.random() * 5000) + 2000,
    clv: Math.floor(Math.random() * 1000) + 400,
    churn: Math.floor(Math.random() * 50) + 10,
  }));
};

const dataTrend = generateTrendData();

const dataSegments = [
  { name: "Luxury Minimalists", value: 450, color: "var(--chart-1)" },
  { name: "Young Professionals", value: 380, color: "var(--chart-2)" },
  { name: "Decor Enthusiasts", value: 290, color: "var(--chart-3)" },
  { name: "Bargain Hunters", value: 150, color: "var(--chart-4)" },
  { name: "Corporate Accounts", value: 90, color: "var(--chart-5)" },
];

const dataCampaigns = [
  { name: "Autumn Solstice", roas: 4.2, spend: 12000, revenue: 50400 },
  { name: "Dubai Launch", roas: 3.8, spend: 25000, revenue: 95000 },
  { name: "Sustainable Living", roas: 5.1, spend: 8000, revenue: 40800 },
  { name: "Influencer Collab", roas: 2.9, spend: 15000, revenue: 43500 },
];

export default function DashboardHome() {
  const [timeRange, setTimeRange] = useState("12m");

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Executive Command Center</h2>
            <p className="text-muted-foreground">
              LivingMarket Intelligence Engine • Real-time Data Sync
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={() => setTimeRange("30d")} className={timeRange === "30d" ? "bg-muted" : ""}>30d</Button>
             <Button variant="outline" size="sm" onClick={() => setTimeRange("90d")} className={timeRange === "90d" ? "bg-muted" : ""}>90d</Button>
             <Button variant="outline" size="sm" onClick={() => setTimeRange("12m")} className={timeRange === "12m" ? "bg-muted" : ""}>12m</Button>
             <Button size="sm" className="gap-2"><Download className="w-4 h-4"/> Export Report</Button>
          </div>
        </div>

        {/* High-Efficiency KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Revenue",
              value: "$2,405,000",
              trend: "+12.5%",
              up: true,
              icon: DollarSign,
              desc: "vs. previous period"
            },
            {
              title: "Active Customers",
              value: "14,230",
              trend: "+4.1%",
              up: true,
              icon: Users,
              desc: "1,204 new this month"
            },
            {
              title: "Churn Rate",
              value: "2.4%",
              trend: "-0.5%",
              up: true, 
              good: true,
              icon: Activity,
              desc: "Below industry avg (3.1%)"
            },
            {
              title: "Avg Order Value",
              value: "$845",
              trend: "+1.2%",
              up: true,
              icon: ShoppingBag,
              desc: "Driven by 'Living' category"
            },
          ].map((kpi, i) => (
            <Card key={i} className="hover:border-primary/50 transition-colors cursor-default">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{kpi.desc}</p>
                    <div className={`flex items-center text-xs font-medium ${kpi.good || kpi.up ? "text-emerald-500" : "text-rose-500"}`}>
                        {kpi.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {kpi.trend}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Complex Data Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Revenue Chart */}
          <Card className="col-span-1 lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                  <div>
                      <CardTitle>Revenue vs. CLV Velocity</CardTitle>
                      <CardDescription>
                        Correlation analysis of monthly revenue against customer lifetime value growth.
                      </CardDescription>
                  </div>
                  <Zap className="w-5 h-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dataTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                    />
                    <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value/1000}k`} 
                        dx={-10}
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--popover-foreground))",
                            borderRadius: "var(--radius)",
                            boxShadow: "var(--shadow-md)"
                        }}
                        itemStyle={{ padding: 0 }}
                    />
                    <Legend />
                    <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Monthly Revenue"
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                    />
                    <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="clv" 
                        name="Avg CLV"
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2} 
                        dot={{ r: 4, strokeWidth: 0, fill: "hsl(var(--chart-2))" }} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Segment Radar/Pie */}
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Segment Distribution</CardTitle>
              <CardDescription>
                Active user base composition.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {dataSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--popover-foreground))"
                        }}
                    />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Campaign Performance (ROAS)</CardTitle>
                    <CardDescription>Return on Ad Spend across active campaigns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataCampaigns} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted/30" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={100} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    fontSize={12} 
                                    stroke="hsl(var(--muted-foreground))" 
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--popover))",
                                        borderColor: "hsl(var(--border))",
                                        color: "hsl(var(--popover-foreground))"
                                    }}
                                />
                                <Bar dataKey="roas" name="ROAS" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} barSize={30}>
                                    {dataCampaigns.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.roas > 4 ? "hsl(var(--chart-2))" : "hsl(var(--chart-4))"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                    <CardDescription>Actionable intelligence engine outputs.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="p-4 rounded-lg border border-l-4 border-l-emerald-500 bg-emerald-500/5 border-border">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm">Scale "Sustainable Living"</h4>
                            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full dark:bg-emerald-900 dark:text-emerald-300">High Confidence</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            ROAS is at 5.1x. Increasing budget by 20% is projected to yield an additional $15k revenue without efficiency loss.
                        </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-l-4 border-l-amber-500 bg-amber-500/5 border-border">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm">Segment Alert: Corporate</h4>
                            <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300">Medium Risk</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Engagement dropped 12% this month. Consider sending a specialized B2B catalog update.
                        </p>
                    </div>

                     <Button className="w-full mt-auto" variant="secondary">View All Insights</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
