import { defineChain } from "viem";

/**
 * BOT Chain Mainnet Definition
 * Chain ID: 677
 * RPC: https://rpc.botchain.ai
 * Native Token: BOT
 * Total Supply: 150 Million
 * Explorer: https://scan.botchain.ai
 */
export const botchainMainnet = defineChain({
  id: 677,
  name: "BOT Chain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Botchain Token",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
    public: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BotScan",
      url: "https://scan.botchain.ai",
      apiUrl: "https://scan.botchain.ai/api",
    },
  },
  testnet: false,
});
