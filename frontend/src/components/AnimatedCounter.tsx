import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (n: number) => string;
}

export function AnimatedCounter({ value, duration = 1.2, formatFn }: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const prevValue = useRef(0);