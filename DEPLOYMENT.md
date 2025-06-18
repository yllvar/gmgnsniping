# 🚀 Vercel Deployment Guide

## Quick Start

### Method 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/gmgn-trading-bot)

1. Click the deploy button
2. Connect your GitHub account
3. Set environment variables
4. Deploy!

### Method 2: Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
\`\`\`

### Method 3: GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Enable automatic deployments

## 🔧 Environment Variables Setup

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WALLET_PRIVATE_KEY` | Base58 encoded private key | `your_private_key_here` |
| `WALLET_ADDRESS` | Public wallet address | `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `SOLANA_RPC` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `GMGN_API_HOST` | GMGN API base URL | `https://gmgn.ai` |

### Optional Variables (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `MIN_LIQUIDITY` | `100` | Minimum liquidity in SOL |
| `MAX_DEV_HOLDINGS` | `5` | Max dev holdings percentage |
| `DEFAULT_AMOUNT` | `0.5` | Default trade amount in SOL |
| `DEFAULT_SLIPPAGE` | `0.5` | Default slippage (50%) |
| `PRIORITY_FEE` | `0.002` | Priority fee in SOL |

## 🔒 Security Configuration

### Environment Variable Security
- All variables are encrypted at rest
- Only accessible during build and runtime
- Never exposed to client-side code
- Separate environments for development/production

### Wallet Security
- Use a dedicated trading wallet
- Limit funds to acceptable risk level
- Regularly monitor transactions
- Consider hardware wallet integration

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable Web Analytics in project settings
- Monitor page views and performance
- Track user interactions

### Function Monitoring
- View API function logs in Vercel dashboard
- Monitor response times and errors
- Set up alerts for failures

## 🚀 Performance Optimization

### Automatic Optimizations
- ✅ Edge caching for static assets
- ✅ Image optimization
- ✅ Code splitting
- ✅ Compression

### Custom Optimizations
- API route caching for frequently accessed data
- Optimized bundle size
- Lazy loading for components

## 🔄 Continuous Deployment

### Automatic Deployments
- **Production**: Deploys on push to `main` branch
- **Preview**: Deploys on pull requests
- **Development**: Local development with `npm run dev`

### Branch Strategy
\`\`\`
main (production) ← merge from develop
├── develop (staging)
├── feature/new-feature
└── hotfix/urgent-fix
\`\`\`

## 🛠️ Troubleshooting

### Common Issues

**Build Failures**
\`\`\`bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run type-check  # Fix TypeScript errors
npm run lint        # Fix linting issues
\`\`\`

**Environment Variables Not Working**
- Verify variable names match exactly
- Check for typos in variable values
- Ensure variables are set for correct environment
- Redeploy after adding new variables

**API Route Timeouts**
- Vercel functions have 10s timeout on Hobby plan
- Optimize API calls and database queries
- Consider upgrading to Pro plan for 60s timeout

### Getting Help

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **GitHub Issues**: Report bugs and feature requests
3. **Community Discord**: Get help from other developers

## 📈 Scaling Considerations

### Traffic Growth
- Vercel automatically scales serverless functions
- No server management required
- Pay only for actual usage

### Database Considerations
- Consider adding Redis for caching
- Use Vercel's database integrations
- Implement proper error handling

## 💰 Cost Optimization

### Hobby Plan (Free)
- Perfect for development and testing
- 100GB bandwidth per month
- Serverless function executions included

### Pro Plan ($20/month)
- Production applications
- Custom domains
- Advanced analytics
- Priority support

---

**🎯 Your GMGN trading bot is now ready for production on Vercel!**
