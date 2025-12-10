import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden md:flex flex-col justify-between bg-stone-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-700 via-stone-900 to-black" />
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-medium">CasaVida</h1>
        </div>
        <div className="relative z-10 max-w-md">
          <blockquote className="text-2xl font-display leading-normal mb-6">
            "The future of retail is intelligent, personalized, and seamless."
          </blockquote>
          <p className="text-stone-400 text-sm">Access the LivingMarket Intelligence Engine</p>
        </div>
        <div className="relative z-10 text-xs text-stone-600">
          &copy; 2025 CasaVida Global
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
              Partner Sign In
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              Enter your credentials to access the internal dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@casavida.com"
                className="bg-white border-stone-200 focus-visible:ring-stone-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-white border-stone-200 focus-visible:ring-stone-400"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-xs text-stone-400">
            <p>Restricted access. Authorized personnel only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
