# ⚡ EXPLORER BOT

<p align="center">
  <img src="frontend/public/logo.png" alt="Explorer Bot Logo" width="160" style="border-radius: 24px;" />
</p>

<p align="center">
  <strong>Next-Gen On-Chain Wallet Intelligence, Drainer Defense Radar & "On-Chain Wrapped" on BOT Chain Mainnet</strong>
</p>

<p align="center">
  <a href="https://scan.botchain.ai/address/0x5D6c221eE1A0E40fa58CEBAc83A359DCde9bd34f"><img src="https://img.shields.io/badge/Mainnet%20Contract-0x5D6c...d34f-00f0ff?style=for-the-badge&logo=solidity" alt="Mainnet Contract" /></a>
  <a href="https://rpc.botchain.ai"><img src="https://img.shields.io/badge/BOT%20Chain%20ID-677-7928ca?style=for-the-badge" alt="Chain ID 677" /></a>
  <a href="https://scan.botchain.ai"><img src="https://img.shields.io/badge/Native%20Token-BOT%20(150M%20Supply)-ffd700?style=for-the-badge" alt="BOT Token" /></a>
</p>

---

## 🌟 What is Explorer Bot?

Free block explorers provide raw cryptographic ledger entries. **Explorer Bot** turns on-chain data into **actionable intelligence, drainer defense, and viral social status**.

Users connect their Web3 wallet to run a **Free On-Chain Scan** (gas only) or pay **0.1 BOT** to unlock a deep dossier featuring their 0–100 Security Health Score, active token approval drainer risks with a 1-click revoke assistant, worst-case exploit loss simulations, and a Spotify-style "On-Chain Wrapped" card.

---

## 🚀 Live BOT Chain Mainnet Deployment

| Parameter | Value |
| :--- | :--- |
| **Contract Name** | `ExplorerPayment` |
| **Mainnet Contract Address** | [`0x5D6c221eE1A0E40fa58CEBAc83A359DCde9bd34f`](https://scan.botchain.ai/address/0x5D6c221eE1A0E40fa58CEBAc83A359DCde9bd34f#code) |
| **Verification Status** | ✅ **100% Verified on BotScan** (`v0.8.20+commit.a1b79de6`, 200 runs) |
| **Network Name** | BOT Chain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Native Currency** | `BOT` (18 Decimals, 150M Total Supply) |
| **Pro Scan Fee** | `0.1 BOT` (via `payForScan`) |
| **Free Scan Fee** | `0 BOT / Gas Only` (via `registerFreeScan`) |
| **Block Explorer** | [https://scan.botchain.ai/](https://scan.botchain.ai/) |

---

## 🛡️ Core Feature Matrix

### 1. 🔍 100% Real Live On-Chain Intelligence Scanner
- **Live RPC Balance & Transaction Nonces**: Direct integration with BOT Chain RPC and BotScan API (`https://scan.botchain.ai/api/v2`).
- **Exact Genesis Origin & Age**: Uncovers first on-chain transaction hash, genesis timestamp, and founding funder address.
- **Lifetime Gas Sacrificed**: Total native BOT gas fees burned converted into USD fiat valuation.
- **Real Token Holdings**: Fetches live ERC-20 token balances with logos and decimals.

### 2. ⚡ Live 1-Click On-Chain Token Revoke Tool
- Directly triggers an ERC-20 `token.approve(spender, 0)` transaction on BOT Chain Mainnet.
- Eliminates third-party drainer risk with one click.

### 3. 📉 Worst-Case Drain Risk Simulator
- Dynamically estimates the maximum dollar ($) loss exposure if approved third-party router contracts were compromised.
- Shows how 1-click revoking reduces theoretical drain risk to **$0.00 (100% Protected)**.

### 4. 👑 "On-Chain Wrapped" & Viral Social Cards
- Computes automated DeFi persona titles: *BOT Chain Pioneer*, *Gas Contributor*, *Ecosystem Whale*, *Diamond Hands*.
- **1-Click High-Res PNG Generator**: Downloadable infographic card with direct Twitter / X and Telegram share shortcuts.

### 5. ⚔️ Wallet VS Wallet (Degen Battle Mode)
- Compare two BOT Chain wallets side-by-side (Gas Burned, Portfolio Value, Genesis Age, Health Score).
- Generates a split-screen versus card ready for social sharing.

### 6. 🏆 BOT Chain Ecosystem Leaderboard
- Real-time ranking of top wallets on BOT Chain Mainnet by **Native BOT Balance**, **Lifetime Gas Burned**, and **Genesis Age**.
- Direct 1-click "Audit" button on any row.

### 7. 🤖 24/7 Telegram & Threat Alerts
- Configure `@telegram_handle` to receive notifications on unauthorized token allowances, large transfers (> 5 BOT), and phishing airdrops.

---

## 📁 Repository Structure

```
explorer bot/
├── contracts/                          # Hardhat Solidity Workspace
│   ├── contracts/
│   │   ├── ExplorerPayment.sol         # Main 0.1 BOT pay-per-scan contract
│   │   └── ExplorerPayment_Flattened.sol # Verified flattened source
│   ├── scripts/
│   │   └── deploy.js                  # Deployment script for BOT Chain Mainnet
│   ├── test/
│   │   └── ExplorerPayment.test.js     # 6/6 Passing Hardhat unit tests
│   ├── hardhat.config.js              # BOT Chain Mainnet configuration
│   └── package.json
│
└── frontend/                           # Next.js 14 App Router (TypeScript + Tailwind)
    ├── public/
    │   ├── logo.png                   # Cybernetic Radar Logo
    │   └── icon.png
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx             # Root layout with Web3 provider & metadata
    │   │   ├── page.tsx               # Main Dashboard with Explorer, Battle & Leaderboard
    │   │   └── globals.css            # Cyber dark glassmorphic styling
    │   ├── components/
    │   │   ├── Navbar.tsx             # Brand header, network badge & connect button
    │   │   ├── HeroSearch.tsx         # Search bar, 1-click self-scan & presets
    │   │   ├── SecurityRadar.tsx      # 0-100 Health Score, Approvals & Revoke triggers
    │   │   ├── DrainSimulator.tsx     # Worst-case exploit risk simulator
    │   │   ├── RevokeModal.tsx        # Live on-chain approve(spender, 0) write flow
    │   │   ├── OnchainWrapped.tsx     # Genesis story, gas milestones & badges
    │   │   ├── ShareableCard.tsx      # High-res PNG exportable social card
    │   │   ├── PortfolioMatrix.tsx    # Token balances, dust filter & NFT showroom
    │   │   ├── WalletBattle.tsx       # Side-by-side wallet versus battle
    │   │   ├── Leaderboard.tsx        # Real live BOT Chain ecosystem rankings
    │   │   ├── TelegramAlertsModal.tsx# 24/7 wallet threat monitoring setup
    │   │   ├── ScanAnimation.tsx      # High-tech cyberpunk radar overlay
    │   │   └── PaywallModal.tsx       # 0.1 BOT payment & free demo preview
    │   ├── config/
    │   │   ├── chains.ts              # BOT Chain Mainnet definition (Chain ID 677)
    │   │   └── appkit.ts              # Reown AppKit + Wagmi setup
    │   ├── context/
    │   │   └── Web3Provider.tsx       # QueryClient + Wagmi provider
    │   ├── services/
    │   │   └── bohrScanner.ts         # Live BOT Chain RPC & BotScan API data parser
    │   └── types/
    │       └── scanner.ts             # TypeScript definitions
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 🛠️ Quickstart Guide

### 1. Smart Contracts
```bash
cd contracts

# Install dependencies
npm install

# Run unit tests
npx hardhat test

# Deploy to BOT Chain Mainnet
npx hardhat run scripts/deploy.js --network botchainMainnet
```

### 2. Frontend Application
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔒 Security & Privacy
- Sensitive private keys in `.env` and `.env.local` are strictly excluded via `.gitignore`.
- Safe template examples are provided in `contracts/.env.example` and `frontend/.env.example`.

---

## 📜 License
MIT License. Built for the **BOT Chain** ecosystem.
