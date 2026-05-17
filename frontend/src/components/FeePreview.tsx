import { useEffect, useState } from "react";
import { getFeeForAmount, formatStx } from "@/lib/contract";
import { Loader2 } from "lucide-react";

interface FeePreviewProps {
  amount: number;
}