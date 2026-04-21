import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PlanetCardProps {
  name: string;
  fact: string;
  link: string;
  color: string;
  delay?: number;
}

export function PlanetCard({ name, fact, link, color, delay = 0 }: PlanetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative group h-full"
    >
      <div 
        className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-80 transition duration-700"
        style={{ background: `linear-gradient(to right, ${color}80, transparent)` }}
      />
      <Card className="glass-card relative border border-white/10 overflow-hidden h-full rounded-2xl z-10 transition-colors group-hover:border-white/20">
        <CardContent className="p-8 flex flex-col h-full items-center text-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Orbit ring that shows on hover */}
            <div className="absolute inset-[-20%] rounded-full border border-dashed opacity-0 group-hover:opacity-60 group-hover:animate-spin-slow transition-opacity duration-700 pointer-events-none" 
                 style={{ borderColor: color }} />
                 
            <div 
              className="w-24 h-24 rounded-full shadow-lg relative z-10 transition-transform duration-700 group-hover:scale-105"
              style={{ 
                background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
                boxShadow: `0 0 26px ${color}44`
              }}
            >
              <div className="absolute inset-0 rounded-full bg-black/20 mix-blend-overlay"></div>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-white tracking-widest uppercase" style={{ textShadow: `0 0 10px ${color}80` }}>{name}</h3>
          
          <p className="text-muted-foreground text-sm flex-grow leading-relaxed">
            {fact}
          </p>
          
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors mt-4 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            Data Link <ExternalLink size={12} />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
