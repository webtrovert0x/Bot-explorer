"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSearch } from "@/components/HeroSearch";
import { ScanAnimation } from "@/components/ScanAnimation";
import { PaywallModal } from "@/components/PaywallModal";
import { SecurityRadar } from "@/components/SecurityRadar";
import { OnchainWrapped } from "@/components/OnchainWrapped";
import { PortfolioMatrix } from "@/components/PortfolioMatrix";
import { TransactionHistory } from "@/components/TransactionHistory";
import { WalletBattle } from "@/components/WalletBattle";
import { Leaderboard } from "@/components/Leaderboard";
import { TelegramAlertsModal } from "@/components/TelegramAlertsModal";
import { scanBohrWallet } from "@/services/bohrScanner";
import { WalletScanReport } from "@/types/scanner";
import { Shield, Sparkles, Coins, History, ExternalLink, Copy, Check, ArrowUpRight } from "lucide-react";
import { useAccount } from "wagmi";

export default function Home() {
  const { address: connectedAddress } = useAccount();
  const [currentView, setCurrentView] = useState<"EXPLORER" | "BATTLE" | "LEADERBOARD">("EXPLORER");
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const [targetAddress, setTargetAddress] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<WalletScanReport | null>(null);
  const [activeTab, setActiveTab] = useState<"SECURITY" | "WRAPPED" | "PORTFOLIO" | "HISTORY">("SECURITY");
  const [copied, setCopied] = useState(false);

  // Triggered when user enters/clicks an address
  const handleInitiateScan = (address: string) => {
    setTargetAddress(address);
    setShowPaywall(true);
  };

  // Triggered after successful 0.1 BOT payment or free demo bypass
  const handlePaymentSuccess = async () => {
    setShowPaywall(false);
    setIsScanning(true);

    try {
      if (targetAddress) {
        const scanData = await scanBohrWallet(targetAddress);
        setReport(scanData);
      }
    } catch (err) {
      console.error("Scan error:", err);
    }
  };

  const handleScanAnimationComplete = () => {
    setIsScanning(false);
    setTimeout(() => {
      const el = document.getElementById("scan-dossier");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectLeaderboardAddress = (addr: string) => {
    setCurrentView("EXPLORER");
    handleInitiateScan(addr);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Bar with View Switchers */}
        <Navbar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenAlerts={() => setShowAlertsModal(true)}
        />

        {/* VIEW 1: EXPLORER PORTAL */}
        {currentView === "EXPLORER" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {/* Hero Section */}
            <HeroSearch onInitiateScan={handleInitiateScan} isScanning={isScanning} />

            {/* Paywall Confirmation Modal */}
            {showPaywall && targetAddress && (
              <PaywallModal
                targetAddress={targetAddress}
                onPaymentSuccess={handlePaymentSuccess}
                onClose={() => setShowPaywall(false)}
              />
            )}

            {/* Cyberpunk Scan Animation Overlay */}
            {isScanning && targetAddress && (
              <ScanAnimation
                targetAddress={targetAddress}
                onComplete={handleScanAnimationComplete}
              />
            )}

            {/* Dossier Report Section */}
            {report && (
              <div id="scan-dossier" className="mt-12 space-y-8 animate-fadeIn">
                {/* Target Header Bar */}
                <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider font-mono">
                        VERIFIED ON-CHAIN DOSSIER
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Chain ID: 677 (BOT Chain)</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <h2 className="text-xl sm:text-2xl font-black font-mono text-white truncate max-w-sm sm:max-w-md md:max-w-lg">
                        {report.address}
                      </h2>
                      <button
                        onClick={() => handleCopyAddress(report.address)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copy Address"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={`https://scan.botchain.ai/address/${report.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="View on BotScan"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Quick Balances */}
                  <div className="flex items-center gap-4 bg-black/40 p-3.5 rounded-2xl border border-white/5 shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Native Balance</span>
                      <span className="text-base font-bold font-mono text-cyan-400">
                        {report.nativeBalanceBOT} BOT
                      </span>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Est. Total Worth</span>
                      <span className="text-base font-bold font-mono text-emerald-400">
                        ${report.totalPortfolioUSD.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dossier Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
                  <button
                    onClick={() => setActiveTab("SECURITY")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                      activeTab === "SECURITY"
                        ? "bg-gradient-to-r from-red-500/20 to-amber-500/20 text-red-300 border border-red-500/40 shadow-lg shadow-red-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>🛡️ Security & Drain Radar</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/30 text-white font-mono">
                      {report.security.healthScore}/100
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("WRAPPED")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                      activeTab === "WRAPPED"
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>👑 On-Chain Wrapped</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("PORTFOLIO")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                      activeTab === "PORTFOLIO"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>💎 Portfolio & NFTs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("HISTORY")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                      activeTab === "HISTORY"
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span>📜 Ledger Activity</span>
                  </button>
                </div>

                {/* Active Tab Content */}
                <div className="mt-6">
                  {activeTab === "SECURITY" && (
                    <SecurityRadar
                      security={report.security}
                      targetAddress={report.address}
                      tokens={report.tokens}
                    />
                  )}

                  {activeTab === "WRAPPED" && (
                    <OnchainWrapped
                      wrapped={report.wrapped}
                      targetAddress={report.address}
                      totalPortfolioUSD={report.totalPortfolioUSD}
                    />
                  )}

                  {activeTab === "PORTFOLIO" && (
                    <PortfolioMatrix
                      tokens={report.tokens}
                      nfts={report.nfts}
                      totalPortfolioUSD={report.totalPortfolioUSD}
                    />
                  )}

                  {activeTab === "HISTORY" && (
                    <TransactionHistory
                      transactions={report.recentTransactions}
                      targetAddress={report.address}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: WALLET VS WALLET BATTLE */}
        {currentView === "BATTLE" && <WalletBattle />}

        {/* VIEW 3: LEADERBOARD */}
        {currentView === "LEADERBOARD" && (
          <Leaderboard onSelectAddress={handleSelectLeaderboardAddress} />
        )}
      </div>

      {/* 24/7 Threat Alerts Modal */}
      {showAlertsModal && (
        <TelegramAlertsModal
          walletAddress={connectedAddress || "0x293ed7F710D056887C6e3Ef5EdBC9B95e32f03a4"}
          onClose={() => setShowAlertsModal(false)}
        />
      )}

      {/* Official BOT Chain Ecosystem Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#06090e]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-lg font-extrabold text-white tracking-wider">
                  EXPLORER<span className="text-cyan-400">.BOT</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  MAINNET 677
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Real-time on-chain security intelligence, wallet health audits, 1-click token revokes, and viral on-chain dossiers natively built for BOT Chain Mainnet.
              </p>
            </div>

            {/* Col 2: BOT Chain Ecosystem Links */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src="/botchain.jpeg"
                  alt="BOT Chain Logo"
                  className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-cyan-500/40"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  BOT Chain Ecosystem
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href="https://www.botchain.ai/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 flex items-center gap-2 transition-colors group"
                  >
                    <img
                      src="/botchain.jpeg"
                      alt="BOT Chain"
                      className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
                    />
                    <span>BOT Chain Website</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://scan.botchain.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 flex items-center gap-2 transition-colors group"
                  >
                    <img
                      src="/botchain.jpeg"
                      alt="BOT Chain Explorer"
                      className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
                    />
                    <span>BOT Chain Explorer</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://rpc.botchain.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 flex items-center gap-2 transition-colors group pl-6"
                  >
                    <span>Mainnet RPC (Chain 677)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Smart Contract & Audits */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Verified Contract
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <a
                    href="https://scan.botchain.ai/address/0x5D6c221eE1A0E40fa58CEBAc83A359DCde9bd34f#code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors text-emerald-400/90 font-mono"
                  >
                    <img
                      src="/botchain.jpeg"
                      alt="BOT Chain"
                      className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                    />
                    <span>ExplorerPayment (Verified)</span>
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  </a>
                </li>
                <li>
                  <span className="text-[11px] text-slate-500 font-mono pl-5">
                    0x5D6c...bd34f
                  </span>
                </li>
                <li className="pt-1 text-[11px] text-slate-400 pl-5">
                  Dual-tier scan system (Gas-Only Free & 0.1 BOT Pro)
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Explorer Bot. Built natively for BOT Chain Mainnet.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.botchain.ai/en/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1.5 transition-colors">
                <img src="/botchain.jpeg" alt="BOT Chain" className="w-3.5 h-3.5 rounded-full object-cover" />
                <span>botchain.ai</span>
              </a>
              <span>•</span>
              <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1.5 transition-colors">
                <img src="/botchain.jpeg" alt="BOT Chain Explorer" className="w-3.5 h-3.5 rounded-full object-cover" />
                <span>scan.botchain.ai</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
