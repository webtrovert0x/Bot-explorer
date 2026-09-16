"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Sparkles, ExternalLink, Code2 } from "lucide-react";
import { TransactionRecord } from "@/types/scanner";

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
  targetAddress: string;
}

export function TransactionHistory({ transactions, targetAddress }: TransactionHistoryProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "RECEIVE":
        return {
          icon: ArrowDownLeft,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          label: "Received",
        };
      case "SEND":
        return {
          icon: ArrowUpRight,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          label: "Sent",
        };
      case "SWAP":
        return {
          icon: RefreshCw,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
          label: "DEX Swap",
        };
      default:
        return {
          icon: Code2,
          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
          label: "Smart Contract",
        };
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white">Recent On-Chain Activity</h3>
          <p className="text-xs text-slate-400">
            Validated ledger transactions on Bohr Testnet
          </p>
        </div>

        <a
          href={`https://scan.bohr.life/address/${targetAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          <span>View on BohrScan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px] font-semibold">
              <th className="pb-3">Type / Method</th>
              <th className="pb-3">Tx Hash</th>
              <th className="pb-3">Time</th>
              <th className="pb-3 text-right">Value (BOT)</th>
              <th className="pb-3 text-right">Gas Used</th>
              <th className="pb-3 text-right">BohrScan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx, idx) => {
              const badge = getTypeBadge(tx.type);
              const Icon = badge.icon;

              return (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-lg border flex items-center justify-center ${badge.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-bold text-white block">{badge.label}</span>
                        {tx.methodName && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {tx.methodName}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 font-mono text-cyan-400/90">
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                  </td>

                  <td className="py-3.5 text-slate-400">{tx.timestamp}</td>

                  <td className="py-3.5 text-right font-mono font-bold text-white">
                    {tx.valueBOT > 0 ? `${tx.valueBOT} BOT` : "0 BOT"}
                  </td>

                  <td className="py-3.5 text-right font-mono text-slate-400 text-[11px]">
                    {tx.gasUsedBOT} BOT
                  </td>

                  <td className="py-3.5 text-right">
                    <a
                      href={`https://scan.bohr.life/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Inspect Transaction"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
