import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Star, Gem, Truck, ShieldCheck } from "lucide-react";
import dubaiHero from "@assets/generated_images/dubai_luxury_penthouse_hero.png";
import bespokeImg from "@assets/generated_images/bespoke_luxury_furniture_detail.png";
import lifestyleImg from "@assets/generated_images/dubai_waterfront_lifestyle.png";
import diningImg from "@assets/generated_images/dubai_luxury_dining_room.png";
import officeImg from "@assets/generated_images/dubai_executive_office.png";

export default function Dubai() {
  return (
    <PublicLayout>
      <div className="bg-stone-950 min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-white">
        
        {/* Breadcrumb */}
        <div className="absolute top-20 left-6 z-20 text-xs tracking-widest uppercase text-white/50">
            CasaVida <span className="text-cyan-500">/</span> Dubai
        </div>

        {/* 1. Hero Section */}
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={dubaiHero}
              alt="Dubai Luxury Interior"
              className="w-full h-full object-cover brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
          </div>

          <div className="relative z-10 text-center max-w-5xl px-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-stone-400"
            >
              CasaVida Dubai
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-lg md:text-2xl font-light tracking-wide mb-10 text-stone-300"
            >
              Luxury Living, Redefined. <br />
              <span className="text-cyan-400 font-medium">Born in Design. Curated for the UAE.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black text-lg px-10 py-6 rounded-none font-medium tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                Explore Dubai Collection
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 2. Why Dubai Loves CasaVida */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">Why Dubai Loves CasaVida</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-magenta-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gem,
                title: "Curated Designer Collections",
                desc: "Handpicked pieces from the world's finest design houses, exclusive to the UAE."
              },
              {
                icon: Star,
                title: "Bespoke Customization",
                desc: "Tailor fabrics, finishes, and dimensions to fit your penthouse perfectly."
              },
              {
                icon: Truck,
                title: "Concierge Delivery",
                desc: "White-glove delivery and installation service across Dubai & Abu Dhabi within 24 hours."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                <CardContent className="p-8 text-center">
                  <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-stone-400 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Luxury Categories */}
        <section className="py-24 bg-stone-900">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-12 text-center">Luxury Collections</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {[
                    { name: "Statement Sofas", img: lifestyleImg },
                    { name: "Master Bedroom", img: dubaiHero },
                    { name: "Dining & Entertaining", img: diningImg },
                    { name: "Designer Lighting", img: lifestyleImg },
                    { name: "Outdoor Living", img: dubaiHero },
                    { name: "Executive Office", img: officeImg },
                ].map((cat, i) => (
                    <div key={i} className="group relative aspect-[4/3] overflow-hidden cursor-pointer">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h3 className="text-2xl font-display font-medium text-white group-hover:text-cyan-400 transition-colors">{cat.name}</h3>
                            <div className="h-0.5 w-0 bg-cyan-400 group-hover:w-full transition-all duration-500 mt-2" />
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* 4. Designed for Dubai Lifestyles */}
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={lifestyleImg} alt="Lifestyle" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-stone-950/80" />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Designed for <br/><span className="text-cyan-400">Dubai Lifestyles</span></h2>
                    <p className="text-lg text-stone-300 leading-relaxed mb-8">
                        From the soaring heights of Downtown penthouses to the serene waterfronts of Palm Jumeirah villas. CasaVida brings you furniture that matches the scale and ambition of your home.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-stone-200">
                            <ShieldCheck className="w-5 h-5 text-cyan-400" />
                            Premium, heat-resistant outdoor materials
                        </li>
                        <li className="flex items-center gap-3 text-stone-200">
                            <ShieldCheck className="w-5 h-5 text-cyan-400" />
                            Sustainable luxury fabrics from Italy
                        </li>
                        <li className="flex items-center gap-3 text-stone-200">
                            <ShieldCheck className="w-5 h-5 text-cyan-400" />
                            Elevated aesthetics for modern entertaining
                        </li>
                    </ul>
                    <Button variant="outline" className="mt-10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-none h-12 px-8">
                        View Lookbook
                    </Button>
                </div>
                <div className="relative">
                    <div className="aspect-[3/4] border border-white/10 p-2 bg-white/5 backdrop-blur-sm">
                        <img src={bespokeImg} alt="Detail" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>

      </div>
    </PublicLayout>
  );
}
