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