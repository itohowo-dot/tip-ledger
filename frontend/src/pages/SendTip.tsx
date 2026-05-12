import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FeePreview } from "@/components/FeePreview";
import { TxStatusModal, TxStatus } from "@/components/TxStatusModal";
import { useWallet } from "@/contexts/WalletContext";
import { rewardTip } from "@/lib/contract";
import { Send, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const PRINCIPAL_REGEX = /^SP[A-Z0-9]{38,40}$/;

export default function SendTipPage() {
  const { connected, principal, connect } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [txError, setTxError] = useState<string>();

  const amountNum = parseFloat(amount) || 0;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!recipient.trim()) {
      errs.recipient = "Recipient is required";
    } else if (!PRINCIPAL_REGEX.test(recipient.trim())) {
      errs.recipient = "Invalid Stacks principal format";
    } else if (principal && recipient.trim() === principal) {
      errs.recipient = "You cannot tip yourself";
    }
    if (!amount || amountNum <= 0) {
      errs.amount = "Amount must be greater than 0";
    }
    if (message.length > 280) {
      errs.message = "Message must be 280 characters or less";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setTxStatus("pending");
    setTxHash(undefined);
    setTxError(undefined);
    try {
      const result = await rewardTip(recipient.trim(), amountNum, message);
      setTxHash(result.txHash);
      setTxStatus("success");
      // Reset form on success
      setRecipient("");
      setAmount("");
      setMessage("");
      setErrors({});
    } catch (err: any) {
      setTxError(err.message);
      setTxStatus("error");
    }
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send a Tip
              </CardTitle>
              <CardDescription>
                Send STX to anyone in the Stacks ecosystem with an optional message.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!connected ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect your wallet to send tips</p>
                  <Button onClick={connect} className="gap-2">
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="SP2J6ZY48GV1EZ5V2V5RB..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="font-mono text-sm"
                      aria-describedby={errors.recipient ? "recipient-error" : undefined}
                    />
                    {errors.recipient && (
                      <p id="recipient-error" className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.recipient}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (STX)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.000001"
                      min="0"
                      placeholder="0.5"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="font-mono"
                      aria-describedby={errors.amount ? "amount-error" : undefined}
                    />
                    {errors.amount && (
                      <p id="amount-error" className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <FeePreview amount={amountNum} />

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Great work on that PR! 🎉"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      maxLength={280}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {errors.message ? (
                        <p id="message-error" className="text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span>{message.length}/280</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    <Send className="h-4 w-4" />
                    Send Tip
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <TxStatusModal
        status={txStatus}
        txHash={txHash}
        errorMessage={txError}
        onClose={() => setTxStatus("idle")}
      />
    </AppShell>
  );
}
