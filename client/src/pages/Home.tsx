import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import heroImage from "@assets/generated_images/luxury_living_room_hero_banner.png";
import artisanImage from "@assets/generated_images/indian_artisan_craftsmanship_close-up.png";
import dubaiImage from "@assets/generated_images/dubai_luxury_penthouse_interior.png";
import globalImage from "@assets/generated_images/global_modern_design_abstract.png";
import livingCol from "@assets/generated_images/luxury_living_room_collection.png";
import bedroomCol from "@assets/generated_images/luxury_bedroom_collection.png";
import lightingCol from "@assets/generated_images/designer_lighting_collection.png";
import decorCol from "@assets/generated_images/art_and_decor_collection.png";
import lifestyleBg from "@assets/generated_images/lifestyle_parallax_background.png";

const collections = [
  { name: "Living Room", image: livingCol },
  { name: "Bedroom", image: bedroomCol },
  { name: "Lighting", image: lightingCol },
  { name: "Art & Decor", image: decorCol },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury Interior"
            className="w-full h-full object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight mb-6"
          >
            CasaVida
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-2xl font-light tracking-wide mb-10 opacity-90"
          >
            Modern Living, Elevated. <br className="hidden md:block" />
            <span className="text-base md:text-xl opacity-80 mt-2 block font-body">
              "Born in India. Refined in Dubai. Curated for global homes."
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Button className="bg-white text-black hover:bg-stone-200 text-lg px-8 py-6 rounded-none font-medium tracking-wide">
              Explore CasaVida
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10 hover:text-white text-lg px-8 py-6 rounded-none font-medium tracking-wide"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. The CasaVida Story */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-stone-900">
            Redefining Home & Living for a New Generation
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light">
            CasaVida began in India with a simple promise — to bring beautiful,
            meaningful design into everyday living. With a legacy of
            craftsmanship and modern aesthetics, CasaVida has now expanded to
            Dubai to serve the premium and luxury segment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Indian Craftsmanship",
              desc: "Heritage meets detail.",
              img: artisanImage,
            },
            {
              title: "Dubai Elegance",
              desc: "Premium apartments & villas.",
              img: dubaiImage,
            },
            {
              title: "Global Inspiration",
              desc: "Modern design across the world.",
              img: globalImage,
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-display font-medium mb-2 group-hover:text-stone-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-stone-500 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Collections Showcase */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-stone-900">
              Our Collections
            </h2>
            <a
              href="#"
              className="text-sm border-b border-stone-900 pb-1 hover:opacity-50 transition-opacity hidden md:block"
            >
              View All Products
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col, idx) => (
              <div key={idx} className="group relative overflow-hidden aspect-square cursor-pointer">
                 <div className="absolute inset-0 bg-stone-200">
                    <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 </div>
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-display font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        {col.name}
                    </h3>
                 </div>
                 <div className="absolute bottom-6 left-6 text-white font-medium md:hidden">
                    {col.name}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Designed For Your Life (Parallax) */}
      <section className="relative h-[600px] overflow-hidden flex items-center">
         <div className="absolute inset-0 z-0 bg-fixed" style={{
             backgroundImage: `url(${lifestyleBg})`,
             backgroundPosition: 'center',
             backgroundSize: 'cover'
         }}>
            <div className="absolute inset-0 bg-stone-900/30" />
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="bg-white/90 backdrop-blur-sm p-12 md:p-16 max-w-xl">
                 <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">Designed For Your Life</h2>
                 <p className="text-stone-600 mb-8 leading-relaxed">
                     CasaVida blends modern design, sustainability, and comfort to create spaces that tell a story — your story.
                 </p>
                 <ul className="space-y-4">
                     {["Sustainable materials", "Designed in India, styled in Dubai", "Minimal, functional and warm aesthetics"].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-medium text-stone-800">
                             <span className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
                             {item}
                         </li>
                     ))}
                 </ul>
             </div>
         </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
         <h2 className="text-center text-sm uppercase tracking-widest text-stone-400 mb-16">What Our Clients Say</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             {[
                 { q: "CasaVida transformed our Dubai villa into a sanctuary. The blend of textures is incredible.", author: "Priya S., Dubai" },
                 { q: "Finally, a brand that understands modern Indian aesthetics without being cliché.", author: "Arjun M., Mumbai" },
                 { q: "Minimalist perfection. Every piece feels like it has a soul.", author: "Sarah L., Interior Designer" }
             ].map((t, i) => (
                 <div key={i} className="flex flex-col items-center">
                     <div className="flex gap-1 text-stone-300 mb-6">
                         {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                     </div>
                     <p className="font-display text-xl md:text-2xl text-stone-800 mb-6 italic">"{t.q}"</p>
                     <p className="text-xs uppercase tracking-wider text-stone-500">{t.author}</p>
                 </div>
             ))}
         </div>
      </section>

      {/* 8. CTA */}
      <section className="bg-stone-900 text-white py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display mb-8">Discover How CasaVida Makes Your Home Feel Alive.</h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button className="bg-white text-black hover:bg-stone-200 rounded-none h-12 px-8">Explore Products</Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white rounded-none h-12 px-8">Visit Dubai Showroom</Button>
              </div>
          </div>
      </section>
    </PublicLayout>
  );
}
