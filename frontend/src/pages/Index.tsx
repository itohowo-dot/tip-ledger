import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPlatformStats, getRecentTips } from "@/lib/contract";
import { AppShell } from "@/components/AppShell";
import { StatCard, StatCardSkeleton } from "@/components/StatsCards";
import { ActivityList } from "@/components/ActivityList";
import { Button } from "@/components/ui/button";
import { Send, Coins, Users, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const stats = useQuery({ queryKey: ["platform-stats"], queryFn: getPlatformStats });
  const recent = useQuery({
    queryKey: ["recent-tips", 0],
    queryFn: () => getRecentTips(0, 5),
  });

  return (
    <AppShell>
      {/* Hero */}
      <section className="py-8 md:py-16 relative">
        {/* Radial gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12)_0%,transparent_70%)]" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06)_0%,transparent_70%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur-sm px-3 py-1 text-xs text-muted-foreground mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live on Stacks Testnet
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Micro-tipping on{" "}
            <span className="text-primary bg-clip-text">Stacks</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl">
            Reward builders, creators, and contributors in the Stacks ecosystem with instant STX tips. Transparent, on-chain, and zero-friction.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
              <Link to="/send">
                <Send className="h-4 w-4" />
                Send a Tip
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/activity">
                View Activity
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Platform Stats */}
      <section className="pb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : stats.data ? (
            <>
              <StatCard label="Total Tips" value={stats.data.totalTips.toLocaleString()} icon={TrendingUp} index={0} trend="+12% this week" />
              <StatCard label="Total Volume" value={stats.data.totalVolume.toLocaleString()} suffix="STX" icon={Coins} index={1} trend="+8% this week" />
              <StatCard label="Unique Users" value={stats.data.uniqueUsers.toLocaleString()} icon={Users} index={2} trend="+5% this week" />
            </>
          ) : null}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Tips
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link to="/activity">
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        <ActivityList tips={recent.data?.tips ?? []} loading={recent.isLoading} />
      </section>
    </AppShell>
  );
}
