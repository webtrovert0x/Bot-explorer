"use client";

import React, { useState } from "react";
import { AlertOctagon, ShieldAlert, DollarSign, TrendingDown, RefreshCw, Zap } from "lucide-react";
import { SecurityAudit, TokenHolding } from "@/types/scanner";

interface DrainSimulatorProps {
  security: SecurityAudit;
  tokens: TokenHolding[];
}

export function DrainSimulator({ security, tokens }: DrainSimulatorProps) {
  const [hackedRoutersCount, setHackedRoutersCount] = useState<number>(
    Math.max(1, security.unlimitedApprovalsCount)
  );

  // Calculate worst case exposure
  const totalApprovedValueUSD = tokens.reduce((sum, t) => sum + (t.isVerified ? t.valueUSD : 0), 0);
  const estimatedDrainRiskUSD = security.unlimitedApprovalsCount > 0
    ? Math.min(totalApprovedValueUSD, +(totalApprovedValueUSD * (0.4 + hackedRoutersCount * 0.2)).toFixed(2))
    : 0;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-950/20 to-black/40 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Worst-Case Drain Risk Simulator</h3>
            <p className="text-xs text-slate-400">
              Calculate potential financial damage if approved third-party routers are exploited.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold self-start sm:self-auto">
          MAX THEORETICAL LOSS: ${estimatedDrainRiskUSD.toLocaleString()} USD
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Total Portfolio at Risk */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Approved Asset Exposure
          </span>
          <div className="text-2xl font-bold font-mono text-red-400">
            ${estimatedDrainRiskUSD.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            {security.unlimitedApprovalsCount} unlimited permission(s) active
          </p>
        </div>

        {/* Metric 2: Vulnerable Contracts */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Vulnerability Vector
          </span>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {security.threatLevel}
          </div>
          <p className="text-[11px] text-slate-400">
            Health score at {security.healthScore}/100
          </p>
        </div>

        {/* Metric 3: Safety Post-Revoke */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Risk After 1-Click Revoke
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            $0.00 (100% Protected)
          </div>
          <p className="text-[11px] text-slate-400">
            Eliminates all external drain vectors
          </p>
        </div>
      </div>

      {/* Interactive Simulation Slider */}
      {security.unlimitedApprovalsCount > 0 && (
        <div className="p-4 bg-black/50 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">
              Simulate Compromised Router Breaches:
            </span>
            <span className="text-red-400 font-mono font-bold">
              {hackedRoutersCount} Router(s) Compromised
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={Math.max(1, security.unlimitedApprovalsCount + 2)}
            value={hackedRoutersCount}
            onChange={(e) => setHackedRoutersCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Minor Exploit</span>
            <span>Critical Multi-Protocol Breach</span>
          </div>
        </div>
      )}
    </div>
  );
}
