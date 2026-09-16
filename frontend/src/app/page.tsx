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
import { Shield, Sparkles, Coins, History, ExternalLink, Copy, Check } from "lucide-react";
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
                      <span className="text-xs text-slate-400 font-mono">Chain ID: 968 (Bohr)</span>
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
                        href={`https://scan.bohr.life/address/${report.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="View on BohrScan"
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
    </div>
  );
}
