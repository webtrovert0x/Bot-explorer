"use client";

import React, { useState, useRef } from "react";
import { Swords, Trophy, Sparkles, Download, Twitter, Check, Search, Zap, Shield, Flame, Calendar } from "lucide-react";
import { isAddress } from "viem";
import { scanBohrWallet } from "@/services/bohrScanner";
import { WalletScanReport } from "@/types/scanner";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

export function WalletBattle() {
  const [addr1, setAddr1] = useState("0x293ed7F710D056887C6e3Ef5EdBC9B95e32f03a4");
  const [addr2, setAddr2] = useState("0xf534f5C4759C649e7F04A535bAcfeE0A0E855970");
  const [loading, setLoading] = useState(false);
  const [report1, setReport1] = useState<WalletScanReport | null>(null);
  const [report2, setReport2] = useState<WalletScanReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleFight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddress(addr1) || !isAddress(addr2)) {
      setErrorMsg("Please enter two valid 0x EVM wallet addresses.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const [r1, r2] = await Promise.all([scanBohrWallet(addr1), scanBohrWallet(addr2)]);
      setReport1(r1);
      setReport2(r2);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg("Failed to query on-chain data for battle comparison.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `bohr-battle-${addr1.slice(0, 6)}-vs-${addr2.slice(0, 6)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500/10 via-purple-500/10 to-cyan-500/10 border border-purple-500/30 text-purple-300">
          <Swords className="w-3.5 h-3.5 text-purple-400" />
          <span>On-Chain Degen Battle & Comparison</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          WALLET <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">VS</span> WALLET
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Pit two Bohr wallets head-to-head. Compare lifetime gas burned, security health, age, and portfolio status.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleFight} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-cyan-400 font-semibold block mb-1">Fighter #1 Address</label>
            <input
              type="text"
              value={addr1}
              onChange={(e) => setAddr1(e.target.value.trim())}
              placeholder="0x..."
              className="w-full bg-black/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-pink-400 font-semibold block mb-1">Fighter #2 Address</label>
            <input
              type="text"
              value={addr2}
              onChange={(e) => setAddr2(e.target.value.trim())}
              placeholder="0x..."
              className="w-full bg-black/50 border border-pink-500/30 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        {errorMsg && <p className="text-red-400 text-xs font-mono">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Fetching Live On-Chain Data...</span>
          ) : (
            <>
              <Swords className="w-5 h-5" />
              <span>Simulate On-Chain Battle</span>
            </>
          )}
        </button>
      </form>

      {/* Battle Results Card */}
      {report1 && report2 && (
        <div className="space-y-4">
          <div
            ref={cardRef}
            className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-[#080c14] space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="font-mono text-xs font-bold text-cyan-400">BOHR NETWORK (968)</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                OFFICIAL BATTLE REPORT
              </span>
            </div>

            {/* Fighter Header Grid */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">Player 1</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white truncate block">
                  {report1.address.slice(0, 8)}...{report1.address.slice(-6)}
                </span>
              </div>

              <div className="p-4 bg-pink-950/20 border border-pink-500/30 rounded-2xl">
                <span className="text-[10px] text-pink-400 font-bold uppercase block mb-1">Player 2</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white truncate block">
                  {report2.address.slice(0, 8)}...{report2.address.slice(-6)}
                </span>
              </div>
            </div>

            {/* Metric Comparisons */}
            <div className="space-y-3">
              {/* Metric 1: Gas Burned */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span
                  className={`font-bold ${
                    report1.wrapped.lifetimeGasBurnedBOT >= report2.wrapped.lifetimeGasBurnedBOT
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {report1.wrapped.lifetimeGasBurnedBOT} BOT
                </span>
                <span className="text-slate-400 uppercase text-[10px] font-sans font-semibold">
                  Lifetime Gas Burned
                </span>
                <span
                  className={`font-bold ${
                    report2.wrapped.lifetimeGasBurnedBOT >= report1.wrapped.lifetimeGasBurnedBOT
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {report2.wrapped.lifetimeGasBurnedBOT} BOT
                </span>
              </div>

              {/* Metric 2: Wallet Age */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span
                  className={`font-bold ${
                    report1.wrapped.walletAgeDays >= report2.wrapped.walletAgeDays
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {report1.wrapped.walletAgeDays} Days
                </span>
                <span className="text-slate-400 uppercase text-[10px] font-sans font-semibold">
                  Wallet Age (Genesis)
                </span>
                <span
                  className={`font-bold ${
                    report2.wrapped.walletAgeDays >= report1.wrapped.walletAgeDays
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {report2.wrapped.walletAgeDays} Days
                </span>
              </div>

              {/* Metric 3: Security Score */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span
                  className={`font-bold ${
                    report1.security.healthScore >= report2.security.healthScore
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {report1.security.healthScore}/100
                </span>
                <span className="text-slate-400 uppercase text-[10px] font-sans font-semibold">
                  Security Health Score
                </span>
                <span
                  className={`font-bold ${
                    report2.security.healthScore >= report1.security.healthScore
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {report2.security.healthScore}/100
                </span>
              </div>

              {/* Metric 4: Total Portfolio */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span
                  className={`font-bold ${
                    report1.totalPortfolioUSD >= report2.totalPortfolioUSD
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  ${report1.totalPortfolioUSD.toLocaleString()} USD
                </span>
                <span className="text-slate-400 uppercase text-[10px] font-sans font-semibold">
                  Portfolio Valuation
                </span>
                <span
                  className={`font-bold ${
                    report2.totalPortfolioUSD >= report1.totalPortfolioUSD
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  ${report2.totalPortfolioUSD.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          {/* Share Action */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadCard}
              disabled={downloading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Generating Image..." : "Download Battle Card"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
