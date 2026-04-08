import { useEffect, useState } from "react";
import { getFeeForAmount, formatStx } from "@/lib/contract";
import { Loader2 } from "lucide-react";

interface FeePreviewProps {
  amount: number;
}

export function FeePreview({ amount }: FeePreviewProps) {
  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!amount || amount <= 0) {
      setFee(null);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      getFeeForAmount(amount).then((f) => {
        setFee(f);
        setLoading(false);
      });
    }, 300); // debounce
    return () => clearTimeout(timer);
  }, [amount]);

  if (!amount || amount <= 0) return null;

  return (
    <div className="rounded-md border bg-muted/50 p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Protocol Fee (1%)</span>
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : (
          <span className="font-mono font-medium">{fee !== null ? `${formatStx(fee)} STX` : "—"}</span>
        )}
      </div>
      {fee !== null && !loading && (
        <div className="flex items-center justify-between mt-1 pt-1 border-t">
          <span className="text-muted-foreground font-medium">Total</span>
          <span className="font-mono font-semibold text-foreground">{formatStx(amount + fee)} STX</span>
        </div>
      )}
    </div>
  );
}
