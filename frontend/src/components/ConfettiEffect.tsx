import { useEffect, useRef } from "react";

interface ConfettiEffectProps {
  active: boolean;
}

export function ConfettiEffect({ active }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = [
      "hsl(221, 83%, 53%)",
      "hsl(142, 71%, 45%)",
      "hsl(38, 92%, 50%)",
      "hsl(262, 83%, 58%)",
      "hsl(326, 80%, 55%)",
      "hsl(199, 89%, 48%)",
    ];

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      w: number; h: number; color: string; rotation: number; vr: number;
      life: number;
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }