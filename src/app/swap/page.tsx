"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Lock, Settings, Loader2, ChevronDown, Info, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
  { symbol: "USDC", name: "USD Coin", icon: "$" },
  { symbol: "STRK", name: "Starknet", icon: "S" },
];

interface SwapTx {
  id: string;
  from: string;
  to: string;
  amountIn: string;
  amountOut: string;
  time: string;
  hash: string;
  revealed: boolean;
}

export default function SwapPage() {
  const { isConnected, connect } = useWallet();
  const [tokenIn, setTokenIn] = useState(tokens[0]);
  const [tokenOut, setTokenOut] = useState(tokens[1]);
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapComplete, setSwapComplete] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"in" | "out" | null>(null);

  const [history, setHistory] = useState<SwapTx[]>([
    {
      id: "1",
      from: "ETH",
      to: "USDC",
      amountIn: "1.5",
      amountOut: "3,247.50",
      time: "2 min ago",
      hash: "0x7a3f...e912",
      revealed: false,
    },
    {
      id: "2",
      from: "STRK",
      to: "ETH",
      amountIn: "5,000",
      amountOut: "0.82",
      time: "15 min ago",
      hash: "0x4b2c...a3f1",
      revealed: false,
    },
  ]);

  const estimatedOut = amountIn ? (parseFloat(amountIn) * 2165).toFixed(2) : "";

  const flipTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
  };

  const handleSwap = async () => {
    if (!amountIn || !isConnected) return;
    setIsSwapping(true);
    setSwapComplete(false);
    await new Promise((r) => setTimeout(r, 3000));
    setIsSwapping(false);
    setSwapComplete(true);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        from: tokenIn.symbol,
        to: tokenOut.symbol,
        amountIn: amountIn,
        amountOut: estimatedOut,
        time: "Just now",
        hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        revealed: false,
      },
      ...prev,
    ]);
    setTimeout(() => { setSwapComplete(false); setAmountIn(""); }, 2000);
  };

  const toggleRevealTx = (id: string) => {
    setHistory((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, revealed: !tx.revealed } : tx))
    );
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-4">
            <Lock className="w-3.5 h-3.5" />
            Private Swap
          </div>
          <h1 className="text-3xl font-bold mb-2">Shadow Swap</h1>
          <p className="text-muted">
            Swap tokens with encrypted amounts — invisible on-chain
          </p>
        </div>

        {/* Swap Card */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-3">
          {/* Settings */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors"
            >
              <Settings className="w-5 h-5 text-muted" />
            </button>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-3 border-b border-border"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Slippage Tolerance</span>
                  <div className="flex gap-2">
                    {["0.1", "0.5", "1.0"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSlippage(val)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          slippage === val
                            ? "bg-primary text-white"
                            : "bg-surface-light text-muted hover:text-foreground"
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Token In */}
          <div className="p-4 rounded-xl bg-surface-light border border-border">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>You pay</span>
              <span>Confidential balance</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="0.00"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className="flex-1 text-3xl font-mono bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setSelectingFor("in")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary-light">
                  {tokenIn.icon}
                </div>
                <span className="font-semibold">{tokenIn.symbol}</span>
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>
            </div>
          </div>

          {/* Flip Button */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              onClick={flipTokens}
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all group"
            >
              <ArrowUpDown className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Token Out */}
          <div className="p-4 rounded-xl bg-surface-light border border-border">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>You receive</span>
              <span>Estimated</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary shrink-0" />
                <span className="text-3xl font-mono text-muted">
                  {estimatedOut ? `≈${estimatedOut}` : "0.00"}
                </span>
              </div>
              <button
                onClick={() => setSelectingFor("out")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary-light">
                  {tokenOut.icon}
                </div>
                <span className="font-semibold">{tokenOut.symbol}</span>
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>
            </div>
          </div>

          {/* Token Selector Dropdown */}
          <AnimatePresence>
            {selectingFor && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="rounded-xl bg-surface border border-border shadow-xl overflow-hidden"
              >
                {tokens
                  .filter((t) =>
                    selectingFor === "in" ? t.symbol !== tokenOut.symbol : t.symbol !== tokenIn.symbol
                  )
                  .map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => {
                        if (selectingFor === "in") setTokenIn(token);
                        else setTokenOut(token);
                        setSelectingFor(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-surface-light transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary-light">
                        {token.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-sm text-muted">{token.name}</div>
                      </div>
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swap Info */}
          {amountIn && (
            <div className="space-y-2 p-3 rounded-lg bg-surface-light/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Rate</span>
                <span>1 {tokenIn.symbol} ≈ 2,165 {tokenOut.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Slippage</span>
                <span>{slippage}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Privacy</span>
                <span className="text-primary-light flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Amount encrypted
                </span>
              </div>
            </div>
          )}

          {/* Privacy Info */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted">
              Swap amounts are encrypted via Tongo protocol. On-chain observers cannot see how much you traded.
            </p>
          </div>

          {/* Action Button */}
          {isConnected ? (
            <button
              onClick={handleSwap}
              disabled={!amountIn || isSwapping}
              className="w-full py-4 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSwapping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Executing Private Swap...
                </>
              ) : swapComplete ? (
                <>✓ Swap Complete (Encrypted)</>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Private Swap
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

        {/* Swap History */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Swaps</h2>
          <div className="space-y-3">
            {history.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {tx.from} → {tx.to}
                    </div>
                    <div className="text-sm text-muted">{tx.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {tx.revealed ? (
                      <>
                        <div className="text-sm text-primary-light font-mono">
                          -{tx.amountIn} {tx.from}
                        </div>
                        <div className="text-sm text-success font-mono">
                          +{tx.amountOut} {tx.to}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted font-mono">*** ENCRYPTED ***</div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleRevealTx(tx.id)}
                    className="p-2 rounded-lg bg-surface-light hover:bg-primary/10 transition-colors"
                  >
                    {tx.revealed ? (
                      <EyeOff className="w-4 h-4 text-muted" />
                    ) : (
                      <Eye className="w-4 h-4 text-primary" />
                    )}
                  </button>
                  <a
                    href="#"
                    className="p-2 rounded-lg bg-surface-light hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
