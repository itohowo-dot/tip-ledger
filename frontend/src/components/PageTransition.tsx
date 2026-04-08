import { motion } from "framer-motion";
import { useNavigationDirection } from "@/contexts/NavigationDirection";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { direction } = useNavigationDirection();

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -direction * 30 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
