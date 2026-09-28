"use client";

import React, { useState } from "react";
import { useAccount, useSendTransaction, useBalance } from "wagmi";
import { parseEther, formatUnits } from "viem";
import { useAppKit } from "@reown/appkit/react";
import { Shield, Zap, X, AlertCircle, CheckCircle2, RefreshCw, Flame, Sparkles } from "lucide-react";
import { botchainMainnet } from "@/config/chains";

interface PaywallModalProps {
  targetAddress: string;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

export function PaywallModal({
  targetAddress,
  onPaymentSuccess,
  onClose,
}: PaywallModalProps) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { sendTransactionAsync } = useSendTransaction();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: balance } = useBalance({
    address: address,
    chainId: botchainMainnet.id,
  });

  const SCAN_FEE_BOT = process.env.NEXT_PUBLIC_SCAN_FEE_BOT || "0.1";
  const TREASURY_RECIPIENT =
    process.env.NEXT_PUBLIC_PAYMENT_CONTRACT !== "0x0000000000000000000000000000000000000000" &&
    process.env.NEXT_PUBLIC_PAYMENT_CONTRACT
      ? (process.env.NEXT_PUBLIC_PAYMENT_CONTRACT as `0x${string}`)
      : ("0x39a3fF76e93D6d0B8D9197793d567f7e914041a9" as `0x${string}`);

  const [scanType, setScanType] = useState<"FREE" | "PRO">("FREE");

  const handleExecuteScan = async (selectedType: "FREE" | "PRO") => {
    if (!isConnected) {
      open();
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (selectedType === "PRO") {
        // Execute 0.1 BOT pro payment transaction
        await sendTransactionAsync({
          to: TREASURY_RECIPIENT,
          value: parseEther(SCAN_FEE_BOT),
        });
      } else {
        // Execute Gas-Only Free Tier On-Chain Scan (0 BOT value)
        await sendTransactionAsync({
          to: TREASURY_RECIPIENT,
          value: parseEther("0"),
        });
      }

      // Successful transaction confirmed
      onPaymentSuccess();
    } catch (err: any) {
      console.warn("Transaction error or user rejected:", err);
      setErrorMsg(
        err?.shortMessage ||
          err?.message ||
          "Transaction was cancelled or rejected in wallet."
      );
      setIsProcessing(false);
    }
  };

  const handleDemoBypass = () => {
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/40 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#080b11] rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            Choose Scan Tier
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Execute an on-chain verified scan on BOT Chain Mainnet
          </p>
        </div>

        {/* Target Address Card */}
        <div className="p-3 bg-black/50 rounded-2xl border border-white/10 mb-5 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">
            Target Address to Scan
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 truncate block mt-0.5">
            {targetAddress}
          </span>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* FREE TIER CARD */}
          <div
            onClick={() => setScanType("FREE")}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              scanType === "FREE"
                ? "bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Free Tier</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                Gas Only
              </span>
            </div>
            <div className="text-lg font-black font-mono text-white mb-1">0 BOT</div>
            <p className="text-[11px] text-slate-400 leading-tight">
              On-chain scan registration. You pay only standard network gas (~0.0004 BOT).
            </p>
          </div>

          {/* PRO TIER CARD */}
          <div
            onClick={() => setScanType("PRO")}
            className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden ${
              scanType === "PRO"
                ? "bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/20"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
              Full Access
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-300">Pro Deep Scan</span>
            </div>
            <div className="text-lg font-black font-mono text-white mb-1">{SCAN_FEE_BOT} BOT</div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Full drainer risk audit, 1-click revoke tool, worst-case exploit sim & wrapped badge.
            </p>
          </div>
        </div>

        {/* Feature Checklist */}
        <div className="space-y-2 mb-6 text-xs text-slate-300 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>0–100 Wallet Health Score & Basic Summary</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${scanType === "PRO" ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={scanType === "PRO" ? "text-slate-200" : "text-slate-500"}>
              Active Token Approvals & 1-Click Revoke Assistant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${scanType === "PRO" ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={scanType === "PRO" ? "text-slate-200" : "text-slate-500"}>
              Drain Simulator & Worst-Case Exploit Assessment
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${scanType === "PRO" ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={scanType === "PRO" ? "text-slate-200" : "text-slate-500"}>
              Spotify-Style On-Chain Wrapped & Shareable Infographic
            </span>
          </div>
        </div>

        {/* Balance & Fee */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs font-mono">
          <span className="text-slate-400">Your Wallet Balance:</span>
          <span className="font-bold text-cyan-400">
            {balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4) : "0.0000"} BOT
          </span>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="leading-tight">{errorMsg}</p>
              <button
                onClick={handleDemoBypass}
                className="mt-2 text-[11px] text-cyan-300 underline font-semibold block"
              >
                Or continue with Instant Demo Preview →
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isConnected ? (
            <button
              onClick={() => handleExecuteScan(scanType)}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 ${
                scanType === "PRO"
                  ? "bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 text-white shadow-purple-500/25"
                  : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25"
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Confirming in Wallet...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  <span>
                    {scanType === "PRO"
                      ? `Pay ${SCAN_FEE_BOT} BOT & Start Pro Scan`
                      : "Start Free On-Chain Scan (Gas Only)"}
                  </span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => open()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:scale-[1.01] transition-all"
            >
              <span>Connect Wallet to Scan</span>
            </button>
          )}

          <button
            onClick={handleDemoBypass}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Demo Preview (No Tx)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
