"use client";

import { Shield, Lock, Eye, ArrowLeftRight, BookOpen, ChevronRight, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

const features = [
  {
    icon: Lock,
    title: "Confidential Balances",
    description: "Your token amounts are encrypted using ElGamal encryption via Tongo protocol. Nobody can see your holdings.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: ArrowLeftRight,
    title: "Private Swaps",
    description: "Exchange tokens without revealing swap amounts. Trade sizes remain hidden from on-chain observers.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BookOpen,
    title: "Sealed-Bid Orders",
    description: "Place limit orders with encrypted price and amount. Orders are only revealed at match time.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Eye,
    title: "Viewing Keys",
    description: "Optionally grant auditors read access to your balances. Privacy with accountability.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const stats = [
  { value: "100%", label: "On-chain Privacy" },
  { value: "ElGamal", label: "Encryption" },
  { value: "Tongo", label: "Protocol" },
  { value: "Starknet", label: "Network" },
];

export default function Home() {
  const { isConnected, connect } = useWallet();

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-8">
            <Shield className="w-4 h-4" />
            Built on Starknet with Tongo Protocol
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-6">
            Your trades.{" "}
            <span className="bg-gradient-to-r from-primary-light via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Your privacy.
            </span>
          </h1>

          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            Trade tokens without revealing your amounts. ShadowSwap brings confidential DeFi to
            Starknet with encrypted balances, private swaps, and sealed-bid orders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <Link
                href="/swap"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all animate-pulse-glow"
              >
                Launch App
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={connect}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all animate-pulse-glow"
              >
                Connect Wallet
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <a
              href="https://docs.tongo.cash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-lg font-semibold bg-surface-light border border-border text-muted hover:text-foreground transition-all"
            >
              Learn About Tongo
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="text-2xl font-bold text-primary-light">{stat.value}</div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Privacy-First DeFi</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Every layer of ShadowSwap is designed for confidentiality — from encrypted balances to
            sealed-bid orders.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-light transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Three steps to private trading on Starknet
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: "01",
              title: "Fund",
              desc: "Deposit ERC-20 tokens and encrypt them via Tongo protocol. Your balance becomes confidential.",
              icon: Lock,
            },
            {
              step: "02",
              title: "Trade",
              desc: "Swap tokens or place sealed-bid orders. All amounts stay encrypted on-chain.",
              icon: ArrowLeftRight,
            },
            {
              step: "03",
              title: "Withdraw",
              desc: "Convert confidential tokens back to standard ERC-20 whenever you want.",
              icon: Zap,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary-light" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-surface/50" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to trade privately?
            </h2>
            <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
              Connect your ArgentX or Braavos wallet and start making confidential swaps on
              Starknet.
            </p>
            {isConnected ? (
              <Link
                href="/fund"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all"
              >
                Fund Your Account
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={connect}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-all"
              >
                Connect Wallet
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted text-sm">
            <Shield className="w-4 h-4 text-primary" />
            ShadowSwap — Confidential DeFi on Starknet
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="https://docs.tongo.cash" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Tongo Docs
            </a>
            <a href="https://starknet.io" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Starknet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
