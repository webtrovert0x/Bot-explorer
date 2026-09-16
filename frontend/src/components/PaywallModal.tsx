"use client";

import React, { useState } from "react";
import { useAccount, useSendTransaction, useBalance } from "wagmi";
import { parseEther, formatUnits } from "viem";
import { useAppKit } from "@reown/appkit/react";
import { Shield, Zap, X, AlertCircle, CheckCircle2, RefreshCw, Flame, Sparkles } from "lucide-react";
import { bohrTestnet } from "@/config/chains";

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
    chainId: bohrTestnet.id,
  });

  const SCAN_FEE_BOT = process.env.NEXT_PUBLIC_SCAN_FEE_BOT || "0.1";
  const TREASURY_RECIPIENT =
    process.env.NEXT_PUBLIC_PAYMENT_CONTRACT !== "0x0000000000000000000000000000000000000000" &&
    process.env.NEXT_PUBLIC_PAYMENT_CONTRACT
      ? (process.env.NEXT_PUBLIC_PAYMENT_CONTRACT as `0x${string}`)
      : ("0x39a3fF76e93D6d0B8D9197793d567f7e914041a9" as `0x${string}`);

  const handlePay = async () => {
    if (!isConnected) {
      open();
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Execute 0.1 BOT payment transaction on Bohr Testnet
      await sendTransactionAsync({
        to: TREASURY_RECIPIENT,
        value: parseEther(SCAN_FEE_BOT),
      });

      // Successful payment
      onPaymentSuccess();
    } catch (err: any) {
      console.warn("Payment error or user rejected:", err);
      // If user has no testnet gas or rejected, offer friendly explanation
      setErrorMsg(
        err?.shortMessage ||
          err?.message ||
          "Transaction was rejected or insufficient BOT balance on Bohr Testnet."
      );
      setIsProcessing(false);
    }
  };

  const handleDemoBypass = () => {
    // Allows testing the intelligence dossier without spending testnet funds
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/40 text-white shadow-2xl">
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
            Unlock Intelligence Dossier
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Deep security radar, drainer defense, and on-chain wrapped
          </p>
        </div>

        {/* Target Address Card */}
        <div className="p-3.5 bg-black/50 rounded-2xl border border-white/10 mb-5 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">
            Target Address to Scan
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 truncate block mt-0.5">
            {targetAddress}
          </span>
        </div>

        {/* Value Highlights List */}
        <div className="space-y-2 mb-6 text-xs text-slate-300 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>0–100 Wallet Health & Drainer Exposure Audit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Active Unlimited Token Approvals & Revoke Tool</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Spotify-style "On-Chain Wrapped" & Persona Badges</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Lifetime Gas Sacrificed & Peak Net Worth Milestones</span>
          </div>
        </div>

        {/* Price & Balance Summary */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Scan Fee</span>
              <span className="text-lg font-bold font-mono text-white">
                {SCAN_FEE_BOT} BOT
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Your Balance</span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(3) : "0.000"} BOT
            </span>
          </div>
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
                Or continue with Instant Free Demo Preview →
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isConnected ? (
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Authorizing 0.1 BOT in Wallet...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-cyan-200" />
                  <span>Pay {SCAN_FEE_BOT} BOT & Unlock Dossier</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => open()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:scale-[1.01] transition-all"
            >
              <span>Connect Wallet to Pay 0.1 BOT</span>
            </button>
          )}

          <button
            onClick={handleDemoBypass}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Instant Free Demo Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
