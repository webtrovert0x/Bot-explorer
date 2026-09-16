import { defineChain } from "viem";

/**
 * Bohr Testnet Custom Chain Definition
 * Chain ID: 968
 * RPC: https://rpc.bohr.life
 * Native Token: BOT
 * Explorer: https://scan.bohr.life/
 */
export const bohrTestnet = defineChain({
  id: 968,
  name: "Bohr Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Bohr Token",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
    public: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "BohrScan",
      url: "https://scan.bohr.life",
      apiUrl: "https://scan.bohr.life/api",
    },
  },
  testnet: true,
});
