"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "star" | "sparkle" | "dot";
}

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Create particles on mouse move
    const createParticle = () => {
      const dx = mouseRef.current.x - lastMouseRef.current.x;
      const dy = mouseRef.current.y - lastMouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const types: ("star" | "sparkle" | "dot")[] = ["star", "sparkle", "dot"];
        const particle: Particle = {
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          size: 3 + Math.random() * 4,
          type: types[Math.floor(Math.random() * types.length)],
        };
        particlesRef.current.push(particle);
        lastMouseRef.current = { ...mouseRef.current };
      }
    };

    // Draw star shape
    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Date.now() / 1000);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.rotate(Math.PI / 2);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    // Draw sparkle shape
    const drawSparkle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      // 4-pointed sparkle
      const points = 4;
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? size : size * 0.3;
        const angle = (i * Math.PI) / points;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(245, 241, 227, ${alpha * 0.9})`;
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      createParticle();

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 1 / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravity
        p.vx *= 0.99; // friction

        if (p.life <= 0) return false;

        const alpha = p.life;
        const size = p.size * p.life;

        if (p.type === "star") {
          drawStar(ctx, p.x, p.y, size, alpha);
        } else if (p.type === "sparkle") {
          drawSparkle(ctx, p.x, p.y, size, alpha);
        } else {
          // Simple dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(53, 114, 102, ${alpha * 0.6})`;
          ctx.fill();
        }

        return true;
      });

      // Limit particles
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
