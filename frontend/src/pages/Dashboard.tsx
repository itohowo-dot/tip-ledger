import { useQuery } from "@tanstack/react-query";
import { getUserStats, getPlatformStats } from "@/lib/contract";
import { useWallet } from "@/contexts/WalletContext";
import { AppShell } from "@/components/AppShell";
import { StatCard, StatCardSkeleton } from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Send, Inbox, TrendingUp, Coins, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { connected, principal, connect } = useWallet();

  const userStats = useQuery({
    queryKey: ["user-stats", principal],
    queryFn: () => getUserStats(principal!),
    enabled: connected && !!principal,
  });

  const platformStats = useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });

  return (
    <AppShell>
      <div className="py-4 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h1>

        {!connected ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  Connect your Stacks wallet to view your personal tipping stats, track sent and received tips, and see your contribution history.
                </p>
                <Button onClick={connect} size="lg" className="gap-2 shadow-lg shadow-primary/25">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Your Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {userStats.isLoading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : userStats.data ? (
                <>
                  <StatCard label="Total Sent" value={userStats.data.totalSent.toLocaleString()} suffix="STX" icon={ArrowUpRight} index={0} />
                  <StatCard label="Total Received" value={userStats.data.totalReceived.toLocaleString()} suffix="STX" icon={ArrowDownLeft} index={1} />
                  <StatCard label="Tips Sent" value={userStats.data.tipsSentCount.toString()} icon={Send} index={2} />
                  <StatCard label="Tips Received" value={userStats.data.tipsReceivedCount.toString()} icon={Inbox} index={3} />
                </>
              ) : null}
            </div>
          </>
        )}

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Platform Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platformStats.isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : platformStats.data ? (
            <>
              <StatCard label="Total Tips" value={platformStats.data.totalTips.toLocaleString()} icon={TrendingUp} index={0} />
              <StatCard label="Total Volume" value={platformStats.data.totalVolume.toLocaleString()} suffix="STX" icon={Coins} index={1} />
              <StatCard label="Unique Users" value={platformStats.data.uniqueUsers.toLocaleString()} icon={Users} index={2} />
            </>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
