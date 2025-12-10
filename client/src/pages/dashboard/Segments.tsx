import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";

const dataSegments = [
  { name: "Luxury Minimalists", value: 450, color: "var(--chart-1)" },
  { name: "Young Professionals", value: 300, color: "var(--chart-2)" },
  { name: "Decor Enthusiasts", value: 200, color: "var(--chart-3)" },
  { name: "Bargain Hunters", value: 100, color: "var(--chart-4)" },
];

const dataCluster = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

export default function Segments() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Segmentation Engine</h2>
          <p className="text-muted-foreground">AI-driven customer clustering based on RFM and behavioral data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Segment Distribution</CardTitle>
                  <CardDescription>Active customer base breakdown.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataSegments}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dataSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}/>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Value Clusters (PCA)</CardTitle>
                  <CardDescription>Identifying high-value outliers.</CardDescription>
              </CardHeader>
               <CardContent className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" dataKey="x" name="Recency" unit="d" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis type="number" dataKey="y" name="Monetary" unit="$" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                        <Scatter name="Customers" data={dataCluster} fill="hsl(var(--chart-1))" />
                      </ScatterChart>
                    </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}
