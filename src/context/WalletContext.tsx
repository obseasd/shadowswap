"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { TokenSymbol } from "@/lib/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StarknetWallet = any;

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  shortAddress: string;
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
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  shortAddress: "",
  tongoPrivateKey: null,
  setTongoPrivateKey: () => {},
  execute: async () => null,
  balances: { ETH: null, USDC: null, STRK: null },
  refreshBalance: async () => {},
});

declare global {
  interface Window {
    starknet?: StarknetWallet;
    starknet_argentX?: StarknetWallet;
    starknet_braavos?: StarknetWallet;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useState<StarknetWallet | null>(null);
  const [tongoPrivateKey, setTongoPrivateKeyState] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<TokenSymbol, { balance: bigint; pending: bigint } | null>>({
    ETH: null,
    USDC: null,
    STRK: null,
  });

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const setTongoPrivateKey = useCallback((key: string) => {
    setTongoPrivateKeyState(key);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tongo_pk", key);
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window.starknet_argentX || window.starknet_braavos || window.starknet;
      if (!w) {
        window.open("https://www.argent.xyz/argent-x/", "_blank");
        return;
      }
      await w.enable();
      const addr = w.selectedAddress || w.account?.address;
      if (addr) {
        setAddress(addr);
        setWallet(w);
      }
      // Restore tongo key from session
      const savedKey = sessionStorage.getItem("tongo_pk");
      if (savedKey) setTongoPrivateKeyState(savedKey);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWallet(null);
    setTongoPrivateKeyState(null);
    setBalances({ ETH: null, USDC: null, STRK: null });
    sessionStorage.removeItem("tongo_pk");
  }, []);

  const execute = useCallback(
    async (calls: unknown[]): Promise<string | null> => {
      if (!wallet?.account) return null;
      try {
        const result = await wallet.account.execute(calls);
        return result?.transaction_hash || null;
      } catch (err) {
        console.error("Transaction failed:", err);
        return null;
      }
    },
    [wallet]
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
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        shortAddress,
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
