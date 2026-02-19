"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import type { TokenSymbol } from "@/lib/constants";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  shortAddress: string;
  // starknet-react connect
  connect: () => void;
  connectors: ReturnType<typeof useConnect>["connectors"];
  connectWallet: ReturnType<typeof useConnect>["connect"];
  disconnect: () => void;
  isPending: boolean;
  showWalletModal: boolean;
  setShowWalletModal: (v: boolean) => void;
  // Tongo key management
  tongoPrivateKey: string | null;
  setTongoPrivateKey: (key: string) => void;
  // Execute transactions via connected wallet
  execute: (calls: unknown[]) => Promise<string | null>;
  // Balances
  balances: Record<TokenSymbol, { balance: bigint; pending: bigint } | null>;
  refreshBalance: (token: TokenSymbol) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  shortAddress: "",
  connect: () => {},
  connectors: [],
  connectWallet: () => {},
  disconnect: () => {},
  isPending: false,
  showWalletModal: false,
  setShowWalletModal: () => {},
  tongoPrivateKey: null,
  setTongoPrivateKey: () => {},
  execute: async () => null,
  balances: { ETH: null, USDC: null, STRK: null },
  refreshBalance: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address: rawAddress, account, isConnected } = useAccount();
  const { connect: connectWallet, connectors, isPending } = useConnect();
  const { disconnect: starknetDisconnect } = useDisconnect();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [tongoPrivateKey, setTongoPrivateKeyState] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<TokenSymbol, { balance: bigint; pending: bigint } | null>>({
    ETH: null,
    USDC: null,
    STRK: null,
  });

  const address = rawAddress ?? null;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const setTongoPrivateKey = useCallback((key: string) => {
    setTongoPrivateKeyState(key);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tongo_pk", key);
    }
  }, []);

  // Restore tongo key from session on mount
  React.useEffect(() => {
    if (isConnected && !tongoPrivateKey) {
      const savedKey = sessionStorage.getItem("tongo_pk");
      if (savedKey) setTongoPrivateKeyState(savedKey);
    }
  }, [isConnected, tongoPrivateKey]);

  const disconnect = useCallback(() => {
    starknetDisconnect();
    setTongoPrivateKeyState(null);
    setBalances({ ETH: null, USDC: null, STRK: null });
    sessionStorage.removeItem("tongo_pk");
  }, [starknetDisconnect]);

  const execute = useCallback(
    async (calls: unknown[]): Promise<string | null> => {
      if (!account) return null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await account.execute(calls as any);
        return result?.transaction_hash || null;
      } catch (err) {
        console.error("Transaction failed:", err);
        return null;
      }
    },
    [account]
  );

  const refreshBalance = useCallback(
    async (token: TokenSymbol) => {
      if (!tongoPrivateKey) return;
      try {
        const { getAccountState } = await import("@/lib/tongo");
        const state = await getAccountState(tongoPrivateKey, token);
        setBalances((prev) => ({
          ...prev,
          [token]: { balance: state.balance, pending: state.pending },
        }));
      } catch (err) {
        console.error(`Failed to fetch ${token} balance:`, err);
      }
    },
    [tongoPrivateKey]
  );

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!isConnected,
        shortAddress,
        connect: () => setShowWalletModal(true),
        connectors,
        connectWallet,
        disconnect,
        isPending,
        showWalletModal,
        setShowWalletModal,
        tongoPrivateKey,
        setTongoPrivateKey,
        execute,
        balances,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
