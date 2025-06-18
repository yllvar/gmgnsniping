# GMGN Trading Bot Dashboard

🚀 **Automated Solana memecoin sniping bot with real-time dashboard**

Built with GMGN's Collaborative Trading API for lightning-fast memecoin trading on Pump.fun.

<img width="1267" alt="Screenshot 2025-06-18 at 18 32 06" src="https://github.com/user-attachments/assets/8be03c1a-a21d-4f6c-bc3d-16d77c6f72b3" />

## ✨ Features

- 🎯 **Automated Trading** - Snipe new memecoins with configurable parameters
- 📊 **Real-time Dashboard** - Monitor trades, profits, and bot performance
- 🔍 **Token Watchlist** - Track potential trading opportunities
- 🚨 **Smart Alerts** - Get notified of trades and system events
- ⚙️ **Risk Management** - Configurable stop-loss and take-profit settings
- 🔒 **Security First** - Secure wallet integration and API handling


## 🔧 Environment Variables

Set these in your Vercel dashboard under **Settings → Environment Variables**:

```env
# Required - Wallet Configuration
WALLET_PRIVATE_KEY=your_base58_private_key_here
WALLET_ADDRESS=your_public_wallet_address_here

# Required - API Configuration  
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
SOLANA_RPC=https://api.mainnet-beta.solana.com
GMGN_API_HOST=https://gmgn.ai

# Optional - Trading Parameters (defaults provided)
MIN_LIQUIDITY=100
MAX_DEV_HOLDINGS=5
DEFAULT_AMOUNT=0.5
DEFAULT_SLIPPAGE=0.5
PRIORITY_FEE=0.002
```

## 🏃‍♂️ Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd gmgn-trading-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 🔒 Security Best Practices

### Wallet Security
- Use a **dedicated trading wallet** with limited funds
- Never share your private key
- Regularly rotate API tokens
- Monitor wallet activity

## 📊 API Endpoints

The dashboard includes several API routes:

- `GET /api/bot/status` - Bot status and metrics
- `POST /api/bot/toggle` - Start/stop bot
- `GET /api/trades/recent` - Recent trade history
- `POST /api/trades/execute` - Execute manual trade
- `GET /api/watchlist` - Token watchlist
- `GET /api/config` - Bot configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Blockchain**: Solana Web3.js
- **Deployment**: Vercel
- **APIs**: GMGN Solana Trading API

## 📈 Performance

- **Sub-second trade execution** via GMGN API
- **Real-time updates** with optimized polling
- **Responsive design** for desktop and mobile
- **Serverless architecture** for automatic scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Disclaimer

This bot is for educational purposes. Cryptocurrency trading involves significant risk. Only trade with funds you can afford to lose. The developers are not responsible for any financial losses.

## 📄 License

MIT License - see LICENSE file for details.

