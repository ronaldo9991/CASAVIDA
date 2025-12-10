import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown } from "lucide-react";

export default function Churn() {
  return (
    <DashboardLayout>
       <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Churn Risk Analysis</h2>
          <p className="text-muted-foreground">Identify and rescue at-risk customers before they leave.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-rose-500">
              <CardHeader>
                  <CardTitle className="text-rose-500">High Risk</CardTitle>
                  <CardDescription>Probability {'>'} 80%</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="text-4xl font-bold">124</div>
                  <p className="text-sm text-muted-foreground mt-2">Customers requiring immediate action.</p>
              </CardContent>
          </Card>
           <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                  <CardTitle className="text-amber-500">Medium Risk</CardTitle>
                  <CardDescription>Probability 50-80%</CardDescription>
              </CardHeader>
               <CardContent>
                  <div className="text-4xl font-bold">450</div>
                  <p className="text-sm text-muted-foreground mt-2">Monitor engagement levels.</p>
              </CardContent>
          </Card>
           <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                  <CardTitle className="text-emerald-500">Low Risk</CardTitle>
                  <CardDescription>Probability {'<'} 20%</CardDescription>
              </CardHeader>
               <CardContent>
                  <div className="text-4xl font-bold">12.5k</div>
                  <p className="text-sm text-muted-foreground mt-2">Healthy customer base.</p>
              </CardContent>
          </Card>
      </div>

      <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
              Detected a 15% drop in repeat purchase rate for the "Young Professionals" cohort in the last 30 days.
          </AlertDescription>
      </Alert>
    </DashboardLayout>
  );
}
