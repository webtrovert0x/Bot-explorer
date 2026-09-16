"use client";

import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Shield, CheckCircle2, AlertTriangle, RefreshCw, X, ArrowUpRight } from "lucide-react";
import { TokenApproval } from "@/types/scanner";

interface RevokeModalProps {
  approval: TokenApproval;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

// Standard ERC20 ABI for approve
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export function RevokeModal({ approval, onClose, onSuccess }: RevokeModalProps) {
  const { data: hash, writeContractAsync, isPending, error } = useWriteContract();
  const [isSuccessLocal, setIsSuccessLocal] = useState(false);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleExecuteRevoke = async () => {
    try {
      await writeContractAsync({
        address: approval.tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [approval.spenderAddress as `0x${string}`, BigInt(0)],
      });
      setIsSuccessLocal(true);
      onSuccess(approval.id);
    } catch (err) {
      console.error("Revoke error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border border-red-500/40 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <Shield className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Revoke Token Allowance</h3>
          <p className="text-xs text-slate-400 mt-1">
            Setting allowance to 0 protects your tokens from third-party drainer exploits.
          </p>
        </div>

        {/* Details Card */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3 mb-6 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Token:</span>
            <span className="text-white font-bold">{approval.tokenName} ({approval.tokenSymbol})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Spender Contract:</span>
            <span className="text-cyan-400 truncate max-w-[180px]">{approval.spenderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Allowance:</span>
            <span className="text-red-400 font-bold">{approval.allowance}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/5">
            <span className="text-slate-400">New Allowance:</span>
            <span className="text-emerald-400 font-bold">0 {approval.tokenSymbol}</span>
          </div>
        </div>

        {/* Success or Error feedback */}
        {(isConfirmed || isSuccessLocal) && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Successfully revoked approval on Bohr Testnet!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate">{error.message}</span>
          </div>
        )}

        {/* Action Button */}
        {isConfirmed || isSuccessLocal ? (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase transition-all"
          >
            Done
          </button>
        ) : (
          <button
            onClick={handleExecuteRevoke}
            disabled={isPending || isConfirming}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 text-white font-bold text-xs uppercase shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending || isConfirming ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Confirming in Wallet...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Confirm Revoke (0 Gas / Fast)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
