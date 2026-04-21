import React, { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  radius: number;
  twinkleSpeed: number;
  phase: number;
  driftX: number;
  driftY: number;
  alpha: number;
};

type Blob = {
  x: number;
  y: number;
  radius: number;
  drift: number;
  tint: string;
  alpha: number;
  phase: number;
};

type Streak = {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
};

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    let animationFrameId = 0;
    let running = true;
    let stars: Star[] = [];
    let blobs: Blob[] = [];
    let streaks: Streak[] = [];

    const getStarCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const base = Math.round(area / 18000);
      const mobileCap = isCoarsePointer ? 72 : 140;
      return Math.max(48, Math.min(mobileCap, base));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      initStars();
    };

    const initStars = () => {
      const count = getStarCount();
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.2 + 0.2,
        twinkleSpeed: Math.random() * 0.0008 + 0.0002,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.018,
        driftY: (Math.random() - 0.5) * 0.014,
        alpha: Math.random() * 0.65 + 0.1,
      }));

      blobs = [
        {
          x: window.innerWidth * 0.22,
          y: window.innerHeight * 0.22,
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.26,
          drift: 0.00022,
          tint: '236,199,140',
          alpha: 0.15,
          phase: 0,
        },
        {
          x: window.innerWidth * 0.76,
          y: window.innerHeight * 0.26,
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.2,
          drift: 0.00018,
          tint: '255,255,255',
          alpha: 0.08,
          phase: Math.PI / 2,
        },
        {
          x: window.innerWidth * 0.58,
          y: window.innerHeight * 0.8,
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.24,
          drift: 0.0002,
          tint: '127,140,163',
          alpha: 0.14,
          phase: Math.PI,
        },
      ];

      const streakCount = isCoarsePointer ? 2 : 4;
      streaks = Array.from({ length: streakCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.7,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 1.6 + 1,
        alpha: Math.random() * 0.24 + 0.12,
      }));
    };

    const draw = (time: number) => {
      if (!running) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shouldAnimate = !prefersReducedMotion;

      for (const blob of blobs) {
        const pulse = shouldAnimate ? 1 + Math.sin(time * blob.drift + blob.phase) * 0.12 : 1;
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius * pulse,
        );
        gradient.addColorStop(0, `rgba(${blob.tint}, ${blob.alpha})`);
        gradient.addColorStop(0.55, `rgba(${blob.tint}, ${blob.alpha * 0.32})`);
        gradient.addColorStop(1, `rgba(${blob.tint}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.76, canvas.height * 0.3, 160, 68, 0.42, 0, Math.PI * 2);
      ctx.ellipse(canvas.width * 0.76, canvas.height * 0.3, 195, 82, -0.18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

      for (const star of stars) {
        const pulse = shouldAnimate ? 0.42 + Math.sin(time * star.twinkleSpeed + star.phase) * 0.28 : 0.35;
        const glow = Math.max(0.08, star.alpha * pulse);

        ctx.globalAlpha = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        if (shouldAnimate) {
          star.x += star.driftX;
          star.y += star.driftY;

          if (star.x < -5) star.x = canvas.width + 5;
          if (star.x > canvas.width + 5) star.x = -5;
          if (star.y < -5) star.y = canvas.height + 5;
          if (star.y > canvas.height + 5) star.y = -5;
        }
      }

      if (shouldAnimate) {
        for (const streak of streaks) {
          const gradient = ctx.createLinearGradient(streak.x, streak.y, streak.x - streak.length, streak.y + streak.length * 0.24);
          gradient.addColorStop(0, `rgba(255,255,255,${streak.alpha})`);
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(streak.x, streak.y);
          ctx.lineTo(streak.x - streak.length, streak.y + streak.length * 0.24);
          ctx.stroke();

          streak.x += streak.speed;
          streak.y += streak.speed * 0.16;

          if (streak.x - streak.length > canvas.width || streak.y > canvas.height * 0.86) {
            streak.x = -40;
            streak.y = Math.random() * canvas.height * 0.48;
          }
        }
      }

      ctx.globalAlpha = 1;

      if (shouldAnimate) {
        animationFrameId = window.requestAnimationFrame(draw);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrameId);
        return;
      }

      if (!running) {
        running = true;
        animationFrameId = window.requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    resize();
    if (!prefersReducedMotion) {
      animationFrameId = window.requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
