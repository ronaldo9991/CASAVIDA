import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";

const data = [
  { subject: 'Price', A: 120, B: 110, fullMark: 150 },
  { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
  { subject: 'Brand', A: 86, B: 130, fullMark: 150 },
  { subject: 'Service', A: 99, B: 100, fullMark: 150 },
  { subject: 'Innovation', A: 85, B: 90, fullMark: 150 },
  { subject: 'Range', A: 65, B: 85, fullMark: 150 },
];

export default function CompetitorIntel() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Competitive Intelligence</h2>
          <p className="text-muted-foreground">Market positioning and threat analysis.</p>
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
          </div>
      </div>
    </DashboardLayout>
  );
}
