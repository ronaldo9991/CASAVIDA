import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { month: "Jan", clv: 4000 },
  { month: "Feb", clv: 3000 },
  { month: "Mar", clv: 2000 },
  { month: "Apr", clv: 2780 },
  { month: "May", clv: 1890 },
  { month: "Jun", clv: 2390 },
  { month: "Jul", clv: 3490 },
];

export default function CLV() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Customer Lifetime Value</h2>
          <p className="text-muted-foreground">Predictive analytics for long-term value.</p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Projected CLV Growth</CardTitle>
            <CardDescription>Based on current retention metrics.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorClv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                    <Area type="monotone" dataKey="clv" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorClv)" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
