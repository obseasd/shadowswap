"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Lock, Settings, Loader2, ChevronDown, Eye, EyeOff, ExternalLink, X } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import TokenIcon from "@/components/TokenIcon";

const tokens = [
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "STRK", name: "Starknet Token" },
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
    { id: "1", from: "ETH", to: "USDC", amountIn: "1.5", amountOut: "3,247.50", time: "2 min ago", hash: "0x7a3f...e912", revealed: false },
    { id: "2", from: "STRK", to: "ETH", amountIn: "5,000", amountOut: "0.82", time: "15 min ago", hash: "0x4b2c...a3f1", revealed: false },
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
    await new Promise((r) => setTimeout(r, 2500));
    setIsSwapping(false);
    setSwapComplete(true);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        from: tokenIn.symbol,
        to: tokenOut.symbol,
        amountIn,
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
    setHistory((prev) => prev.map((tx) => (tx.id === id ? { ...tx, revealed: !tx.revealed } : tx)));
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center px-4 pt-8 sm:pt-16 pb-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h1 className="text-lg font-semibold">Swap</h1>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-xl hover:bg-surface transition-colors">
            <Settings className={`w-[18px] h-[18px] ${showSettings ? "text-primary" : "text-text-secondary"}`} />
          </button>
        </div>

        {/* Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-3 overflow-hidden">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Slippage</span>
                  <div className="flex gap-1.5">
                    {["0.1", "0.5", "1.0"].map((val) => (
                      <button key={val} onClick={() => setSlippage(val)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${slippage === val ? "bg-primary-soft text-primary" : "bg-surface-2 text-text-secondary hover:text-foreground"}`}>
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap card */}
        <div className="rounded-3xl bg-surface border border-border p-1.5">
          {/* Pay */}
          <div className="rounded-2xl bg-surface-2 p-4 sm:p-5">
            <div className="text-sm text-text-tertiary mb-2">You pay</div>
            <div className="flex items-center gap-3">
              <input type="number" inputMode="decimal" placeholder="0" value={amountIn} onChange={(e) => setAmountIn(e.target.value)}
                className="flex-1 text-[32px] sm:text-4xl font-medium bg-transparent focus:outline-none placeholder-text-tertiary min-w-0" />
              <button onClick={() => setSelectingFor("in")}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface hover:bg-surface-hover border border-border transition-colors shrink-0">
                <TokenIcon symbol={tokenIn.symbol} size="sm" />
                <span className="text-[15px] font-semibold">{tokenIn.symbol}</span>
                <ChevronDown className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
          </div>

          {/* Flip */}
          <div className="flex justify-center -my-3 relative z-10">
            <button onClick={flipTokens}
              className="w-9 h-9 rounded-xl bg-surface border-[3px] border-background flex items-center justify-center hover:bg-surface-hover transition-colors group">
              <ArrowDown className="w-4 h-4 text-text-secondary group-hover:text-foreground transition-colors" />
            </button>
          </div>

          {/* Receive */}
          <div className="rounded-2xl bg-surface-2 p-4 sm:p-5">
            <div className="text-sm text-text-tertiary mb-2">You receive</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {estimatedOut && <Lock className="w-4 h-4 text-primary shrink-0" />}
                <span className={`text-[32px] sm:text-4xl font-medium truncate ${estimatedOut ? "" : "text-text-tertiary"}`}>
                  {estimatedOut || "0"}
                </span>
              </div>
              <button onClick={() => setSelectingFor("out")}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface hover:bg-surface-hover border border-border transition-colors shrink-0">
                <TokenIcon symbol={tokenOut.symbol} size="sm" />
                <span className="text-[15px] font-semibold">{tokenOut.symbol}</span>
                <ChevronDown className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
          </div>
        </div>

        {/* Rate */}
        {amountIn && (
          <div className="mt-3 p-4 rounded-2xl bg-surface border border-border space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Rate</span><span>1 {tokenIn.symbol} = 2,165 {tokenOut.symbol}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Slippage</span><span>{slippage}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Privacy</span><span className="flex items-center gap-1 text-primary"><Lock className="w-3.5 h-3.5" /> Encrypted</span></div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={isConnected ? handleSwap : connect}
          disabled={isConnected && (!amountIn || isSwapping)}
          className={`w-full mt-3 py-4 rounded-2xl text-[17px] font-semibold transition-colors flex items-center justify-center gap-2 ${
            !isConnected ? "bg-primary-soft text-primary hover:bg-primary/20"
              : !amountIn ? "bg-surface-2 text-text-tertiary cursor-not-allowed"
              : swapComplete ? "bg-success/15 text-success"
              : "bg-primary hover:bg-primary-hover text-white"
          } disabled:opacity-60`}
        >
          {isSwapping ? (<><Loader2 className="w-5 h-5 animate-spin" /> Swapping...</>)
            : swapComplete ? "Swap successful"
            : !isConnected ? "Connect Wallet"
            : !amountIn ? "Enter an amount"
            : "Swap"}
        </button>
      </motion.div>

      {/* Token modal */}
      <AnimatePresence>
        {selectingFor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectingFor(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="w-full max-w-[400px] rounded-3xl bg-surface border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select token</h3>
                <button onClick={() => setSelectingFor(null)} className="p-1.5 rounded-xl hover:bg-surface-2 transition-colors"><X className="w-5 h-5 text-text-secondary" /></button>
              </div>
              <div className="space-y-1">
                {tokens.filter((t) => (selectingFor === "in" ? t.symbol !== tokenOut.symbol : t.symbol !== tokenIn.symbol)).map((token) => (
                  <button key={token.symbol} onClick={() => { if (selectingFor === "in") setTokenIn(token); else setTokenOut(token); setSelectingFor(null); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-2 transition-colors">
                    <TokenIcon symbol={token.symbol} size="lg" />
                    <div className="text-left"><div className="font-semibold">{token.symbol}</div><div className="text-sm text-text-secondary">{token.name}</div></div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-[480px] mt-8">
          <h2 className="text-sm font-semibold text-text-secondary mb-3 px-1">Recent transactions</h2>
          <div className="space-y-2">
            {history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0"><Lock className="w-4 h-4 text-primary" /></div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{tx.from} &rarr; {tx.to}</div>
                    <div className="text-xs text-text-tertiary">{tx.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <div className="text-right">
                    {tx.revealed ? (
                      <div className="text-xs font-mono"><span className="text-text-secondary">-{tx.amountIn}</span> <span className="text-success">+{tx.amountOut}</span></div>
                    ) : (<span className="text-xs text-text-tertiary font-mono">encrypted</span>)}
                  </div>
                  <button onClick={() => toggleRevealTx(tx.id)} className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                    {tx.revealed ? <EyeOff className="w-3.5 h-3.5 text-text-tertiary" /> : <Eye className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <a href="#" className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors"><ExternalLink className="w-3.5 h-3.5 text-text-tertiary" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
