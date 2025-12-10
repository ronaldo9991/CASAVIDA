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
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingBag } from "lucide-react";

// Mock Data
const dataCLV = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 550 },
  { name: "Apr", value: 450 },
  { name: "May", value: 600 },
  { name: "Jun", value: 700 },
];

const dataSegments = [
  { name: "High Value", value: 400, color: "var(--chart-1)" },
  { name: "Loyal", value: 300, color: "var(--chart-2)" },
  { name: "At Risk", value: 300, color: "var(--chart-3)" },
  { name: "New", value: 200, color: "var(--chart-4)" },
];

const dataRevenue = [
  { name: "Living", revenue: 4000 },
  { name: "Bedroom", revenue: 3000 },
  { name: "Lighting", revenue: 2000 },
  { name: "Decor", revenue: 2780 },
  { name: "Outdoor", revenue: 1890 },
];

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Executive Overview</h2>
          <p className="text-muted-foreground">
            LivingMarket Intelligence Engine • Real-time Data
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Revenue",
              value: "$2,405,000",
              trend: "+12.5%",
              up: true,
              icon: DollarSign,
            },
            {
              title: "Active Customers",
              value: "14,230",
              trend: "+4.1%",
              up: true,
              icon: Users,
            },
            {
              title: "Churn Rate",
              value: "2.4%",
              trend: "-0.5%",
              up: true, // actually good that it's down, but visual logic
              good: true,
              icon: Activity,
            },
            {
              title: "Avg Order Value",
              value: "$845",
              trend: "+1.2%",
              up: true,
              icon: ShoppingBag,
            },
          ].map((kpi, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {kpi.up ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-500 mr-1" />
                  )}
                  <span
                    className={
                      kpi.good || kpi.up ? "text-emerald-500" : "text-rose-500"
                    }
                  >
                    {kpi.trend}
                  </span>
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Revenue Trend - Large */}
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue & CLV Trend</CardTitle>
              <CardDescription>
                Monthly growth performance across all channels.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataCLV}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
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
                            color: "hsl(var(--popover-foreground))"
                        }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Segment Distribution - Medium */}
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>
                Distribution by value cluster.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
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
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue by Category</CardTitle>
                    <CardDescription>Top performing product lines this quarter.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataRevenue} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--popover))",
                                        borderColor: "hsl(var(--border))",
                                        color: "hsl(var(--popover-foreground))"
                                    }}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary">AI Insights</CardTitle>
                    <CardDescription>Automated daily digest.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-background/50 rounded-lg border border-border/50 backdrop-blur-sm">
                        <p className="text-sm font-medium">🚀 Growth Opportunity</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            "Bedroom" category shows 15% WoW growth in the "Young Professionals" segment. Recommended action: Launch targeted email campaign.
                        </p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg border border-border/50 backdrop-blur-sm">
                        <p className="text-sm font-medium text-rose-500">⚠️ Churn Risk</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            120 high-value customers haven't purchased in 90 days. Predicted churn probability: 65%.
                        </p>
                    </div>
                    <Button className="w-full mt-2" size="sm">Generate Full Manager Summary</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
