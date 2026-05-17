import { useEffect, useRef } from "react";

interface ConfettiEffectProps {
  active: boolean;
}

export function ConfettiEffect({ active }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);