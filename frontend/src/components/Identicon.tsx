import { useMemo } from "react";

interface IdenticonProps {
  principal: string;
  size?: number;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const PALETTE = [
  "hsl(221, 83%, 53%)",  // primary blue
  "hsl(142, 71%, 45%)",  // success green
  "hsl(38, 92%, 50%)",   // warning amber
  "hsl(262, 83%, 58%)",  // violet
  "hsl(0, 84%, 60%)",    // red
  "hsl(199, 89%, 48%)",  // sky
  "hsl(326, 80%, 55%)",  // pink
  "hsl(172, 66%, 50%)",  // teal
];

export function Identicon({ principal, size = 32 }: IdenticonProps) {
  const { bg, initials } = useMemo(() => {
    const hash = hashCode(principal);
    const bg = PALETTE[hash % PALETTE.length];
    const initials = principal.slice(0, 2).toUpperCase();
    return { bg, initials };
  }, [principal]);

  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 font-mono text-[10px] font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: "white",
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}
