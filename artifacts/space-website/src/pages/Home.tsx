import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { 
  Rocket, 
  Crosshair,
  Timer,
  Satellite,
  CircleDollarSign,
  Orbit,
  Radio,
  ShieldCheck,
  Waves,
  Globe2,
  Sparkles
} from 'lucide-react';
import { StarField } from '@/components/StarField';
import { PlanetCard } from '@/components/PlanetCard';
import { InteractiveText } from '@/components/InteractiveText';
import { Button } from '@/components/ui/button';

import nebulaImg from '@/assets/nebula.png';
import blackholeImg from '@/assets/blackhole.png';
import galaxyImg from '@/assets/galaxy.png';
import toolsBg from '@/assets/tools-bg.png';

const planets = [
  { name: 'Mercury', fact: 'The smallest and fastest planet, zipping around the Sun in just 88 days.', link: 'https://science.nasa.gov/mercury/', color: '#a8a8a8' },
  { name: 'Venus', fact: 'Spins backwards and has a thick atmosphere that traps heat, making it the hottest planet.', link: 'https://science.nasa.gov/venus/', color: '#e0c896' },
  { name: 'Earth', fact: 'Our home planet, the only place we know of so far that is inhabited by living things.', link: 'https://science.nasa.gov/earth/', color: '#7d95b8' },
  { name: 'Mars', fact: 'A dusty, cold, desert world with a very thin atmosphere.', link: 'https://science.nasa.gov/mars/', color: '#e36b4b' },
  { name: 'Jupiter', fact: 'A massive gas giant, over twice as massive as all the other planets combined.', link: 'https://science.nasa.gov/jupiter/', color: '#d1a17d' },
  { name: 'Saturn', fact: 'Adorned with a dazzling, complex system of icy rings.', link: 'https://science.nasa.gov/saturn/', color: '#e6d5a1' },
  { name: 'Uranus', fact: 'An ice giant that rotates on its side, uniquely tilted relative to its orbit.', link: 'https://science.nasa.gov/uranus/', color: '#88dbd9' },
  { name: 'Neptune', fact: 'The most distant major planet, dark, cold, and whipped by supersonic winds.', link: 'https://science.nasa.gov/neptune/', color: '#6f7fa7' },
];

const missions = [
  { year: '1969', name: 'Apollo 11', desc: 'First humans land on the Moon, a giant leap for mankind.' },
  { year: '1977', name: 'Voyager 1 & 2', desc: 'Launched to explore the outer planets, now traversing interstellar space.' },
  { year: '1990', name: 'Hubble Telescope', desc: 'A window into the cosmos, revolutionizing our understanding of the universe.' },
  { year: '2021', name: 'James Webb Space Telescope', desc: 'The largest, most powerful space telescope ever built, looking back in time.' },
  { year: '2022+', name: 'Artemis Program', desc: 'Returning humans to the Moon and preparing for missions to Mars.' },
];

const GM = 398600.4418;
const R_EARTH = 6371;

function calcOrbit(altKm: number) {
  const r = R_EARTH + altKm;
  const speedKms = Math.sqrt(GM / r);
  const periodSec = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / GM);
  const periodMin = periodSec / 60;
  const orbitsPerDay = (24 * 60) / periodMin;
  const horizonAngleDeg = Math.acos(R_EARTH / r) * (180 / Math.PI);
  const coveragePct = ((1 - Math.cos(horizonAngleDeg * Math.PI / 180)) / 2) * 100;
  return {
    speedKms: speedKms.toFixed(2),
    periodMin: periodMin.toFixed(1),
    orbitsPerDay: orbitsPerDay.toFixed(2),
    coveragePct: coveragePct.toFixed(1),
    altKm,
    r
  };
}

const orbitPresets = [
  { label: 'Starlink', alt: 550, color: '#d8aa67' },
  { label: 'ISS', alt: 408, color: '#c7ced8' },
  { label: 'GPS', alt: 20200, color: '#9a7c56' },
  { label: 'GEO', alt: 35786, color: '#b77f56' },
];

const satelliteStructures = [
  { id: 'cube1u', name: 'CubeSat 1U', mass: 1.33, cost: 50000, power: 2, desc: 'Ultra-compact 10x10x10cm research platform' },
  { id: 'cube6u', name: 'CubeSat 6U', mass: 12, cost: 250000, power: 20, desc: 'Mid-range 10x20x30cm mission platform' },
  { id: 'small', name: 'SmallSat 150kg', mass: 150, cost: 3500000, power: 150, desc: 'Capable Earth observation or comms platform' },
  { id: 'medium', name: 'MedSat 600kg', mass: 600, cost: 18000000, power: 600, desc: 'Full-featured multi-mission satellite' },
];

const satellitePower = [
  { id: 'basic_solar', name: 'Body-Mounted Solar', mass: 1, cost: 30000, power: 10 },
  { id: 'deployed_solar', name: 'Deployed Solar Arrays', mass: 5, cost: 180000, power: 80 },
  { id: 'advanced_solar', name: 'High-Efficiency GaAs', mass: 8, cost: 600000, power: 250 },
  { id: 'rtg', name: 'Nuclear RTG', mass: 14, cost: 8000000, power: 400 },
];

const satelliteComms = [
  { id: 'uhf', name: 'UHF/VHF Radio', mass: 0.3, cost: 15000, bandwidth: '9.6 kbps' },
  { id: 'sband', name: 'S-Band Transponder', mass: 1.5, cost: 120000, bandwidth: '1 Mbps' },
  { id: 'xband', name: 'X-Band System', mass: 3, cost: 400000, bandwidth: '150 Mbps' },
  { id: 'kaband', name: 'Ka-Band High Throughput', mass: 6, cost: 1800000, bandwidth: '2 Gbps' },
];

const satelliteMission = [
  { id: 'eo', name: 'Earth Observation', mass: 25, cost: 800000, desc: 'Multispectral imaging camera' },
  { id: 'comms', name: 'Communications Relay', mass: 40, cost: 2200000, desc: 'Broadband relay payload' },
  { id: 'sar', name: 'SAR Radar', mass: 80, cost: 6000000, desc: 'Synthetic aperture radar' },
  { id: 'science', name: 'Space Science', mass: 35, cost: 4500000, desc: 'Particle / magnetometer suite' },
];

const launchVehicles = [
  { id: 'electron', name: 'Rocket Lab Electron', capacity: 300, costPerKg: 25000, minOrbit: 'LEO/SSO', reliability: 91, lead: '12-18 mo', badge: 'Small Sat' },
  { id: 'pslv', name: 'ISRO PSLV-XL', capacity: 1750, costPerKg: 4500, minOrbit: 'LEO/SSO/GTO', reliability: 96, lead: '18-24 mo', badge: 'Value' },
  { id: 'falcon9', name: 'SpaceX Falcon 9', capacity: 22800, costPerKg: 2720, minOrbit: 'LEO/GTO/GEO', reliability: 99, lead: '12-24 mo', badge: 'Workhorse' },
  { id: 'ariane6', name: 'Arianespace Ariane 62', capacity: 10350, costPerKg: 6100, minOrbit: 'LEO/GTO/GEO', reliability: 95, lead: '24-36 mo', badge: 'Institutional' },
  { id: 'starship', name: 'SpaceX Starship', capacity: 150000, costPerKg: 100, minOrbit: 'LEO/GTO/TLI', reliability: 82, lead: '6-12 mo', badge: 'Next-Gen' },
];

const serviceProfiles = [
  { id: 'disaster', name: 'Disaster Alerts', summary: 'Faster warnings for floods, fires, and storms.', reach: 1.45, cadence: 1.55, resilience: 1.2 },
  { id: 'connectivity', name: 'Remote Internet', summary: 'Useful coverage for hard-to-reach towns and schools.', reach: 1.7, cadence: 1.15, resilience: 1.05 },
  { id: 'agriculture', name: 'Crop Monitoring', summary: 'Useful imaging and moisture checks for farms.', reach: 1.1, cadence: 1.35, resilience: 1.1 },
  { id: 'climate', name: 'Air + Climate Sensing', summary: 'Repeated sensing for cities and environmental teams.', reach: 1.2, cadence: 1.45, resilience: 1.3 },
];

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function AnimatedCounter({ value, label }: { value: string, label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center p-6 border-r border-white/10 last:border-r-0"
    >
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#f3e0b7] to-white/60 mb-2">{value}</div>
      <div className="text-sm font-medium tracking-widest text-primary uppercase">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '24%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.18]);
  const starBgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cursorFrame = useRef<number | null>(null);
  const cursorTarget = useRef({ x: 50, y: 50 });
  // Orbit calculator state
  const [orbitAlt, setOrbitAlt] = useState(408);
  const orbitData = calcOrbit(orbitAlt);

  // Satellite builder state
  const [selStructure, setSelStructure] = useState(satelliteStructures[0]);
  const [selPower, setSelPower] = useState(satellitePower[1]);
  const [selComms, setSelComms] = useState(satelliteComms[1]);
  const [selMission, setSelMission] = useState(satelliteMission[0]);
  const satTotalMass = selStructure.mass + selPower.mass + selComms.mass + selMission.mass;
  const satTotalCost = selStructure.cost + selPower.cost + selComms.cost + selMission.cost;
  const satPower = selStructure.power + selPower.power;

  // Launch cost state
  const [selVehicle, setSelVehicle] = useState(launchVehicles[2]);
  const [payloadMass, setPayloadMass] = useState(150);
  const launchCost = payloadMass * selVehicle.costPerKg;
  const canFit = payloadMass <= selVehicle.capacity;

  // Usage lab state
  const [selService, setSelService] = useState(serviceProfiles[0]);
  const [coverageRadius, setCoverageRadius] = useState(2400);
  const [urgency, setUrgency] = useState(68);
  const [dailyUsers, setDailyUsers] = useState(280000);
  const [dataDemand, setDataDemand] = useState(420);
  const [resilienceLevel, setResilienceLevel] = useState(72);

  // Launch countdown state
  const [launches, setLaunches] = useState<any[]>([]);
  const [launchesLoading, setLaunchesLoading] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const commitGlow = () => {
      setMousePos(cursorTarget.current);
      cursorFrame.current = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      cursorTarget.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };

      if (cursorFrame.current == null) {
        cursorFrame.current = window.requestAnimationFrame(commitGlow);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (cursorFrame.current != null) {
        window.cancelAnimationFrame(cursorFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    fetch("https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=3&format=json")
      .then(res => res.json())
      .then(data => { if (data.results) setLaunches(data.results); setLaunchesLoading(false); })
      .catch(() => setLaunchesLoading(false));
  }, []);

  const orbitDisplayR = Math.max(60, Math.min(110, (orbitData.r / 42157) * 110));

  const usageLab = useMemo(() => {
    const coverageFactor = coverageRadius / 700;
    const urgencyFactor = urgency / 100;
    const resilienceFactor = resilienceLevel / 100;
    const userFactor = Math.max(0.6, dailyUsers / 180000);
    const dataFactor = Math.max(0.7, dataDemand / 320);

    const recommendedSatellites = Math.max(
      3,
      Math.round(
        selService.reach * coverageFactor +
          selService.cadence * urgencyFactor * 4 +
          userFactor * 2.2,
      ),
    );

    const revisitMinutes = Math.max(
      22,
      Math.round(210 / (recommendedSatellites * 0.52 + urgencyFactor * 3 + 1)),
    );

    const linkLatency = Math.max(
      18,
      Math.round((orbitAlt / 34) * 0.78 + dataDemand / 16 + (100 - resilienceLevel) / 8),
    );

    const capacityScore = Math.min(
      99,
      Math.round(
        48 +
          selVehicle.reliability * 0.22 +
          resilienceLevel * 0.18 +
          (canFit ? 8 : -22) +
          (recommendedSatellites <= 12 ? 6 : 0),
      ),
    );

    const peopleSupported = Math.round(dailyUsers * selService.reach * (revisitMinutes < 60 ? 1.4 : 1.08));
    const groundStations = Math.max(2, Math.round(coverageRadius / 1800 + dataDemand / 250 + 1));
    const downlinkNeed = Math.round((dataDemand * recommendedSatellites) / 28);

    return {
      recommendedSatellites,
      revisitMinutes,
      linkLatency,
      capacityScore,
      peopleSupported,
      groundStations,
      downlinkNeed,
      serviceTier:
        capacityScore >= 88 ? 'Launch-ready premium' :
        capacityScore >= 74 ? 'Strong with a few upgrades' :
        'Needs reinforcement',
    };
  }, [
    canFit,
    coverageRadius,
    dailyUsers,
    dataDemand,
    orbitAlt,
    resilienceLevel,
    selService,
    selVehicle.reliability,
  ]);

  const heroSnapshot = useMemo(() => {
    const nextLaunch = launches[0];

    return [
      {
        label: 'Orbit Altitude',
        value: `${orbitAlt.toLocaleString()} km`,
        note: orbitAlt < 2000 ? 'Low Earth orbit' : 'High coverage orbit',
      },
      {
        label: 'Orbital Speed',
        value: `${orbitData.speedKms} km/s`,
        note: 'Live from the orbit calculator',
      },
      {
        label: 'Mission Cost',
        value: fmt(launchCost),
        note: canFit ? selVehicle.name : 'Over capacity',
      },
      {
        label: 'Launch Feed',
        value: launchesLoading ? 'Syncing...' : (nextLaunch?.name ?? 'Awaiting feed'),
        note: launchesLoading ? 'Refreshing real launch data' : (nextLaunch?.rocket?.configuration?.name ?? 'Upcoming launch'),
      },
    ];
  }, [orbitAlt, orbitData.speedKms, launchCost, canFit, selVehicle.name, launches, launchesLoading]);

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      <motion.div style={{ y: starBgY }} className="fixed inset-0 z-0">
        <StarField />
      </motion.div>

      <div
        className="fixed inset-0 pointer-events-none opacity-25 mix-blend-screen z-0"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(236,199,140,0.34) 0%, transparent 52%),
                       radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(255,255,255,0.12) 0%, transparent 38%)`
        }}
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 flex items-center justify-between">
        <div className="font-black text-2xl tracking-[0.2em] uppercase text-white flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(236,199,140,0.95)]" />
          ORBITAL
        </div>
        <div className="hidden md:flex gap-8">
          {['Solar System', 'Tools', 'Missions', 'Deep Space'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '')}`} className="nav-link">{l}</a>
          ))}
        </div>
      </nav>

      <div className="relative z-10 pt-20">

        {/* HERO */}
        <section className="relative min-h-[92vh] px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-24 top-8 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(236,199,140,0.18),transparent_68%)] blur-3xl" />
            <div className="absolute right-0 top-24 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />
            <div className="absolute left-1/2 bottom-0 h-[26rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(104,118,148,0.2),transparent_72%)] blur-3xl" />
          </div>

          <div className="relative mx-auto grid min-h-[calc(92vh-5rem)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1.12fr_0.88fr]">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-3xl text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.9 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#f0d7a8] backdrop-blur-xl"
              >
                <Crosshair size={16} />
                Live mission telemetry
              </motion.div>

              <h1 className="mt-8 flex flex-col gap-1 text-6xl font-black uppercase tracking-tighter leading-[0.88] md:text-8xl">
                <motion.span initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.1 }} className="text-white/95">
                  Space systems,
                </motion.span>
                <motion.span initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.22 }} className="text-gradient">
                  translated into
                </motion.span>
                <motion.span initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.34 }} className="text-white/95">
                  a live product.
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.85, delay: 0.6 }}
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0"
              >
                A premium orbit dashboard that turns altitude, launch cost, and mission planning into something people can actually touch, read, and present.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.75, delay: 0.82 }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })}
                className="group rounded-full bg-white px-8 py-7 text-base font-bold text-black shadow-[0_18px_50px_rgba(255,255,255,0.18)] transition-all hover:bg-white/92 hover:shadow-[0_22px_70px_rgba(255,255,255,0.24)]"
                >
                  Open Mission Lab
                  <Rocket className="ml-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('missions')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })}
                  className="group rounded-full border-white/12 bg-white/4 px-8 py-7 text-base font-bold text-white/90 backdrop-blur-xl hover:border-white/20 hover:bg-white/8"
                >
                  View Space Timeline
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 1.02 }}
                className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
              >
                {heroSnapshot.map((item) => (
                  <div key={item.label} className="lux-glass liquid-sheen rounded-3xl p-4 text-left">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{item.label}</div>
                    <div className="mt-3 text-lg font-black text-white">{item.value}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1, delay: 0.35 }}
              className="relative z-10 flex justify-center lg:justify-end"
            >
              <div className="lux-glass liquid-sheen relative w-full max-w-[560px] overflow-hidden rounded-[2rem] p-5 sm:p-7">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />
                <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(236,199,140,0.24),transparent_68%)] blur-3xl" />
                <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Mission pulse</div>
                    <div className="mt-2 text-2xl font-black text-white">Liquid orbit preview</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-right">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Live altitude</div>
                    <div className="text-lg font-black text-[#f0d7a8]">{orbitAlt.toLocaleString()} km</div>
                  </div>
                </div>

                <div className="relative mt-6 flex items-center justify-center rounded-[1.75rem] border border-white/6 bg-black/24 p-4 sm:p-6">
                  <svg viewBox="0 0 420 320" className="h-auto w-full max-w-[420px]">
                    <defs>
                      <radialGradient id="planetGlow" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="#f4e4c0" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#a9b3c5" stopOpacity="0.95" />
                      </radialGradient>
                      <radialGradient id="planetShade" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.26" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="210" cy="160" r={orbitDisplayR + 58} fill="none" stroke="rgba(236,199,140,0.12)" strokeWidth="1" />
                    <circle cx="210" cy="160" r={orbitDisplayR + 38} fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="5 10" strokeWidth="1.2" />
                    <motion.circle
                      cx="210"
                      cy="160"
                      r={orbitDisplayR + 38}
                      fill="none"
                      stroke="rgba(236,199,140,0.46)"
                      strokeWidth="1.5"
                      strokeDasharray="1 12"
                      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: '210px 160px' }}
                    />
                    <circle cx="210" cy="160" r="56" fill="url(#planetGlow)" />
                    <circle cx="210" cy="160" r="56" fill="url(#planetShade)" opacity="0.58" />
                    <circle cx="210" cy="160" r="44" fill="rgba(235, 225, 208, 0.88)" />
                    <circle cx="208" cy="154" r="13" fill="rgba(255,255,255,0.35)" />
                    <circle cx={210 + orbitDisplayR + 38} cy="160" r="7" fill="#f0d7a8" />
                    <circle cx={210 - orbitDisplayR - 8} cy="160" r="4.2" fill="rgba(255,255,255,0.65)" />
                    <text x="210" y="286" textAnchor="middle" fill="#f0d7a8" fontSize="11" fontFamily="monospace" letterSpacing="1.2">
                      Orbit: {orbitData.speedKms} km/s  /  {orbitData.periodMin} min cycle
                    </text>
                  </svg>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Coverage</div>
                    <div className="mt-2 text-xl font-black text-white">{orbitData.coveragePct}%</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Build Cost</div>
                    <div className="mt-2 text-xl font-black text-white">{fmt(launchCost)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/30 p-4 col-span-2 sm:col-span-1">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Launch Feed</div>
                    <div className="mt-2 truncate text-xl font-black text-white">
                      {launchesLoading ? 'Syncing...' : (launches[0]?.name ?? 'Awaiting feed')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2" animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
            <div className="h-24 w-[2px] bg-gradient-to-b from-[#f0d7a8] to-transparent" />
          </motion.div>
        </section>

        {/* STATS */}
        <div className="border-y border-white/10 bg-black/40 backdrop-blur-xl relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            <AnimatedCounter value="8" label="Planets" />
            <AnimatedCounter value="4.5B" label="Years Old" />
            <AnimatedCounter value="93M" label="Miles to Sun" />
            <AnimatedCounter value="2T" label="Galaxies" />
          </div>
        </div>

        <div className="glow-divider" />

        {/* SOLAR SYSTEM */}
        <section id="solarsystem" className="py-32 px-6 md:px-12 relative max-w-[1400px] mx-auto z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Stellar <span className="text-gradient font-thin">System</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">Our local neighborhood, bound by the immense gravity of our star.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {planets.map((planet, idx) => <PlanetCard key={planet.name} {...planet} delay={idx * 0.1} />)}
          </div>
        </section>

        <div className="glow-divider" />

        {/* TOOLS */}
        <section id="tools" className="py-32 px-6 relative z-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={toolsBg} alt="" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24 text-center">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Mission <span className="text-gradient font-thin">Control</span></h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">Professional-grade instruments for planning real space missions.</p>
            </motion.div>

            <div className="space-y-16">

            {/* ---- TOOL 1: ORBIT CALCULATOR ---- */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="animated-border rounded-3xl p-8 md:p-12" style={{ borderColor: 'rgba(236,199,140,0.3)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-widest text-[#f0d7a8] mb-2 flex items-center gap-3">
                      <Orbit /> Orbit Calculator
                    </h3>
                    <p className="text-muted-foreground mb-8 text-sm">Real orbital mechanics - enter any altitude and get precise parameters using Kepler's laws.</p>

                    <div className="mb-6">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Orbital Altitude</label>
                      <div className="flex items-center gap-4 mb-3">
                        <input
                          type="range" min={200} max={35786} step={50}
                          value={orbitAlt}
                          onChange={e => setOrbitAlt(Number(e.target.value))}
                          className="flex-1 accent-[#f0d7a8] h-2 rounded cursor-pointer"
                        />
                        <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 min-w-[110px] text-center font-mono text-[#f0d7a8] text-sm font-bold">
                          {orbitAlt.toLocaleString()} km
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {orbitPresets.map(p => (
                          <button
                            key={p.label}
                            onClick={() => setOrbitAlt(p.alt)}
                            style={{ borderColor: p.color + '60', color: orbitAlt === p.alt ? '#000' : p.color, background: orbitAlt === p.alt ? p.color : 'transparent' }}
                            className="px-3 py-1 rounded-full text-xs font-bold border transition-all hover:opacity-90"
                          >
                            {p.label} ({p.alt.toLocaleString()} km)
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Orbital Speed', value: `${orbitData.speedKms} km/s`, color: 'text-[#f0d7a8]' },
                        { label: 'Period', value: `${Number(orbitData.periodMin) < 60 ? orbitData.periodMin + ' min' : (Number(orbitData.periodMin)/60).toFixed(2) + ' hrs'}`, color: 'text-white/85' },
                        { label: 'Orbits / Day', value: orbitData.orbitsPerDay, color: 'text-[#d8aa67]' },
                        { label: 'Earth Coverage', value: `${orbitData.coveragePct}%`, color: 'text-[#b77f56]' },
                      ].map(stat => (
                        <div key={stat.label} className="bg-black/40 rounded-2xl border border-white/5 p-4">
                          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</div>
                          <div className={`text-xl font-black font-mono ${stat.color}`}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SVG Orbit Diagram */}
                  <div className="flex items-center justify-center">
                    <svg viewBox="0 0 260 260" className="w-full max-w-[280px]">
                      <defs>
                        <radialGradient id="earthGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#f4e4c0" />
                          <stop offset="100%" stopColor="#9aa4b6" />
                        </radialGradient>
                        <radialGradient id="earthGlow" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#f4e4c0" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="130" cy="130" r={orbitDisplayR + 15} fill="none" stroke="#f0d7a8" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.24" />
                      <circle cx="130" cy="130" r={orbitDisplayR + 15} fill="none" stroke="#f0d7a8" strokeWidth="1.5" opacity="0.58" />
                      <circle cx="130" cy="130" r="26" fill="url(#earthGlow)" />
                      <circle cx="130" cy="130" r="22" fill="url(#earthGrad)" />
                      <text x="130" y="135" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" opacity="0.6">EARTH</text>
                      <motion.circle
                        cx={130 + orbitDisplayR + 15}
                        cy="130"
                        r="5"
                        fill="#f0d7a8"
                        filter="url(#satGlow)"
                        animate={{ rotate: 360 }}
                        style={{ transformOrigin: '130px 130px' }}
                        transition={{ duration: Number(orbitData.periodMin) / 10, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.circle
                        cx={130 + orbitDisplayR + 15}
                        cy="130"
                        r="12"
                        fill="#f0d7a8"
                        opacity="0.15"
                        style={{ transformOrigin: '130px 130px' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: Number(orbitData.periodMin) / 10, repeat: Infinity, ease: 'linear' }}
                      />
                      <text x="130" y="248" textAnchor="middle" fill="#f0d7a8" fontSize="9" opacity="0.7" fontFamily="monospace">
                        Alt: {orbitAlt.toLocaleString()} km
                      </text>
                    </svg>
                  </div>
                </div>
            </motion.div>

            {/* ---- TOOL 2: SATELLITE BUILDER ---- */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="animated-border rounded-3xl p-8 md:p-12" style={{ borderColor: 'rgba(236,199,140,0.3)' }}>
                <h3 className="text-3xl font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-3">
                  <Satellite /> Satellite Builder
                </h3>
                <p className="text-muted-foreground mb-8 text-sm">Configure each subsystem and get real cost and mass estimates for your spacecraft.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: 'Bus / Structure', options: satelliteStructures, sel: selStructure, setSel: setSelStructure as any },
                      { label: 'Power System', options: satellitePower, sel: selPower, setSel: setSelPower as any },
                      { label: 'Communications', options: satelliteComms, sel: selComms, setSel: setSelComms as any },
                      { label: 'Mission Payload', options: satelliteMission, sel: selMission, setSel: setSelMission as any },
                    ].map(group => (
                      <div key={group.label}>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{group.label}</label>
                        <div className="space-y-2">
                          {group.options.map((opt: any) => (
                            <button
                              key={opt.id}
                              onClick={() => group.setSel(opt)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${group.sel.id === opt.id ? 'border-primary/60 bg-primary/10 text-white' : 'border-white/10 bg-black/30 text-muted-foreground hover:border-white/20 hover:text-white'}`}
                            >
                              <div className="font-bold">{opt.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {fmt(opt.cost)} &nbsp; / &nbsp; {opt.mass} kg
                                {'bandwidth' in opt ? `  /  ${opt.bandwidth}` : ''}
                                {'desc' in opt ? `  /  ${opt.desc}` : ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Result Panel */}
                  <div className="flex flex-col justify-between gap-4">
                    <div className="bg-black/50 rounded-2xl border border-primary/20 p-6 flex-1">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Mission Summary</div>
                      {[
                        { label: 'Total Mass', value: `${satTotalMass.toFixed(1)} kg`, bar: Math.min(100, (satTotalMass / 700) * 100), color: 'bg-[#d8aa67]' },
                        { label: 'Power Budget', value: `${satPower} W`, bar: Math.min(100, (satPower / 600) * 100), color: 'bg-[#9a7c56]' },
                        { label: 'Est. Build Cost', value: fmt(satTotalCost), bar: Math.min(100, (satTotalCost / 20000000) * 100), color: 'bg-primary' },
                      ].map(stat => (
                        <div key={stat.label} className="mb-5">
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-bold font-mono text-white">{stat.value}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${stat.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.bar}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black/50 rounded-2xl border border-white/10 p-5">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Configuration</div>
                      <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                        <div><span className="text-white/50">BUS:</span> {selStructure.name}</div>
                        <div><span className="text-white/50">PWR:</span> {selPower.name}</div>
                        <div><span className="text-white/50">COM:</span> {selComms.name}</div>
                        <div><span className="text-white/50">PLD:</span> {selMission.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
            </motion.div>

            {/* ---- TOOL 3: LAUNCH COST ESTIMATOR ---- */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="animated-border rounded-3xl p-8 md:p-12" style={{ borderColor: 'rgba(216,170,103,0.3)' }}>
                <h3 className="text-3xl font-black uppercase tracking-widest text-[#f0d7a8] mb-2 flex items-center gap-3">
                  <CircleDollarSign /> Launch Cost Estimator
                </h3>
                <p className="text-muted-foreground mb-8 text-sm">Compare real launch vehicles and estimate mission cost based on payload mass and orbit.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <div className="mb-6">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Payload Mass</label>
                      <div className="flex items-center gap-4 mb-2">
                        <input
                          type="range" min={1} max={5000} step={1}
                          value={payloadMass}
                          onChange={e => setPayloadMass(Number(e.target.value))}
                          className="flex-1 accent-[#d8aa67] h-2 rounded cursor-pointer"
                        />
                        <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 min-w-[100px] text-center font-mono text-[#f0d7a8] text-sm font-bold">
                          {payloadMass.toLocaleString()} kg
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Launch Vehicle</label>
                      <div className="space-y-2">
                        {launchVehicles.map(v => {
                          const fits = payloadMass <= v.capacity;
                          return (
                            <button
                              key={v.id}
                              onClick={() => setSelVehicle(v)}
                              disabled={!fits}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex justify-between items-center ${
                                !fits ? 'opacity-30 cursor-not-allowed border-white/5' :
                                selVehicle.id === v.id ? 'border-primary/60 bg-primary/10 text-white' :
                                'border-white/10 bg-black/30 text-muted-foreground hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <div>
                                <span className="font-bold">{v.name}</span>
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{v.badge}</span>
                                {!fits && <span className="ml-2 text-xs text-red-400">Exceeds capacity ({v.capacity.toLocaleString()} kg)</span>}
                              </div>
                              <div className="text-right text-xs font-mono">
                                <div className="text-[#d8aa67]">${v.costPerKg.toLocaleString()}/kg</div>
                                <div className="text-white/30">{v.reliability}% reliability</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-black/50 rounded-2xl border border-white/10 p-6">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Cost Breakdown</div>
                      {canFit ? (
                        <>
                          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f3e0b7] via-[#d8aa67] to-[#9a7c56] mb-1">{fmt(launchCost)}</div>
                          <div className="text-muted-foreground text-sm mb-8">Estimated launch cost</div>
                          <div className="space-y-4">
                            {[
                              { label: 'Vehicle', value: selVehicle.name },
                              { label: 'Payload', value: `${payloadMass.toLocaleString()} kg` },
                              { label: 'Rate', value: `$${selVehicle.costPerKg.toLocaleString()} / kg` },
                              { label: 'Utilization', value: `${((payloadMass / selVehicle.capacity) * 100).toFixed(1)}% of capacity` },
                              { label: 'Reliability', value: `${selVehicle.reliability}%` },
                              { label: 'Lead Time', value: selVehicle.lead },
                            ].map(row => (
                              <div key={row.label} className="flex justify-between text-sm border-b border-white/5 pb-3">
                                <span className="text-muted-foreground">{row.label}</span>
                                <span className="font-mono font-bold text-white">{row.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6">
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Payload Fill Ratio</div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[#f3e0b7] to-[#d8aa67] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (payloadMass / selVehicle.capacity) * 100)}%` }}
                                transition={{ duration: 0.4 }}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-red-400">
                          <div className="text-3xl font-black mb-3">Overweight</div>
                          <p className="text-muted-foreground text-sm">Your {payloadMass.toLocaleString()} kg payload exceeds {selVehicle.name}'s {selVehicle.capacity.toLocaleString()} kg capacity. Select a larger vehicle or reduce payload mass.</p>
                        </div>
                      )}
                    </div>

                    {/* Live Launches mini strip */}
                    <div className="bg-black/30 rounded-2xl border border-white/5 p-5">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <Timer size={12} /> Next Launches
                      </div>
                      {launchesLoading ? (
                        <div className="text-[#d8aa67] animate-pulse text-xs font-mono">Establishing uplink...</div>
                      ) : launches.length > 0 ? (
                        <div className="space-y-3">
                          {launches.slice(0, 2).map(l => (
                            <div key={l.id} className="text-xs">
                              <div className="font-bold text-white truncate">{l.name}</div>
                              <div className="text-muted-foreground">{l.rocket?.configuration?.name}  /  {new Date(l.net).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-xs">Launch feed unavailable</div>
                      )}
                    </div>
                  </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="animated-border rounded-3xl p-8 md:p-12" style={{ borderColor: 'rgba(127,140,163,0.34)' }}>
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                      <Globe2 className="text-[#f0d7a8]" /> Service Coverage Planner
                    </h3>
                    <p className="text-muted-foreground text-sm">Turn a plain-language service goal into satellite count, revisit speed, and likely user reach.</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#f0d7a8]">
                    {usageLab.serviceTier}
                  </div>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">Service Goal</div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {serviceProfiles.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelService(service)}
                            className={`rounded-2xl border px-4 py-4 text-left transition-all ${selService.id === service.id ? 'border-primary/60 bg-primary/10 shadow-[0_0_40px_rgba(216,170,103,0.12)]' : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.03]'}`}
                          >
                            <div className="font-bold text-white">{service.name}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{service.summary}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Coverage Radius
                          <span className="text-[#f0d7a8]">{coverageRadius.toLocaleString()} km</span>
                        </div>
                        <input type="range" min={600} max={8000} step={100} value={coverageRadius} onChange={(e) => setCoverageRadius(Number(e.target.value))} className="mt-4 w-full accent-[#f0d7a8]" />
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Daily Users
                          <span className="text-[#f0d7a8]">{dailyUsers.toLocaleString()}</span>
                        </div>
                        <input type="range" min={50000} max={1200000} step={10000} value={dailyUsers} onChange={(e) => setDailyUsers(Number(e.target.value))} className="mt-4 w-full accent-[#f0d7a8]" />
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Response Urgency
                          <span className="text-[#f0d7a8]">{urgency}%</span>
                        </div>
                        <input type="range" min={20} max={100} step={1} value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} className="mt-4 w-full accent-[#f0d7a8]" />
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Resilience
                          <span className="text-[#f0d7a8]">{resilienceLevel}%</span>
                        </div>
                        <input type="range" min={20} max={100} step={1} value={resilienceLevel} onChange={(e) => setResilienceLevel(Number(e.target.value))} className="mt-4 w-full accent-[#f0d7a8]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Satellites Needed', value: usageLab.recommendedSatellites, note: 'Recommended first wave' },
                      { label: 'Revisit Speed', value: `${usageLab.revisitMinutes} min`, note: 'Time between useful passes' },
                      { label: 'People Supported', value: usageLab.peopleSupported.toLocaleString(), note: 'Estimated real use reach' },
                      { label: 'Readiness Score', value: `${usageLab.capacityScore}/100`, note: 'Based on fit, urgency, and resilience' },
                    ].map((item) => (
                      <div key={item.label} className="lux-glass rounded-3xl p-5">
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div>
                        <div className="mt-3 text-3xl font-black text-white">{item.value}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="animated-border rounded-3xl p-8 md:p-12" style={{ borderColor: 'rgba(240,215,168,0.28)' }}>
                <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                      <Radio className="text-[#f0d7a8]" /> Link + Latency Simulator
                    </h3>
                    <p className="text-muted-foreground text-sm">See how orbit, throughput demand, and satellite count change the real feel of the network.</p>

                    <div className="mt-8 space-y-5">
                      <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Data Demand
                          <span className="text-[#f0d7a8]">{dataDemand} TB/day</span>
                        </div>
                        <input type="range" min={80} max={1600} step={10} value={dataDemand} onChange={(e) => setDataDemand(Number(e.target.value))} className="mt-4 w-full accent-[#f0d7a8]" />
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Orbit Altitude
                          <span className="text-[#f0d7a8]">{orbitAlt.toLocaleString()} km</span>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">This simulator stays synced to the orbit calculator above.</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-6">
                    <div className="absolute inset-x-10 top-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute left-[10%] top-[22%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(240,215,168,0.18),transparent_70%)] blur-3xl" />
                    <div className="absolute right-[12%] bottom-[14%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(127,140,163,0.18),transparent_72%)] blur-3xl" />

                    <div className="relative">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Latency', value: `${usageLab.linkLatency} ms` },
                          { label: 'Ground Stations', value: usageLab.groundStations },
                          { label: 'Downlink Need', value: `${usageLab.downlinkNeed} Gbps` },
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{item.label}</div>
                            <div className="mt-3 text-2xl font-black text-white">{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 space-y-4">
                        {[
                          { label: 'Signal Stability', value: Math.min(98, Math.round(resilienceLevel * 0.7 + 22)) },
                          { label: 'Realtime Feel', value: Math.max(32, 100 - usageLab.linkLatency) },
                          { label: 'Capacity Headroom', value: Math.max(18, Math.min(96, 108 - usageLab.downlinkNeed)) },
                        ].map((bar) => (
                          <div key={bar.label}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{bar.label}</span>
                              <span className="font-mono text-white">{bar.value}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#f3e0b7] via-[#d8aa67] to-[#7f8ca3]" initial={{ width: 0 }} whileInView={{ width: `${bar.value}%` }} viewport={{ once: true }} transition={{ duration: 0.7 }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-[#f0d7a8]">
                          <Waves size={16} />
                          Live Network Read
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {usageLab.linkLatency < 55 ? 'This setup feels responsive enough for alerting, map layers, and live operational dashboards.' : 'This setup is better for batch imaging and delayed analysis unless you lower orbit altitude or add capacity.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="animated-border rounded-3xl p-8 md:p-12" style={{ borderColor: 'rgba(154,124,86,0.34)' }}>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                      <ShieldCheck className="text-[#f0d7a8]" /> Launch Readiness Matrix
                    </h3>
                    <p className="text-muted-foreground text-sm">A quick board for checking whether the current service plan feels strong enough to present as a real deployment.</p>
                    <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mission Confidence</div>
                      <div className="mt-4 text-5xl font-black text-white">{usageLab.capacityScore}%</div>
                      <div className="mt-2 text-sm text-muted-foreground">{usageLab.serviceTier}</div>
                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-[#9a7c56] via-[#d8aa67] to-[#f3e0b7]" initial={{ width: 0 }} whileInView={{ width: `${usageLab.capacityScore}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        title: 'Coverage Readiness',
                        score: Math.min(99, Math.round(usageLab.recommendedSatellites * 6.8)),
                        detail: `${usageLab.recommendedSatellites} satellites keep ${coverageRadius.toLocaleString()} km active.`,
                      },
                      {
                        title: 'Launch Fit',
                        score: canFit ? Math.min(99, selVehicle.reliability + 1) : 22,
                        detail: canFit ? `${selVehicle.name} can carry this payload now.` : 'Payload is too heavy for the selected rocket.',
                      },
                      {
                        title: 'User Delivery',
                        score: Math.min(97, Math.round(usageLab.peopleSupported / 18000)),
                        detail: `${usageLab.peopleSupported.toLocaleString()} people can realistically benefit.`,
                      },
                      {
                        title: 'Operations Backup',
                        score: Math.min(98, Math.round(resilienceLevel * 0.88 + usageLab.groundStations * 3)),
                        detail: `${usageLab.groundStations} ground stations with resilience at ${resilienceLevel}%.`,
                      },
                    ].map((item, index) => (
                      <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="lux-glass rounded-3xl p-5">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-white">{item.title}</div>
                          <Sparkles size={16} className="text-[#f0d7a8]" />
                        </div>
                        <div className="mt-4 text-3xl font-black text-white">{item.score}%</div>
                        <div className="mt-3 text-sm text-muted-foreground">{item.detail}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
            </motion.div>
            </div>
          </div>
        </section>

        <div className="glow-divider" />

        {/* MISSIONS TIMELINE */}
        <section id="missions" className="py-32 px-6 md:px-12 bg-black/40 relative z-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-24 text-center">
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
                  transition={{ duration: 0.8 }}
                  className={`relative pl-10 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:ml-auto md:pl-16' : 'md:pr-16 md:text-right'}`}
                >
                  <div className={`absolute top-0 w-6 h-6 rounded-full border-4 border-black bg-primary shadow-[0_0_20px_rgba(236,199,140,0.95)] -left-[13px] md:left-auto ${idx % 2 === 0 ? 'md:-left-[13px]' : 'md:-right-[13px]'}`} />
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

        {/* DEEP SPACE */}
        <section id="deepspace" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto z-20 relative">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-32">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Deep <span className="text-gradient font-thin">Space</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">Venture beyond our galaxy to the oldest and most mysterious structures in the universe.</p>
          </motion.div>
          <div className="space-y-40">
            {[
              { img: nebulaImg, title: "Stellar Nurseries", desc: "Nebulae are massive clouds of dust and gas where new stars are born, painting the cosmos in vibrant, impossible colors." },
              { img: blackholeImg, title: "Singularity", desc: "Regions of spacetime where gravity is so strong that nothing - no particles or even electromagnetic radiation such as light - can escape from it.", reverse: true },
              { img: galaxyImg, title: "Spiral Galaxies", desc: "Immense, rotating assemblies of stars, planetary systems, and interstellar matter, bound together by gravity and dark matter." }
            ].map(item => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
                className={`flex flex-col md:flex-row items-center gap-16 ${item.reverse ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-1/2 relative group">
                  <div className="absolute -inset-6 bg-gradient-to-r from-[#f0d7a8] to-[#9a7c56] blur-2xl rounded-full opacity-20 group-hover:opacity-36 transition duration-1000" />
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

        {/* FOOTER */}
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

