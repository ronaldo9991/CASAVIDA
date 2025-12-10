import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Share, Printer, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ManagerSummary() {
  return (
    <DashboardLayout>
       <div className="flex items-center justify-between mb-8 print:hidden">
          <div>
             <h2 className="text-3xl font-bold tracking-tight">Executive Summary</h2>
             <p className="text-muted-foreground">Automated weekly intelligence briefing for C-Suite.</p>
          </div>
          <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                  <Printer className="w-4 h-4"/> Print
              </Button>
              <Button size="sm" className="gap-2">
                  <Download className="w-4 h-4"/> Export PDF
              </Button>
          </div>
      </div>

      <div className="max-w-4xl mx-auto bg-card border border-border shadow-sm rounded-xl overflow-hidden print:shadow-none print:border-none">
          {/* Report Header */}
          <div className="bg-stone-900 text-white p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                   <FileText className="w-64 h-64" />
               </div>
               <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                       <h1 className="text-3xl font-display font-medium">Weekly Intelligence Report</h1>
                       <div className="text-right">
                           <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Period</div>
                           <div className="font-mono text-sm">Oct 15 - Oct 21, 2025</div>
                       </div>
                   </div>
                   <div className="grid grid-cols-3 gap-8 border-t border-white/20 pt-6">
                       <div>
                           <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Revenue</div>
                           <div className="text-2xl font-bold">$2.4M <span className="text-emerald-400 text-sm font-normal">+12.5%</span></div>
                       </div>
                       <div>
                           <div className="text-xs uppercase tracking-widest opacity-70 mb-1">CAC</div>
                           <div className="text-2xl font-bold">$45 <span className="text-emerald-400 text-sm font-normal">-8.2%</span></div>
                       </div>
                       <div>
                           <div className="text-xs uppercase tracking-widest opacity-70 mb-1">NPS</div>
                           <div className="text-2xl font-bold">72 <span className="text-stone-400 text-sm font-normal">--</span></div>
                       </div>
                   </div>
               </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
              {/* Executive Overview */}
              <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
                      <TrendingUp className="w-5 h-5 text-primary" /> 
                      Strategic Overview
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                      CasaVida is currently outperforming Q4 projections by <strong>15%</strong>. The launch of the "Autumn Solstice" campaign has successfully engaged the <em>Young Professionals</em> segment, driving a significant uplift in mobile conversion rates. However, supply chain latency for the "Kyoto Collection" remains a critical bottleneck.
                  </p>
              </section>

              <Separator />

              {/* Key Highlights */}
              <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Wins & Opportunities
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900">
                          <h4 className="font-semibold text-sm mb-2 text-emerald-900 dark:text-emerald-200">Creative Studio Impact</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                              AI-generated email variations increased open rates by 22% this week. The "Minimalist" tone performed best with the Luxury segment.
                          </p>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900">
                           <h4 className="font-semibold text-sm mb-2 text-emerald-900 dark:text-emerald-200">Blue Ocean Shift</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                              Competitor analysis shows West Elm is retreating from the "Sustainable Luxury" keyword space, creating a prime acquisition opportunity.
                          </p>
                      </div>
                  </div>
              </section>

              <Separator />

              {/* Risks */}
              <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      Critical Risks & Mitigation
                  </h3>
                   <div className="space-y-3">
                       <div className="flex items-start gap-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                           <p className="text-sm text-muted-foreground">
                               <strong>Inventory Alert:</strong> "Kyoto Lounge Chair" stock is critical (less than 2 weeks supply). 
                               <br/><span className="text-xs italic text-rose-500">Action: Expedite shipment #4421 from Mumbai via air freight.</span>
                           </p>
                       </div>
                       <div className="flex items-start gap-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                           <p className="text-sm text-muted-foreground">
                               <strong>Churn Risk:</strong> 124 High-Value customers showed decreased activity.
                               <br/><span className="text-xs italic text-amber-500">Action: Auto-trigger "We Miss You" personalized offer via Retention Flow.</span>
                           </p>
                       </div>
                   </div>
              </section>

              {/* Footer */}
              <div className="pt-8 mt-4 border-t border-dashed border-border flex justify-between items-center text-xs text-muted-foreground">
                  <p>Generated by LivingMarket AI Engine</p>
                  <p>Confidential • Internal Use Only</p>
              </div>
          </div>
      </div>
    </DashboardLayout>
  );
}
