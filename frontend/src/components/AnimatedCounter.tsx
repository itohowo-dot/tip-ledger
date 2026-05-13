import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (n: number) => string;
}