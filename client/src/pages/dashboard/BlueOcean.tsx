import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

const BEFORE_STRATEGY = [
  { factor: 'Premium Showroom', before: 8, industry: 6 },
  { factor: 'Influencer Marketing', before: 7, industry: 7 },
  { factor: 'Core Customer Loyalty', before: 3, industry: 5 },
  { factor: 'Value Bundles', before: 2, industry: 4 },
  { factor: 'Personalized Retention', before: 2, industry: 3 },
  { factor: 'Premium Products', before: 9, industry: 7 },
  { factor: 'Price Competitiveness', before: 4, industry: 8 },
  { factor: 'Customer Service', before: 5, industry: 5 },
];

const AFTER_STRATEGY = [
  { factor: 'Premium Showroom', after: 4, industry: 6, change: -4 },
  { factor: 'Influencer Marketing', after: 3, industry: 7, change: -4 },
  { factor: 'Core Customer Loyalty', after: 9, industry: 5, change: +6 },
  { factor: 'Value Bundles', after: 8, industry: 4, change: +6 },
  { factor: 'Personalized Retention', after: 7, industry: 3, change: +5 },
  { factor: 'Premium Products', after: 6, industry: 7, change: -3 },
  { factor: 'Price Competitiveness', after: 7, industry: 8, change: +3 },
  { factor: 'Customer Service', after: 8, industry: 5, change: +3 },
];

const COMBINED_DATA = BEFORE_STRATEGY.map((item, i) => ({
  factor: item.factor,
  before: item.before,
  after: AFTER_STRATEGY[i].after,
  industry: item.industry,
}));

const ERRC_GRID = [
  {
    action: "Eliminate",
    color: "bg-red-500/10 border-red-500/30",
    items: [
      "Mass premium influencer campaigns",
      "Aggressive showroom expansion",
      "Premium-only product focus",
    ]
  },
  {
    action: "Reduce",
    color: "bg-amber-500/10 border-amber-500/30",
    items: [
      "Premium product range (focus on core)",
      "High-cost acquisition channels",
      "Showroom presence in premium locations",
    ]
  },
  {
    action: "Raise",
    color: "bg-blue-500/10 border-blue-500/30",
    items: [
      "Core customer loyalty programs",
      "Price competitiveness",
      "Customer service response time",
    ]
  },
  {
    action: "Create",
    color: "bg-green-500/10 border-green-500/30",
    items: [
      "Value bundle offerings",
      "Personalized retention campaigns",
      "AI-powered churn prediction",
    ]
  },
];

export default function BlueOcean() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Blue Ocean Strategy</h2>
        <p className="text-muted-foreground">Value curve transformation: Before vs After strategy implementation</p>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList>
          <TabsTrigger value="comparison">Before vs After</TabsTrigger>
          <TabsTrigger value="errc">ERRC Grid</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Canvas Transformation</CardTitle>
              <CardDescription>How CasaVida shifted its value curve from premium-chasing to core-focused</CardDescription>
            </CardHeader>
            <CardContent className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COMBINED_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="factor" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={10} angle={-25} textAnchor="end" height={60} />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="industry" stroke="#6b7280" strokeDasharray="5 5" name="Industry Standard" strokeWidth={2} />
                  <Line type="monotone" dataKey="before" stroke="#ef4444" name="CasaVida Before" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="after" stroke="#22c55e" name="CasaVida After" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AFTER_STRATEGY.slice(0, 4).map((item, i) => (
              <Card key={i} className={item.change > 0 ? "border-green-500/50" : "border-red-500/50"}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.factor}</span>
                    {item.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    <span className="text-muted-foreground">{BEFORE_STRATEGY[i].before}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className={item.change > 0 ? "text-green-600" : "text-red-600"}>{item.after}</span>
                  </div>
                  <p className={`text-xs mt-1 ${item.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.change > 0 ? "+" : ""}{item.change} points
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Factor Change Analysis</CardTitle>
              <CardDescription>Magnitude of strategic shifts in each factor</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AFTER_STRATEGY} layout="vertical" margin={{ left: 120, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" domain={[-6, 8]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="factor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={110} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
                  <Bar dataKey="change" name="Change" radius={[0, 4, 4, 0]} barSize={20}>
                    {AFTER_STRATEGY.map((entry, index) => (
                      <rect key={`bar-${index}`} fill={entry.change >= 0 ? "#22c55e" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errc" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ERRC_GRID.map((section, i) => (
              <Card key={i} className={section.color}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.action}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Strategy Rationale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>The Problem:</strong> CasaVida was competing in a "red ocean" of premium furniture retail, 
                chasing the aspirational "Home Enhancer" segment while neglecting their core "Functional Homemaker" customers.
              </p>
              <p>
                <strong>The Shift:</strong> By eliminating costly premium-focused initiatives and creating new value 
                through loyalty programs and personalized retention, CasaVida moved to an uncontested market position.
              </p>
              <p>
                <strong>The Result:</strong> Core segment churn dropped from 38% to 15%, while total CLV grew by 35% 
                over 6 months. The company now competes on customer value rather than premium positioning.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
