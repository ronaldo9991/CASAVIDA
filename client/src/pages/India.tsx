import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, Heart, IndianRupee } from "lucide-react";
import indiaHero from "@assets/generated_images/modern_indian_living_room_hero.png";
import jaipurImg from "@assets/generated_images/jaipur_heritage_interior.png";
import mumbaiImg from "@assets/generated_images/mumbai_urban_luxury_interior.png";

export default function India() {
  return (
    <PublicLayout>
      <div className="bg-[#FFFBF7] min-h-screen font-sans selection:bg-amber-500 selection:text-white">
        
        {/* Breadcrumb */}
        <div className="absolute top-20 left-6 z-20 text-xs tracking-widest uppercase text-stone-500">
            CasaVida <span className="text-amber-600">/</span> India
        </div>

        {/* 1. Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={indiaHero}
              alt="Indian Modern Interior"
              className="w-full h-full object-cover brightness-[0.9]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
            <div className="text-white">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs uppercase tracking-wider mb-6 backdrop-blur-sm">
                        Namaste India
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-6 leading-tight">
                        Where Tradition Meets <span className="text-amber-400 italic">Modern Living</span>.
                    </h1>
                    <p className="text-lg md:text-xl font-light tracking-wide mb-8 opacity-90 max-w-lg">
                        Authentic Indian aesthetics, refined for the contemporary home. Accessible luxury for every family.
                    </p>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-6 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                        Explore India Collection
                    </Button>
                </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Authentic Indian Design */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4 text-stone-900">Authentic Design, Modern Comfort</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Crafted with respect for our heritage, designed for the way we live today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Handcrafted Details",
                desc: "Intricate woodwork and artisanal fabrics."
              },
              {
                icon: MapPin,
                title: "Regional Inspiration",
                desc: "Designs inspired by Jaipur, Kerala, and more."
              },
              {
                icon: IndianRupee,
                title: "Value-Driven",
                desc: "Premium quality at prices that make sense."
              },
              {
                icon: Heart,
                title: "Made to Last",
                desc: "Durable materials for bustling family homes."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                    <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-stone-800">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Collections Inspired by India */}
        <section className="py-24 bg-stone-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-12 text-stone-900">Inspired by India</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Large Card 1 */}
                <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl cursor-pointer">
                    <img src={jaipurImg} alt="Jaipur" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-3xl font-display mb-2">The Jaipur Heritage</h3>
                        <p className="opacity-90 text-sm">Pink sandstone hues & royal arches.</p>
                    </div>
                </div>

                {/* Large Card 2 */}
                <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl cursor-pointer">
                    <img src={mumbaiImg} alt="Mumbai" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-3xl font-display mb-2">Mumbai Urban</h3>
                        <p className="opacity-90 text-sm">Smart, space-saving luxury for the city.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                 {[
                     { t: "South Indian Minimal", d: "Teak wood & tropical vibes" },
                     { t: "Delhi Classic", d: "Colonial charm meets modern comfort" },
                     { t: "Bengal Crafts", d: "Artistic weaves & terracotta" }
                 ].map((c, i) => (
                     <div key={i} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-amber-200 transition-colors cursor-pointer group">
                         <div className="flex justify-between items-center mb-4">
                             <h4 className="font-display text-xl text-stone-800">{c.t}</h4>
                             <ArrowRight className="w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
                         </div>
                         <p className="text-sm text-stone-500">{c.d}</p>
                     </div>
                 ))}
            </div>
          </div>
        </section>

        {/* 4. Middle & Premium Segments */}
        <section className="py-24 max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-display font-medium mb-6 text-stone-900">For Every Home, For Every Dream</h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-10">
                CasaVida India is built on the belief that beautiful design belongs to everyone. 
                Whether you are furnishing your first apartment or redesigning your ancestral home, 
                we serve both <strong>middle-income</strong> and <strong>premium</strong> segments with tailored collections 
                that never compromise on quality.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button className="bg-stone-900 text-white rounded-full px-8 h-12">Shop Essentials</Button>
                <Button variant="outline" className="border-stone-300 text-stone-700 rounded-full px-8 h-12 hover:bg-stone-50">Shop Premium</Button>
            </div>
        </section>

      </div>
    </PublicLayout>
  );
}
