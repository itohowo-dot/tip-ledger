// Mock contract integration layer for TipLedger
// All functions simulate chain latency and return realistic mock data

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Tip {
  id: number;
  sender: string;
  recipient: string;
  amount: number; // in microSTX
  message: string;
  tipHeight: number;
  timestamp: number;
}

export interface PlatformStats {
  totalTips: number;
  totalVolume: number; // in STX
  uniqueUsers: number;
}

export interface UserStats {
  totalSent: number;
  totalReceived: number;
  tipsSentCount: number;
  tipsReceivedCount: number;
}

const MOCK_ADDRESSES = [
  "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
  "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
  "SP2C2YFP12AJZB1MADC9IFF2PHXKZMXFY5RQMN23Y",
  "SP31DA6FTSJX2WGTZ69SFY11BH51NZMB0ZW97B5P0",
];

const MOCK_MESSAGES = [
  "Great thread on DeFi composability! 🔥",
  "Thanks for the code review, really helped!",
  "Love your work on the Clarity contracts",
  "Awesome talk at the Stacks conference",
  "Keep building! The community appreciates you",
  "",
  "Solid bug report, saved us hours",
  "Your tutorial on SIP-010 was super clear",
];

function generateMockTips(count: number): Tip[] {
  const tips: Tip[] = [];
  for (let i = 0; i < count; i++) {
    const senderIdx = Math.floor(Math.random() * MOCK_ADDRESSES.length);
    let recipientIdx = Math.floor(Math.random() * MOCK_ADDRESSES.length);
    while (recipientIdx === senderIdx) {
      recipientIdx = Math.floor(Math.random() * MOCK_ADDRESSES.length);
    }
    tips.push({
      id: 1000 + i,
      sender: MOCK_ADDRESSES[senderIdx],
      recipient: MOCK_ADDRESSES[recipientIdx],
      amount: Math.floor(Math.random() * 50 + 1) * 100000, // 0.1 - 5 STX
      message: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
      tipHeight: 150000 + Math.floor(Math.random() * 5000),
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }
  return tips.sort((a, b) => b.timestamp - a.timestamp);
}

const CACHED_TIPS = generateMockTips(50);

export async function getPlatformStats(): Promise<PlatformStats> {
  await delay(600);
  return {
    totalTips: 12847,
    totalVolume: 45231.5,
    uniqueUsers: 3892,
  };
}

export async function getUserStats(principal: string): Promise<UserStats> {
  await delay(500);
  return {
    totalSent: 127.5,
    totalReceived: 342.8,
    tipsSentCount: 48,
    tipsReceivedCount: 156,
  };
}

export async function getFeeForAmount(amount: number): Promise<number> {
  await delay(200);
  // 1% fee, minimum 0.001 STX
  return Math.max(amount * 0.01, 0.001);
}

export async function getRecentTips(page = 0, limit = 10): Promise<{ tips: Tip[]; total: number }> {
  await delay(700);
  const start = page * limit;
  return {
    tips: CACHED_TIPS.slice(start, start + limit),
    total: CACHED_TIPS.length,
  };
}

export async function rewardTip(
  recipient: string,
  amount: number,
  message: string
): Promise<{ txHash: string }> {
  console.log("[analytics] tip_submit_clicked");
  await delay(2000); // Simulate chain submission
  // 10% chance of failure for realism
  if (Math.random() < 0.1) {
    console.log("[analytics] tip_submit_failure");
    throw new Error("Transaction rejected by the network. Please try again.");
  }
  console.log("[analytics] tip_submit_success");
  return {
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
  };
}

export function truncatePrincipal(principal: string, chars = 6): string {
  if (principal.length <= chars * 2 + 3) return principal;
  return `${principal.slice(0, chars)}...${principal.slice(-chars)}`;
}

export function microStxToStx(micro: number): number {
  return micro / 1_000_000;
}

export function formatStx(stx: number): string {
  return stx.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 4 });
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export async function getAchievements(principal: string): Promise<Achievement[]> {
  const [stats, lb] = await Promise.all([getUserStats(principal), getLeaderboard("all")]);
  const top3Sender = lb.topSenders.slice(0, 3).some((e) => e.principal === principal);
  const top3Recipient = lb.topRecipients.slice(0, 3).some((e) => e.principal === principal);

  return [
    { id: "first-tip", label: "First Tip", description: "Sent your first tip", icon: "🎉", unlocked: stats.tipsSentCount >= 1 },
    { id: "100-stx", label: "100 STX Tipped", description: "Tipped a total of 100 STX", icon: "💯", unlocked: stats.totalSent >= 100 },
    { id: "top3-tipper", label: "Top 3 Tipper", description: "Ranked in the top 3 tippers", icon: "🏆", unlocked: top3Sender },
    { id: "generous", label: "Generous Soul", description: "Tipped a total of 500 STX", icon: "💎", unlocked: stats.totalSent >= 500 },
    { id: "community-star", label: "Community Star", description: "Received 100+ tips", icon: "⭐", unlocked: stats.tipsReceivedCount >= 100 },
    { id: "top3-recipient", label: "Top 3 Recipient", description: "Ranked in the top 3 recipients", icon: "👑", unlocked: top3Recipient },
  ];
}

export interface LeaderboardEntry {
  principal: string;
  volume: number; // STX
  count: number;
  rankChange?: number | null; // positive = moved up, negative = moved down, null = new, undefined = n/a
}

const RANGE_MS: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

function aggregate(tips: Tip[], field: "sender" | "recipient") {
  const map = new Map<string, { volume: number; count: number }>();
  for (const tip of tips) {
    const key = tip[field];
    const entry = map.get(key) ?? { volume: 0, count: 0 };
    entry.volume += microStxToStx(tip.amount);
    entry.count++;
    map.set(key, entry);
  }
  return Array.from(map.entries())
    .map(([principal, data]) => ({ principal, ...data }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
}

function applyRankChanges(
  current: { principal: string; volume: number; count: number }[],
  previousTips: Tip[],
  field: "sender" | "recipient"
): LeaderboardEntry[] {
  const prev = aggregate(previousTips, field);
  const prevRankMap = new Map(prev.map((e, i) => [e.principal, i + 1]));
  return current.map((entry, i) => {
    const currentRank = i + 1;
    const prevRank = prevRankMap.get(entry.principal);
    return {
      ...entry,
      rankChange: prevRank === undefined ? null : prevRank - currentRank,
    };
  });
}

export async function getLeaderboard(range: string = "all"): Promise<{ topSenders: LeaderboardEntry[]; topRecipients: LeaderboardEntry[] }> {
  await delay(600);
  const rangeMs = RANGE_MS[range];
  const cutoff = range === "all" ? 0 : Date.now() - (rangeMs ?? 0);
  const filtered = cutoff ? CACHED_TIPS.filter((t) => t.timestamp >= cutoff) : CACHED_TIPS;

  const currentSenders = aggregate(filtered, "sender");
  const currentRecipients = aggregate(filtered, "recipient");

  if (range === "all" || !rangeMs) {
    return {
      topSenders: currentSenders.map((e) => ({ ...e })),
      topRecipients: currentRecipients.map((e) => ({ ...e })),
    };
  }

  const prevCutoff = cutoff - rangeMs;
  const prevFiltered = CACHED_TIPS.filter((t) => t.timestamp >= prevCutoff && t.timestamp < cutoff);

  return {
    topSenders: applyRankChanges(currentSenders, prevFiltered, "sender"),
    topRecipients: applyRankChanges(currentRecipients, prevFiltered, "recipient"),
  };
}
