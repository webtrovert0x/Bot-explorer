"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Shield, Zap, ExternalLink, Wallet, CheckCircle, Flame, ArrowUpRight, Swords, Trophy, Bell, TrendingUp } from "lucide-react";
import { botchainMainnet } from "@/config/chains";
import { formatUnits } from "viem";
import { fetchLiveBotPrice } from "@/services/bohrScanner";

interface NavbarProps {
  currentView?: "EXPLORER" | "BATTLE" | "LEADERBOARD";
  onSelectView?: (view: "EXPLORER" | "BATTLE" | "LEADERBOARD") => void;
  onOpenAlerts?: () => void;
}

export function Navbar({ currentView = "EXPLORER", onSelectView, onOpenAlerts }: NavbarProps) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const [livePrice, setLivePrice] = useState<number | null>(null);

  useEffect(() => {
    fetchLiveBotPrice().then((p) => setLivePrice(p));
    const interval = setInterval(() => {
      fetchLiveBotPrice().then((p) => setLivePrice(p));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const { data: balance } = useBalance({
    address: address,
    chainId: botchainMainnet.id,
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
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10">
                  <img
                    src="/botchain.jpeg"
                    alt="BOT Chain"
                    className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-cyan-400/40"
                  />
                  <span>BOT CHAIN 677</span>
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
              Radar Scan
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

            <div className="w-px h-4 bg-white/10 mx-1" />

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all group"
              title="Open Official BotScan Explorer"
            >
              <img
                src="/botchain.jpeg"
                alt="BotScan Explorer"
                className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
              />
              <span>Explorer</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>

            <a
              href="https://www.botchain.ai/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all group"
              title="Open Official BOT Chain Website"
            >
              <img
                src="/botchain.jpeg"
                alt="BOT Chain"
                className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
              />
              <span>BOT Chain</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>
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

          {/* Live BOT/USDT Price Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-300 font-medium" title="Live BOT/USDT price from Coinstore">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">BOT:</span>
            <span className="text-emerald-400 font-bold font-mono">
              ${livePrice !== null ? livePrice.toFixed(2) : "12.40"}
            </span>
          </div>

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
