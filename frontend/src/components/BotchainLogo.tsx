"use client";

import React from "react";

interface BotchainLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export function BotchainLogo({
  className = "",
  size = 24,
  withText = false,
}: BotchainLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-lg overflow-hidden shrink-0 border border-cyan-500/30 bg-[#080d18] shadow-md shadow-cyan-500/20"
        style={{ width: size, height: size }}
      >
        <img
          src="/botchain.jpeg"
          alt="BOT Chain Logo"
          className="w-full h-full object-cover"
        />
      </div>
      {withText && (
        <span className="font-extrabold tracking-wide text-white text-xs sm:text-sm">
          BOT<span className="text-cyan-400">CHAIN</span>
        </span>
      )}
    </div>
  );
}
