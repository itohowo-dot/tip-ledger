import { Tip, truncatePrincipal, microStxToStx, formatStx } from "@/lib/contract";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Identicon } from "@/components/Identicon";
import { ArrowRight, MessageSquare, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function CopyablePrincipal({ principal }: { principal: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    toast({ title: "Address copied", description: truncatePrincipal(principal, 8) });
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group/copy"
      title="Click to copy"
    >
      <span>{truncatePrincipal(principal)}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-60 transition-opacity" />
      )}
    </button>
  );
}

interface ActivityListProps {
  tips: Tip[];
  loading?: boolean;
}

export function ActivityList({ tips, loading }: ActivityListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-5 w-16" />
              </div>
              <Skeleton className="mt-2 h-3 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <MessageSquare className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No tips yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Be the first to send a tip! Connect your wallet and show appreciation to someone in the Stacks community.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tips.map((tip, i) => (
        <motion.div
          key={tip.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
        >
          <Card className="hover:shadow-md hover:border-primary/20 transition-all duration-150 group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Link to={`/profile/${tip.sender}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <Identicon principal={tip.sender} size={28} />
                </Link>
                <CopyablePrincipal principal={tip.sender} />
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                <Link to={`/profile/${tip.recipient}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <Identicon principal={tip.recipient} size={28} />
                </Link>
                <CopyablePrincipal principal={tip.recipient} />
                <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-mono text-sm font-semibold whitespace-nowrap">
                  {formatStx(microStxToStx(tip.amount))} STX
                </span>
              </div>
              {tip.message && (
                <p className="mt-2 text-sm text-muted-foreground truncate pl-10">
                  "{tip.message}"
                </p>
              )}
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground pl-10">
                <span>Tip #{tip.id}</span>
                <span>Block {tip.tipHeight.toLocaleString()}</span>
                <span className="ml-auto">{timeAgo(tip.timestamp)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
