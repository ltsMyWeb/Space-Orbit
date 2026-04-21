import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, 
  ExternalLink,
  ChevronRight,
  Database,
  Crosshair,
  Timer
} from 'lucide-react';
import { StarField } from '@/components/StarField';
import { PlanetCard } from '@/components/PlanetCard';
import { InteractiveText } from '@/components/InteractiveText';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import nebulaImg from '@/assets/nebula.png';
import blackholeImg from '@/assets/blackhole.png';
import galaxyImg from '@/assets/galaxy.png';
import toolsBg from '@/assets/tools-bg.png';

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

const planetSizes: Record<string, { size: number, color: string }> = {
  Mercury: { size: 0.38, color: '#a8a8a8' },
  Venus: { size: 0.95, color: '#e0c896' },
  Earth: { size: 1, color: '#4b9fe3' },
  Mars: { size: 0.53, color: '#e36b4b' },
  Jupiter: { size: 11.2, color: '#d1a17d' },
  Saturn: { size: 9.4, color: '#e6d5a1' },
  Uranus: { size: 4.0, color: '#88dbd9' },
  Neptune: { size: 3.9, color: '#4b6fe3' }
};

const distances = [
  { target: 'Moon', km: '384,400', au: '0.00257', light: '1.28 light-seconds' },
  { target: 'Sun', km: '149,600,000', au: '1', light: '8.32 light-minutes' },
  { target: 'Mars (Avg)', km: '225,000,000', au: '1.5', light: '12.5 light-minutes' },
  { target: 'Jupiter', km: '778,500,000', au: '5.2', light: '43 light-minutes' },
  { target: 'Saturn', km: '1,432,000,000', au: '9.57', light: '1.33 light-hours' },
  { target: 'Neptune', km: '4,495,000,000', au: '30', light: '4.17 light-hours' },
  { target: 'Proxima Centauri', km: '40,208,000,000,000', au: '268,770', light: '4.24 light-years' },
  { target: 'Andromeda Galaxy', km: '23,990,000,000,000,000,000', au: '160,000,000,000', light: '2,537,000 light-years' }
];

function AnimatedCounter({ value, label }: { value: string, label: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center p-6 border-r border-white/10 last:border-r-0"
    >
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-2">{value}</div>
      <div className="text-sm font-medium tracking-widest text-primary uppercase">{label}</div>
    </motion.div>
  );
}

function CountdownTimer({ net }: { net: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(net).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [net]);

  return (
    <div className="flex gap-4 justify-center items-center mt-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center bg-black/50 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
            <span className="text-2xl font-bold font-mono">{value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-xs uppercase text-muted-foreground mt-2 tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const starBgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Tool 1 state
  const [planet1, setPlanet1] = useState('Earth');
  const [planet2, setPlanet2] = useState('Jupiter');
  
  // Tool 2 state
  const [distanceTarget, setDistanceTarget] = useState(distances[0]);
  const [distUnit, setDistUnit] = useState<'km' | 'au' | 'light'>('km');
  
  // Tool 3 state
  const [launches, setLaunches] = useState<any[]>([]);
  const [launchesLoading, setLaunchesLoading] = useState(true);

  // Active tool tab
  const [activeTool, setActiveTool] = useState<'size' | 'distance' | 'launch'>('size');

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

  useEffect(() => {
    fetch("https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=3&format=json")
      .then(res => res.json())
      .then(data => {
        if (data.results) setLaunches(data.results);
        setLaunchesLoading(false);
      })
      .catch(() => setLaunchesLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      <motion.div style={{ y: starBgY }} className="fixed inset-0 z-0">
        <StarField />
      </motion.div>
      
      {/* Background Liquid Gradients */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 mix-blend-screen transition-opacity duration-1000 z-0"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(138, 43, 226, 0.4) 0%, rgba(0, 0, 0, 0) 50%),
                       radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(0, 240, 255, 0.3) 0%, rgba(0, 0, 0, 0) 40%),
                       radial-gradient(circle at 50% 50%, rgba(75, 111, 227, 0.1) 0%, rgba(0, 0, 0, 0) 60%)`
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 flex items-center justify-between">
        <div className="font-black text-2xl tracking-[0.2em] uppercase text-white flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(138,43,226,1)]" />
          ORBITAL
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#system" className="nav-link">Solar System</a>
          <a href="#tools" className="nav-link">Tools</a>
          <a href="#missions" className="nav-link">Missions</a>
          <a href="#deepspace" className="nav-link">Deep Space</a>
        </div>
      </nav>

      <div className="relative z-10 pt-20">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="text-center max-w-5xl mx-auto flex flex-col items-center z-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8 text-cyan-400"
            >
              <Crosshair size={16} />
              <span className="text-sm font-bold tracking-[0.2em] uppercase">Telemetry Active</span>
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 uppercase flex flex-col leading-[0.85]">
              <motion.span 
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
                className="font-thin text-white/90"
              >
                Beyond
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}
                className="text-gradient"
              >
                The Horizon
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed"
            >
              A high-fidelity exploration interface for the cosmos. Calibrate your instruments and prepare for launch.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}
            >
              <Button size="lg" className="bg-white hover:bg-white/90 text-black rounded-full px-10 py-8 text-lg font-bold group shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all">
                INITIATE SEQUENCE
                <Rocket className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-[2px] h-24 bg-gradient-to-b from-cyan-400 to-transparent" />
          </motion.div>
        </section>

        {/* STATS STRIP */}
        <div className="border-y border-white/10 bg-black/40 backdrop-blur-xl relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            <AnimatedCounter value="8" label="Planets" />
            <AnimatedCounter value="4.5B" label="Years Old" />
            <AnimatedCounter value="93M" label="Miles to Sun" />
            <AnimatedCounter value="2T" label="Galaxies" />
          </div>
        </div>

        <div className="glow-divider" />

        {/* SOLAR SYSTEM SECTION */}
        <section id="system" className="py-32 px-6 md:px-12 relative max-w-[1400px] mx-auto z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center relative z-10"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Stellar <span className="text-gradient font-thin">System</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">Our local neighborhood, bound by the immense gravity of our star.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {planets.map((planet, idx) => (
              <PlanetCard key={planet.name} {...planet} delay={idx * 0.1} />
            ))}
          </div>
        </section>

        <div className="glow-divider" />

        {/* INTERACTIVE TOOLS */}
        <section id="tools" className="py-32 px-6 relative z-20 overflow-hidden">
          {/* AI Generated Background for Tools Section */}
          <div className="absolute inset-0 z-0">
            <img src={toolsBg} alt="" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Orbital <span className="text-gradient font-thin">Tools</span></h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">Interactive instruments for cosmic calculation and observation.</p>
            </motion.div>

            <div className="w-full">
              <div className="w-full max-w-2xl mx-auto grid grid-cols-3 bg-black/50 border border-white/10 rounded-full p-2 h-16 mb-12">
                <button onClick={() => setActiveTool('size')} className={`rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all ${activeTool === 'size' ? 'bg-primary text-white shadow-[0_0_20px_rgba(138,43,226,0.5)]' : 'text-muted-foreground hover:text-white'}`}>Size</button>
                <button onClick={() => setActiveTool('distance')} className={`rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all ${activeTool === 'distance' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.5)]' : 'text-muted-foreground hover:text-white'}`}>Distance</button>
                <button onClick={() => setActiveTool('launch')} className={`rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all ${activeTool === 'launch' ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'text-muted-foreground hover:text-white'}`}>Launches</button>
              </div>

              {/* Tool 1: Size Comparator */}
              {activeTool === 'size' && <div>
                <div className="animated-border rounded-3xl p-8 md:p-12">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="w-full md:w-1/3 space-y-6">
                      <h3 className="text-3xl font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-3"><Database className="text-primary"/> Comparator</h3>
                      <p className="text-muted-foreground mb-8">Select two celestial bodies to compare their true relative scale.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Object 1</label>
                          <Select value={planet1} onValueChange={setPlanet1}>
                            <SelectTrigger className="w-full h-14 bg-black/50 border-primary/30 text-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(planetSizes).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Object 2</label>
                          <Select value={planet2} onValueChange={setPlanet2}>
                            <SelectTrigger className="w-full h-14 bg-black/50 border-primary/30 text-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(planetSizes).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 h-[400px] bg-black/30 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(10,1fr)] opacity-10">
                        {Array.from({length: 100}).map((_, i) => <div key={i} className="border-[0.5px] border-white" />)}
                      </div>
                      
                      <div className="flex items-center justify-center gap-8 relative z-10 w-full px-12">
                        <motion.div 
                          layout
                          className="flex flex-col items-center gap-4"
                          style={{ flex: planetSizes[planet1].size / (planetSizes[planet1].size + planetSizes[planet2].size) }}
                        >
                          <motion.div 
                            layout
                            className="rounded-full"
                            style={{ 
                              width: `${Math.min(250, planetSizes[planet1].size * 40)}px`, 
                              height: `${Math.min(250, planetSizes[planet1].size * 40)}px`,
                              background: planetSizes[planet1].color,
                              boxShadow: `0 0 30px ${planetSizes[planet1].color}80`
                            }}
                          />
                          <span className="text-xl font-bold uppercase tracking-widest">{planet1}</span>
                        </motion.div>

                        <div className="text-muted-foreground font-light text-sm italic whitespace-nowrap">
                          {planet1} is {(planetSizes[planet1].size / planetSizes[planet2].size).toFixed(2)}x {planet2}
                        </div>

                        <motion.div 
                          layout
                          className="flex flex-col items-center gap-4"
                          style={{ flex: planetSizes[planet2].size / (planetSizes[planet1].size + planetSizes[planet2].size) }}
                        >
                          <motion.div 
                            layout
                            className="rounded-full"
                            style={{ 
                              width: `${Math.min(250, planetSizes[planet2].size * 40)}px`, 
                              height: `${Math.min(250, planetSizes[planet2].size * 40)}px`,
                              background: planetSizes[planet2].color,
                              boxShadow: `0 0 30px ${planetSizes[planet2].color}80`
                            }}
                          />
                          <span className="text-xl font-bold uppercase tracking-widest">{planet2}</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}

              {/* Tool 2: Distance Calculator */}
              {activeTool === 'distance' && <div>
                <div className="animated-border rounded-3xl p-8 md:p-12" style={{ '--color-primary': 'var(--color-cyan-500)', '--color-secondary': 'var(--color-blue-500)' } as any}>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                     <div className="w-full md:w-1/3 space-y-6">
                      <h3 className="text-3xl font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-3"><ChevronRight className="text-cyan-400"/> Distance</h3>
                      <p className="text-muted-foreground mb-8">Calculate the vast emptiness between Earth and other destinations.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Destination from Earth</label>
                          <Select 
                            value={distanceTarget.target} 
                            onValueChange={(val) => setDistanceTarget(distances.find(d => d.target === val)!)}
                          >
                            <SelectTrigger className="w-full h-14 bg-black/50 border-cyan-500/30 text-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {distances.map(d => <SelectItem key={d.target} value={d.target}>{d.target}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2 p-1 bg-black/50 rounded-xl border border-white/10">
                          {['km', 'au', 'light'].map(u => (
                            <button
                              key={u}
                              onClick={() => setDistUnit(u as any)}
                              className={`flex-1 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-colors ${distUnit === u ? 'bg-cyan-500 text-black' : 'text-muted-foreground hover:bg-white/5'}`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 h-[400px] bg-black/30 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-8">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none" />
                      
                      <div className="w-full flex items-center justify-between relative mb-12">
                        <div className="w-16 h-16 rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] relative z-10 flex items-center justify-center font-bold text-xs uppercase">Earth</div>
                        
                        {/* Animated Beam */}
                        <div className="flex-1 h-[2px] bg-white/10 relative mx-4">
                          <motion.div 
                            key={distanceTarget.target}
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 h-full bg-cyan-400 shadow-[0_0_15px_#00f0ff]"
                          />
                        </div>

                        <div className="w-16 h-16 rounded-full bg-cyan-500 shadow-[0_0_30px_rgba(0,240,255,0.8)] relative z-10 flex items-center justify-center font-bold text-xs uppercase overflow-hidden text-center leading-tight p-1">{distanceTarget.target.split(' ')[0]}</div>
                      </div>

                      <div className="text-center mt-8">
                        <motion.div 
                          key={distanceTarget.target + distUnit}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-2"
                        >
                          {distanceTarget[distUnit]}
                        </motion.div>
                        <div className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-bold">
                          {distUnit === 'km' ? 'Kilometers' : distUnit === 'au' ? 'Astronomical Units' : 'Light Travel Time'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}

              {/* Tool 3: Launch Countdown */}
              {activeTool === 'launch' && <div>
                <div className="animated-border rounded-3xl p-8 md:p-12" style={{ '--color-primary': 'var(--color-purple-500)', '--color-secondary': 'var(--color-pink-500)' } as any}>
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-black uppercase tracking-widest text-purple-400 mb-4 flex items-center justify-center gap-3"><Timer className="text-purple-400"/> Live Telemetry</h3>
                    <p className="text-muted-foreground">Upcoming orbital launches from around the world.</p>
                  </div>

                  {launchesLoading ? (
                    <div className="h-[300px] flex items-center justify-center text-purple-400 animate-pulse font-mono text-xl">Establishing Uplink...</div>
                  ) : launches.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {launches.map((launch) => (
                        <div key={launch.id} className="bg-black/40 border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-4">{launch.launch_service_provider?.name || 'Unknown Provider'}</div>
                          <h4 className="text-xl font-bold mb-2 h-14 line-clamp-2">{launch.name}</h4>
                          <div className="text-sm text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded mb-4 inline-block">{launch.rocket?.configuration?.name || 'Rocket'}</div>
                          
                          <CountdownTimer net={launch.net} />
                          
                          <div className="mt-8 text-xs text-muted-foreground/50 uppercase tracking-wider h-8 line-clamp-2">
                            {launch.pad?.location?.name || 'Launch site unknown'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground font-mono">
                      Launch data temporarily unavailable. Check back soon.
                    </div>
                  )}
                </div>
              </div>}
            </div>
          </div>
        </section>

        <div className="glow-divider" />

        {/* MISSIONS TIMELINE */}
        <section id="missions" className="py-32 px-6 md:px-12 bg-black/40 relative z-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-24 text-center"
            >
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase">Historic <span className="text-gradient font-thin">Missions</span></h2>
              <p className="text-muted-foreground text-xl font-light">Humanity's greatest achievements in understanding the stars.</p>
            </motion.div>

            <div className="relative border-l-2 border-primary/30 ml-4 md:ml-1/2 md:-translate-x-[1px] space-y-24">
              {missions.map((mission, idx) => (
                <motion.div
                  key={mission.name}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`relative pl-10 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:ml-auto md:pl-16' : 'md:pr-16 md:text-right'}`}
                >
                  <div className={`absolute top-0 w-6 h-6 rounded-full border-4 border-black bg-primary shadow-[0_0_20px_rgba(138,43,226,1)] -left-[13px] md:left-auto ${idx % 2 === 0 ? 'md:-left-[13px]' : 'md:-right-[13px]'}`} />
                  
                  <div className="glass-card p-8 rounded-3xl hover:border-primary/50 transition-colors group">
                    <span className="text-primary font-mono text-lg font-bold tracking-[0.3em] group-hover:text-white transition-colors">{mission.year}</span>
                    <h3 className="text-3xl font-bold mt-3 mb-4 text-white uppercase tracking-wider">{mission.name}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-light">{mission.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-divider" />

        {/* DEEP SPACE VISUALS */}
        <section id="deepspace" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto z-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Deep <span className="text-gradient font-thin">Space</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">Venture beyond our galaxy to the oldest and most mysterious structures in the universe.</p>
          </motion.div>

          <div className="space-y-40">
            {[
              { img: nebulaImg, title: "Stellar Nurseries", desc: "Nebulae are massive clouds of dust and gas where new stars are born, painting the cosmos in vibrant, impossible colors." },
              { img: blackholeImg, title: "Singularity", desc: "Regions of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it.", reverse: true },
              { img: galaxyImg, title: "Spiral Galaxies", desc: "Immense, rotating assemblies of stars, planetary systems, and interstellar matter, bound together by gravity and dark matter." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`flex flex-col md:flex-row items-center gap-16 ${item.reverse ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-1/2 relative group">
                  <div className="absolute -inset-6 bg-gradient-to-r from-primary to-cyan-500 blur-2xl rounded-full opacity-20 group-hover:opacity-40 transition duration-1000" />
                  <img src={item.img} alt={item.title} className="w-full h-auto rounded-3xl relative z-10 border border-white/10 shadow-2xl object-cover aspect-[4/3] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className={`w-full md:w-1/2 ${item.reverse ? 'md:text-right' : ''}`}>
                  <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SPACE FACTS */}
        <section className="py-40 px-6 md:px-12 bg-primary/5 border-y border-primary/20 relative overflow-hidden z-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tight uppercase">Anomaly <span className="text-gradient font-thin">Detected</span></h2>
            
            <div className="text-2xl md:text-4xl leading-relaxed text-muted-foreground font-light text-center">
              Did you know that space is completely <InteractiveText text="silent" tooltip="Sound needs a medium like air or water to travel through, and space is a vacuum." />? Or that a day on Venus is longer than a <InteractiveText text="year on Venus" tooltip="Venus rotates so slowly that it takes 243 Earth days to spin once, but only 225 Earth days to orbit the Sun." />? If you could put Saturn in a giant bathtub, it would <InteractiveText text="float" tooltip="Saturn is mostly made of gas and is less dense than water." />. The universe is expanding, and the edge of the observable universe is currently <InteractiveText text="46.5 billion light-years" tooltip="Because the universe is expanding, the light from the oldest objects we can see has traveled for 13.8 billion years, but those objects are now 46.5 billion light-years away." /> away.
            </div>
          </div>
        </section>

        {/* MINIMAL FOOTER */}
        <footer className="py-16 px-6 md:px-12 bg-black relative z-20">
          <div className="max-w-7xl mx-auto flex justify-center items-center">
            <div className="font-black text-3xl tracking-[0.4em] uppercase text-white/50 flex items-center gap-4 hover:text-white transition-colors duration-500 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-white/50" />
              ORBITAL
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
