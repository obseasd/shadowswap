"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Shield, UserPlus, UserMinus, Key, Loader2, Info, CheckCircle, Copy, Check } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface Auditor {
  id: string;
  address: string;
  label: string;
  grantedAt: string;
  status: "active" | "revoked";
}

export default function CompliancePage() {
  const { isConnected, connect } = useWallet();
  const [auditorAddress, setAuditorAddress] = useState("");
  const [auditorLabel, setAuditorLabel] = useState("");
  const [isGranting, setIsGranting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [auditors, setAuditors] = useState<Auditor[]>([
    {
      id: "1",
      address: "0x04a3b7fE028F2E6E4380D4bA5F6e7D6B8C3e9a12F1dC4E8b2A7c5D0F9e3B6a1",
      label: "Treasury Auditor",
      grantedAt: "Feb 15, 2025",
      status: "active",
    },
    {
      id: "2",
      address: "0x07d2E9c1A5B8F3e6D4a0C7b2E9F1d5A8c3B6e0D7f2A4b9C1e5F8a3D6b0E7c2",
      label: "Compliance Officer",
      grantedAt: "Feb 10, 2025",
      status: "revoked",
    },
  ]);

  const handleGrant = async () => {
    if (!auditorAddress || !isConnected) return;
    setIsGranting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAuditors((prev) => [
      {
        id: Date.now().toString(),
        address: auditorAddress,
        label: auditorLabel || "Unnamed Auditor",
        grantedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "active",
      },
      ...prev,
    ]);
    setIsGranting(false);
    setAuditorAddress("");
    setAuditorLabel("");
  };

  const toggleAuditor = (id: string) => {
    setAuditors((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? ("revoked" as const) : ("active" as const) }
          : a
      )
    );
  };

  const viewingKeyExample = "0xvk_7a3f9b2c4d1e8a5f...c3b6a1d0e9f2";

  const copyKey = () => {
    navigator.clipboard.writeText(viewingKeyExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-4">
            <Eye className="w-3.5 h-3.5" />
            Viewing Keys
          </div>
          <h1 className="text-3xl font-bold mb-2">Compliance Center</h1>
          <p className="text-muted">
            Privacy with accountability — grant auditors selective access to your confidential balances
          </p>
        </div>

        {/* Philosophy Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-primary/10 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Privacy ≠ Secrecy</h3>
              <p className="text-muted text-sm leading-relaxed">
                ShadowSwap believes in <strong className="text-foreground">selective disclosure</strong>. Your
                balances are encrypted by default, but you can grant viewing keys to authorized
                auditors, regulators, or counterparties. They can verify your holdings without
                compromising your privacy to the public.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Grant Access */}
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Grant Viewing Access</h2>
            </div>

            <div>
              <label className="text-sm text-muted mb-2 block">Auditor Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={auditorAddress}
                onChange={(e) => setAuditorAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-light border border-border font-mono text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm text-muted mb-2 block">Label (optional)</label>
              <input
                type="text"
                placeholder="e.g. Treasury Auditor"
                value={auditorLabel}
                onChange={(e) => setAuditorLabel(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-light border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Viewing Key Preview */}
            <div>
              <label className="text-sm text-muted mb-2 block">Your Viewing Key</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-light border border-border">
                <Key className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-mono text-muted truncate">{viewingKeyExample}</span>
                <button
                  onClick={copyKey}
                  className="p-1 rounded hover:bg-primary/10 transition-colors shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted mt-1">
                This key will be encrypted with the auditor&apos;s public key
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted">
                The auditor will be able to decrypt and read your confidential balances. You can
                revoke access at any time.
              </p>
            </div>

            {isConnected ? (
              <button
                onClick={handleGrant}
                disabled={!auditorAddress || isGranting}
                className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGranting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Encrypting viewing key...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Grant Viewing Access
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
          </div>

          {/* Auditors List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Auditors</h2>
              <span className="text-sm text-muted">
                {auditors.filter((a) => a.status === "active").length} active
              </span>
            </div>

            <div className="space-y-3">
              {auditors.map((auditor, i) => (
                <motion.div
                  key={auditor.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl bg-surface border border-border ${
                    auditor.status === "revoked" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          auditor.status === "active"
                            ? "bg-success/10"
                            : "bg-surface-light"
                        }`}
                      >
                        {auditor.status === "active" ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <UserMinus className="w-4 h-4 text-muted" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{auditor.label}</div>
                        <div className="text-xs text-muted">Granted {auditor.grantedAt}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        auditor.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-surface-light text-muted"
                      }`}
                    >
                      {auditor.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-light">
                    <span className="text-xs font-mono text-muted truncate">
                      {auditor.address}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Eye className="w-3 h-3" />
                      Can view: All confidential balances
                    </div>
                    <button
                      onClick={() => toggleAuditor(auditor.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        auditor.status === "active"
                          ? "bg-danger/10 text-danger hover:bg-danger/20"
                          : "bg-success/10 text-success hover:bg-success/20"
                      }`}
                    >
                      {auditor.status === "active" ? "Revoke Access" : "Re-grant"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {auditors.length === 0 && (
              <div className="text-center py-12 text-muted rounded-2xl bg-surface border border-border">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No auditors yet. Grant access to get started.</p>
              </div>
            )}

            {/* How it works */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <h3 className="font-semibold mb-4">How Viewing Keys Work</h3>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "You generate a viewing key",
                    desc: "Derived from your Tongo account, this key can decrypt your balances.",
                  },
                  {
                    step: "2",
                    title: "Key is encrypted for the auditor",
                    desc: "The viewing key is encrypted with the auditor's public key, so only they can use it.",
                  },
                  {
                    step: "3",
                    title: "Auditor decrypts your balances",
                    desc: "The auditor uses their private key to decrypt the viewing key, then reads your balances.",
                  },
                  {
                    step: "4",
                    title: "Revoke anytime",
                    desc: "Rotate your Tongo key to invalidate all previously issued viewing keys.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary-light shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
