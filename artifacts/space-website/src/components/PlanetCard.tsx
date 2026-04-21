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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div 
        className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />
      <Card className="glass-card relative border-0 overflow-hidden h-full">
        <CardContent className="p-6 flex flex-col h-full items-center text-center gap-4">
          <div 
            className="w-24 h-24 rounded-full shadow-lg mb-2 relative"
            style={{ 
              background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
              boxShadow: `0 0 20px ${color}40`
            }}
          >
            {/* Inner glow/texture hint */}
            <div className="absolute inset-0 rounded-full bg-black/20 mix-blend-overlay"></div>
          </div>
          
          <h3 className="text-2xl font-bold text-white tracking-wide">{name}</h3>
          
          <p className="text-muted-foreground text-sm flex-grow">
            {fact}
          </p>
          
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary hover:text-white transition-colors mt-4"
          >
            Learn more <ExternalLink size={14} />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
