"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Flame, Shield, Calendar, Coins, ArrowUpRight, Search, Zap, Crown, RefreshCw } from "lucide-react";
import { fetchBohrLeaderboard, LeaderboardEntry } from "@/services/bohrScanner";

interface LeaderboardProps {
  onSelectAddress: (address: string) => void;
}

export function Leaderboard({ onSelectAddress }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "GAS" | "BALANCE" | "AGE">("ALL");

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchBohrLeaderboard();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load real leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const filteredEntries = [...entries].sort((a, b) => {
    if (filter === "GAS") return b.gasBurnedBOT - a.gasBurnedBOT;
    if (filter === "BALANCE") return b.balanceBOT - a.balanceBOT;
    if (filter === "AGE") return b.ageDays - a.ageDays;
    return a.rank - b.rank;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-cyan-500/10 border border-amber-500/30 text-amber-300">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Bohr Network Real On-Chain Hall of Fame</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Ecosystem Leaderboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Real live wallet rankings fetched directly from Bohr Testnet RPC & Explorer.
        </p>
      </div>

      {/* Filter Tabs & Refresh Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "ALL" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            All Rankings
          </button>
          <button
            onClick={() => setFilter("BALANCE")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "BALANCE" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            👑 Top BOT Balance
          </button>
          <button
            onClick={() => setFilter("GAS")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "GAS" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            🔥 Top Gas Burned
          </button>
          <button
            onClick={() => setFilter("AGE")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "AGE" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Oldest Genesis
          </button>
        </div>

        <button
          onClick={loadLeaderboard}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          <span>Refresh Real Ledger</span>
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {loading && entries.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-cyan-300">Querying live Bohr Testnet ledger data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px] font-semibold bg-black/40">
                  <th className="py-4 pl-6">Rank & Wallet</th>
                  <th className="py-4">On-Chain Persona</th>
                  <th className="py-4 text-right">Native Balance</th>
                  <th className="py-4 text-right">Lifetime Txs</th>
                  <th className="py-4 text-right">Gas Burned</th>
                  <th className="py-4 pr-6 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntries.map((item, idx) => (
                  <tr key={item.address} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs ${
                            idx === 0
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : idx === 1
                              ? "bg-slate-300/20 text-slate-300 border border-slate-400/40"
                              : idx === 2
                              ? "bg-amber-700/20 text-amber-600 border border-amber-700/40"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white block">{item.label}</span>
                          <span className="font-mono text-cyan-400/80 text-[11px]">
                            {item.address.slice(0, 8)}...{item.address.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.badges.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 text-right font-mono font-bold text-cyan-300">
                      {item.balanceBOT.toLocaleString()} BOT
                    </td>

                    <td className="py-4 text-right font-mono text-white">
                      {item.txCount.toLocaleString()} txs
                    </td>

                    <td className="py-4 text-right font-mono font-bold text-amber-300">
                      {item.gasBurnedBOT} BOT
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => onSelectAddress(item.address)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Audit</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
