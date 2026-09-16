import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Provider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Explorer Bot | On-Chain Intelligence, Drainer Defense & Wrapped on Bohr Network",
  description:
    "AI-powered blockchain intelligence scanner on Bohr Testnet. Audit smart contract approvals, lifetime gas burned, wallet health score, and on-chain milestones for 0.1 BOT.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06090e] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        <Web3Provider>
          <div className="relative min-h-screen flex flex-col justify-between">
            {/* Ambient Cyber Grid */}
            <div className="fixed inset-0 bg-cyber-grid bg-[size:40px_40px] pointer-events-none opacity-40 z-0" />

            <div className="relative z-10">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-8 bg-[#04060a] text-center text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">EXPLORER.BOT</span>
                  <span>•</span>
                  <span>Bohr Testnet (Chain ID 968)</span>
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <a
                    href="https://scan.bohr.life/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    BohrScan
                  </a>
                  <a
                    href="https://rpc.bohr.life"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    RPC Endpoint
                  </a>
                  <span>Scan Fee: 0.1 BOT</span>
                </div>
              </div>
            </footer>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
