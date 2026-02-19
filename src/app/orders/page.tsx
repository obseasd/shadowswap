"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lock, Plus, X, Eye, EyeOff, Loader2, ChevronDown, Info } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const tokens = [
  { symbol: "ETH", icon: "Ξ" },
  { symbol: "USDC", icon: "$" },
  { symbol: "STRK", icon: "S" },
];

interface SealedOrder {
  id: string;
  side: "BUY" | "SELL";
  pair: string;
  price: string;
  amount: string;
  status: "active" | "matched" | "cancelled";
  time: string;
  revealed: boolean;
}

export default function OrdersPage() {
  const { isConnected, connect } = useWallet();
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [tokenA, setTokenA] = useState(tokens[0]);
  const [tokenB, setTokenB] = useState(tokens[1]);
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [showCreate, setShowCreate] = useState(true);

  const [orders, setOrders] = useState<SealedOrder[]>([
    {
      id: "1",
      side: "BUY",
      pair: "ETH/USDC",
      price: "2,150.00",
      amount: "1.5",
      status: "active",
      time: "5 min ago",
      revealed: false,
    },
    {
      id: "2",
      side: "SELL",
      pair: "STRK/USDC",
      price: "0.85",
      amount: "10,000",
      status: "matched",
      time: "1h ago",
      revealed: false,
    },
    {
      id: "3",
      side: "BUY",
      pair: "ETH/STRK",
      price: "2,530.00",
      amount: "0.5",
      status: "active",
      time: "3h ago",
      revealed: false,
    },
  ]);

  const handlePlaceOrder = async () => {
    if (!price || !amount || !isConnected) return;
    setIsPlacing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setOrders((prev) => [
      {
        id: Date.now().toString(),
        side,
        pair: `${tokenA.symbol}/${tokenB.symbol}`,
        price,
        amount,
        status: "active",
        time: "Just now",
        revealed: false,
      },
      ...prev,
    ]);
    setIsPlacing(false);
    setPrice("");
    setAmount("");
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as const } : o))
    );
  };

  const toggleReveal = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, revealed: !o.revealed } : o))
    );
  };

  const statusColors = {
    active: "text-success bg-success/10",
    matched: "text-primary-light bg-primary/10",
    cancelled: "text-muted bg-surface-light",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Sealed-Bid Orders
          </div>
          <h1 className="text-3xl font-bold mb-2">Dark Order Book</h1>
          <p className="text-muted">
            Place limit orders with encrypted price & amount — revealed only at match time
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Create Order */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 sticky top-20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">New Sealed Order</h2>
                <button
                  onClick={() => setShowCreate(!showCreate)}
                  className="lg:hidden p-1 rounded-lg hover:bg-surface-light"
                >
                  {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {showCreate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Side Toggle */}
                    <div className="flex gap-2 p-1 rounded-xl bg-surface-light">
                      {(["BUY", "SELL"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSide(s)}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            side === s
                              ? s === "BUY"
                                ? "bg-success text-white"
                                : "bg-danger text-white"
                              : "text-muted hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Pair */}
                    <div>
                      <label className="text-sm text-muted mb-2 block">Trading Pair</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-surface-light border border-border">
                          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary-light">
                            {tokenA.icon}
                          </span>
                          <span className="font-semibold">{tokenA.symbol}</span>
                        </div>
                        <span className="text-muted">/</span>
                        <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-surface-light border border-border">
                          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary-light">
                            {tokenB.icon}
                          </span>
                          <span className="font-semibold">{tokenB.symbol}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="text-sm text-muted mb-2 block">
                        Price ({tokenB.symbol}) <Lock className="w-3 h-3 inline text-primary" />
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 rounded-xl bg-surface-light border border-border font-mono focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="text-sm text-muted mb-2 block">
                        Amount ({tokenA.symbol}) <Lock className="w-3 h-3 inline text-primary" />
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 rounded-xl bg-surface-light border border-border font-mono focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    {/* Total */}
                    {price && amount && (
                      <div className="p-3 rounded-lg bg-surface-light/50 flex justify-between text-sm">
                        <span className="text-muted">Total</span>
                        <span className="font-mono">
                          {(parseFloat(price) * parseFloat(amount)).toLocaleString()} {tokenB.symbol}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-muted">
                        Price and amount will be encrypted on-chain. Only revealed when the order is matched with a counterparty.
                      </p>
                    </div>

                    {/* Submit */}
                    {isConnected ? (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={!price || !amount || isPlacing}
                        className={`w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                          side === "BUY" ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90"
                        }`}
                      >
                        {isPlacing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Encrypting & Placing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Place Sealed {side} Order
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={connect}
                        className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all"
                      >
                        Connect Wallet
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Orders</h2>
              <div className="flex gap-2 text-sm">
                <span className="px-2 py-1 rounded-lg bg-success/10 text-success">
                  {orders.filter((o) => o.status === "active").length} Active
                </span>
                <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary-light">
                  {orders.filter((o) => o.status === "matched").length} Matched
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl bg-surface border border-border ${
                    order.status === "cancelled" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          order.side === "BUY"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {order.side}
                      </span>
                      <span className="font-semibold">{order.pair}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-sm text-muted">{order.time}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                      <div>
                        <div className="text-xs text-muted mb-1">Price</div>
                        <div className="font-mono text-sm">
                          {order.revealed ? (
                            <span className="text-primary-light">{order.price}</span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted">
                              <Lock className="w-3 h-3" /> Sealed
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted mb-1">Amount</div>
                        <div className="font-mono text-sm">
                          {order.revealed ? (
                            <span className="text-primary-light">{order.amount}</span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted">
                              <Lock className="w-3 h-3" /> Sealed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReveal(order.id)}
                        className="p-2 rounded-lg bg-surface-light hover:bg-primary/10 transition-colors"
                        title={order.revealed ? "Hide" : "Reveal"}
                      >
                        {order.revealed ? (
                          <EyeOff className="w-4 h-4 text-muted" />
                        ) : (
                          <Eye className="w-4 h-4 text-primary" />
                        )}
                      </button>
                      {order.status === "active" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="p-2 rounded-lg bg-surface-light hover:bg-danger/10 transition-colors"
                          title="Cancel order"
                        >
                          <X className="w-4 h-4 text-muted hover:text-danger" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12 text-muted">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No orders yet. Place your first sealed-bid order.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
