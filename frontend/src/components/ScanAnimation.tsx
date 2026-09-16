"use client";

import React, { useEffect, useState } from "react";
import { Shield, Search, Database, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

interface ScanAnimationProps {
  targetAddress: string;
  onComplete: () => void;
}

const SCAN_STEPS = [
  { label: "Connecting to Bohr Testnet RPC (Chain ID 968)...", icon: Database },
  { label: "Querying native BOT balance & transaction nonces...", icon: Cpu },
  { label: "Auditing token approvals & drainer exposure...", icon: Shield },
  { label: "Calculating lifetime gas burned & peak ATH net worth...", icon: Search },
  { label: "Compiling On-Chain Wrapped intelligence dossier...", icon: Sparkles },
];

export function ScanAnimation({ targetAddress, onComplete }: ScanAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 700);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / SCAN_STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/40 text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Radar Spinner */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-6">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-cyan-500/40" />
          <div className="absolute inset-4 rounded-full border border-purple-500/30" />
          
          {/* Sweeping radar hand */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="w-full h-full origin-bottom-right animate-radar-sweep bg-gradient-to-tr from-cyan-400/30 via-transparent to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white tracking-wide mb-1 glow-text-cyan">
          EXECUTING ON-CHAIN AUDIT
        </h3>
        <p className="text-xs font-mono text-cyan-300/80 mb-6 truncate max-w-xs mx-auto">
          Target: {targetAddress}
        </p>

        {/* Step List */}
        <div className="space-y-3 text-left mb-6 bg-black/40 p-4 rounded-xl border border-white/5">
          {SCAN_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isDone
                    ? "text-emerald-400 opacity-90"
                    : isCurrent
                    ? "text-cyan-300 font-semibold scale-[1.02]"
                    : "text-slate-600 opacity-40"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isCurrent ? "text-cyan-400 animate-spin" : "text-slate-600"
                    }`}
                  />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-cyan-500/20">
          <div
            className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-mono">
          <span>DEEP LEDGER ANALYSIS</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
}
