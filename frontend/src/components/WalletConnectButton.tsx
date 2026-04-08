import { useWallet } from "@/contexts/WalletContext";
import { truncatePrincipal } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2, Copy, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function WalletConnectButton() {
  const { connected, principal, network, connecting, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!principal) return;
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    toast({ title: "Address copied to clipboard" });
    setTimeout(() => setCopied(false), 1500);
  }

  if (connecting) {
    return (
      <Button variant="outline" disabled size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting…
      </Button>
    );
  }

  if (connected && principal) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {truncatePrincipal(principal)}
            <Badge variant="secondary" className="ml-1 text-[10px] uppercase">
              {network}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
            <p className="font-mono text-xs break-all text-foreground">{principal}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied!" : "Copy Address"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connect} size="sm" className="gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
