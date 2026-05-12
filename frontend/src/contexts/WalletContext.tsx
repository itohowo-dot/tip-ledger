import React, { createContext, useContext, useState, useCallback } from "react";

export interface WalletState {
  connected: boolean;
  principal: string | null;
  network: "mainnet" | "testnet";
  connecting: boolean;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const MOCK_PRINCIPAL = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    principal: null,
    network: "testnet",
    connecting: false,
  });

  const connect = useCallback(async () => {
    console.log("[analytics] wallet_connect_clicked");
    setState((s) => ({ ...s, connecting: true }));
    // Simulate wallet connection delay
    await new Promise((r) => setTimeout(r, 1200));
    setState({
      connected: true,
      principal: MOCK_PRINCIPAL,
      network: "testnet",
      connecting: false,
    });
    console.log("[analytics] wallet_connected");
  }, []);

  const disconnect = useCallback(() => {
    setState({
      connected: false,
      principal: null,
      network: "testnet",
      connecting: false,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
