import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-stone-200 selection:text-stone-900">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent text-white"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className={cn("text-2xl font-display font-semibold tracking-tight", isScrolled ? "text-stone-900" : "text-white")}>
              CasaVida
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["Collections", "Our Story", "Stores", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className={cn(
                  "text-sm font-medium hover:opacity-70 transition-opacity",
                  isScrolled ? "text-stone-900" : "text-white/90"
                )}
              >
                {item}
              </a>
            ))}
            <Link href="/login" className={cn("text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity", isScrolled ? "text-stone-900" : "text-white")}>
                Partner Sign In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-stone-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-stone-900" : "text-white"} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-stone-50 pt-24 px-6 md:hidden animate-in slide-in-from-top-10">
          <div className="flex flex-col space-y-6 text-2xl font-display text-stone-900">
             {["Collections", "Our Story", "Stores", "Contact"].map((item) => (
              <a key={item} href="#" onClick={() => setIsMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
             <Link href="/login" className="text-sm font-sans text-stone-500 pt-4" onClick={() => setIsMobileMenuOpen(false)}>
                Partner Sign In
            </Link>
          </div>
        </div>
      )}

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white text-xl font-display mb-6">CasaVida</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Born in India. Refined in Dubai. Curated for global homes.
              Redefining luxury living for a new generation.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">The Edit</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Partner Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-800 text-xs flex justify-between items-center">
          <p>&copy; 2025 CasaVida Global. All rights reserved.</p>
          <p className="opacity-50">Designed for Modern Living.</p>
        </div>
      </footer>
    </div>
  );
}
