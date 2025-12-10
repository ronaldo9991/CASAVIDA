import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { factor: 'Price', us: 80, industry: 50 },
  { factor: 'Quality', us: 95, industry: 60 },
  { factor: 'Speed', us: 70, industry: 80 },
  { factor: 'Customization', us: 90, industry: 20 }, // Blue Ocean
  { factor: 'Sustainability', us: 85, industry: 40 }, // Blue Ocean
  { factor: 'Community', us: 88, industry: 30 }, // Blue Ocean
];

export default function BlueOcean() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Blue Ocean Strategy</h2>
          <p className="text-muted-foreground">Strategic canvas to identify uncontested market space.</p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Strategy Canvas</CardTitle>
              <CardDescription>Visualizing value innovation against the industry standard.</CardDescription>
          </CardHeader>
          <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="factor" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                      <Legend />
                      <Line type="monotone" dataKey="industry" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Industry Standard" strokeWidth={2} />
                      <Line type="monotone" dataKey="us" stroke="hsl(var(--primary))" name="CasaVida Curve" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
              </ResponsiveContainer>
          </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                  <CardTitle className="text-lg">Eliminate</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Mass production waste</li>
                      <li>Generic packaging</li>
                      <li>Aggressive discounting</li>
                  </ul>
              </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                  <CardTitle className="text-lg">Raise</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Product durability</li>
                      <li>Customer service speed</li>
                      <li>Digital experience</li>
                  </ul>
              </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/40">
              <CardHeader>
                  <CardTitle className="text-lg text-primary">Create</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="list-disc list-inside text-sm text-foreground font-medium">
                      <li>AI-driven personalization</li>
                      <li>LivingMarket Ecosystem</li>
                      <li>Artisan-to-Consumer transparency</li>
                  </ul>
              </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}
