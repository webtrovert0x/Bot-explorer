"use client";

import React from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Shield, Zap, ExternalLink, Wallet, CheckCircle, Flame, ArrowUpRight, Swords, Trophy, Bell } from "lucide-react";
import { bohrTestnet } from "@/config/chains";
import { formatUnits } from "viem";

interface NavbarProps {
  currentView?: "EXPLORER" | "BATTLE" | "LEADERBOARD";
  onSelectView?: (view: "EXPLORER" | "BATTLE" | "LEADERBOARD") => void;
  onOpenAlerts?: () => void;
}

export function Navbar({ currentView = "EXPLORER", onSelectView, onOpenAlerts }: NavbarProps) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();

  const { data: balance } = useBalance({
    address: address,
    chainId: bohrTestnet.id,
  });

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(3)
    : "0.000";

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onSelectView?.("EXPLORER")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-cyan-500/40 transition-all bg-[#080b11]">
              <img
                src="/logo.png"
                alt="Explorer Bot Logo"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#080b11]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  EXPLORER<span className="text-cyan-400">.BOT</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  BOHR 968
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                On-Chain Intelligence & Defense Radar
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => onSelectView?.("EXPLORER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === "EXPLORER"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Explorer
            </button>
            <button
              onClick={() => onSelectView?.("BATTLE")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === "BATTLE"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-purple-400" />
              <span>VS Battle</span>
            </button>
            <button
              onClick={() => onSelectView?.("LEADERBOARD")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === "LEADERBOARD"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Leaderboard</span>
            </button>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Bot Alerts Trigger */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
            title="Configure Telegram Drainer Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Bot Alerts</span>
          </button>

          {/* Scan Rate Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Rate:</span>
            <span className="text-cyan-400 font-bold font-mono">0.1 BOT</span>
          </div>

          {/* Wallet Connect Section */}
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-[#0d131f] border border-cyan-500/20 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Balance</span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {formattedBalance} BOT
                </span>
              </div>

              <button
                onClick={() => open()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-xs font-mono font-semibold"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 text-white">
                <Wallet className="w-4 h-4 text-cyan-200" />
                <span>Connect Wallet</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
