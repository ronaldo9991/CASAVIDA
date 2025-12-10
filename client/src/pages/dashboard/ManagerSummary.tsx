import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Printer, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Users, Target, DollarSign, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { SUMMARY_METRICS, KEY_RESULTS, STRATEGY_ACTIONS, CLV_GAIN, CHURN_REDUCTION } from "@/lib/dashboardData";

interface DashboardSummary {
  segments: { total: number; totalCustomers: number; core: any; };
  kpis: { avgChurnRisk: number; totalClv: number; marketShare: number; };
  initiatives: { total: number; focus: number; pause: number; };
  alerts: { type: string; message: string; action: string }[];
}

const BEFORE_METRICS = {
  churnRisk: SUMMARY_METRICS.before.churnRisk,
  totalClv: parseFloat(SUMMARY_METRICS.before.totalClvMillions),
  marketShare: SUMMARY_METRICS.before.marketShare,
  totalCustomers: SUMMARY_METRICS.before.totalCustomers,
  coreHealthScore: SUMMARY_METRICS.before.coreHealthScore,
};

const AFTER_METRICS = {
  churnRisk: SUMMARY_METRICS.after.churnRisk,
  totalClv: parseFloat(SUMMARY_METRICS.after.totalClvMillions),
  marketShare: SUMMARY_METRICS.after.marketShare,
  totalCustomers: SUMMARY_METRICS.after.totalCustomers,
  coreHealthScore: SUMMARY_METRICS.after.coreHealthScore,
};

export default function ManagerSummary() {
  const { data: summary } = useQuery<DashboardSummary>({
    queryKey: ["/api/dashboard/summary"],
  });

  const currentChurn = summary?.kpis?.avgChurnRisk || AFTER_METRICS.churnRisk;
  const isCrisisMode = currentChurn > 25;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Executive Summary</h2>
          <p className="text-muted-foreground">CasaVida Strategy Implementation Report - 6 Month Review</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      <Alert className="mb-6 border-blue-500/50 bg-blue-500/5 print:hidden">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>Executive Summary</strong> is a print-ready report for management and stakeholders. It provides a high-level overview of the crisis situation, the strategy implemented, and the measurable results after 6 months. Use the Print button to generate a professional report document.
        </AlertDescription>
      </Alert>

      <div className="max-w-4xl mx-auto bg-card border border-border shadow-sm rounded-xl overflow-hidden print:shadow-none print:border-none">
        <div className="bg-stone-900 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <FileText className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-display font-medium">Strategy Results Report</h1>
                <p className="text-white/70 mt-1">6-Month Implementation Review</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Status</div>
                <div className="font-mono text-sm text-emerald-400">SUCCESS</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 border-t border-white/20 pt-6">
              <div>
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Churn</div>
                <div className="text-2xl font-bold">
                  {AFTER_METRICS.churnRisk}% 
                  <span className="text-emerald-400 text-sm font-normal ml-1">-23%</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Total CLV</div>
                <div className="text-2xl font-bold">
                  ${AFTER_METRICS.totalClv}M 
                  <span className="text-emerald-400 text-sm font-normal ml-1">+32%</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Market Share</div>
                <div className="text-2xl font-bold">
                  {AFTER_METRICS.marketShare}% 
                  <span className="text-emerald-400 text-sm font-normal ml-1">+5%</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Saved</div>
                <div className="text-2xl font-bold text-emerald-400">$1.05M</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
              <TrendingUp className="w-5 h-5 text-primary" />
              Executive Overview
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              CasaVida has successfully reversed its declining trajectory by implementing a <strong>core-segment-first strategy</strong>. 
              The company shifted focus from chasing the premium "Home Enhancer" segment to protecting and growing the core "Functional Homemaker" base.
              Over 6 months, this resulted in a <strong>{CHURN_REDUCTION}% reduction in core churn</strong>, <strong>${(CLV_GAIN / 1000000).toFixed(2)}M increase in total CLV</strong>, 
              and <strong>$1.05M in cost savings</strong> from paused/cancelled initiatives.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Key Performance Improvements
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Metric</th>
                    <th className="text-center py-2 font-medium">Before</th>
                    <th className="text-center py-2 font-medium"></th>
                    <th className="text-center py-2 font-medium">After</th>
                    <th className="text-right py-2 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {KEY_RESULTS.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3">{row.metric}</td>
                      <td className="text-center py-3 text-muted-foreground">{row.before}</td>
                      <td className="text-center py-3"><ArrowRight className="w-3 h-3 mx-auto text-muted-foreground" /></td>
                      <td className="text-center py-3 font-medium">{row.after}</td>
                      <td className={`text-right py-3 font-bold ${row.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
              <Target className="w-5 h-5 text-primary" />
              Strategic Actions Taken
            </h3>
            <div className="space-y-3">
              {STRATEGY_ACTIONS.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-dashed">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                      item.status === 'Paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-sm font-medium">{item.action}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-emerald-600">{item.impact}</span>
                    <span className="text-muted-foreground">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Lessons Learned
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Core Over Premium:</strong> Chasing new premium segments while neglecting core customers is a classic failure pattern. 
                  Protecting the profit engine must come first.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Data-Driven Prioritization:</strong> The initiative prioritization board helped identify high-impact, low-effort actions 
                  and pause resource-draining premium expansion.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Proactive Retention:</strong> The churn prediction model enabled early intervention, 
                  reducing reactive firefighting and improving customer relationships.
                </p>
              </div>
            </div>
          </section>

          <div className="pt-8 mt-4 border-t border-dashed border-border flex justify-between items-center text-xs text-muted-foreground">
            <p>Generated by LivingMarket AI Engine</p>
            <p>Confidential • Internal Use Only</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
