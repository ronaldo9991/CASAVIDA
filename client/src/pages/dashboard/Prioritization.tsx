import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
    { name: "AI Visualizer Integration", score: 92, impact: "High", effort: "Medium", status: "In Progress" },
    { name: "Loyalty Program Revamp", score: 88, impact: "High", effort: "Low", status: "Proposed" },
    { name: "AR Showroom App", score: 75, impact: "Medium", effort: "High", status: "Backlog" },
    { name: "Supplier Portal V2", score: 60, impact: "Low", effort: "Medium", status: "Paused" },
];

export default function Prioritization() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Prioritization Engine</h2>
          <p className="text-muted-foreground">RICE Scoring (Reach, Impact, Confidence, Effort) for roadmap planning.</p>
      </div>

      <div className="grid gap-4">
          {projects.map((p, i) => (
              <Card key={i} className="flex flex-col md:flex-row items-center justify-between p-6">
                  <div className="space-y-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <Badge variant={p.status === "In Progress" ? "default" : "outline"}>{p.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Impact: {p.impact} • Effort: {p.effort}</p>
                  </div>
                  <div className="flex items-center gap-6">
                      <div className="text-center">
                          <span className="block text-2xl font-bold text-primary">{p.score}</span>
                          <span className="text-xs text-muted-foreground uppercase">ICE Score</span>
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </DashboardLayout>
  );
}
