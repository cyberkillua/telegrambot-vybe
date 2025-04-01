import axios from "axios";
import { ActualPnLData, NFTBalance, Token, TokenBalance } from "../types";

// Vybe API functions
export const getNFTBalance = async (
  ownerAddress: string,
  apiKey: string
): Promise<NFTBalance> => {
  const response = await axios.get(
    `https://api.vybenetwork.xyz/account/nft-balance/${ownerAddress}`,
    {
      headers: { "x-api-key": apiKey },
    }
  );
  return response.data;
};

export const getWalletPnL = async (
  ownerAddress: string,
  apiKey: string
): Promise<ActualPnLData> => {
  const response = await axios.get(
    `https://api.vybenetwork.xyz/account/pnl/${ownerAddress}`,
    {
      headers: { "x-api-key": apiKey },
    }
  );
  return response.data;
};

export const getTokenBalance = async (
  ownerAddress: string,
  apiKey: string
): Promise<TokenBalance> => {
  const response = await axios.get(
    `https://api.vybenetwork.xyz/account/token-balance/${ownerAddress}`,
    {
      headers: { "x-api-key": apiKey },
    }
  );
  return response.data;
};

export const getTokenSummary = async (apiKey: string): Promise<Token[]> => {
  const response = await axios.get("https://api.vybenetwork.xyz/tokens", {
    headers: { "x-api-key": apiKey },
  });
  return response.data;
};
