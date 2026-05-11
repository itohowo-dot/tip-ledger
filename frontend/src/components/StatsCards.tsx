import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  suffix?: string;
  index?: number;
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, suffix, index = 0, trend }: StatCardProps) {
  const numericValue = parseFloat(value.replace(/,/g, ""));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card className="overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        <CardContent className="p-5 relative">
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="flex items-start justify-between relative">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold tracking-tight font-mono">
                {!isNaN(numericValue) ? (
                  <AnimatedCounter value={numericValue} formatFn={(n) => n.toLocaleString("en-US", { maximumFractionDigits: 1 })} />
                ) : value}
                {suffix && <span className="text-sm font-medium text-muted-foreground ml-1">{suffix}</span>}
              </p>
              {trend && (
                <p className="text-xs text-green-500 font-medium flex items-center gap-0.5">
                  ↑ {trend}
                </p>
              )}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
