import {
  ActualPnLData,
  NFTBalance,
  PnLData,
  Token,
  TokenBalance,
} from "../types";



export const formatNFTMessage = (
  nftData: NFTBalance,
  walletAddress: string
): string => {
  // Format wallet address for display
  const displayAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  // Start building the message
  let message = `🖼 NFT Portfolio for ${displayAddress}\n\n`;
  
  // Add top NFTs (if any exist)
  if (nftData.data.length > 0) {
    nftData.data.slice(0, 5).forEach((nft) => {
      message += `• ${nft.name}\n`;
    });

    if (nftData.data.length > 5) {
      message += `\n+ ${nftData.data.length - 5} more NFTs...\n`;
    }
  } else {
    message += "No NFTs found\n";
  }

  // Add total value information
  message += `\n📊 Total Value: ${parseFloat(nftData.totalSol).toFixed(2)} SOL ($${parseFloat(nftData.totalUsd).toFixed(2)})`;
  message += `\n\n🔍 Full analysis: https://alphavybe.com/wallet/${walletAddress}`;

  return message;
};

/**
 * Formats wallet PnL data into a readable message
 *
 * @param pnlData - The PnL data from the API
 * @param walletAddress - The wallet address
 * @returns Formatted message string
 */
export const formatPnLMessage = (
  pnlData: ActualPnLData,
  walletAddress: string
): string => {
  // Truncate wallet address for readability
  const truncatedAddress = `${walletAddress.slice(
    0,
    6
  )}...${walletAddress.slice(-4)}`;

  // Calculate total PnL
  const totalPnl =
    pnlData.summary.realizedPnlUsd + pnlData.summary.unrealizedPnlUsd;

  // Start building the message
  let message = `📈 PnL Analysis for ${truncatedAddress}\n\n`;

  // Add summary section
  message += `Total PnL: $${totalPnl.toFixed(2)}\n`;
  message += `Realized PnL: $${pnlData.summary.realizedPnlUsd.toFixed(2)}\n`;
  message += `Unrealized PnL: $${pnlData.summary.unrealizedPnlUsd.toFixed(
    2
  )}\n`;

  // Add trading stats section
  message += `\n📊 Trading Stats:\n`;
  message += `Win Rate: ${(pnlData.summary.winRate * 100).toFixed(1)}%\n`;
  message += `Trades: ${pnlData.summary.tradesCount} (${pnlData.summary.winningTradesCount} wins, ${pnlData.summary.losingTradesCount} losses)\n`;
  message += `Volume: $${pnlData.summary.tradesVolumeUsd.toFixed(2)}\n`;

  // Add top positions if available
  if (pnlData.tokenMetrics && pnlData.tokenMetrics.length > 0) {
    message += `\n💼 Top Positions:\n`;
    pnlData.tokenMetrics.slice(0, 3).forEach((token) => {
      const changeEmoji = token.pnl >= 0 ? "📈" : "📉";
      message += `• ${token.symbol}: $${token.value.toFixed(
        2
      )} (${changeEmoji} $${token.pnl.toFixed(2)})\n`;
    });
  } else {
    message += `\n💼 No token positions found\n`;
  }

  // Add best/worst performers if available
  if (pnlData.summary.bestPerformingToken) {
    message += `\n🏆 Best: ${
      pnlData.summary.bestPerformingToken.symbol
    } ($${pnlData.summary.bestPerformingToken.pnlUsd.toFixed(2)})\n`;
  }

  if (pnlData.summary.worstPerformingToken) {
    message += `📉 Worst: ${
      pnlData.summary.worstPerformingToken.symbol
    } ($${pnlData.summary.worstPerformingToken.pnlUsd.toFixed(2)})\n`;
  }

  // Add link to full analysis
  message += `\n🔍 Full analysis: https://alphavybe.com/wallet/${walletAddress}`;

  return message;
};



export const formatTokenBalanceMessage = (
  tokenData: TokenBalance,
  walletAddress: string
): string => {
  const displayAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  let message = `💰 Token Balances for ${displayAddress}\n\n`;

  // Format each token
  tokenData.data.slice(0, 5).forEach((token) => {
    const amount = parseFloat(token.amount).toFixed(token.symbol === 'USDC' ? 6 : 4);
    const value = parseFloat(token.valueUsd).toFixed(4);
    
    message += `• ${token.symbol} (${token.name}): ${amount}\n` +
               `  💵 $${value} (${token.priceUsd} USD each)\n`;
  });

  // Show "+ X more" if there are additional tokens
  if (tokenData.data.length > 5) {
    message += `\n+ ${tokenData.data.length - 5} more tokens...\n`;
  }

  // Add total value information
  const totalValue = parseFloat(tokenData.totalTokenValueUsd).toFixed(4);
  const dailyChange = parseFloat(tokenData.totalTokenValueUsd1dChange).toFixed(4);
  const changePrefix = dailyChange.startsWith('-') ? '' : '+';
  
  message += `\n📊 Total Value: $${totalValue} ` +
             `(24h: ${changePrefix}$${dailyChange})`;
  message += `\n\n🔍 Full analysis: https://alphavybe.com/wallet/${walletAddress}`;

  return message;
};

export const formatTopTokensMessage = (tokenData: Token): string => {
  // Handle both TokenSummary object and raw Token array
  const tokens = Array.isArray(tokenData) ? tokenData : [];

  if (!tokens || !Array.isArray(tokens)) {
    return "❌ Invalid token data format";
  }

  // Process tokens - filter active ones with valid market caps
  const activeTokens = tokens
    .filter((token) => {
      const hasValue = token.price > 0 && token.marketCap > 0;
      const hasVolume =
        (token.usdValueVolume24h ?? 0) > 0 ||
        (token.tokenAmountVolume24h ?? 0) > 0;
      return hasValue || hasVolume;
    })
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 5);

  // Handle no active tokens case
  if (activeTokens.length === 0) {
    const topTokens = tokens
      .slice(0, 5)
      .map((t) => `• ${t.name} (${t.symbol}) - $${t.price.toFixed(6)}`);

    return [
      "🔍 No actively trading tokens found",
      "Top 5 Tokens:",
      ...topTokens,
      "View more: https://alphavybe.com/tokens",
    ].join("\n");
  }

  // Format message
  let message = `🏆 *Top ${activeTokens.length} Active Tokens* 🏆\n\n`;

  activeTokens.forEach((token, index) => {
    const rank = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][index] || `${index + 1}.`;
    const priceChange24h = token.price1d
      ? ((token.price - token.price1d) / token.price1d) * 100
      : 0;

    message += [
      `${rank} *${token.name} (${token.symbol})*`,
      `   Price: $${token.price}`,
      `   Market Cap: $${formatNumber(token.marketCap)}`,
      `   24h Change: ${formatChange(priceChange24h)}`,
      token.usdValueVolume24h
        ? `   Volume: $${formatNumber(token.usdValueVolume24h)}`
        : "",
      token.logoUrl ? `   Logo: ${truncateUrl(token.logoUrl)}` : "",
      "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return message;
};

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(2);
};

const formatChange = (change: number): string => {
  if (change > 0) return `🟢 +${change.toFixed(2)}% 📈`;
  if (change < 0) return `🔴 ${change.toFixed(2)}% 📉`;
  return `⚪ ${change.toFixed(2)}%`;
};

const truncateUrl = (url: string, maxLength = 30): string => {
  return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
};
