# Vybe Network Bot

A Telegram bot for accessing real-time crypto insights and analytics from the Vybe Network.

## Features

- Check NFT balances for a wallet
- Get profit/loss analysis
- View token balances
- See top performing tokens
- Access AlphaVybe analytics platform

## Setup

### Prerequisites
- Node.js environment
- Telegram Bot Token
- Vybe API Key

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   VYBE_API_KEY=your_vybe_api_key
   ```
4. Start the bot:
   ```
   npm start
   ```

## Commands

| Command | Format | Description |
|---------|--------|-------------|
| `/start` | `/start` | Displays welcome message and available commands |
| `/nft` | `/nft <wallet>` | Checks NFT balances for the specified wallet |
| `/pnl` | `/pnl <wallet>` | Gets profit/loss analysis for the specified wallet |
| `/tokens` | `/tokens <wallet>` | Views token balances for the specified wallet |
| `/top` | `/top` | Shows top tokens based on performance |
| `/alphavybe` | `/alphavybe` | Provides link to AlphaVybe analytics website |

## Example Usage

```
/nft D8v6W...
```
Returns the NFT balance for the specified wallet address.

```
/pnl D8v6W...
```
Returns profit/loss analysis for the specified wallet address.

## API Integration

The bot integrates with the Vybe Network API to fetch data:
- NFT balances
- Wallet profit/loss
- Token balances
- Top token summaries

## Error Handling

The bot includes comprehensive error handling for:
- Missing environment variables
- API request failures
- General command execution errors

## Security

- API credentials are stored as environment variables
- Bot token and API key are never exposed in logs or responses

## Deployment

The bot is configured for webhook-based deployment with:
- Filtered update types (message, callback_query, inline_query)
- Pending update cleanup
- Graceful shutdown handlers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

