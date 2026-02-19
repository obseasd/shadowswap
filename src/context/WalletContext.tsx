"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  shortAddress: string;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  shortAddress: "",
});

declare global {
  interface Window {
    starknet?: {
      enable: () => Promise<string[]>;
      selectedAddress?: string;
      account?: { address: string };
      isConnected?: boolean;
    };
    starknet_argentX?: {
      enable: () => Promise<string[]>;
      selectedAddress?: string;
      account?: { address: string };
      isConnected?: boolean;
    };
    starknet_braavos?: {
      enable: () => Promise<string[]>;
      selectedAddress?: string;
      account?: { address: string };
      isConnected?: boolean;
    };
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const wallet =
        window.starknet_argentX ||
        window.starknet_braavos ||
        window.starknet;

      if (!wallet) {
        window.open("https://www.argent.xyz/argent-x/", "_blank");
        return;
      }

      await wallet.enable();
      const addr = wallet.selectedAddress || wallet.account?.address;
      if (addr) {
        setAddress(addr);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, isConnected: !!address, isConnecting, connect, disconnect, shortAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
