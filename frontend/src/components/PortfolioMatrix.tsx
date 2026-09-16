"use client";

import React, { useState } from "react";
import { Coins, Image as ImageIcon, Filter, Sparkles, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { TokenHolding, NFTItem } from "@/types/scanner";

interface PortfolioMatrixProps {
  tokens: TokenHolding[];
  nfts: NFTItem[];
  totalPortfolioUSD: number;
}

export function PortfolioMatrix({ tokens, nfts, totalPortfolioUSD }: PortfolioMatrixProps) {
  const [activeTab, setActiveTab] = useState<"TOKENS" | "NFTS">("TOKENS");
  const [hideSpam, setHideSpam] = useState(true);

  const filteredTokens = hideSpam ? tokens.filter((t) => t.isVerified) : tokens;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white">Asset Portfolio Matrix</h3>
          <p className="text-xs text-slate-400">
            Estimated Total Value:{" "}
            <span className="text-cyan-400 font-mono font-bold">
              ${totalPortfolioUSD.toLocaleString()} USD
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("TOKENS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "TOKENS"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Tokens ({tokens.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("NFTS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "NFTS"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>NFTs ({nfts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOKENS VIEW */}
      {activeTab === "TOKENS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideSpam}
                onChange={(e) => setHideSpam(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
              />
              <span>Filter Phishing & Dust Airdrops</span>
            </label>

            <span>Displaying {filteredTokens.length} assets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px] font-semibold">
                  <th className="pb-3">Asset</th>
                  <th className="pb-3 text-right">Balance</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">24h</th>
                  <th className="pb-3 text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTokens.map((token, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-400 font-mono">
                          {token.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span>{token.name}</span>
                            {!token.isVerified && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
                                UNVERIFIED / DUST
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {token.symbol}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 text-right font-mono font-semibold text-white">
                      {token.balance.toLocaleString()} {token.symbol}
                    </td>

                    <td className="py-3.5 text-right font-mono text-slate-300">
                      ${token.priceUSD.toFixed(2)}
                    </td>

                    <td className="py-3.5 text-right font-mono">
                      <span
                        className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                          token.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {token.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {token.change24h > 0 ? `+${token.change24h}%` : `${token.change24h}%`}
                      </span>
                    </td>

                    <td className="py-3.5 text-right font-mono font-bold text-cyan-300">
                      ${token.valueUSD.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NFTS VIEW */}
      {activeTab === "NFTS" && (
        <div>
          {nfts.length === 0 ? (
            <div className="py-12 text-center bg-black/20 rounded-xl border border-white/5">
              <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No NFTs Found in Wallet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 hover:border-purple-500/40 transition-all group"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30 font-mono">
                      #{nft.tokenId}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      {nft.collection}
                    </span>
                    <h5 className="font-bold text-sm text-white truncate">{nft.name}</h5>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-slate-400">Floor Price</span>
                      <div className="text-right font-mono">
                        <span className="text-amber-300 font-bold">{nft.floorPriceBOT} BOT</span>
                        <span className="text-slate-500 text-[10px] block">(${nft.floorPriceUSD} USD)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
