import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Identicon } from "@/components/Identicon";
import { StatCard, StatCardSkeleton } from "@/components/StatsCards";
import { ActivityList } from "@/components/ActivityList";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWallet } from "@/contexts/WalletContext";
import {
  getUserStats,
  getRecentTips,
  getLeaderboard,
  getAchievements,
  truncatePrincipal,
  type LeaderboardEntry,
} from "@/lib/contract";
import {
  User,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Inbox,
  Trophy,
  Crown,
  Lock,
  Award,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProfileCard } from "@/components/ProfileCard";

const RANGE_LABELS: Record<string, string> = {
  "24h": "24h",
  "7d": "7d",
  "30d": "30d",
  all: "All Time",
};

function RankCell({ rank }: { rank: number | null }) {
  if (rank === null) return <span className="text-muted-foreground text-xs">—</span>;
  if (rank <= 3) {
    const colors: Record<number, string> = {
      1: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
      2: "bg-gray-300/20 text-gray-600 dark:text-gray-300 border-gray-400/30",
      3: "bg-amber-700/20 text-amber-700 dark:text-amber-400 border-amber-700/30",
    };
    return (
      <Badge className={`${colors[rank]} font-bold text-xs tabular-nums w-7 justify-center`}>
        #{rank}
      </Badge>
    );
  }
  return <span className="text-muted-foreground text-sm tabular-nums">#{rank}</span>;
}

function findRank(entries: LeaderboardEntry[] | undefined, addr: string): number | null {
  if (!entries) return null;
  const idx = entries.findIndex((e) => e.principal === addr);
  return idx >= 0 ? idx + 1 : null;
}

async function getAllRanks() {
  const [h24, d7, d30, all] = await Promise.all([
    getLeaderboard("24h"),
    getLeaderboard("7d"),
    getLeaderboard("30d"),
    getLeaderboard("all"),
  ]);
  return { "24h": h24, "7d": d7, "30d": d30, all };
}

export default function ProfilePage() {
  const { address } = useParams<{ address?: string }>();
  const { connected, principal, connect } = useWallet();

  const profileAddress = address || principal;
  const isOwnProfile = !address || address === principal;
  const showContent = !!profileAddress;

  const userStats = useQuery({
    queryKey: ["user-stats", profileAddress],
    queryFn: () => getUserStats(profileAddress!),
    enabled: showContent,
  });

  const userTips = useQuery({
    queryKey: ["user-tips", profileAddress],
    queryFn: () => getRecentTips(0, 50),
    enabled: showContent,
  });

  const rankings = useQuery({
    queryKey: ["all-rankings", profileAddress],
    queryFn: getAllRanks,
    enabled: showContent,
  });

  const achievements = useQuery({
    queryKey: ["achievements", profileAddress],
    queryFn: () => getAchievements(profileAddress!),
    enabled: showContent,
  });

  const userTipsList = userTips.data?.tips.filter(
    (t) => t.sender === profileAddress || t.recipient === profileAddress
  ) ?? [];

  return (
    <AppShell>
      <div className="space-y-6">
        {!showContent ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">View Your Profile</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  Connect your Stacks wallet to see your tip history, rankings, and stats across all time periods.
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
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardContent className="flex items-center gap-4 py-6">
                  <Identicon principal={profileAddress!} size={56} />
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight truncate font-mono">
                      {truncatePrincipal(profileAddress!, 8)}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {isOwnProfile ? "Your TipLedger Profile" : "User Profile"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Badges earned through tipping activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {achievements.data?.map((badge, i) => (
                        <Tooltip key={badge.id}>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: i * 0.08, type: "spring", stiffness: 200 }}
                              whileHover={badge.unlocked ? { scale: 1.05 } : undefined}
                              className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center transition-all cursor-default ${
                                badge.unlocked
                                  ? "bg-primary/5 border-primary/20 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-3px_hsl(var(--primary)/0.5)] hover:border-primary/50"
                                  : "bg-muted/30 border-border/50 opacity-50"
                              }`}
                            >
                              <motion.span
                                className="text-2xl"
                                animate={badge.unlocked ? { rotate: [0, -5, 5, -3, 0] } : undefined}
                                transition={{ duration: 0.6, delay: i * 0.08 + 0.3 }}
                              >
                                {badge.icon}
                              </motion.span>
                              <span className={`text-xs font-semibold leading-tight ${badge.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                                {badge.label}
                              </span>
                              {!badge.unlocked && (
                                <div className="absolute top-2 right-2">
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                </div>
                              )}
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{badge.description}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {badge.unlocked ? "✅ Unlocked" : "🔒 Locked"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Rankings */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    {isOwnProfile ? "Your Rankings" : "Rankings"}
                  </CardTitle>
                  <CardDescription>Rankings across different time periods</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Period</TableHead>
                        <TableHead className="text-center">Tipper Rank</TableHead>
                        <TableHead className="text-center pr-6">Recipient Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(["24h", "7d", "30d", "all"] as const).map((range) => {
                        const lb = rankings.data?.[range];
                        const loading = rankings.isLoading;
                        const senderRank = findRank(lb?.topSenders, profileAddress!);
                        const recipientRank = findRank(lb?.topRecipients, profileAddress!);
                        return (
                          <TableRow key={range}>
                            <TableCell className="pl-6 font-medium">{RANGE_LABELS[range]}</TableCell>
                            <TableCell className="text-center">
                              {loading ? <Skeleton className="h-5 w-8 mx-auto" /> : <RankCell rank={senderRank} />}
                            </TableCell>
                            <TableCell className="text-center pr-6">
                              {loading ? <Skeleton className="h-5 w-8 mx-auto" /> : <RankCell rank={recipientRank} />}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shareable Profile Card */}
            {userStats.data && achievements.data && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-primary" />
                      Share Profile
                    </CardTitle>
                    <CardDescription>Download or share your profile card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileCard
                      address={profileAddress!}
                      totalSent={userStats.data.totalSent}
                      totalReceived={userStats.data.totalReceived}
                      tipsSentCount={userStats.data.tipsSentCount}
                      tipsReceivedCount={userStats.data.tipsReceivedCount}
                      achievements={achievements.data}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tip History */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Tip History
                  </CardTitle>
                  <CardDescription>
                    {userTipsList.length > 0
                      ? `${userTipsList.length} tips involving this address`
                      : "No tips found for this address yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userTips.isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <ActivityList tips={userTipsList} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AppShell>
  );
}
