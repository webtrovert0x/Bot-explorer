"use client";

import React, { useRef, useState } from "react";
import { Download, X, Twitter, Check, Sparkles, Zap, Shield, Flame } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { OnchainWrapped } from "@/types/scanner";

interface ShareableCardProps {
  wrapped: OnchainWrapped;
  targetAddress: string;
  totalPortfolioUSD: number;
  onClose: () => void;
}

export function ShareableCard({
  wrapped,
  targetAddress,
  totalPortfolioUSD,
  onClose,
}: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `bohr-wrapped-${targetAddress.slice(0, 6)}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
    } catch (err) {
      console.error("Failed to generate card image:", err);
    } finally {
      setDownloading(false);
    }
  };

  const shareText = encodeURIComponent(
    `Just generated my On-Chain Wrapped dossier on @BohrNetwork with Explorer Bot! ⚡\n\n🛡️ Wallet Age: ${wrapped.walletAgeDays} Days\n🔥 Lifetime Gas Burned: ${wrapped.lifetimeGasBurnedBOT} BOT\n💎 Peak ATH Worth: $${wrapped.athNetWorthUSD.toLocaleString()}\n\nCheck yours at explorerbot.life`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* The Card Render Target */}
        <div
          ref={cardRef}
          className="relative rounded-3xl p-7 bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#05080e] border border-cyan-500/40 shadow-2xl overflow-hidden text-white"
          style={{ width: "100%" }}
        >
          {/* Cyber glow background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/50 shadow-md shadow-cyan-500/20 bg-[#080b11]">
                <img
                  src="/logo.png"
                  alt="Explorer Bot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  EXPLORER.BOT
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">BOHR NETWORK (968)</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              ON-CHAIN WRAPPED
            </span>
          </div>

          {/* Wallet Address Chip */}
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 mb-6 text-center">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-0.5">
              Verified Wallet ID
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {targetAddress}
            </span>
          </div>

          {/* Core Metrics Quad */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Wallet Age</span>
              <div className="text-xl font-extrabold font-mono text-white mt-0.5">
                {wrapped.walletAgeDays} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">Born {wrapped.originDate}</span>
            </div>

            <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lifetime Gas</span>
              <div className="text-xl font-extrabold font-mono text-amber-400 mt-0.5">
                {wrapped.lifetimeGasBurnedBOT} <span className="text-xs font-normal text-slate-400">BOT</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">${wrapped.lifetimeGasBurnedUSD} USD</span>
            </div>

            <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Peak Net Worth</span>
              <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
                ${wrapped.athNetWorthUSD.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">{wrapped.athDate}</span>
            </div>

            <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Activity Count</span>
              <div className="text-xl font-extrabold font-mono text-purple-300 mt-0.5">
                {wrapped.totalTransactionsCount} <span className="text-xs font-normal text-slate-400">txs</span>
              </div>
              <span className="text-[10px] text-purple-400">Peak: {wrapped.mostActiveMonth}</span>
            </div>
          </div>

          {/* Badges Section */}
          <div className="mb-6">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase mb-2">
              DeFi Persona Titles
            </span>
            <div className="flex flex-wrap gap-2">
              {wrapped.personas.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold"
                >
                  <span>{p.icon}</span>
                  <span className="text-white">{p.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer watermark */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>AUDITED VIA BOHR TESTNET (968)</span>
            <span className="text-cyan-400">0.1 BOT SCAN FEE</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-black" />
                <span>{downloading ? "Generating..." : "Download HD Image"}</span>
              </>
            )}
          </button>

          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/40 text-[#1DA1F2] font-bold text-xs sm:text-sm transition-all"
          >
            <Twitter className="w-4 h-4" />
            <span>Post to X</span>
          </a>
        </div>
      </div>
    </div>
  );
}
