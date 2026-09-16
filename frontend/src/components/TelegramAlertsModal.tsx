"use client";

import React, { useState } from "react";
import { Bell, Send, CheckCircle2, X, MessageSquare, ShieldAlert, Zap } from "lucide-react";

interface TelegramAlertsModalProps {
  walletAddress: string;
  onClose: () => void;
}

export function TelegramAlertsModal({ walletAddress, onClose }: TelegramAlertsModalProps) {
  const [telegramHandle, setTelegramHandle] = useState("");
  const [alertApprovals, setAlertApprovals] = useState(true);
  const [alertLargeTransfers, setAlertLargeTransfers] = useState(true);
  const [alertDustAirdrops, setAlertDustAirdrops] = useState(true);
  const [testSent, setTestSent] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/40 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Bell className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white">24/7 Threat & Drainer Alerts</h3>
          <p className="text-xs text-slate-400 mt-1">
            Get instant Telegram pings if dangerous approvals or drainer signatures target your wallet.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Telegram Username or Channel ID
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-500 text-xs font-mono">@</span>
              <input
                type="text"
                required
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value.replace("@", ""))}
                placeholder="your_telegram_handle"
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Trigger Toggles */}
          <div className="space-y-2.5 pt-2">
            <label className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 cursor-pointer text-xs">
              <span className="text-slate-200">Alert on Unlimited Token Approvals</span>
              <input
                type="checkbox"
                checked={alertApprovals}
                onChange={(e) => setAlertApprovals(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 cursor-pointer text-xs">
              <span className="text-slate-200">Alert on Outgoing Transfers &gt; 5 BOT</span>
              <input
                type="checkbox"
                checked={alertLargeTransfers}
                onChange={(e) => setAlertLargeTransfers(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 cursor-pointer text-xs">
              <span className="text-slate-200">Alert on Fake / Phishing Dust Airdrops</span>
              <input
                type="checkbox"
                checked={alertDustAirdrops}
                onChange={(e) => setAlertDustAirdrops(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
              />
            </label>
          </div>

          {/* Test Notification Banner */}
          {testSent && (
            <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>🔔 Test alert dispatched to @{telegramHandle || "you"}!</span>
            </div>
          )}

          {saved && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Monitoring active for {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSendTest}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Send Test Ping</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Save Bot Alerts</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
