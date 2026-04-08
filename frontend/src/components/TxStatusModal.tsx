import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { motion } from "framer-motion";

export type TxStatus = "idle" | "pending" | "success" | "error";

interface TxStatusModalProps {
  status: TxStatus;
  txHash?: string;
  errorMessage?: string;
  onClose: () => void;
}

function AnimatedCheckmark() {
  return (
    <motion.svg
      viewBox="0 0 50 50"
      className="h-12 w-12"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="25" cy="25" r="22"
        fill="none"
        stroke="hsl(142, 71%, 45%)"
        strokeWidth="3"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M14 27 L22 35 L38 18"
        fill="none"
        stroke="hsl(142, 71%, 45%)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function AnimatedX() {
  return (
    <motion.svg
      viewBox="0 0 50 50"
      className="h-12 w-12"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="25" cy="25" r="22"
        fill="none"
        stroke="hsl(0, 84%, 60%)"
        strokeWidth="3"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M17 17 L33 33 M33 17 L17 33"
        fill="none"
        stroke="hsl(0, 84%, 60%)"
        strokeWidth="3"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

export function TxStatusModal({ status, txHash, errorMessage, onClose }: TxStatusModalProps) {
  if (status === "idle") return null;

  return (
    <Dialog open onOpenChange={() => status !== "pending" && onClose()}>
      <DialogContent className="sm:max-w-md relative overflow-hidden">
        <ConfettiEffect active={status === "success"} />
        {status === "pending" && (
          <>
            <DialogHeader className="items-center text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="mb-2"
              >
                <Loader2 className="h-12 w-12 text-primary" />
              </motion.div>
              <DialogTitle>Submitting Transaction</DialogTitle>
              <DialogDescription>
                Your tip is being submitted to the Stacks network. This may take a moment…
              </DialogDescription>
            </DialogHeader>
          </>
        )}
        {status === "success" && (
          <>
            <DialogHeader className="items-center text-center">
              <AnimatedCheckmark />
              <DialogTitle className="mt-2">Tip Sent Successfully!</DialogTitle>
              <DialogDescription>
                Your tip has been submitted to the network.
              </DialogDescription>
            </DialogHeader>
            {txHash && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="font-mono text-xs break-all">{txHash}</p>
              </div>
            )}
            <DialogFooter className="sm:justify-center gap-2">
              {txHash && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://explorer.stacks.co/txid/${txHash}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Explorer
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              )}
              <Button onClick={onClose}>Done</Button>
            </DialogFooter>
          </>
        )}
        {status === "error" && (
          <>
            <DialogHeader className="items-center text-center">
              <AnimatedX />
              <DialogTitle className="mt-2">Transaction Failed</DialogTitle>
              <DialogDescription>
                {errorMessage || "An unexpected error occurred. Please try again."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
