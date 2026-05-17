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