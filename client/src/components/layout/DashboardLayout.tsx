import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  Palette,
  Users,
  TrendingUp,
  UserMinus,
  Swords,
  Compass,
  ListTodo,
  FileText,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  Sparkles,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Crisis Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Segments", icon: Users, href: "/dashboard/segments" },
  { label: "CLV Analysis", icon: TrendingUp, href: "/dashboard/clv" },
  { label: "Churn Risk", icon: UserMinus, href: "/dashboard/churn" },
  { label: "Competitive Intel", icon: Swords, href: "/dashboard/ci" },
  { label: "Blue Ocean", icon: Compass, href: "/dashboard/blue-ocean" },
  { label: "Prioritization", icon: ListTodo, href: "/dashboard/prioritization" },
  { label: "6-Month Results", icon: Sparkles, href: "/dashboard/results" },
  { label: "Dataset Explorer", icon: Database, href: "/dashboard/dataset" },
  { label: "Manager Summary", icon: FileText, href: "/dashboard/summary" },
  { label: "Creative Studio", icon: Palette, href: "/dashboard/creative" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full md:hidden"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <h1 className="text-lg font-bold tracking-tight">LivingMarket</h1>
        </div>
        <div className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
              </Link>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
            <Link href="/login">
               <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 shrink-0">
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
             <div className="text-xs text-muted-foreground hidden sm:block">
              CasaVida Enterprise • Dubai HQ
             </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-xs font-bold text-primary">
              CV
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in-50 duration-500">
            {children}
          </div>
        </main>
      </div>

       {/* Overlay for mobile sidebar */}
       {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
