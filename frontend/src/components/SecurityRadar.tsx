"use client";

import React, { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink,
  Flame,
  XCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { SecurityAudit, TokenHolding } from "@/types/scanner";
import { RevokeModal } from "./RevokeModal";
import { DrainSimulator } from "./DrainSimulator";

interface SecurityRadarProps {
  security: SecurityAudit;
  targetAddress: string;
  tokens?: TokenHolding[];
}

export function SecurityRadar({ security, targetAddress, tokens = [] }: SecurityRadarProps) {
  const [revokedIds, setRevokedIds] = useState<string[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);

  const handleRevokeSuccess = (id: string) => {
    setRevokedIds((prev) => [...prev, id]);
  };

  const getThreatBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "HIGH":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Security Overview Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Health Score Dial */}
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${
                    security.healthScore >= 80
                      ? "stroke-emerald-400"
                      : security.healthScore >= 60
                      ? "stroke-amber-400"
                      : "stroke-red-400"
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - security.healthScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
                  {security.healthScore}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  / 100 Health
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getThreatBadge(
                    security.threatLevel
                  )}`}
                >
                  {security.threatLevel} RISK
                </span>
                <span className="text-xs text-slate-400">On-Chain Audit</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                Wallet Defense & Drainer Radar
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {security.riskSummary}
              </p>
            </div>
          </div>

          {/* Key Metrics Quick Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Unlimited Approvals</span>
              <span
                className={`text-lg font-bold font-mono ${
                  security.unlimitedApprovalsCount > 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {security.unlimitedApprovalsCount}
              </span>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Spam Airdrops</span>
              <span
                className={`text-lg font-bold font-mono ${
                  security.spamAirdropsCount > 0 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {security.spamAirdropsCount}
              </span>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Threat Vector</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {security.threatLevel === "SAFE" ? "Zero" : "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Worst-Case Drain Simulator */}
      <DrainSimulator security={security} tokens={tokens} />

      {/* Active Approvals Radar & 1-Click Revoke */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h4 className="text-base font-bold text-white">
              Active Token Approvals ({security.approvals.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Unlimited approvals expose your wallet to contract drainers
          </span>
        </div>

        {security.approvals.length === 0 ? (
          <div className="py-8 text-center bg-black/20 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No Risky Approvals Detected</p>
            <p className="text-xs text-slate-400 mt-1">
              Your wallet currently has zero unlimited approvals to unverified third parties.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Token Asset</th>
                  <th className="pb-3">Authorized Spender</th>
                  <th className="pb-3">Allowance</th>
                  <th className="pb-3">Risk Assessment</th>
                  <th className="pb-3 text-right">Defense Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {security.approvals.map((app) => {
                  const isRevoked = revokedIds.includes(app.id);

                  return (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="font-semibold text-white">{app.tokenName}</div>
                        <div className="text-[11px] font-mono text-cyan-400/80">
                          {app.tokenSymbol} ({app.tokenAddress.slice(0, 6)}...{app.tokenAddress.slice(-4)})
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="font-medium text-slate-200">{app.spenderName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {app.spenderAddress.slice(0, 8)}...{app.spenderAddress.slice(-6)}
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            app.isUnlimited
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {app.allowance}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3 max-w-xs">
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {app.riskReason}
                        </p>
                      </td>

                      <td className="py-3.5 text-right">
                        {isRevoked ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Revoked
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedApproval(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs transition-all hover:scale-105 active:scale-95"
                          >
                            <Shield className="w-3.5 h-3.5 text-red-400" />
                            <span>1-Click Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spam & Phishing Warning Banner */}
      {security.spamTokens.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h4 className="text-sm font-bold text-red-300">
                Phishing & Scam Tokens Detected ({security.spamTokens.length})
              </h4>
              <p className="text-xs text-red-200/80">
                These malicious tokens were airdropped to lure users to phishing websites.
                Do NOT visit their domains or attempt to swap them on DEX routers.
              </p>

              <div className="space-y-2 pt-2">
                {security.spamTokens.map((spam, i) => (
                  <div
                    key={i}
                    className="p-3 bg-black/40 border border-red-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{spam.tokenName}</span>
                      <span className="text-slate-400 ml-2 font-mono">({spam.balance} {spam.tokenSymbol})</span>
                      <p className="text-[11px] text-red-400 mt-0.5">{spam.warning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          Proactive Defense Recommendations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {security.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-slate-300 flex items-start gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revoke Modal Trigger */}
      {selectedApproval && (
        <RevokeModal
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onSuccess={handleRevokeSuccess}
        />
      )}
    </div>
  );
}
