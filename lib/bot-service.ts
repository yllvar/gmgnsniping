import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js"

// Types
export interface BotStatus {
  isRunning: boolean
  lastActivity: string
  walletAddress: string
  walletBalance: number
  activePositions: number
}

export interface BotMetrics {
  totalTrades: number
  successfulTrades: number
  totalProfit: number
  totalVolume: number
  avgProfitPerTrade: number
  winRate: number
  todayTrades: number
  todayProfit: number
}

export interface Trade {
  id: string
  tokenName: string
  tokenAddress: string
  amount: number
  profit: number
  profitPercent: number
  timestamp: string
  status: "success" | "failed" | "pending"
  txHash: string
  entryPrice?: number
  exitPrice?: number
  slippage?: number
}

export interface WatchedToken {
  id: string
  name: string
  address: string
  price: number
  change24h: number
  liquidity: number
  marketCap: number
  holders: number
  isEligible: boolean
  addedAt: string
}

export interface BotConfig {
  minLiquidity: number
  maxDevHoldings: number
  defaultAmount: number
  defaultSlippage: number
  priorityFee: number
  autoTrade: boolean
  maxDailyTrades: number
  stopLossPercent: number
  takeProfitPercent: number
}

export interface Alert {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

// In-memory storage (replace with database in production)
const botState = {
  isRunning: false,
  lastActivity: new Date().toISOString(),
  trades: [] as Trade[],
  watchlist: [] as WatchedToken[],
  alerts: [] as Alert[],
  config: {
    minLiquidity: 100,
    maxDevHoldings: 5,
    defaultAmount: 0.5,
    defaultSlippage: 50,
    priorityFee: 0.002,
    autoTrade: true,
    maxDailyTrades: 20,
    stopLossPercent: 20,
    takeProfitPercent: 300,
  } as BotConfig,
}

// Initialize with some mock data
if (botState.trades.length === 0) {
  botState.trades = [
    {
      id: "1",
      tokenName: "PEPE2.0",
      tokenAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      amount: 0.5,
      profit: 1.25,
      profitPercent: 250,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      status: "success",
      txHash: "5j7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9",
      entryPrice: 0.000001,
      exitPrice: 0.0000035,
      slippage: 12.5,
    },
    {
      id: "2",
      tokenName: "DOGE KILLER",
      tokenAddress: "9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      amount: 1.0,
      profit: -0.15,
      profitPercent: -15,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: "failed",
      txHash: "4i6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z",
      entryPrice: 0.000002,
      exitPrice: 0.0000017,
      slippage: 45.2,
    },
  ]

  botState.watchlist = [
    {
      id: "1",
      name: "BONK",
      address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      price: 0.000012,
      change24h: 15.6,
      liquidity: 245.8,
      marketCap: 890000,
      holders: 12450,
      isEligible: true,
      addedAt: new Date().toISOString(),
    },
  ]

  botState.alerts = [
    {
      id: "1",
      type: "success",
      title: "Successful Trade",
      message: "PEPE2.0 trade completed with +250% profit (1.25 SOL)",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ]
}

// Solana connection
const connection = new Connection(process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com", "confirmed")

const API_HOST = "https://gmgn.ai"

// Bot service functions
export async function getBotStatus(): Promise<BotStatus> {
  try {
    // Get wallet balance if wallet address is configured
    let walletBalance = 0
    if (process.env.WALLET_PRIVATE_KEY) {
      // In production, you'd derive the public key from private key
      // For now, using a placeholder
      const walletAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
      try {
        const publicKey = new PublicKey(walletAddress)
        const balance = await connection.getBalance(publicKey)
        walletBalance = balance / 1e9 // Convert lamports to SOL
      } catch (error) {
        console.warn("Could not fetch wallet balance:", error)
      }
    }

    return {
      isRunning: botState.isRunning,
      lastActivity: botState.lastActivity,
      walletAddress: process.env.WALLET_ADDRESS || "Not configured",
      walletBalance,
      activePositions: botState.trades.filter((t) => t.status === "pending").length,
    }
  } catch (error) {
    console.error("Error getting bot status:", error)
    throw error
  }
}

export async function getBotMetrics(): Promise<BotMetrics> {
  const trades = botState.trades
  const successfulTrades = trades.filter((t) => t.status === "success")
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0)
  const totalVolume = trades.reduce((sum, t) => sum + t.amount, 0)

  // Today's trades (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const todayTrades = trades.filter((t) => new Date(t.timestamp) > oneDayAgo)
  const todayProfit = todayTrades.reduce((sum, t) => sum + t.profit, 0)

  return {
    totalTrades: trades.length,
    successfulTrades: successfulTrades.length,
    totalProfit,
    totalVolume,
    avgProfitPerTrade: trades.length > 0 ? totalProfit / trades.length : 0,
    winRate: trades.length > 0 ? (successfulTrades.length / trades.length) * 100 : 0,
    todayTrades: todayTrades.length,
    todayProfit,
  }
}

export async function toggleBot(action: "start" | "stop"): Promise<void> {
  botState.isRunning = action === "start"
  botState.lastActivity = new Date().toISOString()

  // Add alert for bot status change
  const alert: Alert = {
    id: Date.now().toString(),
    type: "info",
    title: `Bot ${action === "start" ? "Started" : "Stopped"}`,
    message: `Trading bot has been ${action === "start" ? "started" : "stopped"} at ${new Date().toLocaleTimeString()}`,
    timestamp: new Date().toISOString(),
    isRead: false,
  }

  botState.alerts.unshift(alert)

  // Keep only last 50 alerts
  if (botState.alerts.length > 50) {
    botState.alerts = botState.alerts.slice(0, 50)
  }
}

export async function getRecentTrades(limit = 20, offset = 0): Promise<Trade[]> {
  return botState.trades
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(offset, offset + limit)
}

export async function getTradeStats(period: string) {
  const now = new Date()
  let startDate: Date

  switch (period) {
    case "1h":
      startDate = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case "24h":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }

  const periodTrades = botState.trades.filter((t) => new Date(t.timestamp) >= startDate)
  const successfulTrades = periodTrades.filter((t) => t.status === "success")
  const totalProfit = periodTrades.reduce((sum, t) => sum + t.profit, 0)

  return {
    totalTrades: periodTrades.length,
    successfulTrades: successfulTrades.length,
    totalProfit,
    winRate: periodTrades.length > 0 ? (successfulTrades.length / periodTrades.length) * 100 : 0,
    avgProfit: periodTrades.length > 0 ? totalProfit / periodTrades.length : 0,
  }
}

export async function getWatchlist(): Promise<WatchedToken[]> {
  // In production, you'd also fetch current prices and update eligibility
  return botState.watchlist
}

export async function addToWatchlist(tokenAddress: string, tokenName?: string): Promise<WatchedToken> {
  // Check if token already exists
  const existing = botState.watchlist.find((t) => t.address === tokenAddress)
  if (existing) {
    throw new Error("Token already in watchlist")
  }

  // In production, you'd fetch token data from an API
  const token: WatchedToken = {
    id: Date.now().toString(),
    name: tokenName || "Unknown Token",
    address: tokenAddress,
    price: 0,
    change24h: 0,
    liquidity: 0,
    marketCap: 0,
    holders: 0,
    isEligible: false,
    addedAt: new Date().toISOString(),
  }

  botState.watchlist.push(token)
  return token
}

export async function removeFromWatchlist(tokenId: string): Promise<void> {
  botState.watchlist = botState.watchlist.filter((t) => t.id !== tokenId)
}

export async function getBotConfig(): Promise<BotConfig> {
  return { ...botState.config }
}

export async function updateBotConfig(config: Partial<BotConfig>): Promise<BotConfig> {
  botState.config = { ...botState.config, ...config }

  // Add alert for config update
  const alert: Alert = {
    id: Date.now().toString(),
    type: "info",
    title: "Configuration Updated",
    message: "Bot configuration has been updated successfully",
    timestamp: new Date().toISOString(),
    isRead: false,
  }

  botState.alerts.unshift(alert)

  return { ...botState.config }
}

export async function getAlerts(): Promise<Alert[]> {
  return botState.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function markAlertAsRead(alertId: string): Promise<void> {
  const alert = botState.alerts.find((a) => a.id === alertId)
  if (alert) {
    alert.isRead = true
  }
}

export async function markAllAlertsAsRead(): Promise<void> {
  botState.alerts.forEach((alert) => {
    alert.isRead = true
  })
}

// GMGN Trading Functions
export async function executeTrade(tokenAddress: string, amount: number, slippage = 0.5): Promise<string | null> {
  try {
    // Step 1: Get swap route from GMGN
    const quoteUrl = `${API_HOST}/defi/router/v1/sol/tx/get_swap_route?token_in_address=So11111111111111111111111111111111111111112&token_out_address=${tokenAddress}&in_amount=${amount}&from_address=${process.env.WALLET_ADDRESS}&slippage=${slippage}`

    const response = await fetch(quoteUrl)
    const route = await response.json()

    if (!route.success || !route.data?.raw_tx?.swapTransaction) {
      throw new Error(`Failed to get swap route: ${route.message || "Unknown error"}`)
    }

    // Step 2: Deserialize and sign transaction
    const swapTransactionBuf = Buffer.from(route.data.raw_tx.swapTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

    // In production, you'd sign with actual wallet
    // transaction.sign([wallet])

    // Step 3: Serialize signed transaction
    const serializedTx = transaction.serialize({ requireAllSignatures: false }) // Set to false for demo
    const signedTx = Buffer.from(serializedTx).toString("base64")

    // Step 4: Submit transaction via GMGN API
    const submitUrl = `${API_HOST}/defi/router/v1/sol/tx/submit`
    const submitResponse = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx: signedTx,
        priorityFee: 0.002, // Minimum 0.002 SOL priority fee
      }),
    })

    const result = await submitResponse.json()

    if (result.success) {
      return result.data.signature
    } else {
      throw new Error(`Transaction submission failed: ${result.message}`)
    }
  } catch (error) {
    console.error(`Error executing trade for ${tokenAddress}:`, error)
    return null
  }
}

export async function checkTokenEligibility(
  tokenAddress: string,
): Promise<{ eligible: boolean; liquidity: number; devHoldings: number }> {
  try {
    // Use GMGN's token info endpoint (if available)
    const tokenInfoUrl = `${API_HOST}/defi/sol/${tokenAddress}/info`
    const response = await fetch(tokenInfoUrl)

    if (!response.ok) {
      // Fallback to mock data for demo
      return {
        eligible: Math.random() > 0.3, // 70% eligible for demo
        liquidity: 50 + Math.random() * 200,
        devHoldings: Math.random() * 10,
      }
    }

    const tokenInfo = await response.json()
    const liquidity = tokenInfo.data?.liquidity || 0
    const devHoldings = tokenInfo.data?.dev_wallet_percentage || 0

    return {
      eligible: liquidity > 100 && devHoldings < 5,
      liquidity,
      devHoldings,
    }
  } catch (error) {
    console.error(`Error checking eligibility for ${tokenAddress}:`, error)
    return { eligible: false, liquidity: 0, devHoldings: 100 }
  }
}

// Simulate new trades (for demo purposes)
export function simulateNewTrade() {
  const tokens = ["BONK", "PEPE", "WIF", "MYRO", "BOME"]
  const token = tokens[Math.floor(Math.random() * tokens.length)]
  const amount = 0.1 + Math.random() * 2
  const profitPercent = (Math.random() - 0.3) * 500 // -150% to +350%
  const profit = amount * (profitPercent / 100)

  const trade: Trade = {
    id: Date.now().toString(),
    tokenName: token,
    tokenAddress: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    amount,
    profit,
    profitPercent,
    timestamp: new Date().toISOString(),
    status: profit > 0 ? "success" : "failed",
    txHash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    entryPrice: Math.random() * 0.001,
    exitPrice: Math.random() * 0.001,
    slippage: Math.random() * 50,
  }

  botState.trades.unshift(trade)

  // Keep only last 100 trades
  if (botState.trades.length > 100) {
    botState.trades = botState.trades.slice(0, 100)
  }

  // Add alert for new trade
  const alert: Alert = {
    id: Date.now().toString(),
    type: profit > 0 ? "success" : "error",
    title: profit > 0 ? "Successful Trade" : "Trade Loss",
    message: `${token} trade completed with ${profit > 0 ? "+" : ""}${profitPercent.toFixed(1)}% (${profit > 0 ? "+" : ""}${profit.toFixed(3)} SOL)`,
    timestamp: new Date().toISOString(),
    isRead: false,
  }

  botState.alerts.unshift(alert)

  botState.lastActivity = new Date().toISOString()
}
