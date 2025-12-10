import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Dubai from "@/pages/Dubai";
import India from "@/pages/India";
import Login from "@/pages/Login";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import CreativeStudio from "@/pages/dashboard/CreativeStudio";
import Segments from "@/pages/dashboard/Segments";
import CLV from "@/pages/dashboard/CLV";
import Churn from "@/pages/dashboard/Churn";
import CompetitorIntel from "@/pages/dashboard/CompetitorIntel";
import BlueOcean from "@/pages/dashboard/BlueOcean";
import Prioritization from "@/pages/dashboard/Prioritization";
import ManagerSummary from "@/pages/dashboard/ManagerSummary";
import StrategyResults from "@/pages/dashboard/StrategyResults";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/dubai" component={Dubai} />
      <Route path="/india" component={India} />
      <Route path="/login" component={Login} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" component={DashboardHome} />
      <Route path="/dashboard/creative" component={CreativeStudio} />
      <Route path="/dashboard/segments" component={Segments} />
      <Route path="/dashboard/clv" component={CLV} />
      <Route path="/dashboard/churn" component={Churn} />
      <Route path="/dashboard/ci" component={CompetitorIntel} />
      <Route path="/dashboard/blue-ocean" component={BlueOcean} />
      <Route path="/dashboard/prioritization" component={Prioritization} />
      <Route path="/dashboard/summary" component={ManagerSummary} />
      <Route path="/dashboard/results" component={StrategyResults} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="casavida-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
