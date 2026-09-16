"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Search, ShieldAlert, Sparkles, Zap, ArrowRight, Wallet, CheckCircle } from "lucide-react";
import { isAddress } from "viem";
import { DEMO_PRESETS } from "@/services/bohrScanner";

interface HeroSearchProps {
  onInitiateScan: (targetAddress: string) => void;
  isScanning: boolean;
}

export function HeroSearch({ onInitiateScan, isScanning }: HeroSearchProps) {
  const { address: connectedAddress, isConnected } = useAccount();
  const [searchInput, setSearchInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (!clean) {
      setInputError("Please enter a wallet address.");
      return;
    }
    if (!isAddress(clean)) {
      setInputError("Please enter a valid 0x EVM address (42 characters).");
      return;
    }
    setInputError(null);
    onInitiateScan(clean);
  };

  const handleScanSelf = () => {
    if (connectedAddress) {
      setSearchInput(connectedAddress);
      setInputError(null);
      onInitiateScan(connectedAddress);
    }
  };

  const handleSelectPreset = (presetAddress: string) => {
    setSearchInput(presetAddress);
    setInputError(null);
    onInitiateScan(presetAddress);
  };

  return (
    <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge & Logo */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative mb-4 group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/30 bg-[#080b11]">
            <img
              src="/logo.png"
              alt="Explorer Bot"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Bohr Network Ledger Intelligence & Threat Radar</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-none">
        DECODE YOUR WALLET. <br />
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-500 bg-clip-text text-transparent glow-text-cyan">
          DEFEND YOUR ASSETS.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-10 leading-relaxed">
        Scan any Bohr Testnet wallet to expose dangerous contract approvals, uncover lifetime gas burned,
        calculate peak net worth, and generate a viral <span className="text-cyan-400 font-semibold">On-Chain Wrapped</span> card.
      </p>

      {/* Search Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center p-2 rounded-2xl glass-panel-glow border border-cyan-500/40 shadow-2xl">
          <Search className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (inputError) setInputError(null);
            }}
            placeholder="Enter EVM wallet address (0x...)"
            className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isScanning}
            className="shrink-0 flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-cyan-200" />
            <span className="hidden sm:inline">Scan Wallet</span>
            <span className="sm:hidden">Scan</span>
          </button>
        </div>

        {inputError && (
          <p className="text-red-400 text-xs mt-2 text-left font-mono pl-4 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            {inputError}
          </p>
        )}
      </form>

      {/* Quick Self-Scan Trigger */}
      {isConnected && connectedAddress && (
        <div className="mb-8">
          <button
            onClick={handleScanSelf}
            className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono py-1 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Scan My Connected Wallet ({connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)})</span>
          </button>
        </div>
      )}

      {/* Preset Demo Wallets */}
      <div className="pt-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-3">
          Or Test With Curated Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset.address)}
              className="glass-panel glass-card-hover p-3.5 rounded-xl border border-white/10 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-semibold font-mono">
                  {preset.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
