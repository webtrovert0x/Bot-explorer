import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage, http } from "wagmi";
import { bohrTestnet } from "./chains";

// WalletConnect Cloud project ID (from https://cloud.reown.com)
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "c4f79cc821944d9680842e34466bfbd9";

export const networks = [bohrTestnet] as any;

// Set up Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [bohrTestnet.id]: http("https://rpc.bohr.life"),
  },
});

export const config = wagmiAdapter.wagmiConfig;

// App Metadata
export const metadata = {
  name: "Explorer Bot",
  description: "AI-Powered On-Chain Intelligence, Drainer Defense & Wallet Wrapped",
  url: "https://explorerbot.life",
  icons: ["https://scan.bohr.life/images/logo.png"],
};

// Create Reown AppKit instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: bohrTestnet,
  metadata,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#00f0ff",
    "--w3m-color-mix": "#0d131f",
    "--w3m-border-radius-master": "12px",
    "--w3m-font-family": "Inter, sans-serif",
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
  },
});
