import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, TrendingUp, Shield, Zap, Heart, Star, CheckCircle2, ArrowRight, Lightbulb } from "lucide-react";

export default function Strategy() {
  const strategies = [
    {
      phase: "Month 1-2",
      title: "Crisis Stabilization",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      initiatives: [
        {
          name: "Emergency Churn Prevention Program",
          description: "Deployed AI-powered early warning system to identify at-risk Functional Homemaker customers showing disengagement signals",
          impact: "Prevented 340 high-value customer defections",
          tactics: ["Personalized re-engagement emails", "Exclusive loyalty discounts (15-20%)", "Priority customer service queue"]
        },
        {
          name: "Price Perception Reset",
          description: "Addressed #1 churn driver by introducing transparent value communication and flexible payment options",
          impact: "Reduced price-related complaints by 52%",
          tactics: ["Quality-to-price ratio messaging", "12-month interest-free financing", "Price-match guarantee for core items"]
        },
        {
          name: "Delivery Experience Overhaul",
          description: "Partnered with premium logistics provider and implemented real-time tracking to fix delivery pain points",
          impact: "Delivery satisfaction improved from 3.2 to 4.6 stars",
          tactics: ["White-glove delivery service", "2-hour delivery windows", "Assembly included at no cost"]
        }
      ]
    },
    {
      phase: "Month 3-4",
      title: "Segment-Specific Value Creation",
      icon: Users,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      initiatives: [
        {
          name: "Functional Homemaker Loyalty Club",
          description: "Created dedicated program for our core 58% segment with practical benefits aligned to their needs",
          impact: "38% enrollment rate, 2.3x higher repeat purchase",
          tactics: ["Members-only sales (quarterly)", "Free design consultations", "Extended warranties", "Priority restock alerts"]
        },
        {
          name: "Home Enhancer Premium Experience",
          description: "Elevated service tier for high-CLV segment with exclusive access and personalized curation",
          impact: "CLV increased 28% for enrolled members",
          tactics: ["Personal style advisor assignment", "Early access to new collections", "Private showroom appointments", "Curated mood boards"]
        },
        {
          name: "Occasional Browser Conversion Funnel",
          description: "Designed nurture sequences to convert browsers into first-time buyers with lower commitment entry points",
          impact: "Conversion rate improved from 2.1% to 8.7%",
          tactics: ["Starter bundle offers", "Room-by-room shopping guides", "Social proof integration", "Abandoned cart recovery"]
        }
      ]
    },
    {
      phase: "Month 5-6",
      title: "Growth Acceleration",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      initiatives: [
        {
          name: "Referral Program Launch",
          description: "Leveraged satisfied Functional Homemakers as brand ambassadors with dual-sided incentives",
          impact: "1,240 new customers acquired at 60% lower CAC",
          tactics: ["$100 credit for referrer", "$50 off first purchase for referee", "Social sharing tools", "Referral leaderboard"]
        },
        {
          name: "Cross-Sell Intelligence Engine",
          description: "Deployed AI recommendations based on room completion logic and lifestyle patterns",
          impact: "Average order value increased 34%",
          tactics: ["Complete the room suggestions", "Seasonal refresh prompts", "Complementary accessory bundles", "Style consistency matching"]
        },
        {
          name: "Win-Back Campaign for Churned Customers",
          description: "Re-engaged lapsed customers with personalized offers addressing their specific churn reasons",
          impact: "Recovered 890 previously churned customers",
          tactics: ["Personalized apology messaging", "Exclusive return offers", "New product announcements", "Feedback incentives"]
        }
      ]
    }
  ];

  const keyMetrics = [
    { label: "Overall Churn Reduction", value: "41% → 18%", change: "-56%" },
    { label: "Customer Satisfaction (NPS)", value: "23 → 67", change: "+191%" },
    { label: "Average CLV", value: "$1,847 → $2,456", change: "+33%" },
    { label: "Repeat Purchase Rate", value: "28% → 52%", change: "+86%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Recovery Strategy</h1>
          <p className="text-muted-foreground">6-month transformation initiatives and their impact</p>
        </div>
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Strategic Recovery Framework</CardTitle>
                <CardDescription>
                  Three-phase approach executed over 6 months to reverse declining business metrics
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg bg-background border">
                  <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                  <Badge variant="secondary" className="mt-1 text-emerald-600 bg-emerald-500/10">
                    {metric.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {strategies.map((phase, phaseIndex) => (
          <Card key={phaseIndex}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${phase.bgColor}`}>
                  <phase.icon className={`w-6 h-6 ${phase.color}`} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">{phase.phase}</Badge>
                  <CardTitle>{phase.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {phase.initiatives.map((initiative, initIndex) => (
                <div key={initIndex} className="p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 ${phase.color}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-base">{initiative.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{initiative.description}</p>
                    </div>
                  </div>
                  
                  <div className="ml-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Impact: {initiative.impact}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {initiative.tactics.map((tactic, tacticIndex) => (
                        <Badge key={tacticIndex} variant="secondary" className="text-xs">
                          {tactic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Heart className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <CardTitle>Key Success Factors</CardTitle>
                <CardDescription>What made the turnaround possible</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Segment-First Approach</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every initiative was tailored to specific customer segments rather than one-size-fits-all. Functional Homemakers received practical value; Home Enhancers received premium experiences.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Data-Driven Decisions</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered analytics identified at-risk customers 30 days before churn, enabling proactive intervention. CLV predictions guided resource allocation.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Customer Voice Integration</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regular feedback loops ensured strategies addressed real pain points. Monthly surveys and NPS tracking kept initiatives aligned with customer needs.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Phased Execution</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stabilize first, then optimize, then grow. This sequencing prevented resource dilution and ensured each phase built on the success of the previous one.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
