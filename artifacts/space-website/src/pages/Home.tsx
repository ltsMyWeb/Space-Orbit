import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, 
  ArrowRight, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Telescope,
  ChevronRight,
  ExternalLink,
  Star
} from 'lucide-react';
import { StarField } from '@/components/StarField';
import { PlanetCard } from '@/components/PlanetCard';
import { InteractiveText } from '@/components/InteractiveText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import nebulaImg from '@/assets/nebula.png';
import blackholeImg from '@/assets/blackhole.png';
import galaxyImg from '@/assets/galaxy.png';

const planets = [
  { name: 'Mercury', fact: 'The smallest and fastest planet, zipping around the Sun in just 88 days.', link: 'https://science.nasa.gov/mercury/', color: '#a8a8a8' },
  { name: 'Venus', fact: 'Spins backwards and has a thick atmosphere that traps heat, making it the hottest planet.', link: 'https://science.nasa.gov/venus/', color: '#e0c896' },
  { name: 'Earth', fact: 'Our home planet, the only place we know of so far that is inhabited by living things.', link: 'https://science.nasa.gov/earth/', color: '#4b9fe3' },
  { name: 'Mars', fact: 'A dusty, cold, desert world with a very thin atmosphere.', link: 'https://science.nasa.gov/mars/', color: '#e36b4b' },
  { name: 'Jupiter', fact: 'A massive gas giant, over twice as massive as all the other planets combined.', link: 'https://science.nasa.gov/jupiter/', color: '#d1a17d' },
  { name: 'Saturn', fact: 'Adorned with a dazzling, complex system of icy rings.', link: 'https://science.nasa.gov/saturn/', color: '#e6d5a1' },
  { name: 'Uranus', fact: 'An ice giant that rotates on its side, uniquely tilted relative to its orbit.', link: 'https://science.nasa.gov/uranus/', color: '#88dbd9' },
  { name: 'Neptune', fact: 'The most distant major planet, dark, cold, and whipped by supersonic winds.', link: 'https://science.nasa.gov/neptune/', color: '#4b6fe3' },
];

const missions = [
  { year: '1969', name: 'Apollo 11', desc: 'First humans land on the Moon, a giant leap for mankind.' },
  { year: '1977', name: 'Voyager 1 & 2', desc: 'Launched to explore the outer planets, now traversing interstellar space.' },
  { year: '1990', name: 'Hubble Telescope', desc: 'A window into the cosmos, revolutionizing our understanding of the universe.' },
  { year: '2021', name: 'James Webb Space Telescope', desc: 'The largest, most powerful space telescope ever built, looking back in time.' },
  { year: '2022+', name: 'Artemis Program', desc: 'Returning humans to the Moon and preparing for missions to Mars.' },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      <StarField />
      
      {/* Background Liquid Gradients */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-screen transition-opacity duration-1000 z-0"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(138, 43, 226, 0.4) 0%, rgba(0, 0, 0, 0) 50%),
                       radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(75, 111, 227, 0.3) 0%, rgba(0, 0, 0, 0) 40%)`
        }}
      />

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-8 text-primary"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(138, 43, 226, 0.2)' }}
            >
              <Telescope size={16} />
              <span className="text-sm font-medium tracking-wider uppercase">Welcome to the cosmos</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6">
              <span className="text-gradient">Drift</span> Into<br/>The Unknown
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
              Explore the boundless wonders of the universe. From the planets in our backyard to the most distant galaxies, your journey begins here.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg group shadow-[0_0_30px_rgba(138,43,226,0.4)] hover:shadow-[0_0_50px_rgba(138,43,226,0.6)] transition-all border border-primary/50">
                Begin Exploration
                <Rocket className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        {/* SOLAR SYSTEM SECTION */}
        <section className="py-32 px-6 md:px-12 relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our <span className="text-gradient">Solar System</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our local neighborhood in space, bound by the immense gravity of our star.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planets.map((planet, idx) => (
              <PlanetCard key={planet.name} {...planet} delay={idx * 0.1} />
            ))}
          </div>
        </section>

        {/* MISSIONS TIMELINE */}
        <section className="py-32 px-6 md:px-12 bg-black/40 border-y border-white/5 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Historic <span className="text-gradient">Missions</span></h2>
              <p className="text-muted-foreground text-lg">Humanity's greatest achievements in understanding the stars.</p>
            </motion.div>

            <div className="relative border-l border-primary/30 ml-4 md:ml-1/2 md:-translate-x-[1px] space-y-16">
              {missions.map((mission, idx) => (
                <motion.div
                  key={mission.name}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative pl-8 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right'}`}
                >
                  <div className={`absolute top-0 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(138,43,226,0.8)] -left-[9px] md:left-auto ${idx % 2 === 0 ? 'md:-left-[9px]' : 'md:-right-[9px]'}`} />
                  
                  <div className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-colors">
                    <span className="text-primary font-mono text-sm font-bold tracking-widest">{mission.year}</span>
                    <h3 className="text-2xl font-bold mt-2 mb-3 text-white">{mission.name}</h3>
                    <p className="text-muted-foreground">{mission.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DEEP SPACE VISUALS */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Deep <span className="text-gradient">Space</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Venture beyond our galaxy to the oldest and most mysterious structures in the universe.</p>
          </motion.div>

          <div className="space-y-32">
            {[
              { img: nebulaImg, title: "Stellar Nurseries", desc: "Nebulae are massive clouds of dust and gas where new stars are born, painting the cosmos in vibrant, impossible colors." },
              { img: blackholeImg, title: "Supermassive Black Holes", desc: "Regions of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it.", reverse: true },
              { img: galaxyImg, title: "Spiral Galaxies", desc: "Immense, rotating assemblies of stars, planetary systems, and interstellar matter, bound together by gravity and dark matter." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row items-center gap-12 ${item.reverse ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-1/2 relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700" />
                  <img src={item.img} alt={item.title} className="w-full h-auto rounded-3xl relative z-10 border border-white/10 shadow-2xl object-cover aspect-video" />
                </div>
                <div className={`w-full md:w-1/2 ${item.reverse ? 'md:text-right' : ''}`}>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SPACE FACTS / INTERACTIVE TEXT */}
        <section className="py-32 px-6 md:px-12 bg-primary/5 border-y border-primary/20 relative overflow-hidden">
          {/* Decorative faint grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight">The Universe is <span className="text-gradient">Strange</span></h2>
            
            <div className="text-xl md:text-3xl leading-relaxed text-muted-foreground font-light text-center">
              Did you know that space is completely <InteractiveText text="silent" tooltip="Sound needs a medium like air or water to travel through, and space is a vacuum." />? Or that a day on Venus is longer than a <InteractiveText text="year on Venus" tooltip="Venus rotates so slowly that it takes 243 Earth days to spin once, but only 225 Earth days to orbit the Sun." />? If you could put Saturn in a giant bathtub, it would <InteractiveText text="float" tooltip="Saturn is mostly made of gas and is less dense than water." />. The universe is expanding, and the edge of the observable universe is currently <InteractiveText text="46.5 billion light-years" tooltip="Because the universe is expanding, the light from the oldest objects we can see has traveled for 13.8 billion years, but those objects are now 46.5 billion light-years away." /> away.
            </div>
          </div>
        </section>

        {/* CTA / NEWSLETTER */}
        <section className="py-32 px-6 md:px-12 relative flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full max-w-lg mx-auto pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-3xl max-w-2xl w-full border border-primary/30 relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Join the Exploration</h2>
            <p className="text-muted-foreground mb-8">Sign up for our newsletter to get weekly updates on space discoveries and stunning astrophotography.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-black/50 border-primary/30 focus-visible:ring-primary h-12 text-lg rounded-xl flex-grow"
              />
              <Button size="lg" className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/80 text-white font-semibold">
                Subscribe
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-12 px-6 md:px-12 bg-black/60 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.5)]">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Cosmos<span className="text-primary font-normal">Xplorer</span></span>
            </div>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors hover:-translate-y-1 transform inline-block duration-300"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors hover:-translate-y-1 transform inline-block duration-300"><Github size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors hover:-translate-y-1 transform inline-block duration-300"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors hover:-translate-y-1 transform inline-block duration-300"><Mail size={20} /></a>
            </div>
            
            <div className="text-sm text-muted-foreground/50">
              © {new Date().getFullYear()} CosmosXplorer. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
