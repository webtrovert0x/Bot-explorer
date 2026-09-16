"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  Calendar,
  Award,
  Share2,
  TrendingUp,
  History,
  Coins,
  ExternalLink,
  Crown,
} from "lucide-react";
import { OnchainWrapped as WrappedType } from "@/types/scanner";
import { ShareableCard } from "./ShareableCard";

interface OnchainWrappedProps {
  wrapped: WrappedType;
  targetAddress: string;
  totalPortfolioUSD: number;
}

export function OnchainWrapped({
  wrapped,
  targetAddress,
  totalPortfolioUSD,
}: OnchainWrappedProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Wrapped Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/70 via-[#0d131f] to-purple-950/70 border border-purple-500/30">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wide flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                On-Chain Wrapped Dossier
              </span>
              <span className="text-xs text-slate-400 font-mono">Bohr Network</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Wallet Pedigree & Milestones
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              A historical retrospective of your on-chain journey, gas sacrifice, and DeFi status.
            </p>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span>Generate Shareable Card</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Milestone Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Origin Story */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase">Wallet Genesis</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {wrapped.walletAgeDays} <span className="text-sm font-normal text-slate-400">Days Old</span>
          </div>
          <p className="text-[11px] text-slate-400">
            First Active: <span className="text-cyan-300 font-mono">{wrapped.originDate}</span>
          </p>
        </div>

        {/* Lifetime Gas Burned */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase">Gas Burned</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mb-1">
            {wrapped.lifetimeGasBurnedBOT}{" "}
            <span className="text-sm font-normal text-slate-400">BOT</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Validator Tribute: <span className="text-amber-400 font-mono">${wrapped.lifetimeGasBurnedUSD} USD</span>
          </p>
        </div>

        {/* ATH Net Worth */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase">Peak ATH Worth</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
            ${wrapped.athNetWorthUSD.toLocaleString()}{" "}
            <span className="text-sm font-normal text-slate-400">USD</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Recorded during: <span className="text-slate-200">{wrapped.athDate}</span>
          </p>
        </div>

        {/* Total Transactions */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase">Lifetime Activity</span>
            <History className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mb-1">
            {wrapped.totalTransactionsCount}{" "}
            <span className="text-sm font-normal text-slate-400">Txs</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Most Active: <span className="text-purple-300">{wrapped.mostActiveMonth}</span>
          </p>
        </div>
      </div>

      {/* DeFi Personas & Achievement Badges */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h4 className="text-lg font-bold text-white">DeFi Persona & Achievement Badges</h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Automated status unlocked through on-chain history
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wrapped.personas.map((persona, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-cyan-500/30 transition-all flex items-start gap-3.5"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${persona.badgeColor} flex items-center justify-center text-xl shrink-0 shadow-lg`}
              >
                {persona.icon}
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">{persona.title}</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {persona.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Origin Details Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Coins className="w-4 h-4 text-cyan-400" />
          Genesis Lineage
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">Original Funding Address</span>
            <div className="text-cyan-300 truncate">{wrapped.firstFunder}</div>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">Genesis Tx Hash</span>
            <div className="text-purple-300 truncate">{wrapped.genesisTxHash}</div>
          </div>
        </div>
      </div>

      {/* Shareable Card Modal */}
      {showShareModal && (
        <ShareableCard
          wrapped={wrapped}
          targetAddress={targetAddress}
          totalPortfolioUSD={totalPortfolioUSD}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
