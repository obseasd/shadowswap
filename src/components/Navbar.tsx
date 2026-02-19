"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/fund", label: "Fund" },
  { href: "/swap", label: "Swap" },
  { href: "/orders", label: "Orders" },
  { href: "/compliance", label: "Compliance" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected, isConnecting, connect, connectWallet, disconnect, shortAddress, walletName, showWalletModal, setShowWalletModal } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-primary" />
            <span className="text-[17px] font-semibold tracking-tight">
              ShadowSwap
            </span>
          </Link>

          {/* Desktop Nav - centered */}
          <div className="hidden md:flex items-center gap-1 bg-surface rounded-2xl p-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive
                      ? "bg-surface-2 text-foreground"
                      : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Network badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface text-text-secondary text-sm">
              <div className="w-2 h-2 rounded-full bg-success" />
              Starknet
            </div>

            {isConnected ? (
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-hover text-sm font-medium transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-success" />
                {walletName ? `${walletName} · ${shortAddress}` : shortAddress}
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-text-secondary hover:text-foreground hover:bg-surface transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                      isActive
                        ? "bg-surface text-foreground"
                        : "text-text-secondary hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet chooser modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] rounded-3xl bg-surface border border-border p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Connect Wallet</h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="p-1.5 rounded-xl hover:bg-surface-2 transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => connectWallet("argentX")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-2 border border-border transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ff875b]/15 flex items-center justify-center text-lg font-bold text-[#ff875b]">A</div>
                  <div className="text-left">
                    <div className="font-semibold">ArgentX</div>
                    <div className="text-sm text-text-secondary">Starknet wallet</div>
                  </div>
                </button>
                <button
                  onClick={() => connectWallet("braavos")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-2 border border-border transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f5c451]/15 flex items-center justify-center text-lg font-bold text-[#f5c451]">B</div>
                  <div className="text-left">
                    <div className="font-semibold">Braavos</div>
                    <div className="text-sm text-text-secondary">Starknet wallet</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
