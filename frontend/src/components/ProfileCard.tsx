import { useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Identicon } from "@/components/Identicon";
import { truncatePrincipal, formatStx, type Achievement } from "@/lib/contract";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileCardProps {
  address: string;
  totalSent: number;
  totalReceived: number;
  tipsSentCount: number;
  tipsReceivedCount: number;
  achievements: Achievement[];
}

export function ProfileCard({
  address,
  totalSent,
  totalReceived,
  tipsSentCount,
  tipsReceivedCount,
  achievements,
}: ProfileCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCard = useCallback((): HTMLCanvasElement | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const W = 800;
    const H = 420;
    const dpr = 2;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(0.5, "#1e293b");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.roundRect(0, 0, W, H, 16);
    ctx.stroke();

    // Decorative circles
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(W - 80, 80, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, H - 60, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // TipLedger brand
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("TipLedger", 32, 40);

    // Address
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 22px 'SF Mono', 'Fira Code', monospace, system-ui";
    ctx.fillText(truncatePrincipal(address, 10), 32, 80);

    // Stats grid
    const stats = [
      { label: "Total Sent", value: `${formatStx(totalSent)} STX` },
      { label: "Total Received", value: `${formatStx(totalReceived)} STX` },
      { label: "Tips Sent", value: tipsSentCount.toString() },
      { label: "Tips Received", value: tipsReceivedCount.toString() },
    ];

    const statY = 120;
    const statW = 170;
    stats.forEach((stat, i) => {
      const x = 32 + i * statW;

      // Stat card background
      ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
      ctx.beginPath();
      ctx.roundRect(x, statY, statW - 16, 80, 10);
      ctx.fill();

      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, statY, statW - 16, 80, 10);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 11px system-ui, -apple-system, sans-serif";
      ctx.fillText(stat.label, x + 12, statY + 26);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
      ctx.fillText(stat.value, x + 12, statY + 56);
    });

    // Achievements section
    const achY = 230;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 12px system-ui, -apple-system, sans-serif";
    ctx.fillText("ACHIEVEMENTS", 32, achY);

    const unlocked = achievements.filter((a) => a.unlocked);
    const locked = achievements.filter((a) => !a.unlocked);

    let achX = 32;
    const badgeH = 36;
    const gap = 10;

    [...unlocked, ...locked].forEach((badge) => {
      const text = `${badge.icon} ${badge.label}`;
      ctx.font = "500 12px system-ui, -apple-system, sans-serif";
      const textWidth = ctx.measureText(text).width + 24;

      if (achX + textWidth > W - 32) return; // don't overflow

      if (badge.unlocked) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
        ctx.beginPath();
        ctx.roundRect(achX, achY + 12, textWidth, badgeH, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(achX, achY + 12, textWidth, badgeH, 8);
        ctx.stroke();
        ctx.fillStyle = "#f8fafc";
      } else {
        ctx.fillStyle = "rgba(30, 41, 59, 0.5)";
        ctx.beginPath();
        ctx.roundRect(achX, achY + 12, textWidth, badgeH, 8);
        ctx.fill();
        ctx.fillStyle = "#475569";
      }

      ctx.font = "500 12px system-ui, -apple-system, sans-serif";
      ctx.fillText(text, achX + 12, achY + 12 + badgeH / 2 + 4);

      achX += textWidth + gap;
    });

    // Footer
    ctx.fillStyle = "#475569";
    ctx.font = "400 11px system-ui, -apple-system, sans-serif";
    ctx.fillText("Built on Stacks • tipl.ink", 32, H - 24);

    // Unlocked count
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    const countText = `${unlocked.length}/${achievements.length} unlocked`;
    const countW = ctx.measureText(countText).width;
    ctx.fillText(countText, W - 32 - countW, H - 24);

    return canvas;
  }, [address, totalSent, totalReceived, tipsSentCount, tipsReceivedCount, achievements]);

  function handleDownload() {
    const canvas = generateCard();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `tipledger-${truncatePrincipal(address, 4)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Profile card downloaded!");
  }

  async function handleShare() {
    const canvas = generateCard();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "tipledger-profile.png", { type: "image/png" });
        try {
          await navigator.share({
            title: "My TipLedger Profile",
            text: `Check out my TipLedger stats! ${formatStx(totalSent)} STX tipped 🏆`,
            files: [file],
          });
          return;
        } catch {
          // fallback below
        }
      }

      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Profile card copied to clipboard!");
      } catch {
        handleDownload();
      }
    }, "image/png");
  }

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full rounded-xl border border-border/50 hidden" />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 flex-1">
          <Download className="h-4 w-4" />
          Download Card
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 flex-1">
          <Share2 className="h-4 w-4" />
          Share Card
        </Button>
      </div>
    </div>
  );
}
