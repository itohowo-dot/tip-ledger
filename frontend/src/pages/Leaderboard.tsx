import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Identicon } from "@/components/Identicon";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLeaderboard, truncatePrincipal, formatStx, type LeaderboardEntry } from "@/lib/contract";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/hooks/use-toast";
import { Trophy, Share2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TIME_RANGES = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "all", label: "All Time" },
];

const RANGE_SUBTITLES: Record<string, string> = {
  "24h": "last 24 hours",
  "7d": "last 7 days",
  "30d": "last 30 days",
  "all": "all time",
};

const RANK_COLORS: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  2: "bg-gray-300/20 text-gray-600 dark:text-gray-300 border-gray-400/30",
  3: "bg-amber-700/20 text-amber-700 dark:text-amber-400 border-amber-700/30",
};

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <Badge className={`${RANK_COLORS[rank]} font-bold text-xs tabular-nums w-7 justify-center`}>
        {rank}
      </Badge>
    );
  }
  return <span className="text-muted-foreground text-sm tabular-nums w-7 text-center inline-block">{rank}</span>;
}

function RankChangeIndicator({ change }: { change?: number | null }) {
  if (change === undefined) return null;

  if (change === null) {
    return (
      <span className="inline-flex items-center text-[10px] font-semibold text-blue-500 dark:text-blue-400 ml-1">
        NEW
      </span>
    );
  }

  if (change > 0) {
    return (
      <span className="inline-flex items-center text-[10px] font-semibold text-green-600 dark:text-green-400 ml-1">
        <ArrowUp className="h-3 w-3" />
        {change}
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="inline-flex items-center text-[10px] font-semibold text-destructive ml-1">
        <ArrowDown className="h-3 w-3" />
        {Math.abs(change)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-[10px] text-muted-foreground ml-1">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function LeaderboardTable({ title, entries, loading, showRankChange }: { title: string; entries: LeaderboardEntry[]; loading: boolean; showRankChange: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-6">#</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right pr-6">Tips</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-5 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : entries.map((entry, i) => (
                  <motion.tr
                    key={entry.principal}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center">
                        <RankBadge rank={i + 1} />
                        {showRankChange && <RankChangeIndicator change={entry.rankChange} />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/profile/${entry.principal}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Identicon principal={entry.principal} size={24} />
                        <span className="font-mono text-xs hover:text-primary transition-colors">{truncatePrincipal(entry.principal, 5)}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatStx(entry.volume)} STX
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground pr-6 tabular-nums">
                      {entry.count}
                    </TableCell>
                  </motion.tr>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Leaderboard() {
  const [timeRange, setTimeRange] = useState("all");
  const { connected, principal } = useWallet();
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", timeRange],
    queryFn: () => getLeaderboard(timeRange),
    refetchInterval: 15000, // Real-time updates every 15s
  });

  const showRankChange = timeRange !== "all";

  async function handleShareRank() {
    if (!principal || !data) return;

    const senderIdx = data.topSenders.findIndex((e) => e.principal === principal);
    const recipientIdx = data.topRecipients.findIndex((e) => e.principal === principal);

    let text: string;
    if (senderIdx >= 0) {
      const entry = data.topSenders[senderIdx];
      text = `I'm ranked #${senderIdx + 1} tipper on TipLedger with ${formatStx(entry.volume)} STX tipped (${RANGE_SUBTITLES[timeRange]})! 🏆 #TipLedger #Stacks`;
    } else if (recipientIdx >= 0) {
      const entry = data.topRecipients[recipientIdx];
      text = `I'm ranked #${recipientIdx + 1} recipient on TipLedger with ${formatStx(entry.volume)} STX received (${RANGE_SUBTITLES[timeRange]})! 🏆 #TipLedger #Stacks`;
    } else {
      text = `I haven't made the TipLedger leaderboard yet — time to start tipping! 🚀 #TipLedger #Stacks`;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!", description: "Share your rank on social media." });
    } catch {
      toast({ title: "Couldn't copy", description: text, variant: "destructive" });
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Top tippers and recipients — {RANGE_SUBTITLES[timeRange]}</p>
          </div>
          <div className="flex items-center gap-2">
            {connected && (
              <Button variant="outline" size="sm" onClick={handleShareRank} disabled={isLoading} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share My Rank
              </Button>
            )}
            <Tabs value={timeRange} onValueChange={setTimeRange}>
              <TabsList>
                {TIME_RANGES.map((r) => (
                  <TabsTrigger key={r.value} value={r.value} className="text-xs px-3">
                    {r.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <LeaderboardTable title="Top Tippers" entries={data?.topSenders ?? []} loading={isLoading} showRankChange={showRankChange} />
          <LeaderboardTable title="Top Recipients" entries={data?.topRecipients ?? []} loading={isLoading} showRankChange={showRankChange} />
        </div>
      </div>
    </AppShell>
  );
}
