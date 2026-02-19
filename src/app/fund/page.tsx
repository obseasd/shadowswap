"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowDown, Eye, EyeOff, Loader2, ChevronDown, Info } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", balance: "2.4500", confidentialBalance: "***" },
  { symbol: "USDC", name: "USD Coin", icon: "$", balance: "5,000.00", confidentialBalance: "***" },
  { symbol: "STRK", name: "Starknet", icon: "S", balance: "12,350.00", confidentialBalance: "***" },
];

type Mode = "fund" | "withdraw";

export default function FundPage() {
  const { isConnected, connect } = useWallet();
  const [mode, setMode] = useState<Mode>("fund");
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [revealedBalances, setRevealedBalances] = useState<Record<string, boolean>>({});
  const [txComplete, setTxComplete] = useState(false);

  const handleProcess = async () => {
    if (!amount || !isConnected) return;
    setIsProcessing(true);
    setTxComplete(false);
    // Simulate transaction
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    setTxComplete(true);
    setShowEncrypted(true);
    setTimeout(() => setTxComplete(false), 3000);
  };

  const toggleReveal = (symbol: string) => {
    setRevealedBalances((prev) => ({ ...prev, [symbol]: !prev[symbol] }));
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-4">
            <Lock className="w-3.5 h-3.5" />
            Tongo Encryption
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {mode === "fund" ? "Fund Confidential Account" : "Withdraw to ERC-20"}
          </h1>
          <p className="text-muted">
            {mode === "fund"
              ? "Convert standard tokens to encrypted confidential balances"
              : "Convert confidential balances back to standard ERC-20 tokens"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border mb-6">
          {(["fund", "withdraw"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setAmount(""); setTxComplete(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {m === "fund" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {m === "fund" ? "Encrypt (Fund)" : "Decrypt (Withdraw)"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
          {/* Token Select */}
          <div>
            <label className="text-sm text-muted mb-2 block">
              {mode === "fund" ? "Token to encrypt" : "Confidential token to decrypt"}
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-light border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary-light">
                    {selectedToken.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{selectedToken.symbol}</div>
                    <div className="text-sm text-muted">{selectedToken.name}</div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-muted" />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 w-full mt-2 rounded-xl bg-surface border border-border shadow-xl overflow-hidden"
                  >
                    {tokens.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => { setSelectedToken(token); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-surface-light transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary-light">
                          {token.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{token.symbol}</div>
                          <div className="text-sm text-muted">{token.name}</div>
                        </div>
                        <div className="ml-auto text-sm text-muted">{token.balance}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Amount</span>
              <span className="text-muted">
                Balance: {mode === "fund" ? selectedToken.balance : "*** ENCRYPTED ***"}{" "}
                {selectedToken.symbol}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 pr-20 rounded-xl bg-surface-light border border-border text-2xl font-mono focus:outline-none focus:border-primary/50 transition-all"
              />
              <button
                onClick={() => setAmount(selectedToken.balance.replace(",", ""))}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-surface-light border border-border flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Output */}
          <div className="p-4 rounded-xl bg-surface-light border border-border">
            <div className="text-sm text-muted mb-1">
              {mode === "fund" ? "You receive (encrypted)" : "You receive (decrypted)"}
            </div>
            <AnimatePresence mode="wait">
              {showEncrypted && mode === "fund" ? (
                <motion.div
                  key="encrypted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-mono text-primary-light">*** ENCRYPTED ***</span>
                </motion.div>
              ) : (
                <motion.div
                  key="plain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-mono text-muted"
                >
                  {amount || "0.00"} {selectedToken.symbol}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted">
              {mode === "fund"
                ? "Your tokens will be encrypted using ElGamal encryption via the Tongo protocol. Only you can decrypt and view your actual balance."
                : "Your encrypted balance will be decrypted and converted back to standard ERC-20 tokens."}
            </p>
          </div>

          {/* Action Button */}
          {isConnected ? (
            <button
              onClick={handleProcess}
              disabled={!amount || isProcessing}
              className="w-full py-4 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === "fund" ? "Encrypting..." : "Decrypting..."}
                </>
              ) : txComplete ? (
                <>✓ {mode === "fund" ? "Encrypted Successfully" : "Decrypted Successfully"}</>
              ) : (
                <>
                  {mode === "fund" ? (
                    <><Lock className="w-5 h-5" /> Encrypt & Fund</>
                  ) : (
                    <><Unlock className="w-5 h-5" /> Decrypt & Withdraw</>
                  )}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={connect}
              className="w-full py-4 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Confidential Balances */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Your Confidential Balances</h2>
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary-light">
                    {token.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-sm text-muted">{token.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono">
                      {revealedBalances[token.symbol] ? (
                        <span className="text-primary-light">{token.balance}</span>
                      ) : (
                        <span className="text-muted">*** ENCRYPTED ***</span>
                      )}
                    </div>
                    <div className="text-xs text-muted">
                      {revealedBalances[token.symbol] ? "Decrypted locally" : "ElGamal encrypted"}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleReveal(token.symbol)}
                    className="p-2 rounded-lg bg-surface-light hover:bg-primary/10 transition-colors"
                  >
                    {revealedBalances[token.symbol] ? (
                      <EyeOff className="w-4 h-4 text-muted" />
                    ) : (
                      <Eye className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
