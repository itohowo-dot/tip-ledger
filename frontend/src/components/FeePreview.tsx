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