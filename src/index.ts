import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import {
  getNFTBalance,
  getWalletPnL,
  getTokenBalance,
  getTokenSummary,
} from "./api/vybeApi";

import {
  formatNFTMessage,
  formatPnLMessage,
  formatTokenBalanceMessage,
  formatTopTokensMessage,
} from "./utils/formartMessages";
import { json } from "stream/consumers";

// Load environment variables once at startup
dotenv.config();

// Validate environment variables early
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const apiKey = process.env.VYBE_API_KEY;

if (!botToken || !apiKey) {
  console.error(
    "Missing required environment variables: TELEGRAM_BOT_TOKEN or VYBE_API_KEY"
  );
  process.exit(1);
}

// Create bot instance
const bot = new Telegraf(botToken);
bot.start((ctx) => {
  const welcomeMessage =
    `🚀 Welcome to Vybe Network Bot!\n\n` +
    `Get real-time crypto insights with these commands:\n` +
    `/nft <wallet> - Check NFT balances\n` +
    `/pnl <wallet> - Get profit/loss analysis\n` +
    `/tokens <wallet> - View token balances\n` +
    `/top - See top tokens\n` +
    `/alphavybe - Link to AlphaVybe analytics`;
  return ctx.reply(welcomeMessage);
});

// Command handler implementations
const handleNFTCommand = async (ctx: {
  message: { text: string };
  reply: (arg0: string) => any;
}) => {
  const walletAddress = ctx.message.text.split(" ")[1];
  if (!walletAddress) {
    return ctx.reply("Please provide a wallet address. Example: /nft D8v6W...");
  }

  try {
    const nftData = await getNFTBalance(walletAddress, apiKey);
    await ctx.reply(formatNFTMessage(nftData, walletAddress));
  } catch (error) {
    console.error("NFT command error:", error);
    await ctx.reply(
      "Failed to fetch NFT data. Please check the wallet address and try again."
    );
  }
};

const handlePnLCommand = async (ctx: {
  message: { text: string };
  reply: (arg0: string) => any;
}) => {
  const walletAddress = ctx.message.text.split(" ")[1];
  if (!walletAddress) {
    return ctx.reply("Please provide a wallet address. Example: /pnl D8v6W...");
  }

  try {
    const pnlData = await getWalletPnL(walletAddress, apiKey);
    await ctx.reply(formatPnLMessage(pnlData, walletAddress));
  } catch (error) {
    console.error("PnL command error:", error);
    await ctx.reply(
      "Failed to fetch PnL data. Please check the wallet address and try again."
    );
  }
};

const handleTokensCommand = async (ctx: {
  message: { text: string };
  reply: (arg0: string) => any;
}) => {
  const walletAddress = ctx.message.text.split(" ")[1];
  if (!walletAddress) {
    return ctx.reply(
      "Please provide a wallet address. Example: /tokens D8v6W..."
    );
  }

  try {
    const tokenData = await getTokenBalance(walletAddress, apiKey);
    console.log("Tokens data:", tokenData);
    await ctx.reply(formatTokenBalanceMessage(tokenData, walletAddress));
  } catch (error) {
    console.error("Tokens command error:", error);
    await ctx.reply(
      "Failed to fetch token data. Please check the wallet address and try again."
    );
  }
};

const handleTopCommand = async (ctx: { reply: (arg0: string) => any }) => {
  try {
    const tokenData = await getTokenSummary(apiKey);
    const newData = Object.values(tokenData);
    await ctx.reply(formatTopTokensMessage(newData[0]));
  } catch (error) {
    console.error("Top tokens command error:", error);
    await ctx.reply("Failed to fetch top tokens data. Please try again later.");
  }
};

// Register command handlers

bot.command("nft", handleNFTCommand);
bot.command("pnl", handlePnLCommand);
bot.command("tokens", handleTokensCommand);
bot.command("top", handleTopCommand);
bot.command("alphavybe", (ctx) => {
  return ctx.reply(
    "🔍 Dive deeper with AlphaVybe analytics:\nhttps://alphavybe.com"
  );
});

// Add debug logging for messages
bot.on("message", (ctx) => {
  console.log("Received message:", ctx.message);
  // Let other handlers process the message
  return;
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply("An error occurred. Please try again later.");
});

// Log bot startup
console.log("Starting bot...");

console.log(
  "Using bot token:",
  botToken.substring(0, 5) + "..." + botToken.substring(botToken.length - 5)
);

// Launch bot with webhook support
bot
  .launch({
    allowedUpdates: ["message", "callback_query", "inline_query"],
    dropPendingUpdates: true,
  })
  .then(() => {
    console.log("Bot connected to Telegram API");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });

// Enable graceful stop
process.once("SIGINT", () => {
  console.log("Bot shutting down (SIGINT)");
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  console.log("Bot shutting down (SIGTERM)");
  bot.stop("SIGTERM");
});
