// Type definitions
export interface NFTBalance {
  date: number;
  ownerAddress: string;
  totalSol: string;
  totalUsd: string;
  totalNftCollectionCount: number;
  data: Array<{
    name: string;
    // Add other NFT properties you might have
  }>;
}

export type PnLData = {
  pnl: {
    "1d": number;
    "7d": number;
    "30d": number;
  };
  positions: Array<{
    token: string;
    symbol: string;
    amount: number;
    value: number;
    pnl: number;
  }>;
};

export interface TokenBalance {
  date: number;
  ownerAddress: string;
  stakedSolBalanceUsd: string;
  stakedSolBalance: string;
  activeStakedSolBalanceUsd: string;
  activeStakedSolBalance: string;
  totalTokenValueUsd: string;
  totalTokenValueUsd1dChange: string;
  totalTokenCount: number;
  data: Array<{
    symbol: string;
    name: string;
    amount: string;
    priceUsd: string;
    valueUsd: string;
    valueUsd1dChange: string;
    logoUrl: string;
    // Other token properties...
  }>;
}

export interface Token {
  symbol: string;
  name: string;
  mintAddress: string;
  price: number;
  price1d: number;
  price7d: number;
  decimal: number;
  logoUrl: string | null;
  category: string | null;
  subcategory: string | null;
  verified: boolean;
  updateTime: number;
  currentSupply: number;
  marketCap: number;
  tokenAmountVolume24h: number | null;
  usdValueVolume24h: number | null;
}

export interface PnLSummary {
  winRate: number;
  realizedPnlUsd: number;
  unrealizedPnlUsd: number;
  uniqueTokensTraded: number;
  averageTradeUsd: number;
  tradesCount: number;
  winningTradesCount: number;
  losingTradesCount: number;
  tradesVolumeUsd: number;
  bestPerformingToken: TokenPerformance | null;
  worstPerformingToken: TokenPerformance | null;
  pnlTrendSevenDays: PnLTrend[];
}

interface TokenPerformance {
  symbol: string;
  pnlUsd: number;
}

interface PnLTrend {
  date: string;
  pnlUsd: number;
}

interface TokenMetric {
  symbol: string;
  value: number;
  pnl: number;
  // Add other fields as needed
}

// The actual data structure being received
export interface ActualPnLData {
  summary: PnLSummary;
  tokenMetrics: TokenMetric[];
}
