export type RiskLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TokenApproval {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  spenderName: string;
  spenderAddress: string;
  allowance: string;
  isUnlimited: boolean;
  riskLevel: RiskLevel;
  riskReason: string;
  lastUpdated: string;
}

export interface SpamDetection {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  balance: string;
  warning: string;
  isHoneypot: boolean;
  phishingUrl?: string;
}

export interface SecurityAudit {
  healthScore: number; // 0 - 100
  riskSummary: string;
  threatLevel: RiskLevel;
  unlimitedApprovalsCount: number;
  compromisedInteractionsCount: number;
  spamAirdropsCount: number;
  approvals: TokenApproval[];
  spamTokens: SpamDetection[];
  recommendations: string[];
}

export interface DeFiPersona {
  title: string;
  icon: string;
  badgeColor: string;
  description: string;
}

export interface OnchainWrapped {
  originDate: string;
  walletAgeDays: number;
  genesisTxHash: string;
  firstFunder: string;
  firstTokenInteracted: string;
  lifetimeGasBurnedBOT: number;
  lifetimeGasBurnedUSD: number;
  totalTransactionsCount: number;
  athNetWorthUSD: number;
  athDate: string;
  mostActiveMonth: string;
  primaryDeFiProtocol: string;
  personas: DeFiPersona[];
}

export interface TokenHolding {
  name: string;
  symbol: string;
  address: string;
  balance: number;
  priceUSD: number;
  valueUSD: number;
  change24h: number;
  isVerified: boolean;
  iconUrl?: string;
}

export interface NFTItem {
  id: string;
  name: string;
  collection: string;
  contractAddress: string;
  tokenId: string;
  imageUrl: string;
  floorPriceBOT: number;
  floorPriceUSD: number;
  rarityRank?: number;
}

export interface TransactionRecord {
  hash: string;
  type: "SEND" | "RECEIVE" | "SWAP" | "APPROVE" | "MINT" | "CONTRACT_CALL";
  from: string;
  to: string;
  valueBOT: number;
  gasUsedBOT: number;
  timestamp: string;
  status: "SUCCESS" | "FAILED";
  methodName?: string;
}

export interface WalletScanReport {
  address: string;
  ensOrAlias?: string;
  network: string;
  chainId: number;
  scanTimestamp: string;
  nativeBalanceBOT: number;
  nativeBalanceUSD: number;
  totalPortfolioUSD: number;
  security: SecurityAudit;
  wrapped: OnchainWrapped;
  tokens: TokenHolding[];
  nfts: NFTItem[];
  recentTransactions: TransactionRecord[];
  isPaid: boolean;
}
