import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Share } from "lucide-react";

export default function ManagerSummary() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Manager Summary</h2>
          <p className="text-muted-foreground">Automated executive reporting for C-Suite.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-card border border-border shadow-sm p-8 md:p-12 rounded-lg">
          <div className="flex justify-between items-start mb-12 border-b border-border pb-8">
              <div>
                  <h1 className="text-2xl font-bold mb-2">Weekly Executive Briefing</h1>
                  <p className="text-muted-foreground text-sm">Week 42 • October 15-21, 2025</p>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Share className="w-4 h-4 mr-2"/> Share</Button>
                  <Button size="sm"><Download className="w-4 h-4 mr-2"/> Export PDF</Button>
              </div>
          </div>

          <div className="space-y-8">
              <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Key Highlights</h3>
                  <ul className="space-y-2 text-sm leading-relaxed">
                      <li>• <strong>Revenue Growth:</strong> Total revenue up 12.5% MoM driven by the new "Autumn Solstice" campaign.</li>
                      <li>• <strong>Customer Acquisition:</strong> CAC decreased by 8% due to higher organic traffic from the blog.</li>
                      <li>• <strong>Inventory:</strong> "Kyoto Lounge Chair" stock is critical (less than 2 weeks supply).</li>
                  </ul>
              </section>

              <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> Strategic Focus</h3>
                  <p className="text-sm leading-relaxed">
                      Our focus for the next sprint is doubling down on the <strong>"Luxury Minimalist"</strong> segment. Data shows they have the highest LTV potential but are currently under-penetrated in email marketing channels.
                  </p>
              </section>

              <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/> Risks & Mitigation</h3>
                   <div className="bg-muted/30 p-4 rounded-md text-sm">
                       <p className="font-semibold mb-1">Competitor Action</p>
                       <p>West Elm has launched a similar sustainable wood collection. We need to emphasize our "Handcrafted in India" story to differentiate on authenticity, not just price.</p>
                   </div>
              </section>
          </div>
      </div>
    </DashboardLayout>
  );
}
